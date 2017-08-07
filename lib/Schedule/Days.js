'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _ramda = require('ramda');

var _reactVirtualized = require('react-virtualized');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var weekStart = (0, _moment2.default)('2017-08-06T00:00:00.000');
var weekEnd = (0, _moment2.default)('2017-08-13T00:00:00.000');

var WIDTH = 1512;

var Days = function (_Component) {
  _inherits(Days, _Component);

  function Days() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Days);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Days.__proto__ || Object.getPrototypeOf(Days)).call.apply(_ref, [this].concat(args))), _this), _this.weekDayCellRenderer = function (_ref2) {
      var key = _ref2.key,
          style = _ref2.style,
          index = _ref2.index;

      var day = (0, _moment2.default)().startOf('day').add(index, 'days').format('ddd M/DD');

      return _react2.default.createElement(
        'div',
        {
          style: style,
          key: '' + day + index,
          className: 'br b--light-gray top-0 h-100'
        },
        _react2.default.createElement(
          'div',
          { className: 'w-100 tc pa2 bb b--light-gray' },
          day
        )
      );
    }, _this.weekDayCellSizeAndPositionGetter = function (_ref3) {
      var index = _ref3.index;
      return {
        height: _this.props.height,
        width: 216,
        x: 216 * index,
        y: 0
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Days, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactVirtualized.Collection, {
        scrollLeft: this.props.scrollLeft,
        className: 'br b--light-gray',
        cellRenderer: this.weekDayCellRenderer,
        cellSizeAndPositionGetter: this.weekDayCellSizeAndPositionGetter,
        height: this.props.height,
        width: WIDTH,
        cellCount: Math.ceil(this.props.scrollWidth / 216)
      });
    }
  }]);

  return Days;
}(_react.Component);

exports.default = Days;