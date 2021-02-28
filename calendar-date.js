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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;
exports.rangeOfCalendarDates = exports.addMonthsWithClampedDay = exports.lastDateInMonth = exports.dayOfWeek = exports.numberOfCalendarDaysBetween = exports.numberOfCalendarMonthsBetween = exports.binarySearch = exports.exponentialSearch = exports.calendarDateEqual = exports.calendarDateBefore = exports.calendarMonthEqual = exports.calendarMonthBefore = exports.addCalendarDays = exports.addCalendarMonths = void 0;
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
        case "jan":
            return 31;
        case "feb":
            if (isLeapYear({ year: year })) {
                return 29;
            }
            else {
                return 28;
            }
        case "mar":
            return 31;
        case "apr":
            return 30;
        case "may":
            return 31;
        case "jun":
            return 30;
        case "jul":
            return 31;
        case "aug":
            return 31;
        case "sep":
            return 30;
        case "oct":
            return 31;
        case "nov":
            return 30;
        case "dec":
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
exports.addCalendarDays = function (_a, daysToAdd) {
    var year = _a.year, month = _a.month, day = _a.day;
    var daysInMonth = numberOfDaysInMonth({ year: year, month: month });
    if (day > daysInMonth) {
        return exports.addCalendarDays({ year: year, month: month, day: daysInMonth }, day - daysInMonth);
    }
    if (day < 0) {
        return exports.addCalendarDays({ year: year, month: month, day: 0 }, day);
    }
    if (day === 0 && daysToAdd === 0) {
        var prevMonth = exports.addCalendarMonths({ year: year, month: month }, -1);
        return __assign(__assign({}, prevMonth), { day: numberOfDaysInMonth(prevMonth) });
    }
    if (daysToAdd === 0) {
        return exports.addCalendarDays({ year: year, month: month, day: 0 }, day);
    }
    // daysToAdd cannot be 0
    // day has to be 0 or [1, daysInMonth] (inclusive)
    if (daysToAdd < 0) {
        // daysToRemove is a positive number
        var daysToRemove = -daysToAdd;
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
    else {
        // daysToAdd > 0
        // daysLeftInMonth can be [0, daysInMonth]
        var daysLeftInMonth = daysInMonth - day;
        if (daysToAdd <= daysLeftInMonth) {
            return { year: year, month: month, day: day + daysToAdd };
        }
        else {
            return exports.addCalendarDays(__assign(__assign({}, exports.addCalendarMonths({ year: year, month: month }, 1)), { day: 0 }), daysToAdd - daysLeftInMonth);
        }
    }
};
exports.calendarMonthBefore = function (a, b) {
    if (a.year < b.year) {
        return true;
    }
    if (a.year === b.year) {
        return consts_1.monthNumber(a.month) < consts_1.monthNumber(b.month);
    }
    return false;
};
exports.calendarMonthEqual = function (a, b) {
    return !exports.calendarMonthBefore(a, b) && !exports.calendarMonthBefore(b, a);
};
exports.calendarDateBefore = function (a, b) {
    if (exports.calendarMonthBefore(a, b)) {
        return true;
    }
    if (consts_1.monthNumber(a.month) === consts_1.monthNumber(b.month)) {
        return a.day < b.day;
    }
    return false;
};
exports.calendarDateEqual = function (a, b) {
    return !exports.calendarDateBefore(a, b) && !exports.calendarDateBefore(b, a);
};
exports.exponentialSearch = function (pred) {
    if (pred(0) === "eq") {
        return [0, 0];
    }
    var direction = pred(0) === "lt" ? 1 : -1;
    var search = function (o, n) {
        if (pred(n) !== o) {
            if (n < 0) {
                return [n, Math.ceil(n / 2)];
            }
            else {
                return [Math.floor(n / 2), n];
            }
        }
        return search(o, n * 2);
    };
    return search(pred(0), direction);
};
exports.binarySearch = function (pred, _a) {
    var _b = __read(_a, 2), start = _b[0], end = _b[1];
    var middle = Math.floor((start + end) / 2);
    var atMiddle = pred(middle);
    if (atMiddle === "eq") {
        return middle;
    }
    else if (atMiddle === "lt") {
        return exports.binarySearch(pred, [middle + 1, end]);
    }
    else {
        return exports.binarySearch(pred, [start, middle - 1]);
    }
};
var solve = function (pred) {
    var range = exports.exponentialSearch(pred);
    return exports.binarySearch(pred, range);
};
exports.numberOfCalendarMonthsBetween = function (a, b) {
    var lteq = function (a, b) {
        return exports.calendarMonthBefore(a, b) ? "lt" : exports.calendarMonthEqual(a, b) ? "eq" : "gt";
    };
    var n = solve(function (n) { return lteq(exports.addCalendarMonths(a, n), b); });
    return n;
};
exports.numberOfCalendarDaysBetween = function (a, b) {
    var lteq = function (a, b) {
        return exports.calendarDateBefore(a, b) ? "lt" : exports.calendarDateEqual(a, b) ? "eq" : "gt";
    };
    var n = solve(function (n) { return lteq(exports.addCalendarDays(a, n), b); });
    return n;
};
exports.dayOfWeek = function (_a) {
    var year = _a.year, month = _a.month, day = _a.day;
    var firstMondayof2021 = { year: 2021, month: "jan", day: 4 };
    var diff = exports.numberOfCalendarDaysBetween(firstMondayof2021, {
        year: year,
        month: month,
        day: day
    });
    return consts_1.weekDays[utils_1.mod(diff, 7)];
};
// wanna add years? Do it yourself
// parsing and formating? Do it yourself
exports.lastDateInMonth = function (_a) {
    var year = _a.year, month = _a.month;
    return ({
        year: year,
        month: month,
        day: numberOfDaysInMonth({ year: year, month: month })
    });
};
exports.addMonthsWithClampedDay = function (_a, months) {
    var year = _a.year, month = _a.month, day = _a.day;
    var m = exports.addCalendarMonths({ year: year, month: month }, months);
    var dayOfMonth = Math.min(day, numberOfDaysInMonth(m));
    return __assign(__assign({}, m), { day: dayOfMonth });
};
exports.rangeOfCalendarDates = function (a, b) {
    if (exports.calendarDateEqual(a, b)) {
        return [];
    }
    return __spread([a], exports.rangeOfCalendarDates(exports.addCalendarDays(a, 1), b));
};
