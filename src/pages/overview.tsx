import { DatabaseIcon } from '@heroicons/react/outline';
import AppLayout from 'components/layouts/AppLayout';
import OverviewTable from 'components/overview/OverviewTable';
import Button from 'components/ui/Button';
import EmptyState from 'components/ui/EmptyState';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Home() {
	const { data } = trpc.useQuery(['overview.index']);
	const utils = trpc.useContext();

	const sync = trpc.useMutation(['fit.retrieveFitnessData'], {
		onSuccess: () => {
			utils.invalidateQueries(['overview.index']);
		},
	});

	return (
		<AppLayout
			title="Overview"
			actions={
				<Button className="ml-2" loading={sync!.isLoading} onClick={() => sync.mutateAsync()}>
					Sync
				</Button>
			}
		>
			{data && data.items.length > 0 && (
				<OverviewTable
					items={data.items}
					habits={data.habits}
					orderOverviewColumns={data.orderOverviewColumns}
					hiddenTableHeaders={data.hiddenOverviewColumns}
				/>
			)}
			{data && data.items.length === 0 && (
				<EmptyState icon={<DatabaseIcon />} title="No data yet" />
			)}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
