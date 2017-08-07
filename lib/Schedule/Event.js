'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDraggable = require('react-draggable');

var _reactDraggable2 = _interopRequireDefault(_reactDraggable);

var _TimeBox = require('./TimeBox');

var _TimeBox2 = _interopRequireDefault(_TimeBox);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Event = function (_Component) {
  _inherits(Event, _Component);

  function Event(props) {
    _classCallCheck(this, Event);

    var _this = _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).call(this, props));

    _this.handleStart = function (extendDir) {
      return function () {
        _this.props.handleStart();
        _this.setState({ extendDir: extendDir, isSelfDragging: true });
      };
    };

    _this.handleDrag = function (_, drag) {
      _this.setState({ extendAmt: drag.x });
    };

    _this.handleStop = function (extendDir) {
      return function (event, drag) {
        _this.props.handleStop(extendDir)(event, drag);
        _this.setState({ extendDir: null, extendAmt: 0, isSelfDragging: false });
      };
    };

    _this.getWidth = function (styleWidth) {
      if (!_this.state.extendDir) return styleWidth;
      if (_this.state.extendDir === 'END') return styleWidth + _this.state.extendAmt;
      if (_this.state.extendDir === 'START') {
        return styleWidth - _this.state.extendAmt;
      }
    };

    _this.getLeft = function (styleLeft) {
      if (!_this.state.extendDir) return styleLeft;
      if (_this.state.extendDir === 'END') return styleLeft;
      if (_this.state.extendDir === 'START') {
        return styleLeft + _this.state.extendAmt;
      }
    };

    _this.state = {
      extendDir: null,
      extendAmt: 0,
      isSelfDragging: false
    };
    return _this;
  }

  _createClass(Event, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          event = _props.event,
          style = _props.style,
          handleStop = _props.handleStop,
          translateY = _props.translateY;

      var left = this.getLeft(style.left);
      var width = this.getWidth(style.width);
      var isUnfocused = this.props.isDragging && !this.state.isSelfDragging;
      var opacity = isUnfocused ? 0.5 : 1;
      var zIndex = isUnfocused ? -10 : 10;
      var hourOffset = (0, _util.getHourCount)(this.state.extendAmt);

      return _react2.default.createElement(
        'div',
        {
          style: {
            transform: 'translate3d(0, ' + translateY + 'px, 0)',
            transition: 'transform 0.5s',
            willChange: 'transform'
          }
        },
        _react2.default.createElement(
          _reactDraggable2.default,
          {
            axis: 'x',
            cancel: '#extend',
            onStart: this.handleStart(),
            onStop: this.handleStop(),
            onDrag: this.handleDrag,
            position: { x: 0, y: 0 }
          },
          _react2.default.createElement(
            'div',
            { style: { opacity: opacity, zIndex: zIndex } },
            _react2.default.createElement(
              'div',
              {
                key: event._id,
                id: event._id,
                className: 'bg-light-gray br3 pt3 pl3',
                style: _extends({}, style, {
                  width: width,
                  left: left
                })
              },
              _react2.default.createElement(
                'div',
                { className: 'ml1', style: { zIndex: zIndex + 1 } },
                _react2.default.createElement(
                  'div',
                  { className: 'f5 truncate' },
                  (0, _moment2.default)(event.rangeStart).add(this.state.extendDir === 'END' ? 0 : hourOffset, 'hours').format('MMMM D @ h A')
                ),
                _react2.default.createElement(
                  'div',
                  { className: 'f6 lh-copy' },
                  event._id
                )
              )
            ),
            _react2.default.createElement(
              'div',
              {
                className: '',
                style: _extends({}, style, { transition: 'top 0.5s', zIndex: zIndex })
              },
              _react2.default.createElement(
                'div',
                { id: 'extend' },
                _react2.default.createElement(
                  _reactDraggable2.default,
                  {
                    axis: 'x',
                    position: { x: 0, y: 0 },
                    onDrag: this.handleDrag,
                    onStart: this.handleStart('START'),
                    onStop: this.handleStop('START')
                  },
                  _react2.default.createElement(
                    'div',
                    {
                      style: { cursor: 'ew-resize', zIndex: zIndex },
                      className: 'absolute h-100 w1 left-0 top-0 br3 br--left'
                    },
                    this.state.extendDir === 'START' && _react2.default.createElement(
                      'div',
                      null,
                      _react2.default.createElement('div', {
                        className: 'absolute',
                        style: {
                          height: '120%',
                          width: '2px',
                          top: '-11%',
                          left: '-1px',
                          backgroundColor: '#979797'
                        }
                      }),
                      _react2.default.createElement(
                        'div',
                        {
                          className: 'absolute',
                          style: { right: '-27px', top: '-45px' }
                        },
                        _react2.default.createElement(_TimeBox2.default, {
                          time: (0, _moment2.default)(event.rangeStart).add(this.state.extendDir === 'START' ? hourOffset : 0, 'hours').format('h A')
                        })
                      )
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'div',
                { id: 'extend' },
                _react2.default.createElement(
                  _reactDraggable2.default,
                  {
                    axis: 'x',
                    position: { x: 0, y: 0 },
                    onDrag: this.handleDrag,
                    onStart: this.handleStart('END'),
                    onStop: this.handleStop('END')
                  },
                  _react2.default.createElement(
                    'div',
                    {
                      style: { cursor: 'ew-resize', zIndex: zIndex },
                      className: 'absolute h-100 w1 right-0 top-0 br3 br--right'
                    },
                    this.state.extendDir === 'END' && _react2.default.createElement(
                      'div',
                      null,
                      _react2.default.createElement('div', {
                        className: 'absolute',
                        style: {
                          height: '120%',
                          width: '2px',
                          top: '-11%',
                          right: '-1px',
                          backgroundColor: '#979797'
                        }
                      }),
                      _react2.default.createElement(
                        'div',
                        {
                          className: 'absolute',
                          style: { left: '-26px', top: '-45px' }
                        },
                        _react2.default.createElement(_TimeBox2.default, {
                          time: (0, _moment2.default)(event.rangeEnd).add(this.state.extendDir === 'END' ? hourOffset : 0, 'hours').format('h A')
                        })
                      )
                    )
                  )
                )
              )
            )
          )
        )
      );
    }
  }]);

  return Event;
}(_react.Component);

exports.default = Event;