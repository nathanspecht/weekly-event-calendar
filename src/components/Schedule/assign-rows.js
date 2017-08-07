import R from 'ramda'
import moment from 'moment'

const isBetween = (date, event, inclusivity) =>
  moment(date).isBetween(event.rangeStart, event.rangeEnd, null, inclusivity)

const doesOverlap = event1 => event2 =>
  isBetween(event1.rangeStart, event2, '[]') ||
  isBetween(event1.rangeEnd, event2, '[]') ||
  isBetween(event2.rangeStart, event1, '[]') ||
  isBetween(event2.rangeEnd, event1, '[]')

const assignRows = (events, preserveRow) => {
  const rows = [[]]

  const assignRow = (acc, event) => {
    let i = 0
    let row = rows[i]

    while (R.any(doesOverlap(event))(row)) {
      i++
      if (!rows[i]) rows.push([])
      row = rows[i]
    }

    row.push(event)

    return R.assoc(event._id, { ...event, row: i }, acc)
  }

  const timestamp = R.compose(
    R.invoker(0, 'unix'),
    moment,
    R.prop('rangeStart')
  )

  const sortByRangeStart = R.sortWith([
    R.ascend(timestamp),
    R.ascend(R.prop('_id'))
  ])

  return R.reduce(assignRow, {}, sortByRangeStart(R.values(events)))
}

export default assignRows
