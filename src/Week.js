import React, { Component } from 'react'
import { Collection } from 'react-virtualized'
import {
  identity,
  compose,
  values,
  keys,
  omit,
  set,
  lensProp,
  sortBy,
  prop
} from 'ramda'
import Draggable from 'react-draggable'
import moment from 'moment'
import events from './events'
import assignRows from './assign-rows'
import 'react-virtualized/styles.css' // only needs to be imported once

const HEIGHT = values(events).length * 75 + 10

const numHours = (rangeStart, rangeEnd) =>
  moment.duration(moment(rangeEnd).diff(moment(rangeStart))).asHours()

const getPixelCount = (rangeStart, rangeEnd) => {
  const hoursInWeek = 7 * 24
  const hoursInRange = numHours(rangeStart, rangeEnd)
  return Math.ceil(1500 * hoursInRange / hoursInWeek)
}

const getHourCount = pixelCount => Math.round(pixelCount * 168 / 1500)

const sortedIds = compose(sortBy(identity), keys)

const positionEvents = events => {
  const _ids = sortedIds(events)
  return _ids.map(_id => {
    const event = events[_id]
    const y = event.row * 75
    const x = getPixelCount(moment(), event.rangeStart)
    const width = getPixelCount(event.rangeStart, event.rangeEnd)
    const height = 70
    return { _id, y, x, width, height }
  })
}

class Week extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: assignRows(events)
    }
  }

  cellRenderer = ({ key, style, index }) => {
    const _ids = sortedIds(this.state.events)
    const _id = _ids[index]
    const event = this.state.events[_id]
    return (
      <Draggable
        axis="x"
        onStop={this.handleStop(index)}
        key={event._id}
        position={{ x: 0, y: 0 }}
      >
        <div
          key={event._id}
          id={event._id}
          className="bg-light-gray br4 pt3 pl3"
          style={{
            ...style,
            transition: 'top 0.5s'
          }}
        >
          <div className="f5">
            {moment(event.rangeStart).format('MMMM D @ h A')}
          </div>
          <div className="f6 lh-copy">
            {event._id}
          </div>
        </div>
      </Draggable>
    )
  }

  cellSizeAndPositionGetter = events => ({ index }) => {
    const positionedEvents = positionEvents(events)
    const datum = positionedEvents[index]
    return {
      height: datum.height,
      width: datum.width,
      x: datum.x,
      y: datum.y
    }
  }

  handleStop = index => (_, drag) => {
    const _ids = sortedIds(this.state.events)
    const _id = _ids[index]
    const event = this.state.events[_id]
    const pixelOffset = drag.x
    const hourOffset = getHourCount(pixelOffset)
    const newEvent = {
      ...event,
      rangeStart: moment(event.rangeStart).add(hourOffset, 'hours'),
      rangeEnd: moment(event.rangeEnd).add(hourOffset, 'hours')
    }
    const addNewEvent = set(lensProp(_id), newEvent)
    const newEvents = assignRows(addNewEvent(this.state.events), _id)
    const nextEvents = assignRows({
      ...this.state.events,
      [_id]: {
        ...event,
        rangeStart: moment(event.rangeStart).add(hourOffset, 'hours'),
        rangeEnd: moment(event.rangeEnd).add(hourOffset, 'hours')
      }
    })
    this.setState({ events: nextEvents }, () => {
      this.collection.recomputeCellSizesAndPositions()
    })
  }

  render() {
    const cellCount = values(this.state.events).length
    return (
      <div className="center mt5 ba b--light-gray" style={{ width: '1500px' }}>
        <Collection
          ref={collection => (this.collection = collection)}
          cellCount={cellCount}
          cellRenderer={this.cellRenderer}
          cellSizeAndPositionGetter={this.cellSizeAndPositionGetter(
            this.state.events
          )}
          height={HEIGHT}
          width={1500}
        />
      </div>
    )
  }
}

export default Week
