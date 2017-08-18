'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isBetween = function isBetween(date, event, inclusivity) {
  return (0, _moment2.default)(date).isBetween(event.rangeStart, event.rangeEnd, null, inclusivity);
};

var doesOverlap = function doesOverlap(event1) {
  return function (event2) {
    return isBetween(event1.rangeStart, event2, '[]') || isBetween(event1.rangeEnd, event2, '[]') || isBetween(event2.rangeStart, event1, '[]') || isBetween(event2.rangeEnd, event1, '[]');
  };
};

var timestamp = _ramda2.default.compose(_ramda2.default.invoker(0, 'unix'), _moment2.default, _ramda2.default.prop('rangeStart'));

var sortBy = function sortBy(prop) {
  return _ramda2.default.sortWith(prop === 'timestamp' ? [_ramda2.default.ascend(timestamp), _ramda2.default.ascend(_ramda2.default.prop('_id'))] : [_ramda2.default.ascend(_ramda2.default.prop(prop))]);
};

var assignRow = function assignRow(rows, _ref) {
  var isolateId = _ref.isolateId,
      isolateRow = _ref.isolateRow,
      moveToTopId = _ref.moveToTopId;
  return function (acc, event) {
    if (moveToTopId && moveToTopId === event._id) {
      return _ramda2.default.assoc(event._id, _extends({}, event, { row: 0 }), acc);
    }
    if (isolateId && isolateId === event._id) {
      return _ramda2.default.assoc(event._id, _extends({}, event, { row: isolateRow }), acc);
    }

    var i = 0;
    var row = rows[i];

    while (_ramda2.default.any(doesOverlap(event))(row) || isolateId && i === isolateRow) {
      i++;
      if (!rows[i]) rows[i] = [];
      row = rows[i];
    }

    row.push(event);

    return _ramda2.default.assoc(event._id, _extends({}, event, { row: i }), acc);
  };
};

var assignRows = function assignRows(_ref2) {
  var events = _ref2.events,
      isolateId = _ref2.isolateId,
      sortByProp = _ref2.sortByProp,
      moveToTopId = _ref2.moveToTopId;

  var rows = moveToTopId ? [[events[moveToTopId]]] : [[]];

  var isolateRow = events && events[isolateId] && events[isolateId].row;

  var eventsWithRows = _ramda2.default.reduce(assignRow(rows, { isolateId: isolateId, isolateRow: isolateRow, moveToTopId: moveToTopId }), {}, sortBy('row')(_ramda2.default.values(events)));

  return eventsWithRows;
};

exports.default = assignRows;