// 导航栏切换
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('show');
        });
    }

    // 点击导航链接时关闭菜单
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('show');
        });
    });

    // 点击页面其他区域时关闭菜单
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && navMenu.classList.contains('show')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('show');
        }
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});

// 简单的动画效果
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// 观察所有卡片元素
document.querySelectorAll('.news-card, .research-card').forEach(card => {
    observer.observe(card);
});

// 作品筛选功能
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            workCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// 视频预览功能
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('.video-modal');
    const video = modal.querySelector('video');
    const closeBtn = modal.querySelector('.close-modal');
    const backBtn = modal.querySelector('.back-btn');
    
    // 关闭视频预览的函数
    const closeModal = () => {
        modal.classList.remove('active');
        video.pause();
        video.src = '';
    };
    
    // 打开视频预览
    document.querySelectorAll('.preview-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoSrc = btn.getAttribute('data-video');
            video.src = videoSrc;
            modal.classList.add('active');
            video.play();
        });
    });
    
    // 关闭按钮事件
    closeBtn.addEventListener('click', closeModal);
    
    // 返回欣赏按钮事件
    backBtn.addEventListener('click', closeModal);
    
    // 点击模态框背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
});

// 添加页面跳转动画
document.addEventListener('DOMContentLoaded', () => {
    const transitionElement = document.querySelector('.page-transition');
    
    // 处理所有链接点击
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            // 排除外部链接和锚点链接
            if (
                this.getAttribute('target') === '_blank' || 
                this.getAttribute('href').startsWith('#') ||
                this.getAttribute('href').startsWith('mailto:') ||
                this.getAttribute('href').startsWith('tel:')
            ) {
                return;
            }

            e.preventDefault();
            const href = this.getAttribute('href');

            // 添加过渡动画
            transitionElement.classList.add('transitioning');

            // 等待动画完成后跳转
            setTimeout(() => {
                window.location.href = href;
            }, 600); // 动画中点时跳转
        });
    });

    // 页面加载完成时的入场动画
    if (performance.navigation.type === 1 || !document.referrer) {
        transitionElement.style.transform = 'translateY(0)';
        setTimeout(() => {
            transitionElement.style.transform = 'translateY(-100%)';
            transitionElement.style.transition = 'transform 0.6s cubic-bezier(0.7, 0, 0.3, 1)';
        }, 100);
    }
});

// 添加按钮点击波纹效果
document.querySelectorAll('.btn, .filter-btn, .nav-link').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        
        ripple.className = 'ripple';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// 修改搜索功能
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const workCards = document.querySelectorAll('.work-card');
    
    // 搜索函数
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        // 如果搜索框为空，显示所有作品
        if (!searchTerm) {
            workCards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                removeHighlight(card);
            });
            return;
        }
        
        workCards.forEach(card => {
            const title = card.querySelector('.work-title, h3')?.textContent.toLowerCase() || '';
            const author = card.querySelector('.work-author')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            const category = card.dataset.category.toLowerCase();
            
            // 使用 includes 进行部分匹配
            const matches = 
                title.includes(searchTerm) || 
                author.includes(searchTerm) || 
                description.includes(searchTerm) ||
                category.includes(searchTerm) ||
                // 添加类别的中文匹配
                (category === 'music' && '音乐'.includes(searchTerm)) ||
                (category === 'novel' && '小说'.includes(searchTerm)) ||
                (category === 'website' && '网站'.includes(searchTerm)) ||
                (category === 'video' && '视频'.includes(searchTerm));
            
            // 添加过渡动画
            if (matches) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
                
                // 高亮匹配文本
                if (searchTerm) {
                    highlightText(card, searchTerm);
                }
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
                removeHighlight(card);
            }
        });
    };
    
    // 点击搜索按钮时执行搜索
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // 按回车键时也执行搜索
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
});

// 修改高亮匹配文本函数
function highlightText(card, term) {
    const elements = card.querySelectorAll('.work-title, h3, .work-author, p');
    elements.forEach(element => {
        const text = element.textContent;
        // 使用正则表达式进行全局、不区分大小写的匹配
        const regex = new RegExp(`(${term})`, 'gi');
        element.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
    });
}

// 移除高亮
function removeHighlight(card) {
    const elements = card.querySelectorAll('.work-title, .work-author, .work-desc');
    elements.forEach(element => {
        element.innerHTML = element.textContent;
    });
}

// 添加展开/收起功能
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const features = btn.previousElementSibling;
        const isExpanded = features.classList.contains('expanded');
        
        if (isExpanded) {
            features.classList.remove('expanded');
            btn.classList.remove('expanded');
        } else {
            features.classList.add('expanded');
            btn.classList.add('expanded');
        }
    });
});

// 添加3D卡片效果
document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            translateZ(50px)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateZ(0)';
    });
});

// 添加彩蛋功能
document.addEventListener('DOMContentLoaded', () => {
    const easterEgg = document.getElementById('easterEgg');
    const body = document.body;

    easterEgg.addEventListener('click', () => {
        // 创建碎片动画容器
        const fragments = document.createElement('div');
        fragments.className = 'fragments-container';
        
        // 创建12个碎片
        for (let i = 0; i < 12; i++) {
            const fragment = document.createElement('div');
            fragment.className = 'fragment';
            fragment.style.setProperty('--i', i);
            fragments.appendChild(fragment);
        }
        
        body.appendChild(fragments);

        // 等待碎片动画完成后显示图片
        setTimeout(() => {
            fragments.remove();
            
            // 创建模态框
            const modal = document.createElement('div');
            modal.className = 'easter-egg-modal';
            
            // 创建图片容器
            const imgContainer = document.createElement('div');
            imgContainer.className = 'easter-egg-image-container';
            
            // 创建图片元素
            const img = document.createElement('img');
            img.src = 'huange.jpg';
            img.alt = '欢哥彩蛋';
            img.className = 'easter-egg-image';
            
            // 创建关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.className = 'easter-egg-close';
            closeBtn.innerHTML = '×';
            
            // 添加到模态框
            imgContainer.appendChild(img);
            modal.appendChild(imgContainer);
            modal.appendChild(closeBtn);
            body.appendChild(modal);
            
            // 添加3D效果
            modal.addEventListener('mousemove', (e) => {
                const { left, top, width, height } = imgContainer.getBoundingClientRect();
                const x = (e.clientX - left) / width - 0.5;
                const y = (e.clientY - top) / height - 0.5;
                
                imgContainer.style.transform = `
                    perspective(1000px)
                    rotateY(${x * 10}deg)
                    rotateX(${-y * 10}deg)
                    translateZ(50px)
                `;
            });
            
            modal.addEventListener('mouseleave', () => {
                imgContainer.style.transform = 'none';
            });
            
            // 关闭功能
            const closeModal = () => {
                modal.classList.add('closing');
                setTimeout(() => modal.remove(), 500);
            };
            
            closeBtn.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }, 1500); // 等待碎片动画完成
    });
});

// 添加文章点击事件
document.querySelectorAll('.read-more').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const newsCard = this.closest('.news-card');
        const title = newsCard.querySelector('h3').textContent;
        const date = newsCard.querySelector('.news-date').textContent;
        const tags = Array.from(newsCard.querySelectorAll('.news-tag')).map(tag => tag.textContent);
        
        // 创建文章模态框
        const modal = document.createElement('div');
        modal.className = 'article-modal';
        modal.innerHTML = `
            <div class="article-container">
                <button class="article-close">
                    <i class="fas fa-times"></i>
                </button>
                <div class="article-header">
                    <h2 class="article-title">${title}</h2>
                    <div class="article-meta">
                        <span>
                            <i class="fas fa-calendar"></i>
                            ${date}
                        </span>
                        <span>
                            <i class="fas fa-tags"></i>
                            ${tags.join(', ')}
                        </span>
                    </div>
                </div>
                <div class="article-content">
                    <p>这是一段详细的文章内容。这里可以放置更多关于${title}的详细信息。</p>
                    <p>可以包含多个段落，图片，或其他富文本内容。</p>
                    <p>这是第三段示例文本，用来演示文章的排版效果。</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 添加动画类
        setTimeout(() => modal.classList.add('active'), 10);
        
        // 关闭按钮事件
        modal.querySelector('.article-close').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });
    });
});

// 添加学生事迹详情功能
document.querySelector('.story-details-btn').addEventListener('click', () => {
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'story-modal';
    
    // 添加详细内容
    modal.innerHTML = `
        <div class="story-detail-content">
            <button class="story-close">×</button>
            <div class="story-detail-header">
                <div class="student-profile">
                    <img src="tangsirui.jpg" alt="唐思瑞" class="student-detail-avatar">
                    <div class="student-detail-info">
                        <h2>唐思瑞</h2>
                        <div class="student-detail-tags">
                            <span><i class="fas fa-code"></i> 全栈开发</span>
                            <span><i class="fas fa-robot"></i> AI爱好者</span>
                            <span><i class="fas fa-calculator"></i> 数学达人</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="story-detail-body">
                <div class="achievement-detail-grid">
                    <div class="achievement-detail-card">
                        <div class="achievement-detail-icon">
                            <i class="fas fa-globe"></i>
                        </div>
                        <h3>网站开发</h3>
                        <p>独立开发4个商业网站，帮助花店提升营业额300%，获得多位客户好评。</p>
                        <ul class="achievement-features">
                            <li>响应式设计</li>
                            <li>用户体验优化</li>
                            <li>性能优化</li>
                        </ul>
                    </div>
                    
                    <div class="achievement-detail-card">
                        <div class="achievement-detail-icon">
                            <i class="fas fa-video"></i>
                        </div>
                        <h3>AI视频创作</h3>
                        <p>制作AI动态视频在社交平台获得百万粉丝，展现AI技术的创新应用。</p>
                        <ul class="achievement-features">
                            <li>AI生成内容</li>
                            <li>视觉效果设计</li>
                            <li>内容运营</li>
                        </ul>
                    </div>
                    
                    <div class="achievement-detail-card">
                        <div class="achievement-detail-icon">
                            <i class="fas fa-award"></i>
                        </div>
                        <h3>数学竞赛</h3>
                        <p>获得多项数学竞赛奖项，展现出色的逻辑思维和问题解决能力。</p>
                        <ul class="achievement-features">
                            <li>数学建模</li>
                            <li>算法设计</li>
                            <li>竞赛经验</li>
                        </ul>
                    </div>
                    
                    <div class="achievement-detail-card">
                        <div class="achievement-detail-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <h3>机器人比赛</h3>
                        <p>在AI机器人比赛中协助修复关键代码，获得主办方特别表彰。</p>
                        <ul class="achievement-features">
                            <li>机器学习</li>
                            <li>控制算法</li>
                            <li>系统优化</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加动画类
    setTimeout(() => modal.classList.add('active'), 10);
    
    // 关闭按钮事件
    const closeBtn = modal.querySelector('.story-close');
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });
    
    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });
});

// 研究方向详情数据
const researchDetails = {
    nlp: {
        title: "自然语言处理研究",
        sections: [
            {
                title: "研究内容",
                content: "我们专注于自然语言处理的前沿技术研究，致力于提升机器理解和生成人类语言的能力。",
                items: [
                    "语义理解与分析技术",
                    "情感识别与分析系统",
                    "神经机器翻译模型",
                    "智能对话系统开发"
                ]
            },
            {
                title: "核心技术",
                content: "采用最新的深度学习技术，结合多层次的语言理解机制。",
                items: [
                    "Transformer架构优化",
                    "多头注意力机制",
                    "上下文编码技术",
                    "跨语言模型训练"
                ]
            },
            {
                title: "应用场景",
                content: "研究成果广泛应用于多个领域：",
                items: [
                    "智能客服对话系统",
                    "多语言翻译平台",
                    "文本情感分析",
                    "知识图谱构建"
                ]
            }
        ]
    },
    cv: {
        // 其他研究方向的详情数据...
    },
    llm: {
        // 其他研究方向的详情数据...
    }
};

// 显示研究方向详情
function showResearchDetail(type) {
    const detail = researchDetails[type];
    if (!detail) return;

    const modal = document.createElement('div');
    modal.className = 'research-modal';
    
    modal.innerHTML = `
        <div class="research-detail">
            <button class="modal-close">&times;</button>
            <h2>${detail.title}</h2>
            <div class="research-detail-content">
                ${detail.sections.map(section => `
                    <div class="research-detail-section">
                        <h3>${section.title}</h3>
                        <p>${section.content}</p>
                        <ul>
                            ${section.items.map(item => `
                                <li>${item}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    // 关闭按钮事件
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    // 点击背景关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });
} 