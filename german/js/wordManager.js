const WordManager = {
    words: [],

    async loadWords() {
        const jsonFiles = ['adjs.json', 'advs.json', 'nouns.json', 'preps.json', 'pronouns.json', 'verbs.json', 'words.json'];
        try {
            const dataArray = await Promise.all(
                jsonFiles.map(file => fetch(file).then(response => response.json()))
            );
            this.words = dataArray.flat();
            console.log('所有单词数据已加载:', this.words);
            return true;
        } catch (error) {
            console.error('加载文件数据失败:', error);
            return false;
        }
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
        if (!query || query.trim() === '') return [];
        
        query = query.toLowerCase().trim();
        const results = new Set();
        
        // 搜索所有词性
        const searchInCategory = (words, category) => {
            words.forEach(word => {
                const wordLower = word.word.toLowerCase();
                const meaningLower = word.meaning.toLowerCase();
                
                // 完全匹配
                if (wordLower === query || meaningLower === query) {
                    results.add({...word, type: category});
                    return;
                }
                
                // 部分匹配（单词）
                if (wordLower.includes(query)) {
                    results.add({...word, type: category});
                    return;
                }
                
                // 部分匹配（释义）
                if (meaningLower.includes(query)) {
                    results.add({...word, type: category});
                    return;
                }
                
                // 模糊匹配（编辑距离为1）
                if (this.isFuzzyMatch(wordLower, query) || this.isFuzzyMatch(meaningLower, query)) {
                    results.add({...word, type: category});
                }
            });
        };

        // 搜索所有词性
        searchInCategory(this.words.nouns, '名词');
        searchInCategory(this.words.verbs, '动词');
        searchInCategory(this.words.adjectives, '形容词');
        searchInCategory(this.words.adverbs, '副词');
        searchInCategory(this.words.pronouns, '代词');
        searchInCategory(this.words.prepositions, '介词');
        searchInCategory(this.words.others, '其他');

        return Array.from(results);
    },

    // 计算编辑距离
    levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;

        const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

        for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
        for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

        for (let j = 1; j <= b.length; j++) {
            for (let i = 1; i <= a.length; i++) {
                const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[j][i] = Math.min(
                    matrix[j][i - 1] + 1, // 删除
                    matrix[j - 1][i] + 1, // 插入
                    matrix[j - 1][i - 1] + substitutionCost // 替换
                );
            }
        }

        return matrix[b.length][a.length];
    },

    // 模糊匹配（编辑距离为1）
    isFuzzyMatch(str1, str2) {
        return this.levenshteinDistance(str1, str2) <= 1;
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

    // 清理单词，移除标点符号和冠词
    cleanWord(word) {
        return word.toLowerCase()
            .replace(/[.,!?;:]/g, '')  // 移除标点符号
            .replace(/^(der|die|das|ein|eine|einen|einem|dem|den|des|deren|dessen)\s+/i, '')  // 移除冠词
            .trim();
    },

    // 获取单词的所有可能形式
    getWordVariations(word) {
        const variations = new Set([word.toLowerCase()]);
        
        // 添加单复数形式
        if (word.endsWith('s')) {
            variations.add(word.slice(0, -1));
        } else {
            variations.add(word + 's');
        }

        // 添加变音形式
        const umlautMap = {
            'a': 'ä', 'ä': 'a',
            'o': 'ö', 'ö': 'o',
            'u': 'ü', 'ü': 'u'
        };

        for (const [normal, umlaut] of Object.entries(umlautMap)) {
            if (word.includes(normal)) {
                variations.add(word.replace(new RegExp(normal, 'g'), umlaut));
            }
            if (word.includes(umlaut)) {
                variations.add(word.replace(new RegExp(umlaut, 'g'), normal));
            }
        }

        // 添加常见词形变化
        const commonEndings = ['e', 'en', 'er', 'es', 'em'];
        const baseWord = word.replace(/[e|en|er|es|em]$/, '');
        commonEndings.forEach(ending => {
            variations.add(baseWord + ending);
        });

        return Array.from(variations);
    },

    // 查找匹配的单词
    findMatchingWord(word) {
        const cleanWord = this.cleanWord(word);
        const variations = this.getWordVariations(cleanWord);
        
        // 首先尝试完全匹配
        let matchedWord = this.words.find(item => 
            variations.includes(this.cleanWord(item.word))
        );

        // 如果没有完全匹配，尝试部分匹配
        if (!matchedWord) {
            matchedWord = this.words.find(item => {
                const itemWord = this.cleanWord(item.word);
                return variations.some(variation => 
                    itemWord.includes(variation) || variation.includes(itemWord)
                );
            });
        }

        return matchedWord;
    },

    linkifyExample(exampleText) {
        if (!exampleText) return '';
        
        // 分割句子为单词，保留标点符号
        const words = exampleText.match(/\b\w+\b|[.,!?;:]/g) || [];
        let result = '';
        let currentWord = '';
        
        for (let i = 0; i < words.length; i++) {
            const token = words[i];
            
            // 如果是标点符号，直接添加
            if (/[.,!?;:]/.test(token)) {
                if (currentWord) {
                    const matchedWord = this.findMatchingWord(currentWord);
                    if (matchedWord) {
                        result += `<a href="#" class="linked-word" data-word="${matchedWord.word}">${currentWord}</a>`;
                    } else {
                        result += currentWord;
                    }
                    currentWord = '';
                }
                result += token + ' ';
                continue;
            }
            
            // 如果是单词，添加到当前单词
            currentWord += (currentWord ? ' ' : '') + token;
            
            // 检查下一个token是否是标点符号
            const nextToken = words[i + 1];
            if (!nextToken || /[.,!?;:]/.test(nextToken)) {
                const matchedWord = this.findMatchingWord(currentWord);
                if (matchedWord) {
                    result += `<a href="#" class="linked-word" data-word="${matchedWord.word}">${currentWord}</a>`;
                } else {
                    result += currentWord;
                }
                currentWord = '';
            }
        }
        
        // 处理最后一个单词
        if (currentWord) {
            const matchedWord = this.findMatchingWord(currentWord);
            if (matchedWord) {
                result += `<a href="#" class="linked-word" data-word="${matchedWord.word}">${currentWord}</a>`;
            } else {
                result += currentWord;
            }
        }
        
        return result.trim();
    }
}; 