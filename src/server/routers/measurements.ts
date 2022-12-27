import dayjs from 'dayjs';
import { groupBy } from 'lodash';
import z from 'zod';

import { db } from 'lib/prisma';

import { createRouter } from 'server/createRouter';
import { generateWeekyDayTrack } from 'server/utils/misc';
import { getMonth } from 'utils/date';

export const measurementsRouter = createRouter().query('index', {
	input: z.object({
		type: z.enum(['weight', 'bodyFat']),
		interval: z.number(),
	}),
	async resolve({ ctx, input }) {
		const { type, interval } = input;

		const measurements = await db.measurements.findMany({
			where: { userId: ctx.session?.user?.id },
			orderBy: { measuredFormat: 'desc' },
		});

		const items = groupBy(measurements, (d) => getMonth(d));

		const stats = { primary: 0, secondary: 0 };

		const latestMeasurements = measurements.filter(
			(w) => w.measuredAt >= dayjs().subtract(new Date().getDay(), 'day').toDate()
		);

		const now = dayjs();
		const dates = Array.from({ length: interval }, (_, i) => now.subtract(i, 'day').toDate());

		const series = dates
			.map((measuredAt) => {
				const measurement = measurements.find((m) => dayjs(m.measuredAt).isSame(measuredAt, 'day'));

				return [measuredAt, measurement ? measurement[type] : null];
			})
			.filter((s) => s[1] !== null);

		const weightGoalSeries = series.map((s) => [s[0], 80]);

		const { days } = generateWeekyDayTrack(latestMeasurements, () => {
			Object.assign(stats, {
				primary: stats.primary + 1,
				secondary: '',
			});
		});

		return {
			items,
			stats: { ...stats, days },
			series: [{ data: series as any[] }, { data: weightGoalSeries as any[] }],
		};
	},
});
