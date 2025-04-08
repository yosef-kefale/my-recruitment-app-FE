const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const OLD_API_URL = 'http://196.188.249.24:3010/api';
const NEW_API_URL = 'https://196.188.249.24:3010/api';
const SRC_DIR = path.join(__dirname, '..', 'src');

// Function to recursively find all files in a directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to update API URLs in a file
function updateApiUrls(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace direct API URL references
  content = content.replace(new RegExp(OLD_API_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_API_URL);
  
  // If the file was modified, write it back
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated API URLs in: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main function
function main() {
  console.log('Finding all source files...');
  const files = findFiles(SRC_DIR);
  console.log(`Found ${files.length} files to check.`);
  
  let updatedCount = 0;
  
  files.forEach(file => {
    if (updateApiUrls(file)) {
      updatedCount++;
    }
  });
  
  console.log(`\nUpdate complete! Updated ${updatedCount} files.`);
  console.log('\nNext steps:');
  console.log('1. Review the changes in your code editor');
  console.log('2. Test the application locally');
  console.log('3. Commit the changes');
  console.log('4. Redeploy to Vercel');
}

// Run the script
main(); 