import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { db } from 'server/db';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const defaultGoogleFitSetting = Prisma.validator<Prisma.GoogleFitSettingSelect>()({
	id: true,
	syncMeasurements: true,
	syncSteps: true,
	syncNutrition: true,
	syncWorkout: true,
	createdAt: true,
	updatedAt: true,
});

export const syncSettings = createTRPCRouter({
	toggle: protectedProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				syncMeasurements: z.boolean().optional(),
				syncSteps: z.boolean().optional(),
				syncNutrition: z.boolean().optional(),
				syncActivity: z.boolean().optional(),
				syncWorkout: z.boolean().optional(),
			})
		)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;

			return await db.googleFitSetting.update({
				where: { id },
				data,
				select: defaultGoogleFitSetting,
			});
		}),
	data: protectedProcedure.query(async ({ ctx }) => {
		return db.googleFitSetting.findFirst({
			where: { userId: ctx.session?.user?.id },
			select: defaultGoogleFitSetting,
		});
	}),
});
