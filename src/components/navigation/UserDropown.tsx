import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { BookmarkIcon, CogIcon, LogoutIcon, SelectorIcon } from '@heroicons/react/outline';

import NestedMenu from 'components/ui/NestedMenu';
import { MenuItem } from 'components/ui/Menu';
import { trpc } from 'utils/trpc';
import { Phase } from '@prisma/client';

type Props = {
	imageOnly?: boolean;
};

export default function UserDropdown({ imageOnly }: Props) {
	const { data } = trpc.useQuery(['user.me']);

	const context = trpc.useContext();

	const changePase = trpc.useMutation('user.edit', {
		async onSuccess() {
			context.invalidateQueries(['user.me']);
		},
	});

	const dropdownItems = [
		{ text: 'Settings', icon: <CogIcon />, to: '/settings' },
		{ text: 'Sign Out', icon: <LogoutIcon />, action: () => signOut() },
	];
	const phaseItems: MenuItem[] = [
		{
			text: data?.phase?.toLowerCase() ?? 'Phase',
			icon: <BookmarkIcon />,
			nested: [
				{ text: 'Maintain', action: () => onPhaseChange(Phase.MAINTAIN) },
				{ text: 'Cutting', action: () => onPhaseChange(Phase.CUTTING) },
				{ text: 'Bulking', action: () => onPhaseChange(Phase.BULKING) },
			],
		},
	];

	function onPhaseChange(phase: Phase) {
		const { name, email } = data!;
		changePase.mutate({ data: { phase, email: email!, name: name! } });
	}

	if (data) {
		return (
			<NestedMenu menuItems={[{ label: 'Phase', items: phaseItems }, { items: dropdownItems }]}>
				{imageOnly ? (
					<Image
						className="flex-shrink-0 rounded-full"
						width={24}
						height={24}
						src={data.image ?? ''}
						alt="userImg"
					/>
				) : (
					<div className="group w-full bg-secondary rounded-md px-3.5 py-2 text-sm text-left font-medium text-seco  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-accent-primary focus:ring-accent-primary">
						<span className="flex items-center justify-between w-full">
							<span className="flex items-center justify-between min-w-0 space-x-3">
								<img
									className="flex-shrink-0 w-10 h-10 bg-gray-300 rounded-full"
									src={data.image ?? ''}
									alt=""
								/>
								<span className="flex flex-col flex-1 min-w-0">
									<span className="text-sm font-medium truncate text-primary">{data.name}</span>
									<span className="text-sm capitalize truncate text-secondary">
										{data.phase?.toLowerCase()}
									</span>
								</span>
							</span>
							<SelectorIcon
								className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
								aria-hidden="true"
							/>
						</span>
					</div>
				)}
			</NestedMenu>
		);
	}
	return <></>;
}
