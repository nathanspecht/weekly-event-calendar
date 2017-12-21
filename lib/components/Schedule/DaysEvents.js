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

var _assignRows = require('./row-computer/assign-rows');

var _assignRows2 = _interopRequireDefault(_assignRows);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var sortedIds = (0, _ramda.compose)((0, _ramda.sortBy)(_ramda.identity), _ramda.keys);

var objCount = (0, _ramda.compose)(_ramda.length, _ramda.values);

var DaysEvents = function (_Component) {
  _inherits(DaysEvents, _Component);

  function DaysEvents(props) {
    _classCallCheck(this, DaysEvents);

    var _this = _possibleConstructorReturn(this, (DaysEvents.__proto__ || Object.getPrototypeOf(DaysEvents)).call(this, props));

    _initialiseProps.call(_this);

    _this.state = {
      extraCells: 0,
      isDragging: false,
      scrollLeft: undefined,
      numDays: 365
    };
    return _this;
  }

  _createClass(DaysEvents, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.props.onUpdate((0, _assignRows2.default)({ events: this.props.events })).then(function () {
        _this2.updateCollection();
      });
    }

    // increaseScroll = () => {
    //   this.setState({ scrollLeft: this.props.actualScrollLeft + 5 }, () => {
    //     this.scrollAnimation = requestAnimationFrame(this.increaseScroll)
    //   })
    // }
    //

  }, {
    key: 'updateCollection',
    value: function updateCollection() {
      this.setState({ extraCells: this.state.extraCells >= 1 ? 0 : 1 });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var events = this.props.events;

      var cellCount = this.state.numDays + this.eventsCellCount();
      var cellSizeAndPositionGetter = this.cellSizeAndPositionGetter(events);

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_reactVirtualized.Collection, {
          onScroll: function onScroll(args) {
            _this3.props.onScroll(args);
            /* this.updateNumDays(args) */
          },
          ref: function ref(collection) {
            return _this3.collection = collection;
          },
          cellCount: cellCount,
          cellRenderer: this.cellRenderer,
          cellSizeAndPositionGetter: cellSizeAndPositionGetter,
          verticalOverscanSize: this.maxRow * 75 + 50,
          scrollLeft: this.state.scrollLeft,
          height: 600,
          width: 1500,
          style: { outline: 'none' }
        })
      );
    }
  }]);

  return DaysEvents;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
  var _this4 = this;

  this.updateRows = function (props) {
    return _this4.props.onUpdate((0, _assignRows2.default)(props || _this4.props)).then(function () {
      _this4.updateCollection();
    });
  };

  this.componentWillReceiveProps = function (nextProps) {
    if (objCount(nextProps.events) !== objCount(_this4.props.events)) {
      _this4.updateRows(nextProps);
    }
    if (typeof nextProps.scrollLeft === 'number') {
      // const numDays = Math.ceil((nextProps.scrollLeft + 2000) / 216)
      // this.setState({ numDays }, () => {
      //   this.updateCollection()
      _this4.setState({ scrollLeft: nextProps.scrollLeft });
      // })
    } else {
      _this4.setState({ scrollLeft: nextProps.scrollLeft });
    }
  };

  this.positionEvents = function () {
    var events = _this4.props.events;

    var ids = sortedIds(events);

    return ids.map(function (id) {
      var event = events[id];
      var row = parseInt(event.row);
      var y = row * 75;
      var x = (0, _util.getPixelCount)((0, _moment2.default)().startOf('day'), event.rangeStart);
      var width = (0, _util.getPixelCount)(event.rangeStart, event.rangeEnd);
      var height = 70;
      return { id: id, y: y, x: x, width: width, height: height };
    });
  };

  this.cellRenderer = function (_ref) {
    var key = _ref.key,
        style = _ref.style,
        index = _ref.index;
    var numDays = _this4.state.numDays;

    if (index < numDays) {
      return _this4.weekDayCellRenderer({ key: key, style: style, index: index });
    }
    var adjustedIndex = index - numDays;
    var events = _this4.props.events;
    var ids = sortedIds(events);
    var id = ids[adjustedIndex];
    if (!id) {
      return _react2.default.createElement('div', { id: 'phantom', key: key, style: style });
    }
    var event = events[id];
    var translateY = style.top;
    return _react2.default.createElement(
      'div',
      { key: key },
      _react2.default.createElement(_Event2.default, {
        moveToTop: _this4.moveToTop,
        handleDrag: _this4.handleDrag,
        scrollTop: _this4.props.scrollTop,
        scrollLeft: _this4.props.actualScrollLeft,
        event: _extends({}, event, { row: (style.top - 50) / 75 }),
        onClick: _this4.props.onEventClick,
        translateY: translateY,
        handleStop: _this4.handleStop,
        style: _extends({}, style, { top: 0 }),
        handleStart: _this4.handleStart,
        isDragging: _this4.state.isDragging,
        describeEvent: _this4.props.describeEvent
      })
    );
  };

  this.cellSizeAndPositionGetter = function (events) {
    _this4.maxRow = _ramda2.default.reduce(_ramda2.default.max, 0, _ramda2.default.map(_ramda2.default.prop('row'), (0, _ramda.values)(events)));
    var positionedEvents = _this4.positionEvents(events);
    return function (_ref2) {
      var index = _ref2.index;

      var numDays = _this4.state.numDays;
      if (index < numDays) {
        return _this4.weekDayCellSizeAndPositionGetter({ index: index });
      }
      var adjustedIndex = index - numDays;
      var datum = positionedEvents[adjustedIndex];
      if (!datum) return {
        height: 50,
        width: 50,
        x: 0,
        y: Math.max(550, (_this4.maxRow || 0) * 75 + 50)
      };

      return {
        height: datum.height,
        width: datum.width,
        x: datum.x,
        y: (datum.y || 0) + 50
      };
    };
  };

  this.handleStop = function (extend) {
    return function (_, drag, event) {
      cancelAnimationFrame(_this4.scrollAnimation);
      var pixelOffset = drag.x;
      var hourOffset = (0, _util.getHourCount)(pixelOffset);
      var updatedEvent = _extends({}, event, {
        rangeStart: extend !== 'END' ? (0, _moment2.default)(event.rangeStart).add(hourOffset, 'hours') : event.rangeStart,
        rangeEnd: extend !== 'START' ? (0, _moment2.default)(event.rangeEnd).add(hourOffset, 'hours') : event.rangeEnd
      });
      var nextEvents = (0, _assignRows2.default)({
        events: _extends({}, _this4.props.events, _defineProperty({}, event.id, updatedEvent))
      });
      var update = _this4.props.onUpdate(nextEvents);
      if (update instanceof Promise) {
        // update with predicted events
        _this4.setState({ predictedEvents: nextEvents, isDragging: false });
        _this4.updateCollection();

        update.then(function () {
          // update with actual events
          _this4.setState({ predictedEvents: null });
          _this4.updateCollection();
        });
      } else {
        _this4.setState({ isDragging: false });
        _this4.updateCollection();
      }
    };
  };

  this.handleStart = function (id) {
    var updatedEvents = (0, _assignRows2.default)({
      events: _this4.props.events,
      isolateId: id
    });
    var eventsWithRows = _this4.props.onUpdate(updatedEvents).then(function () {
      _this4.setState({ isDragging: id }, function () {
        return _this4.updateCollection();
      });
    });
  };

  this.updateNumDays = function (_ref3) {
    // if (scrollLeft + 1512 >= scrollWidth || scrollLeft + 1512 >= 216 * 6) {
    //   const numDays = Math.ceil((scrollWidth + 1512) / 216)
    //   this.setState({
    //     numDays: Math.min(365, numDays)
    //   })
    //   this.updateCollection()
    // }

    var scrollWidth = _ref3.scrollWidth,
        scrollLeft = _ref3.scrollLeft;
  };

  this.weekDayCellRenderer = function (_ref4) {
    var key = _ref4.key,
        style = _ref4.style,
        index = _ref4.index;

    var day = (0, _moment2.default)().startOf('day').add(index, 'days');
    var dayFormatted = day.format('ddd M/DD');
    var color = {
      backgroundColor: (0, _moment2.default)().isSame(day, 'day') ? 'rgb(239,247,255)' : 'white'
    };
    return _react2.default.createElement(
      'div',
      {
        style: _extends({}, style, color, {
          zIndex: -1
        }),
        key: dayFormatted + ' ' + index,
        className: 'br b--light-gray top-0 h-100'
      },
      _react2.default.createElement(
        'div',
        { className: 'bg-white w-100 tc pa2 bb b--light-gray', style: color },
        dayFormatted
      )
    );
  };

  this.weekDayCellSizeAndPositionGetter = function (_ref5) {
    var index = _ref5.index;

    var sizeAndPosition = {
      height: _this4.props.scrollHeight,
      width: 216,
      x: 216 * index,
      y: 0
    };
    return sizeAndPosition;
  };

  this.eventsCellCount = function () {
    return (0, _ramda.values)(_this4.props.events).length + _this4.state.extraCells + 2;
  };

  this.sortEvents = function () {
    var sortedEvents = (0, _assignRows2.default)({
      events: _this4.props.events,
      sortByProp: 'timestamp'
    });
    _this4.props.onUpdate(sortedEvents).then(function () {
      return _this4.updateCollection();
    });
  };

  this.handleDrag = function (offsetX) {
    // const dir = R.clamp(-1, 1)(offsetX)
    // this.setState(
    //   {
    //     scrollLeft: this.props.actualScrollLeft + 20 * dir
    //   },
    //   () => this.setState({ scrollLeft: undefined })
    // )
  };

  this.moveToTop = function (id) {
    _this4.props.onUpdate((0, _assignRows2.default)({
      events: _this4.props.events,
      moveToTopId: id
    })).then(function () {
      return _this4.updateCollection();
    });
  };
};

exports.default = DaysEvents;