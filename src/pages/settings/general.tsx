import SettingsLayout from 'components/layouts/SettingsLayout';
import DescriptionList from 'components/ui/DescripitonList';
import ThemeSwitch from 'components/ui/ThemeToggle';
import { authenticatedRoute } from 'utils/redirects';

export default function General() {
	return (
		<SettingsLayout>
			<DescriptionList title="General" description="Define app behavior.">
				<div className="py-4">
					<ThemeSwitch />
				</div>
			</DescriptionList>
		</SettingsLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
