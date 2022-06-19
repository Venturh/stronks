import { z } from 'zod';
import { groupBy } from 'lodash';
import { createRouter } from 'server/createRouter';

import { db } from 'lib/prisma';

export const nutritionRouter = createRouter()
	.query('index', {
		async resolve({ ctx: { user } }) {
			const items =
				(await db.$queryRaw`SELECT"measuredFormat","category",SUM("calories")as calories,string_agg("name",', ')as foodnames FROM "Nutrition" WHERE "userId"=${user?.id} GROUP BY"category","measuredFormat" ORDER BY"measuredFormat" DESC;
    `) as { measuredFormat: string; category: string; calories: number; foodnames: string }[];
			return groupBy(items, 'measuredFormat');
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
	});
