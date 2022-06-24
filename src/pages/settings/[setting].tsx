import { createElement } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

import Tabs from 'components/ui/Tabs';
import AppLayout from 'components/layouts/AppLayout';

import { authenticatedRoute } from 'utils/redirects';

const pages = {
	sync: dynamic(() => import('components/settings/Sync'), {}),
	general: dynamic(() => import('components/settings/General'), {}),
};
const tabs = [
	{ label: 'Sync', href: '/settings/sync' },
	{ label: 'General', href: '/settings/general' },
];

export default function General() {
	const { query } = useRouter();
	const setting = query.setting as 'sync' | 'general';

	return (
		<AppLayout title="Settings" secondaryActions={<Tabs items={tabs} />} small>
			{createElement(pages[setting])}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
