// @vitest-environment jsdom
import { describe, it, expect, beforeAll } from 'vitest'
import nock from 'nock'

import { setupApp } from './setup.tsx'

beforeAll(() => {
  nock.disableNetConnect()
})

const fakeLocation = {
  id: 1,
  name: 'Kayak Room',
  description: 'This is the room we keep kayaks in',
}

describe('Editing a location', () => {
  it('shows current data on the form', async () => {
    const scope = nock('http://localhost')
      .get('/api/v1/locations/1')
      .reply(200, fakeLocation)

    // ARRANGE
    const { ...screen } = setupApp('/locations/1/edit')
    // ACT
    // ASSERT
    const nameInput = await screen.findByLabelText('Location name')
    const descriptionInput = await screen.findByLabelText('Description')

    expect(nameInput).toBeVisible()
    expect(nameInput).toHaveValue('Kayak Room')
    expect(descriptionInput).toBeInTheDocument()
    expect(descriptionInput).toHaveValue('This is the room we keep kayaks in')

    expect(scope.isDone()).toBe(true)
  })

  it('updates that location when the edit is submitted', async () => {
    const initialScope = nock('http://localhost')
      .get('/api/v1/locations/1')
      .reply(200, fakeLocation)

    // ARRANGE
    const { user, ...screen } = setupApp('/locations/1/edit')

    const nameInput = await screen.findByLabelText('Location name')
    const descriptionInput = await screen.findByLabelText('Description')
    expect(initialScope.isDone()).toBe(true)

    const editScope = nock('http://localhost')
      .patch('/api/v1/locations/1', {
        name: 'Dinghy Dungeon',
        description: 'A place for small boats that have committed big crimes',
      })
      .reply(204)

    // ACT
    await user.clear(nameInput)
    await user.type(nameInput, 'Dinghy Dungeon')
    await user.clear(descriptionInput)

    await user.type(
      descriptionInput,
      'A place for small boats that have committed big crimes',
    )

    const submitButton = await screen.findByRole('button', {
      name: 'Update location',
    })
    await user.click(submitButton)

    // ASSERT
    expect(editScope.isDone()).toBe(true)
  })
})
