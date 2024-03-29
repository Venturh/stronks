import React, { useMemo, useRef } from 'react';
import clsx from 'clsx';
import { FieldValues } from 'react-hook-form';

import Button from './Button';
import Form, { FormProps } from './Form';
import Modal, { ModalProps } from './Modal';
import { Error } from './Input';

interface Test<T extends FieldValues> extends FormProps<T> {
	title: string;
	children: React.ReactChild;
	open: boolean;
	loading?: boolean;
	setOpen: (val: boolean) => void;
	deleteButtonText?: string;
	deleteAction?: () => void;
	deleteActionDisabled?: boolean;
	deleteActionLoading?: boolean;
	cancel?: boolean;
}

export default function FormModal<T extends FieldValues>({
	title,
	children,
	open,
	setOpen,
	form,
	loading = false,
	onSubmit,
	submitButtonText,
	deleteButtonText = 'Delete',
	deleteAction,
	deleteActionDisabled,
	deleteActionLoading,
	actionSlot,
	cancel = true,
	...rest
}: Test<T> & ModalProps) {
	const cancelButtonRef = useRef(null);
	const formId = useMemo(() => Math.random().toString(36), []);

	return (
		<Form id={formId} form={form} onSubmit={onSubmit} headless>
			<Modal
				open={open}
				setOpen={setOpen}
				title={title}
				actionSlot={
					submitButtonText ? (
						<div
							className={clsx({
								'sm:flex sm:flex-row-reverse': deleteAction || cancel,
							})}
						>
							<Button
								form={formId}
								variant="solid"
								type="submit"
								className={clsx(
									deleteAction || cancel
										? 'inline-flex justify-center w-full sm:ml-3 sm:w-auto'
										: 'w-full'
								)}
								loading={loading || form.formState.isSubmitting}
							>
								{submitButtonText}
							</Button>
							<div ref={cancelButtonRef} />
							{deleteAction ? (
								<Button
									form="formId"
									loading={deleteActionLoading}
									disabled={deleteActionDisabled}
									variant="ghost"
									color="error"
									type="button"
									className="inline-flex justify-center w-full mt-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
									onClick={() => deleteAction()}
								>
									{deleteButtonText}
								</Button>
							) : (
								cancel && (
									<Button
										variant="ghost"
										type="button"
										className="inline-flex justify-center w-full mt-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
										onClick={() => setOpen(false)}
									>
										Cancel
									</Button>
								)
							)}
						</div>
					) : (
						actionSlot
					)
				}
				{...rest}
			>
				<div>
					{children}
					{Object.keys(form.formState.errors).length > 0 && (
						<div className="p-2 mt-4 rounded ring-1 ring-accent-primary">
							{Object.keys(form.formState.errors).map((key) => (
								<Error withName name={key} key={key} />
							))}
						</div>
					)}
				</div>
			</Modal>
		</Form>
	);
}
