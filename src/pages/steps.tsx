import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import Tabs from 'components/ui/Tabs';
import WeekTrackCard from 'components/WeekTrackCard';
import useThingy from 'hooks/useThingy';
import { toCalendarDate } from 'utils/date';

import { toFixed } from 'utils/misc';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Home() {
	const { data } = trpc.useQuery(['steps.index']);

	const { dateRefs, tabs, selectedTab } = useThingy(data?.items);

	return (
		<AppLayout title="Steps" secondaryActions={<Tabs activeIndex={selectedTab} items={tabs} />}>
			{/* @ts-expect-error yep */}
			<div ref={(el) => (dateRefs.current[0] = el)}>
				<WeekTrackCard
					days={data?.stats.days}
					primary={data?.stats.primary}
					secondary={`${data?.stats.secondary} steps per day`}
				/>
			</div>
			<StackedList grouped>
				{Object.entries(data?.items ?? {}).map(([month, items], i) => {
					return (
						<div
							id={month.toLowerCase()}
							style={{ scrollMarginTop: month === 'current' ? '800px' : '100px' }}
							//@ts-expect-error yep
							ref={(el) => (dateRefs.current[i] = el)}
							key={month}
						>
							<StackedListHeader key={i} primary={month}>
								{items.map(({ id, steps, duration, measuredFormat }) => (
									<StackedListItem
										key={id}
										primary={`${toFixed(steps, 0, 0)} Steps`}
										secondary={toCalendarDate(measuredFormat)}
										tertiary={`${duration ?? 0}  min`}
									/>
								))}
							</StackedListHeader>
						</div>
					);
				})}
			</StackedList>
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
