import React from 'react'

const TimeBox = ({ time }) =>
  <div
    className="relative"
    style={{
      height: '33px',
      width: '85px',
      backgroundColor: '#4A4A4A',
      borderRadius: '4px',
      boxShadow: '1px 2px 2px #c8c8c8'
    }}
  >
    <div className="white w-100 tc f6" style={{ lineHeight: '33px' }}>
      {time}
    </div>
    <div
      className="absolute"
      style={{
        bottom: '-10px',
        left: '22px',
        width: '0px',
        height: '0px',
        borderLeft: '20px solid transparent',
        borderRight: '20px solid transparent',
        borderTop: '20px solid #4A4A4A'
      }}
    />
  </div>

export default TimeBox
