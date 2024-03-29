export type DataSourceResponse = {
	dataSourceId: string;
	minStartTimeNs?: string;
	maxEndTimeNs?: string;
	point: {
		startTimeNanos: number;
		value: {
			fpVal?: string | number;
			mapVal?: { key: string; value: { fpVal?: string | number } }[];
			stringVal?: string;
			intVal?: number;
		}[];
	}[];
};

export type AggregatedDataSourceResponse = {
	bucket: {
		startTimeMillis: number;
		activity?: number;
		session?: {
			id: string;
			name: string;
			startTimeMillis: number;
			endTimeMillis: number;
			application: {
				packageName: string;
			};
			activityType: number;
		};
		dataset: {
			dataSourceId: string;

			point: {
				startTimeNanos: number;
				value: {
					intVal?: number;
					fpVal?: number;
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

export const activityTypeMapping = new Map([
	[9, 'Aerobics'],
	[119, 'Archery'],
	[10, 'Badminton'],
	[11, 'Baseball'],
	[12, 'Basketball'],
	[13, 'Biathlon'],
	[1, 'Biking'],
	[14, 'Handbiking'],
	[15, 'Mountain biking'],
	[16, 'Road biking'],
	[17, 'Spinning'],
	[18, 'Stationary biking'],
	[19, 'Utility biking'],
	[20, 'Boxing'],
	[21, 'Calisthenics'],
	[22, 'Circuit training'],
	[23, 'Cricket'],
	[113, 'Crossfit'],
	[106, 'Curling'],
	[24, 'Dancing'],
	[102, 'Diving'],
	[117, 'Elevator'],
	[25, 'Elliptical'],
	[103, 'Ergometer'],
	[118, 'Escalator'],
	[26, 'Fencing'],
	[27, 'Football (American)'],
	[28, 'Football (Australian)'],
	[29, 'Football (Soccer)'],
	[30, 'Frisbee'],
	[31, 'Gardening'],
	[32, 'Golf'],
	[122, 'Guided Breathing'],
	[33, 'Gymnastics'],
	[34, 'Handball'],
	[114, 'HIIT'],
	[35, 'Hiking'],
	[36, 'Hockey'],
	[37, 'Horseback riding'],
	[38, 'Housework'],
	[39, 'Jumping rope'],
	[40, 'Kayaking'],
	[41, 'Kettlebell training'],
	[42, 'Kickboxing'],
	[43, 'Kitesurfing'],
	[44, 'Martial arts'],

	[45, 'Meditation'],
	[46, 'Mixed martial arts'],
	[108, 'Other (unclassified fitness activity)'],
	[47, 'P90X exercises'],
	[48, 'Paragliding'],
	[49, 'Pilates'],
	[50, 'Polo'],
	[51, 'Racquetball'],
	[52, 'Rock climbing'],
	[53, 'Rowing'],
	[54, 'Rowing machine'],
	[55, 'Rugby'],
	[8, 'Running'],
	[56, 'Jogging'],
	[57, 'Running on sand'],
	[58, 'Running (treadmill)'],
	[59, 'Sailing'],
	[60, 'Scuba diving'],
	[61, 'Skateboarding'],
	[62, 'Skating'],
	[63, 'Cross skating'],
	[105, 'Indoor skating'],
	[64, 'Inline skating (rollerblading)'],
	[65, 'Skiing'],
	[66, 'Back-country skiing'],
	[67, 'Cross-country skiing'],
	[68, 'Downhill skiing'],
	[69, 'Kite skiing'],
	[70, 'Roller skiing'],
	[71, 'Sledding'],
	[73, 'Snowboarding'],
	[74, 'Snowmobile'],
	[75, 'Snowshoeing'],
	[120, 'Softball'],
	[76, 'Squash'],
	[77, 'Stair climbing'],
	[78, 'Stair-climbing machine'],
	[79, 'Stand-up paddleboarding'],
	[3, 'Still (not moving)'],
	[80, 'Strength training'],
	[81, 'Surfing'],
	[82, 'Swimming'],
	[84, 'Swimming (open water)'],
	[83, 'Swimming (swimming pool)'],
	[85, 'Table tennis (ping pong)'],
	[86, 'Team sports'],
	[87, 'Tennis'],
	[5, 'Tilting (sudden device gravity change)'],
	[88, 'Treadmill (walking or running)'],
	[4, 'Unknown (unable to detect activity)'],
	[89, 'Volleyball'],
	[90, 'Volleyball (beach)'],
	[91, 'Volleyball (indoor)'],
	[92, 'Wakeboarding'],
	[7, 'Walking'],
	[93, 'Walking (fitness)'],
	[94, 'Nording walking'],
	[95, 'Walking (treadmill)'],
	[116, 'Walking (stroller)'],
	[96, 'Waterpolo'],
	[97, 'Weightlifting'],
	[98, 'Wheelchair'],
	[99, 'Windsurfing'],
	[100, 'Yoga'],
	[101, 'Zumba'],
]);
