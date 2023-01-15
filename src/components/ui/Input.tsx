import clsx from 'clsx';
import { ComponentProps, forwardRef } from 'react';
import { useFormContext } from 'react-hook-form';

interface Props extends ComponentProps<'input'> {
	label?: string;
	inset?: boolean;
	trailingText?: string;
	leadingText?: string;
	as?: 'input' | 'textarea';
	borderless?: boolean;
	withError?: boolean;
	valueAsNumber?: boolean;
}

export function Error({
	name,
	padding,
	withName,
}: {
	name?: string;
	padding?: boolean;
	withName?: boolean;
}) {
	const {
		formState: { errors },
	} = useFormContext();

	const error = errors[name!];

	if (error) {
		return (
			<div
				className={clsx('text-xs truncate text-error-secondary', {
					'py-2 px-4': padding,
				})}
			>
				{withName && <span className="capitalize">{name}: </span>}
				<span> {error.message?.toString()}</span>
			</div>
		);
	} else return null;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(
	(
		{
			label,
			trailingText,
			leadingText,
			inset = true,
			as = 'input',
			className,
			withError = false,
			type = 'text',
			borderless = false,
			...rest
		},
		ref
	) => {
		const Tag = as;
		const wrapperClass = clsx(
			'w-full py-1 rounded-lg disabled:bg-opacity-20 focus-within:border-brand-primary focus:ring-none focus:border-none disabled:opacity-60 disabled:bg-accent-primary bg-secondary text-primary',
			!borderless ? 'border border-accent-primary px-4' : 'border-none p-0 focus:ring-0'
		);

		return (
			<div className={clsx(inset ? wrapperClass : undefined, className)}>
				{label && (
					<label htmlFor={rest.name} className="block text-xs font-medium text-secondary">
						{label}
					</label>
				)}
				<div className="relative flex mt-1 rounded-lg shadow-sm">
					{leadingText && (
						<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
							<span className="sm:text-sm text-secondary">{leadingText}</span>
						</div>
					)}
					<Tag
						className={clsx(
							inset
								? 'resize-none border-0 focus:ring-0 sm:text-sm bg-secondary placeholder-accent-primary'
								: wrapperClass,
							{ 'pl-7': leadingText },
							{ 'pr-7': trailingText }
						)}
						type={type}
						//@ts-expect-error ref
						ref={ref}
						id={rest.name}
						{...rest}
					/>
					{trailingText && (
						<div className="relative inline-flex items-center text-sm font-medium text-secondary">
							{trailingText}
						</div>
					)}
				</div>
				{withError && <Error name={rest.name} />}
			</div>
		);
	}
);

Input.displayName = 'Input';

export default Input;
