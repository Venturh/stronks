import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { ComponentProps } from 'react';

import Menu from 'components/ui/Menu';
import ThemeSwitch from 'components/ui/ThemeToggle';

export default function UserDropdown({}: ComponentProps<'div'>) {
	const dropdownItems = [
		{ text: 'Settings', to: '/settings' },
		{ text: 'Sign Out', action: () => signOut() },
	];

	const { data } = useSession();

	if (data?.user) {
		return (
			<Menu mobileModal additionalItem={<ThemeSwitch />} menuItems={dropdownItems}>
				<Image
					className="flex-shrink-0 rounded-full"
					width={24}
					height={24}
					src={data?.user?.image ?? ''}
					alt="userImg"
				/>
			</Menu>
		);
	}
	return <></>;
}
