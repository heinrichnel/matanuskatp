import fs from 'fs';
import path from 'path';

const uiDir = path.resolve('src/components'); // <-- CHANGED TO COMPONENTS
const srcDir = path.resolve('src');
const reportDir = path.resolve('integration-reports');
const firebasePatterns = ['onSnapshot', 'addDoc', 'setDoc', 'updateDoc', 'deleteDoc', 'collection'];

const usedComponents = new Set();
const allUIComponents = new Set();
const firebaseUsageMap = {};
const firestoreCollections = new Set();

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// Recursively find all components as atomic units (either .tsx in root or index.tsx in subfolders)
function listUIComponents() {
  function findComponents(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(f => {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        // Support index.tsx as a component in folders
        const indexTsx = path.join(fullPath, 'index.tsx');
        if (fs.existsSync(indexTsx)) {
          allUIComponents.add(f);
        }
        // Also recursively scan deeper folders
        findComponents(fullPath);
      } else if (f.endsWith('.tsx')) {
        // Only add atomic components (no .stories.tsx, .test.tsx, etc.)
        if (!f.endsWith('.stories.tsx') && !f.endsWith('.test.tsx')) {
          allUIComponents.add(f.replace('.tsx', ''));
        }
      }
    });
  }
  findComponents(uiDir);
}

function scanSourceFiles() {
  const files = walk(srcDir);
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);

    for (const comp of allUIComponents) {
      const pattern = new RegExp(`\\b${comp}\\b`, 'g');
      if (pattern.test(content)) {
        usedComponents.add(comp);
      }
    }

    firebasePatterns.forEach(pattern => {
      if (content.includes(pattern)) {
        if (!firebaseUsageMap[pattern]) {
          firebaseUsageMap[pattern] = [];
        }
        firebaseUsageMap[pattern].push(relativePath);
      }
    });

    // Match Firestore collection names like collection(db, 'trips')
    const collectionRegex = /collection\s*\(.*?,\s*['"`](\w+)['"`]\)/g;
    let match;
    while ((match = collectionRegex.exec(content)) !== null) {
      firestoreCollections.add(match[1]);
    }
  }
}

function writeMarkdown(unused) {
  let md = `# 🔍 Integration Report\n\n`;
  md += `## 🧱 UI Component Usage\n`;
  md += `- Total in /components: ${allUIComponents.size}\n`;
  md += `- Used: ${usedComponents.size}\n`;
  md += `- Unused: ${unused.length}\n`;
  if (unused.length > 0) {
    md += `\n### ❗ Unused Components\n`;
    unused.forEach(comp => md += `- ${comp}\n`);
  } else {
    md += `\n✅ All components are used.\n`;
  }

  md += `\n## 🔗 Firebase API Usage\n`;
  Object.entries(firebaseUsageMap).forEach(([key, files]) => {
    md += `\n### ${key} used in:\n`;
    files.forEach(file => md += `- ${file}\n`);
  });

  md += `\n## 📂 Firestore Collections Referenced\n`;
  firestoreCollections.forEach(col => {
    md += `- \`${col}\`\n`;
  });

  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, 'integration-report.md'), md, 'utf8');
}

function writeJSON(unused) {
  const data = {
    uiComponents: {
      total: allUIComponents.size,
      used: [...usedComponents],
      unused
    },
    firebaseUsage: firebaseUsageMap,
    firestoreCollections: [...firestoreCollections]
  };
  fs.writeFileSync(path.join(reportDir, 'integration-report.json'), JSON.stringify(data, null, 2), 'utf8');
}

function run() {
  listUIComponents();
  scanSourceFiles();
  const unused = [...allUIComponents].filter(comp => !usedComponents.has(comp));
  writeMarkdown(unused);
  writeJSON(unused);
  console.log('✅ Integration report written to /integration-reports/');
}

run();
