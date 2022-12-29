import { Phase } from '@prisma/client';
import { Color } from 'components/ui/Button';

export const mappedShortPhases = [
	{ label: 'M', value: Phase.MAINTAIN },
	{ label: 'C', value: Phase.CUTTING },
	{ label: 'B', value: Phase.BULKING },
];

export const mappedPhases = [
	{ label: 'Maintain', value: Phase.MAINTAIN },
	{ label: 'Cutting', value: Phase.CUTTING },
	{ label: 'Bulk', value: Phase.BULKING },
];

export const phaseColors: Record<Phase, Color> = {
	[Phase.MAINTAIN]: 'brand',
	[Phase.CUTTING]: 'success',
	[Phase.BULKING]: 'error',
};
export const phaseBorderColors: Record<Phase, string> = {
	[Phase.MAINTAIN]: 'border-brand-primary/80',
	[Phase.CUTTING]: 'border-succes-primary/80',
	[Phase.BULKING]: 'border-error-primary/80',
};
