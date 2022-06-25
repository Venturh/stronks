import AppLayout from 'components/layouts/AppLayout';
import OverviewTable from 'components/overview/OverviewTable';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Home() {
	const { data } = trpc.useQuery(['overview.index']);

	return (
		<AppLayout title="Overview" small>
			{data && (
				<OverviewTable
					items={data.items}
					orderOverviewColumns={data.orderOverviewColumns}
					hiddenTableHeaders={data.hiddenOverviewColumns}
				/>
			)}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
