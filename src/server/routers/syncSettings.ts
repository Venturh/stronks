import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { db } from 'lib/prisma';
import { createRouter } from 'server/createRouter';

const defaultGoogleFitSetting = Prisma.validator<Prisma.GoogleFitSettingSelect>()({
	id: true,
	syncMeasurements: true,
	syncSteps: true,
	syncNutrition: true,
	syncWorkout: true,
	createdAt: true,
	updatedAt: true,
});

export const syncSettings = createRouter()
	.mutation('toggle', {
		input: z.object({
			id: z.string().uuid(),
			syncMeasurements: z.boolean().optional(),
			syncSteps: z.boolean().optional(),
			syncNutrition: z.boolean().optional(),
			syncActivity: z.boolean().optional(),
			syncWorkout: z.boolean().optional(),
		}),
		async resolve({ input: { id, ...data } }) {
			return await db.googleFitSetting.update({
				where: { id },
				data,
				select: defaultGoogleFitSetting,
			});
		},
	})
	.query('data', {
		async resolve({ ctx }) {
			return db.googleFitSetting.findFirst({
				where: { userId: ctx.session?.user?.id },
				select: defaultGoogleFitSetting,
			});
		},
	});
