import { useRef } from 'react';

import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import Tabs from 'components/ui/Tabs';
import WeekTrackCard from 'components/WeekTrackCard';

import useThingy from 'hooks/useThingy';
import { toCalendarDate } from 'utils/date';
import { toFixed, toHoursAndMinutes } from 'utils/misc';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Workouts() {
	const { data } = trpc.useQuery(['workouts.index']);

	const { dateRefs, tabs, selectedTab } = useThingy(data?.items);

	return (
		<AppLayout title="Workouts" secondaryActions={<Tabs activeIndex={selectedTab} items={tabs} />}>
			{/* @ts-expect-error yep */}
			<div ref={(el) => (dateRefs.current[0] = el)}>
				<WeekTrackCard
					days={data?.stats.days}
					primary={data?.stats.primary}
					secondary={`${toHoursAndMinutes(data?.stats.secondary || 0)} per week`}
				/>
			</div>
			{data && (
				<StackedList grouped>
					{Object.entries(data.items).map(([month, items], i) => {
						return (
							<div
								id={month.toLowerCase()}
								style={{ scrollMarginTop: month === 'current' ? '800px' : '100px' }}
								//@ts-expect-error yep
								ref={(el) => (dateRefs.current[i] = el)}
								key={month}
							>
								<StackedListHeader primary={month}>
									{items.map(({ name, activityTypeName, calories, duration, measuredAt }, i) => {
										return (
											<StackedListItem
												key={i}
												primary={name}
												secondary={toCalendarDate(measuredAt)}
												quaternary={activityTypeName}
												tertiary={`${toFixed(calories, 0, 0)} kcal • ${duration} min`}
											/>
										);
									})}
								</StackedListHeader>
							</div>
						);
					})}
				</StackedList>
			)}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
