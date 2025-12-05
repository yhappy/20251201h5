/**
 * 页面配置常量
 */
const CONFIG = {
    // 容器宽度配置
    WIDTHS: {
        INITIAL: 8186,
        PART2: 17140,
        PART3: 26308,
        PART4: 32525,
        PART5: 50259
    },
    // 进度条配置
    PROGRESS: {
        MAX_PERCENT: 100,
        INCREMENT: 2
    },
    // 动画延迟配置
    DELAYS: {
        FADE_IN_TITLE: 800,
        FADE_IN_TIP: 2800,
        SCROLL_RESET: 100
    }
};

/**
 * H5 应用主类
 * 负责管理页面生命周期和所有交互逻辑
 */
class H5App {
    constructor() {
        // 缓存 DOM 元素引用
        this.dom = {
            loading: document.querySelector('.loading'),
            container: document.querySelector('.container'),
            musicBtn: document.querySelector('.pl_bt'),
            progressLine: document.querySelector('.progress'),
            tips: document.querySelector('.p0_tips'),
            loadingText: document.querySelector('.p0_loading'),
            audio: document.getElementById('music'),
            iconOn: document.querySelector('.yy1'),
            iconOff: document.querySelector('.yy2')
        };

        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        this.startLoadingAnimation();

        if (this.isMobileDevice()) {
            this.adaptToMobile();
        }

        this.bindEvents();
    }

    /**
     * 检测是否为移动设备
     */
    isMobileDevice() {
        return /phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone/i.test(navigator.userAgent);
    }

    /**
     * 移动端适配
     */
    adaptToMobile() {
        const windowHeight = window.innerHeight;

        this.dom.loading.classList.add('main-phone');
        this.dom.loading.style.width = `${windowHeight}px`;
        this.dom.container.classList.add('main-phone2');
        this.dom.musicBtn.classList.add('pl_bt2');

        setTimeout(() => window.scrollTo(0, 0), CONFIG.DELAYS.SCROLL_RESET);
    }

    /**
     * 启动加载进度条动画
     */
    startLoadingAnimation() {
        this.dom.loading.style.display = 'block';
        let progressPercent = 0;

        const animate = () => {
            if (progressPercent < CONFIG.PROGRESS.MAX_PERCENT) {
                progressPercent = Math.min(
                    progressPercent + CONFIG.PROGRESS.INCREMENT,
                    CONFIG.PROGRESS.MAX_PERCENT
                );
                this.dom.progressLine.style.width = `${progressPercent}%`;
                requestAnimationFrame(animate);
            } else {
                this.onLoadingComplete();
            }
        };

        requestAnimationFrame(animate);
    }

    /**
     * 加载完成回调
     */
    onLoadingComplete() {
        this.dom.tips.style.display = 'block';
        if (this.dom.loadingText) {
            this.dom.loadingText.style.display = 'none';
        }
    }

    /**
     * 进入主场景
     */
    enterMainScene() {
        this.toggleMusic(true);
        this.dom.loading.style.display = 'none';
        this.dom.container.style.display = 'block';
        this.dom.musicBtn.style.display = 'block';

        // 延时显示元素
        setTimeout(() => this.fadeIn('.img1'), CONFIG.DELAYS.FADE_IN_TITLE);
        setTimeout(() => this.fadeIn('.dianjijiaoshui0'), CONFIG.DELAYS.FADE_IN_TIP);

        // 播放所有背景视频
        this.playAllVideos();
    }

    /**
     * 播放所有背景视频
     */
    playAllVideos() {
        Array.from(document.getElementsByClassName('bgVideo')).forEach(video => {
            video.play().catch(err => console.warn('视频播放失败:', err));
        });
    }

    /**
     * 更新容器宽度
     */
    setContainerWidth(width) {
        this.dom.container.style.width = `${width}px`;
    }

    /**
     * 切换背景音乐
     */
    toggleMusic(forcePlay = null) {
        if (!this.dom.audio) return;

        const shouldPlay = forcePlay === true || (forcePlay === null && this.dom.audio.paused);

        if (shouldPlay) {
            this.dom.audio.play().catch(err => console.warn('音频播放失败:', err));
            this.dom.iconOn.style.display = 'block';
            this.dom.iconOff.style.display = 'none';
        } else {
            this.dom.audio.pause();
            this.dom.iconOn.style.display = 'none';
            this.dom.iconOff.style.display = 'block';
        }
    }

    /**
     * 元素淡入效果
     */
    fadeIn(selector) {
        const element = document.querySelector(selector);
        if (!element) return;

        element.style.opacity = 0;
        element.style.display = 'block';

        let lastTime = Date.now();

        const tick = () => {
            const now = Date.now();
            const delta = (now - lastTime) / 400;
            const newOpacity = parseFloat(element.style.opacity) + delta;

            element.style.opacity = newOpacity;
            lastTime = now;

            if (newOpacity < 1) {
                requestAnimationFrame(tick);
            }
        };

        tick();
    }

    /**
     * 显示/隐藏元素
     */
    show(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'block';
    }

    hide(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'none';
    }

    /**
     * 绑定所有事件监听
     */
    bindEvents() {
        // 辅助函数：安全绑定点击事件
        const onClick = (id, handler) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', handler.bind(this));
        };

        // 开始按钮
        onClick('startBtn', this.enterMainScene);

        // 音乐控制
        onClick('musicBtn', () => this.toggleMusic());
        onClick('loadingMusicBtn', () => this.toggleMusic());

        // 场景展开
        onClick('expandBtn', function () {
            this.setContainerWidth(CONFIG.WIDTHS.PART2);
            this.show('.part2');
            this.hide('#expandBtn');
            this.show('.img6');
        });

        // 弹窗系统
        this.bindPopups();

        // 浇水按钮（场景切换）
        this.bindWaterButtons();

        // 视频弹窗
        this.bindVideoPopup();
    }

    /**
     * 绑定弹窗事件
     */
    bindPopups() {
        const bindPopup = (btnId, imgId) => {
            const btn = document.getElementById(btnId);
            const img = document.getElementById(imgId);

            if (btn) {
                btn.addEventListener('click', () => {
                    if (img) img.style.display = 'block';
                });
            }

            if (img) {
                img.addEventListener('click', (e) => {
                    img.style.display = 'none';
                    e.stopPropagation();
                });
            }
        };

        // Part 2 弹窗
        bindPopup('p2PopupBtn', 'p2PopupImg');

        // Part 3 弹窗（3个）
        ['1', '2', '3'].forEach(num => {
            bindPopup(`p3PopupBtn${num}`, `p3PopupImg${num}`);
        });
    }

    /**
     * 绑定浇水按钮事件
     */
    bindWaterButtons() {
        const waterConfigs = [
            { id: 'waterBtn1', width: CONFIG.WIDTHS.PART3, part: '.part3', tip: '.dianjijiaoshui' },
            { id: 'waterBtn2', width: CONFIG.WIDTHS.PART4, part: '.part4', tip: '.dianjijiaoshui2' },
            { id: 'waterBtn3', width: CONFIG.WIDTHS.PART5, part: '.part5', tip: '.dianjijiaoshui3' }
        ];

        waterConfigs.forEach(config => {
            const btn = document.getElementById(config.id);
            if (!btn) return;

            btn.addEventListener('click', () => {
                btn.style.opacity = '1';
                this.setContainerWidth(config.width);
                this.show(config.part);
                this.show(config.tip);

                // Part 5 特殊处理：同时显示 Part 6
                if (config.part === '.part5') {
                    this.show('.part6');
                }
            });
        });
    }

    /**
     * 绑定视频弹窗事件
     */
    bindVideoPopup() {
        const openBtn = document.getElementById('videoPopupBtn');
        const closeBtn = document.getElementById('videoPopupCloseBtn');
        const player = document.querySelector('.fjsen-player');

        if (openBtn && player) {
            openBtn.addEventListener('click', () => {
                player.style.display = 'block';
                if (closeBtn) closeBtn.style.display = 'block';
            });
        }

        if (closeBtn && player) {
            closeBtn.addEventListener('click', () => {
                player.style.display = 'none';
                closeBtn.style.display = 'none';
            });
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => new H5App());

