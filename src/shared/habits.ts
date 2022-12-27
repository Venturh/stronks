import { HabitCategory } from '@prisma/client';
import { z } from 'zod';

export const createHabitSchema = z.object({
	name: z.string().min(1),
	category: z.nativeEnum(HabitCategory),
	emote: z.string().nullable(),
});

export const updateHabitSchema = createHabitSchema.extend({
	id: z.string(),
});

export const completeHabitSchema = z.object({
	habitId: z.string(),
});

export const mappedHabitCategories = {
	[HabitCategory.PHYSICAL_FITNESS]: 'Physical Fitness',
	[HabitCategory.MENTAL_HEALTH]: 'Mental Health',
	[HabitCategory.PERSONAL_DEVELOPMENT]: 'Personal Development',
	[HabitCategory.CAREER]: 'Career',
	[HabitCategory.MONEY]: 'Financial',
	[HabitCategory.COMMUNICATION]: 'Communication',
	[HabitCategory.ROMANCE]: 'Romance',
	[HabitCategory.HOBBIES]: 'Hobbies',
	[HabitCategory.SUSTAINABILITY]: 'Sustainability',
	[HabitCategory.CREATIVITY]: 'Creativity',
	[HabitCategory.TIME_MANAGEMENT]: 'Time Management',
	[HabitCategory.STRESS_MANAGEMENT]: 'Stress Management',
	[HabitCategory.SELF_CARE]: 'Self Care',
	[HabitCategory.HOME_ORGANIZATION]: 'Home Organization',
};
