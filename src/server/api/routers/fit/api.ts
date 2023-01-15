import axios, { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { db } from 'server/db';
import { AggregatedDataSourceResponse, DataSourceResponse, FitSession } from './types';

export async function getSessionData(accessToken: string) {
	const startTime = dayjs().subtract(5, 'months').toISOString();
	const { data }: AxiosResponse<FitSession> = await axios.get(
		`https://www.googleapis.com/fitness/v1/users/me/sessions/?startTime=${startTime}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		}
	);
	return data;
}

export async function getDatasetDataPerInterval(
	accessToken: string,
	dataSourceId: string,
	startTime: number
) {
	const endTimeNs = dayjs(startTime).add(2, 'months').endOf('day').valueOf() * 1000000;
	const startNs = dayjs(startTime).startOf('day').valueOf() * 1000000;

	const { data }: AxiosResponse<DataSourceResponse> = await axios.get(
		`https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSourceId}/datasets/${endTimeNs}-${startNs}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		}
	);
	return data;
}
export async function getDatasetData(accessToken: string, dataSourceId: string, userId: string) {
	let startTime = dayjs().subtract(1, 'year').startOf('day').unix() * 1000;

	const latestData = await db.nutrition.findFirst({
		where: {
			userId,
		},
		orderBy: {
			measuredFormat: 'desc',
		},
	});

	if (latestData) {
		startTime = dayjs(latestData.measuredFormat).startOf('day').unix() * 1000;
	}

	const data: DataSourceResponse = { point: [], dataSourceId };

	do {
		const newData = await getDatasetDataPerInterval(accessToken, dataSourceId, startTime);
		if (!newData?.maxEndTimeNs || startTime > dayjs().endOf('day').unix() * 1000) {
			break;
		}
		startTime = dayjs(startTime).add(2, 'months').endOf('day').unix() * 1000;
		data.point.push(...newData.point);
	} while (true);
	return data;
}

async function getAggregatedDataPerInterval(
	accessToken: string,
	dataTypeNames: string[],
	aggregation: 'bucketBySession' | 'bucketByActivitySegment' | 'bucketByTime' = 'bucketByTime',
	startTime: number,
	prevStartTime?: number
): Promise<AggregatedDataSourceResponse> {
	const endTime = dayjs(startTime).add(2, 'months').endOf('day').unix() * 1000;
	const todayEndTime = dayjs().endOf('day').unix() * 1000;

	if (startTime === prevStartTime || startTime > todayEndTime) {
		return {
			bucket: [],
		};
	}

	const { data }: AxiosResponse<AggregatedDataSourceResponse> = await axios.post(
		'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
		{
			aggregateBy: [
				dataTypeNames.map((dataTypeName) => {
					if (dataTypeName === 'com.google.step_count.delta')
						return {
							dataTypeName,
							dataSourceId:
								'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps',
						};
					return {
						dataTypeName,
					};
				}),
			],
			[aggregation]: {
				durationMillis: 86400000,
			},
			endTimeMillis: endTime,
			startTimeMillis: startTime,
		},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		}
	);
	return data;
}

export async function getAggregatedData(
	accessToken: string,
	dataTypeNames: string[],
	type: 'measurements' | 'nutrition' | 'activitySteps' | 'workouts',
	userId: string,
	aggregation: 'bucketBySession' | 'bucketByActivitySegment' | 'bucketByTime' = 'bucketByTime'
) {
	let startTime = dayjs().subtract(1, 'year').startOf('day').unix() * 1000;

	//@ts-ignore
	const latestData = await db[type].findFirst({
		where: {
			userId,
		},
		orderBy: {
			measuredFormat: 'desc',
		},
	});

	if (latestData) {
		startTime = dayjs(latestData.measuredFormat).startOf('day').unix() * 1000;
	}

	const data: AggregatedDataSourceResponse = { bucket: [] };
	let prevStartTime = 0;
	do {
		const newData = await getAggregatedDataPerInterval(
			accessToken,
			dataTypeNames,
			aggregation,
			startTime,
			prevStartTime
		);
		if (newData.bucket.length === 0) break;
		prevStartTime = startTime;
		startTime = Number(newData.bucket[newData.bucket.length - 1].startTimeMillis);

		data.bucket.push(...newData.bucket);
	} while (data.bucket.length !== 0);
	return data;
}
