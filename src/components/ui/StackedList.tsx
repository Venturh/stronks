import { ComponentProps } from 'react';
import EmptyState from './EmptyState';

type Props = { children: React.ReactChild[]; grouped?: boolean };

export function StackedList({ grouped, children }: Props) {
	if (children.length === 0) {
		return <EmptyState title="No data" />;
	}
	return (
		<div className="">
			{grouped ? children : <ul className="-my-1 divide-y divide-accent-primary">{children}</ul>}
		</div>
	);
}

type StackedListHeaderProps = ComponentProps<'div'> & {
	primary: string;
	seconary?: string;
	children?: React.ReactChild[];
};

export function StackedListHeader({
	primary,
	seconary,
	children,
	...rest
}: StackedListHeaderProps) {
	return (
		<div {...rest}>
			{children && (
				<>
					<div className="sticky top-0 z-10 p-2 text-sm font-medium border-t border-b text-secondary border-accent-primary bg-accent-primary">
						<div className="flex justify-between ">
							<span>{primary} </span>
							{seconary && <span>{seconary}</span>}
						</div>
					</div>
					<ul className="-my-1 divide-y divide-accent-primary">{children}</ul>
				</>
			)}
		</div>
	);
}

type StackedListItemProps = ComponentProps<'li'> & {
	primary: string;
	secondary: string;
	tertiary?: string;
};

export function StackedListItem({ primary, secondary, tertiary, ...rest }: StackedListItemProps) {
	return (
		<li className="p-2 text-primary hover:bg-accent-secondary" {...rest}>
			<span className="text-sm ">{secondary}</span>
			<div className="flex justify-between">
				<div className="mt-1">{primary}</div>
				<span className="text-sm text-secondary">{tertiary}</span>
			</div>
		</li>
	);
}
