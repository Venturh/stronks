import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import WeekTrackCard from 'components/WeekTrackCard';
import dayjs from 'dayjs';
import { groupBy, sumBy } from 'lodash';

import { toCalendarDate } from 'utils/date';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Home() {
	const { data } = trpc.useQuery(['nutrition.index']);

	const priority: Record<string, number> = {
		snack: 0,
		dinner: 1,
		lunch: 2,
		breakfast: 3,
	};

	return (
		<AppLayout title="Nutrition" small>
			<WeekTrackCard
				days={data?.stats.days}
				primary={data?.stats.primary}
				secondary={`${data?.stats.secondary} kcal per day`}
			/>
			<StackedList grouped>
				{Object.entries(data?.items ?? {}).map(([date, items]) => {
					const grouped = groupBy(items, 'measuredFormat');
					return (
						<StackedListHeader key={date} primary={date}>
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
					);
				})}
			</StackedList>
			{/* {data && (
				<StackedList grouped>
					{Object.entries(data).map(([date, items]) => {
						return (
							<StackedListHeader key={date} primary={toCalendarDate(date)}>
								{items
									.sort((a, b) => priority[b.category] - priority[a.category])
									.map(({ calories, foodnames, category }, i) => {
										return (
											<StackedListItem
												href={`/nutrition/show?category=${category}&date=${dayjs(
													date
												).toISOString()}`}
												key={i}
												primary={foodnames}
												secondary={category}
												tertiary={`${calories} kcal`}
											/>
										);
									})}
							</StackedListHeader>
						);
					})}
				</StackedList>
			)} */}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
