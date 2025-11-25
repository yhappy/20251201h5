document.addEventListener('DOMContentLoaded', function () {
    loading();

    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        changeWindow(); // 移动端适配
    }

    setTimeout(function () {
        // 如果播放器最初是可见的，则将其隐藏（原始逻辑）
        // $('.fjsen-player').hide(); 
        // 在我们的案例中，它通过 CSS display:none 隐藏
    }, 1000);

    initEvents();
});

function changeWindow() {
    var sjhh = window.innerHeight;
    var sjww = window.innerWidth;

    var loadingEl = document.querySelector('.loading');
    loadingEl.classList.add('main-phone');
    loadingEl.style.width = sjhh + 'px';

    var containerEl = document.querySelector('.container');
    containerEl.classList.add('main-phone2');

    var plBtEl = document.querySelector('.pl_bt');
    plBtEl.classList.add('pl_bt2');

    setTimeout(function () {
        window.scrollTo(0, 0);
        // $(".bg_01").scrollTop(0); // 原始代码中的选择器似乎有误（bg_01 通常是背景图片的类），但保留原意。
    }, 100);
}

function loading() {
    var loadingEl = document.querySelector('.loading');
    loadingEl.style.display = 'block';

    var progressLine = document.querySelector(".progress");
    var a = 0;

    function fn() {
        if (parseInt(progressLine.offsetWidth) < 778) {
            a += 20;
            if (a > 778) a = 778;
            progressLine.style.width = a + 'px';
            requestAnimationFrame(fn);
        } else {
            document.querySelector(".p0_tips").style.display = 'block';
            // $('.loading_ye').hide(); // HTML 中未找到
            document.querySelector(".p0_loading") && (document.querySelector(".p0_loading").style.display = 'none');
        }
    }
    requestAnimationFrame(fn);
}

function start() {
    audioAutoPlay(1);
    document.querySelector('.loading').style.display = 'none';
    document.querySelector('.container').style.display = 'block';
    document.querySelector('.pl_bt').style.display = 'block';

    setTimeout(function () {
        fadeIn(document.querySelector(".img1"));
    }, 800);
    setTimeout(function () {
        fadeIn(document.querySelector(".dianjijiaoshui0"));
    }, 2800);

    // 播放所有视频
    const videos = document.getElementsByClassName('bgVideo');
    for (let i = 0; i < videos.length; i++) {
        videos[i].play().catch(e => console.log("Video play failed:", e));
    }
}

function long(ll) {
    document.querySelector('.container').style.width = ll + 'px';
}

function audioAutoPlay(a) {
    var audio = document.getElementById('music');
    if (!audio) {
        return;
    }

    var yy1 = document.querySelector('.yy1');
    var yy2 = document.querySelector('.yy2');

    if (a == 1) {
        audio.play().catch(e => console.log("Audio play failed:", e));
        yy1.style.display = 'block';
        yy2.style.display = 'none';
    } else if (audio.paused) {
        audio.play().catch(e => console.log("Audio play failed:", e));
        yy1.style.display = 'block';
        yy2.style.display = 'none';
    } else {
        audio.pause();
        yy1.style.display = 'none';
        yy2.style.display = 'block';
    }
}

function fadeIn(el) {
    if (!el) return;
    el.style.opacity = 0;
    el.style.display = 'block';

    var last = +new Date();
    var tick = function () {
        el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
        last = +new Date();
        if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
        }
    };
    tick();
}

function initEvents() {
    // 开始按钮
    document.getElementById('startBtn').addEventListener('click', start);

    // 音乐按钮
    document.getElementById('musicBtn').addEventListener('click', function () { audioAutoPlay(); });
    document.getElementById('loadingMusicBtn').addEventListener('click', function () { audioAutoPlay(); });

    // 展开按钮 (第一部分 -> 第二部分)
    document.getElementById('expandBtn').addEventListener('click', function () {
        long(17140);
        document.querySelector('.part2').style.display = 'block';
        this.style.display = 'none';
        document.querySelector('.img6').style.display = 'block';
    });

    // 第二部分弹窗
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
        long(26308);
        document.querySelector('.part3').style.display = 'block';
        document.querySelector('.dianjijiaoshui').style.display = 'block';
    });

    // 第三部分弹窗
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
        long(32525);
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
        long(50259);
        document.querySelector('.part5').style.display = 'block';
        document.querySelector('.part6').style.display = 'block';
        document.querySelector('.dianjijiaoshui3').style.display = 'block';
    });
}
