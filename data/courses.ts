export interface LessonDetail {
  point: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  phase: string;
  phaseLabel: string;
  loomUrl?: string;
  slidesUrl?: string;
  description: string;
  keyPoints: string[];
  details?: LessonDetail[];
  notionUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  shortTitle: string;
  icon: string;
  color: string;
  accentColor: string;
  totalLessons: number;
  description: string;
  lessons: Lesson[];
}

export const courses: Course[] = [
  {
    id: "statement",
    title: "志望理由書 完全解説",
    shortTitle: "志望理由書",
    icon: "📝",
    color: "from-blue-900/50 to-blue-800/30",
    accentColor: "#3b82f6",
    totalLessons: 16,
    description: "SFC AO入試で最も配点が高い志望理由書を、構造・段落・表現の3層から完全攻略する。No.1〜5で全体設計、No.6〜13で各段落、No.14〜16で仕上げまで完走する。",
    lessons: [
      {
        id: "no1",
        number: 1,
        title: "志望理由書の重要度",
        phase: "phase1",
        phaseLabel: "PHASE 1｜全体設計を理解する",
        loomUrl: "https://www.loom.com/share/a0c67753cc5f4206bd9c67acd2552c9e",
        slidesUrl: "https://docs.google.com/presentation/d/1IIxBvddMbUM7F1KRErugl1V098ulbQhc/edit?usp=sharing",
        description: "SFC AO入試における志望理由書の位置づけと、なぜこれが合否を決定するのかを解説。",
        keyPoints: [
          "志望理由書は最初に読まれる＝最重要書類",
          "教授は時間をかけて読まない（1資料3分以内）",
          "評価を分けるのは「情報量」ではなく「構造」",
          "一段落目・一文目が運命を決める",
        ],
        details: [
          { point: "志望理由書は最初に読まれる＝最重要書類", explanation: "提出書類の中で第一印象を決める＆最も洗練されている必要がある" },
          { point: "教授は時間をかけて読まない", explanation: "何百人分の評価をするため1資料3分も見られない。だから、丁寧に読まれる前提は危険" },
          { point: "評価を分けるのは「情報量」ではなく「構造」", explanation: "段落設計がすべて。無駄・冗長・回りくどい説明は全て切り落とす。でなければ読む気を失わせ、評価の機会喪失に繋がる。" },
          { point: "一段落目・一文目が運命を決める", explanation: "ここで惹きつけられなければ他の資料は読まれない。「時間を使う価値があるか」の最重要判断ポイント　教授に興味を持たせる！" },
        ],
        notionUrl: "https://www.notion.so/69a241b59e6d8392bc81813b68d8291a",
      },
      {
        id: "no2",
        number: 2,
        title: "志望理由書の構成面における基本的な掟",
        phase: "phase1",
        phaseLabel: "PHASE 1｜全体設計を理解する",
        loomUrl: "https://www.loom.com/share/a29218467d20413c9daf16c42aca812a",
        slidesUrl: "https://docs.google.com/presentation/d/1LKJygj9u-PfIPbLP4g2W_TNdPWvm4MeI/edit?usp=sharing",
        description: "SFC審査官が「落とす志望理由書」に共通するパターンと、絶対に守るべき構成ルールを解説。",
        keyPoints: [
          "落とされる志望理由書の共通パターンを学ぶ",
          "絶対に守るべき構成ルールの把握",
          "審査官の視点からの逆算思考",
        ],
        details: [
          { point: "2000字以内→ギリギリまで書く→内容は主に探究活動で", explanation: "当事者性が必要。単なる文献研究で終わっていないこと。実践で何を学び、何が足りないと感じているか" },
          { point: "1段落を200〜300字で分ける→最大10段落", explanation: "最低6〜7段落。段落ごとに構成がある" },
          { point: "志望理由・学習計画・自己アピール→この3つはマスト", explanation: "この3要素を必ず盛り込む" },
        ],
        notionUrl: "https://www.notion.so/8c6241b59e6d8323887081f78ed849f5",
      },
      {
        id: "no3",
        number: 3,
        title: "SFC合格者の志望理由書に共通する本質構造",
        phase: "phase1",
        phaseLabel: "PHASE 1｜全体設計を理解する",
        loomUrl: "https://www.loom.com/share/01de010678724a8d9d8369dd66e7f2e0",
        slidesUrl: "https://docs.google.com/presentation/d/1P9NO9_it4k5cQhZHRgLODYPAL1GRFo6M/edit?usp=sharing",
        description: "合格者の志望理由書を分解すると見えてくる「研究者の卵」としての論理構造を解説。",
        keyPoints: [
          "合格者の志望理由書の共通パターン分析",
          "「研究者の卵」として認められる論理構造",
          "SFCが本当に評価するポイント",
        ],
        details: [
          { point: "合格者の志望理由書は「やる気の作文」ではなく、過去の経験＋実践報告書＋将来設計書を融合した文書", explanation: "何を見て、何に違和感を覚え、どう動き、何に失敗し、何が足りないと悟り、だからSFCが必要だ、という因果構造を持つ" },
          { point: "最大の特徴は、高校時代の探究活動を「研究プロジェクト」として再構築している点", explanation: "螺旋階段型（Root→Action→Analyze→New Method→Problem→Resource→Vision）と完全に一致する構造" },
          { point: "SFC志望理由書とは、人生史×探究経験＆知見×学際設計×大学活用計画を2000字で圧縮した文書", explanation: "単なる志望動機の羅列ではなく、これら4要素を統合して表現する必要がある" },
        ],
        notionUrl: "https://www.notion.so/130241b59e6d836796ba0127c785a72d",
      },
      {
        id: "no4",
        number: 4,
        title: "段落戦略とその内容",
        phase: "phase1",
        phaseLabel: "PHASE 1｜全体設計を理解する",
        loomUrl: "https://www.loom.com/share/8672d944e9de4319844a8141cdb817e2",
        slidesUrl: "https://docs.google.com/presentation/d/1HmG-kCR6v64C3RCUr6H6BIUMYoJq4tbo/edit?usp=sharing",
        description: "8段落それぞれの「役割・分量・つながり方」を俯瞰する。書く前に必ず見ること。",
        keyPoints: [
          "8段落それぞれの役割と分量",
          "段落間のつながり方と論理の流れ",
          "書き始める前の全体設計の重要性",
        ],
        details: [
          { point: "読み手（教授）が「論文的に読める」", explanation: "7〜9段落・1段落200〜300字・一文60字ベース（長くても100字）という構成が論文的な読みやすさを生む" },
          { point: "思考の深さを段落単位で評価できる", explanation: "段落ごとにまとまりがあるため、教授が各段落で思考の深さを判断できる" },
          { point: "まとまりが見える→論理的構成になる", explanation: "全体1900〜2000字、段落数7〜9段落、1段落200〜300字、一文の長さ基本60字。合格者の平均一文の文字数→60字→最も文字数を節約して内容を濃くできる量" },
        ],
        notionUrl: "https://www.notion.so/b48241b59e6d824782fd01831329c84b",
      },
      {
        id: "no5",
        number: 5,
        title: "理想構成（8段落モデル）& 原体験の掘り方",
        phase: "phase1",
        phaseLabel: "PHASE 1｜全体設計を理解する",
        loomUrl: "https://www.loom.com/share/1ac63508dda844acb98099bf74ba6747",
        slidesUrl: "https://docs.google.com/presentation/d/1CgllpKceCsZ99pMJYp1hmqcFRZz_K6Q4/edit?usp=sharing",
        description: "8段落モデルの完成形と、すべての土台となる「原体験」の言語化メソッドを解説。",
        keyPoints: [
          "8段落モデルの完成形を把握する",
          "原体験の言語化メソッド",
          "すべての書類の土台となる原体験の掘り方",
        ],
        details: [
          { point: "①原体験＋研究宣言", explanation: "読者を一気に研究モードに引き込む段落。インパクト文・探究実績要約・将来方向・SFC必然の4要素で構成" },
          { point: "②問題意識の形成（活動の契機）", explanation: "「なぜこの研究になったか」を説明する段落。原体験・感情・問い誕生の流れで書く" },
          { point: "③現場行動（フィールドワーク・文献調査）", explanation: "当事者性の証明。フィールドワーク・インタビュー・文献調査などの体験と、そこから得た学び・気づきを書く" },
          { point: "④問題点（産業自体の）・限界（既存解決策の）", explanation: "研究者性の証明。探究分野の核となる問題、原因分析、既存解決策の限界認識を語る" },
          { point: "⑤既存の解決策の再設計→自分なりの解決策", explanation: "新たな解決策を自分で生み出し社会で実行（パターン1）、または理論ベースで深く考察（パターン2）のいずれか" },
          { point: "⑥自分の解決策の限界を踏まえ、学問的に取り組む必然性を示唆", explanation: "新しい解決策のポテンシャルと社会実装時の期待値を述べ、SFCでの学問的探究の必然性につなげる" },
          { point: "⑦SFC資源の活用方法（具体的な学習計画）", explanation: "どの学問・研究手法・研究室・授業で学び、それを自分の研究にどう活かすかを具体的に書く" },
          { point: "⑧将来ビジョン→「覚悟の宣言」", explanation: "「結論」ではなく「覚悟」で終わる。SFCでなければならない理由を一段深く書き、自分の活動が「社会」に開かれて終わる" },
        ],
        notionUrl: "https://www.notion.so/5c7241b59e6d8256acbf81877f3dadc1",
      },
      {
        id: "no6",
        number: 6,
        title: "第一段落｜原体験＋研究宣言",
        phase: "phase2",
        phaseLabel: "PHASE 2｜各段落の書き方",
        loomUrl: "https://www.loom.com/share/ba48b1c2cd8f4b0ebc0e6e7427095405",
        slidesUrl: "https://docs.google.com/presentation/d/1zlGTQEv5gRiP3huqfsxsxSLKkiHJO3oK/edit?usp=sharing",
        description: "志望理由書の「顔」となる第一段落。審査官の心を掴む原体験の書き方と研究宣言の構造を解説。",
        keyPoints: [
          "審査官の心を掴む原体験の書き方",
          "研究宣言の論理構造",
          "第一文で「読む価値がある」と思わせる技術",
        ],
        details: [
          { point: "インパクト文", explanation: "一文目に自分の探究活動の中で最も印象に残ることを表す、または探究テーマの魅力や苦い経験・悔しい経験を一文で書く" },
          { point: "探究実績要約", explanation: "探究に関連する実績の中で自分が最も強調したい実績を提示する。複合的に実績をまとめるのもあり" },
          { point: "将来方向", explanation: "その研究を通してどのような世界を実現したいか。ex)「茶育」を広く普及させ茶文化を通じて多文化共生の礎を築きたい" },
          { point: "SFCの必然性", explanation: "SFCで何を学びどのように研究を発展させたいかを最後の文で書く（具体的には言わない→具体的に言うのは後半の学習計画の部分）" },
        ],
        notionUrl: "https://www.notion.so/f39241b59e6d83b4bda001360a0abf7a",
      },
      {
        id: "no7",
        number: 7,
        title: "第二段落｜研究活動の契機",
        phase: "phase2",
        phaseLabel: "PHASE 2｜各段落の書き方",
        loomUrl: "https://www.loom.com/share/9b8e1eef9a834dd8b2d83d23cfbd1b1f",
        slidesUrl: "https://docs.google.com/presentation/d/11uJSLT6Ro4vLCKPTC9eBY7Ygkwp4d3CO/edit?usp=sharing",
        description: "「なぜその問いを持つようになったか」を論理的に語る第二段落の書き方を解説。",
        keyPoints: [
          "問いを持つに至った必然性の語り方",
          "感情から問題意識への昇華",
          "「当事者性」の証明方法",
        ],
        details: [
          { point: "原体験", explanation: "過去にこういう経験をしたという内容を書く。探究テーマに興味を持ち始めたエピソードをベースにする" },
          { point: "感情・思い・考え", explanation: "その経験からこう思った（経験分析）またはその経験からこれに憧れた（将来ビジョンの話）" },
          { point: "問い誕生", explanation: "そこから、〜を通して〜のような現状を知った（社会問題や産業の衰退状況→いち早く取り組まなければならない問題感を出す）。そこで自分は〜の研究をすることにした" },
        ],
        notionUrl: "https://www.notion.so/1c0241b59e6d83bfbb128107680cd602",
      },
      {
        id: "no8",
        number: 8,
        title: "第三段落｜現場行動",
        phase: "phase2",
        phaseLabel: "PHASE 2｜各段落の書き方",
        loomUrl: "https://www.loom.com/share/7abbd7a5ba95449b9f15da0c785118fd",
        slidesUrl: "https://docs.google.com/presentation/d/1sGC8Ch6ceXFeXqEoaWmkMp92Ppjd7T8Q/edit?usp=sharing",
        description: "実際に動いた証拠を示す第三段落。「行動量」より「思考の深さ」を見せる書き方を解説。",
        keyPoints: [
          "「行動量」より「思考の深さ」を見せる",
          "調査・実践の記録の書き方",
          "行動から得た「発見」の言語化",
        ],
        details: [
          { point: "行動列挙及び他者接触", explanation: "フィールドワークやインタビュー、文献調査などの体験について書く。自分の探究分野をまず知るために行動したこと" },
          { point: "その探究分野における学び・気づき・発見", explanation: "その探究分野の衰退状況や核心となる問題、現場の声について言及する" },
          { point: "自分の主観及び上記の事実を踏まえた上での考えや感じたこと", explanation: "〜のような危機感を感じた、〜と思うようになった、などを書く。主観（当事者性のアピール）と客観（データ・数値）を混ぜる" },
        ],
        notionUrl: "https://www.notion.so/863241b59e6d822eb00801774f9e9438",
      },
      {
        id: "no9",
        number: 9,
        title: "第四段落｜問題点・限界",
        phase: "phase2",
        phaseLabel: "PHASE 2｜各段落の書き方",
        loomUrl: "https://www.loom.com/share/95031cbfe9e84794b6ea6724defaddc1",
        slidesUrl: "https://docs.google.com/presentation/d/18yX5ENeXo4bRxF8XzAviw-tF1MdNsk-y/edit?usp=sharing",
        description: "研究分野の問題点と既存解決策の限界を指摘する第四段落。批判的思考の見せ方を解説。",
        keyPoints: [
          "研究分野自体の問題点の指摘",
          "既存の解決策の限界を客観的に示す",
          "批判的思考力のアピール方法",
        ],
        details: [
          { point: "探究している分野の核となる問題", explanation: "探究分野の中で自分が解決したい最も深刻な問題。早急に取り組まなければならない必要性をアピール" },
          { point: "原因分析", explanation: "なぜその問題が現状も続いているのかを分析して書く" },
          { point: "既存解決策の限界認識", explanation: "既存の解決策が上手く機能していないからその問題が内在しているので、その限界点や問題点に触れる。新しい解決策がどうあるべきか（既存の改善か、全く新しいアプローチか）まで示す" },
        ],
        notionUrl: "https://www.notion.so/286241b59e6d82f599e701045d97c243",
      },
      {
        id: "no10",
        number: 10,
        title: "第五段落｜既存の解決策の再設計",
        phase: "phase2",
        phaseLabel: "PHASE 2｜各段落の書き方",
        loomUrl: "https://www.loom.com/share/381e9acf6bd147a3a004e8d165aeccf8",
        slidesUrl: "https://docs.google.com/presentation/d/1GO2XKjPJQNcfwby0Wgjox2KzXCpdtnci/edit?usp=sharing",
        description: "既存アプローチを再設計する視点を示す第五段落。「提案型思考」の書き方を解説。",
        keyPoints: [
          "既存アプローチの問題点を超える提案",
          "「提案型思考」の書き方",
          "自分の新しい視点の提示",
        ],
        details: [
          { point: "パターン1：新たな解決策を自分で生み出し、それを社会で実行している", explanation: "すでに自分なりの解決策を形にし社会で試している。SFC的には最も評価されやすい。自分がどんな役割でどんな団体と協力しどんな結果を得たかを書く" },
          { point: "パターン2：理論ベースで深く考えている", explanation: "社会実装はしていないがフィールドワークや議論を通じて自分なりの解決策を磨いている。法学・政治学・制度研究など実装が難しい分野でもこのパターンで合格可能" },
          { point: "共通ルール：失敗談・苦労話は最大の武器", explanation: "思い通りにいかなかった点・直面した困難・それをどう乗り越えたか。「完璧な成功」より思考の繰り返しが見える失敗を評価する" },
        ],
        notionUrl: "https://www.notion.so/14c241b59e6d82c3a96a8122984eb415",
      },
      {
        id: "no11",
        number: 11,
        title: "第六段落｜自分の新しい解決策の可能性と主張",
        phase: "phase2",
        phaseLabel: "PHASE 2｜各段落の書き方",
        loomUrl: "https://www.loom.com/share/34992a90ae3640978ac132c24a2a416e",
        slidesUrl: "https://docs.google.com/presentation/d/1GR412Z64XepGKxBAEVR16VSq-zX0RrGK/edit?usp=sharing",
        description: "自分ならではの解決策と、それに取り組む必然性を示す第六段落の書き方を解説。",
        keyPoints: [
          "独自の解決策を論理的に提示する方法",
          "「なぜ自分がやるべきか」の必然性",
          "仮説・検証の思考フレーム",
        ],
        details: [
          { point: "新しい解決策のポテンシャル及び可能性を示す", explanation: "前段落で述べた新解決策が持つポテンシャルと、それが完成し社会実装された際の期待値について述べる。将来その解決策がどのようなイノベーションや変革を起こし得るのかを語る" },
          { point: "自分の解決策の強みを強調", explanation: "新解決策の内容と自分がどこまで実行したのかを示した上で、自分が培ってきた経験を通してどのような可能性をその解決策に見出しているのかを書く" },
        ],
        notionUrl: "https://www.notion.so/d02241b59e6d83b8b3b2016373e35367",
      },
      {
        id: "no12",
        number: 12,
        title: "第七段落｜SFC資源の活用法",
        phase: "phase2",
        phaseLabel: "PHASE 2｜各段落の書き方",
        loomUrl: "https://www.loom.com/share/9a4524a4d6ad434b98fc68012b7b2282",
        slidesUrl: "https://docs.google.com/presentation/d/1T-pAtASpXFox_BfINf_treZRQO9Ym5lk/edit?usp=sharing",
        description: "SFCの教員・研究会・環境を具体的に挙げて「なぜSFCでなければならないか」を論じる方法を解説。",
        keyPoints: [
          "SFC教員・研究会を具体的に調査する重要性",
          "「なぜSFCでなければならないか」の論じ方",
          "他大学との差別化ポイント",
        ],
        details: [
          { point: "SFCが定義する実績の6区分（A〜F）", explanation: "学術・文化・スポーツ、外国語・IT技能、社会奉仕活動、学業優秀、地域指導的役割、自由研究・自主学習の成果の6カテゴリが公式に実績として認められている。学習以外の特別な活動がなくても、学業優秀でSFCで学びたいことを明確に持っていれば出願を歓迎している" },
          { point: "「実績」の本質的な捉え方", explanation: "受賞歴・表彰などの目に見える成果だけが実績ではない。課題に対して自ら考え行動し試行錯誤した経験や過程で得た学びも実績として評価される" },
          { point: "伝え方の要点", explanation: "何をしたかという結果だけでなく、なぜ取り組み、どのように工夫し、そこから何を得たのかを分かりやすく端的に伝えることが重要" },
        ],
        notionUrl: "https://www.notion.so/35b241b59e6d8213836181557888a631",
      },
      {
        id: "no13",
        number: 13,
        title: "第八段落｜将来ビジョン",
        phase: "phase2",
        phaseLabel: "PHASE 2｜各段落の書き方",
        loomUrl: "https://www.loom.com/share/0216dcb5c4464eafb45d41dc39fbdcb9",
        slidesUrl: "https://docs.google.com/presentation/d/1bHLxePTITWmFnA0_EAO0S8j4SGmsaft2/edit?usp=sharing",
        description: "SFCで研究した先に何を実現するか。社会還元まで描く第八段落の書き方を解説。",
        keyPoints: [
          "社会還元まで描く将来ビジョンの構造",
          "「個人の成功」で終わらない社会貢献の語り方",
          "SFCでの学びと将来の必然的なつながり",
        ],
        details: [
          { point: "「結論」ではなく「覚悟」で終わっている", explanation: "自分はこれをやり切る人間である、これは一時的関心ではない、生涯・将来レベルの意思を示す" },
          { point: "「SFCでなければならない理由」を一段深く書いている", explanation: "人（先輩・仲間・教授）、理念（気品の泉源など）、文化（挑戦する空気・ユニークさ）、場（研究環境など）を絡めて書く" },
          { point: "自分の活動が「社会」に開かれて終わる", explanation: "自分のエゴで研究を行い終わらせるのではなく、社会的に自分の研究をどう活かしたいのかを書く" },
        ],
        notionUrl: "https://www.notion.so/7c6241b59e6d8298b72881d80fa6411f",
      },
      {
        id: "no14",
        number: 14,
        title: "志望理由書作成における注意点",
        phase: "phase3",
        phaseLabel: "PHASE 3｜仕上げ・最終チェック",
        slidesUrl: "https://docs.google.com/presentation/d/1a6KispBZs9IJJvpb2QO_bgxJ5Bk0Mawf/edit?usp=sharing",
        description: "合格者が陥りがちな「惜しいミス」を一覧化。提出前に必ず確認すべきチェックリストを解説。",
        keyPoints: [
          "合格者が陥りがちな「惜しいミス」一覧",
          "提出前の必須チェックリスト",
          "論理・表現・形式の3軸チェック",
        ],
        details: [
          { point: "「私」を多用しない", explanation: "全体で1〜3回の使用がベスト。「志望する」も多用しすぎないこと" },
          { point: "SFCパンフレットやアドミッションポリシーで頻繁に使われる言葉は使わない", explanation: "「問題発見・解決型の環境」「主体的・能動的」「実践知」などの言葉を避け、自分の言葉でSFCと自分の魅力を伝える" },
          { point: "アドミッションポリシー・パンフレット・受験要項・SFCの本を読み込みSFCへの解像度を上げることは非常に重要", explanation: "言葉を借用するためではなく、SFCへの理解を深め自分の言葉で語るための読み込みが必要" },
        ],
        notionUrl: "https://www.notion.so/6e9241b59e6d82d79a50812752e0e82a",
      },
      {
        id: "no15",
        number: 15,
        title: "リサーチの極意",
        phase: "phase3",
        phaseLabel: "PHASE 3｜仕上げ・最終チェック",
        loomUrl: "",
        description: "志望理由書の説得力を10倍にする「一次情報へのアクセス法」と「文献調査の型」を解説。",
        keyPoints: [
          "一次情報へのアクセス方法",
          "文献調査の型と使い方",
          "説得力を10倍にするリサーチ戦略",
        ],
        details: [],
        notionUrl: "https://www.notion.so/c8c241b59e6d82a99efd81c9561b79d7",
      },
      {
        id: "no16",
        number: 16,
        title: "最終チェック",
        phase: "phase3",
        phaseLabel: "PHASE 3｜仕上げ・最終チェック",
        loomUrl: "",
        description: "提出直前の最終確認リスト。論理・表現・形式の3軸で志望理由書を点検する方法を解説。",
        keyPoints: [
          "提出直前の最終確認リスト",
          "論理・表現・形式の3軸での点検",
          "提出後の後悔をゼロにする方法",
        ],
        details: [
          { point: "任意提出資料の本質は「実績の提出」ではなく、自分という人間の思考構造を証明する研究報告書", explanation: "合格者が提出しているのは「なぜその活動を行ったのか」「その活動から何を問い、どう検証し、どこまで深めたのか」という思考の軌跡" },
          { point: "教授は「すごい高校生」を探しているのではなく「研究者になり得る思考回路を持つ人」を探している", explanation: "任意提出資料は、その思考回路を可視化するための装置。過去の成果を見せるものではなく、自分の問いの進化を見せるもの" },
          { point: "合格者の共通構造：原体験→違和感・問題意識→問いの設定→新しい解決策→検証・行動→データ・客観性→現状の課題＆社会実装の可能性→SFCでの深化", explanation: "どの合格者も活動の紹介から始まらず必ず「問い」から始まる。重要なのは「検証」があること（インタビュー・実験・外部連携・数値化・専門家との対話）" },
        ],
        notionUrl: "https://www.notion.so/365241b59e6d8260b6f0818b07def7d1",
      },
    ],
  },
  {
    id: "activity",
    title: "活動報告書 完全解説",
    shortTitle: "活動報告書",
    icon: "📋",
    color: "from-green-900/50 to-green-800/30",
    accentColor: "#22c55e",
    totalLessons: 10,
    description: "実績を研究者視点で再定義し端的に魅せる。No.1〜10の動画で活動報告書の各項目の書き方・合格者例を完全習得する。",
    lessons: [
      {
        id: "no1",
        number: 1,
        title: "活動報告書の重要度と全体像",
        phase: "phase1",
        phaseLabel: "全体像を掴む",
        loomUrl: "https://www.loom.com/share/89b89069376a42b6ba0706bc77740855",
        slidesUrl: "https://docs.google.com/presentation/d/1DNi0vNOsBcZFPugmoltMJsVtPsLs_y56/edit?usp=sharing",
        description: "活動報告書がSFC AO入試においてどのような役割を果たすか、全体像を解説する。",
        keyPoints: [
          "活動報告書の位置づけと重要度",
          "志望理由書との連携方法",
          "審査官が何を見ているか",
        ],
        details: [
          { point: "SFCが定義する実績の6区分（A〜F）", explanation: "学術・文化・スポーツ、外国語・IT技能、社会奉仕活動、学業優秀、地域指導的役割、自由研究・自主学習の成果の6カテゴリが公式に実績として認められている。学業優秀でSFCで学びたいことを明確に持っていれば出願を歓迎している" },
          { point: "「実績」の本質的な捉え方", explanation: "受賞歴・表彰などの目に見える成果だけが実績ではない。課題に対して自ら考え行動し試行錯誤した経験や過程で得た学びも実績として評価される。小さな事象でも「なぜそれを実績と捉えているか」を論理的・客観的に説明できれば実績になりうる" },
          { point: "伝え方の要点", explanation: "何をしたかという結果だけでなく、なぜ取り組み、どのように工夫し、そこから何を得たのかを分かりやすく端的に伝えることが重要" },
        ],
        notionUrl: "https://www.notion.so/623241b59e6d83b59cb581d94a5c46a1",
      },
      {
        id: "no2",
        number: 2,
        title: "活動記録の選び方・並べ方",
        phase: "phase1",
        phaseLabel: "全体像を掴む",
        loomUrl: "https://www.loom.com/share/8948f3038ef54a3280a45ced644faaa7",
        slidesUrl: "https://docs.google.com/presentation/d/1WEnk5d5p2rXMjKw4-YYciCkTswDgUMmx/edit?usp=sharing",
        description: "10項目の活動記録をどのように選び、どのような順番で並べるか。戦略的な配置を解説。",
        keyPoints: [
          "活動記録の選び方の基準",
          "戦略的な並べ方と優先度",
          "研究テーマとの一貫性の作り方",
        ],
        details: [
          { point: "「制度説明」ではなく「自分の研究・活動起点」で書く", explanation: "「日本では4月入学が一般的だから」などの制度説明はNG。合格者は「自分の探究・研究・プロジェクトをなぜ早く始めるべきか」「なぜ今すぐ大学資源が必要なのか」を起点に書く。入学時期＝「研究開始時期」と捉えているかが超重要" },
          { point: "「早く入学できる」＝「早く社会に価値を出す」と結びつける", explanation: "評価者は受験生が大学を「学ぶ場所」ではなく「社会に価値を返すための加速装置」として見ているかを確認している。合格者は「早く入学＝早く研究→早く実践＝早く社会還元」の順序で書く" },
        ],
        notionUrl: "https://www.notion.so/20d241b59e6d832c91ba81290df450e4",
      },
      {
        id: "no3",
        number: 3,
        title: "35字アピール文の書き方",
        phase: "phase2",
        phaseLabel: "各項目の書き方",
        loomUrl: "https://www.loom.com/share/83c340ba2ad045e38392ef9da48bdd12",
        slidesUrl: "https://docs.google.com/presentation/d/1QR9i5LJSx8uWlNXqZver27OUnt3r17VI/edit?usp=sharing",
        description: "審査官が最初に目にする35字アピール文。インパクトと情報量を両立させる書き方を解説。",
        keyPoints: [
          "35字でインパクトを出す技術",
          "「研究者の卵」として見せる表現法",
          "避けるべき表現パターン",
        ],
        details: [],
        notionUrl: "https://www.notion.so/343241b59e6d8214bf0b81863343a149",
      },
      {
        id: "no4",
        number: 4,
        title: "200字要約の書き方",
        phase: "phase2",
        phaseLabel: "各項目の書き方",
        loomUrl: "https://www.loom.com/share/431c2609dc304542ad0673378a52a033",
        slidesUrl: "https://docs.google.com/presentation/d/1ggEDbp-hBLjamC_xrTkjR-dUFcORoo0s/edit?usp=sharing",
        description: "200字という制約の中で活動の本質を伝える。任意提出資料と連動した設計方法を解説。",
        keyPoints: [
          "200字で活動の本質を伝える構造",
          "任意提出資料との連動設計",
          "「謎を残す」書き方で続きを読ませる",
        ],
        details: [
          { point: "【一文目】「〜を最も評価する。」の形で締める", explanation: "評価者が見ているのは何を「実績」と定義しているか。合格者は必ず自分の研究・探究の中核となる活動実績を取り上げ、規模・社会性があるものを選ぶ" },
          { point: "【二文目・三文目】実績を築くために果たした自分の役割と具体性", explanation: "「参加した」「手伝った」はNG。自分が意思決定の主体だったと分かる表現（立ち上げた、一から担った、各団体の橋渡しを果たしたなど）で当事者性・主体性・実行力を示す" },
          { point: "【四文目】実績を研究としてどのように昇華できたか", explanation: "SFC的に最重要。「イベントをやった→終わり」ではなく、実践を研究に落とし込んだことを示す。実践→文化教育の視点の深掘り→産業課題の研究→論文、というように完全に研究成果として回収する" },
          { point: "実績の考え方：研究者としての素質が問われている", explanation: "SFCは研究者としての素質を最重視する。目の前の事象に問いを立て、自ら調べ、検証し、言語化する力が評価の核心。規模が小さな活動でも、どのような視点で捉え研究へ結びつけているかで価値は大きく変わる" },
        ],
        notionUrl: "https://www.notion.so/acd241b59e6d82e9be36816e7c958ad3",
      },
      {
        id: "no5",
        number: 5,
        title: "学業・学校活動の書き方",
        phase: "phase2",
        phaseLabel: "各項目の書き方",
        loomUrl: "https://www.loom.com/share/2e51abc0c6894d0f9c8ebe735946aeb9",
        slidesUrl: "https://docs.google.com/presentation/d/1GJzDuT-hYQSVC3Ph8H7wZ-AorUutsE8m/edit?usp=sharing",
        description: "学業や学校内の活動を研究者視点で再定義する方法。成績・授業・学校行事の書き方を解説。",
        keyPoints: [
          "学業を研究者視点で再定義する",
          "成績・授業の書き方",
          "学校内活動の差別化戦略",
        ],
        details: [
          { point: "① 活動記録の基本ルール", explanation: "特に報告したい活動・成果を10項目に絞って記入する欄。各項目には実績を補足・裏付けるための任意提出資料を紐づけられる。◎は最大3つまでで「評価者への読み順ナビゲーション」として機能する" },
          { point: "② 任意提出資料の考え方（最重要）", explanation: "10項目＝10任意提出資料ではなく、複数の活動項目をまとめて1つの資料で補足してよい。探究活動→スライド型・論文型資料、留学→留学レポート・英語資格、学業→成績・奨学金資料、課外活動→実績まとめ資料、というように活動の性質ごとに資料をまとめるのが最も効果的" },
          { point: "③ 35字アピール文の重要性", explanation: "この一文で任意提出資料が見られるか否かが決まる。「数字を用いて具体性を示している」「35字ギリギリまで書き切っている」「自分の思いと役割が自然に分かる表現」「見出し・コピーライティング的な性質を持つ」の4点が合格者に共通する工夫" },
          { point: "④ 資料番号の扱いについて", explanation: "資料番号（1〜10）は任意提出資料の優先度を示す番号で、1に近いほど重要度が高い。同一の任意提出資料が複数の活動項目を補足する場合は同じ資料番号を割り当ててよい" },
          { point: "⑤ 学年欄の注意点", explanation: "記入するのは最も成果が出た時期ではなく、その活動を開始した学年を書く" },
        ],
        notionUrl: "https://www.notion.so/d7b241b59e6d83188a68010fb7bcf794",
      },
      {
        id: "no6",
        number: 6,
        title: "課外活動・探究活動の書き方",
        phase: "phase2",
        phaseLabel: "各項目の書き方",
        loomUrl: "https://www.loom.com/share/68f1b3d5c2024c9f9ba5e5b29d1a087b",
        slidesUrl: "https://docs.google.com/presentation/d/1wkxJtXR0RoCh4NTPsDbFEQggZzf23Ypj/edit?usp=sharing",
        description: "課外活動や自主的な探究活動を最大限に活かす書き方。行動の「思考の深さ」を見せる技術。",
        keyPoints: [
          "課外活動の本質的な価値の見つけ方",
          "「行動量」より「思考の深さ」",
          "探究活動の論理的な記述方法",
        ],
        details: [
          { point: "一文目：「この資料は何の資料か」が即座に分かるラベル機能", explanation: "「◯◯に関する資料」という形で終わらせ、研究系・学業実績系・課外活動報告かを一読で判別できる構造にする。評価者が「読む／読まない」を判断するためのラベル機能を一文目が果たしている" },
          { point: "二文目：その資料の核となる実績を一点突破で示す", explanation: "最も強い実績・一番見せたい成果を一点に絞って提示する。「何をどこまでやったか」（行動の主体性と範囲）と「その実績を出す上での過程の重さ」（具体的数値・困難・負荷）の両方を含める" },
          { point: "三文目：あえて「結論を言い切らない」謎の残し方", explanation: "「分かった」「成長した」「気付いた」とは書くが、その中身は書かない。「答え」ではなく「問い」を残すことで資料を見ないと分からない構造を作り、教授が資料を読まざるを得ない状態に設計する" },
        ],
        notionUrl: "https://www.notion.so/c68241b59e6d820f92ff01fd2fd3c08a",
      },
      {
        id: "no7",
        number: 7,
        title: "ボランティア・社会活動の書き方",
        phase: "phase2",
        phaseLabel: "各項目の書き方",
        loomUrl: "https://www.loom.com/share/3e31d758277743449119b9b83e7cc26c",
        slidesUrl: "https://docs.google.com/presentation/d/1d2HHjYjkBDhIQvtfEV9Xt1Q96DOHihc2/edit?usp=sharing",
        description: "ボランティアや社会活動を研究テーマと接続させる書き方。「社会貢献」から「問題解決」への転換。",
        keyPoints: [
          "ボランティアを研究テーマと接続する",
          "「社会貢献」から「問題解決」への転換",
          "当事者性の証明方法",
        ],
        details: [
          { point: "① 学年欄について", explanation: "ここで記入する「学年」は活動を開始した時期ではなく、活動が終了した時期（成果が一段落・区切りがついた時点の学年）を書く。活動の「結果」や「到達点」を示すための学年である" },
          { point: "② 組織内の役職・役割について", explanation: "部長・副部長などの公式な役職だけでなく、メンバー、エース、広報担当など組織内での実質的な役割も十分に評価対象となる。肩書きの強さよりも「組織の中でどのような役割を担っていたか」が重視される" },
          { point: "なぜ「役割」まで書いてよいのか", explanation: "SFCが見ているのはリーダー経験や偉い肩書きではなく、組織の中で自分の立ち位置を理解しどのような価値を提供していたか。これは研究者に必要な「観察力・役割認識・協働力」を問うもの" },
        ],
        notionUrl: "https://www.notion.so/db9241b59e6d8282aa9c81ebf19f94fb",
      },
      {
        id: "no8",
        number: 8,
        title: "留学・海外経験の書き方",
        phase: "phase2",
        phaseLabel: "各項目の書き方",
        loomUrl: "https://www.loom.com/share/b25b3747a9a8420297a15d19cbfc8d61",
        slidesUrl: "https://docs.google.com/presentation/d/1QpHsWX5UU63cXq0QDIb9ZEzAycjXlURc/edit?usp=sharing",
        description: "留学や海外経験を単なる「経験談」で終わらせない。グローバルな問題意識との接続方法を解説。",
        keyPoints: [
          "留学を研究テーマと接続する方法",
          "語学力より「思考の変化」を伝える",
          "グローバルな問題意識の示し方",
        ],
        details: [
          { point: "各種競技・コンクール・懸賞論文等参加歴：入賞がなくても可能な限り多く記載する", explanation: "成績を残していない競技やコンクールへの参加経験も無意味ではない。重要なのはその経験を通して何を感じ何を学びそれを次にどう生かそうとしているかであり、任意提出資料で丁寧に補足できれば十分に評価される実績となる" },
          { point: "大会名・主催機関名が長い場合の省略ルール", explanation: "英語の大会名など30字以内の制限を超える場合は意味が変わらない範囲で省略してよい。ただし原則として正式名称で記載し、名称の正確性が実績の信頼性を担保するため注意が必要" },
          { point: "団体活動・競技における役割と実績：100字以内で一本の軸を示す", explanation: "団体の中で自分がどのような立場にありどのような役割を担ってきたかを100字以内で明確に示す。肩書きや目立った成果よりも、周囲と協働しながらどう成果に貢献したかが問われる" },
        ],
        notionUrl: "https://www.notion.so/09f241b59e6d827183c181a0b4f0d2c9",
      },
      {
        id: "no9",
        number: 9,
        title: "受賞・資格の書き方",
        phase: "phase2",
        phaseLabel: "各項目の書き方",
        loomUrl: "https://www.loom.com/share/b74470b7a6d340278a297f1db0b9d21c",
        slidesUrl: "https://docs.google.com/presentation/d/1h1z9jC-kXhf7LMGO6eonynNjxduqFDXu/edit?usp=sharing",
        description: "受賞歴や資格の書き方。「実績」を「研究者としての能力証明」に昇華させる方法を解説。",
        keyPoints: [
          "受賞歴を能力証明に昇華させる",
          "資格の戦略的な位置づけ",
          "実績と研究テーマの必然的なつながり",
        ],
        details: [
          { point: "スポーツ競技における特に優れた運動能力とその内容・記録", explanation: "上記の活動記録の中でスポーツ競技における特に優れた運動能力と内容・記録があれば100文字以内で追加説明できる欄。あれば書いた方がよいが書かなくてもよい" },
          { point: "資格・検定・段位等の取得：すべて正式名称で記入する", explanation: "資格等の名称（30文字以内）、資格級位（20文字以内）、資格認定機関名（30文字以内）をすべて漏れなく記載する。略称・通称ではなく正式名称を用いることが求められる。出願前に保有資格を一覧としてまとめておくことが望ましい" },
        ],
        notionUrl: "https://www.notion.so/419241b59e6d82619c37816bc3577e5d",
      },
      {
        id: "no10",
        number: 10,
        title: "活動報告書 最終チェックと合格者例",
        phase: "phase3",
        phaseLabel: "仕上げ",
        loomUrl: "https://www.loom.com/share/4369811ce0fa4c8483fccb5202cdbac4",
        slidesUrl: "https://docs.google.com/presentation/d/148Qy3fMW0Z-qiQoO9gqNm48UleC-OYOl/edit?usp=sharing",
        description: "提出前の最終確認と合格者の活動報告書例を分析。全体の一貫性と戦略性を点検する。",
        keyPoints: [
          "全体の一貫性チェック",
          "合格者の活動報告書例の分析",
          "提出前の最終確認ポイント",
        ],
        details: [
          { point: "「意外性のあるスタート」で読み手を引き込む", explanation: "冒頭から成果や肩書きを語るのではなく「実は自分はこういう人間だった」という意外な一面や弱点から書き始めるケースが多い。その後さまざまな活動を通した変化と成長を描くことで続きを読みたくなる導入を作る" },
          { point: "探究以外に、自身が努力や情熱を注いできた活動を描く", explanation: "英語学習・留学・課外活動・部活動・生徒会などを取り上げ、後半でそれらの経験を通して身につけた能力（語学力・挑戦力・交渉力・主体性など）が探究活動でどう生かされたかを示す構成が多い" },
          { point: "数字を用いて「変化量」を可視化する", explanation: "平均75点から92.8点への成績向上、10ヶ月間の留学、CEFR A1からB2への伸長など、成長や挑戦の過程を数値で示す。「すごい実績」を示すためだけでなく、どれだけ変化・成長したかのプロセスを数字で伝える点が非常に効果的" },
          { point: "最後は成果ではなく「人間的特性」で締める", explanation: "結論部分は実績の羅列で終わらず、自身の性格や行動原理へ落とし込む。この500字欄は「何を成し遂げたか」よりも「どのような姿勢で物事に向き合う人間か」を伝える場" },
        ],
        notionUrl: "https://www.notion.so/c24241b59e6d82b8b05401f380da0cb9",
      },
    ],
  },
  {
    id: "free-writing",
    title: "自由記述 完全解説",
    shortTitle: "自由記述",
    icon: "🖊️",
    color: "from-orange-900/50 to-orange-800/30",
    accentColor: "#f97316",
    totalLessons: 3,
    description: "志望理由書・活動報告書を補完する独自の論考を作る。No.1〜3で自由記述の本質と設計手順を完全習得する。",
    lessons: [
      {
        id: "no1",
        number: 1,
        title: "自由記述の重要性と概要",
        phase: "phase1",
        phaseLabel: "全体像",
        loomUrl: "https://www.loom.com/share/143cbe9a03e54b0d99992c3d54375da6",
        slidesUrl: "https://docs.google.com/presentation/d/1FOVnjRLXLpau1Klw-Ry6_2p0_UT5O7FI/edit?usp=sharing",
        description: "SFC AO入試における自由記述の位置づけと、なぜこれが差別化のチャンスなのかを解説。",
        keyPoints: [
          "自由記述の位置づけと重要度",
          "志望理由書との補完関係",
          "差別化のチャンスとしての自由記述",
        ],
        details: [
          {
            point: "自由記述は「自分を理解させる設計図」",
            explanation: "二次試験の面接時に、教授陣がタブレットで確認しながら質問をする。つまり自由記述は補足資料ではなく、自分のことをほとんど知らない教授に対してA4二枚だけで魅力・実績・思考・将来像を伝えきる設計図でなければならない。",
          },
          {
            point: "提出形式の概要",
            explanation: "志望理由・入学後の学習計画・自己アピールを自由記述（2枚以内）に入れ込む。10MB以内のPDFファイル（A4サイズ2枚以内）であれば表現方法は自由。2枚作成する場合も1つのPDFにまとめて提出する必要がある。",
          },
          {
            point: "差別化のチャンスとしての位置づけ",
            explanation: "テーマ・形式が自由だからこそ、設計力と表現力が直接問われる。No.1で概要を掴み、No.2〜3で1枚目・2枚目の執筆設計を完成させるのが推奨学習順序。",
          },
        ],
        notionUrl: "https://www.notion.so/b2e241b59e6d83bc8c7d01fadf56973a",
      },
      {
        id: "no2",
        number: 2,
        title: "自由記述の設計手順①",
        phase: "phase2",
        phaseLabel: "設計手順",
        loomUrl: "https://www.loom.com/share/e97f359750d9458fb5736b04e0077421",
        slidesUrl: "https://docs.google.com/presentation/d/1Me2UnxlSpDlHx7CCblZuR-2TRi5zuBBz/edit?usp=sharing",
        description: "自由記述のテーマ選定から論理構造の設計まで。第一段階の設計手順を解説。",
        keyPoints: [
          "テーマ選定の基準と方法",
          "論理構造の設計手順",
          "志望理由書との差別化戦略",
        ],
        details: [
          {
            point: "NO.1 デザインツールを選ぶ",
            explanation: "パワポ・Canva・Google Slideなどから選ぶ。パワポを強く推奨。理由は人物の切り貼りがスムーズにできること、フォントを自由に変形できること。",
          },
          {
            point: "NO.2 書式設定をA4に整える",
            explanation: "パワポまたはGoogle Slideで書式設定をA4サイズに変更する。縦か横かはNO.3で決定する。",
          },
          {
            point: "NO.3 参考例を探して向きを決める",
            explanation: "自分の探究分野に関する既存のポスター・チラシ・広告を見て参考例を探す。合格者例を参考にするのもOK。その上で資料を縦か横にするかを決める。",
          },
          {
            point: "NO.4 カラーパレットを決める",
            explanation: "自分のイメージカラー（探究活動に合う色）を選ぶ。そのカラーが際立つよう、他に使う色を2色決める。反対色と自分のイメージに合う色を組み合わせるのがコツ。",
          },
          {
            point: "NO.5 キャッチコピー（大見出し）を作る",
            explanation: "一枚目の上部に「目を引くキャッチコピー」を置く。「自分を表す自分ならではの肩書き」を自分で作ることが重要。例：「スポーツを通して多文化共生社会を目指す」など。",
          },
          {
            point: "NO.6 顔写真を貼る",
            explanation: "自分の顔が鮮明に写った写真を一枚選んで貼る。教授に顔を覚えてもらうため。探究活動に関連した、自分が輝いている写真が望ましい。",
          },
          {
            point: "NO.7 実績を書き出して分類する",
            explanation: "アピールしたい全ての実績（英語資格・成績・探究活動など）を書き出す。学業・外部評価・リーダー経験・探究活動の社会接続・具体的な数字の5要素を意識して整理する。数字は必ず太字で。",
          },
        ],
        notionUrl: "https://www.notion.so/b2e241b59e6d83bc8c7d01fadf56973a",
      },
      {
        id: "no3",
        number: 3,
        title: "自由記述の設計手順②",
        phase: "phase2",
        phaseLabel: "設計手順",
        loomUrl: "https://www.loom.com/share/d435c6850d614aa783285800668f645c",
        slidesUrl: "https://docs.google.com/presentation/d/1p81VYXAGhuvwH-_zYQrLQHpZ4m0ldJ-W/edit?usp=sharing",
        description: "自由記述の執筆から仕上げまで。完成度を高める第二段階の設計手順を解説。",
        keyPoints: [
          "執筆から仕上げまでの手順",
          "独自の論考の作り方",
          "提出前の最終確認ポイント",
        ],
        details: [
          {
            point: "① 社会課題の提示",
            explanation: "自分が探究してきた社会課題をまず提示する。活動の紹介から始めるのではなく、「問い」から始めることが合格者資料の共通点。",
          },
          {
            point: "② 自分の仮説",
            explanation: "その課題に対する自分なりの仮説を示す。なぜその仮説を立てたのかという根拠も合わせて書くと論理的な構造になる。",
          },
          {
            point: "③ 実践",
            explanation: "仮説をもとに自分が実践してきたことを紹介する。インタビュー・実験・外部連携・専門家との対話など、具体的な行動を示す。",
          },
          {
            point: "④ 未解決部分（最重要）",
            explanation: "まだ解決できていない部分・わからない部分を明確にする。完成した人ではなく「未完成だからこそSFCが必要」という構造を作ることが超重要。志望理由書と同様のロジック。",
          },
          {
            point: "⑤ SFCでの学習計画",
            explanation: "どの学問・どの研究手法を、どこの研究室または授業で学ぶかを具体的に記載する。その手法を自分の研究にどう使うかまで書くのが理想。総合政策と環境情報の双方の学びを入れるのも効果的。",
          },
          {
            point: "⑥ 将来ビジョン",
            explanation: "その分野でどのような存在になりたいかを示す。資料全体を通してデザインは2〜3色に統一し、文章を読まなくても全体像がつかめるよう視覚的に整理することが重要。",
          },
        ],
        notionUrl: "https://www.notion.so/b2e241b59e6d83bc8c7d01fadf56973a",
      },
    ],
  },
  {
    id: "optional",
    title: "任意提出資料 完全解説",
    shortTitle: "任意提出資料",
    icon: "📎",
    color: "from-purple-900/50 to-purple-800/30",
    accentColor: "#a855f7",
    totalLessons: 3,
    description: "「任意」と書かれているが合格者のほぼ全員が提出している。35字アピール文と連動させ、教授陣に「読みたい」と思わせる資料設計が勝負を分ける。",
    lessons: [
      {
        id: "no1",
        number: 1,
        title: "任意提出資料の概要",
        phase: "phase1",
        phaseLabel: "全体像",
        loomUrl: "https://www.loom.com/share/59dc925f33104bf7920971a161a4498d",
        slidesUrl: "https://docs.google.com/presentation/d/1MfabLTyGmGFwz3Q06XYsJj0CJyRlVwFN/edit?usp=sharing",
        description: "提出ルール・◎マークの戦略的活用・200字要約の重要性を解説。「何を・何本・どう提出するか」の全体設計を理解する。",
        keyPoints: [
          "活動記録10項目それぞれに資料を付随させられる",
          "同一資料を複数の活動項目に紐づけてよい",
          "特に見てほしい資料に「◎」を最大3つまでつけられる",
          "200字要約が「読まれる・読まれない」を決める",
        ],
        details: [
          {
            point: "提出できる量と合格者の実態",
            explanation: "最大10点まで提出可能。ただし合格者の平均は4〜6個（1個あたり平均18〜22スライド）。量より質・構造が重要で、闇雲に増やす必要はない。",
          },
          {
            point: "提出方法と注意点",
            explanation: "オンライン出願システムへのアップロードのみ。郵送された資料は出願書類として扱われないので絶対に印刷して送らないこと。",
          },
          {
            point: "優先順位の付け方",
            explanation: "自身で重要だと判断した順に1番から登録する（番号1が最も優先度高く見られる）。特に見てほしい資料には「◎」を最大3つまで付けられる。",
          },
          {
            point: "200字要約の重要性",
            explanation: "各資料に日本語200字以内・英語400字以内の要約が必須。この要約が「読まれるか読まれないか」を決める。活動報告書 完全解説で詳しく解説済み。",
          },
          {
            point: "提出形式と容量制限",
            explanation: "JPEG・PDF・動画ファイル（mp4等）が提出可能。1ファイル10MB以下・全体50MB以下。PDFはA4サイズで作成し、複数ページにはできるだけページ番号を付ける。",
          },
          {
            point: "資格・表彰状・レポートの扱い",
            explanation: "語学スコアや表彰状は原本をPDF/JPEG化してアップロード。正課のレポートはA4一枚に概要をまとめ課題提示者の講評を含める。選考を伴うものは結果だけでなく募集要項や選考過程（努力・挫折・成功の過程）も提出することが推奨されている。",
          },
        ],
        notionUrl: "https://www.notion.so/5aa241b59e6d83419be501b84360b7c8",
      },
      {
        id: "no2",
        number: 2,
        title: "探究に関する任意提出資料の本質",
        phase: "phase2",
        phaseLabel: "設計手順",
        loomUrl: "https://www.loom.com/share/8360df2dc57942029d076615cf9b6b3f",
        slidesUrl: "https://docs.google.com/presentation/d/1uDf8WOI5hxEo-WjmPsRLNktDJbd7T8Qa/edit?usp=sharing",
        description: "SFCが最も評価する「探究型資料」の本質と、スライド型・論文型それぞれの構成設計を解説。合格者の資料構成パターンを完全公開。",
        keyPoints: [
          "探究活動 → スライド型資料 or 論文型資料（◎推奨）",
          "留学 → 留学レポート・語学資格証明",
          "学業 → 成績・奨学金等の資料",
          "課外活動 → 実績をまとめた資料",
        ],
        details: [
          {
            point: "任意提出資料の本質",
            explanation: "任意提出資料は「実績の提出」ではない。それは自分という人間の思考構造を証明する研究報告書である。合格者は賞状・資格・活動写真を並べるのではなく、「なぜその活動を行ったのか」「何を問い・どう検証し・どこまで深めたか」という思考の軌跡を提出している。",
          },
          {
            point: "① 原体験",
            explanation: "その探究に向かわせた原体験・きっかけを示す。活動の紹介から始めるのではなく、必ず「問い」から始まるのが合格者資料の共通点。",
          },
          {
            point: "② 違和感・問題意識",
            explanation: "原体験から生まれた違和感や問題意識を具体的に言語化する。なぜそれが社会的に重要な問題なのかも合わせて示す。",
          },
          {
            point: "③ 問いの設定",
            explanation: "文献調査やフィールドワークを通して形成された「問い」を設定する。単なる疑問ではなく、調査・探究の結果として深化した問いであることが重要。",
          },
          {
            point: "④ 新しい解決策",
            explanation: "自分の解決策がなぜ良いのかを論理的に説明する。独自性と根拠を明確にすることで「研究者になり得る思考回路」を示す。",
          },
          {
            point: "⑤ 検証・行動",
            explanation: "新解決策がどの程度通用するかを実践段階で示す。インタビュー・実験・外部連携・専門家との対話など、必ず仮説と検証が存在することが合格者の共通点。",
          },
          {
            point: "⑥ データ・客観性",
            explanation: "検証の際にデータを取れていればここで掲載する。インタビューの数値化・グラフ化は審査官への説得力を大幅に高める。",
          },
          {
            point: "⑦ 現状の課題と社会実装の可能性",
            explanation: "現状の新解決策における課題と、それを社会実装した際の期待値を述べる。「未完成だからこそSFCが必要」という構造に接続する。",
          },
          {
            point: "⑧ SFCでの深化",
            explanation: "どの学問・どの研究手法をどこの研究室または授業で学ぶかを具体的に記載する。現状の解決策の限界をSFCの施設・教員を使ってどう打開するかを提示することが理想。",
          },
        ],
        notionUrl: "https://www.notion.so/afe241b59e6d836a8f86015a37ac7442",
      },
      {
        id: "no3",
        number: 3,
        title: "デザイン原則",
        phase: "phase2",
        phaseLabel: "設計手順",
        loomUrl: "https://www.loom.com/share/6873a57d960d45908317e995d1ef4e64",
        slidesUrl: "https://docs.google.com/presentation/d/1acfkFm56l-aN_g_3n-zEOFoRrJ1ztsFa/edit?usp=sharing",
        description: "審査官が「読みたくなる」資料のデザイン原則と、200字要約で「謎を残す」書き方を解説。",
        keyPoints: [
          "審査官が「読みたくなる」デザイン原則",
          "200字要約で「謎を残す」書き方",
          "資料の見た目と要約の構造の重要性",
        ],
        details: [
          {
            point: "① オブジェクトを揃える",
            explanation: "オブジェクト間隔がバラバラだったりテキストの先頭位置が微妙にズレていると、読み手の脳に「なぜズレているのか」という余計な負荷を与える。左揃え・中央揃えを徹底し、各テキストボックスの左端を揃えるだけで一気に読みやすくなる。写真も統一したサイズ・場所に貼ること。",
          },
          {
            point: "② 余白を持たせる",
            explanation: "情報が詰まりすぎると情報にメリハリが出ず、読み手の視線を誘導できない。余白は「何も書かれていない空間」ではなく、読み手の視線を動かすための設計要素。",
          },
          {
            point: "③ 情報の階層化",
            explanation: "テキストの大きさ・色の濃さ・太さなどフォントのデザインで情報の優先度を明示する。大見出し・中見出し・小見出しをつけて、見た瞬間（3秒以内）に情報処理できるよう設計することが目標。",
          },
          {
            point: "④ 余計な情報は目立たせない",
            explanation: "すべての情報を同じ強さで見せると、何が重要かわからなくなる。強調したい情報だけを色・太字・サイズで際立たせ、補足情報は控えめなデザインに。",
          },
          {
            point: "⑤ 情報の図式化",
            explanation: "情報の構造がわかりにくいと「これとこれの関係性は？対比なの？並列なの？」と脳に余計な負荷がかかる。関係性を図解に落とし込むことで、文章を読まなくても全体像がつかめる資料になる。",
          },
          {
            point: "⑥ 写真は右側にまとめる",
            explanation: "人の視線と脳は左から右に情報を処理することに慣れている。最も印象付けたい活動時の写真を右側に揃えるのが効果的。写真の上部にタイトルをつけることも重要。1スライド1メッセージを意識して内容を絞ると一貫性が生まれる。",
          },
        ],
        notionUrl: "https://www.notion.so/b68241b59e6d829f823601dfc9e4254e",
      },
    ],
  },
];

export function getCourse(courseId: string): Course | undefined {
  return courses.find((c) => c.id === courseId);
}

export function getLesson(courseId: string, lessonId: string): Lesson | undefined {
  const course = getCourse(courseId);
  return course?.lessons.find((l) => l.id === lessonId);
}

export function getLoomVideoId(shareUrl: string): string | null {
  if (!shareUrl) return null;
  const match = shareUrl.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export function getLoomEmbedUrl(shareUrl: string): string {
  if (!shareUrl) return "";
  return shareUrl.replace("loom.com/share/", "loom.com/embed/");
}

export function getSlidesEmbedUrl(editUrl: string): string {
  if (!editUrl) return "";
  return editUrl.replace("/edit", "/embed");
}
