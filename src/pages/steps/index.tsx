import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import { toCalendarDate } from 'utils/date';

import { toFixed } from 'utils/misc';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Home() {
	const { data } = trpc.useQuery(['steps.index']);

	return (
		<AppLayout title="Steps" small>
			{data && (
				<StackedList grouped>
					{data.map(({ duration, steps, measuredFormat }, i) => {
						return (
							<StackedListHeader key={i} primary={toCalendarDate(measuredFormat)}>
								<StackedListItem
									primary={`${toFixed(steps, 0, 0)} Steps`}
									secondary={`${duration ?? 0}  min`}
								/>
							</StackedListHeader>
						);
					})}
				</StackedList>
			)}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
