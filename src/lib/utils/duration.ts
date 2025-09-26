type SecondUnit = "s" | "sec" | "second" | "seconds";
type MinuteUnit = "m" | "min" | "minute" | "minutes";
type HourUnit = "h" | "hr" | "hour" | "hours";
type DayUnit = "d" | "day" | "days";
type WeekUnit = "w" | "week" | "weeks";
type MonthUnit = "mo" | "month" | "months";

type TimeUnit =
  | SecondUnit
  | MinuteUnit
  | HourUnit
  | DayUnit
  | WeekUnit
  | MonthUnit;

type Num = `${number}` | `${number}.${number}`;

type DurationPart = `${Num}${TimeUnit}`;

type DurationString =
  | DurationPart
  | `${DurationPart} ${DurationPart}`
  | `${DurationPart} ${DurationPart} ${DurationPart}`;

type Duration = DurationString | number;

export function duration<T extends Duration>(input: T): number {
  if (typeof input === "number") {
    return input;
  }

  const durationString = input as string;
  const parts = durationString.trim().split(/\s+/);
  let totalMs = 0;

  for (const part of parts) {
    const match = part.match(/^(\d+(?:\.\d+)?)([a-zA-Z]+)$/);

    if (!match) {
      throw new Error(`Invalid duration part: "${part}"`);
    }

    const [, value, unit] = match;
    const num = parseFloat(value);

    switch (unit.toLowerCase() as TimeUnit) {
      case "s":
      case "sec":
      case "second":
      case "seconds":
        totalMs += num * 1000;
        break;

      case "m":
      case "min":
      case "minute":
      case "minutes":
        totalMs += num * 1000 * 60;
        break;

      case "h":
      case "hr":
      case "hour":
      case "hours":
        totalMs += num * 1000 * 60 * 60;
        break;

      case "d":
      case "day":
      case "days":
        totalMs += num * 1000 * 60 * 60 * 24;
        break;

      case "w":
      case "week":
      case "weeks":
        totalMs += num * 1000 * 60 * 60 * 24 * 7;
        break;

      case "mo":
      case "month":
      case "months":
        totalMs += num * 1000 * 60 * 60 * 24 * 30;
        break;

      default:
        throw new Error(`Unknown time unit: "${unit}"`);
    }
  }

  return totalMs;
}

export type DurationInput = Duration;
