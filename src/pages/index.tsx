import LandingLayout from 'components/layouts/LandingLayout';
import { unauthenticatedRoute } from 'utils/redirects';

export default function Landing() {
	const title = 'Tizzl';

	return (
		<LandingLayout title={title} description="">
			<span>Welcome</span>
		</LandingLayout>
	);
}

export const getServerSideProps = unauthenticatedRoute;
