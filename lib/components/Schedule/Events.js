'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactVirtualized = require('react-virtualized');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _assignRows = require('./assign-rows');

var _assignRows2 = _interopRequireDefault(_assignRows);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sortedIds = (0, _ramda.compose)((0, _ramda.sortBy)(_ramda.identity), _ramda.keys);

var Events = function (_Component) {
  _inherits(Events, _Component);

  function Events(props) {
    _classCallCheck(this, Events);

    var _this = _possibleConstructorReturn(this, (Events.__proto__ || Object.getPrototypeOf(Events)).call(this, props));

    _this.componentWillReceiveProps = function (nextProps) {
      if (typeof nextProps.scrollLeft === 'number') {
        _this.setState({ phantomPosition: nextProps.scrollLeft + 1500 }, function () {
          _this.updateCollection();
          _this.setState({ scrollLeft: nextProps.scrollLeft });
        });
      } else {
        _this.setState({ scrollLeft: nextProps.scrollLeft });
      }
    };

    _this.positionEvents = function () {
      var isDragging = _this.state.isDragging;

      var events = _this.props.events;
      var eventsWithRows = (0, _assignRows2.default)(events, isDragging, _this.previousRows[isDragging]);
      _this.previousRows = _ramda2.default.map(_ramda2.default.prop('row'), eventsWithRows);
      var _ids = sortedIds(events);
      return _ids.map(function (_id) {
        var event = eventsWithRows[_id];
        var y = event.row * 75;
        var x = (0, _util.getPixelCount)((0, _moment2.default)().startOf('day'), event.rangeStart);
        var width = (0, _util.getPixelCount)(event.rangeStart, event.rangeEnd);
        var height = 70;
        return { _id: _id, y: y, x: x, width: width, height: height };
      });
    };

    _this.cellRenderer = function (_ref) {
      var key = _ref.key,
          style = _ref.style,
          index = _ref.index;

      var events = _this.props.events;
      var _ids = sortedIds(events);
      var _id = _ids[index];
      if (!_id) {
        return _react2.default.createElement('div', { id: 'phantom', key: key, style: style });
      }
      var event = events[_id];
      var translateY = style.top;
      var handleStop = _this.handleStop(index);
      return _react2.default.createElement(
        'div',
        { key: key },
        _react2.default.createElement(_Event2.default, {
          scrollTop: _this.props.scrollTop,
          event: event,
          onClick: _this.props.onEventClick,
          translateY: translateY,
          handleStop: handleStop,
          style: _extends({}, style, { top: 0 }),
          handleStart: _this.handleStart,
          isDragging: _this.state.isDragging,
          describeEvent: _this.props.describeEvent
        })
      );
    };

    _this.cellSizeAndPositionGetter = function (events) {
      _this.maxRow = _ramda2.default.reduce(_ramda2.default.max, 0, _ramda2.default.map(_ramda2.default.prop('row'), (0, _ramda.values)((0, _assignRows2.default)(events))));
      var positionedEvents = _this.positionEvents(events);
      return function (_ref2) {
        var index = _ref2.index;

        var datum = positionedEvents[index];
        if (!datum) return {
          height: 50,
          width: 50,
          x: _this.state.phantomPosition + 1505,
          y: Math.max(550, _this.maxRow * 75 + 50)
        };

        return {
          height: datum.height,
          width: datum.width,
          x: datum.x,
          y: datum.y
        };
      };
    };

    _this.handleStop = function (index) {
      return function (extend) {
        return function (_, drag) {
          var _ids = sortedIds(_this.props.events);
          var _id = _ids[index];
          var event = _this.props.events[_id];
          var pixelOffset = drag.x;
          var hourOffset = (0, _util.getHourCount)(pixelOffset);
          var updatedEvent = _extends({}, event, {
            rangeStart: extend !== 'END' ? (0, _moment2.default)(event.rangeStart).add(hourOffset, 'hours') : event.rangeStart,
            rangeEnd: extend !== 'START' ? (0, _moment2.default)(event.rangeEnd).add(hourOffset, 'hours') : event.rangeEnd
          });
          var nextEvents = _extends({}, _this.props.events, _defineProperty({}, _id, updatedEvent));
          var update = _this.props.onUpdate(updatedEvent);
          if (update instanceof Promise) {
            // update with predicted events
            _this.setState({ predictedEvents: nextEvents, isDragging: false });
            _this.updateCollection();

            update.then(function () {
              // update with actual events
              _this.setState({ predictedEvents: null });
              _this.updateCollection();
            });
          } else {
            _this.setState({ isDragging: false });
            _this.updateCollection();
          }
        };
      };
    };

    _this.handleStart = function (idx) {
      return _this.setState({ isDragging: idx }, function () {
        return _this.updateCollection();
      });
    };

    _this.updatePhantomElement = function (_ref3) {
      var scrollWidth = _ref3.scrollWidth,
          scrollLeft = _ref3.scrollLeft;

      if (scrollLeft + 1512 >= scrollWidth) {
        _this.setState({ phantomPosition: scrollWidth + 1512 });
        _this.updateCollection();
      }
    };

    _this.previousRows = {};
    _this.state = {
      extraCells: 0,
      phantomPosition: 0,
      isDragging: false,
      scrollLeft: 0
    };
    return _this;
  }

  _createClass(Events, [{
    key: 'updateCollection',
    value: function updateCollection() {
      this.setState({ extraCells: this.state.extraCells >= 1 ? 0 : 1 });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var events = this.props.events;
      var cellCount = (0, _ramda.values)(events).length + this.state.extraCells + 2;
      var cellSizeAndPositionGetter = this.cellSizeAndPositionGetter(events);

      return _react2.default.createElement(_reactVirtualized.Collection, {
        onScroll: function onScroll(args) {
          _this2.props.onScroll(args);
          _this2.updatePhantomElement(args);
        },
        ref: function ref(collection) {
          return _this2.collection = collection;
        },
        cellCount: cellCount,
        cellRenderer: this.cellRenderer,
        cellSizeAndPositionGetter: cellSizeAndPositionGetter,
        verticalOverscanSize: this.maxRow * 75 + 50,
        scrollLeft: this.state.scrollLeft,
        height: 600,
        width: 1512
      });
    }
  }]);

  return Events;
}(_react.Component);

exports.default = Events;