import Button from './Button';

type Props = {
	label: string;
	children: React.ReactNode;
	action?: { label: string; loading?: boolean; onClick: () => void };
};

export default function DescriptionListItem({ label, action, children }: Props) {
	return (
		<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
			<dt className="text-sm font-medium text-secondary">{label}</dt>
			<dd className="flex mt-1 text-sm text-primary sm:col-span-2 sm:mt-0">
				<span className="flex-grow">{children}</span>
				{action && (
					<span className="flex-shrink-0 ml-4">
						<button
							type="button"
							className="font-medium rounded-md bg-primary text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
