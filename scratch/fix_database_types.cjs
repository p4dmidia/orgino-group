const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/types/database.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original content length:', content.length);

// Let's find literal '\n' (two characters: \ and n) in the file content.
const hasBackslashN = content.includes('\\n');
console.log('Contains literal \\n:', hasBackslashN);

if (hasBackslashN) {
  // Replace '\n' with actual newline
  content = content.replace(/\\n/g, '\n');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully replaced literal \\n with actual newlines!');
} else {
  console.log('No literal \\n found.');
}
