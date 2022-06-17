import { db } from 'lib/prisma';
import { createRouter } from 'server/createRouter';
import {
	persistActivitySessionData,
	persistMeasurementsFitData,
	persistNutritionFitData,
} from './utils';

enum FitType {
	syncActivity = 'syncActivity',
	syncSteps = 'syncSteps',
	syncWeight = 'syncWeight',
	syncBodyfat = 'syncBodyfat',
	syncNutrition = 'syncNutrition',
	syncSession = 'syncSession',
}

export const fitRouter = createRouter().mutation('retrieveFitnessData', {
	async resolve({ ctx: { session } }) {
		const user = await db.user.findFirst({
			where: { email: session?.user?.email },
			include: { accounts: true },
		});
		if (user) {
			const settings = await db.googleFitSetting.findFirst({ where: { userId: user.id } });
			const enabledSettings: { name: FitType; dataSourceId: string; enabled: boolean }[] = [
				{
					name: FitType.syncSession,
					dataSourceId:
						'derived:com.google.activity.segment:com.google.android.gms:session_activity_segment',
					enabled: settings!.syncSession,
				},
				{
					name: FitType.syncActivity,
					dataSourceId:
						'derived:com.google.activity.segment:com.google.android.gms:session_activity_segment',
					enabled: settings!.syncActivity,
				},
				{
					name: FitType.syncSteps,
					dataSourceId: 'com.google.step_count.delta',
					enabled: settings!.syncSteps,
				},
				{
					name: FitType.syncWeight,
					dataSourceId: 'derived:com.google.weight:com.google.android.gms:merge_weight',
					enabled: settings!.syncWeight,
				},
				{
					name: FitType.syncBodyfat,
					dataSourceId: 'derived:com.google.body.fat.percentage:com.google.android.gms:merged',
					enabled: settings!.syncBodyFat,
				},
				{
					name: FitType.syncNutrition,
					dataSourceId: 'derived:com.google.nutrition:com.google.android.gms:merged',
					enabled: settings!.syncNutrition,
				},
			].filter(({ enabled }) => enabled);
			await Promise.all(
				enabledSettings.map(async ({ name, dataSourceId }) => {
					const accessToken = user.accounts[0].access_token!;
					switch (name) {
						case FitType.syncWeight:
							await persistMeasurementsFitData(dataSourceId, 'weight', user.id, accessToken);
							break;
						case FitType.syncBodyfat:
							await persistMeasurementsFitData(dataSourceId, 'bodyFat', user.id, accessToken);
							break;
						case FitType.syncNutrition:
							await persistNutritionFitData(dataSourceId, accessToken, user.id);
							break;
						case FitType.syncSession:
							await persistActivitySessionData(accessToken, user.id);
							break;
					}
				})
			);

			return 'success';
		}
	},
});
