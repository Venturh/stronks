import { createRouter } from 'server/createRouter';

import { db } from 'lib/prisma';

export const stepsRouter = createRouter().query('index', {
	async resolve({ ctx: { user } }) {
		return await db.activitySteps.findMany({
			where: { userId: user?.id },
			orderBy: { measuredFormat: 'desc' },
		});
	},
});
