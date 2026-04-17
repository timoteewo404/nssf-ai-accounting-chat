# Puter Liquid Glass AI Chat

A glassmorphism chat UI that uses Puter AI and can be hosted on Puter Playground.

## Files

- `index.html` — main chat page
- `styles.css` — liquid glass styling
- `app.js` — `puter.ai.chat()` integration and chat logic
- `deploy.js` — Puter Playground script that writes files and publishes the site

## Deploy to Puter Playground

1. Open the Puter Playground at https://docs.puter.com/playground/
2. Create a new playground script or app.
3. Copy and run the contents of `deploy.js` inside Puter Playground.
4. The script will create the project files and host them under a Puter subdomain.

## Manual hosting inside Puter

If you prefer to create the files manually in Puter Playground:

1. Create a new directory in the Puter filesystem.
2. Add `index.html`, `styles.css`, and `app.js`.
3. Call `puter.hosting.create(subdomain, directoryName)`.

## Deploy to Vercel

1. Connect this repository to Vercel.
2. Deploy from the repository root.
3. Vercel will use `vercel.json` to serve the static files from `puter-chat-ui/`.

> Note: The page still depends on Puter runtime APIs, so verify the Puter client works from the Vercel URL.

## Usage

- Select a model
- Enter a prompt
- Press **Send prompt**
- The AI response appears in the chat history

> Note: This page requires Puter’s environment and the `https://js.puter.com/v2/` client.
