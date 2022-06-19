import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import dayjs from 'dayjs';

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
			{data && (
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
			)}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
