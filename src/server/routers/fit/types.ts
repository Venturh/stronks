export type DataSourceResponse = {
	dataSourceId: string;
	point: {
		startTimeNanos: number;
		value: {
			fpVal?: string | number;
			mapVal?: { key: string; value: { fpVal?: string | number } }[];
			stringVal?: string;
		}[];
	}[];
};

export type AggregatedDataSourceResponse = {
	bucket: {
		dataset: {
			dataSourceId: string;
			point: {
				startTimeNanos: number;
				value: {
					intval?: number;
					fpVal?: string | number;
					mapVal?: { key: string; value: { fpVal?: string | number } }[];
					stringVal?: string;
				}[];
			}[];
		}[];
	}[];
};

export type FitSession = {
	session: {
		id: string;
		name: string;
		startTimeMillis: number;
		endTimeMillis: number;
		application: {
			packageName: string;
		};
		activityType: number;
	}[];
};
