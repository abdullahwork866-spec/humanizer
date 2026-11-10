# Humanizer (Netlify)

Files:
- index.html          dashboard (two buttons: Humanize / Humanize with AI)
- dictionary.js       offline dictionary humanizer (no API)
- netlify/functions/humanize-ai.mjs   Gemini proxy (key stays on server)
- netlify.toml        Netlify config

## Deploy steps
1. Get a Gemini key: https://aistudio.google.com/apikey
2. Push this folder to GitHub and import it in Netlify (or drag-drop the folder in Netlify Deploys; use Git/CLI if drag-drop skips functions).
3. In Netlify: Site configuration -> Environment variables -> add
   GEMINI_API_KEY = your key
   (optional) GEMINI_MODEL = gemini-2.5-flash
4. Trigger a new deploy so the variable is picked up.
5. Open the site and test both buttons.

Never put the key in index.html or any front-end JS.
