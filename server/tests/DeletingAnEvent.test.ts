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

describe('Deleting an Event', () => {
  it('can be deleted', async () => {
    // TODO: write server integration test for event delete (testing the routes and db at the same time)
    // make a fake variable so it doesn't actually delete a real one in the DB
    const fakeEventID = 6

    // to find event and show its there
    let response = await request(server).get(`/api/v1/events/${fakeEventID}`)
    expect(response.status).toBe(200)

    // to delete event
    response = await request(server).delete(`/api/v1/events/${fakeEventID}`)
    expect(response.status).toBe(204)

    // to find event and it's gone to make sure it's deleted successfully
    response = await request(server).get(`/api/v1/events/${fakeEventID}`)
    expect(response.status).toBe(404)
  })
})
