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
    _id,
    rangeStart: addDays(f),
    rangeEnd: addDays(t)
  }
}

const events = {
  a: {
    _id: 'a',
    rangeStart: moment('2017-08-07T12:00:00.000'),
    rangeEnd: moment('2017-08-11T12:00:00.000')
  },
  b: {
    _id: 'b',
    rangeStart: moment('2017-08-08T12:00:00.000'),
    rangeEnd: moment('2017-08-11T17:00:00.000')
  },
  c: {
    _id: 'c',
    rangeStart: moment('2017-08-05T12:00:00.000'),
    rangeEnd: moment('2017-08-09T00:00:00.000')
  },
  d: {
    _id: 'd',
    rangeStart: moment('2017-08-09T12:00:00.000'),
    rangeEnd: moment('2017-08-13T00:00:00.000')
  },
  e: {
    _id: 'e',
    rangeStart: moment().add(1, 'day'),
    rangeEnd: moment().add(3, 'days')
  },
  g: a(3, 10, 'g', true),
  h: a(2, 4, 'h', true),
  i: a(2, 4, 'i', false),
  j: a(2, 4, 'j', true)
}

export default events
