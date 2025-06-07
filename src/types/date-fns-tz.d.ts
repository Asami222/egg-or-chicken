declare module 'date-fns-tz' {
  import { Locale } from 'date-fns';

  export function toZonedTime(date: Date | number | string, timeZone: string): Date;
  export function formatInTimeZone(
    date: Date | number,
    timeZone: string,
    formatStr: string,
    options?: { locale?: Locale }
  ): string;
}