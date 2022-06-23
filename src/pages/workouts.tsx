import { useEffect, useRef, useState } from 'react';

import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import Tabs from 'components/ui/Tabs';
import WeekTrackCard from 'components/WeekTrackCard';

import { toCalendarDate } from 'utils/date';
import { toFixed, toHoursAndMinutes } from 'utils/misc';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';
import useIntersectionObserver from 'hooks/useIntersectionObserver';

export default function Workouts() {
	const dateRefs = useRef<HTMLDivElement[]>([]);
	const startRef = useRef<null | HTMLDivElement>(null);
	const { data } = trpc.useQuery(['workouts.index']);

	const [selectedTab, setSelectedTab] = useState(0);

	const tabs = [...new Set(Object.keys(data?.items ?? {}).map((key) => key))].map((month) => ({
		label: month.toLowerCase(),
		onClick: (index: number) => {
			setSelectedTab(index);
			dateRefs.current[index].scrollIntoView({
				block: 'start',
				inline: 'nearest',
				behavior: 'smooth',
			});
		},
	}));

	const entry = useIntersectionObserver(dateRefs, {
		// rootMargin: '200px 0px 0px 0px',
		threshold: [0.4],
	});

	useEffect(() => {
		if (entry?.isIntersecting) {
			setSelectedTab(tabs.findIndex((tab) => tab.label === entry.target.id));
		}
	}, [entry]);

	return (
		<AppLayout
			title="Workouts"
			secondaryActions={<Tabs activeIndex={selectedTab} items={tabs} />}
			small
		>
			<div ref={startRef}>
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
