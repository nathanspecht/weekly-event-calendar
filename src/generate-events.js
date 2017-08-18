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
  ...a(6, 7, 'e', true),
  ...a(6, 7, 'f', true),
  ...a(6, 7, 'g', true),
  ...a(6, 7, 'h', true),
  ...a(6, 7, 'i', true),
  ...a(6, 7, 'j', true),
  ...a(6, 7, 'k', true),
  ...a(6, 7, 'l', true),
  ...a(6, 7, 'm', true)
}

export default events
