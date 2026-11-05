// 分类数据
export const categories = [
  { id: "all", name: "全部", description: "所有读过的书籍" },
  {
    id: "literature",
    name: "文学经典",
    description: "国内外经典名著、知名作家的代表作，兼具文学性与思想深度",
  },
  {
    id: "mystery",
    name: "悬疑推理",
    description:
      "以悬念、推理、案件侦破为核心，包含日系推理、社会派推理、犯罪纪实等",
  },
  {
    id: "scifi",
    name: "科幻奇幻",
    description:
      "涵盖硬核科幻、软科幻、奇幻故事、冒险题材，脑洞大开，兼具想象力与思想性",
  },
  {
    id: "romance",
    name: "言情古风",
    description:
      "包含现代言情、古风言情、古言权谋、仙侠言情等，侧重情感描写，情节细腻",
  },
  {
    id: "social",
    name: "社会纪实",
    description: "聚焦社会现象、人性本质、现实问题，兼具纪实性与思辨性",
  },
  {
    id: "psychology",
    name: "心理成长",
    description:
      "围绕心理疗愈、自我成长、情绪调节、亲密关系展开，兼具实用性与可读性",
  },
  {
    id: "history",
    name: "历史文化",
    description:
      "聚焦中国历史、传统文化、文人故事、艺术史等，通俗易读，兼具知识性与趣味性",
  },
  {
    id: "light",
    name: "轻治愈",
    description: "包含暖心绘本、生活随笔、治愈短文，文字/画面温暖，节奏舒缓",
  },
  {
    id: "philosophy",
    name: "哲学思辨",
    description:
      "聚焦中外哲学经典、国学典籍、人生智慧与思想探讨，兼具思辨性与启发性",
  },
];

// 排序选项
export const sortOptions = [
  { label: "默认排序", value: "default" },
  { label: "豆瓣评分从高到低", value: "doubanRating" },
  { label: "豆瓣评分从低到高", value: "doubanRatingDesc" },
  { label: "读完时间从新到旧", value: "finishDateNew" },
  { label: "读完时间从旧到新", value: "finishDateOld" },
];

// 书籍数据
export const books = [
  // 文学经典 / 名家作品
  {
    title: "百年孤独",
    author: "加西亚・马尔克斯",
    category: "literature",
    image: "s33759686",
    finishDate: "2022-07-03",

    doubanRating: 9.7,
    myRating: 4,
  },
  {
    title: "霍乱时期的爱情",
    author: "加西亚・马尔克斯",
    category: "literature",
    image: "s34217613",
    finishDate: "2023-02-08",

    doubanRating: 9.1,
    myRating: 4,
  },
  {
    title: "活着",
    author: "余华",
    category: "literature",
    image: "s29869926",
    finishDate: "2022-04-29",

    doubanRating: 9.4,
    myRating: 4,
  },
  {
    title: "第七天",
    author: "余华",
    category: "literature",
    image: "s33747401",
    finishDate: "2023-04-04",

    doubanRating: 8.2,
    myRating: 5,
  },
  {
    title: "许三观卖血记",
    author: "余华",
    category: "literature",
    image: "s24575140",
    finishDate: "2023-03-22",

    doubanRating: 9.2,
    myRating: 5,
  },
  {
    title: "生死疲劳",
    author: "莫言",
    category: "literature",
    image: "s35289336",
    finishDate: "2022-04-14",

    doubanRating: 8.9,
    myRating: 5,
  },
  {
    title: "檀香刑",
    author: "莫言",
    category: "literature",
    image: "s33562530",
    finishDate: "2024-02-22",

    doubanRating: 9.3,
    myRating: 3,
  },
  {
    title: "晚熟的人",
    author: "莫言",
    category: "literature",
    image: "s33696230",
    finishDate: "2023-05-29",

    doubanRating: 8.0,
    myRating: 4,
  },
  {
    title: "一句顶一万句",
    author: "刘震云",
    category: "literature",
    image: "s34289066",
    finishDate: "2026-01-19",

    doubanRating: 9.0,
    myRating: 3,
  },
  {
    title: "平凡的世界",
    author: "路遥",
    category: "literature",
    image: "s29980023",
    finishDate: "2025-12-29",
    wordCount: "79.8万字",
    doubanRating: 9.0,
    myRating: 4,
  },
  {
    title: "布鲁克林有棵树",
    author: "贝蒂·史密斯",
    category: "literature",
    image: "s34458843",
    finishDate: "2025-10-15",

    doubanRating: 8.7,
    myRating: 5,
  },
  {
    title: "杀死一只知更鸟",
    author: "哈珀·李",
    category: "literature",
    image: "s29214279",
    finishDate: "2022-05-08",

    doubanRating: 9.3,
    myRating: 5,
  },
  {
    title: "基督山伯爵",
    author: "大仲马",
    category: "literature",
    image: "s29863798",
    finishDate: "2025-12-12",
    wordCount: "90.9万字",
    doubanRating: 9.2,
    myRating: 4,
  },
  {
    title: "西线无战事",
    author: "埃里希·玛丽亚·雷马克",
    category: "literature",
    image: "s33779178",
    finishDate: "2023-07-10",

    doubanRating: 9.4,
    myRating: 4,
  },
  {
    title: "失明症漫记",
    author: "若泽·萨拉马戈",
    category: "literature",
    image: "s34269503",
    finishDate: "2023-07-11",

    doubanRating: 9.0,
    myRating: 5,
  },
  {
    title: "悉达多",
    author: "赫尔曼·黑塞",
    category: "philosophy",
    image: "s29396368",
    finishDate: "2022-06-13",

    doubanRating: 9.1,
    myRating: 4,
  },
  {
    title: "窄门",
    author: "安德烈·纪德",
    category: "literature",
    image: "s29915013",
    finishDate: "2026-02-05",
    wordCount: "6.7万字",
    doubanRating: 7.5,
    myRating: 3,
  },
  {
    title: "动物农场",
    author: "乔治·奥威尔",
    category: "literature",
    image: "s3921115",
    finishDate: "2023-05-16",

    doubanRating: 9.3,
    myRating: 5,
  },
  {
    title: "一九八四",
    author: "乔治·奥威尔",
    category: "literature",
    image: "s3864641",
    finishDate: "2023-06-15",

    doubanRating: 9.5,
    myRating: 4,
  },
  {
    title: "我与地坛",
    author: "史铁生",
    category: "literature",
    image: "s29778139",
    finishDate: "2026-02-03",

    doubanRating: 9.1,
    myRating: 5,
    aginRead: true,
    readDates: ["2023-08-15", "2026-02-03"],
  },
  {
    title: "我的阿勒泰",
    author: "李娟",
    category: "literature",
    image: "s34877932",
    finishDate: "2025-11-17",

    doubanRating: 8.5,
    myRating: 3,
  },
  {
    title: "阿勒泰的角落",
    author: "李娟",
    category: "literature",
    image: "s26935643",
    finishDate: "2026-02-15",

    doubanRating: 8.9,
    myRating: 5,
  },
  {
    title: "三国演义",
    author: "罗贯中",
    category: "literature",
    image: "s33736802",
    finishDate: "2022-03-21",

    doubanRating: 9.5,
    myRating: 4,
  },
  {
    title: "西游记",
    author: "吴承恩",
    category: "literature",
    image: "s33814385",
    finishDate: "2023-07-04",

    doubanRating: 9.4,
    myRating: 5,
  },
  {
    title: "追风筝的人",
    author: "卡勒德·胡赛尼",
    category: "literature",
    image: "s1727290",
    finishDate: "2025-12-31",
    wordCount: "20.3万字",
    doubanRating: 8.9,
    myRating: 5,
  },
  {
    title: "灿烂千阳",
    author: "卡勒德·胡赛尼",
    category: "literature",
    image: "s2651394",
    finishDate: "2026-01-29",
    wordCount: "21.3万字",
    doubanRating: 8.9,
    myRating: 5,
  },
  {
    title: "人生海海",
    author: "麦家",
    category: "literature",
    image: "s32266692",
    finishDate: "2026-02-21",
    wordCount: "18.9万字",
    doubanRating: 7.9,
    myRating: 4,
  },
  {
    title: "病隙碎笔",
    author: "史铁生",
    category: "literature",
    image: "s29778146",
    finishDate: "2026-06-11",
    doubanRating: 8.4,
    myRating: 4,
  },

  // 悬疑推理 / 犯罪小说
  {
    title: "白鸟与蝙蝠",
    author: "东野圭吾",
    category: "mystery",
    image: "s34400654",
    finishDate: "2024-01-13",

    doubanRating: 7.0,
    myRating: 3,
  },
  {
    title: "白夜行",
    author: "东野圭吾",
    category: "mystery",
    image: "s24514468",
    finishDate: "2022-05-27",

    doubanRating: 9.2,
    myRating: 5,
  },
  {
    title: "恶意",
    author: "东野圭吾",
    category: "mystery",
    image: "s29827014",
    finishDate: "2022-06-08",

    doubanRating: 8.7,
    myRating: 5,
  },
  {
    title: "解忧杂货店",
    author: "东野圭吾",
    category: "psychology",
    image: "s33715672",
    finishDate: "2022-04-25",

    doubanRating: 8.6,
    myRating: 4,
  },
  {
    title: "嫌疑人X的献身",
    author: "东野圭吾",
    category: "mystery",
    image: "s34202514",
    finishDate: "2023-03-24",

    doubanRating: 9.1,
    myRating: 5,
  },
  {
    title: "不可以",
    author: "道尾秀介",
    category: "mystery",
    image: "s33921264",
    finishDate: "2022-04-22",

    doubanRating: 7.1,
    myRating: 1,
  },
  {
    title: "告白",
    author: "凑佳苗",
    category: "mystery",
    image: "s29912411",
    finishDate: "2022-07-14",

    doubanRating: 8.8,
    myRating: 4,
  },
  {
    title: "绝叫",
    author: "叶真中显",
    category: "mystery",
    image: "s33685372",
    finishDate: "2023-01-11",

    doubanRating: 8.9,
    myRating: 3,
  },
  {
    title: "金色梦乡",
    author: "伊坂幸太郎",
    category: "mystery",
    image: "s29397725",
    finishDate: "2023-04-21",

    doubanRating: 8.8,
    myRating: 5,
  },
  {
    title: "克莱因壶",
    author: "冈岛二人",
    category: "scifi",
    image: "s33317677",
    finishDate: "2022-07-11",

    doubanRating: 8.8,
    myRating: 4,
  },
  {
    title: "同名同姓受害者协会",
    author: "下村敦史",
    category: "mystery",
    image: "s34183576",
    finishDate: "2022-06-21",

    doubanRating: 7.2,
    myRating: 3,
  },
  {
    title: "消失的13级台阶",
    author: "高野和明",
    category: "mystery",
    image: "s34070178",
    finishDate: "2022-05-07",

    doubanRating: 8.5,
    myRating: 5,
  },
  {
    title: "桶川跟踪狂杀人事件",
    author: "清水洁",
    category: "mystery",
    image: "s34072986",
    finishDate: "2023-06-05",

    doubanRating: 9.0,
    myRating: 3,
  },
  {
    title: "足利女童连续失踪事件",
    author: "清水洁",
    category: "mystery",
    image: "s34249411",
    finishDate: "2023-04-17",

    doubanRating: 9.0,
    myRating: 4,
  },
  {
    title: "动物园",
    author: "乙一",
    category: "mystery",
    image: "s33666435",
    finishDate: "2023-04-05",

    doubanRating: 8.1,
    myRating: 4,
  },
  {
    title: "古董局中局",
    author: "马伯庸",
    category: "mystery",
    image: "s31460171",
    finishDate: "2025-11-27",

    doubanRating: 7.3,
    myRating: 4,
  },
  {
    title: "相声神探1-3",
    author: "王晓磊",
    category: "mystery",
    image: "s34194300",
    finishDate: "2026-02-14",
    wordCount: "58.6万字",
    doubanRating: 7.0,
    myRating: 3,
  },

  // 科幻 / 奇幻 / 冒险
  {
    title: "三体",
    author: "刘慈欣",
    category: "scifi",
    image: "s29791128",
    finishDate: "2026-04-08",
    aginRead: true,
    readDates: ["2022-04-06", "2026-04-08"],
    doubanRating: 9.4,
    myRating: 5,
  },
  {
    title: "流浪地球",
    author: "刘慈欣",
    category: "scifi",
    image: "s30000637",
    finishDate: "2024-05-20",

    doubanRating: 7.8,
    myRating: 5,
  },
  {
    title: "朝闻道",
    author: "刘慈欣",
    category: "scifi",
    image: "s34656250",
    finishDate: "2024-05-20",

    doubanRating: 8.8,
    myRating: 4,
  },
  {
    title: "银河帝国：基地七部曲",
    author: "艾萨克・阿西莫夫",
    category: "scifi",
    image: "s28284246",
    finishDate: "2026-07-22",

    doubanRating: 9.5,
    myRating: 3,
  },
  {
    title: "星之继承者Ⅰ",
    author: "詹姆斯·P.霍根",
    category: "scifi",
    image: "s33771274",
    finishDate: "2022-07-18",

    doubanRating: 8.8,
    myRating: 5,
  },
  {
    title: "海奥华预言",
    author: "米歇·戴斯玛克特",
    category: "scifi",
    image: "s29850727",
    finishDate: "2022-07-06",

    doubanRating: 7.1,
    myRating: 3,
  },
  {
    title: "盗墓笔记",
    author: "南派三叔",
    category: "scifi",
    image: "s10412319",
    finishDate: "2025-11-01",

    doubanRating: 8.5,
    myRating: 5,
    aginRead: true,
    readDates: ["2016-09-01", "2025-11-01"],
  },
  {
    title: "沙海",
    author: "南派三叔",
    category: "scifi",
    image: "s29082473",
    finishDate: "2025-11-06",

    doubanRating: 7.1,
    myRating: 2,
  },
  {
    title: "吴邪的私家笔记",
    author: "南派三叔",
    category: "scifi",
    image: "s34816006",
    finishDate: "2025-10-18",

    doubanRating: 6.6,
    myRating: 3,
  },
  {
    title: "龙与地下铁",
    author: "马伯庸",
    category: "scifi",
    image: "s34720704",
    finishDate: "2024-04-07",

    doubanRating: 7.2,
    myRating: 4,
  },
  {
    title: "哈利·波特",
    author: "J.K·罗琳",
    category: "scifi",
    image: "s29101586",
    finishDate: "2025-10-24",

    doubanRating: 9.7,
    myRating: 5,
  },

  // 言情 / 古风小说
  {
    title: "长月无烬",
    author: "藤萝为枝",
    category: "romance",
    image: "s34541070",
    finishDate: "2023-05-06",

    doubanRating: 6.2,
    myRating: 2,
  },
  {
    title: "错撩",
    author: "翘摇",
    category: "romance",
    image: "s33900377",
    finishDate: "2022-08-07",

    doubanRating: 6.2,
    myRating: 2,
  },
  {
    title: "浮图塔",
    author: "尤四姐",
    category: "romance",
    image: "s33696269",
    finishDate: "2023-01-04",

    doubanRating: 6.8,
    myRating: 3,
  },
  {
    title: "吉祥纹莲花楼",
    author: "藤萍",
    category: "mystery",
    image: "s27238030",
    finishDate: "2023-08-28",

    doubanRating: 8.5,
    myRating: 4,
  },
  {
    title: "坤宁",
    author: "时镜",
    category: "romance",
    image: "s33846733",
    finishDate: "2023-11-19",

    doubanRating: 6.8,
    myRating: 3,
  },
  {
    title: "首辅养成手册",
    author: "闻檀",
    category: "romance",
    image: "s29585276",
    finishDate: "2024-10-25",

    doubanRating: 5.9,
    myRating: 3,
  },
  {
    title: "偷偷藏不住",
    author: "竹已",
    category: "romance",
    image: "s33600111",
    finishDate: "2023-06-26",

    doubanRating: 6.4,
    myRating: 4,
  },
  {
    title: "星汉灿烂，幸甚至哉",
    author: "关心则乱",
    category: "romance",
    image: "s34256602",
    finishDate: "2022-07-25",

    doubanRating: 6.9,
    myRating: 3,
  },
  {
    title: "与凤行",
    author: "九鹭非香",
    category: "romance",
    image: "s28059114",
    finishDate: "2024-03-28",

    doubanRating: 7.0,
    myRating: 5,
  },
  {
    title: "朱颜",
    author: "沧月",
    category: "romance",
    image: "s34669407",
    finishDate: "2022-06-24",

    doubanRating: 5.8,
    myRating: 4,
  },
  {
    title: "长命百岁",
    author: "怡然",
    category: "romance",
    image: "s35286589",
    finishDate: "2025-03-27",

    doubanRating: 8.1,
    myRating: 4,
  },

  // 社会纪实 / 人性探讨
  {
    title: "不要挑战人性",
    author: "潘楷文",
    category: "social",
    image: "s34026317",
    finishDate: "2022-10-25",

    doubanRating: 7.4,
    myRating: 4,
  },
  {
    title: "狂飙",
    author: "徐纪周",
    category: "social",
    image: "s34413297",
    finishDate: "2023-02-05",

    doubanRating: 6.2,
    myRating: 3,
  },
  {
    title: "天才在左，疯子在右",
    author: "高铭",
    category: "psychology",
    image: "s29965405",
    finishDate: "2022-06-10",

    doubanRating: 6.9,
    myRating: 3,
  },
  {
    title: "献给阿尔吉侬的花束",
    author: "丹尼尔·凯斯",
    category: "social",
    image: "s34280647",
    finishDate: "2023-06-28",

    doubanRating: 9.1,
    myRating: 5,
  },
  {
    title: "她来劈开这座山",
    author: "病鹤斋",
    category: "social",
    image: "s35061118",
    finishDate: "2025-11-10",

    doubanRating: 8.2,
    myRating: 2,
  },
  {
    title: "鹿川有许多粪",
    author: "李沧东",
    category: "social",
    image: "s33968312",
    finishDate: "2022-06-13",

    doubanRating: 8.9,
    myRating: 3,
  },

  // 心理成长 / 治愈疗愈
  {
    title: "被讨厌的勇气",
    author: "岸见一郎",
    category: "psychology",
    image: "s34348664",
    finishDate: "2025-12-03",

    doubanRating: 8.6,
    myRating: 5,
    aginRead: true,
    readDates: ["2022-09-01", "2025-12-03"],
  },
  {
    title: "蛤蟆先生去看心理医生",
    author: "罗伯特・戴博德",
    category: "psychology",
    image: "s33941998",
    finishDate: "2026-03-05",

    doubanRating: 8.3,
    myRating: 4,
    aginRead: true,
    readDates: ["2022-02-11", "2026-03-05"],
  },
  {
    title: "你当像鸟飞往你的山",
    author: "塔拉・韦斯特弗",
    category: "social",
    image: "s33492346",
    finishDate: "2022-09-25",

    doubanRating: 8.7,
    myRating: 3,
  },
  {
    title: "如何拥抱一只刺猬",
    author: "段鑫星",
    category: "psychology",
    image: "s34116570",
    finishDate: "2023-06-13",

    doubanRating: 6.7,
    myRating: 3,
  },
  {
    title: "养育你内心的小孩",
    author: "丛非从",
    category: "psychology",
    image: "s34097474",
    finishDate: "2022-06-06",

    doubanRating: 8.3,
    myRating: 5,
  },
  {
    title: "世界尽头的咖啡馆",
    author: "约翰·史崔勒基",
    category: "psychology",
    image: "s32300809",
    finishDate: "2022-05-11",

    doubanRating: 7.3,
    myRating: 2,
  },
  {
    title: "也许你该找个人聊聊",
    author: "洛莉·戈特利布",
    category: "psychology",
    image: "s33944153",
    finishDate: "2022-08-22",

    doubanRating: 9.0,
    myRating: 5,
  },
  {
    title: "始于极限",
    author: "上野千鹤子",
    category: "social",
    image: "s34300626",
    finishDate: "2023-03-22",

    doubanRating: 9.0,
    myRating: 1,
  },
  {
    title: "一个叫欧维的男人决定去死",
    author: "弗雷德里克·巴克曼",
    category: "psychology",
    image: "s29475416",
    finishDate: "2023-02-12",

    doubanRating: 9.2,
    myRating: 5,
  },
  {
    title: "谁动了我的奶酪？",
    author: "斯宾塞·约翰逊",
    category: "psychology",
    image: "s1035374",
    finishDate: "2011-07-20",

    doubanRating: 7.1,
    myRating: 5,
  },
  {
    title: "谁动了我的奶酪2",
    author: "斯宾塞·约翰逊",
    category: "psychology",
    image: "s33692980",
    finishDate: "2022-08-23",

    doubanRating: 7.8,
    myRating: 3,
  },
  {
    title: "请这样对待孩子的大脑",
    author: "阿尔瓦罗·毕尔巴鄂",
    category: "psychology",
    image: "s35202777",
    finishDate: "2026-03-05",
    doubanRating: 7.8,
    myRating: 4,
  },
  {
    title: "安定此心：我当精神科医生的12000天",
    author: "姜涛",
    category: "psychology",
    image: "s35355919",
    finishDate: "2026-03-17",
    doubanRating: 8.7,
    myRating: 4,
  },

  // 历史文化 / 人文科普
  {
    title: "长安的荔枝",
    author: "马伯庸",
    category: "history",
    image: "s34327482",
    finishDate: "2022-12-27",

    doubanRating: 8.5,
    myRating: 4,
  },
  {
    title: "两京十五日",
    author: "马伯庸",
    category: "history",
    image: "s33682883",
    finishDate: "2025-11-12",

    doubanRating: 8.1,
    myRating: 5,
  },
  {
    title: "食南之徒",
    author: "马伯庸",
    category: "history",
    image: "s34823157",
    finishDate: "2025-11-07",

    doubanRating: 8.2,
    myRating: 5,
  },
  {
    title: "桃花源没事儿",
    author: "马伯庸",
    category: "history",
    image: "s35162221",
    finishDate: "2026-01-08",

    doubanRating: 7.6,
    myRating: 3,
  },
  {
    title: "太白金星有点烦",
    author: "马伯庸",
    category: "history",
    image: "s34544956",
    finishDate: "2023-06-13",

    doubanRating: 9.0,
    myRating: 5,
  },
  {
    title: "显微镜下的大明",
    author: "马伯庸",
    category: "history",
    image: "s29960161",
    finishDate: "2025-11-29",

    doubanRating: 8.7,
    myRating: 4,
  },
  {
    title: "大话中国艺术史",
    author: "意公子",
    category: "history",
    image: "s34103893",
    finishDate: "2022-08-06",

    doubanRating: 8.0,
    myRating: 5,
  },
  {
    title: "大唐群星闪耀时",
    author: "周公子",
    category: "history",
    image: "s34159984",
    finishDate: "2022-05-13",

    doubanRating: 6.5,
    myRating: 2,
  },
  {
    title: "苏东坡传",
    author: "林语堂",
    category: "history",
    image: "s29715694",
    finishDate: "2024-03-29",

    doubanRating: 8.2,
    myRating: 5,
  },
  {
    title: "时间之书",
    author: "余世存",
    category: "history",
    image: "s35045605",
    finishDate: "2025-03-28",

    doubanRating: 7.7,
    myRating: 4,
  },
  {
    title: "你当像李白长风破浪",
    author: "湘人彭二",
    category: "history",
    image: "s34410357",
    finishDate: "2023-05-11",

    doubanRating: 7.2,
    myRating: 2,
  },
  {
    title: "人生如逆旅，幸好还有苏轼",
    author: "湘人彭二",
    category: "history",
    image: "s34291751",
    finishDate: "2022-07-22",

    doubanRating: 7.1,
    myRating: 4,
  },
  {
    title: "鲜衣怒马少年时",
    author: "少年怒马",
    category: "history",
    image: "s33575900",
    finishDate: "2024-05-10",

    doubanRating: 6.9,
    myRating: 3,
  },
  {
    title: "人间惊鸿客",
    author: "王磊",
    category: "history",
    image: "s34284760",
    finishDate: "2023-08-31",

    doubanRating: 7.8,
    myRating: 4,
  },
  {
    title: "他们有才亦有爱：宋词里的缱绻爱情",
    author: "蓝风",
    category: "history",
    image: "s34244167",
    finishDate: "2022-02-23",

    doubanRating: 5.0,
    myRating: 2,
  },
  {
    title: "枕上诗书：遇见最美的宋词",
    author: "赵小峦，方慧颖",
    category: "history",
    image: "s33525929",
    finishDate: "2022-07-12",

    doubanRating: 6.9,
    myRating: 4,
  },
  {
    title: "枕上诗书：遇见最美唐诗",
    author: "方慧颖",
    category: "history",
    image: "s33525791",
    finishDate: "2022-05-01",

    doubanRating: 5.6,
    myRating: 2,
  },
  {
    title: "枕上诗书：一本书读懂最美古诗词",
    author: "徐若央",
    category: "history",
    image: "s33304371",
    finishDate: "2021-11-10",

    doubanRating: 6.6,
    myRating: 2,
  },
  {
    title: "达·芬奇手稿",
    author: "列奥纳多·达·芬奇",
    category: "history",
    image: "s30711169",
    finishDate: "2022-06-04",

    doubanRating: 7.5,
    myRating: 5,
  },
  {
    title: "了凡四训",
    author: "袁了凡",
    category: "philosophy",
    image: "s29539556",
    finishDate: "2026-07-28",

    doubanRating: 8.0,
    myRating: 4,
  },

  // 轻治愈 / 暖心绘本 / 随笔
  {
    title: "啊呜一口，吃掉烦恼",
    author: "Yolk",
    category: "light",
    image: "s34646178",
    finishDate: "2024-02-19",

    doubanRating: 7.6,
    myRating: 2,
  },
  {
    title: "怦然心动",
    author: "文德琳·范·德拉安南",
    category: "light",
    image: "s33620119",
    finishDate: "2026-02-08",
    wordCount: "11.8万字",
    doubanRating: 9.1,
    myRating: 5,
  },
  {
    title: "等一朵花开",
    author: "林帝浣",
    category: "light",
    image: "s33662932",
    finishDate: "2022-11-16",

    doubanRating: 7.3,
    myRating: 4,
  },
  {
    title: "带壳的牡蛎是大人的心脏",
    author: "拟泥 nini",
    category: "light",
    image: "s34319046",
    finishDate: "2023-07-17",

    doubanRating: 8.2,
    myRating: 3,
  },
  {
    title: "今天我也喜欢你",
    author: "邱汉林",
    category: "light",
    image: "s34214564",
    finishDate: "2023-03-27",

    doubanRating: 8.4,
    myRating: 4,
  },
  {
    title: "看你一眼就会笑",
    author: "邱汉林",
    category: "light",
    image: "s34274923",
    finishDate: "2022-05-05",

    doubanRating: 8.2,
    myRating: 3,
  },
  {
    title: "可是你真的真的很可爱",
    author: "相生栗子",
    category: "light",
    image: "s33880229",
    finishDate: "2023-02-04",

    doubanRating: 7.5,
    myRating: 5,
  },
  {
    title: "男孩、鼹鼠、狐狸和马",
    author: "查理·麦克西",
    category: "light",
    image: "s33814814",
    finishDate: "2022-09-29",

    doubanRating: 8.7,
    myRating: 3,
  },
  {
    title: "你也走了很远的路吧",
    author: "卢思浩",
    category: "light",
    image: "s34306505",
    finishDate: "2023-08-12",

    doubanRating: 6.0,
    myRating: 3,
  },
  {
    title: "请画一下爱",
    author: "ShurAn 舒然",
    category: "light",
    image: "s34149256",
    finishDate: "2022-08-01",

    doubanRating: 8.4,
    myRating: 4,
  },
  {
    title: "忍不住想打扰你",
    author: "bibi 园长",
    category: "light",
    image: "s33979742",
    finishDate: "2023-04-04",

    doubanRating: 8.4,
    myRating: 5,
  },
  {
    title: "活着本来单纯",
    author: "丰子恺",
    category: "light",
    image: "s29041051",
    finishDate: "2022-05-18",

    doubanRating: 8.8,
    myRating: 3,
  },
  {
    title: "少年与爱永不老去",
    author: "夏葳",
    category: "light",
    image: "s34124878",
    finishDate: "2022-05-27",

    doubanRating: 6.9,
    myRating: 4,
  },
  {
    title: "我是你的小狗",
    author: "大绵羊 BoBo",
    category: "light",
    image: "s34384339",
    finishDate: "2024-04-08",

    doubanRating: 8.0,
    myRating: 1,
  },
  {
    title: "生活即禅，笑看平凡",
    author: "林帝浣",
    category: "light",
    image: "s33939423",
    finishDate: "2023-04-18",

    doubanRating: 7.4,
    myRating: 4,
  },
  {
    title: "无需抱怨，可以抱我",
    author: "林帝浣",
    category: "light",
    image: "s33939424",
    finishDate: "2023-06-06",

    doubanRating: 7.6,
    myRating: 3,
  },
  {
    title: "100天后会死的鳄鱼君",
    author: "菊池祐纪",
    category: "light",
    image: "s33762397",
    finishDate: "2023-01-04",
    doubanRating: 8.0,
    myRating: 1,
  },
  {
    title: "星期四，喝可可",
    author: "青山美智子",
    category: "light",
    image: "s34103680",
    finishDate: "2022-11-27",

    doubanRating: 7.2,
    myRating: 4,
  },
  {
    title: "小王子",
    author: "圣埃克・苏佩里",
    category: "light",
    image: "s28317563",
    finishDate: "2024-01-07",
    doubanRating: 8.1,
    myRating: 5,
    aginRead: true,
    readDates: ["2019-01-07", "2024-01-07"],
  },
  {
    title: "小王子2",
    author: "陋室五月",
    category: "light",
    image: "s34653521",
    finishDate: "2024-01-07",

    doubanRating: 4.9,
    myRating: 2,
  },
  {
    title: "世界是你的猫窝",
    author: "Daisy",
    category: "light",
    image: "s34874535",
    finishDate: "2026-02-08",

    doubanRating: 8.1,
    myRating: 3,
  },
  {
    title: "我会一次次接住自己",
    author: "云云狗",
    category: "light",
    image: "s35284173",
    finishDate: "2026-07-28",
    doubanRating: 7.6,
    myRating: 5,
  },
  {
    title: "春山",
    author: "何大草",
    category: "history",
    image: "s33602848",
    finishDate: "2026-08-09",
    doubanRating: 7.4,
    myRating: 4,
  },
  {
    title: "弃长安",
    author: "张明扬",
    category: "history",
    image: "s34080320",
    finishDate: "2026-08-13",
    doubanRating: 8.4,
    myRating: 5,
  },
  {
    title: "道德经：帛书版",
    author: "[春秋]老子",
    category: "philosophy",
    image: "s34885473",
    finishDate: "2026-10-12",
    doubanRating: 9.4,
    myRating: 4,
  },
  {
    title: "明朝那些事儿",
    author: "当年明月",
    category: "history",
    image: "s29531871",
    doubanRating: 9.3,
    myRating: 0,
    paused: true,
    totalPages: 10123,
    currentPage: 1247,
  },
  {
    title: "万历十五年",
    author: "黄仁宇",
    category: "history",
    image: "s28332809",
    doubanRating: 9.1,
    myRating: 0,
    paused: true,
    totalPages: 972,
    currentPage: 436,
  },
  {
    title: "张居正",
    author: "熊召政",
    category: "history",
    image: "s33298645",
    doubanRating: 7.9,
    myRating: 0,
    paused: false,
    totalPages: 5584,
    currentPage: 1178,
  },
  {
    title: "不要担心2小时和8公里以外的事情",
    author: "李松涛",
    category: "psychology",
    image: "s35294947",
    doubanRating: 5.8,
    myRating: 0,
    paused: true,
    totalPages: 445,
    currentPage: 150,
  },
  {
    title: "海昏",
    author: "雷克斯",
    category: "history",
    image: "s35079540",
    doubanRating: 7.6,
    myRating: 0,
    paused: true,
    totalPages: 180,
    currentPage: 0,
  },
  {
    title: "人呐",
    author: "莫言",
    category: "literature",
    image: "s35467939",
    doubanRating: 6.3,
    myRating: 0,
    paused: true,
    totalPages: 617,
    currentPage: 65,
  },
  {
    title: "红楼梦",
    author: "[清]曹雪芹",
    category: "literature",
    image: "s33701320",
    doubanRating: 9.8,
    myRating: 0,
    paused: true,
    totalPages: 4958,
    currentPage: 879,
  },
  {
    title: "道德经：通行本",
    author: "[春秋]老子",
    category: "philosophy",
    image: "s33910769",
    finishDate: "2026-10-13",
    doubanRating: 9.5,
    myRating: 5,
  },
  {
    title: "秦二世必须死",
    author: "马伯庸",
    category: "history",
    image: "s35466757",
    doubanRating: 6.9,
    myRating: 0,
    paused: true,
    totalPages: 2211,
    currentPage: 62,
  },
  {
    title: "王维十五日谈",
    author: "李让眉",
    category: "history",
    image: "s35242948",
    finishDate: "2026-09-01",
    doubanRating: 8.5,
    myRating: 4,
  },
  {
    title: "降落我心上",
    author: "翘摇",
    category: "romance",
    image: "s33968548",
    finishDate: "2026-09-09",
    doubanRating: 7.1,
    myRating: 3,
  },
  {
    title: "道德经说什么1-4",
    author: "罗大伦",
    category: "philosophy",
    image: "s32327808",
    finishDate: "2026-10-15",
    doubanRating: 7.7,
    myRating: 4,
  },
  {
    title: "认知觉醒",
    author: "周岭",
    category: "psychology",
    image: "s34871792",
    doubanRating: 8.0,
    myRating: 0,
    totalPages: 618,
    currentPage: 445,
  },
  {
    title: "人生得遇苏东坡",
    author: "意公子",
    category: "history",
    image: "s35057270",
    doubanRating: 7.7,
    myRating: 0,
    totalPages: 405,
    currentPage: 354,
  },
  {
    title: "飞刀",
    author: "刘三叔",
    category: "literature",
    image: "s34771271",
    doubanRating: 8.7,
    myRating: 0,
    totalPages: 272,
    currentPage: 10,
  },
];

/* ============================================
   阅读状态（由字段推导，与原始数据保持一致）
   搁置：paused
   在读：无 finishDate
   重读：aginRead
   已读：其余有 finishDate 的
   ============================================ */
export const statusOptions = [
  { id: "all", name: "全部" },
  { id: "reading", name: "在读" },
  { id: "finished", name: "已读" },
  { id: "reread", name: "重读" },
  { id: "paused", name: "搁置" },
];

export function getBookStatus(book) {
  if (book.paused) return "paused";
  if (!book.finishDate) return "reading";
  if (book.aginRead) return "reread";
  return "finished";
}

/** 状态筛选：已读包含重读（都读完了） */
export function matchStatus(book, status) {
  if (status === "all") return true;
  const s = getBookStatus(book);
  if (status === "finished") return s === "finished" || s === "reread";
  return s === status;
}
