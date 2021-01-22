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
exports.lastDayOfMonth = exports.calendarDateEqual = exports.calendarDateLessThan = exports.addCalendarDays = exports.addCalendarMonths = void 0;
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
// difference in months
// difference in days
// order (and therefore equality)
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
