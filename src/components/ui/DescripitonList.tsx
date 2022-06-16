import Button from './Button';

type Props = {
	title: string;
	description: string;
	children: React.ReactNode;
	action?: { label: string; loading?: boolean; onClick: () => void };
};

export default function DescriptionList({ title, description, action, children }: Props) {
	return (
		<div className="mt-10 divide-y divide-accent-primary border-accent-primary">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					<h3 className="text-lg font-medium leading-6 text-primary">{title}</h3>
					<p className="max-w-2xl text-sm text-secondary">{description}</p>
				</div>
				{action && (
					<Button loading={action!.loading} onClick={() => action.onClick()}>
						{action?.label}
					</Button>
				)}
			</div>
			<div className="mt-6">
				<dl className="w-full divide-y divide-accent-primary border-accent-primary">{children}</dl>
			</div>
		</div>
	);
}
