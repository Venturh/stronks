import AppLayout from 'components/layouts/AppLayout';
import Button from 'components/ui/Button';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function Home() {
	return (
		<AppLayout title="Home">
			<span>Welcome</span>
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
