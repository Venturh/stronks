import clsx from 'clsx';

type Props = {
	checked: boolean;
	disabled?: boolean;
	onChange: (checked: boolean) => void;
};

export default function CheckboxDiv({ checked, disabled, onChange }: Props) {
	return (
		<button
			type="button"
			disabled={disabled}
			onClick={() => onChange(!checked)}
			className={clsx('h-6 w-6 rounded-lg disabled:cursor-not-allowed ', {
				'bg-brand-primary': checked,
				'bg-accent-primary': !checked,
			})}
		></button>
	);
}
