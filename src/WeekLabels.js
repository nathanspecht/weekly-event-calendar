import React from 'react'
import { invoker } from 'ramda'
import { extendMoment } from 'moment-range'
import momentWithoutRange from 'moment'

const moment = extendMoment(momentWithoutRange)

const WeekLabels = ({ weekStart, weekEnd }) => {
  const formatDay = invoker(1, 'format')('ddd')
  const rangeByDay = moment.range(weekStart, weekEnd).by('day')
  const weekNames = Array.from(rangeByDay).map(formatDay).slice(0, 7)

  return (
    <div className="absolute h-100 w-100 top-0 flex flex-row">
      {weekNames.map((name, idx, arr) =>
        <div
          key={`${name}${idx}`}
          className={`
          flex-auto
          b--light-silver
          ${idx < arr.length - 1 && 'br'}
          top-0
          h-100
        `}
        >
          <div className="w-100 tc pa2 bb b--light-silver">
            {name}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeekLabels
