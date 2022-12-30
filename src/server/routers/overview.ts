import { z } from 'zod';
import { createRouter } from 'server/createRouter';
import { Phase } from '@prisma/client';

import { db } from 'lib/prisma';

import { OverviewData } from 'types';
import { toFixed } from 'utils/misc';
import { toNormalDate } from 'utils/date';
import { sumBy } from 'lodash';

export const overviewRouter = createRouter()
	.query('index', {
		input: z.object({
			from: z.string().optional(),
			to: z.string().optional(),
		}),
		async resolve({ input: { from, to }, ctx: { user } }) {
			if (user) {
				const info = await db.info.findMany({
					include: {
						nutritions: {
							select: {
								calories: true,
							},
						},
						measurements: {
							select: {
								weight: true,
								bodyFat: true,
							},
						},
						workouts: {
							select: {
								duration: true,
							},
						},
						activitySteps: {
							select: {
								steps: true,
							},
						},
						completedHabits: {
							select: {
								habitId: true,
								completedAt: true,
							},
						},
					},
					where: {
						userId: user.id,
						measuredFormat: {
							gte: from,
							lte: to,
						},
					},
					orderBy: {
						measuredFormat: 'desc',
					},
				});

				const { hiddenOverviewColumns, orderOverviewColumns } = (await db.user.findUnique({
					where: { id: user?.id },
				}))!;

				const habits = await db.habits.findMany({
					where: { userId: user?.id },
					orderBy: { name: 'desc' },
				});

				const overview = info.map((item) => {
					const summedCalories = sumBy(item.nutritions, 'calories');

					const mappedItem = {
						id: item.id,
						date: toNormalDate(item.measuredFormat, true),
						phase: item.phase,
						notes: item.notes,
						calories: summedCalories > 0 ? toFixed(summedCalories) : undefined,
						weight: toFixed(item.measurements[0]?.weight),
						bodyFat: toFixed(item.measurements[0]?.bodyFat),
						training: Boolean(item.workouts[0]?.duration),
					};
					item.completedHabits.forEach((completedHabit) => {
						const habit = habits.find((habit) => habit.id === completedHabit.habitId);
						if (habit) {
							// @ts-ignore
							mappedItem[habit.id] = true;
						}
					});
					return mappedItem as OverviewData;
				});

				return { overview, hiddenOverviewColumns, orderOverviewColumns, habits };
			}
		},
	})
	.mutation('update', {
		input: z.object({
			infoId: z.string(),
			phase: z.nativeEnum(Phase).optional(),
			notes: z.string().optional(),
			habitId: z.string().optional(),
		}),
		async resolve({ input: { phase, notes, infoId, habitId } }) {
			const info = await db.info.update({
				where: { id: infoId },
				data: {
					phase,
					notes,
				},
			});

			if (habitId) {
				const completedHabit = await db.completedHabits.findFirst({
					where: {
						habitId,
						infoId: info.id,
					},
				});

				if (completedHabit) {
					await db.completedHabits.delete({
						where: {
							id: completedHabit.id,
						},
					});
				} else {
					await db.completedHabits.create({
						data: {
							habitId,
							completedAt: new Date(),
							infoId: info.id,
						},
					});
				}
			}

			return info;
		},
	})
	.mutation('bulk-update', {
		input: z.object({
			infoIds: z.array(z.string()),
			phase: z.nativeEnum(Phase),
			habitIds: z.array(z.string()).optional(),
		}),
		async resolve({ input: { phase, infoIds, habitIds } }) {
			await db.info.updateMany({
				where: { id: { in: infoIds } },
				data: { phase },
			});

			habitIds?.forEach(async (habitId) => {
				await db.completedHabits.deleteMany({
					where: {
						habitId,
					},
				});

				await db.completedHabits.createMany({
					data: infoIds.map((infoId) => ({
						habitId,
						completedAt: new Date(),
						infoId,
					})),
					skipDuplicates: true,
				});
			});
		},
	});
