import { Phase } from '@prisma/client';

export type WithOutIdAndTimestamps<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export interface OverviewData {
	// [key: string]: string | boolean | null;

	id: string;
	date: string;
	phase: Phase;
	calories: string | null;
	weight: string | null;
	bodyFat: string | null;
	training: boolean;
	notes: string | null;
}
