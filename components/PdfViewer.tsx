"use client";

import { useEffect, useRef, useState } from "react";

// pdfjs v4 を CDN から読み込む（UMD ビルド = webpack を迂回できる）
// v4 はクラシックワーカーなので ESM 問題なし
const PDFJS_SRC    = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/build/pdf.min.js";
const PDFJS_WORKER = "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/build/pdf.worker.min.js";

declare global {
  interface Window { pdfjsLib: any }
}

function loadPdfJs(): Promise<any> {
  if (typeof window !== "undefined" && window.pdfjsLib) {
    return Promise.resolve(window.pdfjsLib);
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PDFJS_SRC;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      resolve(window.pdfjsLib);
    };
    script.onerror = () => reject(new Error("pdfjs CDN 読み込み失敗"));
    document.head.appendChild(script);
  });
}

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const outerRef    = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "error" | "done">("loading");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setErrMsg("");
    if (canvasRef.current) canvasRef.current.innerHTML = "";

    (async () => {
      try {
        const pdfjs = await loadPdfJs();

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = await res.arrayBuffer();
        if (cancelled) return;

        const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;
        if (cancelled || !canvasRef.current || !outerRef.current) return;

        setStatus("done");
        canvasRef.current.innerHTML = "";

        const w = outerRef.current.clientWidth || window.innerWidth;

        for (let i = 1; i <= pdf.numPages; i++) {
          if (cancelled) break;

          const page = await pdf.getPage(i);
          const vp0  = page.getViewport({ scale: 1 });
          const vp   = page.getViewport({ scale: w / vp0.width });

          const canvas       = document.createElement("canvas");
          canvas.width       = Math.floor(vp.width);
          canvas.height      = Math.floor(vp.height);
          canvas.style.cssText = "display:block;width:100%;margin-bottom:4px;";
          canvas.addEventListener("contextmenu", e => e.preventDefault());

          canvasRef.current!.appendChild(canvas);

          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport: vp,
          }).promise;
        }
      } catch (e) {
        if (!cancelled) {
          setErrMsg(String(e));
          setStatus("error");
        }
      }
    })();

    return () => { cancelled = true; };
  }, [url]);

  return (
    <div
      ref={outerRef}
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: "auto",
        background: "#0f172a",
        // @ts-ignore
        WebkitOverflowScrolling: "touch",
      }}
    >
      {status === "loading" && (
        <div style={{ padding: 24, color: "#6b7280", fontSize: 14 }}>
          読み込み中...
        </div>
      )}
      {status === "error" && (
        <div style={{ padding: 24, color: "#f87171", fontSize: 14 }}>
          <p>PDF の読み込みに失敗しました</p>
          <p style={{ fontSize: 12, marginTop: 8, opacity: 0.6, wordBreak: "break-all" }}>{errMsg}</p>
        </div>
      )}
      <div ref={canvasRef} />
    </div>
  );
}
