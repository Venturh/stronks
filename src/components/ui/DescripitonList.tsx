import Button, { ButtonProps } from './Button';

type Props = {
	title: string;
	description?: string;
	children: React.ReactNode;
	action?: (ButtonProps & { onClick: () => void })[];
};

export function DescriptionList({ title, description, action, children }: Props) {
	return (
		<div className="px-4 py-5 mt-10 divide-y shadow divide-accent-primary border-accent-primary bg-secondary sm:rounded-lg sm:px-6">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h3 className="text-lg font-medium leading-6 text-primary">{title}</h3>
					{description && <p className="max-w-2xl text-sm text-secondary">{description}</p>}
				</div>
				{action?.length && (
					<div className="flex flex-wrap space-x-2">
						{action.map(({ children, ...rest }, i) => (
							<Button key={i} {...rest}>
								{children}
							</Button>
						))}
					</div>
				)}
			</div>
			<div className="mt-6">
				<dl className="w-full divide-y divide-accent-primary border-accent-primary">{children}</dl>
			</div>
		</div>
	);
}

type DescriptionListItem = {
	label: string;
	children: React.ReactNode;
	action?: { label: string; loading?: boolean; onClick: () => void };
};

export function DescriptionListItem({ label, action, children }: DescriptionListItem) {
	return (
		<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
			<dt className="text-sm font-medium text-secondary">{label}</dt>
			<dd className="flex items-center text-sm text-primary sm:col-span-2 sm:mt-0">
				<span className="flex-grow">{children}</span>
				{action && (
					<span className="flex-shrink-0 px-4">
						<button
							type="button"
							className="font-medium rounded-md bg-primary text-brand-primary hover:text-brand-secondary"
							onClick={() => action.onClick()}
						>
							{action?.label}
						</button>
					</span>
				)}
			</dd>
		</div>
	);
}
