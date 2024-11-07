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

describe('Getting an Event', () => {
  it('serves events', async () => {
    const res = await request(server).get('/api/v1/schedule/friday')
    expect(res.body).toMatchInlineSnapshot(`
      {
        "day": "friday",
        "events": [
          {
            "day": "friday",
            "description": "This event will be taking place at the TangleStage. Be sure to not miss the free slushies cause they are rad!",
            "eventName": "Slushie Apocalypse I",
            "id": 1,
            "locationId": 1,
            "locationName": "TangleStage",
            "location_id": 1,
            "name": "TangleStage",
            "time": "2pm - 3pm",
          },
          {
            "day": "friday",
            "description": "This event will be taking place at the Yella Yurt. Come see what marvels our championship builders have built over the past 7 days!",
            "eventName": "LEGO Builder Championships",
            "id": 2,
            "locationId": 2,
            "locationName": "Yella Yurt",
            "location_id": 2,
            "name": "Yella Yurt",
            "time": "6pm - 7pm",
          },
        ],
      }
    `)
  })
})
