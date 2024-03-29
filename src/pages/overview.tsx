import { DatabaseIcon } from '@heroicons/react/outline';

import AppLayout from 'components/layouts/AppLayout';
import OverviewTable from 'components/overview/OverviewTable';
import Button from 'components/ui/Button';
import DatePicker from 'components/ui/DatePicker';
import EmptyState from 'components/ui/EmptyState';

import { useDatePicker } from 'hooks/useDatePicker';
import { authenticatedRoute } from 'utils/redirects';
import { api } from 'utils/api';

export default function Overview() {
	const { startDate, endDate, onDateChange } = useDatePicker();

	const { data } = api.overview.index.useQuery({
		from: startDate?.toISOString(),
		to: endDate?.toISOString(),
	});

	const utils = api.useContext();

	const sync = api.fit.retrieveFitnessData.useMutation({
		onSuccess: () => {
			utils.overview.index.invalidate();
		},
	});

	return (
		<AppLayout
			title="Overview"
			actions={
				<div className="flex items-center space-x-2">
					<div>
						<DatePicker
							placeholder="Latest 3 months"
							startDate={startDate}
							endDate={endDate}
							onDateChange={onDateChange}
							range
						/>
					</div>
					<Button className="ml-2" loading={sync!.isLoading} onClick={() => sync.mutateAsync()}>
						Sync
					</Button>
				</div>
			}
		>
			{data && data.overview.length > 0 && (
				<OverviewTable
					items={data.overview}
					habits={data.habits}
					orderOverviewColumns={data.orderOverviewColumns}
					hiddenTableHeaders={data.hiddenOverviewColumns}
				/>
			)}
			{data && data.overview.length === 0 && (
				<EmptyState icon={<DatabaseIcon />} title="No data yet" />
			)}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
