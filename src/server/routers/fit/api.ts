import axios, { AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { AggregatedDataSourceResponse, DataSourceResponse, FitSession } from './types';

export async function getSessionData(accessToken: string) {
	const startTime = dayjs().subtract(2, 'months').toISOString();
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

export async function getDatasetData(accessToken: string, dataSourceId: string) {
	const startTime = dayjs().subtract(2, 'months').unix() * 1000000000;
	const endTime = dayjs().subtract(0, 'days').unix() * 1000000000;
	const { data }: AxiosResponse<DataSourceResponse> = await axios.get(
		`https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSourceId}/datasets/${endTime}-${startTime}`,
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
	aggregation: 'bucketBySession' | 'bucketByActivitySegment' | 'bucketByTime' = 'bucketByTime'
) {
	const startTime = dayjs().subtract(2, 'months').startOf('day').unix() * 1000;
	const endTime = dayjs().subtract(0, 'days').endOf('day').unix() * 1000;
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
