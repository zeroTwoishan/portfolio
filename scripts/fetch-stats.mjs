// Refreshes LeetCode and GitHub stats before each build. Each source that fails keeps its saved numbers,
// so the build never breaks.
import { readFile, writeFile } from 'node:fs/promises'

const FILE = 'src/data/stats.json'
const LEETCODE_USER = 'ishan_zerotwo'
const GITHUB_USER = 'zeroTwoishan'
const today = new Date().toISOString().slice(0, 10)
const stats = JSON.parse(await readFile(FILE, 'utf8'))

async function get(url, init) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(10_000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res
}

try {
  const query = `query ($username: String!) {
    matchedUser(username: $username) {
      submitStatsGlobal { acSubmissionNum { difficulty count } }
      profile { ranking }
    }
  }`
  const res = await get('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: 'https://leetcode.com' },
    body: JSON.stringify({ query, variables: { username: LEETCODE_USER } }),
  })
  const { data } = await res.json()
  const count = Object.fromEntries(
    data.matchedUser.submitStatsGlobal.acSubmissionNum.map((d) => [d.difficulty.toLowerCase(), d.count]),
  )
  stats.leetcode = {
    username: LEETCODE_USER,
    solved: count.all, easy: count.easy, medium: count.medium, hard: count.hard,
    ranking: data.matchedUser.profile.ranking,
    updatedAt: today,
  }
  console.log(`LeetCode: ${stats.leetcode.solved} solved`)
} catch (err) {
  console.warn(`LeetCode fetch failed (${err.message}); keeping the saved numbers`)
}

try {
  const user = await (await get(`https://api.github.com/users/${GITHUB_USER}`)).json()
  // shortcut: the contributions count is read from GitHub's public profile HTML, which can change;
  // switch to the GraphQL API (needs a token) if this starts failing.
  const html = (await (await get(`https://github.com/users/${GITHUB_USER}/contributions`)).text()).replace(/\s+/g, ' ')
  const match = html.match(/([\d,]+) contributions? in the last year/)
  if (!match) throw new Error('contributions count not found in the page')
  stats.github = {
    ...stats.github, // keeps the PR counts below, which have their own source
    username: GITHUB_USER,
    publicRepos: user.public_repos,
    contributionsLastYear: Number(match[1].replace(/,/g, '')),
    updatedAt: today,
  }
  console.log(`GitHub: ${stats.github.publicRepos} repos, ${stats.github.contributionsLastYear} contributions`)
} catch (err) {
  console.warn(`GitHub fetch failed (${err.message}); keeping the saved numbers`)
}

// Pull requests, all time. Public search misses private team repos (XCEED), so this needs a read-only token
// (GH_STATS_TOKEN, a GitHub Actions secret). Without one, the saved numbers stay as they are.
if (process.env.GH_STATS_TOKEN) {
  try {
    const res = await get('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${process.env.GH_STATS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query ($login: String!) { user(login: $login) {
          authored: pullRequests { totalCount }
          merged: pullRequests(states: MERGED) { totalCount }
        } }`,
        variables: { login: GITHUB_USER },
      }),
    })
    const { data, errors } = await res.json()
    if (errors?.length || !data?.user) throw new Error(errors?.[0]?.message ?? 'no user in response')
    const authored = data.user.authored.totalCount
    // An all-time count never drops; a lower number means the token can no longer see some repos (e.g. the org).
    if (authored < (stats.github.prsAuthored ?? 0)) throw new Error(`token sees only ${authored} PRs, fewer than the saved ${stats.github.prsAuthored}; check its access`)
    stats.github = { ...stats.github, prsAuthored: authored, prsMerged: data.user.merged.totalCount }
    console.log(`GitHub PRs: ${stats.github.prsAuthored} authored, ${stats.github.prsMerged} merged`)
  } catch (err) {
    console.warn(`GitHub PR fetch failed (${err.message}); keeping the saved numbers`)
  }
} else {
  console.log('GitHub PRs: no GH_STATS_TOKEN, keeping the saved numbers')
}

await writeFile(FILE, JSON.stringify(stats, null, 2) + '\n')
