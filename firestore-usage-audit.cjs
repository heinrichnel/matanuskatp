const fs = require('fs');
const path = require('path');

function scanDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) scanDir(p, callback);
    else callback(p);
  });
}

const FIRESTORE_FUNCTIONS = [
  'collection',
  'doc',
  'setDoc',
  'getDocs',
  'addDoc',
  'updateDoc',
  'deleteDoc',
  'onSnapshot'
];

const matches = [];

scanDir('./src', (file) => {
  if (!file.endsWith('.ts') && !file.endsWith('.tsx')) return;
  const content = fs.readFileSync(file, 'utf8');
  FIRESTORE_FUNCTIONS.forEach(fn => {
    const regex = new RegExp(`${fn}\\([\\s\\S]*?['"\`](.*?)['"\`]`, 'g');
    let m;
    while ((m = regex.exec(content)) !== null) {
      matches.push({ file, function: fn, collection: m[1] });
    }
  });
});

console.table(matches);
