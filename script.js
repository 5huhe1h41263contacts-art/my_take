```javascript
// script.js

const fs = require("fs");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

// ▼ 取得したいチラシページURL
const TARGET_URL = "https://example.com/flyers";

async function main() {
  const res = await fetch(TARGET_URL);
  const html = await res.text();

  const $ = cheerio.load(html);

  const images = [];

  // ▼ 必要に応じて調整
  $("img").each((i, el) => {
    const src = $(el).attr("src");
    if (src) images.push(src);
  });

  // ▼ HTML生成（あなたの完成版ベース）
  const content = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="robots" content="noindex">
<style>
body { margin:0; background:#000; }
.container {
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:10px;
  padding:10px;
}
img { width:100%; object-fit:contain; }
</style>
</head>

<body>
<div class="container">
${images.map(src => `<img src="${src}">`).join("\n")}
</div>
</body>
</html>
`;

  fs.writeFileSync("index.html", content);
}

main();
```
