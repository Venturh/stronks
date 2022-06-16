import superjson from 'superjson';

import { createRouter } from '../createRouter';
import { fitRouter } from './fit/router';
import { syncSettings } from './syncSettings';
import { measurementsRouter } from './measurements';
import { userRouter } from './user';
import { overviewRouter } from './overview';
import { nutritionRouter } from './nutrition';

export const appRouter = createRouter()
	.transformer(superjson)
	// .formatError(({ shape, error }) => { })
	.merge('user.', userRouter)
	.merge('fit.', fitRouter)
	.merge('syncSettings.', syncSettings)
	.merge('nutrition.', nutritionRouter)
	.merge('measurements.', measurementsRouter)
	.merge('overview.', overviewRouter);

export type AppRouter = typeof appRouter;
