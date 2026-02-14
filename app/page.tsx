"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? Number(ttl) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResult(data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch {
      setError("Failed to create paste");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "50px auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>Pastebin Lite</h1>

      <textarea
        placeholder="Enter your text here..."
        rows={10}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "1px solid #ccc",
          marginBottom: 10,
        }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input
          type="number"
          placeholder="TTL (seconds)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <input
          type="number"
          placeholder="Max Views"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
      </div>

      <button
        onClick={submit}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 6,
          border: "none",
          backgroundColor: "#000",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Create Paste
      </button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <strong>Shareable URL:</strong>
          <div>
            <a href={result} target="_blank">
              {result}
            </a>
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 20, color: "red" }}>
          {error}
        </div>
      )}
    </div>
  );
}
