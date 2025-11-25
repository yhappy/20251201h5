document.addEventListener('DOMContentLoaded', function () {
    // 初始化加载动画
    startLoadingAnimation();

    // 检测是否为移动设备
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        adaptToMobile(); // 移动端适配
    }

    setTimeout(function () {
        // 如果播放器最初是可见的，则将其隐藏（原始逻辑）
        // 在我们的案例中，它通过 CSS display:none 隐藏
    }, 1000);

    // 初始化事件监听
    initEventListeners();
});

/**
 * 适配移动端窗口大小
 * 将横屏内容旋转以适应竖屏手机
 */
function adaptToMobile() {
    var windowHeight = window.innerHeight;

    var loadingEl = document.querySelector('.loading');
    loadingEl.classList.add('main-phone');
    loadingEl.style.width = windowHeight + 'px';

    var containerEl = document.querySelector('.container');
    containerEl.classList.add('main-phone2');

    var musicBtnEl = document.querySelector('.pl_bt');
    musicBtnEl.classList.add('pl_bt2');

    setTimeout(function () {
        window.scrollTo(0, 0);
    }, 100);
}

/**
 * 开始加载页面的进度条动画
 */
function startLoadingAnimation() {
    var loadingEl = document.querySelector('.loading');
    loadingEl.style.display = 'block';

    var progressLine = document.querySelector(".progress");
    var progressValue = 0;
    var maxProgress = 778; // 进度条最大宽度

    function animateProgress() {
        if (parseInt(progressLine.offsetWidth) < maxProgress) {
            progressValue += 20;
            if (progressValue > maxProgress) progressValue = maxProgress;
            progressLine.style.width = progressValue + 'px';
            requestAnimationFrame(animateProgress);
        } else {
            // 加载完成，显示开始按钮
            document.querySelector(".p0_tips").style.display = 'block';
            // 隐藏加载中的提示（如果有）
            var loadingText = document.querySelector(".p0_loading");
            if (loadingText) loadingText.style.display = 'none';
        }
    }
    requestAnimationFrame(animateProgress);
}

/**
 * 进入主场景
 * 隐藏加载页，显示主容器，播放音乐和视频
 */
function enterMainScene() {
    toggleBackgroundMusic(true); // 强制播放音乐
    document.querySelector('.loading').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    document.querySelector('.pl_bt').style.display = 'block';

    // 延时显示标题和提示
    setTimeout(function () {
        fadeInElement(document.querySelector(".img1"));
    }, 800);
    setTimeout(function () {
        fadeInElement(document.querySelector(".dianjijiaoshui0"));
    }, 2800);

    // 播放所有背景视频
    const videos = document.getElementsByClassName('bgVideo');
    for (let i = 0; i < videos.length; i++) {
        videos[i].play().catch(e => console.log("视频播放失败:", e));
    }
}

/**
 * 更新容器宽度以实现横向滚动效果
 * @param {number} width - 新的容器宽度
 */
function updateContainerWidth(width) {
    document.querySelector('.container').style.width = width + 'px';
}

/**
 * 切换背景音乐播放状态
 * @param {boolean|number} forcePlay - 1 或 true 强制播放，否则切换播放/暂停
 */
function toggleBackgroundMusic(forcePlay) {
    var audio = document.getElementById('music');
    if (!audio) {
        return;
    }

    var iconOn = document.querySelector('.yy1'); // 播放图标
    var iconOff = document.querySelector('.yy2'); // 暂停图标

    if (forcePlay == 1 || forcePlay === true) {
        audio.play().catch(e => console.log("音频播放失败:", e));
        iconOn.style.display = 'block';
        iconOff.style.display = 'none';
    } else if (audio.paused) {
        audio.play().catch(e => console.log("音频播放失败:", e));
        iconOn.style.display = 'block';
        iconOff.style.display = 'none';
    } else {
        audio.pause();
        iconOn.style.display = 'none';
        iconOff.style.display = 'block';
    }
}

/**
 * 元素淡入效果
 * @param {HTMLElement} element - 需要淡入的元素
 */
function fadeInElement(element) {
    if (!element) return;
    element.style.opacity = 0;
    element.style.display = 'block';

    var lastTime = +new Date();
    var tick = function () {
        element.style.opacity = +element.style.opacity + (new Date() - lastTime) / 400;
        lastTime = +new Date();
        if (+element.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };
    tick();
}

/**
 * 初始化所有交互事件
 */
function initEventListeners() {
    // 开始按钮
    document.getElementById('startBtn').addEventListener('click', enterMainScene);

    // 音乐按钮
    document.getElementById('musicBtn').addEventListener('click', function () { toggleBackgroundMusic(); });
    document.getElementById('loadingMusicBtn').addEventListener('click', function () { toggleBackgroundMusic(); });

    // 展开按钮 (第一部分 -> 第二部分)
    document.getElementById('expandBtn').addEventListener('click', function () {
        updateContainerWidth(17140);
        document.querySelector('.part2').style.display = 'block';
        this.style.display = 'none';
        document.querySelector('.img6').style.display = 'block';
    });

    // 第二部分弹窗 (老物件)
    document.getElementById('p2PopupBtn').addEventListener('click', function () {
        document.getElementById('p2PopupImg').style.display = 'block';
    });
    document.getElementById('p2PopupImg').addEventListener('click', function (e) {
        this.style.display = 'none';
        e.stopPropagation();
    });

    // 浇水按钮 1 (第二部分 -> 第三部分)
    document.getElementById('waterBtn1').addEventListener('click', function () {
        this.style.opacity = '1';
        updateContainerWidth(26308);
        document.querySelector('.part3').style.display = 'block';
        document.querySelector('.dianjijiaoshui').style.display = 'block';
    });

    // 第三部分弹窗 (三个弹窗)
    ['1', '2', '3'].forEach(function (num) {
        document.getElementById('p3PopupBtn' + num).addEventListener('click', function () {
            document.getElementById('p3PopupImg' + num).style.display = 'block';
        });
        document.getElementById('p3PopupImg' + num).addEventListener('click', function (e) {
            this.style.display = 'none';
            e.stopPropagation();
        });
    });

    // 浇水按钮 2 (第三部分 -> 第四部分)
    document.getElementById('waterBtn2').addEventListener('click', function () {
        this.style.opacity = '1';
        updateContainerWidth(32525);
        document.querySelector('.part4').style.display = 'block';
        document.querySelector('.dianjijiaoshui2').style.display = 'block';
    });

    // 视频弹窗 (第四部分)
    document.getElementById('videoPopupBtn').addEventListener('click', function () {
        document.querySelector('.fjsen-player').style.display = 'block';
        document.getElementById('videoPopupCloseBtn').style.display = 'block';
    });
    document.getElementById('videoPopupCloseBtn').addEventListener('click', function () {
        document.querySelector('.fjsen-player').style.display = 'none';
        this.style.display = 'none';
    });

    // 浇水按钮 3 (第四部分 -> 第五部分 & 第六部分)
    document.getElementById('waterBtn3').addEventListener('click', function () {
        this.style.opacity = '1';
        updateContainerWidth(50259);
        document.querySelector('.part5').style.display = 'block';
        document.querySelector('.part6').style.display = 'block';
        document.querySelector('.dianjijiaoshui3').style.display = 'block';
    });
}
