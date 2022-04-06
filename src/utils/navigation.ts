import { HomeIcon } from '@heroicons/react/outline';
import React from 'react';

export type NavLink = {
	name: string;
	description: string;
	href: string;
	icon: React.ReactNode;
	protected: boolean;
};

export function getNavLinks(): NavLink[] {
	return [
		{
			name: 'Posts',
			description: 'All Posts',
			href: '/posts',
			icon: HomeIcon,
			protected: true,
		},
	];
}

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
