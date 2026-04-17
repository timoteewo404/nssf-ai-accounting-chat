# NSSF AI Accounting Chat

A static Puter chat UI that can be hosted on Vercel or Puter Playground.

## Vercel deployment

- This repo includes the static site under `puter-chat-ui/`.
- Vercel uses `vercel.json` to route `/` to `puter-chat-ui/index.html`.
- Deploy the repository on Vercel and the `puter-chat-ui` site will be served as the app.

## Important note

This app depends on Puter browser runtime APIs:

- `https://js.puter.com/v2/`
- `puter.ai.chat(...)`
- `puter.auth`

Vercel can host the files, but the chat will only work if the Puter client supports loading from an external origin.

## Puter Playground deploy

If you want to deploy directly to Puter Playground, use `puter-chat-ui/deploy.js`.
