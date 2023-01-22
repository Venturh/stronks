import dayjs from 'dayjs';
import { z } from 'zod';

export const idSchema = z.object({
	id: z.string(),
});

export const dateStringSchema = z.object({
	date: z
		.string()
		.optional()
		.transform((value) => dayjs.utc(value).toDate()),
});
