import { useState } from 'react';
import clsx from 'clsx';

import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';

import { trpc } from 'utils/trpc';
import { authenticatedRoute } from 'utils/redirects';
import { toCalendarDate } from 'utils/date';

import type { Measurements } from '@prisma/client';

export default function Weights() {
	const { data } = trpc.useQuery(['measurements.index']);

	const tabs: ['weight', 'bodyFat'] = ['weight', 'bodyFat'];
	const [selectedTab, setSelectedTab] = useState<'weight' | 'bodyFat'>('weight');

	function getValue(measurments: Omit<Measurements, 'userId' | 'infoId'>[], idx: number) {
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
		<AppLayout title="Measurments" small>
			<div>
				<nav className="flex mb-2 space-x-8 rounded-xl ring-1 bg-secondary ring-accent-primary">
					{tabs.map((tab) => (
						<button
							className={clsx(
								selectedTab === tab
									? 'bg-accent-primary text-primary'
									: 'text-secondary hover:text-primary ',
								'py-1.5 w-full text-sm font-medium leading-5 rounded-lg md:py-2',
								'focus:outline-none'
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

			<StackedList grouped>
				{Object.entries(data ?? {})?.map(([month, measurments]) => {
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
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
