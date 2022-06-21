import Pluralize from 'pluralize';

export function toFixed(
	val?: number | null,
	maximumFractionDigits = 2,
	minimumFractionDigits = 2,
	replace = true
) {
	if (val === null || val === undefined) return '---';

	const value = val.toLocaleString('de-DE', {
		minimumFractionDigits,
		maximumFractionDigits,
	});
	return replace ? value.replace(/,\.?0+$/, '') : value;
}

export function toHoursAndMinutes(totalMinutes: number) {
	const minutes = totalMinutes % 60;
	const hours = Math.floor(totalMinutes / 60);

	return `${padTo2Digits(hours)}h${padTo2Digits(minutes)}m`;
}

function padTo2Digits(num: number) {
	return num.toString().padStart(1, '0');
}

export function pluralize(word: string, count: number) {
	return Pluralize(word, count);
}
