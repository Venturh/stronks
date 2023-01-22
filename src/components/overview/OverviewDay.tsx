import HabitCard from 'components/habits/HabitCard';
import AppLayout from 'components/layouts/AppLayout';
import { DescriptionList, DescriptionListItem } from 'components/ui/DescripitonList';
import { useRouter } from 'next/router';
import { toFixed } from 'utils/misc';
import { mappedMoods } from 'utils/mood';
import { mappedPhases } from 'utils/phase';
import { api } from 'utils/api';
import { toCalendarDate } from 'utils/date';
import dayjs from 'dayjs';

export default function OverviewDay() {
	const { query, push } = useRouter();
	const date = query.date as string;

	const { data } = api.overview.show.useQuery({ date });

	const weight = data?.info?.measurements[0]?.weight;
	const bodyFat = data?.info?.measurements[0]?.bodyFat;

	const nextDay = dayjs.utc(date).add(1, 'day').format('YYYY-MM-DD');
	const prevDay = dayjs.utc(date).subtract(1, 'day').format('YYYY-MM-DD');
	const nextDisabled = dayjs.utc(date).isSame(dayjs.utc(), 'day');

	if (data?.info) {
		const { info, habits } = data;
		return (
			<AppLayout title="Overview">
				{data?.info && (
					<DescriptionList
						title={toCalendarDate(info.measuredFormat)}
						action={[
							{ children: 'Prev', onClick: () => push({ query: { date: prevDay } }) },
							{
								children: 'Next',
								disabled: nextDisabled,
								onClick: () => push({ query: { date: nextDay } }),
							},
						]}
					>
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
}
