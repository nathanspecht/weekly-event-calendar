import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Schedule from 'components/Schedule'
import registerServiceWorker from './registerServiceWorker'
import generateEvents from './generate-events'
import './index.css'
import 'react-virtualized/styles.css'

const describeEvent = ({ _id }) => `ID: ${_id}`

class TestWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: generateEvents,
      something: null
    }
  }

  updateEvent = event =>
    this.setState({
      events: { ...this.state.events, [event._id]: event }
    })

  updateEventDelayed = event =>
    new Promise(resolve =>
      setTimeout(() => {
        this.updateEvent(event)
        resolve()
      }, 200)
    )

  render() {
    return (
      <Schedule
        events={this.state.events}
        onUpdate={this.updateEvent}
        describeEvent={describeEvent}
        onEventClick={event => console.log(`Event clicked: ${event._id}`)}
      />
    )
  }
}

ReactDOM.render(<TestWrapper />, document.getElementById('root'))

registerServiceWorker()
