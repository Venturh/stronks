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
