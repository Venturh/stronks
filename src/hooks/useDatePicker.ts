import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DateRange } from 'types';

export function useDatePicker() {
	const { push, query, route } = useRouter();

	const { from, to } = query as DateRange;

	const [startDate, setStartDate] = useState<Date>();
	const [endDate, setEndDate] = useState<Date>();

	useEffect(() => {
		setStartDate(from && from !== '' ? new Date(from) : undefined);
		setEndDate(to && to !== '' ? new Date(to) : undefined);
	}, [from, to]);

	function onDateChange(from?: Date, to?: Date) {
		push(route, { query: { from: from?.toISOString(), to: to?.toISOString() } });
		setStartDate(from);
		setEndDate(to);
	}

	return { startDate: startDate, endDate: endDate, onDateChange };
}
