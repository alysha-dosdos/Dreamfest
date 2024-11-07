Currently we have a one-to-many relationship, in the form of:

> One stage may host many events

We're going to add a feature to let attendees know about performers who are going to be at dreamfest and what events they will participate in.

This implies a many-to-many relationship in this form:

> Each performer may participate in many events and each event
> many have many performers participating

To model this, we'll use a migration to create two tables.

`performers` will have the bare info about the performer

- id
- name
- website

`performers_events` will connect performers and events, so it will only have these fields

- id
- performer_id
- event_id

Since this relationship can't exist without the performer and event, add an `.onDelete('CASCADE')` modifier to each of these relationships

We can also add a unique-ness constraint to the pair of `['perfomer_id', 'event_id']` since it doesn't really make sense to connect the same two entities twice (are they super-attending the event?)

Next, we'll add some seed data. Start with 3-4 artists, make sure to include:

- an perfomer who is not participating in any events
- an perfomer who is participating in exactly one event
- an perfomer who is participating in more than one event
- an event with zero perfomers participating
- an event with multiple perfomers participating
- an event with exactly one perfomer participating

Run your migrations and seeds, and we'll start writing queries.

We can start by writing a join to the `performers_events` table and then a second join onto events.

```js
async function getPerformersWithEvents() {
  const rows = await db('perfomers')
    .select('perfomers.*')
    .join('performers_events', ' perfomers.id', 'performers_id')
    .join('events', 'events.id', 'event_id')
  return rows
}
```

Create a route so we can just take a look at this, you might notice that our performer who isn't going to any events is missing from the list. That is because they do not exist in the join.

If we want a query that will include _all_ our performers, we need to use an [left join](<https://en.wikipedia.org/wiki/Join_(SQL)#Left_outer_join>). This type of join includes an example of every row in the left side of the join, no matter what.

```js
export async function getPerformersWithEvents() {
  const rows = await connection('performers')
    .select(
      'performers.*',
      'events.id as event_id',
      'events.name as event_name',
      'events.description as event_description',
      'events.day as event_day',
      'events.time as event_time'
    )
    .leftJoin('performers_events', 'performers.id', 'performer_id')
    .leftJoin('events', 'events.id', 'event_id')

  return rows
}
```

This will include every field from performers, and the named fields from the events table. We've had to use `as` in our knex query to make our event properties distinct (e.g. both performers and events have a 'name').

We'll see one row for each event that each performer is participating in, and for performers where they are not participating in any events we will see a single row where all of the event related columns have `null` values.

These results come out as a flat array of rows, but we really want to group these by performer, so that we end up with an array of performers and each performer has a property "events" which is an array of the events that they are participating in.

```js
const performers = new Map()

for (const row of rows) {
  let performer = performers.get(row.id)
  if (!performer) {
    const { id, name, website } = row
    // if this performer is not in our result set yet
    // we'll create it and associate it with its id
    performer = { id, name, website, events: [] }
    performers.set(id, performer)
  }

  // we need to check for null here because we are using an outer join
  if (row.event_id != null) {
    performer.events.push({
      id: row.event_id,
      name: row.event_name,
      description: row.event_description,
      time: row.event_time,
    })
  }
}

// Convert the map to an array
return Array.from(performers.values())
```

Take a look at what's coming out of the API and iterate on this code until you think it's a workable shape.

Some things you can do next:

1. Add a test for the api in [server.test.ts](../server/tests/server.test.ts), use the existing tests as an example
2. Add a test for the query in [db.test.ts](../server/db/tests/db.test.ts)
3. Add a type in the [models](../models/) folder, in a new file called Performer.ts

To get this working in the frontend, we're going to have to do a few things.

1. write a hook that uses react-query to fetch a list of performers, we can add it to [api.ts](../client/hooks/api.ts)
2. write a component that calls that hook and displays the information in a helpful way
3. add a route in [routes.tsx](../client/routes.tsx) to display that component
4. write some tests for your now route, use [ViewingTheSchedule.test.tsx](../client/__tests__/ViewingTheSchedule.test.tsx) as an example
