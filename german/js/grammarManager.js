const GrammarManager = {
    // 存储语法数据
    grammarData: null,

    // 初始化语法练习
    async init() {
        try {
            // 加载语法数据
            const response = await fetch('js/grammar.json');
            this.grammarData = await response.json();
        } catch (error) {
            console.error('加载语法数据失败:', error);
        }
    },

    // 初始化等级条目
    initLevelItems() {
        const levelItems = document.querySelectorAll('.level-item');
        levelItems.forEach(item => {
            item.addEventListener('click', () => {
                const level = item.dataset.level;
                this.showLevelContent(level);
            });
        });
    },

    // 显示等级内容
    showLevelContent(level) {
        // 隐藏等级选择，显示内容区域
        document.querySelector('.grammar-levels').style.display = 'none';
        const content = document.getElementById('grammarContent');
        content.style.display = 'block';
        
        // 这里将来可以添加具体的内容
    },

    // 打开 A1 界面
    async openA1Page() {
        // 隐藏语法练习区域
        document.getElementById('grammarContainer').style.display = 'none';
        // 显示 A1 界面
        const a1Container = document.getElementById('a1Container');
        a1Container.style.display = 'block';
        
        // 渲染 A1 内容
        await this.renderA1Content();
    },

    // 关闭 A1 界面
    closeA1Page() {
        // 隐藏 A1 界面
        document.getElementById('a1Container').style.display = 'none';
        // 显示语法练习区域
        document.getElementById('grammarContainer').style.display = 'block';
    },

    // 渲染语法内容 (已支持混合等级)
    async renderA1Content() {
        if (!this.grammarData) {
            console.error('语法数据未加载');
            return;
        }

        const a1Content = document.getElementById('a1Content');
        if (!a1Content) return;
        a1Content.innerHTML = ''; // 清空现有内容
        
        const categories = this.grammarData.categories;
        if (!categories) return;

        // 渲染每个分类及分类下的主题
        categories.forEach(category => {
            if (!category.topics || category.topics.length === 0) return;
            
            // 创建分类标题
            const catHeader = document.createElement('h4');
            catHeader.style.color = '#000';
            catHeader.style.fontSize = '18px';
            catHeader.style.marginTop = '25px';
            catHeader.style.marginBottom = '15px';
            catHeader.style.borderBottom = '2px solid #ccc';
            catHeader.style.paddingBottom = '8px';
            catHeader.textContent = category.name;
            a1Content.appendChild(catHeader);

            // 渲染分类下的主题
            category.topics.forEach(topic => {
                const topicElement = this.createTopicElement(topic);
                a1Content.appendChild(topicElement);
            });
        });
    },

    // 创建主题元素
    createTopicElement(topic) {
        const div = document.createElement('div');
        div.className = 'grammar-topic';
        div.style.marginBottom = '20px';
        div.style.border = '1px solid #e5e7eb';
        div.style.borderRadius = '8px';
        div.style.overflow = 'hidden';

        // 创建标题栏
        const header = document.createElement('div');
        header.className = 'topic-header';
        header.style.padding = '15px';
        header.style.backgroundColor = '#f8f9fa';
        header.style.cursor = 'pointer';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.onclick = () => this.toggleTopicContent(div);

        // 添加标题
        const titleContainer = document.createElement('div');
        titleContainer.style.display = 'flex';
        titleContainer.style.alignItems = 'center';
        
        const title = document.createElement('h3');
        title.style.margin = '0';
        title.style.color = '#1e40af';
        title.textContent = topic.title;
        titleContainer.appendChild(title);
        
        if (topic.level) {
            const badge = document.createElement('span');
            badge.textContent = topic.level;
            badge.style.fontSize = '12px';
            badge.style.background = topic.level === 'A1' ? '#dcfce7' : '#dbeafe';
            badge.style.color = topic.level === 'A1' ? '#166534' : '#1e40af';
            badge.style.border = `1px solid ${topic.level === 'A1' ? '#bbf7d0' : '#bfdbfe'}`;
            badge.style.padding = '2px 8px';
            badge.style.borderRadius = '12px';
            badge.style.marginLeft = '10px';
            badge.style.fontWeight = 'normal';
            titleContainer.appendChild(badge);
        }
        
        header.appendChild(titleContainer);

        // 添加展开/收起图标
        const icon = document.createElement('span');
        icon.className = 'toggle-icon';
        icon.textContent = '▼';
        icon.style.transition = 'transform 0.3s ease';
        header.appendChild(icon);

        // 创建内容容器
        const content = document.createElement('div');
        content.className = 'topic-content';
        content.style.display = 'none';
        content.style.padding = '15px';
        content.style.backgroundColor = 'white';
        content.innerHTML = `
            <p style="color: #666; margin-bottom: 20px;">${topic.description}</p>
            ${topic.sections.map(section => this.createSectionElement(section)).join('')}
            ${this.createTipsElement(topic.tips)}
        `;

        // 组装元素
        div.appendChild(header);
        div.appendChild(content);

        return div;
    },

    // 切换主题内容的显示/隐藏
    toggleTopicContent(topicElement) {
        const content = topicElement.querySelector('.topic-content');
        const icon = topicElement.querySelector('.toggle-icon');
        const isHidden = content.style.display === 'none';

        content.style.display = isHidden ? 'block' : 'none';
        icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0)';
    },

    // 创建章节元素
    createSectionElement(section) {
        return `
            <div style="margin-bottom: 25px;">
                <h4 style="color: #1e40af; margin-bottom: 10px;">${section.title}</h4>
                <p style="margin: 5px 0; color: #333;">${section.explanation}</p>
                ${section.examples.map(example => this.createExampleElement(example)).join('')}
            </div>
        `;
    },

    // 创建例句元素
    createExampleElement(example) {
        return `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 10px;">
                <p style="margin: 5px 0;"><strong>例句：</strong> ${example.question} - ${example.translation.question}</p>
                <p style="margin: 5px 0;"><strong>回答：</strong> ${example.answer} - ${example.translation.answer}</p>
            </div>
        `;
    },

    // 创建记忆技巧元素
    createTipsElement(tips) {
        return `
            <div style="background: #e8f0fe; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <h4 style="color: #1e40af; margin-top: 0; margin-bottom: 10px;">记忆技巧：</h4>
                <ul style="margin: 0; padding-left: 20px; color: #333;">
                    ${tips.map(tip => `<li>${tip}</li>`).join('')}
                </ul>
            </div>
        `;
    }
};

// 在页面加载完成后初始化语法练习
document.addEventListener('DOMContentLoaded', () => {
    GrammarManager.init();
}); 