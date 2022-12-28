import { z } from 'zod';
import { createRouter } from 'server/createRouter';
import { Phase } from '@prisma/client';

import { db } from 'lib/prisma';

import { OverviewData } from 'types';

export const overviewRouter = createRouter()
	.query('index', {
		async resolve({ ctx: { user } }) {
			if (user) {
				const items = (await db.$queryRaw`
                    SELECT
                        TO_CHAR(i."measuredFormat",'dd.MM') AS "date",
                        phase,calories,round("weight"::numeric,2) AS "weight",
                        round("bodyFat"::numeric,2) AS "bodyFat",
                        (ac."workoutDuration" IS NOT NULL) AS "training",
                        ac."workoutDuration",notes,i."id" FROM"Info" AS i
                        LEFT JOIN(SELECT"userId","measuredFormat",SUM(calories)AS calories FROM"Nutrition" GROUP BY"measuredFormat","userId")n ON i."userId"=n."userId" AND i."measuredFormat"=n."measuredFormat"
                         LEFT JOIN(SELECT"userId","measuredFormat","weight","bodyFat" FROM"Measurements" AS me)m ON i."userId"=m."userId" AND i."measuredFormat"=m."measuredFormat"
                         LEFT JOIN(SELECT"userId","measuredFormat",sum(duration)AS"workoutDuration" FROM"Workouts" GROUP BY"userId","measuredFormat")ac ON i."userId"=ac."userId" AND i."measuredFormat"=ac."measuredFormat"
                         ORDER BY i."measuredFormat" DESC;
            `) as OverviewData[];

				const { hiddenOverviewColumns, orderOverviewColumns } = (await db.user.findUnique({
					where: { id: user?.id },
				}))!;

				const habits = await db.habits.findMany({
					where: { userId: user?.id },
					orderBy: { name: 'desc' },
				});

				const completedHabits = await db.completedHabits.findMany({
					where: { habit: { userId: user.id } },
				});

				//add habit data to items
				items.forEach((item) => {
					const itemCompletedHabits = completedHabits.filter((completedHabit) => {
						return completedHabit.infoId === item.id;
					});
					if (itemCompletedHabits.length > 0) {
						itemCompletedHabits.forEach((completedHabit) => {
							const habit = habits.find((habit) => habit.id === completedHabit.habitId);
							if (habit) {
								// @ts-ignore
								item[habit.id] = true;
							}
						});
					}
				});

				return { items, hiddenOverviewColumns, orderOverviewColumns, habits };
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
