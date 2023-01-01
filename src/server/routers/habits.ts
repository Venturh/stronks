import { createRouter } from 'server/createRouter';

import { db } from 'lib/prisma';
import { completeHabitSchema, createHabitSchema, updateHabitSchema } from 'shared/habits';
import { groupBy } from 'lodash';
import { z } from 'zod';
import { idSchema } from 'shared';

export const habitsRouter = createRouter()
	.query('index', {
		async resolve({ ctx: { user } }) {
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
		},
	})
	.query('show', {
		input: z.object({ id: z.string() }),
		async resolve({ input: { id } }) {
			const habit = await db.habits.findUnique({
				where: { id },
				include: {
					completedHabits: true,
				},
			});

			return habit;
		},
	})
	.mutation('store', {
		input: createHabitSchema,
		async resolve({ input: data, ctx: { user } }) {
			const habit = await db.habits.create({
				data: { ...data, userId: user!.id },
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
		},
	})
	.mutation('update', {
		input: updateHabitSchema,
		async resolve({ input: data }) {
			const { id, ...rest } = data;
			const habit = await db.habits.update({
				where: { id },
				data: { ...rest },
			});
			return habit;
		},
	})
	.mutation('delete', {
		input: idSchema,
		async resolve({ input: data, ctx: { user } }) {
			const { id } = data;
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
		},
	})
	.mutation('complete', {
		input: completeHabitSchema,
		async resolve({ input: { habitId, infoId } }) {
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
		},
	});
