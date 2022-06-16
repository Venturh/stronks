import { Prisma } from '@prisma/client';

import { db } from 'lib/prisma';
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
		return db.measurements.findMany({
			where: { userId: ctx.session?.user?.id },
			select: defaultMeasurements,
			orderBy: { measuredFormat: 'desc' },
		});
	},
});
