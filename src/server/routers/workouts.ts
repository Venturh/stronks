import { createRouter } from 'server/createRouter';
import { groupBy, sumBy } from 'lodash';
import dayjs from 'dayjs';

import { db } from 'lib/prisma';
import { getMonth } from 'utils/date';
import { generateWeekyDayTrack } from 'server/utils/misc';

export const workoutsRouter = createRouter().query('index', {
	async resolve({ ctx: { user } }) {
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
	},
});
