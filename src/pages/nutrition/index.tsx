import { useState } from 'react';
import { groupBy, sumBy } from 'lodash';
import dayjs from 'dayjs';

import AppLayout from 'components/layouts/AppLayout';
import NutritionComposer from 'components/nutrition/NutritionComposer';
import Button from 'components/ui/Button';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import Tabs from 'components/ui/Tabs';
import WeekTrackCard from 'components/WeekTrackCard';

import useThingy from 'hooks/useThingy';
import { toCalendarDate } from 'utils/date';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Home() {
	const { data } = trpc.useQuery(['nutrition.index']);

	const [showStoreModal, setShowStoreModal] = useState(false);

	const { dateRefs, tabs, selectedTab } = useThingy(data?.items);

	const priority: Record<string, number> = {
		snack: 0,
		dinner: 1,
		lunch: 2,
		breakfast: 3,
	};

	return (
		<AppLayout
			title="Nutrition"
			actions={<Button onClick={() => setShowStoreModal(true)}>Add</Button>}
			secondaryActions={<Tabs activeIndex={selectedTab} items={tabs} />}
			small
		>
			<NutritionComposer open={showStoreModal} close={() => setShowStoreModal(false)} />
			{/* @ts-expect-error yep */}
			<div ref={(el) => (dateRefs.current[0] = el)}>
				<WeekTrackCard
					days={data?.stats.days}
					primary={data?.stats.primary}
					secondary={`${data?.stats.secondary} kcal per day`}
				/>
			</div>
			<StackedList grouped>
				{Object.entries(data?.items ?? {}).map(([month, items], i) => {
					const grouped = groupBy(items, 'measuredFormat');
					return (
						<div
							id={month.toLowerCase()}
							style={{ scrollMarginTop: month === 'current' ? '800px' : '100px' }}
							//@ts-expect-error yep
							ref={(el) => (dateRefs.current[i] = el)}
							key={month}
						>
							<StackedListHeader primary={month}>
								<StackedList grouped>
									{Object.entries(grouped).map(([measuredAt, items]) => (
										<StackedListHeader
											key={measuredAt}
											primary={toCalendarDate(measuredAt)}
											seconary={`${sumBy(items, 'calories')} kcal`}
										>
											{items
												.sort((a, b) => priority[b.category] - priority[a.category])
												.map(({ category, calories, foodnames, measuredFormat }, i) => (
													<StackedListItem
														href={`/nutrition/show?category=${category}&date=${dayjs(
															measuredFormat
														).toISOString()}`}
														key={i}
														primary={foodnames}
														secondary={category}
														tertiary={`${calories} kcal`}
													/>
												))}
										</StackedListHeader>
									))}
								</StackedList>
							</StackedListHeader>
						</div>
					);
				})}
			</StackedList>
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
