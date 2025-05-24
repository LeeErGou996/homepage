const WordManager = {
    words: [],
    favorites: new Set(),

    async loadWords() {
        const jsonFiles = ['adjs.json', 'advs.json', 'nouns.json', 'preps.json', 'pronouns.json', 'verbs.json', 'words.json'];
        try {
            const dataArray = await Promise.all(
                jsonFiles.map(file => fetch(file).then(response => response.json()))
            );
            this.words = dataArray.flat();
            console.log('所有单词数据已加载:', this.words);
            this.loadFavorites();
            return true;
        } catch (error) {
            console.error('加载文件数据失败:', error);
            return false;
        }
    },

    loadFavorites() {
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            this.favorites = new Set(JSON.parse(savedFavorites));
        }
    },

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify([...this.favorites]));
    },

    toggleFavorite(word) {
        if (this.favorites.has(word)) {
            this.favorites.delete(word);
        } else {
            this.favorites.add(word);
        }
        this.saveFavorites();
    },

    isFavorite(word) {
        return this.favorites.has(word);
    },

    getRandomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)];
    },

    getRandomWords(count) {
        const result = [];
        const tempWords = [...this.words];
        for (let i = 0; i < count && tempWords.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * tempWords.length);
            result.push(tempWords.splice(randomIndex, 1)[0]);
        }
        return result;
    },

    filterByType(type) {
        return this.words.filter(word => word.type === type);
    },

    filterByTheme(theme) {
        return this.words.filter(word => word.subCategory === theme);
    },

    searchWords(query) {
        const lowerQuery = query.toLowerCase();
        return this.words.filter(word => 
            word.word.toLowerCase().includes(lowerQuery) || 
            word.meaning.toLowerCase().includes(lowerQuery)
        );
    },

    getWordTypes() {
        return [...new Set(this.words.map(word => word.type))];
    },

    getThemes() {
        return [...new Set(this.words.map(word => word.subCategory))];
    },

    findWord(word) {
        return this.words.find(item => item.word.toLowerCase() === word.toLowerCase());
    },

    linkifyExample(exampleText) {
        const wordsInExample = exampleText.split(' ');
        return wordsInExample.map(word => {
            const cleanWord = word.replace(/[.,!?;:]/g, '');
            const matchedWord = this.words.find(item => {
                const itemBaseWord = item.word.replace(/^(der|die|das|ein|eine|einen|einem|dem|den)\s+/i, '');
                const regex = new RegExp(`^(${itemBaseWord}|${itemBaseWord}s?|${itemBaseWord.replace(/a/, 'ä')}` +
                    `|${itemBaseWord.replace(/o/, 'ö')}|${itemBaseWord.replace(/u/, 'ü')}|${itemBaseWord.replace(/ä/, 'a')}` +
                    `|${itemBaseWord.replace(/ö/, 'o')}|${itemBaseWord.replace(/ü/, 'u')})$`, 'i');
                return regex.test(cleanWord) || regex.test(cleanWord.replace(/^(der|die|das|ein|eine|einen|einem|dem|den)\s+/i, ''));
            });

            if (matchedWord) {
                return `<a href="#" data-word="${matchedWord.word}" class="linked-word">${word}</a>`;
            }
            return word;
        }).join(' ');
    }
}; 