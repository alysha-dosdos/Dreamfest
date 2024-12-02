import knexFile from './knexfile.js'
import knex from 'knex'
import type { Location, LocationData } from '../../models/Location.ts'
import type { Event, EventWithLocation, EventData } from '../../models/Event.ts'

type Environment = 'production' | 'test' | 'development'

const environment = (process.env.NODE_ENV || 'development') as Environment
const config = knexFile[environment]
export const connection = knex(config)

export async function getAllLocations(db = connection) {
  const locations = await db('locations').select('*')
  return locations as Location[]
}

export async function getEventsByDay(
  day: string,
): Promise<EventWithLocation[]> {
  const db = connection
  const events = await db('events')
    .join('locations', 'events.location_id', 'locations.id')
    .select(
      'events.id as id',
      'events.day',
      'events.time',
      'events.name as eventName',
      'events.description as description',
      'locations.name as locationName',
    )
    .where('events.day', day)
  return events as EventWithLocation[]
}

export async function getLocationById(id: number): Promise<Location[]> {
  const db = connection
  const location = await db('locations')
    .select('id', 'name', 'description')
    .where('id', id)
  console.log(location)
  return location as Location[]
}
