import LandingLayout from 'components/layouts/LandingLayout';

export default function Landing() {
	const title = 'Tizzl';
	return (
		<LandingLayout title={title} description="">
			<span>Welcome</span>
		</LandingLayout>
	);
}
