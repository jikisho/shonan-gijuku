"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FadeIn, FadeInList } from "@/components/PageMotion";
import { FileText, ChevronRight, ArrowLeft, X, ShieldAlert } from "lucide-react";

const CATEGORIES = [
  { id: "statement", label: "志望理由書", emoji: "📝", color: "blue" },
  { id: "optional", label: "任意提出資料", emoji: "📎", color: "amber" },
  { id: "free-writing", label: "自由記述", emoji: "✏️", color: "purple" },
];

// Supabase Storage doesn't support Japanese in paths, so we map ASCII names → display names
const NAME_MAP: Record<string, string> = {
  "01_nakamura-naotsugi": "中村直承",
  "02_shinobe-nijito":    "篠部虹人",
  "03_yamada-yusei":      "山田雄生",
  "04_kunimoto-ryota":    "國本涼太",
  "05_domon-tatsuhiro":   "土門達洋",
  "06_takashima-yuta":    "高嶋雄太",
  "07_takeda-kazuharu":   "竹田一遥",
  "08_tasaka-kotaro":     "田坂孝太郎",
  "09_sasada-naohiro":    "笹田尚寛",
  "10_yamashiro-chikara": "山城力",
  "11_fujiwara-harua":    "藤原春愛",
  "12_okawara-so":        "大河原颯",
  "13_nakao-hitoshi":     "中尾仁",
  "14_yoshimura-takashi": "吉村隆志",
  "15_yamada-shu":        "山田周",
};

const colorMap: Record<string, string> = {
  blue:   "bg-blue-500/15 text-blue-400 border-blue-500/20",
  amber:  "bg-amber-500/15 text-amber-400 border-amber-500/20",
  purple: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

interface FileItem {
  name: string;
  path: string;
  url: string;
}

interface CategoryData {
  id: string;
  files: FileItem[];
  loading: boolean;
}

export default function SamplesPage() {
  const [categories, setCategories] = useState<CategoryData[]>(
    CATEGORIES.map((c) => ({ id: c.id, files: [], loading: true }))
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const supabase = createClient();

  useEffect(() => {
    CATEGORIES.forEach(async (cat) => {
      const { data, error } = await supabase.storage.from("samples").list(cat.id, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

      if (error || !data) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, loading: false } : c))
        );
        return;
      }

      const files: FileItem[] = await Promise.all(
        data
          .filter((f) => f.name !== ".emptyFolderPlaceholder")
          .map(async (f) => {
            const { data: urlData } = await supabase.storage
              .from("samples")
              .createSignedUrl(`${cat.id}/${f.name}`, 3600);
            const baseName = f.name.replace(/\.[^/.]+$/, "");
            return {
              name: NAME_MAP[baseName] ?? baseName,
              path: `${cat.id}/${f.name}`,
              url: urlData?.signedUrl ?? "",
            };
          })
      );

      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, files, loading: false } : c))
      );
    });
  }, []);

  const activeCat = CATEGORIES.find((c) => c.id === selectedCategory);
  const activeCatData = categories.find((c) => c.id === selectedCategory);

  // PDF viewer
  if (selectedFile) {
    return (
      <div className="flex flex-col h-screen bg-[oklch(0.08_0.012_265)]">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-[oklch(0.09_0.012_265)] shrink-0">
          <button
            onClick={() => setSelectedFile(null)}
            className="p-1.5 text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <p className="text-sm font-medium text-white/80 flex-1 truncate">{selectedFile.name}</p>
        </div>
        <iframe
          src={`${selectedFile.url}#toolbar=0&navpanes=0&scrollbar=1`}
          className="flex-1 w-full border-0"
          title={selectedFile.name}
        />
      </div>
    );
  }

  // ファイル一覧
  if (selectedCategory && activeCat) {
    const catData = activeCatData;
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

        {catData?.loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-white/3 animate-pulse" />
            ))}
          </div>
        ) : catData?.files.length === 0 ? (
          <div className="text-center py-20 text-white/30 text-sm">
            まだファイルがアップロードされていません
          </div>
        ) : (
          <div className="space-y-2">
            {catData?.files.map((file, i) => (
              <FadeInList key={file.path} index={i}>
                <button
                  onClick={() => setSelectedFile(file)}
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

  // カテゴリ一覧
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
          const catData = categories.find((c) => c.id === cat.id);
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
                  <p className="text-xs text-white/40 mt-0.5">
                    {catData?.loading ? "読み込み中..." : `${catData?.files.length ?? 0} 件`}
                  </p>
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
