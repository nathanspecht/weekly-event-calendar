import React, { Component } from 'react'
import Draggable from 'react-draggable'
import moment from 'moment'

class Event extends Component {
  constructor(props) {
    super(props)
    this.state = {
      extendDir: null,
      extendAmt: 0,
      isSelfDragging: false
    }
  }

  handleStart = extendDir => () => {
    this.props.handleStart()
    this.setState({ extendDir, isSelfDragging: true })
  }

  handleDrag = (_, drag) => {
    this.setState({ extendAmt: drag.x })
  }

  handleStop = extendDir => (event, drag) => {
    this.props.handleStop(extendDir)(event, drag)
    this.setState({ extendDir: null, extendAmt: 0, isSelfDragging: false })
  }

  getWidth = styleWidth => {
    if (!this.state.extendDir) return styleWidth
    if (this.state.extendDir === 'END') return styleWidth + this.state.extendAmt
    if (this.state.extendDir === 'START') {
      return styleWidth - this.state.extendAmt
    }
  }

  getLeft = styleLeft => {
    if (!this.state.extendDir) return styleLeft
    if (this.state.extendDir === 'END') return styleLeft
    if (this.state.extendDir === 'START') {
      return styleLeft + this.state.extendAmt
    }
  }

  render() {
    const { event, style, handleStop } = this.props
    const left = this.getLeft(style.left)
    const width = this.getWidth(style.width)
    const isUnfocused = this.props.isDragging && !this.state.isSelfDragging
    const opacity = isUnfocused ? 0.5 : 1
    const zIndex = isUnfocused ? -10 : 10
    return (
      <Draggable
        axis="x"
        cancel="#extend"
        onStart={this.handleStart()}
        onStop={this.handleStop()}
        position={{ x: 0, y: 0 }}
      >
        <div style={{ opacity, zIndex }}>
          <div
            key={event._id}
            id={event._id}
            className="bg-light-gray br4 pt3 pl3"
            style={{
              ...style,
              transition: 'top 0.5s',
              width,
              left
            }}
          >
            <div className="ml4">
              <div className="f5">
                {moment(event.rangeStart).format('MMMM D @ h A')}
              </div>
              <div className="f6 lh-copy">
                {event._id}
              </div>
            </div>
          </div>
          <div className="" style={{ ...style, transition: 'top 0.5s' }}>
            <div id="extend">
              <Draggable
                axis="x"
                position={{ x: 0, y: 0 }}
                onDrag={this.handleDrag}
                onStart={this.handleStart('START')}
                onStop={this.handleStop('START')}
              >
                <div
                  style={{ cursor: 'ew-resize' }}
                  className="absolute bg-light-gray h-100 w2 left-0 top-0 br4 br--left"
                />
              </Draggable>
            </div>
            <div id="extend">
              <Draggable
                axis="x"
                position={{ x: 0, y: 0 }}
                onDrag={this.handleDrag}
                onStart={this.handleStart('END')}
                onStop={this.handleStop('END')}
              >
                <div
                  style={{ cursor: 'ew-resize' }}
                  className="absolute bg-light-gray h-100 w2 right-0 top-0 br4 br--right"
                />
              </Draggable>
            </div>
          </div>
        </div>
      </Draggable>
    )
  }
}

export default Event
