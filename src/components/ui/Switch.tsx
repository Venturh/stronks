import { Switch as HSwitch } from '@headlessui/react';
import clsx from 'clsx';

type Props = {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	description?: string;
};

export default function Switch({ checked, onChange, label, description }: Props) {
	return (
		<HSwitch.Group
			as="div"
			className={clsx({
				'flex items-center justify-between': label,
			})}
		>
			<span className="flex flex-col flex-grow col-span-2">
				{label && (
					<HSwitch.Label as="dt" className="text-sm font-medium text-primary" passive>
						{label}
					</HSwitch.Label>
				)}
				{description && (
					<HSwitch.Description as="span" className="text-sm text-secondary">
						{description}
					</HSwitch.Description>
				)}
			</span>
			<dd className="flex justify-end flex-1 mt-1 text-sm text-primary sm:mt-0 sm:col-span-1">
				<HSwitch
					checked={checked}
					onChange={onChange}
					className={clsx(
						checked ? 'bg-brand-primary' : 'bg-accent-primary',
						{ 'sm:ml-auto': label },
						'relative inline-flex flex-shrink-0 h-[24px] w-[44px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-brand-primary '
					)}
				>
					<span className="sr-only">Use setting</span>
					<span
						className={clsx(
							checked ? 'translate-x-5' : 'translate-x-0',
							'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
						)}
					>
						<span
							className={clsx(
								checked ? 'opacity-0 ease-out duration-100' : 'opacity-100 ease-in duration-200',
								'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
							)}
							aria-hidden="true"
						>
							<svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 12 12">
								<path
									d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
						<span
							className={clsx(
								checked ? 'opacity-100 ease-in duration-200' : 'opacity-0 ease-out duration-100',
								'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity'
							)}
							aria-hidden="true"
						>
							<svg className="w-3 h-3 text-brand-primary" fill="currentColor" viewBox="0 0 12 12">
								<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
							</svg>
						</span>
					</span>
				</HSwitch>
			</dd>
		</HSwitch.Group>
	);
}
