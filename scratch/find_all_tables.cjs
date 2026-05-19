const fs = require('fs');
const path = require('path');

const srcDir = 'c:/Users/eu/Documents/P4D/Projetos/orgino group/src';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);
const tableRegex = /\.from\(['"]([^'"]+)['"]\)/g;
const tables = new Set();

allFiles.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = tableRegex.exec(content)) !== null) {
      tables.add(match[1]);
    }
  }
});

console.log('--- TABLES FOUND IN CODE ---');
console.log(Array.from(tables).sort().join('\n'));
