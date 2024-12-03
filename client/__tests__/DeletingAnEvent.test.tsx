// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest'
import nock from 'nock'

import { setupApp } from './setup.tsx'

beforeAll(() => {
  nock.disableNetConnect()
})

const fakeEvent = {
  id: 1,
  day: 'friday',
  time: '2pm - 3pm',
  name: 'Slushie Apocalypse I',
  description:
    'This event will be taking place at the TangleStage. Be sure to not miss the free slushies cause they are rad!',
  locationId: 1,
}

const fakeLocations = {
  locations: [
    {
      id: 1,
      name: 'Kayak Room',
      description: 'This is the room we keep kayaks in',
    },
  ],
}

describe('Deleting an event', () => {
  it('shows current data on the form', async () => {
    const eventScope = nock('http://localhost')
      .get('/api/v1/events/1')
      .reply(200, fakeEvent)

    const locationScope = nock('http://localhost')
      .get('/api/v1/locations')
      .reply(200, fakeLocations)

    // ARRANGE
    const { ...screen } = setupApp('/events/1/edit')
    // ACT
    // ASSERT
    const nameInput = await screen.findByLabelText('Event name')
    const descriptionInput = await screen.findByLabelText('Description')

    expect(nameInput).toBeVisible()
    expect(nameInput).toHaveValue('Slushie Apocalypse I')
    expect(descriptionInput).toBeInTheDocument()
    expect(descriptionInput).toHaveValue(
      'This event will be taking place at the TangleStage. Be sure to not miss the free slushies cause they are rad!',
    )

    expect(eventScope.isDone()).toBe(true)
    expect(locationScope.isDone()).toBe(true)
  })

  it('deletes the event when the delete button is clicked', async () => {
    // TODO: write client integration test for event delete
    // ARRANGE
    // set up the events and locations on the page
    const eventScope = nock('http://localhost')
      .get('/api/v1/events/1')
      .reply(200, fakeEvent)
    expect(eventScope.isDone()).toBe(true)

    const locationScope = nock('http://localhost')
      .get('/api/v1/locations')
      .reply(200, fakeLocations)
    expect(locationScope.isDone()).toBe(true)

    // render the front end route and see if the event is there
    const { user, ...screen } = setupApp('/events/1/edit')
    const deleteButton = await screen.findByLabelText('Delete event')
    expect(deleteButton).toBeVisible()

    // to make sure it doesn't delete in the db for real
    const deleteEventScope = nock('http://localhost')
      .delete('/api/v1/events/1')
      .reply(200, { message: 'Event deleted' })

    // ACT
    // simulate the user clicking the delete button
    await user.click(deleteButton)

    // ASSERT
    // to show it's working as it should in the front end to delete event
    expect(deleteEventScope.isDone()).toBe(true)
  })
})
