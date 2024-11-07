import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest'
import request from 'supertest'

import { connection } from '../db/index.ts'
import server from '../server.ts'

beforeAll(async () => {
  await connection.migrate.latest()
})

beforeEach(async () => {
  await connection.seed.run()
})

afterAll(async () => {
  await connection.destroy()
})

describe('Editing a location', () => {
  it('serves existing data', async () => {
    const res = await request(server).get('/api/v1/locations/1')
    expect(res.body).toStrictEqual({
      description: 'Not the biggest stage, but perhaps the most hip.',
      id: 1,
      name: 'TangleStage',
    })
  })

  it('PATCH updates data', async () => {
    // ACT
    const patchRes = await request(server).patch('/api/v1/locations/1').send({
      name: 'Milo Mountain',
      description: "It's a lot of fun... until it rains",
    })

    // ASSERT
    expect(patchRes.statusCode).toBe(204)
    const getRes = await request(server).get('/api/v1/locations/1')
    expect(getRes.body).toStrictEqual({
      description: "It's a lot of fun... until it rains",
      id: 1,
      name: 'Milo Mountain',
    })
  })
})
