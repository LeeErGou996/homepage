/* Shared destination data for travel.html, travel1.html and travel_munich.html.
 *
 * To add a place: add a city to a country (or a new country) below.
 *   folder  = sub-folder name under travel/<country.folder>/ (exact spelling, as on disk)
 *   a city without `folder` shows all photos of its country
 * Reserved destinations simply have an empty folder: they show a dashed marker
 * and "photos coming soon" until the first photo arrives.
 */
window.TRAVEL = {
  gh: { user: 'LeeErGou996', repo: 'leeergou.github.io', branch: 'main' },

  /* [fill, ring] taken from each national flag; neighbouring countries get clearly different hues.
     Add one line here when you add a country (fallback is the amber accent). */
  colors: {
    japan:       ['#E4002B', '#FFFFFF'],   // red disc on white
    hongkong:    ['#FF7AA2', '#FFFFFF'],   // bauhinia pink
    germany:     ['#FFCE00', '#DD0000'],   // gold + red
    austria:     ['#FFFFFF', '#ED2939'],   // red-white-red
    czech:       ['#2F7BEF', '#D7141A'],   // blue + red
    hungary:     ['#9ACD32', '#CE2939'],   // green + red
    italy:       ['#00A383', '#FFFFFF'],   // green
    france:      ['#3A44E0', '#EF4135'],   // bleu + rouge
    netherlands: ['#FF8C00', '#21468B'],   // Oranje + blue
    belgium:     ['#F7E24B', '#1B1B1B'],   // yellow + black
    slovakia:    ['#EE1C25', '#0B4EA2'],   // red + blue
    sweden:      ['#1F8BD6', '#FECC02'],   // blue + yellow
    finland:     ['#FFFFFF', '#003580'],   // white + blue
    estonia:     ['#4FB3FF', '#111111'],   // blue + black
    latvia:      ['#9E3039', '#FFFFFF'],   // carmine
    lithuania:   ['#FDB913', '#006A44'],   // yellow + green
    norway:      ['#00205B', '#EF2B2D'],   // navy + red
    denmark:     ['#D3293B', '#FFFFFF'],   // Dannebrog red
    bavaria:     ['#0098D4', '#FFFFFF']    // Bavarian blue-white
  },

  countries: [
    {
      id: 'japan', folder: 'japan_travel',
      name: { en: 'Japan', zh: '日本', ja: '日本', de: 'Japan' },
      cities: [
        { id: 'tokyo', folder: 'tokyo', lat: 35.6762, lon: 139.6503, name: { en: 'Tokyo', zh: '东京', ja: '東京', de: 'Tokio' } },
        { id: 'kyoto', folder: 'kyoto', lat: 35.0116, lon: 135.7681, name: { en: 'Kyoto', zh: '京都', ja: '京都', de: 'Kyoto' } },
        { id: 'osaka', folder: 'osaka', lat: 34.6937, lon: 135.5023, name: { en: 'Osaka', zh: '大阪', ja: '大阪', de: 'Osaka' } },
        { id: 'kamakura', folder: 'kamamura', lat: 35.3192, lon: 139.5467, name: { en: 'Kamakura', zh: '镰仓', ja: '鎌倉', de: 'Kamakura' } }
      ]
    },
    {
      id: 'hongkong', folder: 'hongkong_travel',
      name: { en: 'Hong Kong', zh: '中国香港', ja: '香港', de: 'Hongkong' },
      cities: [
        { id: 'hongkong', folder: 'hongkong', lat: 22.3193, lon: 114.1694, name: { en: 'Hong Kong', zh: '香港', ja: '香港', de: 'Hongkong' } }
      ]
    },
    {
      id: 'germany', folder: 'germany_travel',
      name: { en: 'Germany', zh: '德国', ja: 'ドイツ', de: 'Deutschland' },
      cities: [
        { id: 'munich', folder: 'munich', lat: 48.1351, lon: 11.5820, link: 'travel_munich.html', name: { en: 'Munich', zh: '慕尼黑', ja: 'ミュンヘン', de: 'München' } },
        { id: 'berlin', folder: 'berlin', lat: 52.5200, lon: 13.4050, name: { en: 'Berlin', zh: '柏林', ja: 'ベルリン', de: 'Berlin' } },
        { id: 'potsdam', folder: 'potsdam', lat: 52.3906, lon: 13.0645, name: { en: 'Potsdam', zh: '波茨坦', ja: 'ポツダム', de: 'Potsdam' } },
        { id: 'hamburg', folder: 'hamburg', lat: 53.5511, lon: 9.9937, name: { en: 'Hamburg', zh: '汉堡', ja: 'ハンブルク', de: 'Hamburg' } },
        { id: 'bremen', folder: 'bremen', lat: 53.0793, lon: 8.8017, name: { en: 'Bremen', zh: '不来梅', ja: 'ブレーメン', de: 'Bremen' } },
        { id: 'frankfurt', folder: 'frankfurt', lat: 50.1109, lon: 8.6821, name: { en: 'Frankfurt', zh: '法兰克福', ja: 'フランクフルト', de: 'Frankfurt' } },
        { id: 'heidelberg', folder: 'heidberg', lat: 49.3988, lon: 8.6724, name: { en: 'Heidelberg', zh: '海德堡', ja: 'ハイデルベルク', de: 'Heidelberg' } },
        { id: 'stuttgart', folder: 'stuttgart', lat: 48.7758, lon: 9.1829, name: { en: 'Stuttgart', zh: '斯图加特', ja: 'シュトゥットガルト', de: 'Stuttgart' } },
        { id: 'dusseldorf', folder: 'düsseldorf', lat: 51.2217, lon: 6.7762, name: { en: 'Düsseldorf', zh: '杜塞尔多夫', ja: 'デュッセルドルフ', de: 'Düsseldorf' } },
        { id: 'koln', folder: 'Köln', lat: 50.9375, lon: 6.9603, name: { en: 'Cologne', zh: '科隆', ja: 'ケルン', de: 'Köln' } }
      ]
    },
    {
      id: 'austria', folder: 'austria_travel',
      name: { en: 'Austria', zh: '奥地利', ja: 'オーストリア', de: 'Österreich' },
      cities: [
        { id: 'wien', folder: 'wien', lat: 48.2082, lon: 16.3738, name: { en: 'Vienna', zh: '维也纳', ja: 'ウィーン', de: 'Wien' } }
      ]
    },
    {
      id: 'hungary', folder: 'hungary_travel',
      name: { en: 'Hungary', zh: '匈牙利', ja: 'ハンガリー', de: 'Ungarn' },
      cities: [
        { id: 'budapest', folder: 'budapest', lat: 47.4979, lon: 19.0402, name: { en: 'Budapest', zh: '布达佩斯', ja: 'ブダペスト', de: 'Budapest' } }
      ]
    },
    {
      id: 'czech', folder: 'czech_travel',
      name: { en: 'Czechia', zh: '捷克', ja: 'チェコ', de: 'Tschechien' },
      cities: [
        { id: 'prague', lat: 50.0755, lon: 14.4378, name: { en: 'Prague', zh: '布拉格', ja: 'プラハ', de: 'Prag' } }
      ]
    },
    {
      id: 'italy', folder: 'italy_travel',
      name: { en: 'Italy & Vatican City', zh: '意大利与梵蒂冈', ja: 'イタリアとバチカン', de: 'Italien & Vatikanstadt' },
      cities: [
        { id: 'rome', lat: 41.9028, lon: 12.4964, name: { en: 'Rome', zh: '罗马', ja: 'ローマ', de: 'Rom' } }
      ]
    },
    {
      id: 'france', folder: 'france_travel',
      name: { en: 'France', zh: '法国', ja: 'フランス', de: 'Frankreich' },
      cities: [
        { id: 'strasbourg', lat: 48.5734, lon: 7.7521, name: { en: 'Strasbourg', zh: '斯特拉斯堡', ja: 'ストラスブール', de: 'Straßburg' } },
        { id: 'colmar', lat: 48.0794, lon: 7.3586, name: { en: 'Colmar', zh: '科尔马', ja: 'コルマール', de: 'Colmar' } }
      ]
    },
    {
      id: 'netherlands', folder: 'netherlands_travel',
      name: { en: 'Netherlands', zh: '荷兰', ja: 'オランダ', de: 'Niederlande' },
      cities: [
        { id: 'amsterdam', folder: 'amsterdam', lat: 52.3676, lon: 4.9041, name: { en: 'Amsterdam', zh: '阿姆斯特丹', ja: 'アムステルダム', de: 'Amsterdam' } },
        { id: 'rotterdam', folder: 'rotterdam', lat: 51.9225, lon: 4.4792, name: { en: 'Rotterdam', zh: '鹿特丹', ja: 'ロッテルダム', de: 'Rotterdam' } }
      ]
    },
    {
      id: 'belgium', folder: 'belgium_travel',
      name: { en: 'Belgium', zh: '比利时', ja: 'ベルギー', de: 'Belgien' },
      cities: [
        { id: 'brussels', folder: 'brussels', lat: 50.8503, lon: 4.3517, name: { en: 'Brussels', zh: '布鲁塞尔', ja: 'ブリュッセル', de: 'Brüssel' } },
        { id: 'antwerp', folder: 'antwerp', lat: 51.2194, lon: 4.4025, name: { en: 'Antwerp', zh: '安特卫普', ja: 'アントワープ', de: 'Antwerpen' } }
      ]
    },
    {
      id: 'slovakia', folder: 'slovak_travel',
      name: { en: 'Slovakia', zh: '斯洛伐克', ja: 'スロバキア', de: 'Slowakei' },
      cities: [
        { id: 'bratislava', folder: 'Bratislava', lat: 48.1486, lon: 17.1077, name: { en: 'Bratislava', zh: '布拉迪斯拉发', ja: 'ブラチスラヴァ', de: 'Bratislava' } }
      ]
    },
    {
      id: 'sweden', folder: 'sweden_travel',
      name: { en: 'Sweden', zh: '瑞典', ja: 'スウェーデン', de: 'Schweden' },
      cities: [
        { id: 'stockholm', folder: 'stockholm', lat: 59.3293, lon: 18.0686, name: { en: 'Stockholm', zh: '斯德哥尔摩', ja: 'ストックホルム', de: 'Stockholm' } },
        { id: 'gothenburg', folder: 'gothenburg', lat: 57.7089, lon: 11.9746, name: { en: 'Gothenburg', zh: '哥德堡', ja: 'ヨーテボリ', de: 'Göteborg' } },
        { id: 'helsingborg', folder: 'helsingborg', lat: 56.0465, lon: 12.6945, name: { en: 'Helsingborg', zh: '赫尔辛堡', ja: 'ヘルシンボリ', de: 'Helsingborg' } }
      ]
    },
    /* ---- reserved: folders already exist (with a placeholder.txt) ---- */
    {
      id: 'finland', folder: 'finland_travel',
      name: { en: 'Finland', zh: '芬兰', ja: 'フィンランド', de: 'Finnland' },
      cities: [{ id: 'helsinki', folder: 'helsinki', lat: 60.1699, lon: 24.9384, name: { en: 'Helsinki', zh: '赫尔辛基', ja: 'ヘルシンキ', de: 'Helsinki' } }]
    },
    {
      id: 'estonia', folder: 'estonia_travel',
      name: { en: 'Estonia', zh: '爱沙尼亚', ja: 'エストニア', de: 'Estland' },
      cities: [{ id: 'tallinn', folder: 'tallinn', lat: 59.4370, lon: 24.7536, name: { en: 'Tallinn', zh: '塔林', ja: 'タリン', de: 'Tallinn' } }]
    },
    {
      id: 'latvia', folder: 'latvia_travel',
      name: { en: 'Latvia', zh: '拉脱维亚', ja: 'ラトビア', de: 'Lettland' },
      cities: [{ id: 'riga', folder: 'riga', lat: 56.9496, lon: 24.1052, name: { en: 'Riga', zh: '里加', ja: 'リガ', de: 'Riga' } }]
    },
    {
      id: 'lithuania', folder: 'lithuania_travel',
      name: { en: 'Lithuania', zh: '立陶宛', ja: 'リトアニア', de: 'Litauen' },
      cities: [{ id: 'vilnius', folder: 'vilnius', lat: 54.6872, lon: 25.2797, name: { en: 'Vilnius', zh: '维尔纽斯', ja: 'ヴィリニュス', de: 'Vilnius' } }]
    },
    {
      id: 'norway', folder: 'norway_travel',
      name: { en: 'Norway', zh: '挪威', ja: 'ノルウェー', de: 'Norwegen' },
      cities: [{ id: 'oslo', folder: 'oslo', lat: 59.9139, lon: 10.7522, name: { en: 'Oslo', zh: '奥斯陆', ja: 'オスロ', de: 'Oslo' } }]
    },
    {
      id: 'denmark', folder: 'denmark_travel',
      name: { en: 'Denmark', zh: '丹麦', ja: 'デンマーク', de: 'Dänemark' },
      cities: [{ id: 'copenhagen', folder: 'copenhagen', lat: 55.6761, lon: 12.5683, name: { en: 'Copenhagen', zh: '哥本哈根', ja: 'コペンハーゲン', de: 'Kopenhagen' } }]
    }
  ],

  /* Regional log shown on travel_munich.html (photos live in travel/Munich_travel) */
  bavaria: {
    id: 'bavaria', folder: 'Munich_travel',
    name: { en: 'Munich & Bavaria', zh: '慕尼黑与巴伐利亚', ja: 'ミュンヘンとバイエルン', de: 'München & Bayern' },
    cities: [
      { id: 'munich', folder: 'munich', lat: 48.1351, lon: 11.5820, name: { en: 'Munich', zh: '慕尼黑', ja: 'ミュンヘン', de: 'München' } },
      { id: 'garmisch', folder: 'garmisch', lat: 47.4921, lon: 11.0958, name: { en: 'Garmisch-Partenkirchen', zh: '加尔米施-帕滕基兴', ja: 'ガルミッシュ＝パルテンキルヒェン', de: 'Garmisch-Partenkirchen' } },
      { id: 'eibsee', folder: 'eibsee', lat: 47.4578, lon: 10.9922, name: { en: 'Eibsee', zh: '艾布湖', ja: 'アイプ湖', de: 'Eibsee' } },
      { id: 'kochel', folder: 'kochel', lat: 47.6534, lon: 11.3686, name: { en: 'Kochel am See', zh: '科赫尔湖畔', ja: 'コッヘル・アム・ゼー', de: 'Kochel am See' } },
      { id: 'herzogstand', folder: 'herzogstand', lat: 47.6106, lon: 11.3142, name: { en: 'Herzogstand', zh: '赫尔措格斯坦德山', ja: 'ヘルツォークシュタント', de: 'Herzogstand' } },
      { id: 'frottmaning', folder: 'fröttmaning', lat: 48.2190, lon: 11.6240, name: { en: 'Fröttmaning', zh: '弗勒特曼宁', ja: 'フレットマニング', de: 'Fröttmaning' } },
      { id: 'landshut', folder: 'landshut', lat: 48.5440, lon: 12.1460, name: { en: 'Landshut', zh: '兰茨胡特', ja: 'ランツフート', de: 'Landshut' } }
    ]
  },

  /* Timeline on travel.html. places = [countryId, cityId] pairs shown as chips. */
  trips: [
    {
      id: 'japan', from: '2024-04-28', to: '2024-05-07',
      title: { en: 'Japan', zh: '日本', ja: '日本', de: 'Japan' },
      places: [['japan', 'tokyo'], ['japan', 'kyoto'], ['japan', 'osaka'], ['japan', 'kamakura']],
      pdf: 'travel/japan_travel/japan_travel.pdf',
      note: {
        en: 'My first trip abroad and my first time in Japan. Tokyo, Kyoto, Uji, Osaka and Kamakura (Fujisawa) within one week. I met my alumnus, my professor and a fellow countryman in Tokyo. The trip was smooth and wonderful: lots of souvenirs, lots of anime goods, and many landmarks famous in the real world and in anime. I am looking forward to my second trip to Japan.',
        zh: '第一次出国旅行,也是第一次去日本。一周内去了东京、京都、宇治、大阪和镰仓(藤泽)。在东京见到了学长、教授和同乡。旅途顺利而美好,买了很多纪念品和动漫周边,逛了许多现实中和动漫里都很有名的地方。期待第二次日本之旅。'
      }
    },
    {
      id: 'munich', from: '2024-09-26', to: '2025-08-22',
      title: { en: 'Studying in Munich', zh: '在慕尼黑留学', ja: 'ミュンヘン留学', de: 'Studium in München' },
      places: [['germany', 'munich']],
      link: 'travel_munich.html',
      note: {
        en: 'Studying in Munich, Germany. The studies are not easy, so I explore the city and the country in my free time. Munich is a big city and the weather is often cloudy; when it is sunny, my mood feels better.',
        zh: '在德国慕尼黑留学。学业不轻松,空闲时间就去探索这座城市和这个国家。慕尼黑是座大城市,天气常常阴沉;放晴的时候,心情也会好很多。'
      }
    },
    {
      id: 'china', from: '2025-08-26', to: '2025-09-23',
      title: { en: 'China, via Vienna & Budapest', zh: '回国,途经维也纳与布达佩斯', ja: '中国へ(ウィーン・ブダペスト経由)', de: 'China, über Wien & Budapest' },
      places: [['austria', 'wien'], ['hungary', 'budapest']],
      note: {
        en: 'Going home for a break. On the way back I stopped by Vienna and Budapest.',
        zh: '回国休息一段时间,返程途中在维也纳和布达佩斯停留。'
      }
    },
    {
      id: 'czech', from: '2025-11-15', to: '2025-11-16',
      title: { en: 'Czechia', zh: '捷克', ja: 'チェコ', de: 'Tschechien' },
      places: [['czech', 'prague']],
      note: { en: 'Travel to Prague, Czechia.', zh: '前往捷克布拉格。' }
    },
    {
      id: 'italy', from: '2025-12-06', to: '2025-12-08',
      title: { en: 'Italy & Vatican City', zh: '意大利与梵蒂冈', ja: 'イタリアとバチカン', de: 'Italien & Vatikanstadt' },
      places: [['italy', 'rome']],
      note: { en: 'Travel to Rome and Vatican City.', zh: '前往罗马和梵蒂冈。' }
    },
    {
      id: 'france', from: '2025-12-24', to: '2025-12-25',
      title: { en: 'France', zh: '法国', ja: 'フランス', de: 'Frankreich' },
      places: [['france', 'strasbourg'], ['france', 'colmar']],
      note: {
        en: 'Travel to Strasbourg and Colmar, France, for seichi junrei (an anime pilgrimage).',
        zh: '前往法国斯特拉斯堡和科尔马,进行圣地巡礼。'
      }
    },
    {
      id: 'netherlands', from: '2026-03-14', to: '2026-03-15',
      title: { en: 'Netherlands', zh: '荷兰', ja: 'オランダ', de: 'Niederlande' },
      places: [['netherlands', 'amsterdam'], ['netherlands', 'rotterdam']],
      note: { en: 'Travel to Amsterdam and Rotterdam.', zh: '前往阿姆斯特丹和鹿特丹。' }
    },
    {
      id: 'belgium', from: '2026-03-16', to: '2026-03-18',
      title: { en: 'Belgium', zh: '比利时', ja: 'ベルギー', de: 'Belgien' },
      places: [['belgium', 'brussels'], ['belgium', 'antwerp']],
      note: { en: 'Travel to Brussels and Antwerp.', zh: '前往布鲁塞尔和安特卫普。' }
    },
    {
      id: 'germany1', from: '2026-06-27', to: '2026-06-28',
      title: { en: 'Germany: Rhine-Neckar & Stuttgart', zh: '德国:莱茵-内卡与斯图加特', ja: 'ドイツ:ライン＝ネッカーとシュトゥットガルト', de: 'Deutschland: Rhein-Neckar & Stuttgart' },
      places: [['germany', 'frankfurt'], ['germany', 'heidelberg'], ['germany', 'stuttgart']],
      note: {
        en: 'Travel to Frankfurt, Heidelberg, Mannheim and Stuttgart. It was around 40 degrees, really hot. I like ICE: free WiFi and air-conditioning.',
        zh: '前往法兰克福、海德堡、曼海姆和斯图加特。气温约 40 度,非常热。我喜欢 ICE:有免费 WiFi 和空调。'
      }
    },
    {
      id: 'germany2', from: '2026-07-04', to: '2026-07-06',
      title: { en: 'Germany: Düsseldorf & Cologne', zh: '德国:杜塞尔多夫与科隆', ja: 'ドイツ:デュッセルドルフとケルン', de: 'Deutschland: Düsseldorf & Köln' },
      places: [['germany', 'dusseldorf'], ['germany', 'koln']],
      note: {
        en: 'Travel to Düsseldorf and Cologne. I like ICE, but the way back was delayed by two hours.',
        zh: '前往杜塞尔多夫和科隆。我喜欢 ICE,但回程晚点了两个小时。'
      }
    },

    /* Baltic & Nordic trip, Oct 2026. Add  note: { en: '…', zh: '…' }  to any entry to show a story. */
    {
      id: 'slovakia', from: '2026-10-19', to: '2026-10-19',
      title: { en: 'Slovakia: Bratislava', zh: '斯洛伐克:布拉迪斯拉发', ja: 'スロバキア:ブラチスラバ', de: 'Slowakei: Bratislava' },
      places: [['slovakia', 'bratislava']]
    },
    {
      id: 'sweden', from: '2026-10-20', to: '2026-10-22',
      title: { en: 'Sweden: Stockholm', zh: '瑞典:斯德哥尔摩', ja: 'スウェーデン:ストックホルム', de: 'Schweden: Stockholm' },
      places: [['sweden', 'stockholm']]
    },
    {
      id: 'finland', from: '2026-10-22', to: '2026-10-24',
      title: { en: 'Finland & Estonia: Helsinki and Tallinn', zh: '芬兰与爱沙尼亚:赫尔辛基和塔林', ja: 'フィンランドとエストニア:ヘルシンキとタリン', de: 'Finnland & Estland: Helsinki und Tallinn' },
      places: [['finland', 'helsinki'], ['estonia', 'tallinn']]
    },
    /* Add  note: { en: '…', zh: '…' }  to any entry to show a story. */
    {
      id: 'baltics', from: '2026-10-25', to: '2026-10-26',
      title: { en: 'Latvia & Lithuania: Riga and Vilnius', zh: '拉脱维亚与立陶宛:里加和维尔纽斯', ja: 'ラトビアとリトアニア:リガとヴィリニュス', de: 'Lettland & Litauen: Riga und Vilnius' },
      places: [['latvia', 'riga'], ['lithuania', 'vilnius']]
    },
    {
      id: 'norway', from: '2026-10-27', to: '2026-10-27',
      title: { en: 'Norway: Oslo', zh: '挪威:奥斯陆', ja: 'ノルウェー:オスロ', de: 'Norwegen: Oslo' },
      places: [['norway', 'oslo']]
    },
    {
      id: 'denmark', from: '2026-10-28', to: '2026-10-28',
      title: { en: 'Denmark: Copenhagen', zh: '丹麦:哥本哈根', ja: 'デンマーク:コペンハーゲン', de: 'Dänemark: Kopenhagen' },
      places: [['denmark', 'copenhagen']]
    },
    {
      id: 'helsingborg', from: '2026-10-29', to: '2026-10-29',
      title: { en: 'Sweden: Helsingborg', zh: '瑞典:赫尔辛堡', ja: 'スウェーデン:ヘルシンボリ', de: 'Schweden: Helsingborg' },
      places: [['sweden', 'helsingborg']]
    },
    {
      id: 'gothenburg', from: '2026-10-30', to: '2026-10-31',
      title: { en: 'Sweden: Gothenburg', zh: '瑞典:哥德堡', ja: 'スウェーデン:ヨーテボリ', de: 'Schweden: Göteborg' },
      places: [['sweden', 'gothenburg']]
    }
  ]
};
