import { kv } from "@vercel/kv";

interface Paste {
  content: string;
  createdAt: number;
  expiresAt: number | null;
  maxViews: number | null;
  views: number;
}

function getNow(req: Request): number {
  const testNow = req.headers.get("x-test-now-ms");
  if (process.env.TEST_MODE === "1" && testNow) {
    return Number(testNow);
  }
  return Date.now();
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  const paste = (await kv.get(`paste:${params.id}`)) as Paste | null;

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow(req);

  if (paste.expiresAt && now > paste.expiresAt) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  paste.views += 1;
  await kv.set(`paste:${params.id}`, paste);

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null
        ? null
        : paste.maxViews - paste.views,
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
}
