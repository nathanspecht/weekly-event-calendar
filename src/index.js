import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Schedule from './components/Schedule'
import registerServiceWorker from './registerServiceWorker'
import generateEvents from './generate-events'
import './index.css'
import 'react-virtualized/styles.css'

class TestWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      events: generateEvents
    }
  }

  updateEvents = events => this.setState({ events })

  render() {
    return <Schedule events={this.state.events} onUpdate={this.updateEvents} />
  }
}

ReactDOM.render(<TestWrapper />, document.getElementById('root'))

registerServiceWorker()
