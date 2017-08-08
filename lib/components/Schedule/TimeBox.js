'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimeBox = function TimeBox(_ref) {
  var time = _ref.time;
  return _react2.default.createElement(
    'div',
    {
      className: 'relative',
      style: {
        height: '33px',
        width: '85px',
        backgroundColor: '#4A4A4A',
        borderRadius: '4px'
      }
    },
    _react2.default.createElement(
      'div',
      { className: 'white w-100 tc f6', style: { lineHeight: '33px' } },
      time
    ),
    _react2.default.createElement('div', {
      className: 'absolute',
      style: {
        bottom: '-10px',
        left: '22px',
        width: '0px',
        height: '0px',
        borderLeft: '20px solid transparent',
        borderRight: '20px solid transparent',
        borderTop: '20px solid #4A4A4A'
      }
    })
  );
};

exports.default = TimeBox;