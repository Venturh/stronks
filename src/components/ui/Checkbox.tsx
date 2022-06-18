import clsx from 'clsx';
import { ComponentProps, forwardRef } from 'react';

interface Props extends ComponentProps<'input'> {
	label?: string;
	onChecked?: (value: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, Props>(
	({ label, className, onChecked, ...rest }, ref) => {
		return (
			<label className={clsx({ 'flex justify-between items-center': label }, className)}>
				{label && <span className="block text-sm font-medium text-secondary">{label}</span>}
				<input
					type="checkbox"
					className="w-3.5 h-3.5 border-gray-300 rounded focus:ring-offset-0 disabled:cursor-default dark:border-accent-primary bg-secondary text-brand-primary dark:text-accent-primary focus:ring-brand-secondary"
					onChange={(value) => onChecked && onChecked(value.target.checked)}
					ref={ref}
					{...rest}
				/>
			</label>
		);
	}
);

export default Checkbox;

Checkbox.displayName = 'Checkbox';
