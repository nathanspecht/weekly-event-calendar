import moment from 'moment'

export const numHours = (rangeStart, rangeEnd) =>
  Math.floor(
    moment.duration(moment(rangeEnd).diff(moment(rangeStart))).asHours()
  )

export const getPixelCount = (rangeStart, rangeEnd) =>
  9 * numHours(rangeStart, rangeEnd)

export const getHourCount = pixelCount => Math.round(pixelCount / 9)