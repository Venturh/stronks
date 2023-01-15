import { groupBy, sumBy } from 'lodash';
import dayjs from 'dayjs';

import { createTRPCRouter, protectedProcedure } from '../trpc';

import { db } from 'server/db';
import { getMonth } from 'utils/date';
import { generateWeekyDayTrack } from 'server/utils/misc';

export const workoutsRouter = createTRPCRouter({
	index: protectedProcedure.query(async ({ ctx: { user } }) => {
		const workouts = await db.workouts.findMany({
			where: { userId: user?.id },
			orderBy: { measuredAt: 'desc' },
		});

		const stats = { primary: 0, secondary: 0 };

		const latestWorkouts = workouts.filter(
			(w) => w.measuredAt >= dayjs().subtract(new Date().getDay(), 'day').toDate()
		);

		const { days } = generateWeekyDayTrack(latestWorkouts, (workouts) => {
			Object.assign(stats, {
				primary: stats.primary + 1,
				secondary: stats.secondary + sumBy(workouts, 'duration'),
			});
		});

		const items = groupBy(workouts, (d) => getMonth(d));
		return { items, stats: { ...stats, days } };
	}),
});
