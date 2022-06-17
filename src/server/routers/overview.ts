import { z } from 'zod';
import { createRouter } from 'server/createRouter';
import { Phase } from '@prisma/client';

import { db } from 'lib/prisma';

import { OverviewData } from 'types';

export const overviewRouter = createRouter()
	.query('index', {
		async resolve({ ctx: { user } }) {
			const items =
				(await db.$queryRaw`SELECT TO_CHAR(i."measuredFormat",'dd.MM.YY')AS"date",phase,calories,round("weight"::numeric,2)AS"weight",round("bodyFat"::numeric,2)AS"bodyFat",(ac."activityDuration" IS NOT NULL)AS"training",ac."activityDuration",notes,i."id","creatine" FROM"Info" AS i LEFT JOIN(SELECT"userId","measuredFormat",SUM(calories)AS calories FROM"Nutrition" GROUP BY"measuredFormat","userId")n ON i."userId"=n."userId" AND i."measuredFormat"=n."measuredFormat" LEFT JOIN(SELECT"userId","measuredFormat","weight","bodyFat" FROM"Measurements" AS me)m ON i."userId"=m."userId" AND i."measuredFormat"=m."measuredFormat" LEFT JOIN(SELECT"userId","measuredFormat",sum(duration)AS"activityDuration" FROM"ActivitySession" GROUP BY"userId","measuredFormat")ac ON i."userId"=ac."userId" AND i."measuredFormat"=ac."measuredFormat" LEFT JOIN(SELECT"userId","measuredFormat",creatine FROM"Supplements")su ON i."userId"=su."userId" AND i."measuredFormat"=su."measuredFormat" WHERE i."userId"=${user?.id} AND weight IS NOT NULL ORDER BY i."measuredFormat" DESC;
            `) as OverviewData[];
			if (user) {
				const { hiddenOverviewColumns, orderOverviewColumns } = (await db.user.findUnique({
					where: { id: user?.id },
				}))!;

				return { items, hiddenOverviewColumns, orderOverviewColumns };
			}
		},
	})
	.mutation('update', {
		input: z.object({
			infoId: z.string(),
			phase: z.nativeEnum(Phase).optional(),
			notes: z.string().optional(),
			creatine: z.boolean().optional(),
		}),
		async resolve({ input: { phase, notes, infoId, creatine } }) {
			return await db.info.update({
				where: { id: infoId },
				data: { phase, notes, supplement: { update: { creatine } } },
			});
		},
	});
