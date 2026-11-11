# Deploying the portfolio

The site is static: `npm run build` writes a finished, prerendered page to `dist/`. These steps are yours to run, since nothing here has been pushed or deployed.

## Everyday commands

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm test` | Aperture geometry, skill labels, journal status and Easter-egg store tests |
| `npm run build` | Refreshes stats from LeetCode and GitHub, then builds and prerenders `dist/` |
| `npm run preview` | Serves `dist/` at http://localhost:4173 |
| `npm run images` | Re-makes web image sizes after you replace a source image |
| `npm run og` | Re-renders `public/og.jpg` and the touch icon (needs Chrome; set `CHROME_PATH` if it isn't in the default place) |

## 1. Put it on GitHub

```bash
git init
git add .
git commit -m "Portfolio v1"
```

Then create an empty repository on GitHub and push to it.

`.gitignore` leaves out `node_modules`, `dist`, `dist-ssr` and **`source-media/`**. Your original portrait (`ishan.png`) and the jersey reference photo stay on your computer only. The web-sized copies in `public/media/` are committed, so the site builds without them. Keep a backup of `source-media/` somewhere safe, because `npm run images` needs it.

## 2. Choose the address, then set it

Pick your Vercel name (for example `ishan-keshari.vercel.app`) and put it in `src/data/projects.js`:

```js
siteUrl: 'https://ishan-keshari.vercel.app',
```

The next build then adds the canonical link, `og:url` and `og:image`, so link previews show `og.jpg`. While it still says `TODO`, the build prints a warning and leaves those three tags out. Previews need absolute URLs.

## 3. Deploy on Vercel

1. Import the GitHub repository in Vercel. It detects Vite on its own.
2. Settings: build command `npm run build`, output directory `dist`. These are the defaults.
3. Every build first runs `scripts/fetch-stats.mjs`. If LeetCode or GitHub is down, the build keeps the saved numbers and never fails.

## 4. Turn on the daily stats refresh

`.github/workflows/refresh-stats.yml` refreshes `src/data/stats.json` every day at 06:00 IST and commits it when the numbers change. That commit makes Vercel rebuild.

In the GitHub repository, go to **Settings → Actions → General → Workflow permissions** and choose **Read and write permissions**, so the workflow can push. You can also run it by hand from the **Actions** tab.

### Optional: count your pull requests (including private XCEED repos)

GitHub's public search only sees PRs in public repos, so it finds just 1 for you. With a read-only token, the daily job counts all of them, and the About panel then shows **Pull requests authored** and **Merged into main**.

1. Go to GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**. Fill it in like this:

   | Field | Value |
   |---|---|
   | Name | `portfolio-stats` |
   | Expiration | 1 year |
   | Resource owner | `xceed-nitj` (the team org whose PRs you want counted) |
   | Repository access | All repositories |
   | Repository permissions | **Pull requests: Read-only**. Metadata: Read-only is added automatically. |

   Leave every other permission off.
2. The org may need to approve the token. If so, ask an XCEED admin to approve it under the org's settings.
3. In your portfolio repo, go to **Settings → Secrets and variables → Actions → New repository secret**. Set the name to `GH_STATS_TOKEN` and paste the token as the value.
4. Run **Refresh stats daily** from the **Actions** tab once. The log should say `GitHub PRs: N authored, M merged`.

If the token expires or is revoked, the job keeps the last saved numbers and logs a warning. It never fails the build.

## 5. Check the live site

- Open it on a phone and on a laptop, and scroll the whole page.
- Paste the URL into LinkedIn's Post Inspector, or any Open Graph preview tool, and check that the card shows `og.jpg`.
- Click **Résumé** in the hero and in Contact.
- Run Lighthouse on the live URL. The local results (2026-11-10) were desktop 94–99 and mobile about 82; Accessibility, Best Practices and SEO were 100.

## Receive messages from the contact form

The **Send a message** form opens the visitor's email app until you connect a form service:
1. Create a free form at formspree.io.
2. Copy its URL (`https://formspree.io/f/xxxx`).
3. Paste it into `formEndpoint` in `src/data/projects.js`, then rebuild.

Messages then arrive in your inbox directly. The form also works without JavaScript, and a hidden honeypot field filters simple spam bots.

## Before you share it

- `src/data/projects.js`: check the three screenshot `alt` texts. They were written without seeing the images.
- `src/data/projects.js`: `bio.approach` and the Easter-egg message in `src/sections/Contact.jsx` are drafts for you to edit.
- LitGit still shows its "Developing…" placeholder. To replace it:
1. Add `public/media/litgit.webp`.
2. Add a `variants(...)` line for it in `scripts/images.mjs`, copying the others.
3. Run `npm run images`.
4. Give the project an `img` entry in `projects.js` like the others.
