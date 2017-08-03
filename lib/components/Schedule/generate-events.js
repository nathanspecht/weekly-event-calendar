'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var a = function a(f, t, _id, atStart) {
  var addDays = _ramda2.default.compose(_ramda2.default.cond([[_ramda2.default.always(atStart), _ramda2.default.invoker(1, 'startOf')('day')], [_ramda2.default.T, _ramda2.default.identity]]), function (d) {
    return (0, _moment2.default)().add(d, 'days');
  });

  return {
    _id: _id,
    rangeStart: addDays(f),
    rangeEnd: addDays(t)
  };
};

var createEvents = function createEvents(num) {
  var b = {};
  for (var i = 0; i < num; i++) {
    var _id = 'a' + Math.random();
    Object.assign(b, _defineProperty({}, _id, a(4, 5, _id)));
  }
  return b;
};

var events = {
  a: {
    _id: 'a',
    rangeStart: (0, _moment2.default)('2017-08-07T12:00:00.000'),
    rangeEnd: (0, _moment2.default)('2017-08-11T12:00:00.000')
  },
  b: {
    _id: 'b',
    rangeStart: (0, _moment2.default)('2017-08-08T12:00:00.000'),
    rangeEnd: (0, _moment2.default)('2017-08-11T17:00:00.000')
  },
  c: {
    _id: 'c',
    rangeStart: (0, _moment2.default)('2017-08-05T12:00:00.000'),
    rangeEnd: (0, _moment2.default)('2017-08-09T00:00:00.000')
  },
  d: {
    _id: 'd',
    rangeStart: (0, _moment2.default)('2017-08-09T12:00:00.000'),
    rangeEnd: (0, _moment2.default)('2017-08-13T00:00:00.000')
  },
  e: {
    _id: 'e',
    rangeStart: (0, _moment2.default)().add(1, 'day'),
    rangeEnd: (0, _moment2.default)().add(3, 'days')
  },
  g: a(3, 10, 'g', true),
  h: a(2, 4, 'h', true),
  i: a(2, 4, 'i', false),
  j: a(2, 4, 'j', true)
};

exports.default = events;