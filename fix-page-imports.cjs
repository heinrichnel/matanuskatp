#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript/TSX files in src/pages directory
const files = glob.sync('src/pages/**/*.{ts,tsx}', { absolute: true });

files.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix import paths from ../../components to ../components
    content = content.replace(/from ['"]\.\.\/\.\.\/components/g, (match) => {
      modified = true;
      return match.replace('../../components', '../components');
    });

    // Fix import paths from ../../context to ../context
    content = content.replace(/from ['"]\.\.\/\.\.\/context/g, (match) => {
      modified = true;
      return match.replace('../../context', '../context');
    });

    // Fix import paths from ../../hooks to ../hooks
    content = content.replace(/from ['"]\.\.\/\.\.\/hooks/g, (match) => {
      modified = true;
      return match.replace('../../hooks', '../hooks');
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed imports in: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log('Import path fixing complete!');
