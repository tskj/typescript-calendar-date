![logo](logo.png)
#

_Zero-depenency, small, immutable library for handling calendar dates **correctly**._

`typescript-calendar-date` works on objects like `{ year: 2021, month: 'jan', day: 1 }` which you can easily construct and destructure anywhere in your app. 
The library provides a small set of powerful functions which are easy to understand and use. No more date bugs!

## Philosophy

Everyone gets dates wrong, especially programmers. If asked to calculate how many days old he is, a programmer would convert the current date and time, say `Date.now()`, to the number of seconds since Unix epoch, 1970, or just epoch time, for short.
Then he would convert the middle of the day, or even midnight, in some arbitrary timezone, of when he was born, say `April 1, 1990`, to a number representing the number of seconds he was born after epoch.
Then he would subtract these two numbers, and finally, divide by some constants representing the number of seconds in a day.

This is insane. Just count the number of days! Calendars were invented by humans to be useable by humans, so lets program them directly. It's fairly easy, the most complicated part
of our modern calendar, the Gregorian Calendar, is leap years: every fourth, but not every hundreth, except every four-hundreth. Luckily this library encapsulates all that complexity for you!

Things you can do with this library therefore relate to calendar dates, not absolute time. Luckily, this is usually what most business and everyday applications require.
You can for instance count how many days old you are, or you can find out how many days are in the current month. You can also find out if two dates are sequential, if a certain date is "in range"
of two other dates, and you can generate a list of all dates between two specific dates, for instance if you want to iterate through it.

What this library does not do is handle time of day or timezones. This is largely actually irrelevant anyway, but if this is what you want to do, I would still consider if a Calendar Date and separately storing
the time and location, might be a good idea. Unsolicited advice: if what you actually want is epoch timestamps (for instance in some kind of bidding or auction application), just store the epoch timestamp as an integer, and stop worrying about dates! It'll make your life a whole lot easier. And probably your code more correct.
