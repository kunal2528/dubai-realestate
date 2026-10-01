# HOD AI Property Advisor

A Next.js concept demo for conversational Dubai property discovery. It uses a local illustrative property dataset and deterministic matching; the AI interprets search requirements only and never supplies listings.

## Run Locally

Requirements: Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000. The app works without an OpenAI key using its local demo parser and example searches.

## Environment

`.env.local` is ignored by Git and contains the server-only settings:

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

Set `OPENAI_API_KEY` to enable structured OpenAI requirement extraction. `OPENAI_MODEL` is optional. The key is read only by the `/api/advisor` route and must not use a `NEXT_PUBLIC_` prefix. Without a key, or if the OpenAI request fails, the local parser remains available.

## Demo Behavior

- Mock listings are in `src/data/properties.js`; all listing and investment figures are illustrative.
- `src/lib/matching.js` applies deterministic weighted matching to the local dataset.
- Lead requests are stored in the browser under `hod-demo-leads`; no real CRM or database is connected.
- Images are illustrative remote Unsplash photography.

## Deploy to Vercel

Import this repository in Vercel and use the default Next.js build settings. Add `OPENAI_API_KEY` as a server-side Environment Variable in the Vercel project settings to enable OpenAI; optionally set `OPENAI_MODEL`. Redeploy after changing environment variables. Leaving the key unset keeps the demo parser active.

Verify a deployment locally with:

```bash
npm run lint
npm run build
npm run start
```

This is a proof of concept, not a source of verified listings, availability, prices, rental yields, or investment advice.
# dubai-realestate
