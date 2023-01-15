import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { Disclosure } from '@headlessui/react';
import { HomeIcon, MenuIcon, XIcon } from '@heroicons/react/outline';

import UserDropdown from './UserDropown';
import Button from 'components/ui/Button';
import Logo from 'components/ui/Logo';
export type NavLink = {
	name: string;
	description: string;
	href: string;
	icon: any;
	protected: boolean;
};

const navLinks = [
	{
		name: 'Dashboard',
		description: 'Dashboard',
		href: '/overview',
		icon: HomeIcon,
		protected: true,
	},
];

export function filteredNavLinks(navlinks: NavLink[], loggedIn: boolean) {
	return navlinks.filter((link) => {
		if (link.protected === undefined || link.protected === false) return link;
		if (!loggedIn) {
			if (link.protected) return false;
		} else {
			if (!link.protected) return link;
		}
		return link;
	});
}

export default function LandingNavigation() {
	const { pathname } = useRouter();
	const { data } = useSession();

	return (
		<Disclosure as="nav" className="bg-secondary">
			{({ open }) => (
				<>
					<div className="px-4 lg:px-0 mx-auto sm:max-w-md md:max-w-2xl lg:max-w-[60rem] xl:max-w-[80rem]">
						<div className="relative flex items-center justify-between h-16">
							<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
								<Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset text-secondary focus:ring-text-primary">
									<span className="sr-only">Open main menu</span>
									{open ? (
										<XIcon className="block w-6 h-6" aria-hidden="true" />
									) : (
										<MenuIcon className="block w-6 h-6" aria-hidden="true" />
									)}
								</Disclosure.Button>
							</div>

							<div className="flex items-center justify-start">
								<div className="hidden md:flex">
									<Logo />
								</div>
							</div>

							<div className="md:hidden">
								<Logo />
							</div>

							<div className="flex items-center">
								<div className="hidden sm:block sm:ml-6">
									<div className="flex space-x-4">
										{filteredNavLinks(navLinks, Boolean(data?.user)).map((link) => {
											return (
												<Link
													className={clsx(
														pathname.startsWith(`/${link.href.split('/')[1]}`)
															? 'bg-accent-primary text-primary'
															: 'text-primary hover:bg-accent-secondary hover:text-secondary',
														'p-2 text-sm font-medium rounded-lg'
													)}
													href={link.href}
													key={link.name}
												>
													{link.name}
												</Link>
											);
										})}
									</div>
								</div>
								<div className="sm:static sm:inset-auto sm:ml-5">
									{data?.user ? (
										<UserDropdown imageOnly />
									) : (
										<Button size="sm" variant="solid" href="/auth/login">
											Login
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>

					<Disclosure.Panel className="sm:hidden bg-secondary">
						<div className="px-2 pt-2 pb-3 space-y-1">
							{filteredNavLinks(navLinks, Boolean(data?.user)).map((link) => {
								const current = pathname.startsWith(link.href);

								return (
									<Disclosure.Button
										key={link.name}
										as="a"
										href={link.href}
										className={clsx(
											current
												? 'text-white bg-gray-900'
												: 'text-gray-300 hover:text-white hover:bg-gray-700',
											'block py-2 px-3 text-base font-medium rounded-md'
										)}
									>
										{link.name}
									</Disclosure.Button>
								);
							})}
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
}
