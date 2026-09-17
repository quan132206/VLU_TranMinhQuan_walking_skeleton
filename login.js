/**
 * login.js
 * ---------------------------------------------------------------------------
 * Logic kiểm tra đăng nhập. File này KHÔNG chạm vào DOM, nhờ vậy nó chạy được
 * cả trong trình duyệt (qua <script src="login.js">) lẫn trong Node/Jest
 * (qua require). Đây cũng là lý do hàm dễ viết unit test.
 *
 * Lưu ý: tài khoản được ghi thẳng trong mã nguồn chỉ nhằm mục đích học tập.
 * Ứng dụng thật phải xác thực ở phía máy chủ và lưu mật khẩu đã băm.
 * ---------------------------------------------------------------------------
 */

/** Tài khoản hợp lệ duy nhất của bản demo. */
var VALID_USERNAME = 'admin';
var VALID_PASSWORD = '1234';

/** Mã kết quả trả về của hàm login(). */
var LOGIN_CODE = {
  OK: 'OK',
  EMPTY_USERNAME: 'EMPTY_USERNAME',
  EMPTY_PASSWORD: 'EMPTY_PASSWORD',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS'
};

/**
 * Chuẩn hoá một giá trị bất kỳ về chuỗi.
 * Mọi kiểu dữ liệu không phải chuỗi (null, undefined, số, object...) đều được
 * coi là chuỗi rỗng, để hàm không bao giờ ném lỗi khi nhận dữ liệu lạ.
 *
 * @param {*} value
 * @returns {string}
 */
function toText(value) {
  return typeof value === 'string' ? value : '';
}

/**
 * Kiểm tra cặp tài khoản / mật khẩu.
 *
 * Quy ước:
 *  - Tên đăng nhập được cắt khoảng trắng thừa ở hai đầu (" admin " hợp lệ).
 *  - Mật khẩu giữ nguyên từng ký tự, kể cả khoảng trắng ("123 " không hợp lệ).
 *  - Phân biệt chữ hoa - chữ thường ("Admin" không hợp lệ).
 *  - Luôn trả về boolean, không bao giờ ném lỗi.
 *
 * @param {string} username Tên đăng nhập.
 * @param {string} password Mật khẩu.
 * @returns {boolean} true nếu đúng tài khoản admin/123, ngược lại false.
 */
function checkLogin(username, password) {
  var user = toText(username).trim();
  var pass = toText(password);

  return user === VALID_USERNAME && pass === VALID_PASSWORD;
}

/**
 * Bản mở rộng của checkLogin dành cho giao diện: ngoài đúng/sai còn cho biết
 * lý do và câu thông báo hiển thị cho người dùng.
 *
 * @param {string} username
 * @param {string} password
 * @returns {{ok: boolean, code: string, message: string}}
 */
function login(username, password) {
  var user = toText(username).trim();
  var pass = toText(password);

  if (user === '') {
    return {
      ok: false,
      code: LOGIN_CODE.EMPTY_USERNAME,
      message: 'Nhập tên đăng nhập để tiếp tục.'
    };
  }

  if (pass === '') {
    return {
      ok: false,
      code: LOGIN_CODE.EMPTY_PASSWORD,
      message: 'Nhập mật khẩu để tiếp tục.'
    };
  }

  if (!checkLogin(user, pass)) {
    return {
      ok: false,
      code: LOGIN_CODE.INVALID_CREDENTIALS,
      message: 'Tên đăng nhập hoặc mật khẩu chưa đúng.'
    };
  }

  return {
    ok: true,
    code: LOGIN_CODE.OK,
    message: 'Đăng nhập thành công. Xin chào ' + user + '.'
  };
}

/* Xuất module cho Node/Jest. Trên trình duyệt, đoạn này bị bỏ qua và các hàm
   nằm sẵn ở phạm vi toàn cục (window.checkLogin, window.login). */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkLogin: checkLogin,
    login: login,
    LOGIN_CODE: LOGIN_CODE,
    VALID_USERNAME: VALID_USERNAME,
    VALID_PASSWORD: VALID_PASSWORD
  };
}
