"use client";

import { useEffect, useRef, useState } from "react";

/**
 * pdfjs v5 のワーカーは ESM (.mjs) のみ提供。
 * workerSrc に文字列を渡すと pdfjs 内部で type:"module" で起動するが、
 * workerPort に Worker インスタンスを直接渡す方が確実。
 * シングルトンで保持し使い回す。
 */
let _pdfWorker: Worker | null = null;
function getPdfWorker(): Worker {
  if (!_pdfWorker) {
    _pdfWorker = new Worker("/pdf.worker.min.mjs", { type: "module" });
  }
  return _pdfWorker;
}

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const outerRef     = useRef<HTMLDivElement>(null); // 幅計測用
  const canvasRef    = useRef<HTMLDivElement>(null); // canvas 追加先
  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setErrMsg("");
    if (canvasRef.current) canvasRef.current.innerHTML = "";

    (async () => {
      try {
        // ブラウザ専用のため動的 import
        const pdfjs = await import("pdfjs-dist");

        // モジュールワーカーを workerPort に設定
        pdfjs.GlobalWorkerOptions.workerPort = getPdfWorker();

        // Supabase 署名 URL を fetch → ArrayBuffer（CORS 回避）
        const res = await fetch(url);
        if (!res.ok) throw new Error(`fetch failed: HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        if (cancelled) return;

        const pdf = await pdfjs
          .getDocument({ data: new Uint8Array(buf) })
          .promise;
        if (cancelled) return;

        setStatus("done");

        const container = canvasRef.current;
        if (!container) return;
        container.innerHTML = "";

        // 幅は outer コンテナから取得（canvasRef は空なので 0 になる場合がある）
        const w =
          outerRef.current?.clientWidth ||
          container.parentElement?.clientWidth ||
          window.innerWidth;

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) break;

          const page = await pdf.getPage(i);
          const vp0  = page.getViewport({ scale: 1 });
          const vp   = page.getViewport({ scale: w / vp0.width });

          const canvas       = document.createElement("canvas");
          canvas.width       = Math.floor(vp.width);
          canvas.height      = Math.floor(vp.height);
          canvas.style.cssText = "display:block;width:100%;margin-bottom:4px;";

          // コピー保護：右クリック・長押しコンテキストメニューを無効化
          canvas.addEventListener("contextmenu", (e) => e.preventDefault());

          container.appendChild(canvas);

          await page.render({
            canvasContext: canvas.getContext("2d")!,
            viewport: vp,
            canvas,
          }).promise;
        }
      } catch (e) {
        if (!cancelled) {
          setErrMsg(String(e));
          setStatus("error");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div
      ref={outerRef}
      className="flex-1 overflow-y-auto bg-[oklch(0.08_0.012_265)]"
      style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
    >
      {status === "loading" && (
        <div className="flex items-center justify-center py-20 text-white/30 text-sm">
          読み込み中...
        </div>
      )}
      {status === "error" && (
        <div className="p-6 text-center">
          <p className="text-red-400/70 text-sm mb-2">
            PDF の読み込みに失敗しました
          </p>
          <p className="text-xs text-white/20 break-all">{errMsg}</p>
        </div>
      )}
      {/* canvas はここに追加される（常時 DOM に存在） */}
      <div ref={canvasRef} />
    </div>
  );
}
