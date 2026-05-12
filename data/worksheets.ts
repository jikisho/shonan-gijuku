// ── 志望理由書 ──────────────────────────────────────────────────────

export interface StatementParagraph {
  number: number;
  label: string;
  role: string;
  description: string;
}

export const statementParagraphs: StatementParagraph[] = [
  { number: 1, label: "一段落目", role: "Hook & 活動アピール & SFCへの必然性", description: "読者を引き込むHookから始め、自分の最も特質すべき活動実績をアピールし、将来ビジョンのためにSFCが必要であることを宣言する。" },
  { number: 2, label: "二段落目", role: "問題意識の形成（活動の契機・過去の経験）", description: "なぜこのテーマに取り組むようになったのか。原体験・原風景・幼少期からの問い・出会いなど、問題意識が芽生えた瞬間を具体的に描く。" },
  { number: 3, label: "三段落目", role: "現場行動（フィールドワーク・文献調査・実践）", description: "問題意識を持ったあと、実際に何をしたか。インタビュー・調査・実験・起業・創作など、自分が動いた証拠を示す。" },
  { number: 4, label: "四段落目", role: "問題点・限界（研究分野の壁・既存策の限界）", description: "現場行動を通じて発見した「まだ解決されていない問題」「既存の解決策が機能しない理由」を明示する。ここが学問的必然性の根拠になる。" },
  { number: 5, label: "五段落目", role: "自分なりの解決策の提案と可能性", description: "四段落目の限界を踏まえ、自分が考える新しい解決策・アプローチを提示する。まだ未完成でよい。それに付随する経験・発見も書く。" },
  { number: 6, label: "六段落目", role: "学問的に取り組む必然性（なぜSFCで学ぶ必要があるか）", description: "自分の解決策の限界・課題を正直に認め、だからこそ学術的アプローチ・SFCのリソースが不可欠であることを論証する。" },
  { number: 7, label: "七段落目", role: "SFC資源の活用方法（具体的な学習計画）", description: "どの教授・研究会・授業・プロジェクトを活用するか。授業名・教授名を具体的に挙げ、1〜4年のロードマップを示す。" },
  { number: 8, label: "八段落目", role: "将来ビジョンと覚悟の宣言", description: "SFC卒業後、社会に対してどんな価値を生み出すか。大きなビジョンと、それに向けた覚悟・決意で締めくくる。" },
  { number: 9, label: "九段落目（任意）", role: "補足・追加論点", description: "必要に応じて追加する段落。字数が余る場合や、どうしても伝えたい論点がある場合に使用。" },
  { number: 10, label: "十段落目（任意）", role: "補足・追加論点", description: "必要に応じて追加する段落。" },
];

// ── 活動報告書 ──────────────────────────────────────────────────────

export interface AcademicEntry {
  name: string;       // 学校名 20字
  location: string;   // 所在地（国内：都道府県、海外：国・州）
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  duration: string;   // 在学年月（○年/○ヵ月）
}

export interface OverseasEntry {
  country: string;    // 滞在・居住先国名 20字
  companion: string;  // 帯同者
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  purpose: string;    // 目的（留学の場合は派遣団体等）
}

export interface ActivityEntry {
  year: string;
  month: string;
  grade: string;      // 学年
  age: string;        // 年齢
  content: string;    // 活動内容 35字
  docNumber: string;  // 資料番号
  featured: boolean;  // ◎
}

export interface OrganizationEntry {
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  grade: string;      // 学年
  age: string;        // 年齢
  name: string;       // 組織名 20字
  role: string;       // 役職 10字
  docNumber: string;
  featured: boolean;  // ◎
}

export interface CompetitionEntry {
  year: string;
  month: string;
  age: string;        // 年齢
  name: string;       // 競技・コンクール等名称 30字
  organizer: string;  // 主催機関 30字
  result: string;     // 成績結果 20字
  docNumber: string;
  featured: boolean;  // ◎
}

export interface QualificationEntry {
  year: string;
  month: string;
  age: string;
  name: string;         // 資格等の名称 30字
  level: string;        // 資格級位 20字
  organization: string; // 資格認定機関名 30字
  docNumber: string;
}

export interface OptionalMaterialEntry {
  number: number;
  summary: string;    // 200字
}

export interface ActivityData {
  // 応募試験基本情報
  enrollmentPeriod: "april" | "september" | "";
  enrollmentReason: string;      // 200字
  // 学歴
  academics: AcademicEntry[];    // 6件
  // 海外滞在
  overseas: OverseasEntry[];     // 4件
  // 中学卒業後の進路
  juniorHighPath: string;        // 200字
  // 活動報告
  selfEval: string;              // 200字
  activities: ActivityEntry[];   // 10件
  optionalMaterials: OptionalMaterialEntry[]; // 10件
  orgs: OrganizationEntry[];     // 5件
  competitions: CompetitionEntry[]; // 5件
  groupRole: string;             // 100字
  sports: string;                // 100字
  qualifications: QualificationEntry[]; // 5件
  other: string;                 // 500字
}

export const emptyAcademic = (): AcademicEntry => ({ name: "", location: "", startYear: "", startMonth: "", endYear: "", endMonth: "", duration: "" });
export const emptyOverseas = (): OverseasEntry => ({ country: "", companion: "", startYear: "", startMonth: "", endYear: "", endMonth: "", purpose: "" });
export const emptyActivity = (): ActivityEntry => ({ year: "", month: "", grade: "", age: "", content: "", docNumber: "", featured: false });
export const emptyOrg = (): OrganizationEntry => ({ startYear: "", startMonth: "", endYear: "", endMonth: "", grade: "", age: "", name: "", role: "", docNumber: "", featured: false });
export const emptyComp = (): CompetitionEntry => ({ year: "", month: "", age: "", name: "", organizer: "", result: "", docNumber: "", featured: false });
export const emptyQual = (): QualificationEntry => ({ year: "", month: "", age: "", name: "", level: "", organization: "", docNumber: "" });
export const emptyOptional = (n: number): OptionalMaterialEntry => ({ number: n, summary: "" });

export const defaultActivityData = (): ActivityData => ({
  enrollmentPeriod: "",
  enrollmentReason: "",
  academics: Array.from({ length: 6 }, emptyAcademic),
  overseas: Array.from({ length: 4 }, emptyOverseas),
  juniorHighPath: "",
  selfEval: "",
  activities: Array.from({ length: 10 }, emptyActivity),
  optionalMaterials: Array.from({ length: 10 }, (_, i) => emptyOptional(i + 1)),
  orgs: Array.from({ length: 5 }, emptyOrg),
  competitions: Array.from({ length: 5 }, emptyComp),
  groupRole: "",
  sports: "",
  qualifications: Array.from({ length: 5 }, emptyQual),
  other: "",
});

export const ACTIVITY_STORAGE_KEY = "shonan_juku_activity_worksheet_v2";
export const STATEMENT_WORKSHEET_KEY = "shonan_juku_statement_worksheet";
