import { Phase } from '@prisma/client';

export type WithOutIdAndTimestamps<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export type OverviewData = {
	id: string;
	date: string;
	phase: Phase;
	calories: string | null;
	weight: string | null;
	bodyFat: string | null;
	training: boolean;
	creatine: boolean;
	notes: string | null;
};
