import { Phase, Prisma } from '@prisma/client';
import { z } from 'zod';

import { db } from 'server/db';
import { createTRPCRouter, protectedProcedure } from '../trpc';

const defaultSelect = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	name: true,
	email: true,
	phase: true,
	image: true,
});

export const userRouter = createTRPCRouter({
	me: protectedProcedure.query(async ({ ctx: { user } }) => {
		return await db.user.findUnique({
			where: { id: user?.id },
			select: defaultSelect,
		});
	}),
	edit: protectedProcedure
		.input(
			z.object({
				data: z.object({
					name: z.string().min(1).max(32).optional(),
					email: z.string().email().optional(),
					phase: z.nativeEnum(Phase).optional(),
					hiddenOverviewColumns: z.array(z.string()).optional(),
					orderOverviewColumns: z.array(z.string()).optional(),
				}),
			})
		)
		.mutation(async ({ input, ctx: { user } }) => {
			const { data } = input;
			return await db.user.update({
				where: { id: user?.id },
				data,
				select: defaultSelect,
			});
		}),
});
