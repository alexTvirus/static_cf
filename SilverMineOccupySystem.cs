// ============================================================
//  SilverMineOccupySystem.cs
//  Reverse-engineered từ sg2.max.js – Silver Mine (Mỏ Bạc)
//
//  Chức năng:
//    1. GetMineListAsync          – lấy danh sách mỏ bạc trong khu vực
//    2. GetMyMinesAsync           – lấy mỏ đang sở hữu + thời gian còn lại
//    3. CheckMineStatus           – kiểm tra token trước khi chiếm
//    4. OccupyMineAsync           – chiếm 1 mỏ theo chỉ định (mineId + area)
//    5. DropMineAsync             – bỏ 1 mỏ đang sở hữu
//    6. HarvestMineAsync          – thu hoạch bạc từ 1 mỏ
//    7. ExtendMineTimeAsync       – gia hạn thời gian chiếm mỏ
//    8. OccupySpecificMineAsync   – chiếm mỏ theo mineId chỉ định, kiểm tra NPC/player
//    9. AutoOccupyMinesAsync      – flow tổng hợp tự động
//
//  Wire formats (Big-Endian, từ sg2.max.js - AttackMineMessage, etc.):
//
//  ── LẤY DANH SÁCH MỎ ────────────────────────────────────────
//  CG_MINE_LIST    11803  [4B city][4B area]
//  GC_MINE_LIST    11804  [4B area][4B technology][2B count] × MineBean {
//                              [4B mineId]
//                              [8B roleId Long]       ← 0/null = NPC/trống
//                              [Str roleFlag]         ← cờ quốc gia chủ mỏ
//                              [Str roleName]         ← tên chủ mỏ
//                              [4B roleLevel]
//                              [Str start]            ← timestamp bắt đầu (ms string)
//                              [4B remain]            ← giây còn lại
//                              [4B output]            ← bạc/phút
//                              [4B activeAllyOutput]  ← bonus đồng minh
//                              [4B canAttack]         ← 0=chiếm được | 1=đủ mỏ rồi
//                          }                            2=thiếu token | 3=không thể
//
//  ── MỎ ĐANG SỞ HỮU ─────────────────────────────────────────
//  GC_MINE_STANDING_LIST  11805  (server push khi cập nhật)
//                                [2B count] × MineStandingBean {
//                                    [4B area]
//                                    [4B mineId]
//                                    [8B remainTime Long]  ← ms còn lại
//                                }
//
//  ── CHIẾM MỎ ─────────────────────────────────────────────
//  CG_MINE_ATTACK  11800  [4B area][4B mineId][8B roleId Long]
//                         area   = khu vực (SceneType.SILVER_MINE = 4)
//                         mineId = ID mỏ muốn chiếm
//                         roleId = 0L nếu NPC, roleId người chơi nếu player
//
//  ── BỎ MỎ ───────────────────────────────────────────────
//  CG_MINE_DROP    11801  [4B area][4B mineId]
//
//  ── THU HOẠCH ───────────────────────────────────────────
//  CG_MINE_HARVEST 11802  [4B area][4B mineId]
//
//  ── GIA HẠN THỜI GIAN ───────────────────────────────────
//  CG_MINE_EXTRATIME 11807 [4B area][4B mineId]
//  → Response: GC_MINE_EXTRATIMESTATUS (11806) {
//                  [Bool isValid]
//                  [4B extraTime]
//                  [4B useCount]
//              }
//
//  ── canAttack VALUES ─────────────────────────────────────
//  0 = Có thể chiếm   (FIRE_FOR_FIELD)
//  1 = Đã đủ số mỏ    (FIELD_NUM_FULL)
//  2 = Thiếu token     (JUNLING_NOT_ENOUGH)
//  3 = Không thể chiếm (CANT_FIRE)
//
//  ── NPC vs NGƯỜI CHƠI ────────────────────────────────────
//  MineBean.roleId == null || == 0L → NPC/mỏ trống
//  MineBean.roleId != 0L            → mỏ người chơi → cần warToken
//
//  ── AREA (khu vực mỏ) ────────────────────────────────────
//  SceneType.SILVER_MINE = 4  (từ sg2.max.js dòng 43318)
//  city và area được gửi kèm trong CG_MINE_LIST (11803)
// ============================================================

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Threading;
using System.Threading.Tasks;

namespace Sg2Bot
{
    // ──────────────────────────────────────────────────────────────
    // Constants
    // ──────────────────────────────────────────────────────────────

    public static class MineConstants
    {
        /// <summary>SceneType.SILVER_MINE = 4 (sg2.max.js:43318)</summary>
        public const int SCENE_SILVER_MINE = 4;

        // Message codes (sg2.max.js MessageType)
        public const short CG_MINE_ATTACK    = 11800;
        public const short CG_MINE_DROP      = 11801;
        public const short CG_MINE_HARVEST   = 11802;
        public const short CG_MINE_LIST      = 11803;
        public const short GC_MINE_LIST      = 11804;
        public const short GC_MINE_STANDING_LIST  = 11805;
        public const short GC_MINE_EXTRATIMESTATUS = 11806;
        public const short CG_MINE_EXTRATIME = 11807;

        // canAttack values
        public const int CAN_ATTACK       = 0;   // Có thể chiếm
        public const int MINE_FULL        = 1;   // Đã đủ số mỏ tối đa
        public const int TOKEN_NOT_ENOUGH = 2;   // Thiếu token
        public const int CANT_ATTACK      = 3;   // Không thể chiếm
    }

    // ──────────────────────────────────────────────────────────────
    // Data objects
    // ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Thông tin 1 mỏ bạc từ GC_MINE_LIST (11804).
    /// Tương ứng với MineBean trong sg2.max.js (dòng 65363).
    /// </summary>
    public class MineBean
    {
        public int    MineId          { get; set; }
        public long   RoleId          { get; set; }   // 0 = NPC/trống
        public string RoleFlag        { get; set; }   // cờ quốc gia chủ mỏ
        public string RoleName        { get; set; }   // tên chủ mỏ
        public int    RoleLevel       { get; set; }
        public string Start           { get; set; }   // timestamp ms bắt đầu
        public int    Remain          { get; set; }   // giây còn lại
        public int    Output          { get; set; }   // bạc/phút
        public int    ActiveAllyOutput { get; set; }  // bonus đồng minh (sg2.max.js:163129)
        public int    CanAttack       { get; set; }   // 0=được | 1=đủ | 2=thiếu token | 3=không thể

        // ── Convenience properties ──────────────────────────────

        /// <summary>
        /// Mỏ NPC/trống: roleId == null hoặc == 0.
        /// Chiếm không tốn warToken.
        /// </summary>
        public bool IsNpc    => RoleId == 0;

        /// <summary>
        /// Mỏ người chơi: roleId != 0.
        /// Chiếm tốn warToken.
        /// </summary>
        public bool IsPlayer => RoleId != 0;

        /// <summary>Có thể chiếm ngay (canAttack == 0)</summary>
        public bool CanOccupy => CanAttack == MineConstants.CAN_ATTACK;

        /// <summary>Server báo đã đủ số mỏ tối đa</summary>
        public bool IsFull => CanAttack == MineConstants.MINE_FULL;

        public string CanAttackDescription => CanAttack switch {
            MineConstants.CAN_ATTACK       => "Có thể chiếm",
            MineConstants.MINE_FULL        => "Đã đủ số mỏ tối đa",
            MineConstants.TOKEN_NOT_ENOUGH => "Thiếu warToken",
            MineConstants.CANT_ATTACK      => "Không thể chiếm",
            _                              => $"Không xác định ({CanAttack})"
        };

        public string OwnerDescription =>
            IsNpc
                ? "[NPC - không tốn warToken]"
                : $"[{RoleName} Lv{RoleLevel} nation={RoleFlag}] (tốn warToken)";

        public override string ToString() =>
            $"mineId={MineId} | {OwnerDescription} | remain={Remain}s | " +
            $"output={Output}/min | allyBonus={ActiveAllyOutput}/min | {CanAttackDescription}";
    }

    /// <summary>
    /// Mỏ đang sở hữu từ GC_MINE_STANDING_LIST (11805).
    /// Tương ứng MineStandingBean trong sg2.max.js (dòng 65463).
    /// </summary>
    public class MineStandingBean
    {
        public int  Area       { get; set; }   // khu vực (4 = SILVER_MINE)
        public int  MineId     { get; set; }
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

        public override string ToString() =>
            $"mineId={MineId} (area={Area}) | còn lại={RemainDisplay}";
    }

    /// <summary>Snapshot danh sách mỏ từ GC_MINE_LIST (11804).</summary>
    public class MineListSnapshot
    {
        public int            Area       { get; set; }
        public int            Technology { get; set; }
        public List<MineBean> Mines      { get; set; } = new();

        // Filters
        public List<MineBean> NpcMines         => Mines.Where(m => m.IsNpc).ToList();
        public List<MineBean> PlayerMines      => Mines.Where(m => m.IsPlayer).ToList();
        public List<MineBean> OccupyableMines  => Mines.Where(m => m.CanOccupy).ToList();
        public List<MineBean> NpcOccupyable    => Mines.Where(m => m.IsNpc && m.CanOccupy).ToList();
        public List<MineBean> PlayerOccupyable => Mines.Where(m => m.IsPlayer && m.CanOccupy).ToList();
        public int            TotalCount       => Mines.Count;
        public bool           IsFull           => Mines.Any(m => m.CanAttack == MineConstants.MINE_FULL);

        public MineBean FindById(int mineId) =>
            Mines.FirstOrDefault(m => m.MineId == mineId);

        public void Print()
        {
            Console.WriteLine($"\n[MineList] area={Area} | technology={Technology} | Tổng={TotalCount}");
            Console.WriteLine($"  NPC={NpcMines.Count} | Người chơi={PlayerMines.Count}");
            Console.WriteLine($"  Có thể chiếm={OccupyableMines.Count} " +
                $"(NPC={NpcOccupyable.Count}, Player={PlayerOccupyable.Count})");
            foreach (var m in Mines)
                Console.WriteLine("  " + m);
        }
    }

    /// <summary>Trạng thái kiểm tra trước khi chiếm mỏ.</summary>
    public class MineCheckResult
    {
        public int  WarToken      { get; set; }   // Quân Lệnh còn lại
        public int  MyMineCount   { get; set; }   // số mỏ đang chiếm
        public bool HasWarToken   => WarToken > 0;

        public void Print()
        {
            Console.WriteLine($"\n[MineCheck]");
            Console.WriteLine($"  warToken (Quân Lệnh) = {WarToken}");
            Console.WriteLine($"  Mỏ đang chiếm        = {MyMineCount}");
            Console.WriteLine($"  Còn warToken         = {HasWarToken}");
        }
    }

    /// <summary>Kết quả gia hạn thời gian mỏ từ GC_MINE_EXTRATIMESTATUS (11806).</summary>
    public class MineExtraTimeResult
    {
        public bool IsValid    { get; set; }
        public int  ExtraTime  { get; set; }  // giây gia hạn thêm
        public int  UseCount   { get; set; }  // số lần đã dùng

        public override string ToString() =>
            $"isValid={IsValid} | extraTime={ExtraTime}s | useCount={UseCount}";
    }

    // ──────────────────────────────────────────────────────────────
    // Low-level helpers – ghi/đọc binary Big-Endian
    // (Tương tự MessageWriter/MessageReader trong sg2.max.js)
    // ──────────────────────────────────────────────────────────────

    public static class MessageWriter
    {
        public static void WriteShort(byte[] buf, ref int pos, short value)
        {
            buf[pos++] = (byte)(value >> 8);
            buf[pos++] = (byte)(value & 0xFF);
        }

        public static void WriteInt(byte[] buf, ref int pos, int value)
        {
            buf[pos++] = (byte)(value >> 24);
            buf[pos++] = (byte)(value >> 16);
            buf[pos++] = (byte)(value >> 8);
            buf[pos++] = (byte)(value & 0xFF);
        }

        public static void WriteLong(byte[] buf, ref int pos, long value)
        {
            buf[pos++] = (byte)(value >> 56);
            buf[pos++] = (byte)(value >> 48);
            buf[pos++] = (byte)(value >> 40);
            buf[pos++] = (byte)(value >> 32);
            buf[pos++] = (byte)(value >> 24);
            buf[pos++] = (byte)(value >> 16);
            buf[pos++] = (byte)(value >> 8);
            buf[pos++] = (byte)(value & 0xFF);
        }
    }

    public static class MessageReader
    {
        public static short ReadShort(byte[] data, ref int pos)
        {
            short v = (short)((data[pos] << 8) | data[pos + 1]);
            pos += 2;
            return v;
        }

        public static int ReadInt(byte[] data, ref int pos)
        {
            int v = (data[pos] << 24) | (data[pos + 1] << 16) |
                    (data[pos + 2] << 8) | data[pos + 3];
            pos += 4;
            return v;
        }

        public static long ReadLong(byte[] data, ref int pos)
        {
            long v = ((long)data[pos]     << 56) |
                     ((long)data[pos + 1] << 48) |
                     ((long)data[pos + 2] << 40) |
                     ((long)data[pos + 3] << 32) |
                     ((long)data[pos + 4] << 24) |
                     ((long)data[pos + 5] << 16) |
                     ((long)data[pos + 6] << 8)  |
                      (long)data[pos + 7];
            pos += 8;
            return v;
        }

        /// <summary>
        /// Đọc string dạng [2B length][UTF-8 bytes] (Big-Endian).
        /// Tương ứng MessageReader.readString() trong sg2.max.js.
        /// </summary>
        public static string ReadString(byte[] data, ref int pos)
        {
            short len = ReadShort(data, ref pos);
            if (len <= 0) return string.Empty;
            var str = System.Text.Encoding.UTF8.GetString(data, pos, len);
            pos += len;
            return str;
        }

        public static bool ReadBoolean(byte[] data, ref int pos)
        {
            return data[pos++] != 0;
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Connection & MessageReader interfaces
    // (Tương thích với IConnection / MessageReader đã dùng trong farm.cs)
    // ──────────────────────────────────────────────────────────────

    /// <summary>
    /// Interface kết nối TCP tới server SG2.
    /// Implement theo kết nối thực tế của bot.
    /// </summary>
    public interface IConnection
    {
        void Send(byte[] data);
        bool IsConnected { get; }
    }

    /// <summary>
    /// Interface đọc message từ server.
    /// WaitForMessageAsync chờ message với messageCode chỉ định.
    /// </summary>
    public interface IMessageReaderService
    {
        Task<byte[]> WaitForMessageAsync(short messageCode, CancellationToken ct);
    }

    // ──────────────────────────────────────────────────────────────
    // Main Silver Mine Occupy System
    // ──────────────────────────────────────────────────────────────

    public class SilverMineOccupySystem
    {
        private readonly IConnection           _conn;
        private readonly IMessageReaderService _reader;

        // Timeouts
        private static readonly TimeSpan MineListTimeout  = TimeSpan.FromSeconds(10);
        private static readonly TimeSpan OccupyTimeout    = TimeSpan.FromSeconds(15);
        private static readonly TimeSpan HarvestTimeout   = TimeSpan.FromSeconds(10);
        private static readonly TimeSpan ExtraTimeTimeout = TimeSpan.FromSeconds(10);

        /// <summary>
        /// Khởi tạo hệ thống chiếm mỏ bạc.
        /// </summary>
        /// <param name="conn">Kết nối TCP tới server</param>
        /// <param name="reader">Service đọc message từ server</param>
        public SilverMineOccupySystem(IConnection conn, IMessageReaderService reader)
        {
            _conn   = conn   ?? throw new ArgumentNullException(nameof(conn));
            _reader = reader ?? throw new ArgumentNullException(nameof(reader));
        }

        // ──────────────────────────────────────────────────────────
        // 1. Lấy danh sách mỏ bạc
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Lấy danh sách tất cả mỏ bạc trong khu vực (area).
        ///
        /// Gửi CG_MINE_LIST (11803): [2B len][2B 11803][4B city][4B area]
        /// Chờ GC_MINE_LIST (11804):  [2B len][2B 11804][4B area][4B technology][2B count] × MineBean
        ///
        /// Tương ứng ListMineMessage trong sg2.max.js (dòng 106563).
        /// </summary>
        /// <param name="city">ID thành phố (mặc định 0 nếu không rõ)</param>
        /// <param name="area">Khu vực mỏ (SceneType.SILVER_MINE = 4)</param>
        public async Task<MineListSnapshot> GetMineListAsync(int city = 0, int area = MineConstants.SCENE_SILVER_MINE)
        {
            Console.WriteLine($"[Mine] Lấy danh sách mỏ bạc (city={city}, area={area})...");

            // CG_MINE_LIST 11803: [2B len][2B 11803][4B city][4B area]
            // sg2.max.js dòng 106620-106628: MessageWriter.writeInt(area), writeInt(city) *ngược thứ tự*
            // Nhìn kỹ sg2.max.js:106623: city trước, area sau
            var buf = new byte[12];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, 12);
            MessageWriter.WriteShort(buf, ref pos, MineConstants.CG_MINE_LIST);
            MessageWriter.WriteInt(buf, ref pos, city);
            MessageWriter.WriteInt(buf, ref pos, area);

            using var cts = new CancellationTokenSource(MineListTimeout);
            _conn.Send(buf);

            var msg = await _reader.WaitForMessageAsync(MineConstants.GC_MINE_LIST, cts.Token);
            return ParseMineList(msg);
        }

        private MineListSnapshot ParseMineList(byte[] data)
        {
            // GC_MINE_LIST 11804:
            // [2B len][2B 11804][4B area][4B technology][2B count] × MineBean
            // sg2.max.js RefreshMinesMessage.byteArray setter (dòng 163193-163200)
            int pos = 4; // skip [2B len][2B msgCode]
            var snapshot = new MineListSnapshot
            {
                Area       = MessageReader.ReadInt(data, ref pos),
                Technology = MessageReader.ReadInt(data, ref pos),
            };

            int count = MessageReader.ReadShort(data, ref pos);
            for (int i = 0; i < count; i++)
            {
                // sg2.max.js RefreshMinesMessage.readArrayMine() dòng 163116-163132
                var mine = new MineBean
                {
                    MineId          = MessageReader.ReadInt(data, ref pos),
                    RoleId          = MessageReader.ReadLong(data, ref pos),
                    RoleFlag        = MessageReader.ReadString(data, ref pos),
                    RoleName        = MessageReader.ReadString(data, ref pos),
                    RoleLevel       = MessageReader.ReadInt(data, ref pos),
                    Start           = MessageReader.ReadString(data, ref pos),
                    Remain          = MessageReader.ReadInt(data, ref pos),
                    Output          = MessageReader.ReadInt(data, ref pos),
                    ActiveAllyOutput = MessageReader.ReadInt(data, ref pos),
                    CanAttack       = MessageReader.ReadInt(data, ref pos),
                };
                snapshot.Mines.Add(mine);
            }
            return snapshot;
        }

        // ──────────────────────────────────────────────────────────
        // 2. Lấy danh sách mỏ đang sở hữu
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Lấy danh sách mỏ bạc đang sở hữu + thời gian còn lại.
        ///
        /// Server push GC_MINE_STANDING_LIST (11805) sau khi gửi CG_MINE_LIST (11803).
        /// Format: [2B len][2B 11805][2B count] × {[4B area][4B mineId][8B remainTime]}
        ///
        /// Tương ứng HaveMinesMessage trong sg2.max.js (dòng 154776).
        /// </summary>
        /// <param name="city">ID thành phố</param>
        /// <param name="area">Khu vực mỏ</param>
        public async Task<List<MineStandingBean>> GetMyMinesAsync(int city = 0, int area = MineConstants.SCENE_SILVER_MINE)
        {
            var buf = new byte[12];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, 12);
            MessageWriter.WriteShort(buf, ref pos, MineConstants.CG_MINE_LIST);
            MessageWriter.WriteInt(buf, ref pos, city);
            MessageWriter.WriteInt(buf, ref pos, area);

            using var cts = new CancellationTokenSource(MineListTimeout);
            _conn.Send(buf);

            // Chờ GC_MINE_STANDING_LIST (11805)
            var msg = await _reader.WaitForMessageAsync(MineConstants.GC_MINE_STANDING_LIST, cts.Token);
            return ParseMyMines(msg);
        }

        private List<MineStandingBean> ParseMyMines(byte[] data)
        {
            // GC_MINE_STANDING_LIST 11805:
            // [2B len][2B 11805][2B count] × {[4B area][4B mineId][8B remainTime]}
            // sg2.max.js HaveMinesMessage.readArrayMineStanding() dòng 154785-154796
            int pos = 4;
            int count = MessageReader.ReadShort(data, ref pos);
            var list = new List<MineStandingBean>(count);
            for (int i = 0; i < count; i++)
            {
                list.Add(new MineStandingBean
                {
                    Area       = MessageReader.ReadInt(data, ref pos),
                    MineId     = MessageReader.ReadInt(data, ref pos),
                    RemainTime = MessageReader.ReadLong(data, ref pos),
                });
            }
            return list;
        }

        // ──────────────────────────────────────────────────────────
        // 3. Kiểm tra trạng thái trước khi chiếm mỏ
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Kiểm tra tổng hợp trạng thái trước khi chiếm mỏ.
        ///
        /// warToken = roleVO.warToken (từ GC_SEND_ROLE_INFO 10211).
        /// Khác farm: mỏ bạc LUÔN dùng warToken (không có farmLand token riêng).
        /// </summary>
        /// <param name="warToken">Quân Lệnh hiện có (lấy từ roleVO)</param>
        /// <param name="city">ID thành phố</param>
        /// <param name="area">Khu vực mỏ</param>
        public async Task<MineCheckResult> CheckMineStatusAsync(int warToken, int city = 0, int area = MineConstants.SCENE_SILVER_MINE)
        {
            var myMines = await GetMyMinesAsync(city, area);

            return new MineCheckResult
            {
                WarToken    = warToken,
                MyMineCount = myMines.Count,
            };
        }

        // ──────────────────────────────────────────────────────────
        // 4. Chiếm mỏ bạc theo chỉ định
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Chiếm 1 mỏ bạc theo mineBean (đã lấy từ GetMineListAsync).
        ///
        /// Gửi CG_MINE_ATTACK (11800): [2B len][2B 11800][4B area][4B mineId][8B roleId]
        /// → roleId = 0L nếu NPC, roleId người chơi nếu player
        ///
        /// Tương ứng AttackMineMessage trong sg2.max.js (dòng 73004-73071).
        ///
        /// Server response:
        ///  - Mỏ NPC/trống  : push GC_MINE_LIST (11804) + GC_MINE_STANDING_LIST (11805)
        ///  - Mỏ người chơi : push GC_SEND_WAR_REPORT (11900) + rồi 11804 + 11805
        ///
        /// Hàm chờ GC_MINE_LIST (11804) làm xác nhận.
        /// </summary>
        /// <param name="mine">Thông tin mỏ muốn chiếm</param>
        /// <param name="area">Khu vực mỏ (SceneType.SILVER_MINE = 4)</param>
        public async Task<MineListSnapshot> OccupyMineAsync(MineBean mine, int area = MineConstants.SCENE_SILVER_MINE)
        {
            if (!mine.CanOccupy)
            {
                Console.WriteLine($"[Mine] Không thể chiếm mineId={mine.MineId}: {mine.CanAttackDescription}");
                throw new InvalidOperationException(
                    $"canAttack={mine.CanAttack}: {mine.CanAttackDescription}");
            }

            string ownerDesc = mine.IsNpc
                ? "NPC (không tốn warToken)"
                : $"người chơi {mine.RoleName} Lv{mine.RoleLevel} (tốn warToken)";

            Console.WriteLine($"[Mine] Đang chiếm mineId={mine.MineId} | Chủ: {ownerDesc}...");

            // CG_MINE_ATTACK 11800: [2B len][2B 11800][4B area][4B mineId][8B roleId]
            // sg2.max.js AttackMineMessage.byteArray getter dòng 73055-73065
            var buf = new byte[20];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, 20);
            MessageWriter.WriteShort(buf, ref pos, MineConstants.CG_MINE_ATTACK);
            MessageWriter.WriteInt(buf, ref pos, area);
            MessageWriter.WriteInt(buf, ref pos, mine.MineId);
            MessageWriter.WriteLong(buf, ref pos, mine.RoleId);

            using var cts = new CancellationTokenSource(OccupyTimeout);
            _conn.Send(buf);

            // Chờ server refresh mine list (GC_MINE_LIST 11804)
            var msg = await _reader.WaitForMessageAsync(MineConstants.GC_MINE_LIST, cts.Token);
            var updated = ParseMineList(msg);

            Console.WriteLine($"[Mine] Chiếm mineId={mine.MineId} thành công!");
            return updated;
        }

        /// <summary>
        /// Chiếm mỏ bạc theo mineId chỉ định.
        ///
        /// Tự động:
        ///  1. Lấy danh sách mỏ để tìm mineId
        ///  2. Kiểm tra trạng thái mỏ (NPC hay người chơi, có thể chiếm không)
        ///  3. Thực hiện chiếm nếu điều kiện hợp lệ
        ///
        /// Đây là hàm "chiếm theo chỉ định" chính.
        /// </summary>
        /// <param name="targetMineId">ID mỏ muốn chiếm</param>
        /// <param name="warToken">Quân Lệnh hiện có</param>
        /// <param name="allowPlayer">true = cho phép chiếm mỏ người chơi (tốn warToken)</param>
        /// <param name="city">ID thành phố</param>
        /// <param name="area">Khu vực mỏ</param>
        /// <returns>Snapshot mỏ sau khi chiếm, hoặc null nếu thất bại</returns>
        public async Task<MineListSnapshot> OccupySpecificMineAsync(
            int  targetMineId,
            int  warToken,
            bool allowPlayer = false,
            int  city        = 0,
            int  area        = MineConstants.SCENE_SILVER_MINE)
        {
            Console.WriteLine($"\n[Mine] === Chiếm mỏ chỉ định: mineId={targetMineId} ===");

            // Bước 1: Lấy danh sách mỏ
            var snapshot = await GetMineListAsync(city, area);

            // Bước 2: Tìm mỏ theo ID
            var mine = snapshot.FindById(targetMineId);
            if (mine == null)
            {
                Console.WriteLine($"[Mine] Không tìm thấy mineId={targetMineId} trong khu vực area={area}.");
                Console.WriteLine($"[Mine] Danh sách mỏ hiện tại:");
                snapshot.Print();
                return null;
            }

            Console.WriteLine($"[Mine] Tìm thấy mineId={targetMineId}:");
            Console.WriteLine($"  Chủ sở hữu : {mine.OwnerDescription}");
            Console.WriteLine($"  Loại       : {(mine.IsNpc ? "NPC / Mỏ trống" : "Mỏ người chơi")}");
            Console.WriteLine($"  Trạng thái : {mine.CanAttackDescription}");
            Console.WriteLine($"  Output     : {mine.Output}/phút (bonus đồng minh +{mine.ActiveAllyOutput}/phút)");
            Console.WriteLine($"  Thời gian  : {mine.Remain}s còn lại");

            // Bước 3: Kiểm tra điều kiện chiếm
            if (!mine.CanOccupy)
            {
                Console.WriteLine($"[Mine] Không thể chiếm: {mine.CanAttackDescription}");
                return null;
            }

            if (mine.IsPlayer && !allowPlayer)
            {
                Console.WriteLine($"[Mine] Mỏ thuộc người chơi ({mine.RoleName}). " +
                    $"Cần allowPlayer=true để chiếm.");
                return null;
            }

            if (mine.IsPlayer && warToken <= 0)
            {
                Console.WriteLine($"[Mine] Mỏ thuộc người chơi nhưng hết warToken (warToken={warToken}).");
                return null;
            }

            // Bước 4: Thực hiện chiếm
            return await OccupyMineAsync(mine, area);
        }

        // ──────────────────────────────────────────────────────────
        // 5. Bỏ mỏ bạc
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Bỏ 1 mỏ bạc đang sở hữu.
        ///
        /// Gửi CG_MINE_DROP (11801): [2B len][2B 11801][4B area][4B mineId]
        /// Tương ứng DropMineMessage trong sg2.max.js (dòng 84943-84997).
        /// </summary>
        /// <param name="mineId">ID mỏ muốn bỏ</param>
        /// <param name="area">Khu vực mỏ</param>
        public async Task DropMineAsync(int mineId, int area = MineConstants.SCENE_SILVER_MINE)
        {
            Console.WriteLine($"[Mine] Bỏ mỏ mineId={mineId} (area={area})...");

            // CG_MINE_DROP 11801: [2B len][2B 11801][4B area][4B mineId]
            var buf = new byte[12];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, 12);
            MessageWriter.WriteShort(buf, ref pos, MineConstants.CG_MINE_DROP);
            MessageWriter.WriteInt(buf, ref pos, area);
            MessageWriter.WriteInt(buf, ref pos, mineId);

            using var cts = new CancellationTokenSource(HarvestTimeout);
            _conn.Send(buf);

            // Chờ server refresh 11804
            await _reader.WaitForMessageAsync(MineConstants.GC_MINE_LIST, cts.Token);
            Console.WriteLine($"[Mine] Đã bỏ mỏ mineId={mineId}.");
        }

        // ──────────────────────────────────────────────────────────
        // 6. Thu hoạch bạc từ mỏ
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Thu hoạch bạc từ 1 mỏ cụ thể.
        ///
        /// Gửi CG_MINE_HARVEST (11802): [2B len][2B 11802][4B area][4B mineId]
        /// Tương ứng MineHarvestMessage trong sg2.max.js (dòng 107428-107485).
        /// </summary>
        /// <param name="mineId">ID mỏ muốn thu hoạch</param>
        /// <param name="area">Khu vực mỏ</param>
        public async Task HarvestMineAsync(int mineId, int area = MineConstants.SCENE_SILVER_MINE)
        {
            Console.WriteLine($"[Mine] Thu hoạch bạc từ mineId={mineId}...");

            // CG_MINE_HARVEST 11802: [2B len][2B 11802][4B area][4B mineId]
            var buf = new byte[12];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, 12);
            MessageWriter.WriteShort(buf, ref pos, MineConstants.CG_MINE_HARVEST);
            MessageWriter.WriteInt(buf, ref pos, area);
            MessageWriter.WriteInt(buf, ref pos, mineId);

            _conn.Send(buf);
            await Task.Delay(500); // cho server xử lý
            Console.WriteLine($"[Mine] Đã gửi lệnh thu hoạch mineId={mineId}.");
        }

        /// <summary>
        /// Thu hoạch bạc từ tất cả mỏ đang sở hữu.
        /// </summary>
        /// <param name="city">ID thành phố</param>
        /// <param name="area">Khu vực mỏ</param>
        public async Task HarvestAllMinesAsync(int city = 0, int area = MineConstants.SCENE_SILVER_MINE)
        {
            Console.WriteLine("[Mine] Thu hoạch tất cả mỏ đang sở hữu...");

            var myMines = await GetMyMinesAsync(city, area);
            if (!myMines.Any())
            {
                Console.WriteLine("[Mine] Không có mỏ nào để thu hoạch.");
                return;
            }

            Console.WriteLine($"[Mine] Đang thu hoạch {myMines.Count} mỏ...");
            foreach (var m in myMines)
            {
                await HarvestMineAsync(m.MineId, m.Area);
                await Task.Delay(300);
            }
            Console.WriteLine("[Mine] Đã thu hoạch tất cả mỏ.");
        }

        // ──────────────────────────────────────────────────────────
        // 7. Gia hạn thời gian chiếm mỏ
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Gia hạn thời gian chiếm mỏ (dùng item đặc biệt).
        ///
        /// Gửi CG_MINE_EXTRATIME (11807): [2B len][2B 11807][4B area][4B mineId]
        /// Response GC_MINE_EXTRATIMESTATUS (11806): [Bool isValid][4B extraTime][4B useCount]
        ///
        /// Tương ứng MineExtraTimeReqMessage trong sg2.max.js (dòng 107365-107424).
        /// </summary>
        /// <param name="mineId">ID mỏ muốn gia hạn</param>
        /// <param name="area">Khu vực mỏ</param>
        public async Task<MineExtraTimeResult> ExtendMineTimeAsync(int mineId, int area = MineConstants.SCENE_SILVER_MINE)
        {
            Console.WriteLine($"[Mine] Gia hạn thời gian mỏ mineId={mineId}...");

            // CG_MINE_EXTRATIME 11807: [2B len][2B 11807][4B area][4B mineId]
            var buf = new byte[12];
            int pos = 0;
            MessageWriter.WriteShort(buf, ref pos, 12);
            MessageWriter.WriteShort(buf, ref pos, MineConstants.CG_MINE_EXTRATIME);
            MessageWriter.WriteInt(buf, ref pos, area);
            MessageWriter.WriteInt(buf, ref pos, mineId);

            using var cts = new CancellationTokenSource(ExtraTimeTimeout);
            _conn.Send(buf);

            // Chờ GC_MINE_EXTRATIMESTATUS (11806)
            var msg = await _reader.WaitForMessageAsync(MineConstants.GC_MINE_EXTRATIMESTATUS, cts.Token);
            var result = ParseExtraTimeStatus(msg);

            Console.WriteLine($"[Mine] Kết quả gia hạn: {result}");
            return result;
        }

        private MineExtraTimeResult ParseExtraTimeStatus(byte[] data)
        {
            // GC_MINE_EXTRATIMESTATUS 11806:
            // [2B len][2B 11806][Bool isValid][4B extraTime][4B useCount]
            // sg2.max.js MineExtraTimeStatusRespMessage.byteArray setter dòng 158012-158020
            int pos = 4;
            return new MineExtraTimeResult
            {
                IsValid   = MessageReader.ReadBoolean(data, ref pos),
                ExtraTime = MessageReader.ReadInt(data, ref pos),
                UseCount  = MessageReader.ReadInt(data, ref pos),
            };
        }

        // ──────────────────────────────────────────────────────────
        // 8. AutoOccupyMinesAsync – flow tự động chiếm mỏ
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// Flow tự động chiếm mỏ bạc đầy đủ:
        ///
        ///  1. Lấy danh sách mỏ (11803 → 11804)
        ///  2. Kiểm tra warToken + số mỏ hiện tại
        ///  3. Ưu tiên chiếm mỏ NPC (không tốn warToken)
        ///     → rồi mới đến mỏ người chơi (tốn warToken, nếu occupyPlayer=true)
        ///     → sắp xếp theo output cao trước (output + activeAllyOutput)
        ///  4. Chiếm từng mỏ với delay
        ///  5. Log kết quả
        ///
        /// Tham số:
        ///   warToken      = roleVO.warToken (Quân Lệnh)
        ///   occupyPlayer  = true → cũng chiếm mỏ người chơi (tốn warToken)
        ///   maxOccupy     = số mỏ tối đa muốn chiếm (-1 = không giới hạn)
        ///   delayMs       = delay giữa các lần chiếm (ms)
        ///   city          = ID thành phố
        ///   area          = khu vực mỏ (mặc định SILVER_MINE = 4)
        /// </summary>
        public async Task<int> AutoOccupyMinesAsync(
            int  warToken,
            bool occupyPlayer = false,
            int  maxOccupy    = -1,
            int  delayMs      = 1000,
            int  city         = 0,
            int  area         = MineConstants.SCENE_SILVER_MINE)
        {
            Console.WriteLine("\n[Mine] ===== AutoOccupyMines bắt đầu =====");
            Console.WriteLine($"  warToken     = {warToken}");
            Console.WriteLine($"  occupyPlayer = {occupyPlayer}");
            Console.WriteLine($"  maxOccupy    = {(maxOccupy < 0 ? "không giới hạn" : maxOccupy.ToString())}");
            Console.WriteLine($"  area         = {area} (SILVER_MINE=4)");

            // Bước 1: Lấy danh sách mỏ
            var snapshot = await GetMineListAsync(city, area);
            snapshot.Print();

            if (!snapshot.OccupyableMines.Any())
            {
                Console.WriteLine("[Mine] Không có mỏ nào có thể chiếm.");
                return 0;
            }

            // Bước 2: Kiểm tra token
            if (warToken <= 0 && !snapshot.NpcOccupyable.Any())
            {
                Console.WriteLine("[Mine] warToken=0 và không có mỏ NPC. Dừng.");
                return 0;
            }

            // Bước 3: Sắp xếp danh sách chiếm
            // Ưu tiên NPC, trong cùng loại: (output + activeAllyOutput) cao trước
            var targets = new List<MineBean>();

            // Mỏ NPC (không tốn warToken)
            targets.AddRange(snapshot.NpcOccupyable
                .OrderByDescending(m => m.Output + m.ActiveAllyOutput));

            // Mỏ người chơi (chỉ nếu occupyPlayer=true và có warToken)
            if (occupyPlayer && warToken > 0)
            {
                targets.AddRange(snapshot.PlayerOccupyable
                    .OrderByDescending(m => m.Output + m.ActiveAllyOutput));
            }

            if (!targets.Any())
            {
                Console.WriteLine("[Mine] Không có mục tiêu phù hợp.");
                return 0;
            }

            // Bước 4: Chiếm từng mỏ
            int occupied       = 0;
            int remainWarToken = warToken;

            foreach (var mine in targets)
            {
                // Kiểm tra giới hạn
                if (maxOccupy >= 0 && occupied >= maxOccupy)
                {
                    Console.WriteLine($"[Mine] Đã đạt maxOccupy={maxOccupy}. Dừng.");
                    break;
                }

                // Kiểm tra warToken nếu là mỏ người chơi
                if (mine.IsPlayer)
                {
                    if (remainWarToken <= 0)
                    {
                        Console.WriteLine("[Mine] Hết warToken. Dừng chiếm mỏ người chơi.");
                        break;
                    }
                }

                // Thực hiện chiếm
                try
                {
                    var updated = await OccupyMineAsync(mine, area);
                    occupied++;

                    if (mine.IsPlayer) remainWarToken--;

                    // Kiểm tra server báo đầy
                    if (updated.IsFull)
                    {
                        Console.WriteLine("[Mine] Server báo đã đủ số mỏ tối đa (canAttack=1). Dừng.");
                        break;
                    }

                    if (delayMs > 0)
                        await Task.Delay(delayMs);
                }
                catch (OperationCanceledException)
                {
                    Console.WriteLine($"[Mine] Timeout chiếm mineId={mine.MineId}. Bỏ qua.");
                }
                catch (InvalidOperationException ex)
                {
                    Console.WriteLine($"[Mine] Không thể chiếm mineId={mine.MineId}: {ex.Message}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[Mine] Lỗi chiếm mineId={mine.MineId}: {ex.Message}");
                }
            }

            Console.WriteLine($"\n[Mine] ===== AutoOccupyMines hoàn thành: đã chiếm {occupied} mỏ =====");
            return occupied;
        }

        // ──────────────────────────────────────────────────────────
        // Helper: In trạng thái mỏ đang sở hữu
        // ──────────────────────────────────────────────────────────

        /// <summary>
        /// In danh sách mỏ đang sở hữu với thời gian còn lại.
        /// </summary>
        public async Task PrintMyMinesStatusAsync(int city = 0, int area = MineConstants.SCENE_SILVER_MINE)
        {
            var myMines = await GetMyMinesAsync(city, area);
            Console.WriteLine($"\n[MyMines] Đang chiếm {myMines.Count} mỏ bạc:");
            foreach (var m in myMines)
                Console.WriteLine("  " + m);
        }
    }

    // ──────────────────────────────────────────────────────────────
    // Ví dụ sử dụng
    // ──────────────────────────────────────────────────────────────

    /*
    CÁCH SỬ DỤNG:

    var mineSystem = new SilverMineOccupySystem(myConnection, myMessageReaderService);

    // ── Xem danh sách mỏ bạc ─────────────────────────────────────
    // city=0 thường dùng cho server chỉ có 1 thành phố,
    // area=4 (SceneType.SILVER_MINE) cho mỏ bạc
    var snapshot = await mineSystem.GetMineListAsync(city: 0, area: 4);
    snapshot.Print();

    // ── Kiểm tra trạng thái ──────────────────────────────────────
    // warToken lấy từ GC_SEND_ROLE_INFO (10211) field warToken
    var check = await mineSystem.CheckMineStatusAsync(warToken: roleVO.WarToken);
    check.Print();

    // ── Chiếm 1 mỏ NPC bất kỳ (output cao nhất) ─────────────────
    var npcMines = snapshot.NpcOccupyable;
    if (npcMines.Any())
    {
        var best = npcMines.OrderByDescending(m => m.Output + m.ActiveAllyOutput).First();
        await mineSystem.OccupyMineAsync(best, area: 4);
    }

    // ── Chiếm mỏ theo mineId chỉ định ───────────────────────────
    // Tự động kiểm tra NPC/player, có thể chiếm không
    var result = await mineSystem.OccupySpecificMineAsync(
        targetMineId: 1001,       // ID mỏ muốn chiếm
        warToken:     roleVO.WarToken,
        allowPlayer:  false,      // false = chỉ chiếm NPC
        city:         0,
        area:         4
    );
    if (result != null)
        Console.WriteLine("Chiếm thành công!");

    // ── Chiếm tự động đầy đủ ─────────────────────────────────────
    int count = await mineSystem.AutoOccupyMinesAsync(
        warToken:      roleVO.WarToken,
        occupyPlayer:  false,    // chỉ chiếm mỏ NPC
        maxOccupy:     -1,       // không giới hạn số mỏ
        delayMs:       1500,     // 1.5s giữa mỗi lần chiếm
        city:          0,
        area:          4         // SceneType.SILVER_MINE
    );
    Console.WriteLine($"Đã chiếm {count} mỏ bạc.");

    // ── Thu hoạch tất cả mỏ ──────────────────────────────────────
    await mineSystem.HarvestAllMinesAsync(city: 0, area: 4);

    // ── Gia hạn thời gian mỏ ─────────────────────────────────────
    var extResult = await mineSystem.ExtendMineTimeAsync(mineId: 1001, area: 4);
    Console.WriteLine($"Gia hạn: {extResult}");

    // ── Xem mỏ đang sở hữu ───────────────────────────────────────
    await mineSystem.PrintMyMinesStatusAsync(city: 0, area: 4);


    FLOW ĐẦY ĐỦ PROTOCOL:
    ┌──────────────────────────────────────────────────────────────────────┐
    │ C→S 11803  CG_MINE_LIST      [4B city][4B area]                     │
    │ S→C 11804  GC_MINE_LIST      [4B area][4B technology][2B cnt]×Mine  │
    │            MineBean.canAttack                                        │
    │              0 = chiếm được                                          │
    │              1 = đã đủ số mỏ tối đa                                  │
    │              2 = thiếu warToken (Quân Lệnh)                          │
    │              3 = không thể chiếm                                     │
    │            MineBean.roleId == 0L → NPC (không cần warToken)         │
    │            MineBean.roleId != 0L → người chơi (cần warToken)        │
    │ S→C 11805  GC_MINE_STANDING_LIST [2B cnt]×{area,mineId,remainTime}  │
    │                                                                      │
    │ C→S 11800  CG_MINE_ATTACK    [4B area][4B mineId][8B roleId]        │
    │ S→C 11804  GC_MINE_LIST      (refresh sau khi chiếm)                │
    │ S→C 11805  GC_MINE_STANDING_LIST (cập nhật sở hữu)                  │
    │ S→C 11900  GC_SEND_WAR_REPORT    (nếu chiếm mỏ người chơi)         │
    │                                                                      │
    │ C→S 11801  CG_MINE_DROP      [4B area][4B mineId]                   │
    │ C→S 11802  CG_MINE_HARVEST   [4B area][4B mineId]                   │
    │ C→S 11807  CG_MINE_EXTRATIME [4B area][4B mineId]                   │
    │ S→C 11806  GC_MINE_EXTRATIMESTATUS [Bool][4B extraTime][4B useCount]│
    └──────────────────────────────────────────────────────────────────────┘

    LƯU Ý QUAN TRỌNG:
    ─────────────────
    1. area = 4 (SceneType.SILVER_MINE) cho mỏ bạc.
       Tham số này bắt buộc trong CG_MINE_ATTACK, CG_MINE_DROP, v.v.

    2. roleId trong CG_MINE_ATTACK:
       NPC   : roleId = 0L → gửi Long 0
       Player: roleId = mineBean.RoleId (lấy từ GC_MINE_LIST)

    3. warToken (từ GC_SEND_ROLE_INFO 10211):
       Mỏ NPC   : KHÔNG tốn warToken
       Mỏ player: TỐN 1 warToken mỗi lần chiếm

    4. activeAllyOutput: sản lượng bonus khi có đồng minh đang chiếm
       cùng khu vực. Tính vào tổng output khi ưu tiên chọn mỏ.

    5. MineStandingBean.area: khu vực của mỏ đang sở hữu.
       Dùng area này khi gửi CG_MINE_HARVEST / CG_MINE_DROP.

    6. Server có thể push GC_MINE_STANDING_LIST (11805) bất kỳ lúc nào
       (không chỉ sau CG_MINE_LIST). Bot nên lắng nghe liên tục.
    */
}
