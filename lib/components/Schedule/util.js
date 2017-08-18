'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doesOverlap = exports.isBetween = exports.getHourCount = exports.getPixelCount = exports.numHours = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var numHours = exports.numHours = function numHours(rangeStart, rangeEnd) {
  return Math.floor(_moment2.default.duration((0, _moment2.default)(rangeEnd).diff((0, _moment2.default)(rangeStart))).asHours());
};

var getPixelCount = exports.getPixelCount = function getPixelCount(rangeStart, rangeEnd) {
  return 9 * numHours(rangeStart, rangeEnd);
};

var getHourCount = exports.getHourCount = function getHourCount(pixelCount) {
  return Math.round(pixelCount / 9);
};

var isBetween = exports.isBetween = function isBetween(date, event, inclusivity) {
  return (0, _moment2.default)(date).isBetween(event.rangeStart, event.rangeEnd, null, inclusivity);
};

var doesOverlap = exports.doesOverlap = function doesOverlap(event1) {
  return function (event2) {
    return isBetween(event1.rangeStart, event2, '[]') || isBetween(event1.rangeEnd, event2, '[]') || isBetween(event2.rangeStart, event1, '[]') || isBetween(event2.rangeEnd, event1, '[]');
  };
};