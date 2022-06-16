import dayjs, { Dayjs } from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(calendar);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Europe/Berlin');

export function toMidnightDate(time: number) {
	return dayjs(time).hour(0).minute(0).second(0).millisecond(0).toDate();
}

export function toCalendarDate(date: Date | string) {
	return dayjs(date).calendar(null, {
		sameDay: '[Today]',
		lastDay: '[Yesterday]',
		lastWeek: 'dddd, DD.MMMM',
		sameElse: 'dddd, DD.MMMM',
	});
}

export function toStartOfDay(date: Date | Dayjs | string | number) {
	return dayjs(date).hour(2).minute(0).second(0).millisecond(0).toDate();
}
