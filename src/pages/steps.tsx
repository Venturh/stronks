import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import WeekTrackCard from 'components/WeekTrackCard';
import { toCalendarDate } from 'utils/date';

import { toFixed } from 'utils/misc';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Home() {
	const { data } = trpc.useQuery(['steps.index']);

	return (
		<AppLayout title="Steps" small>
			<WeekTrackCard
				days={data?.stats.days}
				primary={data?.stats.primary}
				secondary={`${data?.stats.secondary} steps per day`}
			/>
			<StackedList grouped>
				{Object.entries(data?.items ?? {}).map(([date, items], i) => {
					return (
						<StackedListHeader key={i} primary={date}>
							{items.map(({ id, steps, duration, measuredFormat }) => (
								<StackedListItem
									key={id}
									primary={`${toFixed(steps, 0, 0)} Steps`}
									secondary={toCalendarDate(measuredFormat)}
									tertiary={`${duration ?? 0}  min`}
								/>
							))}
						</StackedListHeader>
					);
				})}
			</StackedList>
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
