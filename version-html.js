#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { parse } = require('url');

const CONFIG = {
    inputFile: process.argv[2] || 'index.html',
    version: process.argv[3] || getDefaultVersion(),
    verbose: true,
    debug: process.argv.includes('--debug')
};

function getDefaultVersion() {
    const now = new Date();
    return now.getFullYear().toString() +
        padZero(now.getMonth() + 1) +
        padZero(now.getDate()) +
        padZero(now.getHours()) +
        padZero(now.getMinutes()) +
        padZero(now.getSeconds());
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

function isResourceUrl(url) {
    if (!url || typeof url !== 'string') return false;

    const resourceExts = [
        '.js', '.css', '.ts', '.jsx', '.tsx', '.mjs', '.cjs',
        '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg', '.ico',
        '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v',
        '.mp3', '.wav', '.aac', '.ogg', '.flac', '.wma', '.m3u8',
        '.woff', '.woff2', '.ttf', '.otf', '.eot',
        '.json', '.map', '.txt', '.xml', '.pdf'
    ];

    // 检查扩展名
    const ext = path.extname(url.split('?')[0]).toLowerCase(); // 忽略查询参数
    if (resourceExts.includes(ext)) return true;

    // 检查路径关键字
    const resourceKeywords = ['/js/', '/css/', '/images/', '/img/', '/assets/', '/static/'];
    const cleanUrl = url.split('?')[0]; // 忽略查询参数
    return resourceKeywords.some(keyword => cleanUrl.includes(keyword));
}

function addVersionParam(url, version) {
    if (!isResourceUrl(url)) return url;

    try {
        const parsed = parse(url, true);
        const params = new URLSearchParams(parsed.search);

        // **强制更新为最新版本**
        params.set('v', version);

        // 对于外部URL，需要保持协议和主机名
        if (url.startsWith('http://') || url.startsWith('https://')) {
            const baseUrl = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
            const separator = '?';
            return `${baseUrl}${separator}${params.toString()}`;
        } else {
            // 本地资源，使用原有的逻辑
            let baseUrl = url.split('?')[0];
            const separator = baseUrl.includes('?') ? '&' : '?';
            return `${baseUrl}${separator}${params.toString()}`;
        }
    } catch (error) {
        // 清理所有查询参数，只添加新版本
        const cleanUrl = url.split('?')[0];
        return `${cleanUrl}?v=${version}`;
    }
}

/**
 * **终极修复：精准匹配 URL（支持 ?v= 参数）**
 */
function processHtmlContent(html, version) {
    let processed = html;
    let changeCount = 0;

    if (CONFIG.debug) {
        console.log('\n🔍 调试模式：开始精准匹配...');
    }

    // **核心修复：URL 边界匹配**
    // 使用 (?="|') 确保只匹配引号内的完整 URL

    // 1. 处理 <img src="...">
    processed = processed.replace(
        /<img\s+[^>]*src\s*=\s*(["'])([^"']*?)(?=\1)/gi,
        (match, quote, src) => {
            const trimmedSrc = src.trim();
            if (isResourceUrl(trimmedSrc) && trimmedSrc) {
                const newSrc = addVersionParam(trimmedSrc, version);
                changeCount++;
                if (CONFIG.debug) console.log(`✅ IMG: "${trimmedSrc}" → "${newSrc}"`);
                return match.replace(src, newSrc);
            }
            return match;
        }
    );

    // 2. 处理 <script src="...">
    processed = processed.replace(
        /<script\s+[^>]*src\s*=\s*(["'])([^"']*?)(?=\1)/gi,
        (match, quote, src) => {
            const trimmedSrc = src.trim();
            if (isResourceUrl(trimmedSrc) && trimmedSrc) {
                const newSrc = addVersionParam(trimmedSrc, version);
                changeCount++;
                if (CONFIG.debug) console.log(`✅ SCRIPT: "${trimmedSrc}" → "${newSrc}"`);
                return match.replace(src, newSrc);
            }
            return match;
        }
    );

    // 3. 处理 <link href="...">
    processed = processed.replace(
        /<link\s+[^>]*href\s*=\s*(["'])([^"']*?)(?=\1)/gi,
        (match, quote, href) => {
            const trimmedHref = href.trim();
            if (isResourceUrl(trimmedHref) && trimmedHref) {
                const newHref = addVersionParam(trimmedHref, version);
                changeCount++;
                if (CONFIG.debug) console.log(`✅ LINK: "${trimmedHref}" → "${newHref}"`);
                return match.replace(href, newHref);
            }
            return match;
        }
    );

    // 4. 处理 <video src="...">
    processed = processed.replace(
        /<video\s+[^>]*src\s*=\s*(["'])([^"']*?)(?=\1)/gi,
        (match, quote, src) => {
            const trimmedSrc = src.trim();
            if (isResourceUrl(trimmedSrc) && trimmedSrc) {
                const newSrc = addVersionParam(trimmedSrc, version);
                changeCount++;
                if (CONFIG.debug) console.log(`✅ VIDEO-SRC: "${trimmedSrc}" → "${newSrc}"`);
                return match.replace(src, newSrc);
            }
            return match;
        }
    );

    // 5. 处理 <video poster="...">
    processed = processed.replace(
        /<video\s+[^>]*poster\s*=\s*(["'])([^"']*?)(?=\1)/gi,
        (match, quote, poster) => {
            const trimmedPoster = poster.trim();
            if (isResourceUrl(trimmedPoster) && trimmedPoster) {
                const newPoster = addVersionParam(trimmedPoster, version);
                changeCount++;
                if (CONFIG.debug) console.log(`✅ VIDEO-POSTER: "${trimmedPoster}" → "${newPoster}"`);
                return match.replace(poster, newPoster);
            }
            return match;
        }
    );

    // 6. 处理 <source src="...">
    processed = processed.replace(
        /<source\s+[^>]*src\s*=\s*(["'])([^"']*?)(?=\1)/gi,
        (match, quote, src) => {
            const trimmedSrc = src.trim();
            if (isResourceUrl(trimmedSrc) && trimmedSrc) {
                const newSrc = addVersionParam(trimmedSrc, version);
                changeCount++;
                if (CONFIG.debug) console.log(`✅ SOURCE: "${trimmedSrc}" → "${newSrc}"`);
                return match.replace(src, newSrc);
            }
            return match;
        }
    );

    // 7. 处理 <audio src="...">
    processed = processed.replace(
        /<audio\s+[^>]*src\s*=\s*(["'])([^"']*?)(?=\1)/gi,
        (match, quote, src) => {
            const trimmedSrc = src.trim();
            if (isResourceUrl(trimmedSrc) && trimmedSrc) {
                const newSrc = addVersionParam(trimmedSrc, version);
                changeCount++;
                if (CONFIG.debug) console.log(`✅ AUDIO: "${trimmedSrc}" → "${newSrc}"`);
                return match.replace(src, newSrc);
            }
            return match;
        }
    );

    // 8. 处理 CSS url()
    processed = processed.replace(
        /url\s*\(\s*(["']?)([^"')]+?)\1\s*\)/gi,
        (match, quote, url) => {
            const trimmedUrl = url.trim();
            if (isResourceUrl(trimmedUrl) && trimmedUrl) {
                const newUrl = addVersionParam(trimmedUrl, version);
                changeCount++;
                if (CONFIG.debug) console.log(`✅ CSS-URL: "${trimmedUrl}" → "${newUrl}"`);
                return `url(${quote}${newUrl}${quote})`;
            }
            return match;
        }
    );

    // 9. 处理 JavaScript 字符串中的URL（包含 http:// 或 https:// 的资源）
    processed = processed.replace(
        /["']((https?:\/\/[^"']*\.(?:jpg|jpeg|png|gif|webp|bmp|svg|ico|mp4|avi|mov|wmv|flv|webm|mkv|m4v|mp3|wav|aac|ogg|flac|wma|m3u8|woff|woff2|ttf|otf|eot|js|css|json|map|txt|xml|pdf)(?:\?[^"']*)?))["']/gi,
        (match, url) => {
            const trimmedUrl = url.trim();
            if (isResourceUrl(trimmedUrl) && trimmedUrl) {
                const newUrl = addVersionParam(trimmedUrl, version);
                changeCount++;
                if (CONFIG.debug) console.log(`✅ JS-URL: "${trimmedUrl}" → "${newUrl}"`);
                return `"${newUrl}"`;
            }
            return match;
        }
    );

    if (CONFIG.debug) {
        console.log(`📊 总共处理资源: ${changeCount} 个\n`);
    }

    return { content: processed, changes: changeCount };
}

function processIndexHtml() {
    const { inputFile, version } = CONFIG;
    const fullPath = path.resolve(inputFile);

    if (!fs.existsSync(fullPath)) {
        console.error(`❌ 错误: 找不到文件 ${inputFile}`);
        process.exit(1);
    }

    console.log(`🚀 开始处理: ${inputFile}`);
    console.log(`🔖 版本号: ${version}`);

    try {
        const originalContent = fs.readFileSync(fullPath, 'utf8');
        const { content: processedContent, changes } = processHtmlContent(originalContent, version);

        fs.writeFileSync(fullPath, processedContent, 'utf8');

        console.log('='.repeat(60));
        console.log('✅ 处理完成！');
        console.log(`📄 文件: ${path.relative(process.cwd(), fullPath)}`);
        console.log(`🔄 处理资源: ${changes} 个`);
        console.log(`🔖 版本号: ${version}`);
        if (changes === 0) {
            console.log(`⚠️  未找到资源链接，建议使用 --debug`);
        }
        console.log('='.repeat(60));

    } catch (error) {
        console.error(`❌ 处理失败: ${error.message}`);
        process.exit(1);
    }
}

function showHelp() {
    console.log(`
使用方法:
  node version-html.js [input.html] [version] [--debug]

✅ 终极修复：
  • 精准匹配引号内完整URL（包括 ?v= 参数）
  • 支持 assets/ 路径
  • 强制更新所有版本号
  • 兼容所有HTML格式

测试用例：
  src="assets/bird.gif?v=20251021092748"
  → src="assets/bird.gif?v=20251021100000"

示例：
  node version-html.js --debug
    `);
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
}

if (require.main === module) {
    processIndexHtml();
}