import React from 'react';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import * as SelectPrimitive from '@radix-ui/react-select';
import clsx from 'clsx';
import Button, { Color } from 'components/ui/Button';
import Badge from './Badge';

type SelectItem = { label: string; value: string; disabled?: boolean };

type Props = {
	value: string;
	items: SelectItem[];
	badge?: boolean;
	color?: Color;
	variant?: 'subtle' | 'solid' | 'outline';
	onChange: (value: string) => void;
};

export default function Select({ value, onChange, items, badge, color, variant }: Props) {
	return (
		<SelectPrimitive.Root value={value} onValueChange={onChange}>
			<SelectPrimitive.Trigger className="w-full h-full" asChild aria-label="Select">
				{badge ? (
					<button className="w-full h-full">
						<Badge color={color} variant={variant}>
							<SelectPrimitive.Value />
						</Badge>
					</button>
				) : (
					<Button size="sm" rightIcon={<ChevronDownIcon />}>
						<SelectPrimitive.Value />
					</Button>
				)}
			</SelectPrimitive.Trigger>
			<SelectPrimitive.Content>
				<SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-primary">
					<ChevronUpIcon />
				</SelectPrimitive.ScrollUpButton>
				<SelectPrimitive.Viewport className="p-2 rounded-lg shadow-lg bg-secondary ring-1 ring-accent-primary ">
					<SelectPrimitive.Group>
						{items.map(({ label, value, disabled }, i) => (
							<SelectPrimitive.Item
								disabled={disabled}
								key={`${value}-${i}`}
								value={value}
								className={clsx(
									'relative flex items-center text-left py-2 px-3 rounded-md text-sm text-primary font-medium focus:bg-accent-primary',
									'radix-disabled:opacity-50',
									'focus:outline-none select-none'
								)}
							>
								<SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
								<SelectPrimitive.ItemIndicator className="absolute inline-flex items-center left-2">
									<CheckIcon />
								</SelectPrimitive.ItemIndicator>
							</SelectPrimitive.Item>
						))}
					</SelectPrimitive.Group>
				</SelectPrimitive.Viewport>
				<SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-primary">
					<ChevronDownIcon />
				</SelectPrimitive.ScrollDownButton>
			</SelectPrimitive.Content>
		</SelectPrimitive.Root>
	);
}
