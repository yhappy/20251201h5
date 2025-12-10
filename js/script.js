/**
 * 页面配置常量
 */
const CONFIG = {
    // 进度条配置
    PROGRESS: {
        MAX_PERCENT: 100,
        INCREMENT: 0.5
    },
    // 动画延迟配置
    DELAYS: {
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
            progressLine: document.querySelector('.progress')
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
        // 延迟1秒后显示点击开始按钮
        setTimeout(() => {
            const clickBtn = document.getElementById('loadingClickBtn');
            if (clickBtn) {
                this.fadeIn(clickBtn);
            }
        }, 1000);
    }

    /**
     * 开始体验（从加载页进入）
     */
    startExperience() {
        this.dom.loading.style.display = 'none';
        this.dom.container.style.display = 'block';

        // 暂停所有背景视频
        this.pauseAllVideos();

        // 立即播放p6视频
        this.playP6Video();
    }

    /**
     * 暂停所有背景视频
     */
    pauseAllVideos() {
        Array.from(document.getElementsByClassName('bgVideo')).forEach(video => {
            // p6视频除外，让它循环播放
            if (!video.classList.contains('p6VideoAuto')) {
                video.pause();
            }
        });
    }

    /**
     * 播放p6视频
     */
    playP6Video() {
        const p6Video = document.querySelector('.p6VideoAuto');
        if (p6Video) {
            p6Video.play().catch(err => console.warn('p6视频播放失败:', err));
        }
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
     * 绑定所有事件监听
     */
    bindEvents() {
        // 辅助函数：安全绑定点击事件
        const onClick = (id, handler) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', handler.bind(this));
        };

        // 点击开始按钮
        onClick('loadingClickBtn', this.startExperience);

        // p1和p2点击货物交互
        this.bindP1GoodsInteraction();
        this.bindP2GoodsInteraction();

        // p1、p2、p3、p4和p5点击查看交互
        this.bindP1ClickViewInteraction();
        this.bindP2ClickViewInteraction();
        this.bindP3ClickViewInteraction();
        this.bindP4ClickViewInteraction();
        this.bindP5ClickViewInteraction();

        // p3点击骆驼、p4点击商人和p5点击茶壶交互
        this.bindP3CamelInteraction();
        this.bindP4MerchantInteraction();
        this.bindP5TeapotInteraction();

        // p6点击转发交互
        this.bindP6ShareInteraction();
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
        const checkTeaImg = document.querySelector('.p4_check_tea_img');
        const checkTeaGif = document.querySelector('.p4_check_tea_gif');

        if (clickGoodsBtn) {
            clickGoodsBtn.addEventListener('click', () => {
                // 隐藏点击商人按钮
                clickGoodsBtn.style.display = 'none';

                // 隐藏静态商人图片，显示查看茶叶动画
                if (checkTeaImg) checkTeaImg.style.display = 'none';
                if (checkTeaGif) checkTeaGif.style.display = 'block';
            });
        }
    }

    /**
       * 绑定p5点击查看交互
       */
    bindP5ClickViewInteraction() {
        const clickViewBtn = document.getElementById('p5ClickViewBtn');
        const knowledgeContent = document.querySelector('.p5_knowledge_content');

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
       * 绑定p5点击茶壶交互
       */
    bindP5TeapotInteraction() {
        const clickGoodsBtn = document.getElementById('p5ClickTeapotBtn');
        const teaImg = document.querySelector('.p5_tea_img');
        const teaGif = document.querySelector('.p5_tea_gif');

        if (clickGoodsBtn) {
            clickGoodsBtn.addEventListener('click', () => {
                // 隐藏点击茶壶按钮
                clickGoodsBtn.style.display = 'none';

                // 隐藏静态茶壶图片，显示茶壶动画
                if (teaImg) teaImg.style.display = 'none';
                if (teaGif) teaGif.style.display = 'block';
            });
        }
    }

    /**
     * 绑定p6点击转发交互
     */
    bindP6ShareInteraction() {
        const clickShareBtn = document.getElementById('p6ClickShareBtn');
        const sharePoster = document.getElementById('p6SharePoster');
        const closePosterBtn = document.getElementById('p6ClosePosterBtn');

        // 点击转发按钮显示海报
        if (clickShareBtn) {
            clickShareBtn.addEventListener('click', () => {
                if (sharePoster) {
                    // 先显示海报容器
                    sharePoster.style.display = 'flex';
                    // 立即添加show类开始fadeIn动画
                    requestAnimationFrame(() => {
                        sharePoster.classList.add('show');
                    });
                }
            });
        }

        // 点击关闭按钮隐藏海报
        if (closePosterBtn) {
            closePosterBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止事件冒泡
                if (sharePoster) {
                    // 移除show类开始fadeOut动画
                    sharePoster.classList.remove('show');
                    sharePoster.classList.add('hide');
                    // 等待动画完成后隐藏容器
                    setTimeout(() => {
                        sharePoster.style.display = 'none';
                        sharePoster.classList.remove('hide');
                    }, 300); // 与CSS transition时间一致
                }
            });
        }

        // 点击海报背景关闭海报（不点击图片）
        if (sharePoster) {
            sharePoster.addEventListener('click', (e) => {
                // 只有点击背景容器时才关闭，不点击图片
                if (e.target === sharePoster) {
                    e.stopPropagation(); // 防止事件冒泡
                    // 移除show类开始fadeOut动画
                    sharePoster.classList.remove('show');
                    sharePoster.classList.add('hide');
                    // 等待动画完成后隐藏容器
                    setTimeout(() => {
                        sharePoster.style.display = 'none';
                        sharePoster.classList.remove('hide');
                    }, 300); // 与CSS transition时间一致
                }
            });
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => new H5App());