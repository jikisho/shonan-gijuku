"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// webpack5: new URL(specifier, import.meta.url) を使うとワーカーを
// 適切なチャンクとしてバンドルし、モジュール対応で起動してくれる
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus]   = useState<"loading" | "error" | "done">("loading");
  const [errMsg, setErrMsg]   = useState("");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setErrMsg("");
    if (containerRef.current) containerRef.current.innerHTML = "";

    (async () => {
      try {
        // PDF を fetch → ArrayBuffer（ワーカーが直接 URL にアクセスしない）
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        if (cancelled) return;

        // PDF ドキュメントを読み込む
        const pdf = await pdfjsLib
          .getDocument({ data: new Uint8Array(buf) })
          .promise;
        if (cancelled || !containerRef.current) return;

        setStatus("done");
        containerRef.current.innerHTML = "";

        const w =
          containerRef.current.clientWidth ||
          containerRef.current.parentElement?.clientWidth ||
          window.innerWidth;

        // 各ページを canvas に描画
        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) break;

          const page = await pdf.getPage(i);
          const vp0  = page.getViewport({ scale: 1 });
          const vp   = page.getViewport({ scale: w / vp0.width });

          const canvas       = document.createElement("canvas");
          canvas.width       = Math.floor(vp.width);
          canvas.height      = Math.floor(vp.height);
          canvas.style.cssText =
            "display:block;width:100%;margin-bottom:4px;";

          // コピー保護：右クリックメニューを無効化
          canvas.addEventListener("contextmenu", (e) => e.preventDefault());

          containerRef.current!.appendChild(canvas);

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
          <p className="text-red-400/70 text-sm">
            PDF の読み込みに失敗しました
          </p>
          <p className="text-xs mt-2 text-white/20 break-all">{errMsg}</p>
        </div>
      )}

      {/* canvas がここに追加される */}
      <div ref={containerRef} />
    </div>
  );
}
