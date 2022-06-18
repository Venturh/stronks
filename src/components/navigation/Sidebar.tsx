import {
	BeakerIcon,
	CogIcon,
	ColorSwatchIcon,
	FireIcon,
	HomeIcon,
	LightBulbIcon,
	CollectionIcon,
	MenuAlt2Icon,
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
		<nav className="z-10 flex flex-col flex-grow w-48 pt-5 pb-4 border-r-2 bg-primary border-accent-primary ">
			<div className="h-16 px-4 sm:hidden" />
			<div className="flex-shrink-0 block w-full">
				<UserDropdown />
			</div>
			<div className="flex-grow mt-5">
				<div className="space-y-1">
					{navigation.map((item) => (
						<Link href={item.href} key={item.name}>
							<a
								className={clsx(
									checkActive(item.href)
										? 'bg-accent-primary border-brand-primary text-primary'
										: 'text-secondary hover:text-primary hover:bg-accent-secondary',
									'group py-2 px-3 flex items-center text-sm font-medium'
								)}
							>
								<item.icon
									className={clsx(
										{ 'text-secondary group-hover:text-primary': checkActive(item.href) },
										'mr-3 flex-shrink-0 h-5 w-5'
									)}
									aria-hidden="true"
								/>
								{item.name}
							</a>
						</Link>
					))}
				</div>
			</div>
		</nav>
	);
}
