import { Mood, Phase } from '@prisma/client';
import { inferRouterOutputs } from '@trpc/server';
import { AppRouter } from 'server/api/root';

export type WithOutIdAndTimestamps<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

export interface OverviewData {
	// [key: string]: string | boolean | null;

	id: string;
	date: Date;
	fullDate: string;
	mood: Mood;
	phase: Phase;
	calories: string | null;
	weight: string | null;
	bodyFat: string | null;
	training: boolean;
	notes: string | null;
}

export type DateRange = {
	from?: string;
	to?: string;
};

export type RouterOutputs = inferRouterOutputs<AppRouter>;
