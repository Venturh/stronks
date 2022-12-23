import { GetServerSidePropsContext } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { Measurements } from '@prisma/client';

import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import WeekTrackCard from 'components/WeekTrackCard';
import Tabs from 'components/ui/Tabs';

import { trpc } from 'utils/trpc';
import { authenticatedRoute } from 'utils/redirects';
import { toCalendarDate } from 'utils/date';
import useThingy from 'hooks/useThingy';
import { useState } from 'react';

const Chart = dynamic(() => import('components/ui/Chart'), {
	ssr: false,
});

export default function Weights() {
	const { query } = useRouter();
	const type = query.type as 'weight' | 'bodyFat';
	const [chartInterval, setChartInverval] = useState(30);
	const { data, isLoading } = trpc.useQuery([
		'measurements.index',
		{ interval: chartInterval, type },
	]);
	const typeTabs = [
		{ label: 'Weight', href: '/measurements/weight' },
		{ label: 'Bodyfat', href: '/measurements/bodyFat' },
	];

	const { dateRefs, tabs, selectedTab } = useThingy(data?.items);

	function getValue(measurments: Omit<Measurements, 'userId' | 'infoId'>[], idx: number) {
		const current = measurments[idx][type];
		const prev = measurments[idx + 1] ? measurments[idx + 1][type] : undefined;
		const m = type === 'weight' ? 'kg' : '%';
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
		<AppLayout
			title="Measurments"
			actions={<Tabs items={typeTabs} maxWidth="max-w-[120px] md:max-w-[180px]" />}
			secondaryActions={<Tabs activeIndex={selectedTab} items={tabs} />}
			small
		>
			{/* @ts-expect-error yep */}
			<div ref={(el) => (dateRefs.current[0] = el)}>
				<WeekTrackCard
					days={data?.stats.days}
					primary={data?.stats.primary}
					secondary={data?.stats.secondary}
				/>
			</div>
			<div className="my-4">
				<Chart
					hideYAxis
					unit={type === 'weight' ? 'kg' : '%'}
					// @ts-expect-error yep
					series={data?.series ?? []}
					loading={isLoading}
					onTimeRangeChange={setChartInverval}
				/>
			</div>

			<StackedList grouped>
				{Object.entries(data?.items ?? {})?.map(([month, measurments], i) => {
					const secondary = `${new Intl.NumberFormat('en-US', {
						signDisplay: 'exceptZero',
					}).format(
						(measurments[0][type] ?? 0) - (measurments[measurments.length - 1][type] ?? 0)
					)} ${type === 'bodyFat' ? '%' : 'kg'}`;
					return (
						<div
							id={month.toLowerCase()}
							style={{ scrollMarginTop: month === 'current' ? '800px' : '100px' }}
							//@ts-expect-error yep
							ref={(el) => (dateRefs.current[i] = el)}
							key={month}
						>
							<StackedListHeader primary={month} seconary={secondary}>
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
						</div>
					);
				})}
			</StackedList>
		</AppLayout>
	);
}

export function getServerSideProps(ctx: GetServerSidePropsContext) {
	return authenticatedRoute(ctx, 'type', ['weight', 'bodyFat']);
}
