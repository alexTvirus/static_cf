// ============================================================
//  FarmOccupySystem.cs
//  Dựa trên sg2_max.js – reverse-engineered protocol
//
//  Chức năng:
//    1. GetFarmListAsync         – lấy danh sách tất cả ruộng trong khu vực
//    2. GetMyFarmsAsync          – lấy ruộng đang sở hữu + thời gian còn lại
//    3. CheckFarmStatus          – kiểm tra farmLand token, số ruộng tối đa
//    4. OccupyFarmAsync          – chiếm 1 ruộng theo farmId + roleId
//    5. DropFarmAsync            – bỏ 1 ruộng
//    6. HarvestFarmAsync         – thu hoạch 1 ruộng
//    7. AutoOccupyFarmsAsync     – flow tổng hợp tự động:
//                                   ưu tiên NPC → sau mới đến người chơi
//
//  Wire formats (Big-Endian, từ sg2_max.js):
//
//  ── LẤY DANH SÁCH RUỘNG ────────────────────────────────────
//  CG_FARM_LIST     11703  header-only [4B]
//  GC_FARM_LIST     11704  [4B technology]
//                          [2B count] × FarmBean {
//                              [4B farmId]
//                              [8B roleId Long]   ← "0"/null = NPC/trống
//                              [Str roleFlag]     ← cờ quốc gia chủ ruộng
//                              [Str roleName]     ← tên chủ ruộng
//                              [4B roleLevel]
//                              [Str start]        ← timestamp bắt đầu (ms string)
//                              [4B remain]        ← giây còn lại của ruộng
//                              [4B output]        ← lúa/phút
//                              [4B canAttack]     ← 0=Chiếm được | 1=Đủ ruộng rồi
//                          }                        2=Thiếu Quân Lệnh | 3=Không thể
//
//  ── RUỘNG ĐANG SỞ HỮU ────────────────────────────────────
//  GC_FARM_STANDING_LIST  11705  (server push khi cập nhật)
//                                [2B count] × FarmStandingBean {
//                                    [4B farmId]
//                                    [8B remainTime Long]  ← ms còn lại
//                                }
//
//  ── CHIẾM RUỘNG ─────────────────────────────────────────
//  CG_FARM_ATTACK   11700  [4B farmId][8B roleId Long]
//                          roleId = roleId của chủ ruộng (từ FarmBean.roleId)
//                          roleId = 0 nếu là ruộng NPC/trống
//  → Response: server push GC_FARM_LIST (11704) + GC_FARM_STANDING_LIST (11705)
//              + GC_SEND_WAR_REPORT (11900) nếu là ruộng người chơi (có trận đánh)
//
//  ── BỎ RUỘNG ────────────────────────────────────────────
//  CG_FARM_DROP     11701  [4B farmId]
//
//  ── THU HOẠCH ───────────────────────────────────────────
//  CG_FARM_HARVEST  11702  [4B farmId]       ← 1 ruộng
//  CG_HARVEST_FARMS 12612  [4B farmId=0?]    ← thu hoạch tất cả (farmId thường =0)
//
//  ── canAttack VALUES ─────────────────────────────────────
//  0 = Có thể chiếm   (FIRE_FOR_FIELD)
//  1 = Đã đủ số ruộng  (FIELD_NUM_FULL)  ← đã chiếm tối đa
//  2 = Thiếu Quân Lệnh (JUNLING_NOT_ENOUGH)
//  3 = Không thể chiếm (CANT_FIRE)
//
//  ── NPC vs NGƯỜI CHƠI ────────────────────────────────────
//  FarmBean.roleId == null || == "0" (Long=0) → NPC/ruộng trống → không tốn Quân Lệnh
//  FarmBean.roleId != 0              → ruộng người chơi → cần Quân Lệnh (warToken)
//
//  ── farmLand TOKEN (lượt chiếm miễn phí) ─────────────────
//  Lấy từ GC_SEND_ROLE_INFO (10211) field farmLand (Int)
//  farmLand > 0 → còn lượt chiếm miễn phí hôm nay
//  Server push cập nhật qua GC_EVENT_SETFARMLAND (10527) field num
// ============================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sg2Bot
{
    // ──────────────────────────────────────────────────────────────
    // Data objects
    // ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Thông tin 1 ruộng từ GC_FARM_LIST (11704).
    /// </summary>
    public class FarmBean
    {
        public int    FarmId    { get; set; }
        public long   RoleId    { get; set; }   // 0 = NPC/trống
        public string RoleFlag  { get; set; }   // cờ quốc gia
        public string RoleName  { get; set; }   // tên chủ ruộng
        public int    RoleLevel { get; set; }
        public string Start     { get; set; }   // timestamp ms string
        public int    Remain    { get; set; }   // giây còn lại
        public int    Output    { get; set; }   // lúa/phút
        public int    CanAttack { get; set; }   // 0=được chiếm, 1/2/3=không

        // ── Convenience properties ──────────────────────────────
        /// <summary>Ruộng NPC/trống: roleId == null hoặc == 0</summary>
        public bool IsNpc    => RoleId == 0;

        /// <summary>Ruộng người chơi</summary>
        public bool IsPlayer => RoleId != 0;

        /// <summary>Hiện không có chủ (NPC/trống)</summary>
        public bool IsEmpty  => IsNpc && string.IsNullOrEmpty(RoleName);

        /// <summary>Có thể chiếm ngay (canAttack == 0)</summary>
        public bool CanOccupy => CanAttack == 0;

        public string CanAttackDescription => CanAttack switch {
            0 => "✅ Có thể chiếm",
            1 => "❌ Đã đủ số ruộng tối đa",
            2 => "❌ Thiếu Quân Lệnh (warToken)",
            3 => "❌ Không thể chiếm",
            _ => $"❓ Không xác định ({CanAttack})"
        };

        public string OwnerDescription =>
            IsNpc ? "[NPC]" : $"{RoleName} (Lv{RoleLevel}, nation={RoleFlag})";
    }

    /// <summary>
    /// Ruộng đang sở hữu từ GC_FARM_STANDING_LIST (11705).
    /// </summary>
    public class FarmStandingBean
    {
        public int  FarmId     { get; set; }
        public long RemainTime { get; set; }   // ms còn lại

        public TimeSpan RemainTimeSpan => TimeSpan.FromMilliseconds(RemainTime);

        public string RemainDisplay
        {
            get
            {
                var ts = RemainTimeSpan;
                return ts.TotalSeconds <= 0
                    ? "Sẵn sàng thu hoạch"
                    : $"{(int)ts.TotalHours:D2}:{ts.Minutes:D2}:{ts.Seconds:D2}";
            }
        }
    }

    /// <summary>Snapshot kết quả lấy danh sách ruộng.</summary>
    public class FarmListSnapshot
    {
        public int              Technology { get; set; }
        public List<FarmBean>   Farms      { get; set; } = new();

        // Filters
        public List<FarmBean> NpcFarms       => Farms.Where(f => f.IsNpc).ToList();
        public List<FarmBean> PlayerFarms    => Farms.Where(f => f.IsPlayer).ToList();
        public List<FarmBean> OccupyableFarms=> Farms.Where(f => f.CanOccupy).ToList();
        public List<FarmBean> NpcOccupyable  => Farms.Where(f => f.IsNpc && f.CanOccupy).ToList();
        public List<FarmBean> PlayerOccupyable=> Farms.Where(f => f.IsPlayer && f.CanOccupy).ToList();
        public int            TotalCount    => Farms.Count;
        public bool           IsFull        => Farms.Any(f => f.CanAttack == 1);

        public void Print()
        {
            Console.WriteLine($"\n[FarmList] Technology={Technology} | Tổng={TotalCount}");
            Console.WriteLine($"  NPC={NpcFarms.Count} | Người chơi={PlayerFarms.Count}");
            Console.WriteLine($"  Có thể chiếm={OccupyableFarms.Count} " +
                $"(NPC={NpcOccupyable.Count}, Player={PlayerOccupyable.Count})");
            foreach (var f in Farms)
            {
                string own = f.IsNpc ? "[NPC]" : $"[{f.RoleName} Lv{f.RoleLevel}]";
                Console.WriteLine($"  farmId={f.FarmId} | {own} | remain={f.Remain}s " +
                    $"| output={f.Output}/min | {f.CanAttackDescription}");
            }
        }
    }

    /// <summary>Trạng thái kiểm tra trước khi chiếm ruộng.</summary>
    public class FarmCheckResult
    {
        public int  FarmLandToken     { get; set; }    // lượt chiếm miễn phí
        public int  WarToken          { get; set; }    // Quân Lệnh còn lại
        public int  MyFarmCount       { get; set; }    // số ruộng đang chiếm
        public bool HasFreeToken      => FarmLandToken > 0;
        public bool HasWarToken       => WarToken > 0;
        public bool CanOccupyAnything => HasFreeToken || HasWarToken;

        public void Print()
        {
            Console.WriteLine($"\n[FarmCheck]");
            Console.WriteLine($"  farmLand token (lượt miễn phí) = {FarmLandToken}");
            Console.WriteLine($"  warToken (Quân Lệnh)           = {WarToken}");
            Console.WriteLine($"  Ruộng đang chiếm               = {MyFarmCount}");
            Console.WriteLine($"  Còn có thể chiếm               = {CanOccupyAnything}");
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Main automation class
    // ──────────────────────────────────────────────────────────────

    public class FarmOccupySystem
    {
        private readonly IConnection  _conn;
        private readonly MessageReader _reader;

        // Timeouts
        private static readonly TimeSpan FarmListTimeout   = TimeSpan.FromSeconds(10);
        private static readonly TimeSpan OccupyTimeout     = TimeSpan.FromSeconds(15);
        private static readonly TimeSpan HarvestTimeout    = TimeSpan.FromSeconds(10);

        public FarmOccupySystem(IConnection conn, MessageReader reader)
        {
            _conn   = conn;
            _reader = reader;
        }

        // ──────────────────────────────────────────────────────────
        // 1. Lấy danh sách ruộng
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Lấy danh sách tất cả ruộng trong khu vực hiện tại.
        /// Gửi CG_FARM_LIST (11703) → chờ GC_FARM_LIST (11704).
        /// </summary>
        public async Task<FarmListSnapshot> GetFarmListAsync()
        {
            // ── CG_FARM_LIST 11703 header-only ──────────────────
            var buf = new byte[4];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, 4);
            MessageWriter.WriteShort(buf, ref pos, 11703);

            using var cts = new System.Threading.CancellationTokenSource(FarmListTimeout);
            _conn.Send(buf);

            var msg = await _reader.WaitForMessageAsync(11704, cts.Token);
            return ParseFarmList(msg);
        }

        private FarmListSnapshot ParseFarmList(byte[] data)
        {
            // GC_FARM_LIST 11704:
            // [2B len][2B 11704][4B technology][2B count] × FarmBean
            int pos = 4;
            var snapshot = new FarmListSnapshot
            {
                Technology = MessageReader.ReadInt(data, ref pos)
            };

            int count = MessageReader.ReadShort(data, ref pos);
            for (int i = 0; i < count; i++)
            {
                var farm = new FarmBean
                {
                    FarmId    = MessageReader.ReadInt(data, ref pos),
                    RoleId    = MessageReader.ReadLong(data, ref pos),
                    RoleFlag  = MessageReader.ReadString(data, ref pos),
                    RoleName  = MessageReader.ReadString(data, ref pos),
                    RoleLevel = MessageReader.ReadInt(data, ref pos),
                    Start     = MessageReader.ReadString(data, ref pos),
                    Remain    = MessageReader.ReadInt(data, ref pos),
                    Output    = MessageReader.ReadInt(data, ref pos),
                    CanAttack = MessageReader.ReadInt(data, ref pos),
                };
                snapshot.Farms.Add(farm);
            }
            return snapshot;
        }

        // ──────────────────────────────────────────────────────────
        // 2. Lấy danh sách ruộng đang sở hữu
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Lấy danh sách ruộng đang sở hữu + thời gian còn lại.
        /// Server push GC_FARM_STANDING_LIST (11705) sau CG_FARM_LIST (11703).
        /// </summary>
        public async Task<List<FarmStandingBean>> GetMyFarmsAsync()
        {
            // Gửi 11703, chờ cả 11704 VÀ 11705
            var buf = new byte[4];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, 4);
            MessageWriter.WriteShort(buf, ref pos, 11703);

            using var cts = new System.Threading.CancellationTokenSource(FarmListTimeout);
            _conn.Send(buf);

            // Chờ GC_FARM_STANDING_LIST (11705) - server thường gửi kèm 11704
            var msg = await _reader.WaitForMessageAsync(11705, cts.Token);
            return ParseMyFarms(msg);
        }

        private List<FarmStandingBean> ParseMyFarms(byte[] data)
        {
            // GC_FARM_STANDING_LIST 11705:
            // [2B len][2B 11705][2B count] × {[4B farmId][8B remainTime Long]}
            int pos = 4;
            int count = MessageReader.ReadShort(data, ref pos);
            var list = new List<FarmStandingBean>(count);
            for (int i = 0; i < count; i++)
            {
                list.Add(new FarmStandingBean
                {
                    FarmId     = MessageReader.ReadInt(data, ref pos),
                    RemainTime = MessageReader.ReadLong(data, ref pos),
                });
            }
            return list;
        }

        // ──────────────────────────────────────────────────────────
        // 3. Kiểm tra trạng thái trước khi chiếm
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Kiểm tra tổng hợp:
        ///  - farmLand token (lượt chiếm miễn phí): từ roleVO.farmLand
        ///  - warToken (Quân Lệnh): từ roleVO.warToken
        ///  - số ruộng đang chiếm: từ GC_FARM_STANDING_LIST
        ///
        /// roleVO được truyền vào từ caller (đã có từ GC_SEND_ROLE_INFO 10211).
        /// </summary>
        public async Task<FarmCheckResult> CheckFarmStatusAsync(int farmLand, int warToken)
        {
            var myFarms = await GetMyFarmsAsync();

            return new FarmCheckResult
            {
                FarmLandToken = farmLand,
                WarToken      = warToken,
                MyFarmCount   = myFarms.Count,
            };
        }

        // ──────────────────────────────────────────────────────────
        // 4. Chiếm ruộng
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Chiếm 1 ruộng.
        /// Gửi CG_FARM_ATTACK (11700) [4B farmId][8B roleId].
        /// roleId = farmBean.RoleId (0 nếu NPC, roleId người chơi nếu player).
        ///
        /// Server response:
        ///  - Ruộng NPC/trống : push GC_FARM_LIST (11704) + GC_FARM_STANDING_LIST (11705)
        ///  - Ruộng người chơi: push GC_SEND_WAR_REPORT (11900) + rồi 11704 + 11705
        ///
        /// Hàm chờ GC_FARM_LIST (11704) làm xác nhận.
        /// </summary>
        public async Task<FarmListSnapshot> OccupyFarmAsync(FarmBean farm)
        {
            if (!farm.CanOccupy)
            {
                Console.WriteLine($"[Farm] Không thể chiếm farmId={farm.FarmId}: " +
                    $"{farm.CanAttackDescription}");
                throw new InvalidOperationException(
                    $"canAttack={farm.CanAttack}: {farm.CanAttackDescription}");
            }

            string ownerDesc = farm.IsNpc
                ? "NPC (không tốn Quân Lệnh)"
                : $"người chơi {farm.RoleName} Lv{farm.RoleLevel} (tốn Quân Lệnh)";

            Console.WriteLine($"[Farm] Đang chiếm farmId={farm.FarmId} | Chủ: {ownerDesc}...");

            // ── CG_FARM_ATTACK 11700 ─────────────────────────────
            // [2B len][2B 11700][4B farmId][8B roleId]
            var buf = new byte[16];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, (short)buf.Length);
            MessageWriter.WriteShort(buf, ref pos, 11700);
            MessageWriter.WriteInt(buf, ref pos, farm.FarmId);
            MessageWriter.WriteLong(buf, ref pos, farm.RoleId);

            using var cts = new System.Threading.CancellationTokenSource(OccupyTimeout);
            _conn.Send(buf);

            // Chờ server refresh farm list (GC_FARM_LIST 11704)
            var msg = await _reader.WaitForMessageAsync(11704, cts.Token);
            var updated = ParseFarmList(msg);

            Console.WriteLine($"[Farm] ✓ Chiếm farmId={farm.FarmId} thành công!");
            return updated;
        }

        // ──────────────────────────────────────────────────────────
        // 5. Bỏ ruộng
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Bỏ 1 ruộng đang sở hữu.
        /// Gửi CG_FARM_DROP (11701) [4B farmId].
        /// </summary>
        public async Task DropFarmAsync(int farmId)
        {
            Console.WriteLine($"[Farm] Bỏ ruộng farmId={farmId}...");

            // ── CG_FARM_DROP 11701 ───────────────────────────────
            // [2B len][2B 11701][4B farmId]
            var buf = new byte[8];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, (short)buf.Length);
            MessageWriter.WriteShort(buf, ref pos, 11701);
            MessageWriter.WriteInt(buf, ref pos, farmId);

            using var cts = new System.Threading.CancellationTokenSource(HarvestTimeout);
            _conn.Send(buf);

            // Chờ server refresh 11704
            await _reader.WaitForMessageAsync(11704, cts.Token);
            Console.WriteLine($"[Farm] ✓ Đã bỏ ruộng farmId={farmId}.");
        }

        // ──────────────────────────────────────────────────────────
        // 6. Thu hoạch ruộng
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Thu hoạch 1 ruộng cụ thể.
        /// Gửi CG_FARM_HARVEST (11702) [4B farmId].
        /// </summary>
        public async Task HarvestFarmAsync(int farmId)
        {
            Console.WriteLine($"[Farm] Thu hoạch farmId={farmId}...");

            // ── CG_FARM_HARVEST 11702 ────────────────────────────
            var buf = new byte[8];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, (short)buf.Length);
            MessageWriter.WriteShort(buf, ref pos, 11702);
            MessageWriter.WriteInt(buf, ref pos, farmId);

            _conn.Send(buf);
            await Task.Delay(500); // cho server xử lý
            Console.WriteLine($"[Farm] ✓ Đã gửi lệnh thu hoạch farmId={farmId}.");
        }

        /// <summary>
        /// Thu hoạch tất cả ruộng đang sở hữu.
        /// Gửi CG_HARVEST_FARMS (12612) [4B farmId=0].
        /// </summary>
        public async Task HarvestAllFarmsAsync()
        {
            Console.WriteLine("[Farm] Thu hoạch tất cả ruộng...");

            // ── CG_HARVEST_FARMS 12612 ───────────────────────────
            var buf = new byte[8];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, (short)buf.Length);
            MessageWriter.WriteShort(buf, ref pos, 12612);
            MessageWriter.WriteInt(buf, ref pos, 0); // farmId=0 = tất cả

            _conn.Send(buf);
            await Task.Delay(500);
            Console.WriteLine("[Farm] ✓ Đã gửi lệnh thu hoạch tất cả ruộng.");
        }

        // ──────────────────────────────────────────────────────────
        // 7. AutoOccupyFarmsAsync – flow tổng hợp tự động
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Flow tự động chiếm ruộng đầy đủ:
        ///
        ///  1. Lấy danh sách ruộng (11703 → 11704)
        ///  2. Kiểm tra farmLand token + warToken + số ruộng hiện tại
        ///  3. Ưu tiên chiếm ruộng NPC (không tốn Quân Lệnh)
        ///     → rồi mới đến ruộng người chơi (tốn Quân Lệnh, nếu occupyPlayer=true)
        ///  4. Chiếm từng ruộng, delay giữa các lần
        ///  5. Log kết quả
        ///
        /// Tham số:
        ///   farmLand       = roleVO.farmLand   (lượt chiếm miễn phí)
        ///   warToken       = roleVO.warToken   (Quân Lệnh)
        ///   occupyPlayer   = true → cũng chiếm ruộng người chơi (tốn Quân Lệnh)
        ///   maxOccupy      = số ruộng tối đa muốn chiếm trong lần này (-1 = không giới hạn)
        ///   delayMs        = delay giữa các lần chiếm (tránh spam)
        /// </summary>
        public async Task<int> AutoOccupyFarmsAsync(
            int  farmLand,
            int  warToken,
            bool occupyPlayer = false,
            int  maxOccupy    = -1,
            int  delayMs      = 1000)
        {
            Console.WriteLine("\n[Farm] ===== AutoOccupyFarms bắt đầu =====");
            Console.WriteLine($"  farmLand token = {farmLand}");
            Console.WriteLine($"  warToken       = {warToken}");
            Console.WriteLine($"  occupyPlayer   = {occupyPlayer}");
            Console.WriteLine($"  maxOccupy      = {(maxOccupy < 0 ? "không giới hạn" : maxOccupy.ToString())}");

            // Step 1: Lấy danh sách ruộng
            var snapshot = await GetFarmListAsync();
            snapshot.Print();

            if (!snapshot.OccupyableFarms.Any())
            {
                Console.WriteLine("[Farm] Không có ruộng nào có thể chiếm.");
                return 0;
            }

            // Step 2: Kiểm tra token
            if (!snapshot.IsFull && farmLand == 0 && warToken == 0)
            {
                Console.WriteLine("[Farm] Không còn lượt chiếm (farmLand=0, warToken=0). Dừng.");
                return 0;
            }

            // Step 3: Sắp xếp danh sách chiếm
            // Ưu tiên: NPC trước, rồi player; trong cùng loại: output cao hơn trước
            var targets = new List<FarmBean>();

            // NPC farms (không tốn Quân Lệnh)
            targets.AddRange(snapshot.NpcOccupyable
                .OrderByDescending(f => f.Output));

            // Player farms (chỉ nếu occupyPlayer=true và có warToken)
            if (occupyPlayer && warToken > 0)
            {
                targets.AddRange(snapshot.PlayerOccupyable
                    .OrderByDescending(f => f.Output));
            }

            if (!targets.Any())
            {
                Console.WriteLine("[Farm] Không có mục tiêu phù hợp (NPC hoặc Player).");
                return 0;
            }

            // Step 4: Chiếm từng ruộng
            int occupied = 0;
            int remainFarmLand = farmLand;
            int remainWarToken = warToken;

            foreach (var farm in targets)
            {
                // Kiểm tra giới hạn
                if (maxOccupy >= 0 && occupied >= maxOccupy)
                {
                    Console.WriteLine($"[Farm] Đã đạt maxOccupy={maxOccupy}. Dừng.");
                    break;
                }

                // Kiểm tra token
                if (farm.IsNpc)
                {
                    // NPC dùng farmLand token hoặc không cần (server tự kiểm)
                    // farmLand > 0 = còn lượt miễn phí
                    if (remainFarmLand <= 0)
                    {
                        Console.WriteLine("[Farm] Hết farmLand token. Dừng chiếm NPC.");
                        break;
                    }
                }
                else
                {
                    // Player dùng warToken
                    if (remainWarToken <= 0)
                    {
                        Console.WriteLine("[Farm] Hết warToken. Dừng chiếm ruộng người chơi.");
                        break;
                    }
                }

                // Thực hiện chiếm
                try
                {
                    var updated = await OccupyFarmAsync(farm);
                    occupied++;

                    if (farm.IsNpc) remainFarmLand--;
                    else            remainWarToken--;

                    // Kiểm tra server báo đầy rồi
                    if (updated.IsFull)
                    {
                        Console.WriteLine("[Farm] Server báo đã đủ số ruộng tối đa (canAttack=1). Dừng.");
                        break;
                    }

                    // Delay giữa các lần
                    if (delayMs > 0)
                        await Task.Delay(delayMs);
                }
                catch (OperationCanceledException)
                {
                    Console.WriteLine($"[Farm] Timeout chiếm farmId={farm.FarmId}. Bỏ qua.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Farm] Lỗi chiếm farmId={farm.FarmId}: {ex.Message}");
                }
            }

            Console.WriteLine($"\n[Farm] ===== AutoOccupyFarms hoàn thành: " +
                $"đã chiếm {occupied} ruộng =====");
            return occupied;
        }

        // ──────────────────────────────────────────────────────────
        // Helper: In trạng thái ruộng đang sở hữu
        // ──────────────────────────────────────────────────────────

        public async Task PrintMyFarmsStatusAsync()
        {
            var myFarms = await GetMyFarmsAsync();
            Console.WriteLine($"\n[MyFarms] Đang chiếm {myFarms.Count} ruộng:");
            foreach (var f in myFarms)
                Console.WriteLine($"  farmId={f.FarmId} | còn lại={f.RemainDisplay}");
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Ví dụ sử dụng
    // ──────────────────────────────────────────────────────────────

    /*
    CÁCH SỬ DỤNG:

    var farmSystem = new FarmOccupySystem(myConnection, myMessageReader);

    // ── Xem danh sách ruộng ──────────────────────────────────────
    var snapshot = await farmSystem.GetFarmListAsync();
    snapshot.Print();

    // ── Kiểm tra trạng thái ─────────────────────────────────────
    // farmLand + warToken lấy từ GC_SEND_ROLE_INFO (10211)
    var check = await farmSystem.CheckFarmStatusAsync(
        farmLand: roleVO.FarmLand,
        warToken: roleVO.WarToken
    );
    check.Print();

    // ── Chiếm thủ công 1 ruộng NPC ──────────────────────────────
    var npcFarms = snapshot.NpcOccupyable;
    if (npcFarms.Any())
        await farmSystem.OccupyFarmAsync(npcFarms.First());

    // ── Chiếm tự động đầy đủ ────────────────────────────────────
    int count = await farmSystem.AutoOccupyFarmsAsync(
        farmLand:     roleVO.FarmLand,   // lấy từ 10211
        warToken:     roleVO.WarToken,   // lấy từ 10211
        occupyPlayer: false,             // chỉ chiếm NPC
        maxOccupy:    -1,                // không giới hạn
        delayMs:      1500               // 1.5s giữa mỗi lần
    );
    Console.WriteLine($"Đã chiếm {count} ruộng.");

    // ── Thu hoạch tất cả ────────────────────────────────────────
    await farmSystem.HarvestAllFarmsAsync();

    FLOW ĐẦY ĐỦ PROTOCOL:
    ┌──────────────────────────────────────────────────────────┐
    │ C→S 11703  CG_FARM_LIST         (header-only)           │
    │ S→C 11704  GC_FARM_LIST         technology + FarmBean[] │
    │            FarmBean.canAttack                           │
    │              0 = chiếm được                             │
    │              1 = đã đủ số ruộng tối đa                  │
    │              2 = thiếu Quân Lệnh (warToken)             │
    │              3 = không thể chiếm                        │
    │            FarmBean.roleId == 0  → NPC (không cần wT)  │
    │            FarmBean.roleId != 0  → người chơi (cần wT) │
    │ S→C 11705  GC_FARM_STANDING_LIST farmId + remainTime    │
    │                                                         │
    │ C→S 11700  CG_FARM_ATTACK  [4B farmId][8B roleId]      │
    │ S→C 11704  GC_FARM_LIST    (refresh sau khi chiếm)     │
    │ S→C 11705  GC_FARM_STANDING_LIST (cập nhật sở hữu)    │
    │ S→C 11900  GC_SEND_WAR_REPORT   (nếu chiếm player)    │
    │                                                         │
    │ C→S 11701  CG_FARM_DROP    [4B farmId]  (bỏ ruộng)    │
    │ C→S 11702  CG_FARM_HARVEST [4B farmId]  (thu hoạch 1) │
    │ C→S 12612  CG_HARVEST_FARMS[4B farmId=0](thu hoạch all)│
    └──────────────────────────────────────────────────────────┘

    LƯU Ý QUAN TRỌNG:
    ─────────────────
    1. farmLand token (GC_SEND_ROLE_INFO 10211 field farmLand):
       > 0 = còn lượt chiếm miễn phí hôm nay
       Server cập nhật qua GC_EVENT_SETFARMLAND (10527) khi dùng

    2. warToken (GC_SEND_ROLE_INFO 10211 field warToken):
       Dùng để chiếm ruộng người chơi
       Server cập nhật qua GC_EVENT_SETWARTOKEN (10536)

    3. Số ruộng tối đa: server tự kiểm, trả canAttack=1 khi đủ
       Không có giới hạn cứng trong clientdata

    4. roleId trong CG_FARM_ATTACK:
       = farmBean.RoleId (lấy từ GC_FARM_LIST)
       NPC: roleId = 0L   → gửi Long 0
       Player: roleId > 0 → gửi Long roleId của người đó

    5. Ruộng người chơi gây trận đánh → nhận GC_SEND_WAR_REPORT (11900)
       Bot có thể ignore 11900 nếu không cần xem kết quả trận
    */
}