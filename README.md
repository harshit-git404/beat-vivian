# Beat Vivian

A brick-breaker for Saundarya. Her best score is saved on her phone and on the site,
so it stays even if she clears her browser or switches phones.

## Add the music

Put up to three mp3 files in `public/` with these exact names:

- `public/music1.mp3`
- `public/music2.mp3`
- `public/music3.mp3`

They play in order on a loop once she taps anything. Missing files are skipped. With none
present, a small built-in tune plays. Keep each file under 25 MB (Cloudflare's per-file limit).

## Deploy (free)

```bash
npx wrangler login
```
```bash
npx wrangler kv namespace create SCORES
```
Paste the printed `id` into `wrangler.toml`, then:
```bash
./build.sh && npx wrangler pages deploy
```

## Reset her score before you send the link

Your own test games count as "her" best on the live site. Clear it with:

```bash
npx wrangler kv key delete best --namespace-id=YOUR_KV_ID --remote
```

Her phone also keeps its own copy; that only matters if you tested on her phone
(then clear that site's data in the browser settings).
