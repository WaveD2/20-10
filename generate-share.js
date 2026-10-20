const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'recipients.json');
const recipientsData = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// 1. Cập nhật recipients.js đồng bộ với recipients.json
const jsContent = `// Tự động đồng bộ từ recipients.json\nwindow.RECIPIENTS_DATA = ${JSON.stringify(recipientsData, null, 2)};\n`;
fs.writeFileSync(path.join(__dirname, 'recipients.js'), jsContent, 'utf8');
console.log('✓ Đã cập nhật recipients.js');

// 2. Dọn dẹp các file link cũ (c20.html, th20.html...)
const oldFiles = ['c20.html', 'th20.html', 'tr20.html', 'tu20.html', 'chi.html', 'thanh.html', 'trinh.html', 'tu.html', '1e60.html', '8478.html', '2841.html', 'b6b4.html'];
oldFiles.forEach(f => {
  const p = path.join(__dirname, f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
  const pShare = path.join(__dirname, 'share', f);
  if (fs.existsSync(pShare)) fs.unlinkSync(pShare);
});

// Đảm bảo thư mục share/ tồn tại
const shareDir = path.join(__dirname, 'share');
if (!fs.existsSync(shareDir)) {
  fs.mkdirSync(shareDir, { recursive: true });
}

const DOMAIN = 'https://20-10-green-seven.vercel.app';

function makeHtml(item, isSubdir = false) {
  const prefix = isSubdir ? '../' : './';
  // Dùng URL tuyệt đối cho thẻ Open Graph theo chuẩn Facebook/Zalo
  const imgUrl = `${DOMAIN}/${item.image.replace(/^\.\//, '')}`;
  const targetUrl = prefix + 'index.html?u=' + encodeURIComponent(item.code);
  const firstLine = item.message
    ? item.message.split('\n')[0].replace(/"/g, '&quot;')
    : 'Một bó hoa và tấm thiệp nhỏ, gửi những lời chúc dịu dàng 20/10.';

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Một bó hoa dành tặng ${item.name} · 20/10</title>

  <!-- Open Graph / Zalo / Facebook preview meta tags -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="Một bó hoa dành tặng ${item.name} · 20/10">
  <meta property="og:description" content="${firstLine}">
  <meta property="og:image" content="${imgUrl}">
  <meta property="og:locale" content="vi_VN">

  <!-- Twitter Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Một bó hoa dành tặng ${item.name} · 20/10">
  <meta name="twitter:description" content="${firstLine}">
  <meta name="twitter:image" content="${imgUrl}">

  <!-- Tự động chuyển hướng ngay vào thiệp chính khi người nhận bấm vào link -->
  <meta http-equiv="refresh" content="0; url=${targetUrl}">
  <script>
    window.location.replace('${targetUrl}');
  </script>
</head>
<body style="margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fff8fa;font-family:sans-serif;color:#76364d;">
  <p>Đang mở thiệp dành tặng ${item.name}... <a href="${targetUrl}">Bấm vào đây nếu trang không tự chuyển</a></p>
</body>
</html>
`;
}

// 3. Tạo file tĩnh 8 ký tự cho từng người nhận
recipientsData.recipients.forEach(item => {
  // File theo code 8 ký tự chính
  const rootFilename = path.join(__dirname, `${item.code}.html`);
  fs.writeFileSync(rootFilename, makeHtml(item, false), 'utf8');
  console.log(`✓ Đã tạo link chia sẻ 8 ký tự: ${item.code}.html -> ${item.name}`);

  const shareFilename = path.join(shareDir, `${item.code}.html`);
  fs.writeFileSync(shareFilename, makeHtml(item, true), 'utf8');

  // File theo aliases (nếu có, ví dụ chi2010v.html)
  if (Array.isArray(item.aliases)) {
    item.aliases.forEach(alias => {
      fs.writeFileSync(path.join(__dirname, `${alias}.html`), makeHtml(item, false), 'utf8');
      fs.writeFileSync(path.join(shareDir, `${alias}.html`), makeHtml(item, true), 'utf8');
      console.log(`  + Đã tạo alias 8 ký tự: ${alias}.html -> ${item.name}`);
    });
  }
});

console.log('\nHoàn tất tạo các trang chia sẻ 8 ký tự bảo mật!');
