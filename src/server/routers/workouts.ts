import { createRouter } from 'server/createRouter';

import { db } from 'lib/prisma';
import { groupBy } from 'lodash';

export const workoutsRouter = createRouter().query('index', {
	async resolve({ ctx: { user } }) {
		const workouts = await db.workouts.findMany({
			where: { userId: user?.id },
			orderBy: { measuredAt: 'desc' },
		});
		return groupBy(workouts, 'measuredFormat');
	},
});
