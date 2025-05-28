// Partizip II 数据
const partizip2Data = [
    {
        infinitive: "gehen",
        partizip2: "gegangen",
        meaning: "去",
        example: "Ich bin nach Hause gegangen."
    },
    {
        infinitive: "kommen",
        partizip2: "gekommen",
        meaning: "来",
        example: "Er ist spät gekommen."
    },
    {
        infinitive: "sehen",
        partizip2: "gesehen",
        meaning: "看",
        example: "Ich habe den Film gesehen."
    },
    {
        infinitive: "essen",
        partizip2: "gegessen",
        meaning: "吃",
        example: "Wir haben zusammen gegessen."
    },
    {
        infinitive: "trinken",
        partizip2: "getrunken",
        meaning: "喝",
        example: "Sie hat Kaffee getrunken."
    },
    {
        infinitive: "schlafen",
        partizip2: "geschlafen",
        meaning: "睡觉",
        example: "Das Kind hat gut geschlafen."
    },
    {
        infinitive: "sprechen",
        partizip2: "gesprochen",
        meaning: "说话",
        example: "Wir haben Deutsch gesprochen."
    },
    {
        infinitive: "schreiben",
        partizip2: "geschrieben",
        meaning: "写",
        example: "Er hat einen Brief geschrieben."
    },
    {
        infinitive: "lesen",
        partizip2: "gelesen",
        meaning: "读",
        example: "Ich habe ein Buch gelesen."
    },
    {
        infinitive: "fahren",
        partizip2: "gefahren",
        meaning: "驾驶",
        example: "Sie ist mit dem Auto gefahren."
    }
];

// 当前练习状态
let currentExercise = {
    words: [],
    currentIndex: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0
};

// 开始练习
function startPartizip2Exercise() {
    const count = parseInt(document.getElementById('partizip2Count').value);
    if (isNaN(count) || count < 1 || count > 50) {
        alert('请输入1-50之间的数字');
        return;
    }

    // 随机选择指定数量的动词
    currentExercise.words = [...partizip2Data]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);
    currentExercise.currentIndex = 0;
    currentExercise.correct = 0;
    currentExercise.incorrect = 0;
    currentExercise.skipped = 0;

    // 显示练习界面
    document.getElementById('partizip2Setup').style.display = 'none';
    document.getElementById('partizip2Exercise').style.display = 'block';
    document.getElementById('partizip2Learning').style.display = 'none';
    document.getElementById('partizip2Results').style.display = 'none';

    showNextQuestion();
}

// 显示下一个问题
function showNextQuestion() {
    if (currentExercise.currentIndex >= currentExercise.words.length) {
        showResults();
        return;
    }

    const currentWord = currentExercise.words[currentExercise.currentIndex];
    document.getElementById('currentWord').textContent = currentWord.infinitive;
    document.getElementById('partizip2Answer').value = '';
    document.getElementById('partizip2Feedback').textContent = '';
    document.getElementById('partizip2Progress').textContent = 
        `进度: ${currentExercise.currentIndex + 1}/${currentExercise.words.length}`;
}

// 检查答案
function checkPartizip2Answer() {
    const answer = document.getElementById('partizip2Answer').value.trim().toLowerCase();
    const currentWord = currentExercise.words[currentExercise.currentIndex];
    const feedback = document.getElementById('partizip2Feedback');

    if (answer === currentWord.partizip2.toLowerCase()) {
        feedback.textContent = '正确！';
        feedback.style.color = 'green';
        currentExercise.correct++;
    } else {
        feedback.textContent = `错误！正确答案是: ${currentWord.partizip2}`;
        feedback.style.color = 'red';
        currentExercise.incorrect++;
    }

    setTimeout(() => {
        currentExercise.currentIndex++;
        showNextQuestion();
    }, 1500);
}

// 跳过当前问题
function skipPartizip2Question() {
    const currentWord = currentExercise.words[currentExercise.currentIndex];
    const feedback = document.getElementById('partizip2Feedback');
    feedback.textContent = `已跳过。正确答案是: ${currentWord.partizip2}`;
    feedback.style.color = 'orange';
    currentExercise.skipped++;

    setTimeout(() => {
        currentExercise.currentIndex++;
        showNextQuestion();
    }, 1500);
}

// 显示学习模式
function showPartizip2Learning() {
    document.getElementById('partizip2Setup').style.display = 'none';
    document.getElementById('partizip2Exercise').style.display = 'none';
    document.getElementById('partizip2Learning').style.display = 'block';
    document.getElementById('partizip2Results').style.display = 'none';

    const learningList = document.getElementById('partizip2LearningList');
    learningList.innerHTML = '';

    partizip2Data.forEach(word => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'learning-group';
        wordDiv.innerHTML = `
            <div class="word-item">
                <div>动词原形: ${word.infinitive}</div>
                <div>过去分词: ${word.partizip2}</div>
                <div>中文意思: ${word.meaning}</div>
            </div>
            <div class="example-item">
                <div class="example-question">例句:</div>
                <div class="example-answer">${word.example}</div>
            </div>
        `;
        learningList.appendChild(wordDiv);
    });
}

// 显示练习结果
function showResults() {
    document.getElementById('partizip2Exercise').style.display = 'none';
    document.getElementById('partizip2Results').style.display = 'block';

    const resultsList = document.getElementById('partizip2ResultsList');
    resultsList.innerHTML = `
        <div class="results-summary">
            <h3>练习结果</h3>
            <p>总题数: ${currentExercise.words.length}</p>
            <p>正确: ${currentExercise.correct}</p>
            <p>错误: ${currentExercise.incorrect}</p>
            <p>跳过: ${currentExercise.skipped}</p>
            <p>正确率: ${((currentExercise.correct / currentExercise.words.length) * 100).toFixed(1)}%</p>
        </div>
        <div class="results-details">
            ${currentExercise.words.map((word, index) => `
                <div class="result-item">
                    <div>${index + 1}. ${word.infinitive} → ${word.partizip2}</div>
                    <div>中文意思: ${word.meaning}</div>
                    <div>例句: ${word.example}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// 返回设置界面
function showPartizip2Setup() {
    document.getElementById('partizip2Exercise').style.display = 'none';
    document.getElementById('partizip2Learning').style.display = 'none';
    document.getElementById('partizip2Results').style.display = 'none';
    document.getElementById('partizip2Setup').style.display = 'block';
}

window.startPartizip2Exercise = startPartizip2Exercise;
window.showPartizip2Learning = showPartizip2Learning;
window.checkPartizip2Answer = checkPartizip2Answer;
window.skipPartizip2Question = skipPartizip2Question;
window.showPartizip2Setup = showPartizip2Setup; 