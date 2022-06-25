import { z } from 'zod';
import dayjs from 'dayjs';
import { groupBy, sumBy } from 'lodash';

import { createRouter } from 'server/createRouter';
import { db } from 'lib/prisma';
import { getMonth, toStartOfDay } from 'utils/date';
import { generateWeekyDayTrack } from 'server/utils/misc';
import { toFixed } from 'utils/misc';
import { createNutrition } from './fit/utils';
import { createNutritionSchema } from 'components/nutrition/NutritionComposer';

export const nutritionRouter = createRouter()
	.query('index', {
		async resolve({ ctx: { user } }) {
			const data =
				(await db.$queryRaw`SELECT "measuredFormat","category",SUM("calories")as calories,string_agg("name",', ')as foodnames FROM "Nutrition" WHERE "userId"=${user?.id} GROUP BY"category","measuredFormat" ORDER BY"measuredFormat" DESC;
    `) as { measuredFormat: string; category: string; calories: number; foodnames: string }[];

			const items = groupBy(data, (d) => getMonth(d));

			const stats = { primary: 0, secondary: 0 };

			const latestNutrition = Object.entries(groupBy(data, 'measuredFormat'))
				.filter(
					([date]) => dayjs(date).toDate() >= dayjs().subtract(new Date().getDay(), 'days').toDate()
				)
				.flatMap(([_, items]) =>
					items.map((i) => ({ ...i, measuredAt: toStartOfDay(i.measuredFormat) }))
				);

			const { days } = generateWeekyDayTrack(latestNutrition, (ms) => {
				Object.assign(stats, {
					primary: stats.primary + 1,
					secondary: ms.length > 0 ? stats.secondary + sumBy(ms, 'calories') : null,
				});
			});

			return {
				items,
				stats: {
					...stats,
					secondary: toFixed(stats.secondary / stats.primary, 0, 0),
					days,
				},
			};
		},
	})
	.query('show', {
		input: z.object({
			category: z.string(),
			measuredFormat: z.string(),
		}),
		async resolve({ input }) {
			const { category, measuredFormat } = input;
			return db.nutrition.findMany({ where: { category, measuredFormat } });
		},
	})
	.mutation('store', {
		input: createNutritionSchema,
		async resolve({ input: { date, ...rest }, ctx: { user } }) {
			return await createNutrition({ userId: user!.id, synced: false, ...rest }, date);
		},
	})
	.mutation('destroy', {
		input: z.object({ id: z.string() }),
		async resolve({ input: { id } }) {
			return await db.nutrition.delete({ where: { id } });
		},
	});
