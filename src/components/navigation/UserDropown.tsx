import Image from 'next/image';
import { signOut } from 'next-auth/react';
import {
	BookmarkIcon,
	CogIcon,
	LogoutIcon,
	RefreshIcon,
	SelectorIcon,
} from '@heroicons/react/outline';

import NestedMenu from 'components/ui/NestedMenu';
import { MenuItem } from 'components/ui/Menu';
import { trpc } from 'utils/trpc';
import { Phase } from '@prisma/client';
import Button from 'components/ui/Button';

type Props = {
	imageOnly?: boolean;
};

export default function UserDropdown({ imageOnly }: Props) {
	const { data } = trpc.useQuery(['user.me']);

	const context = trpc.useContext();

	const sync = trpc.useMutation(['fit.retrieveFitnessData']);

	const changePase = trpc.useMutation('user.edit', {
		async onSuccess() {
			context.invalidateQueries(['user.me']);
		},
	});

	const dropdownItems = [
		{
			text: 'Sync Data',
			icon: <RefreshIcon />,
			// loading: sync.isLoading,
			action: async () => await sync.mutateAsync(),
		},
		{ text: 'Settings', icon: <CogIcon />, to: '/settings/sync' },
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

	const menuItems = imageOnly
		? [{ items: dropdownItems }]
		: [{ label: 'Phase', items: phaseItems }, { items: dropdownItems }];

	if (data) {
		return (
			<NestedMenu menuItems={menuItems}>
				{imageOnly ? (
					<Image
						className="flex-shrink-0 rounded-full cursor-pointer"
						width={28}
						height={28}
						src={data.image ?? ''}
						alt="userImg"
					/>
				) : (
					<div className="w-full ">
						<Button
							variant="outline"
							color="accent"
							position="left"
							className="w-full"
							rightIcon={<SelectorIcon />}
						>
							<div className="text-left ">
								<span className="text-sm uppercase truncate text-primary">
									{data.name?.slice(0, 2)}{' '}
								</span>
								<span className="text-sm capitalize truncate text-secondary">
									{data.phase?.toLowerCase()}
								</span>
							</div>
						</Button>
					</div>
				)}
			</NestedMenu>
		);
	}
	return <></>;
}
