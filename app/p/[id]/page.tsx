interface PasteResponse {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
}

export default async function PastePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return <h1>404 - Paste not found or expired</h1>;
  }

  const data = (await res.json()) as PasteResponse;

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <pre style={{ whiteSpace: "pre-wrap" }}>
        {data.content}
      </pre>

      <hr />

      {data.remaining_views !== null && (
        <p>Remaining views: {data.remaining_views}</p>
      )}

      {data.expires_at && (
        <p>Expires at: {data.expires_at}</p>
      )}
    </div>
  );
}
