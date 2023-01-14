import { z } from 'zod';
import { createRouter } from 'server/createRouter';
import { Mood, Phase } from '@prisma/client';

import { db } from 'lib/prisma';

import { OverviewData } from 'types';
import { toFixed } from 'utils/misc';
import { toNormalDate } from 'utils/date';
import { sumBy } from 'lodash';
import dayjs from 'dayjs';
import { updateOverviewSchema } from 'shared/overview';
import { makeApiUuid } from './fit/utils';

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
							gte: from ?? dayjs().subtract(3, 'month').toISOString(),
							lte: to ?? dayjs().toISOString(),
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
						fullDate: toNormalDate(item.measuredFormat),
						phase: item.phase ?? null,
						notes: item.notes ?? null,
						mood: item.mood ?? '?',
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
	.query('show', {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ input: { id }, ctx: { user } }) {
			const info = await db.info.findUnique({
				where: { id },
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
			});

			if (info) {
				const aggregatedInfo = { ...info, calories: sumBy(info.nutritions, 'calories') };
				Object.assign(aggregatedInfo, {
					mood: info.mood ?? '?',
				});

				const habits = await db.habits.findMany({
					where: { userId: user?.id },
					orderBy: { name: 'desc' },
				});
				return { info: aggregatedInfo, habits };
			}

			return { info: undefined, habits: undefined };
		},
	})

	.mutation('update', {
		input: updateOverviewSchema,
		async resolve({ input: { phase, notes, infoId, habitId, mood, weight, bodyFat } }) {
			const info = await db.info.update({
				where: { id: infoId },
				data: {
					phase,
					notes,
					mood,
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

			console.log('weight', weight);
			if (weight || bodyFat) {
				await db.measurements.upsert({
					where: {
						measuredFormat: info.measuredFormat,
					},
					create: {
						weight,
						bodyFat,
						measuredFormat: info.measuredFormat,
						objectId: makeApiUuid([info.measuredFormat.toString()]),
						measuredAt: new Date(),
						infoId: info.id,
						userId: info.userId,
					},
					update: {
						weight,
						bodyFat,
					},
				});
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
