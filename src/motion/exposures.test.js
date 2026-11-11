import { test } from 'node:test'
import assert from 'node:assert/strict'
import { load, develop, getFound } from './exposures.js'

const memory = () => {
  const data = {}
  return { getItem: (k) => data[k] ?? null, setItem: (k, v) => { data[k] = v } }
}

test('developing marks persists them and ignores unknown or repeated marks', () => {
  const s = memory()
  load(s)
  develop('will', s)
  develop('will', s)
  develop('nope', s)
  develop('restart', s)
  assert.deepEqual([...getFound()], ['will', 'restart'])
  load(memory()) // a fresh visitor
  assert.equal(getFound().size, 0)
  load(s) // a reload
  assert.deepEqual([...getFound()], ['will', 'restart'])
})

test('corrupt or blocked storage never breaks the egg', () => {
  load({ getItem: () => '{not json' })
  assert.equal(getFound().size, 0)
  const blocked = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('blocked') } }
  load(blocked)
  develop('loyalty', blocked)
  assert.deepEqual([...getFound()], ['loyalty'])
  load(null)
  develop('intensity', null)
  assert.ok(getFound().has('intensity'))
})
