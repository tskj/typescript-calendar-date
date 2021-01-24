# DateTimes are not calendar dates: The Timestamp confusion

Everyone knows time and programming with dates is hard.

This isn't true.

There is a certain truth that *timezones* are hard, but you should very rarely run into them and most of the time people struggle with time and dates in their systems, it is because of the great timestamp confusion. There are a lot of misconceptions and misnomers that, along with the established "best practices" regarding programming with dates, that makes life unnecessarily difficult for programmers working with time.

## Calendars

Calendars are simple. Timekeeping has been a central part of every functional civilization in human history. So when common programming wisdoms says "avoid working with time", we are not taking the problem seriously. We desperately need software that keeps track of time and handles dates correctly. Luckily people thousands of years ago also knew this, and designed calendars that today are widely used and, actually, pretty simple.

Julius Cesar was the man who finally ended the insantiy that reigned in his time regarding time. Unluckily for humans, there is not a whole number of days in a year. Luckily there is a pretty easy fix for this which we today know as "leap year". Cesar declared that every fourth year there would be another extra day to compensate. This pretty much solved it. Today the system is slightly more complex, because there aren't exactly 365 and a quarter day in a year, either. So to be more precise, the Gregorian calendar does not have a leap year every hundredth year - except every four hundredth year. And that is all! This might seem a bit complicated, and it is - it isn't trivial. But it isn't that difficult either. I was able to explain it (although maybe poorly) in one paragraph, and here is the code implementing the logic:

```js
const isLeapYear = (year) => {
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
```

My point in writing this is that, while this is kind of complicated, this is *the most complicated* thing in regards to date keeping. If you have this in your date handling code, you are pretty much done. Everything from here is easy. Every day goes from Monday to Tuesday, Tuesday to Wednesday, and so on. There are no more edge cases.

## The Great Confusion

So why does everyone think dates are hard? In fact you probably have personal experience with the pain of working with time and dates in your own programs. I certainly have. A lot.

The reason is that we conflate two very important, and two very distinct things. Both in our code and in our minds. Notice in the previous paragraph I wrote *time* and *dates*. These two things sound similar, like synonyms even - but they are not. Oh no, they *are not*. Let me give you some examples to clear the confusion.

I live in Oslo, we are at +01 from England and UTC. Half an hour past midnight on January 1st we are about ready to step back inside after watching the fireworks, because it's fucking cold. Which week day New Year's is celebrated on obviously changes from year to year, but in 2021 the first of January was a Friday, and New Years Eve, the day before, a Thursday. So you might ask the question, what week day is it? Say you receive a congratulatory text message, as is customary, as you stagger drunkenly back inside. The app wants to know what weekday it is, so the developer has written som code to handle this. It's half an hour past midnight on New Year's Eve and the year has just turned 2021, so obviously it's a Friday. Except it's not, not in England at least - not for another thirty minutes. Over there it's still half an hour left of 2020. But I just said I'm in Norway, so why does it matter what day of week it is in another country?

Well, have you ever heard the advice, "just store every date in UTC"? This will surely fix all your date time worries. The timestamp of when you receive the congratulatory New Year's Eve message is then stored as "2020-12-31T23:30:00Z", and that is *entirely correct.* That really was when the message was received! But when you try to look at what weekday that is, or even the *year*, it is terribly wrong. This is the reason dates are so hard - they have nothing to do with time. If you follow the perfectly reasonable sounding advice of storing timestamps in UTC, you also have to follow the extremely counter intuitive practice of handling all timestamps as if they were in England. You might write some code such as `isLeapYear(date, locale)` or `dayOfWeek(date, locale)` or even `getYear(date, locale)`, where `date` is the UTC date and `locale`, as the responsible and considerate developer you are, is the locale of the user. Well, for every user that is outside of England or another country in UTC+00, this will be wrong. Dead wrong. Confusingly, the correct code would be `getYear(date, Locale.England)`.

So don't store dates as UTC? That is the wrong conclusion to draw.

## Timestamps are not dates, and Date is a timestamp

What? The reason we are all so confused is largely a semantic one. We confuse ourselves by using incorrect terminology. As I tried to illustrate in the preceding example, a *timestamp* cannot readily be converted to a calendar date. A calendar date is the abstract concept of "January 1st, 2021", or any other "day of the year" in that kind of format. These are the easy things I meant when I said Calendars were easy. If you have a date of this kind and you want to know what day of week it is, what year is appears in or even how many days it is prior to another date, those are all straightforward questions with straightforward answers. *However*, as soon as you have a *timestamp* and you wish to know any of these things, you are in for some trouble.

A timestamp on the other hand is more like an instance in time, unique and point-like. Any event in the real world is associated with a timestamp, and (disregarding relativistic effects) can be ordered. This happened, then this happened, and before that, this happened. Those kind of things. Often you'll hear people refer to these kinds of things as Unix-epoch timestamps. Some time in the 1970s a counter started, the Unix-epoch counter. This counter counts up one number at a time, every millisecond. This is the number you get if you evaluate `Date.now()` in JavaScript, and in many other languages, the number of milliseconds since "epoch". This is GREAT. It is a uniquely orderable point in time, which you can store in your database, and compare to other timestamps. What does not make sense is converting between an instance in time (a timestamp) and a calendar date - there is no way of doing it. You can mostly get away with it, often by storing in UTC and praying, and it will often be right, but it will never be always right. Much like the [hairy ball theorem](insert link here), it will look right many places, and you can shuffle things around to move the discontinuities, but there will *always* be discontinuities. There will always be bugs, instances where the conversion fails.

And all of our problems stem from this same mistake of treating this point in time as a *date.* JavaScript even makes this exact mistake in calling what should arguably be called the Unix-epoch timestamp object, a "Date" object. Let me prove just how wrong this is.

All I need is a way of comparing two dates in JavaScript the illustrate the glaring issue. Double equals comparison (`==`) doesn't work because it compares references (and the same issue is true for JavaScript's tripple equals), but luckily the "less than" operator (`<`) does actually do what you think on `Date`-objects in JavaScript. So the expression `new Date("1999-01-01T00:00") < new Date("2021-01-01T00:00")` evaluates to `true`, because 1999 comes before 2021. Using this we can implement an `equals` function by testing that two given `Date`-objects are neither bigger nor smaller than each other.

```js
const equals = (d1, d2) => {
  return !(d1 < d2) && !(d1 > d2);
}
```

If that's confusing, don't get hung up on it - the point is that I need a function that tells us whether two `Date`-objects refer to the same instance in time.

Now if we define two objects `d1` and `d2` like this

```js
const d1 = new Date("2020-12-31T23:30:00Z");
const d2 = new Date("2021-01-01T00:30:00+01");
```

we can evaluate whether they are equal.

```js
console.log(equals(d1, d2));
```

This souldn't come as a surprise, we already saw that these two instances in time are in fact the one and the same. We even store the first one, as per "best practice", in our databases, even though the user is in `+01`! And this leads to a contradiction. We ideally want `getYear(d1)` to return `2020` and `getYear(d2)` to return `2021`. But this is traight up impossible, because as far as JavaScript is concerned, these two objects are *identical*. Even the modern date-fns library has this exact issue. At least moment.js was called *moment*, instead of anything to do with "date".

And it's not just JavaScript making this mistake. C# calls their timestamp types `DateTime`s or `DateTimeOffset`s, both equally wrong. Every language I know of makes this mistakes! We keep calling types which represent instances in time for "Dates" and we have no words, types or functions for describing what we in everyday language know as a date on our calendar.

## A way forward

This leads us to the solution, I think. We need to stop conflating the idea of a moment in time and space, with the idea of a calendar date - and we need to stop writing libraries and code that deals with moments in time while naming them stuff to do with "date". If you have a moment in time, it is not possible to know what day of week it is, or even what year it happened in - unless you also know the *location* in which it happened, or the location of the user who wants to know. At that point you can indeed look up the appropriate timezone information to convert it to an equivalent calendar date.

But, most of the time, this is not what we want. Let me illustrate with another example. It is the year 2022 and the month is January, and the pandemic is finally over. You now want to schedule a long overdue developer meetup, discussing your fovourite JavaScript date-handling library. You want to this to take place the first of June, in Oslo, at noon. You might be tempted to store this in your database as "2022-06-01T12:00:00+01", because sa you learned, Oslo is in +01. But to your dismay, you're an hour late to your own event. You did everything right! You didn't even store the timestamp in UTC, and you still got it wrong. What happened?

Daylight saving time happened, or as we call it in Norway, summer time. Anyone who heard about the event from you, even if they heard about it all the way back in January, would meet up at noon on June 1st, which would be `2022-06-01T12:00:00+02`, or equivalently, `2022-06-01T11:00:00+01` - or even more equivalently `2022-06-01T10:00:00Z`. Well maybe not *more* equivalently.

So what do you do, compensate for what timezone the event *will* take place in, when you plan the event? Well unluckily for you, Norway decides to follow the European Union and disband of daylight savings time the same year you implement this "smart logic" and the event does take place `12:00:00+01`, and now you're an hour early! Better than an hour late, but still wrong. Turns out it's impossible to determine what timezone a future timestamp will occur in, because timezones change all the time and it's only really possible to look them up when they happen.

## A correct solution

We're still thinking about it in the wrong way. Let's take a step back and consider what we're *really* trying to do. We're trying to say that on the calendar date of June 1st in 2022, we will meet in Oslo at noon. So let's store *that exact information.* Let's store the calendar date as `2022-06-01` (In ISO 8601 format because I don't hate myself, but knock yourself out) and let's store the the time of day separately, for instance we might store the string "12:00:00, Oslo". That's an annoying string to parse, but it gets the point across. Whenever that calendar date occurs, we can then lookup in what is then the current timezone information in some timezone database, and get timestamp back of when *exactly* noon that day is, in Oslo. Preferably in Unix-epoch milliseconds format, because everything understands that format.

But consider what happens if you write some code in your app to look up this information, probably you'll use your language's built in locale thingy. Notice that if you build and deploy your code today, it will still only contain the locale and timezone information upto today - and not whatever happens to be the actual timezones in a year and a half from now, when the code runs. This leads us to the annoying conclusion, that the only actually correct way of doing this is to look up timezone information in a "just in time" fashion, from an external third party which keeps their timezone information upated.

## In summary

This stuff actually is hard. But it gets you a lot of the way there just storing the actual calendar date in a format that is not of the timestamp variety. It is not possible to ask the kinds of questions of timestamps that we usually do, such as what year it is, what month, or what weekday it is. Those questions do not have unique answers. And the same is true the other way around, a calendar date does not occur at any given time in the universe - it's a more abstract notion. Sadly there does not exist good libraries in any language for handling dates, only timestamps - and confusingly they are called date-libraires. Date-fns, moment.js, the standard libraries in C# and Java all make the same mistake, and industry standard advice is all wrong.

If you have taken anything away from reading this, I hope it is to be more careful in your thinking. Consider very carefully if what you have is a calendar date, or  time stamp - and whether the question you are asking of it makes sense.
