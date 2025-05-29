// Partizip II 数据
const partizip2Data = [
    {
        infinitive: "gehen",
        partizip2: "gegangen",
        meaning: "去",
        category: "irregular",
        example: "Ich bin nach Hause gegangen."
    },
    {
        infinitive: "kommen",
        partizip2: "gekommen",
        meaning: "来",
        category: "irregular",
        example: "Er ist spät gekommen."
    },
    {
        infinitive: "sehen",
        partizip2: "gesehen",
        meaning: "看",
        category: "irregular",
        example: "Ich habe den Film gesehen."
    },
    {
        infinitive: "essen",
        partizip2: "gegessen",
        meaning: "吃",
        category: "irregular",
        example: "Wir haben zusammen gegessen."
    },
    {
        infinitive: "trinken",
        partizip2: "getrunken",
        meaning: "喝",
        category: "irregular",
        example: "Sie hat Kaffee getrunken."
    },
    {
        infinitive: "schlafen",
        partizip2: "geschlafen",
        meaning: "睡觉",
        category: "irregular",
        example: "Das Kind hat gut geschlafen."
    },
    {
        infinitive: "sprechen",
        partizip2: "gesprochen",
        meaning: "说话",
        category: "irregular",
        example: "Wir haben Deutsch gesprochen."
    },
    {
        infinitive: "schreiben",
        partizip2: "geschrieben",
        meaning: "写",
        category: "irregular",
        example: "Er hat einen Brief geschrieben."
    },
    {
        infinitive: "lesen",
        partizip2: "gelesen",
        meaning: "读",
        category: "irregular",
        example: "Ich habe ein Buch gelesen."
    },
    {
        infinitive: "fahren",
        partizip2: "gefahren",
        meaning: "驾驶",
        category: "irregular",
        example: "Sie ist mit dem Auto gefahren."
    },
    {
        "infinitive": "fliegen",
        "partizip2": "geflogen",
        "meaning": "飞",
        "category": "irregular",
        "example": "Ich bin nach Berlin geflogen."
    },
    {
        "infinitive": "laufen",
        "partizip2": "gelaufen",
        "meaning": "跑，走",
        "category": "irregular",
        "example": "Er ist sehr schnell gelaufen."
    },
    {
        "infinitive": "springen",
        "partizip2": "gesprungen",
        "meaning": "跳",
        "category": "irregular",
        "example": "Das Kind ist hoch gesprungen."
    },
    {
        infinitive: "bekommen",
        partizip2: "bekommen",
        meaning: "得到",
        category: "regular",
        example: "Ich habe einen Brief bekommen."
    },
    {
        infinitive: "zahlen",
        partizip2: "gezahlt",
        meaning: "支付",
        category: "regular",
        example: "Er hat die Rechnung gezahlt."
    },
    {
        infinitive: "umtauschen",
        partizip2: "umgetauscht",
        meaning: "交换",
        category: "separableRegular",
        example: "Ich habe das Kleid umgetauscht."
    },
    {
        infinitive: "bestellen",
        partizip2: "bestellt",
        meaning: "订购",
        category: "regular",
        example: "Wir haben Pizza bestellt."
    },
    {
        infinitive: "gefallen",
        partizip2: "gefallen",
        meaning: "喜欢",
        category: "irregular",
        example: "Der Film hat mir gefallen."
    },
    {
        "infinitive": "fallen",
        "partizip2": "gefallen",
        "meaning": "掉下",
        "category": "irregular",
        "example": "Sie ist auf den Boden gefallen."
    },
    {
        infinitive: "gehören",
        partizip2: "gehört",
        meaning: "属于",
        category: "regular",
        example: "Das Buch hat mir gehört."
    },
    {
        infinitive: "anrufen",
        partizip2: "angerufen",
        meaning: "打电话",
        category: "separableIrregular",
        example: "Ich habe meine Mutter angerufen."
    },
    {
        infinitive: "verstehen",
        partizip2: "verstanden",
        meaning: "理解",
        category: "irregular",
        example: "Ich habe den Text verstanden."
    },
    {
        infinitive: "passen",
        partizip2: "gepasst",
        meaning: "适合",
        category: "regular",
        example: "Das Kleid hat mir gepasst."
    },
    {
        infinitive: "anprobieren",
        partizip2: "anprobiert",
        meaning: "试穿",
        category: "separableRegular",
        example: "Ich habe das Kleid anprobiert."
    },
    {
        infinitive: "probieren",
        partizip2: "probiert",
        meaning: "尝试",
        category: "regular",
        example: "Ich habe das Essen probiert."
    },
    {
        infinitive: "vergleichen",
        partizip2: "verglichen",
        meaning: "比较",
        category: "irregular",
        example: "Ich habe die Preise verglichen."
    },
    {
        infinitive: "zurückschicken",
        partizip2: "zurückgeschickt",
        meaning: "退回",
        category: "separableRegular",
        example: "Ich habe das Paket zurückgeschickt."
    },
    {
        infinitive: "aussehen",
        partizip2: "ausgesehen",
        meaning: "看起来",
        category: "separableIrregular",
        example: "Du hast heute gut ausgesehen."
    },
    {
        infinitive: "einkaufen",
        partizip2: "eingekauft",
        meaning: "购物",
        category: "separableRegular",
        example: "Wir haben im Supermarkt eingekauft."
    },
    {
        infinitive: "stehen",
        partizip2: "gestanden",
        meaning: "站立",
        category: "irregular",
        example: "Ich habe lange gestanden."
    },
    {
        infinitive: "nehmen",
        partizip2: "genommen",
        meaning: "拿",
        category: "irregular",
        example: "Ich habe das Buch genommen."
    },
    {
        "infinitive": "annehmen",
        "partizip2": "angenommen",
        "meaning": "接受",
        "category": "separableIrregular",
        "example": "Ich habe das Geschenk angenommen."
    },
    {
        infinitive: "anziehen",
        partizip2: "angezogen",
        meaning: "穿",
        category: "separableIrregular",
        example: "Ich habe mich warm angezogen."
    },
    {
        infinitive: "bestellen",
        partizip2: "bestellt",
        meaning: "订购",
        category: "regular",
        example: "Wir haben Pizza bestellt."
    },
    {
        infinitive: "ankommen",
        partizip2: "angekommen",
        meaning: "到达",
        category: "separableIrregular",
        example: "Der Zug ist pünktlich angekommen."
    },
    {
        "infinitive": "reisen",
        "partizip2": "gereist",
        "meaning": "旅行",
        "category": "regular",
        "example": "Sie ist viel gereist."
    },
    {
        "infinitive": "einsteigen",
        "partizip2": "eingestiegen",
        "meaning": "上车",
        "category": "separableIrregular",
        "example": "Er ist in den Bus eingestiegen."
    },
    {
        "infinitive": "aussteigen",
        "partizip2": "ausgestiegen",
        "meaning": "下车",
        "category": "separableIrregular",
        "example": "Wir sind an der Haltestelle ausgestiegen."
    },
    {
        infinitive: "bezahlen",
        partizip2: "bezahlt",
        meaning: "支付",
        category: "regular",
        example: "Ich habe die Rechnung bezahlt."
    },
    {
        infinitive: "verkaufen",
        partizip2: "verkauft",
        meaning: "卖",
        category: "regular",
        example: "Er hat sein Auto verkauft."
    },
    {
        infinitive: "verstehen",
        partizip2: "verstanden",
        meaning: "理解",
        category: "irregular",
        example: "Ich habe den Text verstanden."
    },
    {
        infinitive: "besuchen",
        partizip2: "besucht",
        meaning: "访问",
        category: "regular",
        example: "Ich habe meine Großeltern besucht."
    },
    {
        infinitive: "einladen",
        partizip2: "eingeladen",
        meaning: "邀请",
        category: "separableIrregular",
        example: "Ich habe Freunde eingeladen."
    },
    {
        infinitive: "empfehlen",
        partizip2: "empfohlen",
        meaning: "推荐",
        category: "irregular",
        example: "Der Arzt hat mir dieses Medikament empfohlen."
    },
    {
        infinitive: "telefonieren",
        partizip2: "telefoniert",
        meaning: "打电话",
        category: "regular",
        example: "Ich habe lange telefoniert."
    },
    {
        infinitive: "finden",
        partizip2: "gefunden",
        meaning: "找到",
        category: "irregular",
        example: "Ich habe meinen Schlüssel gefunden."
    },
      {
    "infinitive": "anmachen",
    "partizip2": "angemacht",
    "meaning": "打开（灯）",
    "category": "separableRegular",
    "example": "Ich habe das Licht angemacht."
  },
  {
    "infinitive": "eingeben",
    "partizip2": "eingegeben",
    "meaning": "输入（密码）",
    "category": "separableIrregular",
    "example": "Er hat das Passwort eingegeben."
  },
  {
    "infinitive": "umziehen",
    "partizip2": "umgezogen",
    "meaning": "搬家",
    "category": "separableIrregular",
    "example": "Wann bist du umgezogen?"
  },
  {
    "infinitive": "vorlesen",
    "partizip2": "vorgelesen",
    "meaning": "朗读",
    "category": "separableIrregular",
    "example": "Wir haben den Kindern ein Buch vorgelesen."
  },
  {
    "infinitive": "bleiben",
    "partizip2": "geblieben",
    "meaning": "停留",
    "category": "irregular",
    "example": "Wir sind zu Hause geblieben."
},
{
    "infinitive": "werden",
    "partizip2": "geworden",
    "meaning": "变成",
    "category": "irregular",
    "example": "Er ist Arzt geworden."
},
  {
    "infinitive": "aufstehen",
    "partizip2": "aufgestanden",
    "meaning": "起床",
    "category": "separableIrregular",
    "example": "Sie ist um 6.00 Uhr aufgestanden."
  },
  {
    "infinitive": "vergessen",
    "partizip2": "vergessen",
    "meaning": "忘记",
    "category": "irregular",
    "example": "Ich habe oft meine Hausaufgaben vergessen."
  },
  {
    "infinitive": "untersuchen",
    "partizip2": "untersucht",
    "meaning": "检查",
    "category": "regular",
    "example": "Der Arzt hat den Patienten untersucht."
  },
  {
    "infinitive": "abholen",
    "partizip2": "abgeholt",
    "meaning": "接（人）",
    "category": "separableRegular",
    "example": "Peter hat seine Freundin am Bahnhof abgeholt."
  },
  {
    "infinitive": "wiederholen",
    "partizip2": "wiederholt",
    "meaning": "重复",
    "category": "regular",
    "example": "Ihr habt die Übungen wiederholt."
  },
  {
    "infinitive": "unterschreiben",
    "partizip2": "unterschrieben",
    "meaning": "签署",
    "category": "irregular",
    "example": "Ich habe den Vertrag unterschrieben."
  },
  {
    "infinitive": "weitermachen",
    "partizip2": "weitergemacht",
    "meaning": "继续做",
    "category": "separableRegular",
    "example": "Wir haben weitergemacht."
  },
  {
    "infinitive": "erklären",
    "partizip2": "erklärt",
    "meaning": "解释",
    "category": "regular",
    "example": "Susie hat das Projekt erklärt."
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

    const categories = {
        regular: partizip2Data.filter(word => word.category === 'regular'),
        irregular: partizip2Data.filter(word => word.category === 'irregular'),
        separableRegular: partizip2Data.filter(word => word.category === 'separableRegular'),
        separableIrregular: partizip2Data.filter(word => word.category === 'separableIrregular')
    };

    Object.entries(categories).forEach(([category, words]) => {
        if (words.length > 0) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'learning-group';
            categoryDiv.innerHTML = `<h3>${category}</h3>`;
            words.forEach(word => {
                const wordDiv = document.createElement('div');
                wordDiv.className = 'word-item';
                wordDiv.innerHTML = `
                    <div>动词原形: ${word.infinitive}</div>
                    <div>过去分词: ${word.partizip2}</div>
                    <div>中文意思: ${word.meaning}</div>
                    <div class="example" style="display: none; margin-top: 10px; color: #666;">
                        <div>例句: ${word.example}</div>
                    </div>
                `;
                wordDiv.style.cursor = 'pointer';
                wordDiv.onclick = function() {
                    const exampleDiv = this.querySelector('.example');
                    exampleDiv.style.display = exampleDiv.style.display === 'none' ? 'block' : 'none';
                };
                categoryDiv.appendChild(wordDiv);
            });
            learningList.appendChild(categoryDiv);
        }
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