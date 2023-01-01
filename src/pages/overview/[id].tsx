import HabitCard from 'components/habits/HabitCard';
import AppLayout from 'components/layouts/AppLayout';
import { DescriptionList, DescriptionListItem } from 'components/ui/DescripitonList';
import { useRouter } from 'next/router';
import { toFixed } from 'utils/misc';
import { mappedMoods } from 'utils/mood';
import { mappedPhases } from 'utils/phase';
import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';

export default function OverviewDay() {
	const { query } = useRouter();
	const id = query.id as string;

	const { data } = trpc.useQuery(['overview.show', { id }]);

	const weight = data?.info?.measurements[0]?.weight;
	const bodyFat = data?.info?.measurements[0]?.bodyFat;

	if (data?.info) {
		const { info, habits } = data;
		return (
			<AppLayout title="Overview">
				{data?.info && (
					<DescriptionList title={info.measuredFormat.toLocaleDateString()}>
						<DescriptionListItem label="Mood">
							{mappedMoods.find(({ value }) => value === info.mood)?.label}
						</DescriptionListItem>
						<DescriptionListItem label="Phase">
							{mappedPhases.find(({ value }) => value === info.phase)?.label}
						</DescriptionListItem>
						<DescriptionListItem label="Weight">
							{weight ? `${toFixed(weight)} kg` : 'N/A'}
						</DescriptionListItem>
						<DescriptionListItem label="Bodyfat">
							{bodyFat ? `${toFixed(bodyFat)} %` : 'N/A'}
						</DescriptionListItem>
						<DescriptionListItem label="Calories">
							{info.calories ? `${toFixed(info.calories)} kcal` : 'N/A'}
						</DescriptionListItem>

						<DescriptionListItem label="Habits">
							<div className="grid gap-4 sm:grid-cols-3">
								{habits.map(
									(habit) =>
										info && (
											<HabitCard
												key={habit.id}
												habit={habit}
												infoId={info.id}
												checked={Boolean(
													info.completedHabits &&
														info?.completedHabits.filter(({ habitId }) => habitId === habit.id)
															.length > 0
												)}
											/>
										)
								)}
							</div>
						</DescriptionListItem>
					</DescriptionList>
				)}
			</AppLayout>
		);
	}

	return <AppLayout title="Overview">Lel</AppLayout>;
}

export const getServerSideProps = authenticatedRoute;
