const fs = require('fs');
const https = require('https');
const path = require('path');

const assets = [
    // CSS
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/css70084.css', dir: 'css', name: 'style.css' },

    // Images
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/loading_img.png', dir: 'images', name: 'loading_img.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p0-tips.png', dir: 'images', name: 'p0-tips.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/loading_music.png', dir: 'images', name: 'loading_music.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/img1.png', dir: 'images', name: 'img1.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/tips.png', dir: 'images', name: 'tips.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/img2new.png', dir: 'images', name: 'img2new.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/img3.png', dir: 'images', name: 'img3.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/img4.png', dir: 'images', name: 'img4.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p1_gif.gif', dir: 'images', name: 'p1_gif.gif' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/img5.png', dir: 'images', name: 'img5.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p2_img_gai.jpg', dir: 'images', name: 'p2_img_gai.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p2_img_gai2.jpg', dir: 'images', name: 'p2_img_gai2.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p2_lwj.png', dir: 'images', name: 'p2_lwj.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p3_tc_1.png', dir: 'images', name: 'p3_tc_1.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p3_tc_2.png', dir: 'images', name: 'p3_tc_2.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p3_tc_3.png', dir: 'images', name: 'p3_tc_3.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p3_img_gai_a.jpg', dir: 'images', name: 'p3_img_gai_a.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p4_img_gai.jpg', dir: 'images', name: 'p4_img_gai.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/p4_img_gai_2.jpg', dir: 'images', name: 'p4_img_gai_2.jpg' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/wei1.png', dir: 'images', name: 'wei1.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/wei2.png', dir: 'images', name: 'wei2.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/play_on.png', dir: 'images', name: 'play_on.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/play_off.png', dir: 'images', name: 'play_off.png' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/fx.jpg', dir: 'images', name: 'fx.jpg' },

    // Videos
    { url: 'https://cdnmedia.fjsen.com/mp4/202510/14/1760419061.mp4', dir: 'media', name: 'intro.mp4' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/jiaoshui.mp4', dir: 'media', name: 'jiaoshui.mp4' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/shu2.mp4', dir: 'media', name: 'shu2.mp4' },
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/shu3.mp4', dir: 'media', name: 'shu3.mp4' },

    // Audio
    { url: 'https://fjsenresource.fjsen.com/resource/templateRes/202510/14/70084/70084/bgm3.mp3', dir: 'media', name: 'bgm3.mp3' }
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
        fs.unlink(dest, () => { }); // Delete the file async. (But we don't check the result)
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
