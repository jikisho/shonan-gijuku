"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";

// ワーカー：public/ から配信
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [blobUrl, setBlobUrl]     = useState<string | null>(null);
  const [fetchErr, setFetchErr]   = useState<string | null>(null);
  const [numPages, setNumPages]   = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const containerRef              = useRef<HTMLDivElement>(null);

  // ── PDF を fetch → blob URL に変換（CORS / worker 問題を回避）──
  useEffect(() => {
    let objUrl: string | null = null;
    setBlobUrl(null);
    setFetchErr(null);
    setNumPages(0);

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.blob();
      })
      .then((blob) => {
        objUrl = URL.createObjectURL(blob);
        setBlobUrl(objUrl);
      })
      .catch((e) => setFetchErr(String(e)));

    return () => {
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [url]);

  // ── コンテナ幅を監視 ──────────────────────────────────────────
  useEffect(() => {
    const update = () => {
      if (containerRef.current) setPageWidth(containerRef.current.clientWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-[oklch(0.08_0.012_265)]"
      style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
    >
      {/* エラー */}
      {fetchErr && (
        <div className="flex items-center justify-center py-20 text-red-400/70 text-sm px-4 text-center">
          PDF の読み込みに失敗しました
        </div>
      )}

      {/* ローディング */}
      {!blobUrl && !fetchErr && (
        <div className="flex items-center justify-center py-20 text-white/30 text-sm">
          読み込み中...
        </div>
      )}

      {/* PDF 描画 */}
      {blobUrl && (
        <Document
          file={blobUrl}
          onLoadSuccess={({ numPages: n }) => setNumPages(n)}
          onLoadError={(e) => setFetchErr(String(e))}
          loading={null}
          error={null}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={pageWidth > 0 ? pageWidth : undefined}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="mb-1"
            />
          ))}
        </Document>
      )}
    </div>
  );
}
