import { z } from 'zod';
import dayjs from 'dayjs';
import { groupBy, sumBy } from 'lodash';

import { db } from 'server/db';
import { getMonth, toStartOfDay } from 'utils/date';
import { generateWeekyDayTrack } from 'server/utils/misc';
import { toFixed } from 'utils/misc';
import { createNutrition } from './fit/utils';
import { createNutritionSchema } from 'components/nutrition/NutritionComposer';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { idSchema } from 'shared';

export const nutritionRouter = createTRPCRouter({
	index: protectedProcedure.query(async ({ ctx }) => {
		const { user } = ctx;
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
	}),
	show: protectedProcedure
		.input(
			z.object({
				category: z.string(),
				measuredFormat: z.string(),
			})
		)
		.query(async ({ input }) => {
			const { category, measuredFormat } = input;
			return db.nutrition.findMany({ where: { category, measuredFormat } });
		}),
	store: protectedProcedure.input(createNutritionSchema).mutation(async ({ input, ctx }) => {
		const { date, ...rest } = input;
		const { user } = ctx;
		return await createNutrition({ userId: user!.id, synced: false, ...rest }, date);
	}),
	delete: protectedProcedure.input(idSchema).mutation(async ({ input }) => {
		const { id } = input;
		return await db.nutrition.delete({ where: { id } });
	}),
});
