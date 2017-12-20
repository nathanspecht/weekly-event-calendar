import moment from 'moment'
import R from 'ramda'

export const createEvent = (f, t, id, atStart) => {
  const addDays = R.compose(
    R.cond([
      [R.always(atStart), R.invoker(1, 'startOf')('day')],
      [R.T, R.identity],
    ]),
    d => moment().add(d, 'days'),
  )

  return {
    [id]: {
      id,
      rangeStart: addDays(f),
      rangeEnd: addDays(t),
    },
  }
}

const createEvents = num => {
  const b = {}
  for (let i = 0; i < num; i++) {
    const id = `a${Math.random()}`
    Object.assign(b, createEvent(4 + i, 5 + i, id, true))
  }
  return b
}

const events = createEvents(50)

export default events
