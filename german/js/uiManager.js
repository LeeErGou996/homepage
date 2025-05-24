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
        linkedWordDetail: document.getElementById('linkedWordDetail')
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

    clearSearch() {
        this.elements.searchContainer.style.display = 'none';
        this.elements.searchInput.value = '';
        this.elements.searchResults.innerHTML = '';
        this.elements.searchResults.style.display = 'none';
    },

    clearAll() {
        this.clearSearch();
        this.elements.categoryButtons.style.display = 'none';
        this.elements.themeButtons.style.display = 'none';
        this.elements.randomWordsInput.style.display = 'none';
        this.elements.wordList.innerHTML = '';
        this.elements.wordDetail.style.display = 'none';
        this.elements.linkedWordDetail.style.display = 'none';
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
        this.clearAll();
        this.elements.searchContainer.style.display = 'block';
        this.elements.searchResults.style.display = 'block';
        this.elements.searchInput.value = '';
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

    displaySearchResults(results) {
        if (results.length === 0) {
            this.elements.searchResults.innerHTML = '<div class="no-results">没有找到匹配的单词</div>';
        } else {
            this.elements.searchResults.innerHTML = results.map(word => `
                <div class="word-item" data-word="${word.word}">
                    ${word.word} (${word.type}) - ${word.meaning}
                </div>
            `).join('');
        }
        this.elements.searchResults.style.display = 'block';
    },

    displayWordDetail(word) {
        this.elements.wordDetail.style.display = 'block';
        this.elements.wordDetail.querySelector('#wordTitle').textContent = word.word;
        this.elements.wordDetail.querySelector('#wordExample').innerHTML = WordManager.linkifyExample(word.example);
        this.elements.wordDetail.querySelector('#wordMeaning').textContent = word.meaning;
    },

    displayLinkedWordDetail(word) {
        const matchedWord = WordManager.findWord(word);
        if (matchedWord) {
            this.elements.linkedWordDetail.innerHTML = `
                <strong>${matchedWord.word}</strong><br>
                例句: ${WordManager.linkifyExample(matchedWord.example)}<br>
                释义: ${matchedWord.meaning}<br>
                <button class="close-linked-detail">关闭</button>
            `;
            this.elements.linkedWordDetail.style.display = 'block';
        }
    },

    closeWordDetail() {
        this.elements.wordDetail.style.display = 'none';
    },

    closeLinkedWordDetail() {
        this.elements.linkedWordDetail.style.display = 'none';
    },

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    },

    initTheme() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }
}; 