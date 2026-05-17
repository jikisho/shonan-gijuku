"use client";

import { useEffect, useRef, useState } from "react";

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const outerRef  = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState("init");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    setPhase("effect-start");

    (async () => {
      try {
        setPhase("importing-pdfjs");
        const pdfjs = await import("pdfjs-dist");

        setPhase("creating-worker");
        const worker = new Worker("/pdf.worker.min.mjs", { type: "module" });
        pdfjs.GlobalWorkerOptions.workerPort = worker;

        setPhase("fetching-pdf");
        const res = await fetch(url);
        if (!res.ok) throw new Error(`fetch: HTTP ${res.status}`);
        const buf = await res.arrayBuffer();

        setPhase("loading-pdf");
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;

        setPhase(`rendering-${pdf.numPages}pages`);

        const container = canvasRef.current!;
        container.innerHTML = "";
        const w = outerRef.current?.clientWidth || window.innerWidth;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const vp0 = page.getViewport({ scale: 1 });
          const vp  = page.getViewport({ scale: w / vp0.width });
          const canvas = document.createElement("canvas");
          canvas.width  = Math.floor(vp.width);
          canvas.height = Math.floor(vp.height);
          canvas.style.cssText = "display:block;width:100%;margin-bottom:4px;";
          canvas.addEventListener("contextmenu", e => e.preventDefault());
          container.appendChild(canvas);
          await page.render({ canvasContext: canvas.getContext("2d")!, viewport: vp, canvas }).promise;
        }

        setPhase("done");
        worker.terminate();
      } catch (e) {
        setErrMsg(String(e));
        setPhase("error");
      }
    })();
  }, [url]);

  return (
    <div
      ref={outerRef}
      className="flex-1 overflow-y-auto"
      style={{ background: "#111", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
    >
      {/* デバッグ：phase が常に見えるように */}
      {phase !== "done" && (
        <div style={{ padding: 16, color: phase === "error" ? "#f88" : "#aaa", fontSize: 13 }}>
          {phase === "error" ? `エラー: ${errMsg}` : `読み込み中… (${phase})`}
        </div>
      )}
      <div ref={canvasRef} />
    </div>
  );
}
