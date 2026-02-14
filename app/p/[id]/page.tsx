import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

interface Paste {
  content: string;
}

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const paste = (await await redis.get(`paste:${params.id}`)) as Paste | null;

  if (!paste) {
    return <h1>404 - Paste not found</h1>;
  }

  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        padding: "20px",
        fontFamily: "monospace",
      }}
    >
      {paste.content}
    </pre>
  );
}
