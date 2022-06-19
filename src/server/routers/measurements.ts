import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

import { db } from 'lib/prisma';
import { groupBy } from 'lodash';
import { createRouter } from 'server/createRouter';

const defaultMeasurements = Prisma.validator<Prisma.MeasurementsSelect>()({
	id: true,
	objectId: true,
	weight: true,
	bodyFat: true,
	aditionalMeasurements: true,
	measuredFormat: true,
});

export const measurementsRouter = createRouter().query('index', {
	async resolve({ ctx }) {
		const measurements = await db.measurements.findMany({
			where: { userId: ctx.session?.user?.id },
			select: defaultMeasurements,
			orderBy: { measuredFormat: 'desc' },
		});

		return groupBy(measurements, (d) => {
			const month = dayjs(d.measuredFormat).format('MMMM');
			const currentMonth = dayjs().format('MMMM');
			const lastMonth = dayjs().subtract(1, 'month').format('MMMM');
			return month === currentMonth ? 'Current Month' : month === lastMonth ? 'Last Month' : month;
		});
	},
});
