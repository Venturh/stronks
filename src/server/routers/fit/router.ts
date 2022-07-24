import { db } from 'lib/prisma';
import { Session, User } from 'next-auth';
import { createRouter } from 'server/createRouter';
import {
	persistWorkoutData,
	persistActivityStepsData,
	persistMeasurementsFitData,
	persistNutritionFitData,
} from './utils';

enum FitType {
	syncSteps = 'syncSteps',
	syncMeasurements = 'syncMeasurements',
	syncNutrition = 'syncNutrition',
	syncWorkout = 'syncWorkout',
}

export const fitRouter = createRouter().mutation('retrieveFitnessData', {
	async resolve({ ctx: { session } }) {
		await syncData(session?.user);
		return 'success';
	},
});

export async function syncData(user?: User | null) {
	const prismaUser = await db.user.findFirst({
		where: { email: user?.email },
		include: { accounts: true },
	});
	if (prismaUser) {
		const settings = await db.googleFitSetting.findFirst({ where: { userId: prismaUser.id } });
		const enabledSettings: { name: FitType; dataSourceId: string; enabled: boolean }[] = [
			{
				name: FitType.syncWorkout,
				dataSourceId:
					'derived:com.google.activity.segment:com.google.android.gms:session_activity_segment',
				enabled: settings!.syncWorkout,
			},
			{
				name: FitType.syncSteps,
				dataSourceId: 'com.google.step_count.delta',
				enabled: settings!.syncSteps,
			},
			{
				name: FitType.syncMeasurements,
				dataSourceId: 'derived:com.google.weight:com.google.android.gms:merge_weight',
				enabled: settings!.syncMeasurements,
			},
			{
				name: FitType.syncNutrition,
				dataSourceId: 'derived:com.google.nutrition:com.google.android.gms:merged',
				enabled: settings!.syncNutrition,
			},
		].filter(({ enabled }) => enabled);

		const accessToken = prismaUser.accounts[0].access_token!;

		for (const { name, dataSourceId } of enabledSettings) {
			switch (name) {
				case FitType.syncMeasurements:
					await persistMeasurementsFitData(prismaUser.id, accessToken);
					break;
				case FitType.syncNutrition:
					await persistNutritionFitData(dataSourceId, accessToken, prismaUser.id);
					break;
				case FitType.syncWorkout:
					await persistWorkoutData(accessToken, prismaUser.id);
					break;
				case FitType.syncSteps:
					await persistActivityStepsData(accessToken, prismaUser.id);
					break;
			}
		}
		// await Promise.all(
		// 	enabledSettings.map(async ({ name, dataSourceId }) => {
		// 		const accessToken = user.accounts[0].access_token!;
		// 		switch (name) {
		// 			case FitType.syncMeasurements:
		// 				await persistMeasurementsFitData(user.id, accessToken);
		// 				break;
		// 			case FitType.syncNutrition:
		// 				await persistNutritionFitData(dataSourceId, accessToken, user.id);
		// 				break;
		// 			case FitType.syncWorkout:
		// 				await persistWorkoutData(accessToken, user.id);
		// 				break;
		// 			case FitType.syncSteps:
		// 				await persistActivityStepsData(accessToken, user.id);
		// 				break;
		// 		}
		// 	})
		// );
	}
}
