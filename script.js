```javascript
const fs = require("fs");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

// ▼ あなたのチラシページ
const TARGET_URL = "https://www.spotgroup.co.jp/leaflet/bunka/";

async function main() {
  const res = await fetch(TARGET_URL);
  const html = await res.text();

  const $ = cheerio.load(html);

  const images = [];

  // ▼ チラシ画像だけ取得
  $("img.SetImg").each((i, el) => {
    let src = $(el).attr("src");

    if (src) {
      // 相対パス対策（念のため）
      if (src.startsWith("/")) {
        src = "https://www.spotgroup.co.jp" + src;
      }

      images.push(src);
    }
  });

  // ▼ HTML生成
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
img {
  width:100%;
  height:100vh;
  object-fit:contain;
}
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
