import {
	BeakerIcon,
	CogIcon,
	ColorSwatchIcon,
	FireIcon,
	HomeIcon,
	LightningBoltIcon,
	CollectionIcon,
	SwitchHorizontalIcon,
} from '@heroicons/react/outline';
import clsx from 'clsx';

import Link from 'next/link';
import { useRouter } from 'next/router';
import UserDropdown from './UserDropown';

type Item = {
	name: string;
	href: string;
	icon: React.ReactNode;
};

export default function Sidebar() {
	const navigation = [
		{ name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
		{ name: 'Übersicht', href: '/overview', icon: CollectionIcon },
		{ name: 'Measurements', href: '/measurements/weight', icon: ColorSwatchIcon },
		{ name: 'Nutrition', href: '/nutrition', icon: BeakerIcon },
		{ name: 'Workouts', href: '/workouts', icon: FireIcon },
		{ name: 'Steps', href: '/steps', icon: LightningBoltIcon },
		{ name: 'Habits', href: '/habits', icon: SwitchHorizontalIcon },
	];

	const secondaryNavigation = [{ name: 'Settings', href: '/settings/sync', icon: CogIcon }];

	const { pathname } = useRouter();

	return (
		<nav className="z-10 flex flex-col flex-grow w-48 px-2 py-3 border-r-2 bg-secondary border-accent-primary ">
			<div className="h-16 px-4 sm:hidden" />
			<div className="flex-shrink-0 block w-full">
				<UserDropdown />
			</div>
			<div className="flex flex-col justify-between h-full mt-3">
				<div className="space-y-1 flex-end">
					{navigation.map((item) => (
						<SidebarItem key={item.name} item={item} pathname={pathname} />
					))}
				</div>
				<div>
					{secondaryNavigation.map((item) => (
						<SidebarItem key={item.name} item={item} pathname={pathname} />
					))}
				</div>
			</div>
		</nav>
	);
}

export function SidebarItem({ item, pathname }: { pathname: string; item: Item }) {
	function checkActive(href: string) {
		return pathname.startsWith(`/${href.split('/')[1]}`);
	}
	return (
		<Link href={item.href} key={item.name}>
			<a
				className={clsx(
					checkActive(item.href)
						? 'bg-accent-primary text-primary'
						: 'text-secondary  hover:bg-accent-secondary',
					'group py-2 px-3 flex items-center text-sm font-medium rounded-md'
				)}
			>
				{/* @ts-expect-error yep */}
				<item.icon
					className={clsx(
						{ 'text-brand-primary': checkActive(item.href) },
						'mr-3 flex-shrink-0 h-5 w-5'
					)}
					aria-hidden="true"
				/>
				{item.name}
			</a>
		</Link>
	);
}
