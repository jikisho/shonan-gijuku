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

        setPhase("fetching");
        const res = await fetch(url);
        if (!res.ok) throw new Error(`fetch HTTP ${res.status}`);
        const buf = await res.arrayBuffer();

        setPhase("loading-doc");
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(buf) }).promise;

        setPhase(`rendering-${pdf.numPages}p`);
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
      style={{
        flex: 1,
        overflowY: "auto",
        background: "#111827",
        WebkitOverflowScrolling: "touch",
        minHeight: 0,
      }}
    >
      {phase !== "done" && (
        <div style={{
          padding: 24,
          color: phase === "error" ? "#fca5a5" : "#9ca3af",
          fontSize: 14,
          lineHeight: 1.6,
        }}>
          {phase === "error"
            ? <>❌ エラー<br />{errMsg}</>
            : <>⏳ {phase}</>
          }
        </div>
      )}
      <div ref={canvasRef} />
    </div>
  );
}
