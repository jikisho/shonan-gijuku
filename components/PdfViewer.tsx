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

  if (error) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#f87171", fontSize: 14 }}>
        PDF の読み込みに失敗しました
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: 14 }}>
        読み込み中...
      </div>
    );
  }

  return (
    // position:relative で watermark の基準にする
    // overflow は指定しない（iOS の scroll を妨げないため）
    <div style={{ flex: 1, minHeight: 0, position: "relative", display: "flex" }}>

      {/* iframe：flex:1 で親を埋める。position:absolute は使わない */}
      <iframe
        src={`${blobUrl}#toolbar=0&navpanes=0`}
        style={{
          flex: 1,
          width: "100%",
          border: "none",
          display: "block",
          minHeight: 0,
        }}
        title="PDF"
        allow="fullscreen"
      />

      {/* ウォーターマーク：pointer-events:none で操作・スクロールを通過 */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 10,
        overflow: "hidden",
      }}>
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
