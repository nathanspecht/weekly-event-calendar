import React from 'react'
import moment from 'moment'

const WeekNav = ({ updateWeekStart, weekStart }) => {
  const addDay = () => updateWeekStart(moment(weekStart).add(1, 'day'))
  const subtractDay = () =>
    updateWeekStart(moment(weekStart).subtract(1, 'day'))
  return (
    <div className="flex flex-row">
      <button onClick={subtractDay}>-</button>
      <button onClick={addDay}>+</button>
    </div>
  )
}

export default WeekNav
