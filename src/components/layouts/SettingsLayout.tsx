import clsx from 'clsx';
import AppLayout from 'components/layouts/AppLayout';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
	children: React.ReactNode;
};

export default function SettingsLayout({ children }: Props) {
	const { pathname, push } = useRouter();
	const tabs = [
		{ name: 'Sync', href: '/settings/sync' },
		{ name: 'General', href: '/settings/general' },
	];

	return (
		<AppLayout title="Settings" small>
			<div>
				<nav className="flex mb-2 space-x-8 rounded-xl ring-1 bg-secondary ring-accent-primary">
					{tabs.map((tab) => (
						<Link href={tab.href} key={tab.name}>
							<button
								className={clsx(
									pathname.includes(tab.name.toLowerCase())
										? 'bg-accent-primary text-primary'
										: 'text-secondary hover:text-primary ',
									'py-1.5 w-full text-sm font-medium leading-5 rounded-lg md:py-2',
									'focus:outline-none'
								)}
							>
								<div className="capitalize">{tab.name}</div>
							</button>
						</Link>
					))}
				</nav>

				{children}
			</div>
		</AppLayout>
	);
}
