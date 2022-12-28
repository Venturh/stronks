import { createRouter } from 'server/createRouter';

import { db } from 'lib/prisma';
import { groupBy, sumBy } from 'lodash';
import { getMonth } from 'utils/date';
import dayjs from 'dayjs';
import { generateWeekyDayTrack } from 'server/utils/misc';
import { toFixed } from 'utils/misc';

export const stepsRouter = createRouter().query('index', {
	async resolve({ ctx: { user } }) {
		const steps = await db.activitySteps.findMany({
			where: { userId: user?.id },
			orderBy: { measuredFormat: 'desc' },
		});

		const items = groupBy(steps, (s) => getMonth(s));

		const stats = { primary: 0, secondary: 0 };

		const latestSteps = steps.filter(
			({ measuredFormat, steps }) =>
				dayjs(measuredFormat).toDate() >= dayjs().subtract(new Date().getDay(), 'days').toDate() &&
				steps >= 100
		);

		console.log(latestSteps);

		const { days } = generateWeekyDayTrack(latestSteps, (stepsData) => {
			Object.assign(stats, {
				primary: stats.primary + 1,
				secondary: stepsData.length > 0 ? stats.secondary + sumBy(stepsData, 'steps') : null,
			});
		});

		return {
			items,
			stats: {
				...stats,
				days,
				secondary: toFixed(stats.secondary / stats.primary, 0, 0),
			},
		};
	},
});
