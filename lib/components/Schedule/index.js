'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ramda = require('ramda');

var _reactVirtualized = require('react-virtualized');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _util = require('./util');

var _Events = require('./Events');

var _Events2 = _interopRequireDefault(_Events);

var _Days = require('./Days');

var _Days2 = _interopRequireDefault(_Days);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Schedule = function (_Component) {
  _inherits(Schedule, _Component);

  function Schedule(props) {
    _classCallCheck(this, Schedule);

    var _this = _possibleConstructorReturn(this, (Schedule.__proto__ || Object.getPrototypeOf(Schedule)).call(this, props));

    _this.goTo = function (pixelCount) {
      console.log('Going to: ', pixelCount);
      _this.setState({ scrollLeft: pixelCount }, function () {
        _this.setState({ scrollLeft: undefined });
      });
    };

    _this.scrollToTime = function (unit) {
      return function (num, currentDate) {
        var a = (0, _moment2.default)().startOf('day');
        var b = (0, _ramda.invoker)(1, unit)(num, currentDate.startOf('month'));
        var pixelDiff = (0, _util.getPixelCount)(a, b);
        _this.goTo(pixelDiff < 0 ? 0 : pixelDiff);
      };
    };

    _this.state = {
      scrollLeft: undefined
    };
    return _this;
  }

  _createClass(Schedule, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          events = _props.events,
          onUpdate = _props.onUpdate,
          onEventClick = _props.onEventClick,
          describeEvent = _props.describeEvent;

      return _react2.default.createElement(
        _reactVirtualized.ScrollSync,
        null,
        function (_ref) {
          var scrollLeft = _ref.scrollLeft,
              onScroll = _ref.onScroll,
              scrollWidth = _ref.scrollWidth;

          var currentDate = (0, _moment2.default)().startOf('day').add((0, _util.getHourCount)(scrollLeft), 'hours');
          return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'h1',
              { className: 'tc mb3' },
              _react2.default.createElement(
                'button',
                { onClick: function onClick() {
                    return _this2.goTo(0);
                  } },
                'Now'
              ),
              _react2.default.createElement(
                'select',
                {
                  value: currentDate.month(),
                  onChange: function onChange(event) {
                    return _this2.scrollToTime('month')(event.target.value, currentDate);
                  }
                },
                _moment2.default.months().map(function (month, idx) {
                  return _react2.default.createElement(
                    'option',
                    { value: idx, key: idx },
                    month
                  );
                })
              ),
              _react2.default.createElement(
                'select',
                {
                  value: currentDate.year(),
                  onChange: function onChange(event) {
                    return _this2.scrollToTime('year')(event.target.value, currentDate);
                  }
                },
                (0, _ramda.times)(_ramda.identity, 6).map(function (idx) {
                  var year = (0, _moment2.default)().year() + idx;
                  return _react2.default.createElement(
                    'option',
                    { value: year, key: year },
                    year
                  );
                })
              )
            ),
            _react2.default.createElement(
              'div',
              {
                className: 'relative center ba b--light-gray br3 overflow-hidden',
                style: { width: '1512px', height: '637px' }
              },
              _react2.default.createElement(
                'div',
                { className: 'absolute top-0 left-0' },
                _react2.default.createElement(_Days2.default, {
                  height: 637,
                  scrollLeft: scrollLeft,
                  scrollWidth: scrollWidth
                })
              ),
              _react2.default.createElement(
                'div',
                { className: 'absolute left-0 top-0 h-100 w-100' },
                _react2.default.createElement(
                  'div',
                  { className: 'absolute', style: { top: '37px' } },
                  _react2.default.createElement(_Events2.default, {
                    events: events,
                    onScroll: onScroll,
                    onUpdate: onUpdate,
                    describeEvent: describeEvent,
                    onEventClick: onEventClick,
                    scrollLeft: _this2.state.scrollLeft
                  })
                )
              )
            )
          );
        }
      );
    }
  }]);

  return Schedule;
}(_react.Component);

exports.default = Schedule;