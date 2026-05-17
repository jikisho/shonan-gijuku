"use client";

import { useEffect, useState } from "react";

interface PdfViewerProps {
  url: string;
}

/**
 * fetch → blob URL → iframe で表示。
 * Supabase 署名 URL は CORS ヘッダー付きで取得できるのでそのまま fetch 可能。
 * blob URL にすることでブラウザの PDF ビューアが確実に動作する。
 */
export default function PdfViewer({ url }: PdfViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let objUrl: string | null = null;
    setBlobUrl(null);
    setError(null);

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.blob();
      })
      .then((blob) => {
        objUrl = URL.createObjectURL(blob);
        setBlobUrl(objUrl);
      })
      .catch((e) => setError(String(e)));

    return () => {
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [url]);

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400/70 text-sm px-4 text-center">
        PDF の読み込みに失敗しました
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
        読み込み中...
      </div>
    );
  }

  return (
    <iframe
      src={blobUrl}
      className="flex-1 w-full border-0"
      title="PDF"
    />
  );
}
