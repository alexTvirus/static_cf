/**
 * Maximum number of guests allowed in the input
 */
export const MAX_GUESTS_INPUT_VALUE = 4;

/**
 * Messages related to user registration.
 */
export const REGISTRATION_MESSAGES = {
  SUCCESS: 'Tài khoản đã tạo thành công, hãy kiểm tra email để xác thực tài khoản',
};

/**
 * Messages related to user login.
 */
export const LOGIN_MESSAGES = {
  FAILED: 'Hãy điền email and password',
  LOGIN_REQUIRE : 'Hãy đăng nhập để thực hiện chức năng này',
  CANT_REVIEW : "Bạn không thể review vì chưa đăng nhập hoặc chưa đặt phòng này"
};

/**
 * Represents the default tax details for hotel booking.
 */
export const DEFAULT_TAX_DETAILS =
  'GST: 12% on VND 0 - 2,500, 12% on VND 2,500-7,500, 18% on VND 7,500 and above';

export const FORGOTPASSWORD_MESSAGES = {
  SUCCESS: 'Tài khoản đã reset password thành công, hãy kiểm tra email để nhận password mới',
};


export const CHANGEPASSWORD_MESSAGES = {
  SUCCESS: 'Tài khoản đã thay đổi mật khẩu thành công',
};


/**
 * Sorting filter labels
 */
export const SORTING_FILTER_LABELS = Object.freeze({
  PRICE_LOW_TO_HIGH: 'Giá: Thấp đến Cao',
  PRICE_HIGH_TO_LOW: 'Giá: Cao đến Thấp',
  RATING_LOW_TO_HIGH: 'Đánh giá: Thấp đến Cao',
  RATING_HIGH_TO_LOW: 'Đánh giá: Cao đến Thấp',
});

export const RATING_MESSAGES = Object.freeze({
  SUCCESS: 'Đánh giá trành công',
  FAIL: 'Giá: Thấp đến Cao',
  NOTTHING: 'Chưa có lượt đánh giá nào',
  YOUR_RATING:'Đánh giá của bạn',
  OVERALL_RATING : 'Đánh giá tổng quan',
});

const listBookingStatus = [
  {
    id: 1,
    name: "pending",
  },

  {
    id: 2,
    name: "complete",
  }
]

export const BOOKING_STATUS = Object.freeze({
  PENDING: { name: "ĐANG KIỂM TRA", id: 1 },
  COMPLETE: { name: "ĐÃ THANH TOÁN", id: 2 },
  PARTIALLY_PAID: { name: "THANH TOÁN MỘT PHẦN", id: 3 },
  CANCEL: { name: "ĐÃ HỦY", id: 4 },
  PENDING_CANCEL: { name: "CHỜ HỦY", id: 5 },
});

export const PRICE = Object.freeze({
  MIN: { price: 100000, id: 1 },
  MAX: { price: 2000000, id: 2 },
});