import React from 'react'
import { ScrollSync } from 'react-virtualized'
import Events from './Events'
import Days from './Days'

const Schedule = () =>
  <ScrollSync>
    {({ scrollLeft, onScroll }) =>
      <div
        className="relative center mt5 ba b--light-gray"
        style={{ width: '1512px' }}
      >
        <div className="absolute top-0 left-0">
          <Days height={600} scrollLeft={scrollLeft} />
        </div>
        <div className="absolute top-0 left-0">
          <Events onScroll={onScroll} />
        </div>
      </div>}
  </ScrollSync>

export default Schedule
