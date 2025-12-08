/**
 * 页面配置常量
 */
const CONFIG = {
    // 容器宽度配置
    WIDTHS: {
        INITIAL: 2278,
        PART2: 4281,
        PART3: 13449,
        PART4: 19666,
        PART5: 37333
    },
    // 进度条配置
    PROGRESS: {
        MAX_PERCENT: 100,
        INCREMENT: 0.5
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
            progressLine: document.querySelector('.progress'),
            loadingText: document.querySelector('.p0_loading')
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

        // 调试模式直接进入主场景
        this.enterMainScene();
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
        if (this.dom.loadingText) {
            this.dom.loadingText.style.display = 'none';
        }

        // 延迟1秒后显示点击开始按钮
        setTimeout(() => {
            const clickBtn = document.getElementById('loadingClickBtn');
            if (clickBtn) {
                this.fadeIn(clickBtn);
            }
        }, 1000);
    }

    /**
     * 进入主场景
     */
    enterMainScene() {
        this.dom.loading.style.display = 'none';
        this.dom.container.style.display = 'block';

        // 暂停所有背景视频
        this.pauseAllVideos();
    }

    /**
     * 暂停所有背景视频
     */
    pauseAllVideos() {
        Array.from(document.getElementsByClassName('bgVideo')).forEach(video => {
            video.pause();
        });
    }

    /**
     * 更新容器宽度
     */
    setContainerWidth(width) {
        this.dom.container.style.width = `${width}px`;
    }

    
    /**
     * 元素淡入效果
     */
    fadeIn(selectorOrElement) {
        const element = typeof selectorOrElement === 'string'
            ? document.querySelector(selectorOrElement)
            : selectorOrElement;
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

        
        // 点击开始按钮
        onClick('loadingClickBtn', this.enterMainScene);

        // p1和p2点击货物交互
        this.bindP1GoodsInteraction();
        this.bindP2GoodsInteraction();

        // p1、p2、p3和p4点击查看交互
        this.bindP1ClickViewInteraction();
        this.bindP2ClickViewInteraction();
        this.bindP3ClickViewInteraction();
        this.bindP4ClickViewInteraction();

        // p3点击骆驼和p4点击商人交互
        this.bindP3CamelInteraction();
        this.bindP4MerchantInteraction();

        // 弹窗系统
        this.bindPopups();

        // 浇水按钮（场景切换）
        this.bindWaterButtons();

        // 视频弹窗
        this.bindVideoPopup();
    }

    /**
     * 绑定p1点击货物交互
     */
    bindP1GoodsInteraction() {
        const clickGoodsBtn = document.getElementById('p1ClickGoodsBtn');
        const packageImg = document.querySelector('.p1_package_img');
        const packageGif = document.querySelector('.p1_package_gif');

        if (clickGoodsBtn) {
            clickGoodsBtn.addEventListener('click', () => {
                // 隐藏点击货物按钮
                clickGoodsBtn.style.display = 'none';

                // 隐藏静态装箱图片，显示装箱动画
                if (packageImg) packageImg.style.display = 'none';
                if (packageGif) packageGif.style.display = 'block';
            });
        }
    }

    /**
     * 绑定p2点击货物交互
     */
    bindP2GoodsInteraction() {
        const clickGoodsBtn = document.getElementById('p2ClickGoodsBtn');
        const moveBoxesImg = document.querySelector('.p2_move_boxes_img');
        const moveBoxesGif = document.querySelector('.p2_move_boxes_gif');

        if (clickGoodsBtn) {
            clickGoodsBtn.addEventListener('click', () => {
                // 隐藏点击货物按钮
                clickGoodsBtn.style.display = 'none';

                // 隐藏静态搬箱子图片，显示搬箱子动画
                if (moveBoxesImg) moveBoxesImg.style.display = 'none';
                if (moveBoxesGif) moveBoxesGif.style.display = 'block';
            });
        }
    }

    /**
     * 绑定p1点击查看交互
     */
    bindP1ClickViewInteraction() {
        const clickViewBtn = document.getElementById('p1ClickViewBtn');
        const knowledgeContent = document.querySelector('.p1_knowledge_content');

        if (clickViewBtn) {
            clickViewBtn.addEventListener('click', () => {
                // 只显示小知识内容，标题固定显示
                if (knowledgeContent) {
                    knowledgeContent.classList.add('show');
                }

                // 隐藏点击查看按钮
                clickViewBtn.style.display = 'none';
            });
        }
    }

    /**
     * 绑定p2点击查看交互
     */
    bindP2ClickViewInteraction() {
        const clickViewBtn = document.getElementById('p2ClickViewBtn');
        const knowledgeContent = document.querySelector('.p2_knowledge_content');

        if (clickViewBtn) {
            clickViewBtn.addEventListener('click', () => {
                // 只显示小知识内容，标题固定显示
                if (knowledgeContent) {
                    knowledgeContent.classList.add('show');
                }

                // 隐藏点击查看按钮
                clickViewBtn.style.display = 'none';
            });
        }
    }

  /**
     * 绑定p3点击查看交互
     */
    bindP3ClickViewInteraction() {
        const clickViewBtn = document.getElementById('p3ClickViewBtn');
        const knowledgeContent = document.querySelector('.p3_knowledge_content');

        if (clickViewBtn) {
            clickViewBtn.addEventListener('click', () => {
                // 只显示小知识内容，标题固定显示
                if (knowledgeContent) {
                    knowledgeContent.classList.add('show');
                }

                // 隐藏点击查看按钮
                clickViewBtn.style.display = 'none';
            });
        }
    }

  /**
     * 绑定p3点击骆驼交互
     */
    bindP3CamelInteraction() {
        const clickCamelBtn = document.getElementById('p3ClickCamelBtn');
        const p3Video = document.querySelector('.p3_video');
        const p3VideoElement = document.querySelector('.p3_video video');

        if (clickCamelBtn) {
            clickCamelBtn.addEventListener('click', () => {
                // 隐藏点击骆驼按钮
                clickCamelBtn.style.display = 'none';

                // 显示视频容器
                if (p3Video) {
                    p3Video.style.display = 'block';
                }

                // 开始播放视频
                if (p3VideoElement) {
                    p3VideoElement.play().catch(err => console.warn('视频播放失败:', err));
                }
            });
        }
    }

  /**
     * 绑定p4点击查看交互
     */
    bindP4ClickViewInteraction() {
        const clickViewBtn = document.getElementById('p4ClickViewBtn');
        const knowledgeContent = document.querySelector('.p4_knowledge_content');

        if (clickViewBtn) {
            clickViewBtn.addEventListener('click', () => {
                // 只显示小知识内容，标题固定显示
                if (knowledgeContent) {
                    knowledgeContent.classList.add('show');
                }

                // 隐藏点击查看按钮
                clickViewBtn.style.display = 'none';
            });
        }
    }

  /**
     * 绑定p4点击商人交互
     */
    bindP4MerchantInteraction() {
        const clickGoodsBtn = document.getElementById('p4ClickMerchantBtn');
        const merchantImg = document.querySelector('.p4_click_merchant_img');
        const checkTeaImg = document.querySelector('.p4_check_tea_img');
        const checkTeaGif = document.querySelector('.p4_check_tea_gif');

        if (clickGoodsBtn) {
            clickGoodsBtn.addEventListener('click', () => {
                // 隐藏点击商人按钮
                clickGoodsBtn.style.display = 'none';

                // 隐藏静态商人图片，显示查看茶叶动画
                if (merchantImg) merchantImg.style.display = 'none';
                if (checkTeaImg) checkTeaImg.style.display = 'none';
                if (checkTeaGif) checkTeaGif.style.display = 'block';
            });
        }
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
        // 所有场景已初始显示，无需点击切换逻辑
        // 保留此方法以维持代码结构，但功能已禁用
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

