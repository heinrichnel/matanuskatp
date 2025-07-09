import * as fs from 'fs';
import * as path from 'path';

const uiDir = path.resolve('src/ui');
const srcDir = path.resolve('src');
const reportDir = path.resolve('integration-reports');
const firebasePatterns = ['onSnapshot', 'addDoc', 'setDoc', 'updateDoc', 'deleteDoc', 'collection'];

const usedComponents = new Set<string>();
const allUIComponents = new Set<string>();
const firebaseUsageMap: Record<string, string[]> = {};
const firestoreCollections = new Set<string>();

function walk(dir: string, fileList: string[] = []) {
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

function listUIComponents() {
  const files = fs.readdirSync(uiDir);
  files.forEach((f: string) => {
    if (f.endsWith('.tsx')) {
      const baseName = f.replace('.tsx', '');
      allUIComponents.add(baseName);
    }
  });
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

function writeMarkdown(unused: string[]) {
  let md = `# 🔍 Integration Report\n\n`;
  md += `## 🧱 UI Component Usage\n`;
  md += `- Total in /ui: ${allUIComponents.size}\n`;
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

function writeJSON(unused: string[]) {
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
