# Form đăng nhập + Unit test với Jest

```
login-demo/
├── index.html      Form đăng nhập (giao diện + phần nối DOM)
├── login.js        Logic kiểm tra tài khoản — đây là phần được test
├── login.test.js   Unit test bằng Jest
├── server.js       Server tĩnh, chỉ dùng module có sẵn của Node
├── package.json    Khai báo lệnh chạy và Jest
└── README.md
```

## Bắt đầu

```bash
cd login-demo     # phải đứng đúng trong thư mục này
npm install       # cài Jest, chỉ cần một lần
npm start         # mở http://localhost:8080
```

Giữ nguyên cửa sổ terminal đó rồi mở trình duyệt vào **http://localhost:8080**.
Đóng terminal hoặc nhấn `Ctrl + C` là server dừng, lúc đó trình duyệt sẽ báo
`ERR_CONNECTION_REFUSED`.

Tài khoản thử nghiệm: `admin` / `123`.

Không muốn chạy server cũng được: nhấp đúp thẳng vào `index.html`. Trang vẫn
hoạt động đầy đủ vì `login.js` nạp bằng thẻ `<script>` thường, không vướng CORS.

## Chạy test

```bash
npm test
```

| Lệnh | Việc nó làm |
| --- | --- |
| `npm start` | Mở trang ở cổng 8080 |
| `npm test` | Chạy toàn bộ unit test một lượt |
| `npm run test:watch` | Tự chạy lại mỗi khi sửa file |
| `npm run test:coverage` | Kèm báo cáo độ phủ |

Kết quả hiện tại: **26 test pass**, độ phủ `login.js` đạt 100% dòng lệnh.

## Khi gặp sự cố

**`ERR_CONNECTION_REFUSED`** — chưa có server nào chạy. Quay lại terminal chạy
`npm start` và để cửa sổ đó mở.

**`Cổng 8080 đang bị chương trình khác chiếm`** — chọn cổng khác:

```bash
PORT=3000 npm start          # macOS / Linux
set PORT=3000 && npm start   # Windows CMD
$env:PORT=3000; npm start    # Windows PowerShell
```

**Trang 404 hoặc hiện danh sách thư mục** — bạn đang chạy server ở thư mục cha.
`cd` vào đúng `login-demo` rồi chạy lại.

**`npm start` báo không tìm thấy script** — bạn đứng sai thư mục, `package.json`
phải nằm ngay cạnh bạn.

## Quy ước của `checkLogin(username, password)`

| Tình huống | Kết quả |
| --- | --- |
| `checkLogin('admin', '123')` | `true` |
| `checkLogin('  admin  ', '123')` | `true` — tên đăng nhập được cắt khoảng trắng hai đầu |
| `checkLogin('Admin', '123')` | `false` — phân biệt hoa thường |
| `checkLogin('admin', ' 123')` | `false` — mật khẩu giữ nguyên từng ký tự |
| `checkLogin('admin', 123)` | `false` — số `123` khác chuỗi `'123'` |
| `checkLogin(null, undefined)` | `false` — không ném lỗi với dữ liệu lạ |

Ngoài ra `login(username, password)` trả về `{ ok, code, message }` để giao diện
biết nên hiển thị câu thông báo nào.

## Vì sao logic nằm riêng khỏi HTML

`login.js` không chạm vào `document` hay `window`, nên Jest nạp được nó trong
Node mà không cần giả lập trình duyệt. Nếu viết hàm kiểm tra ngay trong thẻ
`<script>` của `index.html`, bạn sẽ phải dựng jsdom và thao tác DOM chỉ để test
một phép so sánh chuỗi.

## Lưu ý về bảo mật

Tài khoản ở đây được ghi thẳng trong mã nguồn chạy phía trình duyệt, nghĩa là ai
mở DevTools cũng đọc được. Cách làm này chỉ phục vụ mục đích học tập. Ứng dụng
thật cần gửi thông tin đăng nhập lên máy chủ qua HTTPS, lưu mật khẩu đã băm
(bcrypt, argon2) và trả về token phiên.
