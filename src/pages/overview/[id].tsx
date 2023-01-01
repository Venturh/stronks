import AppLayout from 'components/layouts/AppLayout';
import { DescriptionList, DescriptionListItem } from 'components/ui/DescripitonList';
import { useRouter } from 'next/router';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function OverviewDay() {
	const { query } = useRouter();
	const id = query.id as string;

	const { data, isLoading } = trpc.useQuery(['overview.show', { id }]);

	return (
		<AppLayout title="Overview">
			{data && (
				<DescriptionList title={data.measuredFormat.toLocaleDateString()}>
					<DescriptionListItem label="Mood">{data.mood}</DescriptionListItem>
				</DescriptionList>
			)}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
