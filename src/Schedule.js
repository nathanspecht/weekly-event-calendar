import React, { Component } from 'react'
import moment from 'moment'
import { keys } from 'ramda'
import WeekLabels from './WeekLabels'
import WeekNav from './WeekNav'
import Event from './Event'
import initialEvents from './events'

const weekStart = moment('2017-08-06T00:00:00.000')
const weekEnd = moment('2017-08-13T00:00:00.000')

const WIDTH = 1500

class Schedule extends Component {
  constructor(props) {
    super(props)
    this.state = {
      weekStart,
      weekEnd,
      events: initialEvents
    }
  }

  updateEvent = key => event =>
    this.setState({
      events: {
        ...this.state.events,
        [key]: event
      }
    })

  updateWeekStart = weekStart =>
    this.setState({
      weekStart,
      weekEnd: moment(weekStart).add(1, 'week')
    })

  render() {
    return (
      <div>
        <WeekNav
          updateWeekStart={this.updateWeekStart}
          weekStart={this.state.weekStart}
        />
        <div
          style={{ height: '660px', width: `${1500}px` }}
          className="relative center br3 b--light-silver w-100 ba ma5 overflow-hidden flex flex-column"
        >
          <WeekLabels
            weekStart={this.state.weekStart}
            weekEnd={this.state.weekEnd}
          />
          <div style={{ height: '35px' }} />
          <div className="relative flex-auto">
            <div className="absolute w-100 h-100 overflow-scroll">
              {keys(this.state.events).map(key =>
                <Event
                  key={key}
                  updateEvent={this.updateEvent(key)}
                  weekStart={this.state.weekStart}
                  weekEnd={this.state.weekEnd}
                  {...this.state.events[key]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Schedule
