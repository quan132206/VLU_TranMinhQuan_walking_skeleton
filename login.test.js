/**
 * login.test.js
 * ---------------------------------------------------------------------------
 * Unit test cho login.js, viết bằng Jest.
 * Chạy: npm test
 * ---------------------------------------------------------------------------
 */

const { checkLogin, login, LOGIN_CODE } = require('./login');

describe('checkLogin() - trường hợp đăng nhập thành công', () => {
  test('đúng admin/123 thì trả về true', () => {
    expect(checkLogin('admin', '123')).toBe(true);
  });

  test('bỏ qua khoảng trắng thừa quanh tên đăng nhập', () => {
    expect(checkLogin('  admin  ', '123')).toBe(true);
    expect(checkLogin('\tadmin\n', '123')).toBe(true);
  });

  test('luôn trả về đúng kiểu boolean, không phải giá trị "truthy"', () => {
    expect(typeof checkLogin('admin', '123')).toBe('boolean');
  });
});

describe('checkLogin() - trường hợp đăng nhập thất bại', () => {
  test.each([
    ['sai mật khẩu', 'admin', '1234'],
    ['sai tên đăng nhập', 'administrator', '123'],
    ['sai cả hai', 'user', 'abc'],
    ['tên đăng nhập rỗng', '', '123'],
    ['mật khẩu rỗng', 'admin', ''],
    ['cả hai đều rỗng', '', ''],
    ['chỉ toàn khoảng trắng', '   ', '   '],
    ['mật khẩu có khoảng trắng thừa', 'admin', ' 123'],
    ['mật khẩu viết dính thêm ký tự', 'admin', '123 ']
  ])('%s → false', (_moTa, username, password) => {
    expect(checkLogin(username, password)).toBe(false);
  });

  test('phân biệt chữ hoa và chữ thường', () => {
    expect(checkLogin('Admin', '123')).toBe(false);
    expect(checkLogin('ADMIN', '123')).toBe(false);
  });

  test('không bị qua mặt bởi mật khẩu dạng số 123', () => {
    // 123 (number) khác '123' (string) → phải bị từ chối.
    expect(checkLogin('admin', 123)).toBe(false);
  });
});

describe('checkLogin() - dữ liệu đầu vào bất thường', () => {
  test.each([
    ['không truyền tham số nào', undefined, undefined],
    ['null', null, null],
    ['số', 0, 0],
    ['mảng', ['admin'], ['123']],
    ['object', { username: 'admin' }, { password: '123' }],
    ['boolean', true, true]
  ])('%s → false và không ném lỗi', (_moTa, username, password) => {
    expect(() => checkLogin(username, password)).not.toThrow();
    expect(checkLogin(username, password)).toBe(false);
  });
});

describe('login() - kết quả chi tiết cho giao diện', () => {
  test('trả về ok: true kèm mã OK khi đăng nhập đúng', () => {
    const ketQua = login('admin', '123');

    expect(ketQua.ok).toBe(true);
    expect(ketQua.code).toBe(LOGIN_CODE.OK);
    expect(ketQua.message).toEqual(expect.stringContaining('admin'));
  });

  test('báo thiếu tên đăng nhập trước khi báo sai mật khẩu', () => {
    expect(login('', 'sai-mat-khau').code).toBe(LOGIN_CODE.EMPTY_USERNAME);
  });

  test('báo thiếu mật khẩu khi chỉ nhập tên đăng nhập', () => {
    expect(login('admin', '').code).toBe(LOGIN_CODE.EMPTY_PASSWORD);
  });

  test('báo sai thông tin khi nhập đủ nhưng không khớp', () => {
    expect(login('admin', '999').code).toBe(LOGIN_CODE.INVALID_CREDENTIALS);
  });

  test('luôn trả về đủ ba trường ok, code, message', () => {
    const ketQua = login('admin', '999');

    expect(ketQua).toEqual({
      ok: expect.any(Boolean),
      code: expect.any(String),
      message: expect.any(String)
    });
  });

  test('thông báo lỗi không tiết lộ mật khẩu người dùng vừa nhập', () => {
    expect(login('admin', 'sieu-bi-mat').message).not.toContain('sieu-bi-mat');
  });
});
