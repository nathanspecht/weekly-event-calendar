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

var _DefaultDropdown = require('./DefaultDropdown');

var _DefaultDropdown2 = _interopRequireDefault(_DefaultDropdown);

var _DaysEvents = require('./DaysEvents');

var _DaysEvents2 = _interopRequireDefault(_DaysEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Schedule = function (_Component) {
  _inherits(Schedule, _Component);

  function Schedule(props) {
    _classCallCheck(this, Schedule);

    var _this = _possibleConstructorReturn(this, (Schedule.__proto__ || Object.getPrototypeOf(Schedule)).call(this, props));

    _this.update = function () {
      return _this.daysEvents.updateCollection();
    };

    _this.goTo = function (pixelCount) {
      return _this.setState({ scrollLeft: pixelCount }, function () {
        return _this.setState({ scrollLeft: undefined });
      });
    };

    _this.scrollToTime = function (unit) {
      return function (num, currentDate) {
        var a = (0, _moment2.default)().startOf('day');
        var b = (0, _ramda.invoker)(1, unit)(num, currentDate.startOf('month'));
        var c = (0, _moment2.default)(a).add(1, 'year');
        var d = b.isBefore(c) ? b : c;
        var pixelDiff = (0, _util.getPixelCount)(a, d);
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

      var Dropdown = this.props.Dropdown || _DefaultDropdown2.default;
      var Button = this.props.Button || _react2.default.createElement('button', null);

      return _react2.default.createElement(
        _reactVirtualized.ScrollSync,
        null,
        function (_ref) {
          var scrollTop = _ref.scrollTop,
              scrollLeft = _ref.scrollLeft,
              onScroll = _ref.onScroll,
              scrollWidth = _ref.scrollWidth,
              scrollHeight = _ref.scrollHeight;

          var currentDate = (0, _moment2.default)().startOf('day').add((0, _util.getHourCount)(scrollLeft), 'hours');
          var monthOptions = _moment2.default.months().map(function (month, idx) {
            return {
              value: idx,
              key: idx,
              text: month,
              disabled: (0, _moment2.default)(currentDate).month(idx).isAfter((0, _moment2.default)().startOf('month').add(1, 'year')) || (0, _moment2.default)(currentDate).month(idx).isBefore((0, _moment2.default)().startOf('day'))
            };
          });
          var yearOptions = (0, _ramda.times)(_ramda.identity, 2).map(function (idx) {
            var year = (0, _moment2.default)().year() + idx;
            return {
              value: year,
              key: year,
              text: year
            };
          });

          var monthProps = {
            value: currentDate.month(),
            onChange: function onChange(_, _ref2) {
              var value = _ref2.value;
              return _this2.scrollToTime('month')(value, currentDate);
            },
            options: monthOptions
          };
          var todayProps = {
            onClick: function onClick() {
              return _this2.goTo(0);
            }
          };
          var yearProps = {
            value: currentDate.year(),
            onChange: function onChange(_, _ref3) {
              var value = _ref3.value;
              return _this2.scrollToTime('year')(value, currentDate);
            },
            options: yearOptions
          };
          return _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
              'div',
              { className: 'tc mb3 flex flex-row justify-center' },
              _react2.default.createElement(
                'div',
                { className: 'ph2' },
                typeof Button === 'function' ? _react2.default.createElement(
                  Button,
                  todayProps,
                  'Today'
                ) : _react2.default.cloneElement(Button, todayProps, 'Today')
              ),
              _react2.default.createElement(
                'div',
                { className: 'ph2' },
                typeof Dropdown === 'function' ? _react2.default.createElement(Dropdown, monthProps) : _react2.default.cloneElement(Dropdown, monthProps)
              ),
              _react2.default.createElement(
                'div',
                { className: 'ph2' },
                typeof Dropdown === 'function' ? _react2.default.createElement(Dropdown, yearProps) : _react2.default.cloneElement(Dropdown, yearProps)
              )
            ),
            _react2.default.createElement(
              'div',
              {
                className: 'relative center ba b--light-gray br3 overflow-hidden',
                style: { width: '1497px', height: '600px' }
              },
              _react2.default.createElement(
                'div',
                { className: 'absolute left-0 top-0 h-100 w-100' },
                _react2.default.createElement(_DaysEvents2.default, {
                  ref: function ref(daysEvents) {
                    return _this2.daysEvents = daysEvents;
                  },
                  events: events,
                  onScroll: onScroll,
                  onUpdate: onUpdate,
                  describeEvent: describeEvent,
                  onEventClick: onEventClick,
                  actualScrollLeft: scrollLeft,
                  scrollLeft: _this2.state.scrollLeft,
                  scrollTop: scrollTop,
                  scrollHeight: scrollHeight,
                  scrollWidth: scrollWidth,
                  height: scrollHeight
                })
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