import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
import { nanoid } from "nanoid";

interface CreatePasteBody {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
}

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as CreatePasteBody;
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string" || !content.trim()) {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  if (ttl_seconds !== undefined && ttl_seconds < 1) {
    return Response.json({ error: "Invalid ttl_seconds" }, { status: 400 });
  }

  if (max_views !== undefined && max_views < 1) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = nanoid();
  const now = Date.now();

  const paste = {
    content,
    createdAt: now,
    expiresAt: ttl_seconds ? now + ttl_seconds * 1000 : null,
    maxViews: max_views ?? null,
    views: 0,
  };

  await await redis.set(`paste:${id}`, paste);

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
  });
}
