/**
 * server.js
 * ---------------------------------------------------------------------------
 * Server tĩnh nhỏ gọn để mở trang tại http://localhost:8080
 * Chỉ dùng module có sẵn của Node, không cần cài thêm gói nào.
 *
 * Chạy:  npm start
 * Đổi cổng:  PORT=3000 npm start   (Windows: set PORT=3000 && npm start)
 * Dừng:  Ctrl + C
 * ---------------------------------------------------------------------------
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 8080;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Bỏ query string, mặc định vào index.html
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  // Chặn truy cập ra ngoài thư mục dự án (../../etc/passwd)
  const filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 - Không được phép truy cập đường dẫn này.');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(
        '<meta charset="utf-8"><h1>404</h1>' +
        '<p>Không tìm thấy <code>' + urlPath + '</code>.</p>' +
        '<p><a href="/">Quay lại trang đăng nhập</a></p>'
      );
    }

    const type = MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-cache' });
    res.end(data);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error('\n  Cổng ' + PORT + ' đang bị chương trình khác chiếm.');
    console.error('  Hãy tắt chương trình đó, hoặc chạy cổng khác:');
    console.error('    PORT=3000 npm start        (macOS / Linux)');
    console.error('    set PORT=3000 && npm start (Windows)\n');
    process.exit(1);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log('\n  Trang đăng nhập đang chạy tại:  http://localhost:' + PORT);
  console.log('  Tài khoản thử nghiệm:           admin / 123');
  console.log('  Nhấn Ctrl + C để dừng.\n');
});
