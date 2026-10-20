const fs = require('fs');
const path = require('path');

let htmlTemplate = null;
let recipientsData = null;

function loadData() {
  if (!htmlTemplate) {
    htmlTemplate = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
  }
  if (!recipientsData) {
    recipientsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'recipients.json'), 'utf8'));
  }
}

module.exports = (req, res) => {
  loadData();
  const host = req.headers['x-forwarded-host'] || req.headers.host || '20-10-green-seven.vercel.app';
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const baseUrl = `${proto}://${host}`;

  const queryCode = req.query.u || req.query.code || req.query.id || req.query.to;
  let recipient = null;

  if (queryCode) {
    const q = String(queryCode).trim().toLowerCase();
    const list = Array.isArray(recipientsData.recipients) ? recipientsData.recipients : [];
    for (const item of list) {
      if (item.code && String(item.code).trim().toLowerCase() === q) {
        recipient = item;
        break;
      }
      if (Array.isArray(item.aliases) && item.aliases.some(a => String(a).trim().toLowerCase() === q)) {
        recipient = item;
        break;
      }
    }
  }

  let finalHtml = htmlTemplate;

  if (recipient) {
    const pageTitle = `Một bó hoa dành tặng ${recipient.name} · 20/10`;
    const firstLine = recipient.message
      ? recipient.message.split('\n')[0].replace(/"/g, '&quot;')
      : 'Một bó hoa và tấm thiệp nhỏ, gửi những lời chúc dịu dàng nhân ngày Phụ nữ Việt Nam 20/10.';
    const imgUrl = `${baseUrl}/${recipient.image.replace(/^\.\//, '')}`;

    // Thay thế chính xác các thẻ Meta OpenGraph & Twitter bằng URL tuyệt đối và thông tin người nhận
    finalHtml = finalHtml
      .replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`)
      .replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" id="ogTitle" content="${pageTitle}">`)
      .replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" id="ogDesc" content="${firstLine}">`)
      .replace(/<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" id="ogImage" content="${imgUrl}">`)
      .replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" id="twTitle" content="${pageTitle}">`)
      .replace(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" id="twDesc" content="${firstLine}">`)
      .replace(/<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" id="twImage" content="${imgUrl}">`);
  } else {
    // Trường hợp mã sai hoặc không có mã: fallback sang ảnh cancan.png URL tuyệt đối
    const defaultImg = `${baseUrl}/assets/imgs/cancan.png`;
    finalHtml = finalHtml
      .replace(/<meta\s+property="og:image"[^>]*>/i, `<meta property="og:image" id="ogImage" content="${defaultImg}">`)
      .replace(/<meta\s+name="twitter:image"[^>]*>/i, `<meta name="twitter:image" id="twImage" content="${defaultImg}">`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.status(200).send(finalHtml);
};
