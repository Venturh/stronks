import { ComponentProps } from 'react';
import clsx from 'clsx';
import { FormProvider, UseFormReturn, FieldValues, SubmitHandler } from 'react-hook-form';

import Button from './Button';

interface ErrorProps {
	title: string;
	error?: Error;
}

export interface FormProps<T extends FieldValues> extends Omit<ComponentProps<'form'>, 'onSubmit'> {
	error?: ErrorProps;
	form: UseFormReturn<T>;
	onSubmit?: SubmitHandler<T>;
	submitButtonText?: string;
	headless?: boolean;
	disabled?: boolean;
}

export default function Form<T extends FieldValues>({
	form,
	onSubmit,
	children,
	error,
	submitButtonText = 'Submit',
	headless = false,
	className,
	disabled = false,
	...rest
}: FormProps<T>) {
	const { isSubmitting } = form.formState;
	return (
		<>
			{error && <ErrorMessage {...error} />}
			<FormProvider {...form}>
				<form onSubmit={onSubmit && form.handleSubmit(onSubmit)} {...rest}>
					<fieldset className={(clsx('flex flex-col h-full'), className)} disabled={isSubmitting}>
						{children}
					</fieldset>
					{!headless && (
						<Button
							className="w-full mt-4"
							type="submit"
							disabled={disabled}
							loading={isSubmitting}
						>
							{submitButtonText}
						</Button>
					)}
				</form>
			</FormProvider>
		</>
	);
}

export function ErrorMessage({ title, error }: ErrorProps) {
	if (!error) return null;

	return (
		<div className="p-4 space-y-1 text-sm text-black rounded-lg bg-opacity-10 bg-error">
			<h3 className="font-medium">{title}</h3>
			<div>{error.message}</div>
		</div>
	);
}
