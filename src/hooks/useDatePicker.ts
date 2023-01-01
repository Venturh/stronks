import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { DateRange } from 'types';

export function useDatePicker() {
	const { push, query, route } = useRouter();

	const { from, to } = query as DateRange;

	const [startDate, setStartDate] = useState<Date | undefined>();
	const [endDate, setEndDate] = useState<Date | undefined>();

	useEffect(() => {
		if (from) setStartDate(from && from !== '' ? new Date(from) : undefined);
		if (to) setEndDate(to && to !== '' ? new Date(to) : undefined);
	}, [from, to]);

	function onDateChange(from?: Date, to?: Date) {
		push(route, { query: { from: from?.toISOString(), to: to?.toISOString() } });
		setStartDate(from);
		setEndDate(to);
	}

	return { startDate: startDate, endDate: endDate, onDateChange };
}
