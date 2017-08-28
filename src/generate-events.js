import moment from 'moment'
import R from 'ramda'

export const createEvent = (f, t, _id, atStart) => {
  const addDays = R.compose(
    R.cond([
      [R.always(atStart), R.invoker(1, 'startOf')('day')],
      [R.T, R.identity]
    ]),
    d => moment().add(d, 'days')
  )

  return {
    [_id]: {
      _id,
      rangeStart: addDays(f),
      rangeEnd: addDays(t)
    }
  }
}

const createEvents = num => {
  const b = {}
  for (let i = 0; i < num; i++) {
    const _id = `a${Math.random()}`
    Object.assign(b, { [_id]: createEvent(4, 5, _id) })
  }
  return b
}

const events = {
  ...createEvent(-1, 4, 'a', true),
  ...createEvent(4, 5, 'b', true),
  ...createEvent(5, 6, 'c', true),
  ...createEvent(6, 7, 'd', true),
  ...createEvent(6, 7, 'e', true),
  ...createEvent(6, 7, 'f', true),
  ...createEvent(6, 7, 'g', true),
  ...createEvent(6, 7, 'h', true),
  ...createEvent(6, 7, 'i', true),
  ...createEvent(6, 7, 'j', true),
  ...createEvent(6, 7, 'k', true),
  ...createEvent(6, 7, 'l', true),
  ...createEvent(6, 7, 'm', true)
}

export default events
