import clsx from 'clsx';
import { ComponentProps, forwardRef } from 'react';

interface Props extends ComponentProps<'input'> {
	label?: string;
	onChecked?: (value: boolean) => void;
	color?: 'primary' | 'secondary' | 'accent';
}

const Checkbox = forwardRef<HTMLInputElement, Props>(
	({ label, className, onChecked, color = 'primary', ...rest }, ref) => {
		return (
			<label className={clsx({ 'flex justify-between items-center': label }, className)}>
				{label && <span className="block text-sm font-medium text-secondary">{label}</span>}
				<input
					type="checkbox"
					className={clsx(
						'w-3.5 h-3.5 border-gray-300 rounded focus:ring-offset-0 disabled:cursor-default   text-brand-primary dark:text-accent-primary focus:ring-brand-secondary',
						{
							'bg-primary border-gray-300 dark:border-accent-primary': color === 'primary',
							'bg-secondary border-gray-300 dark:border-accent-primary': color === 'secondary',
							'bg-accent-secondary dark:border-gray-600 border-gray-400': color === 'accent',
						}
					)}
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
