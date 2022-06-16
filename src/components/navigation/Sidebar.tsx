import {
	BeakerIcon,
	CogIcon,
	ColorSwatchIcon,
	FireIcon,
	HomeIcon,
	LightBulbIcon,
	CollectionIcon,
} from '@heroicons/react/solid';
import clsx from 'clsx';

import Link from 'next/link';
import { useRouter } from 'next/router';
import UserDropdown from './UserDropown';

export default function Sidebar() {
	const navigation = [
		{ name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
		{ name: 'Übersicht', href: '/overview', icon: CollectionIcon },
		{ name: 'Measurements', href: '/measurements', icon: ColorSwatchIcon },
		{ name: 'Nutrition', href: '/nutrition', icon: BeakerIcon },
		{ name: 'Workouts', href: '/workouts', icon: FireIcon },
		{ name: 'Activity', href: '/activity', icon: LightBulbIcon },
		{ name: 'Settings', href: '/settings/sync', icon: CogIcon },
	];

	const { pathname } = useRouter();

	function checkActive(href: string) {
		return pathname.startsWith(`/${href.split('/')[1]}`);
	}
	return (
		<nav className="flex flex-col flex-grow pt-5 pb-4 border-r bg-primary border-accent-primary ">
			<Link href="/">
				<a className="flex items-center flex-shrink-0 px-4 text-lg font-medium">Stronks</a>
			</Link>
			<div className="flex-grow mt-5">
				<div className="space-y-1">
					{navigation.map((item) => (
						<Link href={item.href} key={item.name}>
							<a
								className={clsx(
									checkActive(item.href)
										? 'bg-accent-primary/25 border-brand-primary text-brand-primary'
										: 'border-transparent text-secondary hover:text-brand-primary hover:bg-accent-primary/25',
									'group border-l-4 py-2 px-3 flex items-center text-sm font-medium'
								)}
							>
								<item.icon
									className={clsx(
										checkActive(item.href)
											? 'text-brand-primary'
											: 'text-secondary group-hover:text-primary',
										'mr-3 flex-shrink-0 h-6 w-6'
									)}
									aria-hidden="true"
								/>
								{item.name}
							</a>
						</Link>
					))}
				</div>
			</div>
			<div className="flex-shrink-0 block w-full">
				<UserDropdown />
			</div>
		</nav>
	);
}
