import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Schedule from 'components/Schedule'
import DefaultDropdown from 'components/Schedule/DefaultDropdown'
import registerServiceWorker from './registerServiceWorker'
import generateEvents, { createEvent } from './generate-events'
import './index.css'
import 'react-virtualized/styles.css'
import './tachyons.min.css'

const describeEvent = ({ id }) => `ID: ${id}`

class TestWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: generateEvents,
      something: null,
    }
  }

  updateEvents = events =>
    new Promise(resolve => this.setState({ events }, () => resolve()))

  updateEventDelayed = event =>
    new Promise(resolve =>
      setTimeout(() => {
        this.updateEvent(event)
        resolve()
      }, 200),
    )

  createEvent = () =>
    this.setState({
      events: {
        ...this.state.events,
        ...createEvent(3, 4, `a-${Math.random()}`),
      },
    })

  render() {
    return (
      <div>
        <button onClick={this.createEvent}>Add Event</button>
        <Schedule
          events={this.state.events}
          onUpdate={this.updateEvents}
          describeEvent={describeEvent}
          onEventClick={event => console.log(`Event clicked: ${event.id}`)}
          Dropdown={<DefaultDropdown />}
        />
      </div>
    )
  }
}

ReactDOM.render(<TestWrapper />, document.getElementById('root'))

registerServiceWorker()
