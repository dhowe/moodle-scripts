const path = require("path");
const fs = require("fs");
const files = [];
const result = {};

function readDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const absolute = path.join(dir, file);
    return (fs.statSync(absolute).isDirectory())
      ? readDir(absolute) :
      files.push(absolute);
  });
}

function extractLinkFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const linkMatch = content.match(/https:\/\/git\.arts\.ac\.uk\/[^\s<"']+/);
  return linkMatch ? linkMatch[0] : null;
}

readDir("./cc2-subs");
files.forEach(file => {
  const link = extractLinkFromFile(file);
  if (link) {
    let folderName = path.basename(path.dirname(file));
    folderName = folderName.replace(/_[0-9]+_assignsubmission_onlinetext/g, '');
    //console.log(`${folderName},${link}`);
    result[folderName] = link;
  }
});

// output csv format
Object.keys(result).sort()
  .forEach(key => console.log(`${key},${result[key]}`));
