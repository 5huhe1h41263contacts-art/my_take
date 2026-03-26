const fs = require("fs");
const fetch = require("node-fetch");

const STORE = "muikakitamachi";
const BASE_URL = "https://www.spotgroup.co.jp/leaflet/bunka/";

// ▼ 日付フォーマット
function format(d) {
  return d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
}

// ▼ 日付候補を大量生成（ここがポイント）
function generateDateRanges() {
  const ranges = [];
  const today = new Date();

  for (let i = -7; i <= 7; i++) { // 前後1週間
    const start = new Date(today);
    start.setDate(start.getDate() + i);

    for (let len = 2; len <= 7; len++) { // 2〜7日間チラシ
      const end = new Date(start);
      end.setDate(end.getDate() + len);

      ranges.push(`${format(start)}_${format(end)}`);
    }
  }

  return ranges;
}

// ▼ URL存在チェック
async function findValidImages() {
  const ranges = generateDateRanges();

  for (const r of ranges) {
    const front = `${BASE_URL}spot_${r}_${STORE}_front.jpg`;
    const back  = `${BASE_URL}spot_${r}_${STORE}_back.jpg`;

    try {
      const res = await fetch(front);
      if (res.status === 200) {
        return [front, back];
      }
    } catch (e) {}
  }

  return [];
}

async function main() {
  const images = await findValidImages();

  console.log(images);

  const content = `
<!DOCTYPE html>
<html>
<head>
<meta name="robots" content="noindex">
<style>
body { margin:0; background:black; }
img { width:100%; height:100vh; object-fit:contain; }
</style>
</head>
<body>
${images.map(src => `<img src="${src}">`).join("")}
</body>
</html>
`;

  fs.writeFileSync("index.html", content);
}

main();
