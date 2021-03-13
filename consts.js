"use strict";
exports.__esModule = true;
exports.monthName = exports.monthNumber = exports.weekDays = void 0;
exports.weekDays = [
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun',
];
var monthNumber = function (month) {
    switch (month) {
        case 'jan':
            return 1;
        case 'feb':
            return 2;
        case 'mar':
            return 3;
        case 'apr':
            return 4;
        case 'may':
            return 5;
        case 'jun':
            return 6;
        case 'jul':
            return 7;
        case 'aug':
            return 8;
        case 'sep':
            return 9;
        case 'oct':
            return 10;
        case 'nov':
            return 11;
        case 'dec':
            return 12;
    }
};
exports.monthNumber = monthNumber;
var months = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
];
var monthName = function (n) { return months[n - 1]; };
exports.monthName = monthName;
