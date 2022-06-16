import axios, { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import uuidByString from 'uuid-by-string';

import { db } from 'lib/prisma';
import { AggregatedDataSourceResponse, DataSourceResponse, FitSession } from './types';
import { toStartOfDay } from 'utils/date';

export async function getSessionData(accessToken: string) {
	const startTime = dayjs().subtract(2, 'months').toISOString();
	const { data }: AxiosResponse<FitSession> = await axios.get(
		`https://www.googleapis.com/fitness/v1/users/me/sessions/?startTime=${startTime}`,
		{ headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' } }
	);
	return data;
}

export async function getDatasetData(accessToken: string, dataSourceId: string) {
	const startTime = dayjs().subtract(2, 'months').unix() * 1000000000;
	const endTime = dayjs().subtract(0, 'days').unix() * 1000000000;
	const { data }: AxiosResponse<DataSourceResponse> = await axios.get(
		`https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSourceId}/datasets/${endTime}-${startTime}`,
		{ headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' } }
	);
	return data;
}
export async function getAggregatedData(accessToken: string, dataSourceId: string) {
	const startTime = dayjs().subtract(2, 'months').unix() * 1000;
	const endTime = dayjs().subtract(0, 'days').unix() * 1000;
	const { data }: AxiosResponse<AggregatedDataSourceResponse> = await axios.post(
		'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
		{
			aggregateBy: [
				{
					dataSourceId,
				},
			],
			bucketByTime: {
				durationMillis: 86400000,
			},
			endTimeMillis: endTime,
			startTimeMillis: startTime,
		},
		{ headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json' } }
	);
	return data;
}

export async function persistMeasurementsFitData(
	dataSourceId: string,
	key: string,
	userId: string,
	accessToken: string
) {
	const { point } = await getDatasetData(accessToken, dataSourceId);
	return await Promise.all(
		point.map(async ({ value, startTimeNanos }) => {
			const measuredFormat = toStartOfDay(startTimeNanos / 1000000);
			const objectId = makeApiUuid([measuredFormat.toString()]);

			const v = value[0].fpVal;
			return db.measurements.upsert({
				where: { objectId },
				update: { [key]: v as number, userId, measuredFormat },
				create: {
					[key]: v as number,
					userId,
					objectId,
					measuredFormat,
					infoId: await createOrUpateInfo(measuredFormat, userId),
				},
			});
		})
	);
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

			const measuredAtHours = measuredAt.getHours();
			const category =
				measuredAtHours < 12
					? 'breakfast'
					: measuredAtHours < 15
					? 'lunch'
					: measuredAtHours < 18
					? 'snack'
					: measuredAtHours < 22
					? 'dinner'
					: 'midnight snack';
			const measuredFormat = toStartOfDay(measuredAt);
			const data = {
				name,
				amount,
				measuredAt,
				measuredFormat,
				category,
				userId,
				objectId,
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

export async function persistActivitySessionData(
	dataSourceId: string,
	accessToken: string,
	userId: string
) {
	const { session } = await getSessionData(accessToken);

	return await Promise.all(
		session.map(async (session) => {
			const measuredAt = dayjs.unix(session.startTimeMillis / 1000);
			const measuredFormat = toStartOfDay(measuredAt);
			const endTime = dayjs.unix(session.endTimeMillis / 1000);

			const data = {
				objectId: session.id,
				name: session.name,
				duration: endTime.diff(measuredAt, 'minute'),
				appName: session.application.packageName,
				activityType: session.activityType,
				measuredAt: measuredAt.toDate(),
				infoId: await createOrUpateInfo(measuredFormat, userId),
				measuredFormat,
				userId,
			};
			return await db.activitySession.upsert({
				where: { objectId: session.id },
				update: data,
				create: data,
			});
		})
	);
}

async function createOrUpateInfo(measuredFormat: Date, userId: string) {
	const info = await db.info.findFirst({ where: { measuredFormat, userId } });
	if (info) return info.id;
	else {
		const newInfo = await db.info.create({ data: { measuredFormat, userId } });
		await db.supplements.create({ data: { infoId: newInfo.id, measuredFormat, userId } });
		return newInfo.id;
	}
}

function makeApiUuid(keys: string[]) {
	return uuidByString(keys.join('-'));
}
