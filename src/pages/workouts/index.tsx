import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import WeekTrackCard from 'components/WeekTrackCard';

import { toCalendarDate } from 'utils/date';
import { toFixed, toHoursAndMinutes } from 'utils/misc';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Workouts() {
	const { data } = trpc.useQuery(['workouts.index']);

	function Filter({}) {
		return (
			<div className="flex items-center space-x-4 overflow-x-scroll">
				{[...new Set(Object.keys(data?.items ?? {}).map((key) => key))].reverse().map((month) => (
					<button type="button" key={month}>
						{month}
					</button>
				))}
			</div>
		);
	}

	return (
		<AppLayout title="Workouts" actions={<Filter />} small>
			<WeekTrackCard
				days={data?.stats.days}
				primary={data?.stats.primary}
				secondary={`${toHoursAndMinutes(data?.stats.secondary || 0)} per week`}
			/>
			{data && (
				<StackedList grouped>
					{Object.entries(data.items).map(([date, items]) => {
						return (
							<StackedListHeader key={date} primary={date}>
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
						);
					})}
				</StackedList>
			)}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
