import moment from 'moment'
import R from 'ramda'

const a = (f, t, _id, atStart) => {
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
    Object.assign(b, { [_id]: a(4, 5, _id) })
  }
  return b
}

const events = {
  ...a(2, 4, 'a', true),
  ...a(4, 5, 'b', true),
  ...a(5, 6, 'c', true),
  ...a(6, 7, 'd', true),
  ...a(7, 8, 'e', true),
  ...a(8, 9, 'f', true)
  // ...a(8, 9, 'g', true),
  // ...a(8, 9, 'h', true),
  // ...a(8, 9, 'i', true),
  // ...a(8, 9, 'j', true),
  // ...a(8, 9, 'k', true),
  // ...a(8, 9, 'l', true),
  // ...a(8, 9, 'm', true),
  // ...a(8, 9, 'n', true),
  // ...a(8, 9, 'o', true)
}

export default events
