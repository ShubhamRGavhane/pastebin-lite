import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(): Promise<Response> {
  try {
    await redis.ping();
    return Response.json({ ok: true });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ ok: false }),
      { status: 500 }
    );
  }
}
