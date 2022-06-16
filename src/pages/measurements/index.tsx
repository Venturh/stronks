import { useState } from 'react';
import { groupBy } from 'lodash';
import clsx from 'clsx';
import dayjs from 'dayjs';

import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';

import { trpc } from 'utils/trpc';
import { authenticatedRoute } from 'utils/redirects';
import { toCalendarDate } from 'utils/date';

import type { Measurements } from '@prisma/client';

export default function Weights() {
	const { data } = trpc.useQuery(['measurements.index']);

	const groupedByMonth = groupBy(data, (d) => {
		const month = dayjs(d.measuredFormat).format('MMMM');
		const currentMonth = dayjs().format('MMMM');
		const lastMonth = dayjs().subtract(1, 'month').format('MMMM');
		return month === currentMonth ? 'Current Month' : month === lastMonth ? 'Last Month' : month;
	});

	const tabs: ['weight', 'bodyFat'] = ['weight', 'bodyFat'];
	const [selectedTab, setSelectedTab] = useState<'weight' | 'bodyFat'>('weight');

	function getValue(measurments: Omit<Measurements, 'userId'>[], idx: number) {
		const current = measurments[idx][selectedTab];
		const prev = measurments[idx + 1] ? measurments[idx + 1][selectedTab] : undefined;
		const m = selectedTab === 'weight' ? 'kg' : '%';
		const secondary = toCalendarDate(measurments[idx].measuredFormat);

		return {
			primary: `${current?.toFixed(2)} ${m}`,
			secondary,
			tertiary:
				current && prev
					? `${new Intl.NumberFormat('en-US', {
							signDisplay: 'exceptZero',
					  }).format(current - prev)} ${m}`
					: '',
		};
	}

	return (
		<AppLayout title="Measurments">
			<div>
				<div className="hidden lg:block">
					<div className="border-b border-accent-primary">
						<nav className="flex mb-2 space-x-8">
							{tabs.map((tab) => (
								<button
									className={clsx(
										selectedTab === tab
											? 'border-brand-primary text-brand-primary'
											: 'border-transparent text-secondary hover:border-accent-secondary hover:text-primary',
										'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
									)}
									type="button"
									key={tab}
									onClick={() => setSelectedTab(tab)}
								>
									<span className="capitalize">{tab}</span>
								</button>
							))}
						</nav>
					</div>
				</div>
				<StackedList grouped>
					{Object.entries(groupedByMonth)?.map(([month, measurments]) => {
						const secondary = `${new Intl.NumberFormat('en-US', {
							signDisplay: 'exceptZero',
						}).format(
							(measurments[0][selectedTab] ?? 0) -
								(measurments[measurments.length - 1][selectedTab] ?? 0)
						)} ${selectedTab === 'bodyFat' ? '%' : 'kg'}`;
						return (
							<StackedListHeader key={month} primary={month} seconary={secondary}>
								{measurments.map((measurment, idx) => {
									const { primary, secondary, tertiary } = getValue(measurments, idx);

									return (
										<StackedListItem
											key={measurment.id}
											primary={primary}
											secondary={secondary}
											tertiary={tertiary}
										/>
									);
								})}
							</StackedListHeader>
						);
					})}
				</StackedList>
			</div>
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
