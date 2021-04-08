![logo](logo.png)

#

![AppVeyor](https://img.shields.io/appveyor/build/tskj/typescript-calendar-date?style=for-the-badge&logo=appveyor)
![License](https://img.shields.io/github/license/tskj/typescript-calendar-date?style=for-the-badge)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/typescript-calendar-date?style=for-the-badge&logo=shields.io)
![npm](https://img.shields.io/npm/v/typescript-calendar-date?style=for-the-badge&logo=npm&color=yellow)

_Zero-depenency, small, immutable library favouring excplicitness, for handling calendar dates **correctly**._

`typescript-calendar-date` works on objects like `{ year: 2021, month: 'jan', day: 1 }` which you can easily construct and destructure anywhere in your app. 
The library provides a small set of powerful functions which are simple to understand and use. It gives you the exact level of control you feel you need when working with dates (no more guessing and feeling of uncertainty about off by one mistakes), and handles all the complexity you don't care about. No more date bugs!

Installation: [npm i typescript-calendar-date](https://www.npmjs.com/package/typescript-calendar-date)

## Philosophy

Everyone gets dates wrong, especially programmers. If asked to calculate how many days old he is, a programmer would convert the current date and time, say `Date.now()`, to the number of seconds since Unix epoch, 1970, or just epoch time, for short.
Then he would convert the middle of the day, or even midnight, in some arbitrary timezone, of when he was born, say `April 1, 1990`, to a number representing the number of seconds he was born after epoch.
Then he would subtract these two numbers, and finally, divide by some constant representing the number of seconds in a day.

This is insane. Just count the number of days! Calendars were invented by humans to be useable by humans, so lets program them directly. It's fairly easy, the most complicated part
of our modern calendar, the Gregorian Calendar, is leap years: every fourth, but not every hundreth, except every four-hundreth. Luckily this library encapsulates all that complexity for you!

Things you can do with this library therefore relate to calendar dates, not absolute time. Luckily, this is usually what most business and everyday applications require.
You can for instance count how many days old you are, or you can find out how many days are in the current month. You can also find out if two dates are sequential, if a certain date is "in range"
of two other dates, and you can generate a list of all dates between two specific dates, for instance if you want to iterate through it.

What this library does not do is handle time of day or timezones. This is largely actually irrelevant anyway, but if this is what you want to do, I would still consider if a Calendar Date and separately storing
the time and location, might be a good idea. Unsolicited advice: if what you actually want is epoch timestamps (for instance in some kind of bidding or auction application), just store the epoch timestamp as an integer, and stop worrying about dates! It'll make your life a whole lot easier. And probably your code more correct.

Another idea behind this library is to be lightweight and transparent, as well as explicit, which leads me to the inevitable conclusion that the primary data type has to be transparent; that is it is just a regular javascript value with the keys `year`, `month` and `day`. This also means I expect you to parse your own data, for instance ISO 8601 date strings, and construct this object yourself. I provide no constructors. The reasoning is that this gives you explicit visibilty into how it works and you can be totally confident that it does the right thing. Sadly it does mean a bit more work to use the library, but I belive this tradeoff is worth it. It's just a matter of writing a single functions you can put in a utils file or whatever. Secondly, the same goes for formatting. This part is even more important that you are in control of I believe, as no one knows how you want to display the data to your users better than you. And date formats are notoriously difficult to internationalize, and differ even between contexts. In logs it makes sense to have dates of the form `2020-03-12`, but users might want to see `March 12`, `March 12, 20200`, or even `12th of March`. So I give you this responsibility, but in turn I try to make the interface, that is the shape and structure, of the data as lightweight and predictable as possible.

## Examples

So say you did want to perform the calculation of how many days old you are.

```typescript
const birthDate: CalendarDate = { year: 1990, month: 'apr', day: 1 };

const today = {
    year: new Date().getFullYear(),
    month: monthName(new Date().getMonth() + 1),
    day: new Date().getDate(),
};

const daysOld = numberOfDaysBetween({ start: birthDate, end: today });
```

Here we see the first concession I had to make in terms of useability. I've decided to represent the month as a three-letter string, using the English abbreviation. It would have been a lot more convenient for sure to just use an int, but that runs into the question of zero-indexing or not. Although the right answer in this context is probably to one index, that is January is the first (1) month, but there is no way around developer confusion here. I did want to end up in a situation where you always had to second guess yourself and double check the documentation. So here I've gone with a string for explicitness, which unfortunately does mean you sometimes have to call `monthName` to get the string representation - but hopefully you only need to do this in parsing functions at the edge of your program. The other benefits of doing it this way is that it's super easy to debug and look at your data - no doubt that when you see the value `{ year: 2022, month: 'aug', day: 28 }` in your console, it means `August 28th, 2022`. This also discourages manipulating the month directly, there is now no easy way to attempt to increment it without using the library-provided functions. You can of course still do this with the `day`, but please don't - it'll just lead to bugs. However you *can* do this with the `year` part as there are no edge cases to incrementing or decrementing years diretly. And lastly it makes it obvious that you need to explicitly format the data for display purposes, at the same time keeping it simple to write such a function (for instance, `'aug'` becomes `'August'` or `8` or whatever you want, but it forces you to make a decision).

It's always tricky to know which way around these kind of "subtraction" operations work, so I've decided to go with named parameters in `numberOfDaysBetween`, hopefully making it clear which goes where. If you get it backwards, you get a flipped sign. 

Another gothca is you have to explcititly annotate `birthDate` with the type `CalendarDate`, otherwise TypeScript infers too wide a type for `month`, namely string, which won't work. An alternative design here is to use an explicit enum for the `month` type (or an int as discussed earlier). Please let me know if this string business gets to annoying, and you'd like another approach - I'm very open to input here.

Alright, a simpler example! You've been given two dates, and you want to know if one becomes before the other. In other words, you wish to know if they are in the correct order.

```typescript
const foo = (from: CalendarDate, to: CalendarDate) => {
    if (!areInOrder(from, to)) {
        throw ...
    }
    ...
};
```

Here too I hope disambiguate the order of the parameters by calling the function `isInOrder`, in an attempt to make it obvious that two dates are in order if the first appears before the second. But to make this api even more useful, you can actually pass in more parameters! An often useful thing to know if whether some third date is *between* the other two (is this thing in that range?). Let me give you an example.

Say your billing department wants to do a different thing if a given date is in the fiscal year's first quarter.

```typescript
const foo = (date: CalendarDate) => {
    const startOfQ1: CalendarDate = { year: 2021, month: 'jan', day: 1 };
    const endOfQ1 = lastDateInMonth({ year: 2021, month: 'mar' });

    if (areInOrder(startOfQ1, date, endOfQ1)) {
        ...
    } else {
        ...
    }
};
```

My opinion is this code does exactly what you intuitively think it should do. You have two values representing the start of and the end of the quarter, respectively - then you test if your date is *between* those dates - inclusively, of course. For convenience, `areInOrder` takes an arbitrary number of dates, so you can express some pretty complex relationships using just one or a few function calls.

If you're wondering about `lastDateInMonth`, you could just create `{ year: 2021, month: 'mar', day: 31 }` directly in the same way you construct the first day of the year (`startOfQ1`), but I think it's cleaner and safer to just use `lastDateInMonth` always, both because it's very explicit of what you want, and you don't risk mis-remembering which months have how many days - and of course it also handles leap years correctly. I don't provide a `firstDateInMonth`, although you are welcome to create one for yourself. The reasoning for this is that I want to be excplicit about showing you where the complexity in this domain (calendar dates) lies - it's relatively much more tricky to express the idea of the last day in a month, than the first. There is a certain tempting symmetry of providing both `firstDateInMonth` and `lastDateInMonth`, but this would be a kind of "api lie", exactly because this pleasing symmetry is false.

By now we've covered most of the complexity, the rest should be pretty straight forward. Adding or subtracting a number of days is as simple as:

```typescript
addDays(myDate, 60);
```

although, a lot of the time you might want to add a whole number of months, in which case you would call

```typescript
addMonths(myDate, 2);
```

But aah, I lied. Here comes some more complexity. But it is essential complexity, I promise! What *should* the result be if you add a whole number of months to April 15th? Pretty obviously June 15th, but there is 61 days between these two dates. And even worse, if you have June 30th, representing the end of that month, and you add two months to it, what should the answer be? August 30th? But that isn't the last date of that month, August 31st is! And that is probably what you meant. So here I require excplicitness; therefore `addMonths` gives you back not a `CalendarDate`, but a `CalendarMonth`, which looks like `{ year, month }`. This means that `CalendarDate` is a structural subtype of `CalendarMonth`, and can be used anywhere a `CalendarMonth` is expected. So if in your domain you have April 15th representing the middle of the month, and you want to add two months to it and get the middle of June, that is June 15th, you have to put the `day` part back in, like this:

```typescript
const apr: CalendarDate = { year: 2021, month: `apr`, day: 15 };
const jun = { ...addMonths(apr, 2), day: 15 };
```

A bit more verbose and annoying maybe, but a whole of a lot simpler and more excplicit. The same goes if you want the end of the month.

```typescript
const endOfJune: CalendarDate = { year: 2021, month: `jun`, day: 30 };
const endOfAugust = lastDateInMonth(addMonths(endOfJune, 2)); // This is the 31st.
```

I'll leave you with a final example, building on a previous example. Sometimes you need a list of all the dates in a range or period to iterate over, let's say all the dates in Q1 from earlier. Simply use the aptly named `periodOfDates`.

```typescript
const datesInQ1 = periodOfDates(startOfQ1, endOfQ1); // : CalendarDate[]
```

This function has an inclusive range in both ends for convenience, as this is what most people want most of the time when writing code like this.

## Docs

-------------------

### CalendarYear

```typescript
type CalendarYear = { year: number };
```

This is the most basic type in this library, mostly used to build upon by `CalendarMonth` and `CalendarDate`.

-------------------

### CalendarMonth

```typescript
type Month = 'jan' | 'feb' | 'mar' ...
type CalendarMonth = { year: number, month: Month };
```

`Month` is a union of the 12 abbreviated strings representing the 12 months. Think of this as an enum. You can convert between `Month` and its month number using the functions `monthNumber` and `monthName`. This is mostly done for readability when debugging and leaving no question whether it is zero or one indexed.

`CalendarMonth` is a subtype of `CalendarYear`, and can be used anywhere `CalendarYear` can.

-------------------

### CalendarDate

```typescript
type CalendarDate = { year: number, month: Month, day: number };
```

`CalendarDate` is the heart of this library, and is a subtype of `CalendarMonth`. A `CalendarDate` can be used anywhere where a `CalendarMonth` is expected. It is expected that you construct a value of this type manually at the edges of your program, which is why it's such a simple type. It's also expected you write some kind of formatting function (or many!) to display values of these types to your users.

-------------------

### numberOfDaysInMonth

```typescript
const numberOfDaysInMonth: ({ year, month }: CalendarMonth) => number;
```

Gives you the number of days in that month, 28, 29, 30, or 31. Because of leap years you need to provide an entire `CalendarMonth` object which includes the year, not just the month, to get a correct answer. Here is an example of where you can send in a `CalendarDate` and get the expected result.

-------------------

### addDays

```typescript
const addDays: ({ year, month, day }: CalendarDate, n: number) => CalendarDate;
```

Let's you `n` number of days to a `CalendarDate`, which gives you a new `CalendarDate` `n` dates in the future or the past. If you pass `n = 0` you get a new `CalendarDate` object which is identical to the one you pass in. You can add thousands of days if you wish, this functions handles all leap years and all of that.

```typescript
const yesterday = addDays(today, -1);
const tomorrow = addDays(today, 1);
```

-------------------

### addMonths

```typescript
const addMonths: ({ year, month }: CalenarMonth, n: number) => CalendarMonth;
```

Let's you add `n` number of months to a `CalendarMonth`, giving you a new `CalendarMonth`. This is an example where you can pass in a `CalendarDate`. Note that this is an example of where you'd pass in a `CalendarDate`, which is a subtype of `CalendarMonth`. This is also the only way to add a number of months to a date. It might seem annoying to get out a `CalendarMonth` from this, because you probably want a `CalendarDate`. The way to deal with this is to then convert this value to a `CalendarDate` buy specifying what exactly you want. For instance, you might want to the first of the month, in which case you just specify `day` to be `1`, as shown in the example below. If you want the last of the month, set it to `numberOfDaysInMonth`, explained above.

```typescript
const nextMonth = addMonths(today, 1);
const firstOfNextMonth = { ...nextMonth, day: 1 };
const endOfNextMonth = { ...nextMonth, day: numberOfDaysInMonth(nextMonth) };
```

You might also want to keep the day which the original `CalendarDate` has, but be careful that this next month might have fewer days than that - check with `numberOfDaysInMonth`. You can of course also just add 30 days using `addDays` if you want, but that isn't exactly the same as adding a month. It all depends on your usecase of course.

-------------------

### areInOrder

```typescript
const areInOrder: (...dates: CalendarDate[]) => boolean;
```

The signature of this function seems maybe more complicated than it is. This function is meant to be used to test whether you have dates "in order". If you have two dates, `a` and `b`, you can check if one comes before the other, which is essentially `a <= b`. But his function is also variadic, you can pass in any number of dates, in which case it evaluates to true if they are ordered in a monotonically increasing order. This is very useful if you want to test whether a third date, say `c`, is "in range of" `a` and `b`, which is essentially `a <= c <= b`.

Dates are considered to be in order if `a` comes before or is the same date as `b`.

```typescript
areInOrder(today, tomorrow); // true
areInOrder(firstOfMonth, someDate, lastOfMonth); // true if `someDate` is in this month
```

-------------------

### isMonthBefore

```typescript
const isMonthBefore: (a: CalendarMonth, b: CalendarMonth) => boolean;
```

Basically implements `a < b` for months, tests whether `a` comes strictly before `b`. This function can be used readily with `CalendarDate`s, if you only care about the months they belong to.

```typescript
isMonthBefore(today, tomorrow); // true if tomorrow is the first of the next month, false otherwise.
```

-------------------

### monthsEqual

```typescript
const monthsEqual: (a: CalendarMonth, b: CalendarMonth) => boolean;
```

Basically implements `a = b` for months, tests whether `a` represents the same month as `b`. This function can be used readily with `CalendarDate`s, for instance if you want to test whether two dates appear in the same month (and year!). If you *only* care whether they both appear in say December, but don't care whether those are in different years, just check `a.month === b.month` manually.

```typescript
monthsEqual(today, tomorrow); // true if tomorrow is not the first of the month
```

-------------------

### isDateBefore

```typescript
const isDateBefore: (a: CalendarDate, b: CalendarDate) => boolean;
```

Basically implements `a < b` for dates, tests whether `a` comes strictly before `b`. Maybe you want `areInOrder`, the difference between `areInOrder(a,b)` and `isDateBefore` is that the latter is "strictly less than", while `areInOrder` accepts equal dates as well. For most usecases I think `areInOrder` is probably what you actually want, but this is available if you need it.

```typescript
isDateBefore(today, tomorrow); // true
```

-------------------

### datesEqual

```typescript
const datesEqual: (a: CalendarDate, b: CalendarDate) => boolean;
```

Basically implements `a = b` for dates, tests whether `a` represents the same date as `b`. Only exists because JavaScript `===` is reference equality, which is mostly not what you want.

```typescript
datesEqual(a, b); 
```

-------------------


### numberOfMonthsBetween

```typescript
const numberOfMonthsBetween: ({ start, end }) => number;
```

Calculates the number of months between `start` and `end`, both of type `CalendarMonth`. This is an example of where you can pass in `CalendarDate`s if you only care about the month part. This essentially implements `end - start`; if `start` and `end` represent January and February in the same year, respectively, it evaluates to `1`. If you pass in the same month, it evaluates to `0`. If `end` comes before `start`, you get a negative number.

```typescript
numberOfMonthsBetween({ start: startOfYear, end: endOfYear }); // 11
```

-------------------

### numberOfDaysBetween

```typescript
const numberOfDaysBetween: ({ start, end }) => number;
```

Calculates the number of days between `start` and `end`, both of type `CalendarDate`. This essentially implements `end - start`; if `start` and `end` represent today and tomorrow, respectively, it evaluates to `1`. If you pass in the same date, it evaluates to `0`. If `end` comes before `start`, you get a negative number.

```typescript
numberOfDaysBetween({ start: firstDayOfYear, end: lastDayOfYear }); // 364 or 365, depending on leap year

const firstDayOfNextYear =  { ...firstDayOfYear, year: firstDayOfYear.year + 1 };
numberOfDaysBetween({ start: firstDayOfYear , end: firstDayOfNextYear }); // 365 or 366, depending on leap year
```

-------------------

### dayOfWeek

```typescript
type WeekDay = 'mon' | 'tue' | 'wed' ...
const dayOfWeek: ({ year, month, day }: CalendarDate) => WeekDay;
```

Returns a three letter abbreviation of the day of week the `CalendarDate` represents. Think of this string as an enum, the idea is that you write a formating function or otherwise transform this string into a useable format.

```typescript
const isWeekend = dayOfWeek(today) === 'sat' || dayOfWeek(today) === 'sun';
```

-------------------

### lastDateInMonth

```typescript
const lastDateInMonth: ({ year, month }: CalendarMonth) => CalendarDate;
```

Gives the last date of the month you give it, whether that is a `CalendarDate` (in which case you get a different, that is the last, date in that month) or just a `CalendarMonth`. This function is implemented by setting the `day` to the last day of the month, calculated using `numberOfDaysInMonth`.

```typescript
const firstOfNextMonth = addDays(lastDateInMonth(today), 1); // Hack to easily get next month's first date?
```

-------------------

### periodOfDates

```typescript
const periodOfDates: (a: CalendarDate, b: CalendarDate) => CalendarDate[];
```

Produces a list of `CalendarDate`s from `a` upto and including `b`. The result is an ordered list of sequential dates. The range is inclusive in both ends.

```typescript
const allDatesInMonth = periodOfDates(firstOfMonth, lastOfMonth);
```

-------------------

### periodOfMonths

```typescript
const periodOfMonths: (a: CalendarMonth, b: CalendarMonth) => CalendarMonth[];
```

Produces a list of `CalendarMonth`s from `a` upto and including `b`. The result is an ordered list of sequential months. The range is inclusive in both ends. This is also a function where you can pass in a `CalendarDate`.

```typescript
const allMonthsInYear = periodOfMonth(firstOfYear, lastOfYear);
```

-------------------

### monthName

```typescript
const monthName: (n: number) => Month;
```

Used to generate the three letter abbreviation of the month, such as `'jan'` for `1`. One indexed, in other words. This function wraps around, allowing you to pass in values greater than 12 (although I'm not sure why you would).

```typescript
const january = monthName(1);
```

-------------------

### monthNumber

```typescript
const monthNumber: (m: Month) => number;
```

Used to produce the number of the month based on the three letter abbreviation. This is actually typed in such a way that you cannot send in just any string, it has to match one of the months.

```typescript
const january = monthNumber('jan'); // 1
```
