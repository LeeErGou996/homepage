/**
 * 为 verbs.json 中每个动词添加完成时 (perfekt) 字段
 * 运行: node scripts/add-perfekt.js
 */
const fs = require('fs');
const path = require('path');

const verbsPath = path.join(__dirname, '..', 'verbs.json');
const mapPath = path.join(__dirname, 'perfekt-map.json');

const verbs = JSON.parse(fs.readFileSync(verbsPath, 'utf8'));
const perfektMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

let missing = [];
for (const entry of verbs) {
  const word = entry.word && entry.word.trim();
  if (!word) continue;
  const perfekt = perfektMap[word];
  if (perfekt) {
    entry.perfekt = perfekt;
  } else {
    missing.push(word);
  }
}

if (missing.length > 0) {
  console.error('以下动词在 perfekt-map.json 中未找到，请补充：');
  console.error(missing.join(', '));
  process.exit(1);
}

fs.writeFileSync(verbsPath, JSON.stringify(verbs, null, 4), 'utf8');
console.log('已为 ' + verbs.length + ' 个动词添加 perfekt 字段。');
