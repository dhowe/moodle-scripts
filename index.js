const fs = require('fs');
const path = require('path');

// Replace 'directory' with your target directory
const directoryPath = path.join(__dirname, './cc2-subs');
const table = {};

function extractLinkFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const linkMatch = content.match(/https:\/\/git\.arts\.ac\.uk\/[^\s<"']+/);
  return linkMatch ? linkMatch[0] : null;
}

async function readFilesRecursively(dir) {

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${dir}: `, err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error(`Error stating file ${filePath}: `, err);
          return;
        }

        if (stat.isDirectory()) {
          readFilesRecursively(filePath);
        } 
        else if (stat.isFile() && path.basename(filePath) === 'onlinetext.html') {
          const link = extractLinkFromFile(filePath);
          if (link) {
            let folderName = path.basename(path.dirname(filePath));
            folderName = folderName.replace(/_[0-9]+_assignsubmission_onlinetext/g, '');
            console.log(`${folderName},${link}`);
          }
        }
      });
    });
  });
}

readFilesRecursively(directoryPath);
