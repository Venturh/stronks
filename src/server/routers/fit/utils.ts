import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import uuidByString from 'uuid-by-string';

import { db } from 'lib/prisma';
import { getAggregatedData, getDatasetData } from './api';

import { toStartOfDay } from 'utils/date';
import { activityTypeMapping } from './types';
import { Nutrition } from '@prisma/client';
import { WithOutIdAndTimestamps } from 'types';

export async function persistMeasurementsFitData(userId: string, accessToken: string) {
	const { bucket } = await getAggregatedData(accessToken, [
		'com.google.weight',
		'com.google.body.fat.percentage',
	]);
	const data = await Promise.all(
		bucket
			.map(async (buck) => {
				const { dataset, startTimeMillis } = buck;
				const weightDataSet = dataset[0]!.point[0]!;
				const bodyFatDataSet = dataset[1].point[0];

				const measuredAt = dayjs.unix(startTimeMillis / 1000).toDate();
				const measuredFormat = toStartOfDay(measuredAt);
				const objectId = makeApiUuid([measuredFormat.toString()]);

				if (!weightDataSet?.value || !bodyFatDataSet?.value) return;

				const data = {
					measuredAt,
					measuredFormat,
					userId,
					objectId,
					weight: weightDataSet.value[1].fpVal as number,
					bodyFat: bodyFatDataSet.value[1].fpVal as number,
					infoId: await createOrUpateInfo(measuredFormat, userId),
				};

				return data;
			})
			.filter((d) => d !== undefined)
	);

	await db.measurements.createMany({
		skipDuplicates: true,
		// @ts-expect-error yep
		data,
	});
}

export async function persistNutritionFitData(
	dataSourceId: string,
	accessToken: string,
	userId: string
) {
	const { point } = await getDatasetData(accessToken, dataSourceId);
	return await Promise.all(
		point.flatMap(async ({ value, startTimeNanos }) => {
			const objectId = makeApiUuid([startTimeNanos.toString()]);
			const measuredAt = dayjs(startTimeNanos / 1000000).toDate();
			let nutrition = value[0].mapVal!.reduce<Record<string, string | number>>((acc, curr) => {
				acc[curr.key] = curr.value.fpVal!;
				return acc;
			}, {});
			nutrition = {
				protein: nutrition.protein,
				calories: nutrition.calories,
				fat: nutrition['fat.total'],
				carbohydrates: nutrition['carbs.total'],
			};
			const [name, amount] = value[2].stringVal!.split(', ');

			const measuredAtHours = dayjs.utc(measuredAt).hour();
			const category =
				measuredAtHours < 10
					? 'breakfast'
					: measuredAtHours < 13
					? 'lunch'
					: measuredAtHours < 16
					? 'snack'
					: measuredAtHours < 20
					? 'dinner'
					: 'other';

			const measuredFormat = toStartOfDay(measuredAt);
			const data = {
				name,
				amount,
				measuredAt,
				measuredFormat,
				category,
				userId,
				objectId,
				synced: true,
				infoId: await createOrUpateInfo(measuredFormat, userId),
				originDataSourceId: dataSourceId,
				...nutrition,
			};

			return await db.nutrition.upsert({
				where: { objectId },
				update: data,
				create: data,
			});
		})
	);
}

export async function persistWorkoutData(accessToken: string, userId: string) {
	const { bucket } = await getAggregatedData(
		accessToken,
		['com.google.calories.expended', 'com.google.active_minutes'],
		'bucketBySession'
	);
	const data = await Promise.all(
		bucket.map(async (buck) => {
			const { dataset, session, startTimeMillis } = buck;
			const { activityType, application, name, id } = session!;
			const caloriesDataSet = dataset[0]!.point[0]!;
			const durationDataSet = dataset[1].point[0];
			const measuredAt = dayjs.unix(startTimeMillis / 1000).toDate();
			const measuredFormat = toStartOfDay(measuredAt);
			const data = {
				name,
				activityType,
				measuredAt,
				measuredFormat,
				userId,
				objectId: id,
				infoId: await createOrUpateInfo(measuredFormat, userId),
				activityTypeName: activityTypeMapping.get(activityType)!,
				appName: application.packageName,
				duration: durationDataSet.value[0].intVal!,
				calories: caloriesDataSet.value[0].fpVal! as number,
			};

			return data;
		})
	);
	await db.workouts.createMany({ skipDuplicates: true, data });
}

export async function persistActivityStepsData(accessToken: string, userId: string) {
	const { bucket } = await getAggregatedData(
		accessToken,
		[
			'com.google.step_count.delta',
			'com.google.distance.delta',
			'com.google.calories.expended',
			'com.google.active_minutes',
			'com.google.speed',
		],
		'bucketByTime'
	);

	const data = await Promise.all(
		bucket.map(async (buck) => {
			const { dataset, startTimeMillis } = buck;

			const steps = dataset[0]?.point[0]?.value[0]?.intVal ?? 0;
			const distance = dataset[1]?.point[0]?.value[0]?.fpVal;
			const calories = dataset[2]?.point[0]?.value[0]?.fpVal;
			const duration = dataset[3]?.point[0]?.value[0]?.intVal;
			const speed = dataset[4]?.point[0]?.value[1]?.fpVal;

			const measuredAt = dayjs.unix(startTimeMillis / 1000).toDate();
			const measuredFormat = toStartOfDay(measuredAt);
			const objectId = makeApiUuid([measuredFormat.toString()]);

			const data = {
				measuredFormat,
				userId,
				steps,
				distance,
				calories,
				duration,
				speed,
				objectId,
				infoId: await createOrUpateInfo(measuredFormat, userId),
			};
			return data;
		})
	);

	await db.activitySteps.createMany({
		skipDuplicates: true,
		data: data,
	});
}

export async function createNutrition(
	{
		userId,
		...nutrition
	}: Omit<
		WithOutIdAndTimestamps<Nutrition>,
		'measuredAt' | 'measuredFormat' | 'objectId' | 'originDataSourceId' | 'infoId'
	>,
	date: string
) {
	const measuredAt = dayjs(date).toDate();
	const measuredFormat = toStartOfDay(measuredAt);
	const objectId = makeApiUuid([measuredAt.toString(), userId, Math.random().toString()]);

	return db.nutrition.create({
		data: {
			...nutrition,
			measuredAt,
			measuredFormat,
			objectId,
			userId,
			infoId: await createOrUpateInfo(measuredFormat, userId),
		},
	});
}

async function createOrUpateInfo(measuredFormat: Date, userId: string) {
	const info = await db.info.findFirst({ where: { measuredFormat, userId } });
	if (info) return info.id;
	else {
		const user = await db.user.findUnique({ where: { id: userId } });
		const newInfo = await db.info.create({ data: { measuredFormat, userId, phase: user?.phase } });
		await db.supplements.create({
			data: { infoId: newInfo.id, measuredFormat, userId },
		});
		return newInfo.id;
	}
}

export function makeApiUuid(keys: string[]) {
	return uuidByString(keys.join('-'));
}
