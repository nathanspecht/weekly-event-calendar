import React from 'react'
import { ScrollSync } from 'react-virtualized'
import moment from 'moment'
import { getHourCount } from '../util'
import Events from './Events'
import Days from './Days'

const Schedule = () =>
  <ScrollSync>
    {({ scrollLeft, onScroll, scrollWidth }) =>
      <div>
        <h1 className="tc mb3">
          {moment().add(getHourCount(scrollLeft), 'hours').format('MMMM YYYY')}
        </h1>
        <div
          className="relative center ba b--light-gray br3 overflow-hidden"
          style={{ width: '1512px', height: '600px' }}
        >
          <div className="absolute top-0 left-0">
            <Days
              height={600}
              scrollLeft={scrollLeft}
              scrollWidth={scrollWidth}
            />
          </div>
          <div className="absolute top-0 left-0">
            <Events onScroll={onScroll} />
          </div>
        </div>
      </div>}
  </ScrollSync>

export default Schedule
