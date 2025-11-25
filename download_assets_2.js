const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = [
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/bg_01.jpg', dir: 'images', name: 'bg_01.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/bg_02.jpg', dir: 'images', name: 'bg_02.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/bg_03.jpg', dir: 'images', name: 'bg_03.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/bg_04.jpg', dir: 'images', name: 'bg_04.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/bg_05.jpg', dir: 'images', name: 'bg_05.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/bg_06.jpg', dir: 'images', name: 'bg_06.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/bg_loading.jpg', dir: 'images', name: 'bg_loading.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/line_bg.png', dir: 'images', name: 'line_bg.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/line.png', dir: 'images', name: 'line.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/top1.gif', dir: 'images', name: 'top1.gif' }
];

const download = (url, dest) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded: ${dest}`);
        });
    }).on('error', (err) => {
        fs.unlink(dest, () => { });
        console.error(`Error downloading ${url}: ${err.message}`);
    });
};

assets.forEach(asset => {
    const dir = path.join(__dirname, asset.dir);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    download(asset.url, path.join(dir, asset.name));
});
