export interface StatementParagraph {
  number: number;
  label: string;
  role: string;
  description: string;
}

export const statementParagraphs: StatementParagraph[] = [
  {
    number: 1,
    label: "一段落目",
    role: "Hook & 活動アピール & SFCへの必然性",
    description: "読者を引き込むHookから始め、自分の最も特質すべき活動実績をアピールし、将来ビジョンのためにSFCが必要であることを宣言する。",
  },
  {
    number: 2,
    label: "二段落目",
    role: "問題意識の形成（活動の契機・過去の経験）",
    description: "なぜこのテーマに取り組むようになったのか。原体験・原風景・幼少期からの問い・出会いなど、問題意識が芽生えた瞬間を具体的に描く。",
  },
  {
    number: 3,
    label: "三段落目",
    role: "現場行動（フィールドワーク・文献調査・実践）",
    description: "問題意識を持ったあと、実際に何をしたか。インタビュー・調査・実験・起業・創作など、自分が動いた証拠を示す。",
  },
  {
    number: 4,
    label: "四段落目",
    role: "問題点・限界（研究分野の壁・既存策の限界）",
    description: "現場行動を通じて発見した「まだ解決されていない問題」「既存の解決策が機能しない理由」を明示する。ここが学問的必然性の根拠になる。",
  },
  {
    number: 5,
    label: "五段落目",
    role: "自分なりの解決策の提案と可能性",
    description: "四段落目の限界を踏まえ、自分が考える新しい解決策・アプローチを提示する。まだ未完成でよい。それに付随する経験・発見も書く。",
  },
  {
    number: 6,
    label: "六段落目",
    role: "学問的に取り組む必然性（なぜSFCで学ぶ必要があるか）",
    description: "自分の解決策の限界・課題を正直に認め、だからこそ学術的アプローチ・SFCのリソースが不可欠であることを論証する。",
  },
  {
    number: 7,
    label: "七段落目",
    role: "SFC資源の活用方法（具体的な学習計画）",
    description: "どの教授・研究会・授業・プロジェクトを活用するか。授業名・教授名を具体的に挙げ、1〜4年のロードマップを示す。",
  },
  {
    number: 8,
    label: "八段落目",
    role: "将来ビジョンと覚悟の宣言",
    description: "SFC卒業後、社会に対してどんな価値を生み出すか。大きなビジョンと、それに向けた覚悟・決意で締めくくる。",
  },
  {
    number: 9,
    label: "九段落目（任意）",
    role: "補足・追加論点",
    description: "必要に応じて追加する段落。字数が余る場合や、どうしても伝えたい論点がある場合に使用。",
  },
  {
    number: 10,
    label: "十段落目（任意）",
    role: "補足・追加論点",
    description: "必要に応じて追加する段落。",
  },
];

export interface ActivityEntry {
  year: string;
  month: string;
  content: string;
  docNumber: string;
  featured: boolean;
}

export interface OrganizationEntry {
  name: string;
  role: string;
  period: string;
}

export interface CompetitionEntry {
  year: string;
  name: string;
  organizer: string;
  result: string;
}

export const ACTIVITY_STORAGE_KEY = "shonan_juku_activity_worksheet";
export const STATEMENT_WORKSHEET_KEY = "shonan_juku_statement_worksheet";
