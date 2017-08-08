import React, { Component } from 'react'
import { Collection, ScrollSync } from 'react-virtualized'
import R, {
  identity,
  compose,
  values,
  keys,
  omit,
  set,
  lensProp,
  sortBy,
  prop,
  maxBy
} from 'ramda'
import Event from './Event'
import moment from 'moment'
import assignRows from './assign-rows'
import { numHours, getPixelCount, getHourCount } from './util'

const sortedIds = compose(sortBy(identity), keys)

class Events extends Component {
  constructor(props) {
    super(props)
    this.previousRows = {}
    this.state = {
      extraCells: 0,
      phantomPosition: 0,
      isDragging: false
    }
  }

  positionEvents = () => {
    const { isDragging } = this.state
    const { events } = this.props
    const eventsWithRows = assignRows(
      events,
      isDragging,
      this.previousRows[isDragging]
    )
    this.previousRows = R.map(R.prop('row'), eventsWithRows)
    const _ids = sortedIds(events)
    return _ids.map(_id => {
      const event = eventsWithRows[_id]
      const y = event.row * 75 + 45
      const x = getPixelCount(moment().startOf('day'), event.rangeStart)
      const width = getPixelCount(event.rangeStart, event.rangeEnd)
      const height = 70
      return { _id, y, x, width, height }
    })
  }

  cellRenderer = ({ key, style, index }) => {
    const _ids = sortedIds(this.props.events)
    const _id = _ids[index]
    if (!_id) {
      return <div id="phantom" key={key} style={style} />
    }
    const event = this.props.events[_id]
    const translateY = style.top
    const handleStop = this.handleStop(index)
    return (
      <div key={key}>
        <Event
          event={event}
          translateY={translateY}
          handleStop={handleStop}
          style={{ ...style, top: 0 }}
          handleStart={this.handleStart}
          isDragging={this.state.isDragging}
        />
      </div>
    )
  }

  cellSizeAndPositionGetter = events => {
    const maxRow = R.reduce(
      R.max,
      0,
      R.map(R.prop('row'), values(assignRows(events)))
    )
    const positionedEvents = this.positionEvents(events)
    return ({ index }) => {
      const datum = positionedEvents[index]
      if (!datum)
        return {
          height: 50,
          width: 50,
          x: this.state.phantomPosition + 1505,
          y: Math.max(550, maxRow * 75 + 50)
        }

      return {
        height: datum.height,
        width: datum.width,
        x: datum.x,
        y: datum.y
      }
    }
  }

  handleStop = index => extend => (_, drag) => {
    const _ids = sortedIds(this.props.events)
    const _id = _ids[index]
    const event = this.props.events[_id]
    const pixelOffset = drag.x
    const hourOffset = getHourCount(pixelOffset)
    const nextEvents = {
      ...this.props.events,
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
    }
    const update = this.props.onUpdate(nextEvents)
    if (update instanceof Promise) {
      update.then(() => {
        this.setState({ isDragging: false })
        this.updateCollection()
      })
    } else {
      this.setState({ isDragging: false })
      this.updateCollection()
    }
  }

  handleStart = idx =>
    this.setState({ isDragging: idx }, () => this.updateCollection())

  updateCollection() {
    this.setState({ extraCells: this.state.extraCells >= 1 ? 0 : 1 })
  }

  updatePhantomElement = ({ scrollWidth, scrollLeft }) => {
    if (scrollLeft + 1512 >= scrollWidth) {
      this.setState({ phantomPosition: scrollWidth + 1512 })
      this.updateCollection()
    }
  }

  render() {
    const cellCount =
      values(this.props.events).length + this.state.extraCells + 2
    const cellSizeAndPositionGetter = this.cellSizeAndPositionGetter(
      this.props.events
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
