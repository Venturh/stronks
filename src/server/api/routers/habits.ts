import { createTRPCRouter, protectedProcedure } from '../trpc';

import { db } from 'server/db';
import { completeHabitSchema, createHabitSchema, updateHabitSchema } from 'shared/habits';
import { groupBy } from 'lodash';
import { z } from 'zod';
import { idSchema } from 'shared';

export const habitsRouter = createTRPCRouter({
	index: protectedProcedure.query(async ({ ctx }) => {
		const { user } = ctx;
		const habits = await db.habits.findMany({
			where: { userId: user?.id },
			orderBy: { name: 'desc' },
			include: {
				completedHabits: true,
			},
		});

		const groupedHabits = groupBy(habits, 'category');
		return {
			groupedHabits,
		};
	}),
	show: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
		const { id } = input;
		const habit = await db.habits.findUnique({
			where: { id },
			include: {
				completedHabits: true,
			},
		});
		return habit;
	}),
	store: protectedProcedure.input(createHabitSchema).mutation(async ({ input, ctx }) => {
		const { user } = ctx;
		const habit = await db.habits.create({
			data: { ...input, userId: user!.id },
		});
		await db.user.update({
			where: { id: user?.id },
			data: {
				orderOverviewColumns: {
					push: habit.id,
				},
			},
		});
		return habit;
	}),

	update: protectedProcedure.input(updateHabitSchema).mutation(async ({ input }) => {
		const { id, ...rest } = input;
		const habit = await db.habits.update({
			where: { id },
			data: { ...rest },
		});
		return habit;
	}),
	delete: protectedProcedure.input(idSchema).mutation(async ({ input, ctx }) => {
		const { id } = input;
		const { user } = ctx;
		if (user) {
			await db.user.update({
				where: { id: user.id },
				data: {
					orderOverviewColumns: {
						set: user.orderOverviewColumns.filter((columnId) => columnId !== id),
					},
				},
			});
		}
		return await db.habits.delete({
			where: { id },
		});
	}),
	complete: protectedProcedure.input(completeHabitSchema).mutation(async ({ input }) => {
		const { habitId, infoId } = input;
		const completedHabit = await db.completedHabits.findFirst({
			where: {
				habitId,
				infoId,
			},
		});
		if (completedHabit) {
			return await db.completedHabits.delete({
				where: {
					id: completedHabit.id,
				},
			});
		}

		return await db.completedHabits.create({
			data: {
				habitId,
				completedAt: new Date(),
				infoId,
			},
		});
	}),
});
