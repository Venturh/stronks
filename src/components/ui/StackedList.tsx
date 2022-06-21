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
					<div className="sticky top-0 z-10 px-2 py-4 font-medium text-secondary ">
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
	quaternary?: string;
	href?: string;
};

export function StackedListItem({
	primary,
	secondary,
	tertiary,
	quaternary,
	href,
	...rest
}: StackedListItemProps) {
	const Component = href ? Clickable : 'div';
	return (
		<Component href={href}>
			<li
				className={clsx('p-2 text-primary text-sm', { 'hover:bg-accent-secondary': href })}
				{...rest}
			>
				<div className="flex justify-between">
					{secondary && <span className="capitalize min-w-fit text-secondary">{secondary}</span>}
					{quaternary && <span className=" min-w-fit text-secondary">{quaternary}</span>}
				</div>
				<div className="flex items-center justify-between">
					<div className="mt-1 ">{primary}</div>
					{tertiary && <span className=" min-w-fit">{tertiary}</span>}
				</div>
			</li>
		</Component>
	);
}
