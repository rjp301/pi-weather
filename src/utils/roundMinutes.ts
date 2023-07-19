import { DateTime } from "luxon";

export default function roundMinutes(dateText: string) {
  const date = DateTime.fromISO(dateText);
  return date.minute >= 30
    ? date.plus({ hour: 1 }).startOf("hour")
    : date.startOf("hour");
}
