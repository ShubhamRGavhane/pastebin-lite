"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);

  async function submit() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setResult(data.url);
  }

  return (
    <div style={{ padding: 20 }}>
      <textarea
        rows={10}
        style={{ width: "100%" }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button onClick={submit}>Create Paste</button>

      {result && (
        <p>
          Shareable URL: <a href={result}>{result}</a>
        </p>
      )}
    </div>
  );
}
