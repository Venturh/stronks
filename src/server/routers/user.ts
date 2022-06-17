import { Phase, Prisma } from '@prisma/client';
import { z } from 'zod';

import { db } from 'lib/prisma';
import { createRouter } from 'server/createRouter';

const defaultSelect = Prisma.validator<Prisma.UserSelect>()({
	id: true,
	name: true,
	email: true,
	phase: true,
	image: true,
});

export const userRouter = createRouter()
	.query('me', {
		async resolve({ ctx: { user } }) {
			return await db.user.findUnique({
				where: { id: user?.id },
				select: defaultSelect,
			});
		},
	})
	// update
	.mutation('edit', {
		input: z.object({
			data: z.object({
				name: z.string().min(1).max(32).optional(),
				email: z.string().email().optional(),
				phase: z.nativeEnum(Phase).optional(),
				hiddenOverviewColumns: z.array(z.string()).optional(),
				orderOverviewColumns: z.array(z.string()).optional(),
			}),
		}),
		async resolve({ input, ctx: { user } }) {
			const { data } = input;
			return await db.user.update({
				where: { id: user?.id },
				data,
				select: defaultSelect,
			});
		},
	});
