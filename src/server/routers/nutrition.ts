import { Prisma } from '@prisma/client';

import { db } from 'lib/prisma';
import { groupBy } from 'lodash';
import { createRouter } from 'server/createRouter';

const defaultSelect = Prisma.validator<Prisma.NutritionSelect>()({
	id: true,
	objectId: true,
	name: true,
	calories: true,
	measuredFormat: true,
	fat: true,
	protein: true,
	measuredAt: true,
});

export const nutritionRouter = createRouter().query('index', {
	async resolve({ ctx }) {
		const nutrition = await db.nutrition.findMany({
			where: { userId: ctx.session?.user?.id },
			select: defaultSelect,
			orderBy: { measuredAt: 'desc' },
		});
		return groupBy(nutrition, (d) => d.measuredFormat);
	},
});
