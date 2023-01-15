import { createTRPCRouter } from './trpc';
import { userRouter } from './routers/user';
import { fitRouter } from './routers/fit/router';
import { habitsRouter } from './routers/habits';
import { measurementsRouter } from './routers/measurements';
import { nutritionRouter } from './routers/nutrition';
import { overviewRouter } from './routers/overview';
import { stepsRouter } from './routers/steps';
import { syncSettings } from './routers/syncSettings';
import { workoutsRouter } from './routers/workouts';

export const appRouter = createTRPCRouter({
	user: userRouter,
	fit: fitRouter,
	syncSettings: syncSettings,
	nutrition: nutritionRouter,
	measurements: measurementsRouter,
	workouts: workoutsRouter,
	steps: stepsRouter,
	habits: habitsRouter,
	overview: overviewRouter,
});

export type AppRouter = typeof appRouter;
