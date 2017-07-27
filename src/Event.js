import React from 'react'
import moment from 'moment'

const WIDTH = 1500

const numHours = (rangeStart, rangeEnd) =>
  moment.duration(moment(rangeStart).diff(moment(rangeEnd))).asHours()

const getPixelCount = (rangeStart, rangeEnd, weekStart, weekEnd) => {
  const hoursInWeek = numHours(weekStart, weekEnd)
  const hoursInRange = numHours(rangeStart, rangeEnd)
  return Math.ceil(1500 * hoursInRange / hoursInWeek)
}

const Event = ({ rangeStart, rangeEnd, updateEvent, weekStart, weekEnd }) =>
  <div
    className="mv2 relative bg-light-gray br4 pt3 pl3"
    style={{
      height: '70px',
      width: `${getPixelCount(rangeStart, rangeEnd, weekStart, weekEnd)}px`,
      left: `${getPixelCount(weekStart, rangeStart, weekStart, weekEnd)}px`
    }}
    onClick={() =>
      updateEvent({ rangeStart, rangeEnd: moment(rangeEnd).add(1, 'hour') })}
  >
    <div className="f5">August 8 @ 12 PM</div>
    <div className="f6 lh-copy">Coca Cola, Google Pixel • 20% SOV</div>
  </div>

export default Event
