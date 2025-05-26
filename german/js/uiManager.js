const UIManager = {
    elements: {
        sidebar: document.getElementById('sidebar'),
        content: document.getElementById('content'),
        loading: document.getElementById('loading'),
        categoryButtons: document.getElementById('categoryButtons'),
        themeButtons: document.getElementById('themeButtons'),
        searchContainer: document.getElementById('searchContainer'),
        searchInput: document.getElementById('searchInput'),
        searchResults: document.getElementById('searchResults'),
        randomWordsInput: document.getElementById('randomWordsInput'),
        wordList: document.getElementById('wordList'),
        wordDetail: document.getElementById('wordDetail'),
        linkedWordDetail: document.getElementById('linkedWordDetail'),
        grammarContainer: document.getElementById('grammarContainer'),
        a1Container: document.getElementById('a1Container')
    },

    init() {
        // 初始化其他功能
    },

    showLoading() {
        this.elements.loading.style.display = 'block';
    },

    hideLoading() {
        this.elements.loading.style.display = 'none';
    },

    toggleSidebar() {
        this.elements.sidebar.classList.toggle('collapsed');
        this.elements.content.classList.toggle('collapsed');
    },

    clearAll() {
        // 清除所有内容区域
        this.elements.categoryButtons.style.display = 'none';
        this.elements.themeButtons.style.display = 'none';
        this.elements.searchContainer.style.display = 'none';
        this.elements.randomWordsInput.style.display = 'none';
        this.elements.wordList.innerHTML = '';
        this.elements.wordDetail.style.display = 'none';
        this.elements.linkedWordDetail.style.display = 'none';
        this.elements.grammarContainer.style.display = 'none';
        this.elements.a1Container.style.display = 'none';
        
        // 清除搜索框
        if (this.elements.searchInput) {
            this.elements.searchInput.value = '';
        }
        
        // 清除随机单词输入框
        if (document.getElementById('randomCount')) {
            document.getElementById('randomCount').value = '';
        }
        
        // 清除语法练习内容
        this.clearGrammarContent();
    },

    // 清除语法练习内容
    clearGrammarContent() {
        // 重置语法练习界面到初始状态
        const grammarContainer = this.elements.grammarContainer;
        const cefrSelection = grammarContainer.querySelector('.cefr-selection');
        const grammarContent = grammarContainer.querySelector('.grammar-content');
        const grammarExercise = grammarContainer.querySelector('.grammar-exercise');
        
        // 显示等级选择，隐藏其他内容
        if (cefrSelection) cefrSelection.style.display = 'block';
        if (grammarContent) grammarContent.style.display = 'none';
        if (grammarExercise) grammarExercise.style.display = 'none';
        
        // 清除练习内容
        const exerciseQuestions = document.getElementById('exerciseQuestions');
        if (exerciseQuestions) exerciseQuestions.innerHTML = '';
        
        // 重置当前等级
        if (GrammarManager) {
            GrammarManager.currentLevel = null;
        }
    },

    showCategoryButtons() {
        this.clearAll();
        this.elements.categoryButtons.style.display = 'block';
        this.elements.wordList.style.display = 'block';
        this.generateCategoryButtons();
    },

    showThemeButtons() {
        this.clearAll();
        this.elements.themeButtons.style.display = 'block';
        this.elements.wordList.style.display = 'block';
        this.generateThemeButtons();
    },

    showSearchBox() {
        this.elements.searchContainer.style.display = 'block';
        this.elements.categoryButtons.style.display = 'none';
        this.elements.themeButtons.style.display = 'none';
        this.elements.wordList.style.display = 'none';
        this.elements.wordDetail.style.display = 'none';
        this.elements.randomWordsInput.style.display = 'none';
        this.elements.searchInput.focus();
    },

    showRandomWordsInput() {
        this.clearAll();
        this.elements.randomWordsInput.style.display = 'block';
        this.elements.wordList.style.display = 'block';
    },

    generateCategoryButtons() {
        const types = WordManager.getWordTypes();
        this.elements.categoryButtons.innerHTML = types.map(type => 
            `<button data-type="${type}">${type}</button>`
        ).join('');
    },

    generateThemeButtons() {
        const themes = WordManager.getThemes();
        this.elements.themeButtons.innerHTML = themes.map(theme => 
            `<button data-theme="${theme}">${theme}</button>`
        ).join('');
    },

    displayWords(wordList) {
        this.elements.wordList.innerHTML = wordList.map(word => `
            <div class="word-item" data-word="${word.word}">
                ${word.word} (${word.type}) - ${word.meaning}
            </div>
        `).join('');
    },

    highlightText(text, searchTerm) {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    },

    displaySearchResults(results, searchTerm) {
        const searchResults = this.elements.searchResults;
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">未找到匹配的单词</div>';
            return;
        }

        results.forEach(word => {
            const div = document.createElement('div');
            div.className = 'word-item';
            
            // 高亮显示匹配的文本
            const highlightedWord = this.highlightText(word.word, searchTerm);
            const highlightedMeaning = this.highlightText(word.meaning, searchTerm);
            
            div.innerHTML = `
                <div class="word-header">
                    <span class="word-text">${highlightedWord}</span>
                    <span class="word-type">${word.type || ''}</span>
                </div>
                <div class="word-meaning">${highlightedMeaning}</div>
                ${word.example ? `<div class="word-example">${this.highlightText(word.example, searchTerm)}</div>` : ''}
            `;
            
            div.addEventListener('click', () => this.displayWordDetail(word));
            searchResults.appendChild(div);
        });
    },

    displayWordDetail(word) {
        if (!word) return;
        
        const wordDetail = this.elements.wordDetail;
        wordDetail.style.display = 'block';
        
        // 更新单词详情内容
        wordDetail.querySelector('#wordTitle').textContent = word.word;
        wordDetail.querySelector('#wordExample').innerHTML = WordManager.linkifyExample(word.example);
        wordDetail.querySelector('#wordMeaning').textContent = word.meaning;
        
        // 确保链接单词可以点击
        this.initLinkedWordEvents(wordDetail);
    },

    displayLinkedWordDetail(word) {
        if (!word) return;
        
        const matchedWord = WordManager.findWord(word);
        if (matchedWord) {
            const linkedDetail = this.elements.linkedWordDetail;
            linkedDetail.innerHTML = `
                <div class="linked-word-detail">
                    <h4>${matchedWord.word}</h4>
                    <p><strong>例句:</strong> ${WordManager.linkifyExample(matchedWord.example)}</p>
                    <p><strong>释义:</strong> ${matchedWord.meaning}</p>
                    <button class="close-linked-detail">关闭</button>
                </div>
            `;
            linkedDetail.style.display = 'block';
            
            // 确保新添加的链接单词也可以点击
            this.initLinkedWordEvents(linkedDetail);
        }
    },

    initLinkedWordEvents(container) {
        // 移除旧的事件监听器
        const oldLinks = container.querySelectorAll('.linked-word');
        oldLinks.forEach(link => {
            link.replaceWith(link.cloneNode(true));
        });
        
        // 添加新的事件监听器
        container.querySelectorAll('.linked-word').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const word = e.target.dataset.word;
                if (word) {
                    this.displayLinkedWordDetail(word);
                }
            });
        });
    },

    closeWordDetail() {
        this.elements.wordDetail.style.display = 'none';
    },

    closeLinkedWordDetail() {
        this.elements.linkedWordDetail.style.display = 'none';
    },

    updateFavoriteButton(word) {
        const button = this.elements.wordDetail.querySelector('#toggleFavorite');
        if (button) {
            button.textContent = WordManager.isFavorite(word) ? '取消收藏' : '收藏';
        }
    },

    showGrammar() {
        this.clearAll();
        this.clearGrammarContent(); // 确保语法练习内容被重置
        this.elements.grammarContainer.style.display = 'block';
    }
}; 