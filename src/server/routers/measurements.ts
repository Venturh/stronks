import dayjs from 'dayjs';
import { groupBy } from 'lodash';

import { db } from 'lib/prisma';

import { createRouter } from 'server/createRouter';
import { generateWeekyDayTrack } from 'server/utils/misc';
import { getMonth } from 'utils/date';

export const measurementsRouter = createRouter().query('index', {
	async resolve({ ctx }) {
		const measurements = await db.measurements.findMany({
			where: { userId: ctx.session?.user?.id },
			orderBy: { measuredFormat: 'desc' },
		});

		const items = groupBy(measurements, (d) => getMonth(d));

		const stats = { primary: 0, secondary: 0 };

		const latestMeasurements = measurements.filter(
			(w) => w.measuredAt >= dayjs().subtract(new Date().getDay(), 'day').toDate()
		);

		const { days } = generateWeekyDayTrack(latestMeasurements, (ms) => {
			Object.assign(stats, {
				primary: stats.primary + 1,
				secondary: '',
			});
		});

		return { items, stats: { ...stats, days } };
	},
});
