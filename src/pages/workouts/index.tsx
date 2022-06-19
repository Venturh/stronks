import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';

import { toCalendarDate } from 'utils/date';
import { toFixed } from 'utils/misc';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Home() {
	const { data } = trpc.useQuery(['workouts.index']);

	return (
		<AppLayout title="Workouts" small>
			{data && (
				<StackedList grouped>
					{Object.entries(data).map(([date, items]) => {
						return (
							<StackedListHeader key={date} primary={toCalendarDate(date)}>
								{items.map(({ name, activityTypeName, calories, duration }, i) => {
									return (
										<StackedListItem
											key={i}
											primary={name}
											secondary={activityTypeName}
											tertiary={`${toFixed(calories, 0, 0)} kcal • ${duration} min`}
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
