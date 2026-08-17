const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const frontendApp = path.join(__dirname, 'frontend', 'src', 'app');
const files = walk(frontendApp);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix muddy sidebar and cards to beautiful glassmorphism
  if (content.includes('bg-gray-800/50')) {
    content = content.replace(/bg-gray-800\/50/g, 'bg-black/30 backdrop-blur-xl');
    changed = true;
  }
  
  if (content.includes('border-gray-700/50')) {
    content = content.replace(/border-gray-700\/50/g, 'border-white/20');
    changed = true;
  }
  
  // Also fix standard gray-800 (used in modals)
  if (content.includes('bg-gray-800')) {
    content = content.replace(/bg-gray-800/g, 'bg-black/50 backdrop-blur-2xl border-white/20');
    changed = true;
  }

  // Remove duplicate nav links that might have stacked up
  const leaderboardLink = '<Link href="/admin/leaderboard" className="block hover:text-white">Leaderboard</Link>';
  const certificatesLink = '<Link href="/admin/certificates" className="block hover:text-white">Certificates</Link>';
  
  if (content.split(leaderboardLink).length > 2) {
    // Found duplicates
    content = content.replace(leaderboardLink, ''); // removes one instance
    content = content.replace(/^\s*\n/gm, ''); // clean up empty lines roughly
    changed = true;
  }
  
  if (content.split(certificatesLink).length > 2) {
    // Found duplicates
    content = content.replace(certificatesLink, ''); // removes one instance
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Polished ${file}`);
  }
});
