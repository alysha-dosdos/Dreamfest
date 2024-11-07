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

describe('Getting Performers', () => {
  it('serves performers', async () => {
    const res = await request(server).get('/api/v1/performers')
    expect(res.body).toMatchInlineSnapshot(`
      [
        {
          "events": [
            {
              "description": "This event will be taking place at the TangleStage. Be sure to not miss the free slushies cause they are rad!",
              "id": 1,
              "name": "Slushie Apocalypse I",
              "time": "2pm - 3pm",
            },
          ],
          "id": 1,
          "name": "Luna Starlight",
          "website": "https://www.lunastarlightmusic.com",
        },
        {
          "events": [
            {
              "description": "This event will be taking place at the TangleStage. Be sure to not miss the free slushies cause they are rad!",
              "id": 1,
              "name": "Slushie Apocalypse I",
              "time": "2pm - 3pm",
            },
          ],
          "id": 2,
          "name": "Xander Blaze",
          "website": "https://www.xanderblazemagic.com",
        },
        {
          "events": [
            {
              "description": "This event will be taking place at the Yella Yurt. Come see what marvels our championship builders have built over the past 7 days!",
              "id": 2,
              "name": "LEGO Builder Championships",
              "time": "6pm - 7pm",
            },
          ],
          "id": 3,
          "name": "Ruby Raindrop",
          "website": "https://www.rubyraindropdance.com",
        },
        {
          "events": [
            {
              "description": "This event will be taking place at the TangleStage. Make sure you eat lunch before watching this amazing display!",
              "id": 3,
              "name": "Sandwich Eating Contest",
              "time": "2pm - 3pm",
            },
            {
              "description": "This event will be taking place at the Yella Yurt. You won't want to miss those cute puppy faces!",
              "id": 4,
              "name": "Cutest Puppy Awards",
              "time": "6pm - 7pm",
            },
            {
              "description": "This event will be taking place at the TangleStage. Be sure to not miss the free slushies cause they are rad!",
              "id": 5,
              "name": "Slushie Apocalypse II: The Return",
              "time": "2pm - 3pm",
            },
          ],
          "id": 4,
          "name": "Spike Shadow",
          "website": "https://www.spikeshadowtheatre.com",
        },
        {
          "events": [],
          "id": 5,
          "name": "Aria Echo",
          "website": "https://www.ariaechoart.com",
        },
      ]
    `)
  })
})
