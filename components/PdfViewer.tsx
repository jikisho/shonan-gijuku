"use client";

import { useEffect, useState } from "react";

interface PdfViewerProps {
  url: string;
}

export default function PdfViewer({ url }: PdfViewerProps) {
  const [phase, setPhase] = useState("init");

  useEffect(() => {
    // pdfjs を一切使わず、fetch だけ試す
    setPhase("fetching");
    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.blob();
      })
      .then(blob => setPhase(`done-${Math.round(blob.size / 1024)}KB`))
      .catch(e => setPhase(`error: ${e}`));
  }, [url]);

  return (
    <div style={{
      flex: 1,
      minHeight: 0,
      background: "#1e293b",
      color: "#94a3b8",
      padding: 24,
      fontSize: 14,
      overflowY: "auto",
    }}>
      phase: {phase}
    </div>
  );
}
