const { execSync } = require('child_process');
const path = require('path');

const ffmpegPath = 'C:\\Users\\CHAUDHARI VATSAL\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0.1-full_build\\bin\\ffmpeg.exe';
const videoUrl = 'https://video-public.canva.com/VADxyv2YQuc/v/8f0eb27990.mp4?bandwidth=825516&resolution=1280';
const outputPath = 'e:\\scaloy\\lms\\frontend\\public\\videos\\canva-presentation-full.mp4';

console.log('Downloading video with ffmpeg...');
try {
  execSync(`"${ffmpegPath}" -i "${videoUrl}" -c copy "${outputPath}" -y`, { stdio: 'inherit' });
  const fs = require('fs');
  const stat = fs.statSync(outputPath);
  console.log('Downloaded:', outputPath, 'Size:', stat.size, 'bytes');
} catch (e) {
  console.error('Error:', e.message);
}
