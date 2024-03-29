import dayjs, { Dayjs } from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(calendar);
dayjs.extend(timezone);
dayjs.extend(utc);

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

export function getMonth(d: any) {
	const month = dayjs(d.measuredFormat).format('MMMM');
	const currentMonth = dayjs().format('MMMM');
	const lastMonth = dayjs().subtract(1, 'month').format('MMMM');
	return month === currentMonth ? 'current' : month === lastMonth ? 'last' : month;
}

export function toNormalDate(to?: Date, excludeYear?: boolean) {
	if (!to) return '';
	return dayjs(to).format(excludeYear ? 'DD.MM' : 'DD.MM.YY');
}
export function toNormalDateTime(to: Date) {
	return dayjs(to).format('DD.MM.YY, HH:mm');
}

export function toDate(date: Date) {
	return dayjs(date).format('YYYY-MM-DD');
}
