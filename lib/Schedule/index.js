'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactVirtualized = require('react-virtualized');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _util = require('./util');

var _Events = require('./Events');

var _Events2 = _interopRequireDefault(_Events);

var _Days = require('./Days');

var _Days2 = _interopRequireDefault(_Days);

require('./bootstrap.css');

require('./tachyons.min.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schedule = function Schedule(_ref) {
  var events = _ref.events,
      onUpdate = _ref.onUpdate;
  return _react2.default.createElement(
    _reactVirtualized.ScrollSync,
    null,
    function (_ref2) {
      var scrollLeft = _ref2.scrollLeft,
          onScroll = _ref2.onScroll,
          scrollWidth = _ref2.scrollWidth;
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'h1',
          { className: 'tc mb3' },
          (0, _moment2.default)().add((0, _util.getHourCount)(scrollLeft), 'hours').format('MMMM YYYY')
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'relative center ba b--light-gray br3 overflow-hidden',
            style: { width: '1512px', height: '600px' }
          },
          _react2.default.createElement(
            'div',
            { className: 'absolute top-0 left-0' },
            _react2.default.createElement(_Days2.default, {
              height: 600,
              scrollLeft: scrollLeft,
              scrollWidth: scrollWidth
            })
          ),
          _react2.default.createElement(
            'div',
            { className: 'absolute top-0 left-0' },
            _react2.default.createElement(_Events2.default, { events: events, onScroll: onScroll, onUpdate: onUpdate })
          )
        )
      );
    }
  );
};

exports.default = Schedule;