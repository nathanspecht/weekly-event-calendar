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
import Event from './Event'
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
      extraCells: 0,
      phantomPosition: 0,
      isDragging: false
    }
  }

  cellRenderer = ({ key, style, index }) => {
    const _ids = sortedIds(this.state.events)
    const _id = _ids[index]
    if (!_id) return <div id="phantom" key={key} style={style} />

    const event = this.state.events[_id]
    const handleStop = this.handleStop(index)
    return (
      <div key={key}>
        <Event
          event={event}
          handleStop={handleStop}
          style={style}
          handleStart={this.handleStart}
          isDragging={this.state.isDragging}
        />
      </div>
    )
  }

  cellSizeAndPositionGetter = events => ({ index }) => {
    const positionedEvents = positionEvents(events)
    const datum = positionedEvents[index]
    if (!datum)
      return {
        height: 50,
        width: 50,
        x: this.state.phantomPosition + 1505,
        y: 550
      }
    return {
      height: datum.height,
      width: datum.width,
      x: datum.x,
      y: datum.y
    }
  }

  handleStop = index => extend => (_, drag) => {
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
    this.setState({ events: nextEvents, isDragging: false })
    this.updateCollection()
  }

  handleStart = () => this.setState({ isDragging: true })

  updateCollection() {
    this.setState({ extraCells: this.state.extraCells >= 1 ? 0 : 1 })
  }

  updatePhantomElement = ({ scrollWidth, scrollLeft }) => {
    if (scrollLeft + 1512 >= scrollWidth) {
      console.log('Updating scroll element')
      this.setState({ phantomPosition: scrollWidth + 1512 })
      this.updateCollection()
    }
  }

  componentDidMount() {
    this.setState({ events: assignRows(events) })
  }

  render() {
    const cellCount =
      values(this.state.events).length + this.state.extraCells + 2
    const cellSizeAndPositionGetter = this.cellSizeAndPositionGetter(
      this.state.events
    )
    return (
      <Collection
        onScroll={args => {
          this.props.onScroll(args)
          this.updatePhantomElement(args)
        }}
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
