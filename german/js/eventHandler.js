const EventHandler = {
    init() {
        this.initSidebarEvents();
        this.initSearchEvents();
        this.initWordListEvents();
        this.initWordDetailEvents();
        this.initRandomWordsEvents();
    },

    initSidebarEvents() {
        // 侧边栏折叠按钮
        document.getElementById('toggleSidebar').addEventListener('click', () => {
            UIManager.toggleSidebar();
        });

        // 侧边栏菜单项
        document.querySelectorAll('#sidebar li').forEach(item => {
            item.addEventListener('click', () => {
                // 先清除所有内容
                UIManager.clearAll();
                
                const action = item.dataset.action;
                const category = item.dataset.category;

                switch (action) {
                    case 'showByCategory':
                        if (category === '词性') {
                            UIManager.showCategoryButtons();
                        } else if (category === '主题') {
                            UIManager.showThemeButtons();
                        }
                        break;
                    case 'showRandomWord':
                        const randomWord = WordManager.getRandomWord();
                        UIManager.displayWordDetail(randomWord);
                        break;
                    case 'showRandomWordsInput':
                        UIManager.showRandomWordsInput();
                        break;
                    case 'showSearchBox':
                        UIManager.showSearchBox();
                        break;
                    case 'showGrammar':
                        UIManager.showGrammar();
                        break;
                }
            });
        });
    },

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    initSearchEvents() {
        const searchInput = UIManager.elements.searchInput;
        
        // 使用防抖处理搜索输入
        const debouncedSearch = this.debounce((query) => {
            const results = WordManager.searchWords(query);
            UIManager.displaySearchResults(results, query);
        }, 300); // 300ms 延迟

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                debouncedSearch(query);
            } else {
                UIManager.elements.searchResults.innerHTML = '';
            }
        });

        // 添加清除按钮
        const clearButton = document.createElement('button');
        clearButton.className = 'clear-search';
        clearButton.innerHTML = '×';
        clearButton.style.display = 'none';
        
        searchInput.parentNode.style.position = 'relative';
        searchInput.parentNode.appendChild(clearButton);

        clearButton.addEventListener('click', () => {
            searchInput.value = '';
            UIManager.elements.searchResults.innerHTML = '';
            clearButton.style.display = 'none';
            searchInput.focus();
        });

        searchInput.addEventListener('input', () => {
            clearButton.style.display = searchInput.value ? 'block' : 'none';
        });
    },

    initWordListEvents() {
        // 词性按钮点击事件
        UIManager.elements.categoryButtons.addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                const type = e.target.dataset.type;
                const words = WordManager.filterByType(type);
                UIManager.displayWords(words);
            }
        });

        // 主题按钮点击事件
        UIManager.elements.themeButtons.addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                const theme = e.target.dataset.theme;
                const words = WordManager.filterByTheme(theme);
                UIManager.displayWords(words);
            }
        });

        // 单词列表点击事件
        UIManager.elements.wordList.addEventListener('click', (e) => {
            const wordItem = e.target.closest('.word-item');
            if (wordItem) {
                const word = WordManager.findWord(wordItem.dataset.word);
                if (word) {
                    UIManager.displayWordDetail(word);
                }
            }
        });

        // 搜索结果点击事件
        UIManager.elements.searchResults.addEventListener('click', (e) => {
            const wordItem = e.target.closest('.word-item');
            if (wordItem) {
                const word = WordManager.findWord(wordItem.dataset.word);
                if (word) {
                    UIManager.displayWordDetail(word);
                }
            }
        });
    },

    initWordDetailEvents() {
        // 关闭详情按钮
        UIManager.elements.wordDetail.querySelector('#closeDetail').addEventListener('click', () => {
            UIManager.closeWordDetail();
        });

        // 链接单词点击事件
        UIManager.elements.wordDetail.addEventListener('click', (e) => {
            if (e.target.matches('.linked-word')) {
                e.preventDefault();
                const word = e.target.dataset.word;
                UIManager.displayLinkedWordDetail(word);
            }
        });

        // 关闭链接单词详情
        UIManager.elements.linkedWordDetail.addEventListener('click', (e) => {
            if (e.target.matches('.close-linked-detail')) {
                UIManager.closeLinkedWordDetail();
            }
        });
    },

    initRandomWordsEvents() {
        // 随机单词数量确认按钮
        document.getElementById('confirmRandom').addEventListener('click', () => {
            const count = parseInt(document.getElementById('randomCount').value);
            if (count > 0 && count <= 100) {
                const randomWords = WordManager.getRandomWords(count);
                UIManager.displayWords(randomWords);
            } else {
                alert('请输入1-100之间的数字');
            }
        });
    }
}; 