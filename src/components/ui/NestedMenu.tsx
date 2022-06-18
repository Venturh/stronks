import clsx from 'clsx';
import React, { ComponentProps } from 'react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { ChevronRightIcon } from '@heroicons/react/solid';

import { MenuItem } from './Menu';
import Clickable from './Clickable';

type Props = {
	children?: React.ReactElement;
	menuItems: { label?: string; items: MenuItem[] }[];
} & ComponentProps<'button'>;

export default function NestedMenu({ menuItems, children, ...rest }: Props) {
	function itemAction(item: MenuItem, i?: number) {
		if (item?.indexAction !== undefined) item?.indexAction(i!);
		else if (!!item?.action) item?.action(item.value || item.text);
		else return undefined;
	}

	return (
		<div className="relative inline-block w-full text-left">
			<DropdownMenuPrimitive.Root>
				<DropdownMenuPrimitive.Trigger asChild>
					<div className={clsx('w-full', rest.className)}>{children}</div>
				</DropdownMenuPrimitive.Trigger>

				<DropdownMenuPrimitive.Content
					align="end"
					sideOffset={0}
					className={clsx(
						' radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down',
						'min-w-[14em] rounded-lg px-1.5 py-1 shadow-md w-full',
						'bg-secondary'
					)}
				>
					{menuItems.map(({ label, items }, i) => (
						<div key={i}>
							{label && (
								<DropdownMenuPrimitive.Label className="px-2 py-2 text-xs select-none text-primary">
									{label}
								</DropdownMenuPrimitive.Label>
							)}
							{items.map((item, i) => (
								<div key={i}>
									{!item.nested && (
										<DropdownMenuPrimitive.Item
											key={`${item.text}-${i}`}
											className={clsx(
												'flex cursor-default select-none items-center rounded-md px-2 py-2 text-sm outline-none',
												'text-primary focus:bg-accent-secondary'
											)}
										>
											<Clickable
												disabled={item.disabled}
												className={clsx(
													'flex items-center space-x-4 w-full font-normal outline-none  disabled:cursor-not-allowed '
												)}
												href={item?.to}
												onClick={() => {
													!item.to ? itemAction(item, i) : undefined;
												}}
											>
												{item.icon && <span className="w-4 h-4 text-primary">{item.icon}</span>}
												<span className="capitalize">{item.text}</span>
												{item.shortcut && <span className="text-sm">{item.shortcut}</span>}
											</Clickable>
										</DropdownMenuPrimitive.Item>
									)}
									{item.nested && (
										<DropdownMenuPrimitive.Root>
											<DropdownMenuPrimitive.TriggerItem
												className={clsx(
													'flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-sm outline-none',
													'text-primary focus:bg-accent-secondary'
												)}
											>
												<span className="mr-2 h-3.5 w-3.5">{item.icon}</span>
												<span className="flex-grow capitalize text-primary">{item.text}</span>
												<ChevronRightIcon className="h-3.5 w-3.5" />
											</DropdownMenuPrimitive.TriggerItem>
											<DropdownMenuPrimitive.Content
												className={clsx(
													'ml-3 origin-radix-dropdown-menu radix-side-right:animate-scale-in',
													'w-full rounded-md px-1 py-1 text-sm shadow-md',
													'bg-secondary'
												)}
											>
												{item.nested.map((item, i) => (
													<DropdownMenuPrimitive.Item
														key={`${item.text}-${i}`}
														className={clsx(
															'flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-sm outline-none min-w-[8em] max-w-[12em]',
															'text-primary focus:bg-accent-secondary'
														)}
													>
														<Clickable
															disabled={item.disabled}
															className={clsx(
																'flex  items-center space-x-4 w-full font-normal outline-none  disabled:cursor-not-allowed'
															)}
															href={item?.to}
															onClick={() => {
																!item.to ? itemAction(item, i) : undefined;
															}}
														>
															{item.icon && (
																<span className="w-4 h-4 text-primary">{item.icon}</span>
															)}
															<span className="capitalize">{item.text}</span>
															{item.shortcut && <span className="text-sm">{item.shortcut}</span>}
														</Clickable>
													</DropdownMenuPrimitive.Item>
												))}
											</DropdownMenuPrimitive.Content>
										</DropdownMenuPrimitive.Root>
									)}
								</div>
							))}
						</div>
					))}
				</DropdownMenuPrimitive.Content>
			</DropdownMenuPrimitive.Root>
		</div>
	);
}
