"use client";

import { useEffect, useState } from "react";

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let objUrl: string | null = null;
    setBlobUrl(null);
    setError(null);

    fetch(url)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.blob(); })
      .then(blob => { objUrl = URL.createObjectURL(blob); setBlobUrl(objUrl); })
      .catch(e => setError(String(e)));

    return () => { if (objUrl) URL.revokeObjectURL(objUrl); };
  }, [url]);

  return (
    <div style={{ flex: 1, minHeight: 0, position: "relative", overflow: "hidden", background: "#111" }}>
      {/* ローディング */}
      {!blobUrl && !error && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: 14 }}>
          読み込み中...
        </div>
      )}

      {/* エラー */}
      {error && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#f88", fontSize: 14 }}>
          PDF の読み込みに失敗しました
        </div>
      )}

      {/* iframe */}
      {blobUrl && (
        <iframe
          src={`${blobUrl}#toolbar=0&navpanes=0`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
          title="PDF"
        />
      )}

      {/* ウォーターマーク（pointer-events:none でスクロール・操作は通過） */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 10, overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          inset: -200,
          display: "flex",
          flexWrap: "wrap",
          gap: "64px 40px",
          alignContent: "flex-start",
          transform: "rotate(-28deg)",
          opacity: 0.09,
        }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} style={{
              color: "#000",
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
              letterSpacing: "0.08em",
              userSelect: "none",
            }}>
              湘南義塾 受講生限定
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
