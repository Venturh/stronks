import { Mood, Phase } from '@prisma/client';
import { z } from 'zod';

export const updateOverviewSchema = z.object({
	infoId: z.string(),
	phase: z.nativeEnum(Phase).optional().nullable(),
	notes: z.string().optional().nullable(),
	habitId: z.string().optional().nullable(),
	mood: z.nativeEnum(Mood).optional().nullable(),
	weight: z.number().optional().nullable(),
	bodyFat: z.number().optional().nullable(),
});
