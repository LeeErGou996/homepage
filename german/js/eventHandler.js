const EventHandler = {
    init() {
        this.initSidebarEvents();
        this.initSearchEvents();
        this.initWordListEvents();
        this.initWordDetailEvents();
        this.initRandomWordsEvents();
        this.initThemeEvents();
        UIManager.initTheme(); // 初始化主题
    },

    initSidebarEvents() {
        // 侧边栏折叠按钮
        document.getElementById('toggleSidebar').addEventListener('click', () => {
            UIManager.toggleSidebar();
        });

        // 侧边栏菜单项
        document.querySelectorAll('#sidebar li').forEach(item => {
            item.addEventListener('click', () => {
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
                    case 'toggleDarkMode':
                        UIManager.toggleTheme();
                        break;
                }
            });
        });
    },

    initSearchEvents() {
        // 搜索输入防抖
        let searchTimeout;
        UIManager.elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const results = WordManager.searchWords(e.target.value);
                UIManager.displaySearchResults(results);
            }, 300);
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
    },

    initThemeEvents() {
        // 监听系统主题变化
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        prefersDarkScheme.addListener((e) => {
            // 如果用户没有手动设置主题，则跟随系统
            if (localStorage.getItem('darkMode') === null) {
                if (e.matches) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            }
        });
    }
}; 