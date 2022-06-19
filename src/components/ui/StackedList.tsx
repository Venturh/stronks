import clsx from 'clsx';
import { ComponentProps, ReactChild } from 'react';
import Clickable from './Clickable';
import EmptyState from './EmptyState';

type Props = { children?: ReactChild | ReactChild[]; grouped?: boolean };

export function StackedList({ grouped, children }: Props) {
	if (!children || (Array.isArray(children) && children.length === 0)) {
		return <EmptyState title="No data" />;
	}
	return (
		<div>
			{grouped ? (
				<div className="border rounded border-accent-primary">{children}</div>
			) : (
				<ul className="rounded-md bg-secondary">{children}</ul>
			)}
		</div>
	);
}

type StackedListHeaderProps = ComponentProps<'div'> & {
	primary: string;
	seconary?: string;
	children?: ReactChild | ReactChild[];
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
					<div className="sticky top-0 z-10 px-2 py-4 text-sm font-medium text-secondary ">
						<div className="flex justify-between ">
							<span className="capitalize">{primary} </span>
							{seconary && <span>{seconary}</span>}
						</div>
					</div>
					<ul className="rounded-md bg-secondary">{children}</ul>
				</>
			)}
		</div>
	);
}

type StackedListItemProps = ComponentProps<'li'> & {
	primary: string;
	secondary?: string;
	tertiary?: string;
	href?: string;
};

export function StackedListItem({
	primary,
	secondary,
	tertiary,
	href,
	...rest
}: StackedListItemProps) {
	const Component = href ? Clickable : 'div';
	return (
		<Component href={href}>
			<li className={clsx('p-2 text-primary', { 'hover:bg-accent-secondary': href })} {...rest}>
				{secondary && <span className="text-sm capitalize">{secondary}</span>}
				<div className="flex justify-between">
					<div className="mt-1">{primary}</div>
					{tertiary && <span className="text-sm min-w-fit text-secondary">{tertiary}</span>}
				</div>
			</li>
		</Component>
	);
}
