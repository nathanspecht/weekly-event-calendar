import React, { Component } from 'react'
import moment from 'moment'
import { keys } from 'ramda'
import { Collection } from 'react-virtualized'

const weekStart = moment('2017-08-06T00:00:00.000')
const weekEnd = moment('2017-08-13T00:00:00.000')

const WIDTH = 1512

class Days extends Component {
  weekDayCellRenderer = ({ key, style, index }) => {
    const day = moment().startOf('day').add(index, 'days').format('ddd')

    return (
      <div
        style={style}
        key={`${day}${index}`}
        className="br b--light-gray top-0 h-100"
      >
        <div className="w-100 tc pa2 bb b--light-gray">
          {day}
        </div>
      </div>
    )
  }

  weekDayCellSizeAndPositionGetter = ({ index }) => ({
    height: this.props.height,
    width: 216,
    x: 216 * index,
    y: 0
  })

  render() {
    return (
      <Collection
        scrollLeft={this.props.scrollLeft}
        className="br b--light-gray"
        cellRenderer={this.weekDayCellRenderer}
        cellSizeAndPositionGetter={this.weekDayCellSizeAndPositionGetter}
        height={this.props.height}
        width={WIDTH}
        cellCount={100}
      />
    )
  }
}

export default Days
