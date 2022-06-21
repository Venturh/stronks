import dayjs from 'dayjs';

export function generateWeekyDayTrack<T>(
	data: ({ measuredAt?: Date | string; measuredFormat?: Date | string } & T)[],
	callback: (item: T[]) => void
) {
	const days = ['Su', 'Mo', 'Tue', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => {
		const items = data.filter(
			(d) =>
				dayjs(d.measuredAt ?? d.measuredFormat)
					.toDate()
					.getDay() === i
		);
		if (items.length > 0) {
			callback(items);
		}
		return {
			active: Boolean(items.length > 0),
			weekDay: day,
		};
	});
	const su = days.shift()!;
	days.push(su);
	return { days };
}
