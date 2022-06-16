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
		<AppLayout title="Settings">
			<div className="pt-10 pb-16">
				<div className="px-4 sm:px-6 md:px-0">
					<h1 className="text-3xl font-extrabold text-primary">Settings</h1>
				</div>
				<div className="px-4 sm:px-6 md:px-0">
					<div className="py-6">
						{/* Tabs */}
						<div className="lg:hidden">
							<label htmlFor="selected-tab" className="sr-only">
								Select a tab
							</label>
							<select
								id="selected-tab"
								name="selected-tab"
								className="mt-1 bg-secondary block w-full pl-3 pr-10 py-2 text-base border-accent-primary focus:outline-none focus:ring-brand-primary focus:border-brandring-brand-primary sm:text-sm rounded-md"
								defaultValue={tabs.find((tab) => tab.href === pathname)?.name}
								onChange={(e) => push(`/settings/${e.target.value.toLowerCase()}`)}
							>
								{tabs.map((tab) => (
									<option key={tab.name}>{tab.name}</option>
								))}
							</select>
						</div>
						<div className="hidden lg:block">
							<div className="border-b border-accent-primary">
								<nav className="-mb-px flex space-x-8">
									{tabs.map((tab) => (
										<Link href={tab.href} key={tab.name}>
											<a
												className={clsx(
													pathname.includes(tab.name.toLowerCase())
														? 'border-brand-primary text-brand-primary'
														: 'border-transparent text-secondary hover:border-accent-secondary hover:text-primary',
													'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
												)}
											>
												{tab.name}
											</a>
										</Link>
									))}
								</nav>
							</div>
						</div>

						{children}
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
