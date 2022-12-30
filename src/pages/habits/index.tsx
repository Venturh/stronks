import type { HabitCategory } from '@prisma/client';

import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';

import { authenticatedRoute } from 'utils/redirects';
import Button from 'components/ui/Button';
import { useState } from 'react';
import { trpc } from 'utils/trpc';
import HabitComposer from 'components/habits/HabitsComposer';
import { mappedHabitCategories } from 'shared/habits';

export default function Habits() {
	const [showStoreModal, setShowStoreModal] = useState(false);

	const { data } = trpc.useQuery(['habits.index']);

	return (
		<AppLayout
			title="Habits"
			actions={<Button onClick={() => setShowStoreModal(true)}>New habit</Button>}
		>
			<StackedList grouped>
				{Object.entries(data?.groupedHabits ?? {})?.map(([category, habits], i) => {
					return (
						<StackedListHeader key={i} primary={mappedHabitCategories[category as HabitCategory]}>
							{habits.map(({ id, emote, name }) => {
								return (
									<StackedListItem key={id} primary={`${emote} ${name}`} href={`/habits/${id}`} />
								);
							})}
						</StackedListHeader>
					);
				})}
			</StackedList>
			<HabitComposer open={showStoreModal} setOpen={() => setShowStoreModal(false)} />
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
