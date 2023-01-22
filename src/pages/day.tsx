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
import { GetServerSidePropsContext } from 'next';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from 'server/api/root';
import { createTRPCContext } from 'server/api/trpc';
import SuperJSON from 'superjson';
import { getSession } from 'next-auth/react';

export default function OverviewDay() {
	const { push, query } = useRouter();
	const date = query.date as string;

	const { data } = api.overview.show.useQuery({ date });

	const weight = data?.info?.measurements[0]?.weight;
	const bodyFat = data?.info?.measurements[0]?.bodyFat;

	const selectedDate = dayjs.utc(date).format('YYYY-MM-DD');
	const nextDay = dayjs.utc(date).add(1, 'day').format('YYYY-MM-DD');
	const prevDay = dayjs.utc(date).subtract(1, 'day').format('YYYY-MM-DD');
	const nextDisabled = dayjs.utc(date).isSame(dayjs.utc(), 'day');

	return (
		<AppLayout title="Overview">
			<DescriptionList
				title={toCalendarDate(selectedDate)}
				action={[
					{ children: 'Prev', onClick: () => push({ query: { date: prevDay } }) },
					{
						children: 'Next',
						disabled: nextDisabled,
						onClick: () => push({ query: { date: nextDay } }),
					},
				]}
			>
				{data?.info && (
					<>
						<DescriptionListItem label="Mood">
							{mappedMoods.find(({ value }) => value === data.info.mood)?.label}
						</DescriptionListItem>
						<DescriptionListItem label="Phase">
							{mappedPhases.find(({ value }) => value === data.info.phase)?.label}
						</DescriptionListItem>
						<DescriptionListItem label="Weight">
							{weight ? `${toFixed(weight)} kg` : 'N/A'}
						</DescriptionListItem>
						<DescriptionListItem label="Bodyfat">
							{bodyFat ? `${toFixed(bodyFat)} %` : 'N/A'}
						</DescriptionListItem>
						<DescriptionListItem label="Calories">
							{data.info.calories ? `${toFixed(data.info.calories)} kcal` : 'N/A'}
						</DescriptionListItem>

						<DescriptionListItem label="Habits">
							<div className="grid gap-4 sm:grid-cols-3">
								{data.habits.map(
									(habit) =>
										data.info && (
											<HabitCard
												key={habit.id}
												habit={habit}
												infoId={data.info.id}
												checked={Boolean(
													data.info.completedHabits &&
														data.info?.completedHabits.filter(({ habitId }) => habitId === habit.id)
															.length > 0
												)}
											/>
										)
								)}
							</div>
						</DescriptionListItem>
					</>
				)}
			</DescriptionList>
		</AppLayout>
	);
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/auth/login',
				permanent: false,
			},
		};
	}
	const ssg = createProxySSGHelpers({
		router: appRouter,
		// @ts-ignore TODO: fix this
		ctx: await createTRPCContext(context),
		transformer: SuperJSON,
	});
	const date = (context.query?.date as string) ?? dayjs.utc().format('YYYY-MM-DD');

	await ssg.overview.show.prefetch({ date });
	return {
		props: {
			trpcState: ssg.dehydrate(),
			date,
		},
	};
}
