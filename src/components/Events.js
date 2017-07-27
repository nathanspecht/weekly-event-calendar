import React, { Component } from 'react'
import { Collection, ScrollSync } from 'react-virtualized'
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
import events from '../events'
import assignRows from '../assign-rows'

const HEIGHT = values(events).length * 75 + 10

const numHours = (rangeStart, rangeEnd) =>
  Math.floor(
    moment.duration(moment(rangeEnd).diff(moment(rangeStart))).asHours()
  )

const getPixelCount = (rangeStart, rangeEnd) =>
  9 * numHours(rangeStart, rangeEnd)

const getHourCount = pixelCount => Math.round(pixelCount / 9)

const sortedIds = compose(sortBy(identity), keys)

const positionEvents = events => {
  const _ids = sortedIds(events)
  return _ids.map(_id => {
    const event = events[_id]
    const y = event.row * 75 + 45
    const x = getPixelCount(moment().startOf('day'), event.rangeStart)
    const width = getPixelCount(event.rangeStart, event.rangeEnd)
    const height = 70
    return { _id, y, x, width, height }
  })
}

class Events extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: {},
      extraCells: 0
    }
  }

  cellRenderer = ({ key, style, index }) => {
    const _ids = sortedIds(this.state.events)
    const _id = _ids[index]
    if (!_id) return <div />
    const event = this.state.events[_id]
    return (
      <Draggable
        axis="x"
        cancel="#extend"
        onStop={this.handleStop(index)}
        key={event._id}
        position={{ x: 0, y: 0 }}
      >
        <div
          key={event._id}
          id={event._id}
          className="relative bg-light-gray br4 pt3 pl3"
          style={{
            ...style,
            transition: 'top 0.5s'
          }}
        >
          <div id="extend">
            <Draggable
              axis="x"
              position={{ x: 0, y: 0 }}
              onStop={this.handleStop(index, 'START')}
            >
              <div className="absolute bg-light-gray h-100 w2 left-0 top-0 br4 br--left" />
            </Draggable>
          </div>
          <div className="ml4">
            <div className="f5">
              {moment(event.rangeStart).format('MMMM D @ h A')}
            </div>
            <div className="f6 lh-copy">
              {event._id}
            </div>
          </div>
          <div id="extend">
            <Draggable
              axis="x"
              position={{ x: 0, y: 0 }}
              onStop={this.handleStop(index, 'END')}
            >
              <div className="absolute bg-light-gray h-100 w2 right-0 top-0 br4 br--right" />
            </Draggable>
          </div>
        </div>
      </Draggable>
    )
  }

  cellSizeAndPositionGetter = events => ({ index }) => {
    const positionedEvents = positionEvents(events)
    const datum = positionedEvents[index]
    if (!datum)
      return {
        height: 0,
        width: 0,
        x: 0,
        y: 0
      }
    console.log('Next x: ', datum.x)
    return {
      height: datum.height,
      width: datum.width,
      x: datum.x,
      y: datum.y
    }
  }

  handleStop = (index, extend) => (_, drag) => {
    const _ids = sortedIds(this.state.events)
    const _id = _ids[index]
    const event = this.state.events[_id]
    const pixelOffset = drag.x
    const hourOffset = getHourCount(pixelOffset)
    const nextEvents = assignRows({
      ...this.state.events,
      [_id]: {
        ...event,
        rangeStart:
          extend !== 'END'
            ? moment(event.rangeStart).add(hourOffset, 'hours')
            : event.rangeStart,
        rangeEnd:
          extend !== 'START'
            ? moment(event.rangeEnd).add(hourOffset, 'hours')
            : event.rangeEnd
      }
    })
    this.setState({
      events: nextEvents,
      extraCells: this.state.extraCells >= 1 ? 0 : 1
    })
  }

  componentDidMount() {
    this.setState({ events: assignRows(events) })
  }

  render() {
    const cellCount = values(this.state.events).length + this.state.extraCells
    const cellSizeAndPositionGetter = this.cellSizeAndPositionGetter(
      this.state.events
    )
    return (
      <Collection
        onScroll={this.props.onScroll}
        ref={collection => (this.collection = collection)}
        cellCount={cellCount}
        cellRenderer={this.cellRenderer}
        cellSizeAndPositionGetter={cellSizeAndPositionGetter}
        height={600}
        width={1512}
      />
    )
  }
}

export default Events
