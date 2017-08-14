'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DefaultDropdown = function DefaultDropdown(_ref) {
  var value = _ref.value,
      onChange = _ref.onChange,
      options = _ref.options;
  return _react2.default.createElement(
    'select',
    {
      value: value,
      onChange: onChange
    },
    options.map(function (_ref2) {
      var key = _ref2.key,
          text = _ref2.text,
          value = _ref2.value;
      return _react2.default.createElement(
        'option',
        { value: value, key: key || value },
        text
      );
    })
  );
};

exports.default = DefaultDropdown;