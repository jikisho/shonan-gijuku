"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FadeIn, FadeInList } from "@/components/PageMotion";
import { FileText, ChevronRight, ArrowLeft, X, ExternalLink } from "lucide-react";

const CATEGORIES = [
  { id: "志望理由書", label: "志望理由書", emoji: "📝", color: "blue" },
  { id: "任意提出資料", label: "任意提出資料", emoji: "📎", color: "amber" },
  { id: "自由記述", label: "自由記述", emoji: "✏️", color: "purple" },
];

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
            return {
              name: f.name.replace(/\.[^/.]+$/, ""),
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
          <a
            href={selectedFile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            別タブで開く
          </a>
        </div>
        <iframe
          src={selectedFile.url}
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
