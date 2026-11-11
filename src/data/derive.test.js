import { test } from 'node:test'
import assert from 'node:assert/strict'
import { baseName, skillLabel, logStatus } from './derive.js'
import { projects, skills } from './projects.js'

test('baseName strips versions and parentheses', () => {
  assert.equal(baseName('React 19'), 'React')
  assert.equal(baseName('React Router 7'), 'React Router')
  assert.equal(baseName('Tailwind CSS v4'), 'Tailwind CSS')
  assert.equal(baseName('Chrome Extensions (Manifest V3)'), 'Chrome Extensions')
  assert.equal(baseName('C++'), 'C++')
})

test('skill labels come only from the project data', () => {
  assert.equal(skillLabel('React', projects), 'Shipped')
  assert.equal(skillLabel('Tailwind CSS', projects), 'Shipped')
  assert.equal(skillLabel('Chrome Extensions', projects), 'Shipped')
  assert.equal(skillLabel('C++', projects), null) // LeetCode work, not a featured project
  assert.equal(skillLabel('Learning ML', projects), 'Learning')
  assert.equal(skillLabel('Java (basics)', projects), 'Learning')
  for (const items of Object.values(skills)) for (const s of items) skillLabel(s, projects) // never throws
})

test('log status is computed against the build date', () => {
  assert.equal(logStatus('Nov 2026', '2026-11-10'), 'Ongoing')
  assert.equal(logStatus('Oct 2026', '2026-11-10'), 'Complete')
  assert.equal(logStatus('Jun–Jul 2026', '2026-11-10'), 'Complete')
  assert.equal(logStatus('Jun–Jul 2026', '2026-07-03'), 'Ongoing')
  assert.equal(logStatus('2025', '2026-11-10'), 'Complete')
})
