import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';

import { toCalendarDate } from 'utils/date';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Home() {
	const { data } = trpc.useQuery(['nutrition.index']);
	return (
		<AppLayout title="Home">
			<StackedList grouped>
				{Object.entries(data ?? {}).map(([date, nutritions]) => {
					return (
						<StackedListHeader key={date} primary={toCalendarDate(date)}>
							{nutritions.map(({ id, name, calories }) => {
								return <StackedListItem key={id} primary={name} secondary={`${calories} kcal`} />;
							})}
						</StackedListHeader>
					);
				})}
			</StackedList>
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
