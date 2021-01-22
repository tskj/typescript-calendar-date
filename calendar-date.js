"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.lastDayOfMonth = exports.dayOfWeek = exports.differenceInCalendarDays = exports.differenceInCalendarMonths = exports.binarySearch = exports.exponentialSearch = exports.calendarDateEqual = exports.calendarDateLessThan = exports.addCalendarDays = exports.addCalendarMonths = void 0;
var consts_1 = require("./consts");
var utils_1 = require("./utils");
var isLeapYear = function (_a) {
    var year = _a.year;
    if (year % 400 === 0) {
        return true;
    }
    if (year % 100 === 0) {
        return false;
    }
    if (year % 4 === 0) {
        return true;
    }
    return false;
};
var numberOfDaysInMonth = function (_a) {
    var year = _a.year, month = _a.month;
    switch (month) {
        case 'jan':
            return 31;
        case 'feb':
            if (isLeapYear({ year: year })) {
                return 29;
            }
            else {
                return 28;
            }
        case 'mar':
            return 31;
        case 'apr':
            return 30;
        case 'may':
            return 31;
        case 'jun':
            return 30;
        case 'jul':
            return 31;
        case 'aug':
            return 31;
        case 'sep':
            return 30;
        case 'oct':
            return 31;
        case 'nov':
            return 30;
        case 'dec':
            return 31;
    }
};
exports.addCalendarMonths = function (_a, months) {
    var year = _a.year, month = _a.month;
    var monthNumberZeroIndexed = consts_1.monthNumber(month) - 1;
    return {
        year: year + Math.floor((monthNumberZeroIndexed + months) / 12),
        month: consts_1.monthName(utils_1.mod(monthNumberZeroIndexed + months, 12) + 1)
    };
};
exports.addCalendarDays = function (_a, days) {
    var year = _a.year, month = _a.month, day = _a.day;
    if (days < 0) {
        var daysToRemove = -days;
        if (daysToRemove < day) {
            return {
                year: year,
                month: month,
                day: day - daysToRemove
            };
        }
        else {
            var prevMonth = exports.addCalendarMonths({ year: year, month: month }, -1);
            return exports.addCalendarDays(__assign(__assign({}, prevMonth), { day: numberOfDaysInMonth(prevMonth) }), -(daysToRemove - day));
        }
    }
    var daysLeftInMonth = numberOfDaysInMonth({ year: year, month: month }) - day;
    if (days <= daysLeftInMonth) {
        return { year: year, month: month, day: day + days };
    }
    else {
        return exports.addCalendarDays(__assign(__assign({}, exports.addCalendarMonths({ year: year, month: month }, 1)), { day: 0 }), days - daysLeftInMonth);
    }
};
exports.calendarDateLessThan = function (a, b) {
    if (a.year < b.year) {
        return true;
    }
    if (a.year === b.year) {
        if (consts_1.monthNumber(a.month) < consts_1.monthNumber(b.month)) {
            return true;
        }
        if (a.month === b.month) {
            if (a.day < b.day) {
                return true;
            }
        }
    }
    return false;
};
exports.calendarDateEqual = function (a, b) {
    return !exports.calendarDateLessThan(a, b) && !exports.calendarDateLessThan(b, a);
};
exports.exponentialSearch = function (pred) {
    var atZero = pred(0);
    var n = 1;
    while (true) {
        if (pred(n) !== atZero) {
            break;
        }
        if (pred(-n) !== atZero) {
            n *= -1;
            break;
        }
        n *= 2;
    }
    if (n < 0) {
        return [n, 0];
    }
    else {
        return [0, n];
    }
};
exports.binarySearch = function (pred, _a) {
    var start = _a[0], end = _a[1];
    if (pred(end)) {
        return end;
    }
    var middle = Math.floor((start + end) / 2);
    var atMiddle = pred(middle);
    if (atMiddle) {
        return exports.binarySearch(pred, [middle, end - 1]);
    }
    else {
        return exports.binarySearch(pred, [start, middle - 1]);
    }
};
var solve = function (pred) {
    var range = exports.exponentialSearch(pred);
    return exports.binarySearch(pred, range);
};
exports.differenceInCalendarMonths = function (a, b) {
    var lteq = function (a, b) {
        return exports.calendarDateLessThan(__assign(__assign({}, a), { day: 1 }), __assign(__assign({}, b), { day: 1 })) ||
            exports.calendarDateEqual(__assign(__assign({}, a), { day: 1 }), __assign(__assign({}, b), { day: 1 }));
    };
    var n = solve(function (n) { return lteq(exports.addCalendarMonths(a, n), b); });
    return n;
};
exports.differenceInCalendarDays = function (a, b) {
    var lteq = function (a, b) {
        return exports.calendarDateLessThan(a, b) || exports.calendarDateEqual(a, b);
    };
    var n = solve(function (n) { return lteq(exports.addCalendarDays(a, n), b); });
    return n;
};
exports.dayOfWeek = function (_a) {
    var year = _a.year, month = _a.month, day = _a.day;
    // monday
    var firstOf2021 = { year: 2021, month: 'jan', day: 4 };
    var diff = exports.differenceInCalendarDays(firstOf2021, { year: year, month: month, day: day });
    return consts_1.weekDays[utils_1.mod(diff, 7)];
};
// difference in months
// difference in days
// day of week
// wanna add years? Do it yourself
// parsing and formating? Do it yourself
exports.lastDayOfMonth = function (_a) {
    var year = _a.year, month = _a.month;
    return ({
        year: year,
        month: month,
        day: numberOfDaysInMonth({ year: year, month: month })
    });
};
