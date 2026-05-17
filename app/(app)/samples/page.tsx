"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FadeIn, FadeInList } from "@/components/PageMotion";
import { FileText, ChevronRight, ArrowLeft, ShieldAlert, FolderOpen } from "lucide-react";

const CATEGORIES = [
  { id: "statement",    label: "志望理由書",   emoji: "📝", color: "blue" },
  { id: "optional",     label: "任意提出資料", emoji: "📎", color: "amber" },
  { id: "free-writing", label: "自由記述",     emoji: "✏️", color: "purple" },
];

// 丸数字配列（0 は使わない）
const CIRCLED = ["","①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩","⑪","⑫","⑬","⑭","⑮"];

// 人物ごとのファイル表示名マッピング（Notion 元ファイル名に対応）
const PERSON_FILE_NAMES: Record<string, Record<string, string>> = {
  // 中村直承：Notion サブページ名そのまま
  "01_nakamura": {
    "01_jake":         "Jake（ロボット研究）",
    "02_chiho-sousei": "地方創生",
    "03_crowdfunding": "クラファン失敗",
    "04_shogi":        "将棋",
    "05_sfc":          "SFCで学びたいこと",
    "06_eigo-benron":  "英語弁論大会",
    "07_ojichan":      "対談",
    "08_tshirt":       "Tシャツ作成",
  },
  // 篠部虹人：①〜④⑦⑧⑨（⑤⑥はGDrive埋め込みで取得不可）
  "02_shinobe": {
    "01": "任意提出資料①",
    "02": "任意提出資料②",
    "03": "任意提出資料③",
    "04": "任意提出資料④",
    "05": "任意提出資料⑦",
    "06": "任意提出資料⑧",
    "07": "任意提出資料⑨",
  },
  // 山田雄生：①②はGDrive埋め込みで取得不可、③〜⑤のみ
  "03_yamada-yuki": {
    "01": "任意提出資料③（留学・勉強・課外活動等）",
    "02": "任意提出資料④",
    "03": "任意提出資料⑤（学業編）",
  },
  // 國本涼太：Notion元ファイル名が 1.pdf,2.pdf,4.pdf,5.pdf（③なし）
  "04_kunimoto": {
    "01": "資料①",
    "02": "資料②",
    "03": "資料④",
    "04": "資料⑤",
  },
  // 土門達洋
  "05_domon": {
    "01": "任意提出１",
    "02": "任意提出書類２",
  },
  // 田坂絋太郎
  "08_tasaka": {
    "01": "研究活動",
    "02": "外部活動",
    "03": "インド生活",
    "04": "英語",
  },
  // 山城力：ZIPは展開してポートフォリオとしてアップ
  "10_yamashiro": {
    "01_portfolio": "私の演劇人生",
    "02":           "幼少期の冒険",
  },
  // 藤原春愛：説明付きファイル名から主要部分を抽出
  "11_fujiwara": {
    "01": "ワークショップの開催",
    "02": "声楽の全国大会で入賞",
    "03": "ミュージカルの主役を務めた経験",
    "04": "音楽部での活動実績",
    "05": "ミュージカル製作・演出の経験",
    "06": "音楽科学を通じた観光発展",
    "07": "習い事で培った経験",
    "08": "様々な分野での活動",
  },
  // 大河原颯
  "12_ogawara": {
    "01": "研究資料",
    "02": "Achievement資料",
  },
  // 吉村隆志
  "14_yoshimura": {
    "01": "インタビュー",
    "02": "企画書",
    "03": "資格",
    "04": "大学講義",
    "05": "探求活動",
    "06": "部活動",
  },
  // 山田 周
  "15_yamada-shu": {
    "01": "任意①",
    "02": "任意②",
    "03": "任意③",
    "04": "任意④",
    "05": "任意⑤",
  },
};

// ファイルサイズ整形
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MiB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GiB`;
}

// Supabase Storage は日本語パスを受け付けないので ASCII → 表示名にマッピング
const NAME_MAP: Record<string, string> = {
  // 志望理由書
  "01_nakamura-naotsugi": "中村直承",
  "02_shinobe-nijito":    "篠部虹人",
  "03_yamada-yusei":      "山田雄生",
  "04_kunimoto-ryota":    "國本涼太",
  "05_domon-tatsuhiro":   "土門達洋",
  "06_takashima-yuta":    "高嶋雄太",
  "07_takeda-kazuharu":   "竹田一遥",
  "08_tasaka-kotaro":     "田坂絋太郎",
  "09_sasada-naohiro":    "笹田尚寛",
  "10_yamashiro-chikara": "山城力",
  "11_fujiwara-harua":    "藤原春愛",
  "12_okawara-so":        "大河原颯",
  "13_nakao-hitoshi":     "中尾仁",
  "14_yoshimura-takashi": "吉村隆志",
  "15_yamada-shu":        "山田周",
  // 任意提出資料（人物フォルダ名 — statement と重複しないキーのみ）
  "01_nakamura":    "中村直承",
  "02_shinobe":     "篠部虹人",
  "03_yamada-yuki": "山田雄生",
  "04_kunimoto":    "國本涼太",
  "05_domon":       "土門達洋",
  "08_tasaka":      "田坂絋太郎",
  "10_yamashiro":   "山城力",
  "11_fujiwara":    "藤原春愛",
  "12_ogawara":     "大河原颯",
  "14_yoshimura":   "吉村隆志",
};

// 任意提出資料の人物フォルダ一覧（Supabase のサブフォルダ構造）
const OPTIONAL_PERSONS = [
  "01_nakamura", "02_shinobe", "03_yamada-yuki", "04_kunimoto",
  "05_domon", "08_tasaka", "10_yamashiro", "11_fujiwara",
  "12_ogawara", "14_yoshimura", "15_yamada-shu",
];

// ファイル表示名：人物ごとのマッピング → 任意提出資料①② → 素のベース名
function fileDisplayName(filename: string, person?: string): string {
  const base = filename.replace(/\.[^/.]+$/, "");
  // 人物別マッピング優先
  if (person && PERSON_FILE_NAMES[person]?.[base]) return PERSON_FILE_NAMES[person][base];
  // 汎用フォールバック（"01" → "任意提出資料①"）
  const num = parseInt(base, 10);
  if (!isNaN(num)) return `任意提出資料${CIRCLED[num] ?? num}`;
  return base;
}

const colorMap: Record<string, string> = {
  blue:   "bg-blue-500/15 text-blue-400 border-blue-500/20",
  amber:  "bg-amber-500/15 text-amber-400 border-amber-500/20",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

interface FileItem {
  name: string;
  path: string;
  url: string;
  size?: number;
}

export default function SamplesPage() {
  const supabase = createClient();

  // ナビゲーション状態
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson]     = useState<string | null>(null);


  // データ
  const [catFiles, setCatFiles]       = useState<Record<string, FileItem[]>>({});
  const [catLoading, setCatLoading]   = useState<Record<string, boolean>>({
    statement: true, optional: false, "free-writing": true,
  });
  const [personFiles, setPersonFiles] = useState<FileItem[]>([]);
  const [personLoading, setPersonLoading] = useState(false);

  // statement / free-writing のファイルを初回ロード
  useEffect(() => {
    (["statement", "free-writing"] as const).forEach(async (catId) => {
      const { data } = await supabase.storage.from("samples").list(catId, {
        limit: 100, sortBy: { column: "name", order: "asc" },
      });
      if (!data) { setCatLoading((p) => ({ ...p, [catId]: false })); return; }

      const files: FileItem[] = await Promise.all(
        data
          .filter((f) => f.name !== ".emptyFolderPlaceholder")
          .map(async (f) => {
            const { data: url } = await supabase.storage
              .from("samples")
              .createSignedUrl(`${catId}/${f.name}`, 3600);
            const base = f.name.replace(/\.[^/.]+$/, "");
            return { name: NAME_MAP[base] ?? base, path: `${catId}/${f.name}`, url: url?.signedUrl ?? "" };
          })
      );
      setCatFiles((p) => ({ ...p, [catId]: files }));
      setCatLoading((p) => ({ ...p, [catId]: false }));
    });
  }, []);

  // 人物フォルダのファイルをロード（optional 用）
  const loadPersonFiles = async (person: string) => {
    setPersonLoading(true);
    setPersonFiles([]);
    const { data } = await supabase.storage.from("samples").list(`optional/${person}`, {
      limit: 50, sortBy: { column: "name", order: "asc" },
    });
    if (!data) { setPersonLoading(false); return; }

    const files: FileItem[] = await Promise.all(
      data
        .filter((f) => f.name !== ".emptyFolderPlaceholder")
        .map(async (f) => {
          const { data: url } = await supabase.storage
            .from("samples")
            .createSignedUrl(`optional/${person}/${f.name}`, 3600);
          return {
            name: fileDisplayName(f.name, person),
            path: `optional/${person}/${f.name}`,
            url: url?.signedUrl ?? "",
            size: (f as any).metadata?.size as number | undefined,
          };
        })
    );
    setPersonFiles(files);
    setPersonLoading(false);
  };

  const activeCat = CATEGORIES.find((c) => c.id === selectedCategory);

  // 全カテゴリ共通：新しいタブで PDF を開く
  const handleFileClick = (file: FileItem) => window.open(file.url, "_blank");

  // ── 任意提出資料：ファイル一覧（人物内）──────────────────────
  if (selectedCategory === "optional" && selectedPerson) {
    const personName = NAME_MAP[selectedPerson] ?? selectedPerson;
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <button
          onClick={() => { setSelectedPerson(null); setPersonFiles([]); }}
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          任意提出資料に戻る
        </button>

        <FadeIn className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📎</span>
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
                {personName}
              </h1>
              <p className="text-sm text-white/40">任意提出資料</p>
            </div>
          </div>
        </FadeIn>

        {personLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-white/3 animate-pulse" />)}
          </div>
        ) : personFiles.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">ファイルがありません</div>
        ) : (
          <div className="space-y-2">
            {personFiles.map((file, i) => (
              <FadeInList key={file.path} index={i}>
                <button
                  onClick={() => handleFileClick(file)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl glass-card hover:border-white/12 transition-all cursor-pointer group text-left"
                >
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${colorMap["amber"]}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                      {file.name}
                    </p>
                    {file.size != null && (
                      <p className="text-xs text-white/30 mt-0.5">{formatSize(file.size)}</p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                </button>
              </FadeInList>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── 任意提出資料：人物一覧 ────────────────────────────────────
  if (selectedCategory === "optional") {
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <button
          onClick={() => setSelectedCategory(null)}
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          合格者資料に戻る
        </button>

        <FadeIn className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📎</span>
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
                任意提出資料
              </h1>
              <p className="text-sm text-white/40">合格者資料 · {OPTIONAL_PERSONS.length}名 51資料</p>
            </div>
          </div>
        </FadeIn>

        <div className="space-y-2">
          {OPTIONAL_PERSONS.map((person, i) => (
            <FadeInList key={person} index={i}>
              <button
                onClick={() => {
                  setSelectedPerson(person);
                  loadPersonFiles(person);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-xl glass-card hover:border-white/12 transition-all cursor-pointer group text-left"
              >
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${colorMap["amber"]}`}>
                  <FolderOpen className="w-4 h-4" />
                </div>
                <p className="text-sm font-medium text-white/80 flex-1 group-hover:text-white transition-colors">
                  {NAME_MAP[person] ?? person}
                </p>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
              </button>
            </FadeInList>
          ))}
        </div>
      </div>
    );
  }

  // ── statement / free-writing：ファイル一覧 ────────────────────
  if (selectedCategory && activeCat) {
    const files  = catFiles[selectedCategory] ?? [];
    const loading = catLoading[selectedCategory] ?? false;
    return (
      <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <button
          onClick={() => setSelectedCategory(null)}
          className="inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          合格者資料に戻る
        </button>

        <FadeIn className="mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeCat.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
                {activeCat.label}
              </h1>
              <p className="text-sm text-white/40">合格者資料</p>
            </div>
          </div>
        </FadeIn>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 rounded-xl bg-white/3 animate-pulse" />)}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">まだファイルがアップロードされていません</div>
        ) : (
          <div className="space-y-2">
            {files.map((file, i) => (
              <FadeInList key={file.path} index={i}>
                <button
                  onClick={() => handleFileClick(file)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl glass-card hover:border-white/12 transition-all cursor-pointer group text-left"
                >
                  <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${colorMap[activeCat.color]}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-medium text-white/80 flex-1 group-hover:text-white transition-colors">
                    {file.name}
                  </p>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                </button>
              </FadeInList>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── カテゴリ一覧（トップ）──────────────────────────────────────
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <FadeIn className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-serif)" }}>
          合格者資料
        </h1>
        <p className="text-sm text-white/40">実際の合格者の志望理由書・任意提出資料・自由記述を閲覧できます</p>
      </FadeIn>

      <FadeIn className="mb-6">
        <div className="flex gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/8">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-bold text-red-400">取り扱い厳重注意</p>
            <p className="text-xs text-white/50 leading-relaxed">
              本資料は合格者本人の許可のもと、受講生の学習目的に限り共有しています。スクリーンショット・印刷・転載・第三者への共有は固く禁止します。情報漏洩が判明した場合は塾との契約を即時解除し、法的措置を講じる場合があります。
            </p>
          </div>
        </div>
      </FadeIn>

      <div className="space-y-3">
        {CATEGORIES.map((cat, i) => {
          let countLabel = "読み込み中...";
          if (cat.id === "optional") {
            countLabel = `${OPTIONAL_PERSONS.length}名 51資料`;
          } else if (cat.id === "free-writing") {
            countLabel = catLoading[cat.id] ? "読み込み中..." : "14名 28資料";
          } else {
            countLabel = catLoading[cat.id]
              ? "読み込み中..."
              : `${catFiles[cat.id]?.length ?? 0} 件`;
          }

          return (
            <FadeInList key={cat.id} index={i}>
              <button
                onClick={() => setSelectedCategory(cat.id)}
                className="w-full flex items-center gap-4 p-5 rounded-2xl glass-card hover:border-white/12 transition-all cursor-pointer group text-left"
              >
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 text-xl ${colorMap[cat.color]}`}>
                  {cat.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white group-hover:text-white/90">{cat.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{countLabel}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
              </button>
            </FadeInList>
          );
        })}
      </div>
    </div>
  );
}
