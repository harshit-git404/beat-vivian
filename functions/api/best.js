// Cloudflare Pages Function: GET/POST /api/best
// Keeps one record in Workers KV: the highest score ever reached on this site.
const KEY = "best";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export async function onRequestGet({ env }) {
  const rec = (await env.SCORES.get(KEY, "json")) || { best: 0, level: 0 };
  return json(rec);
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Send the score as JSON." }, 400); }
  const score = Math.floor(Number(body.score));
  const level = Math.min(999, Math.max(1, Math.floor(Number(body.level)) || 1));
  if (!Number.isFinite(score) || score < 1 || score > 10000000) return json({ error: "That score isn't valid." }, 400);

  // Light rate limit: one save per IP every 3 seconds.
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const rlKey = "rl:" + ip;
  const lastAt = Number(await env.SCORES.get(rlKey));
  if (lastAt && Date.now() - lastAt < 3000) return json({ error: "Saving too fast." }, 429);
  await env.SCORES.put(rlKey, String(Date.now()), { expirationTtl: 60 });

  const rec = (await env.SCORES.get(KEY, "json")) || { best: 0, level: 0 };
  // After a reset the record gets a new epoch; saves from devices still on the old one are ignored.
  if (rec.epoch && body.epoch !== rec.epoch) return json({ result: "stale", ...rec }, 409);
  if (score > rec.best) {
    const next = { best: score, level, epoch: rec.epoch, t: Date.now() };
    await env.SCORES.put(KEY, JSON.stringify(next));
    return json({ result: "saved", ...next });
  }
  return json({ result: "kept", ...rec });
}
