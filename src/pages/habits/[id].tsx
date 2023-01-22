import { useRouter } from 'next/router';
import type { HabitCategory } from '@prisma/client';

import AppLayout from 'components/layouts/AppLayout';

import { api } from 'utils/api';
import { authenticatedRoute } from 'utils/redirects';
import { DescriptionList, DescriptionListItem } from 'components/ui/DescripitonList';
import { mappedHabitCategories } from 'shared/habits';
import Badge from 'components/ui/Badge';
import HabitComposer from 'components/habits/HabitsComposer';
import { useState } from 'react';

export default function Weights() {
	const { query } = useRouter();
	const id = query.id as string;

	const { data } = api.habits.show.useQuery({ id });

	const [showEditModal, setShowEditModal] = useState(false);

	return (
		<AppLayout title="Habit" small>
			<DescriptionList
				title="Habit"
				description="Details about the selected habit"
				action={[
					{
						children: 'Edit',
						disabled: !data,
						onClick: () => {
							setShowEditModal(true);
						},
					},
				]}
			>
				<DescriptionListItem label="Name">{data?.name}</DescriptionListItem>
				<DescriptionListItem label="Emote">{data?.emote ?? '-'}</DescriptionListItem>
				<DescriptionListItem label="Category">
					<Badge>{mappedHabitCategories[data?.category as HabitCategory]}</Badge>
				</DescriptionListItem>
			</DescriptionList>
			{/* <StackedList>
				{data?.completedHabits.map(({ id, completedAt }) => {
					return <StackedListItem key={id} primary={toNormalDate(completedAt)} />;
				})}
			</StackedList> */}
			{data && (
				<HabitComposer habit={data} open={showEditModal} setOpen={() => setShowEditModal(false)} />
			)}
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
