const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend', 'src', 'components', 'dashboard');
const files = fs.readdirSync(dir);

files.forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.startsWith('"use client";')) {
      fs.writeFileSync(filePath, '"use client";\n\n' + content, 'utf8');
      console.log(`Added "use client" to ${file}`);
    }
  }
});
