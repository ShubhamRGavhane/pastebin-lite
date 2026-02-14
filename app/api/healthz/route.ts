import { kv } from "@vercel/kv";

export async function GET(): Promise<Response> {
  try {
    await kv.ping();
    return Response.json({ ok: true });
  } catch {
    return new Response(
      JSON.stringify({ ok: false }),
      { status: 500 }
    );
  }
}
