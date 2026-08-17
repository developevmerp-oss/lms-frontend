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

  // Replace bg-gray-900 in dashboards
  if (content.includes('bg-gray-900')) {
    content = content.replace(/bg-gray-900/g, 'bg-transparent');
    changed = true;
  }

  // Remove local backgrounds from login/register
  if (content.includes("bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')]")) {
    content = content.replace(/bg-\[url\('[^']+'\)\] bg-cover bg-center/g, '');
    changed = true;
  }

  if (content.includes('<div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>')) {
    content = content.replace(/<div className="absolute inset-0 bg-black\/50 backdrop-blur-sm z-0"><\/div>/g, '');
    changed = true;
  }

  // Fix admin sidebar links
  if (content.includes('<Link href="/admin/students"')) {
    // Replace students with Leaderboard
    content = content.replace(
      /<Link href="\/admin\/students"(.*?)>Students<\/Link>/g,
      '<Link href="/admin/leaderboard"$1>Leaderboard</Link>\n            <Link href="/admin/certificates"$1>Certificates</Link>'
    );
    changed = true;
  }
  
  if (content.includes('<Link href="/admin/rewards"')) {
    content = content.replace(
      /<Link href="\/admin\/rewards"(.*?)>Rewards<\/Link>/g,
      ''
    );
    changed = true;
  }
  
  if (content.includes('<Link href="/student/rewards"')) {
    content = content.replace(
      /<Link href="\/student\/rewards"(.*?)>Rewards<\/Link>/g,
      '<Link href="/student/certificates"$1>Certificates</Link>'
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
