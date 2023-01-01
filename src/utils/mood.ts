import { Mood } from '@prisma/client';

export const mappedMoods = [
	{ label: '😃', value: Mood.SUPER },
	{ label: '😀', value: Mood.GOOD },
	{ label: '😑', value: Mood.OK },
	{ label: '😞', value: Mood.BAD },
	{ label: '😖', value: Mood.TERRIBLE },
	{ label: '?', value: null },
];
