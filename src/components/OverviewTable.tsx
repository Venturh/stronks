import React, { useState } from 'react';
import { EyeOffIcon } from '@heroicons/react/outline';
import {
	createTable,
	getCoreRowModel,
	useTableInstance,
	VisibilityState,
} from '@tanstack/react-table';
import { Phase } from '@prisma/client';
import { ReactSortable, Sortable } from 'react-sortablejs';

import Select from './ui/Select';
import Checkbox from './ui/Checkbox';
import NestedMenu from './ui/NestedMenu';

import { trpc } from 'utils/trpc';
import type { Color } from './ui/Button';
import { OverviewData } from 'types';
import { DotsHorizontalIcon, EyeIcon, MenuIcon } from '@heroicons/react/solid';
import IconButton from './ui/IconButton';
import SlideOver from './ui/SlideOver';
import clsx from 'clsx';

type Props = {
	items: OverviewData[];
	hiddenTableHeaders: string[];
};
const table = createTable().setRowType<OverviewData>();

const defaultColumns = [
	table.createDataColumn('date', {
		cell: (info) => info.getValue(),
	}),
	table.createDataColumn('phase', {
		header: () => 'Phase',
		cell: ({ cell }) => <PhaseCell {...cell} />,
	}),
	table.createDataColumn('calories', {
		header: 'Calories',
	}),
	table.createDataColumn('weight', {
		header: () => 'Weight',
	}),
	table.createDataColumn('bodyFat', {
		header: 'Body fat',
	}),
	table.createDataColumn('training', {
		header: 'Training',
		cell: ({ cell, instance }) => <CheckboxCell disabled {...cell} instance={instance} />,
	}),
	table.createDataColumn('creatine', {
		header: 'Creatine',
		cell: ({ cell, instance }) => (
			<CheckboxCell updateKey="creatine" {...cell} instance={instance} />
		),
	}),
	table.createDataColumn('notes', {
		header: 'Notes',
		cell: ({ cell, instance }) => <TextCell {...cell} instance={instance} />,
	}),
];

export default function OverviewTable({ items, hiddenTableHeaders }: Props) {
	const columnKeys = defaultColumns.map((c) => c.id);
	const initialVisibility = columnKeys.reduce<Record<string, any>>((acc, curr) => {
		acc[curr] = hiddenTableHeaders.includes(curr) ? false : true;
		return acc;
	}, {});

	const [data] = React.useState(() => [...items]);
	const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibility);
	const [columnVisibilityList, setColumnVisibilityList] = useState<ItemInterface[]>(
		Object.entries(columnVisibility).map(([id, visible]) => ({ id, visible }))
	);

	const [open, setOpen] = useState(false);

	const editHiddenColumns = trpc.useMutation('user.edit');

	const instance = useTableInstance(table, {
		data,
		columns,
		state: {
			columnVisibility,
		},
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
	});

	async function editColumVisibility(id: string, show: boolean) {
		const visibility = {
			...columnVisibility,
			[id]: show,
		};
		const hiddenOverviewColumns = Object.keys(visibility).filter((key) => !visibility[key]);

		await editHiddenColumns.mutateAsync({
			data: {
				hiddenOverviewColumns,
			},
		});

		setColumnVisibilityList(
			columnVisibilityList.map((item) => ({ ...item, visible: visibility[item.id] }))
		);
	}

	return (
		<div className="p-2">
			<div className="h-4" />
			<div className="relative shadow bg-secondary ring-1 ring-accent-primary md:rounded-lg">
				<table className="min-w-full overflow-x-scroll divide-y table-fixed divide-accent-primary">
					<thead>
						{instance.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										className="font-medium tracking-wider text-left uppercase text-primary"
										key={header.id}
										colSpan={header.colSpan}
									>
										<NestedMenu
											className="py-4 px-1.5 font-medium tracking-wider text-left uppercase text-xxs text-primary"
											menuItems={[
												{
													items: [
														{
															text: 'Hide column',
															icon: <EyeOffIcon />,
															action: async () => {
																header.column.toggleVisibility(false);
																await editColumVisibility(header.column.id, false);
															},
														},
													],
												},
											]}
										>
											<span>{header.isPlaceholder ? null : header.renderHeader()}</span>
										</NestedMenu>
									</th>
								))}
								<th className="py-4 px-1.5 font-medium tracking-wider text-left uppercase text-xxs text-primary">
									<IconButton
										onClick={() => setOpen(!open)}
										color="primary"
										size="xs"
										variant="ghost"
										fullRounded
										icon={<DotsHorizontalIcon />}
										ariaLabel="settings"
									/>
								</th>
							</tr>
						))}
					</thead>
					<tbody className="relative divide-y divide-accent-secondary">
						{instance.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td className="px-2 py-3 text-sm text-left w-28 whitespace-nowrap" key={cell.id}>
										{cell.renderCell()}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<SlideOver title="Settings" open={open} onClose={() => setOpen(false)}>
				<ReactSortable
					animation={200}
					delay={1}
					swap
					list={columnVisibilityList}
					setList={(list) => {
						setColumnVisibilityList(list);
						instance.setColumnOrder(list.map((item) => item.id as string));
					}}
				>
					{columnVisibilityList.map(({ id, visible }) => (
						<div className="w-full px-2 py-1.5 bg-secondary " key={id}>
							<div className="flex justify-between">
								<div className="flex items-center ">
									<MenuIcon className="w-4 h-4 text-secondary" />
									<span className="ml-1 capitalize">{id}</span>
								</div>
								<IconButton
									onClick={async () => {
										await editColumVisibility(id as string, !visible);
										instance.getColumn(id as string).toggleVisibility(!visible);
									}}
									className={clsx({ 'opacity-50': !visible })}
									size="xs"
									variant="ghost"
									color="primary"
									icon={<EyeIcon />}
									ariaLabel="show"
								/>
							</div>
						</div>
					))}
				</ReactSortable>
			</SlideOver>
		</div>
	);
}

function PhaseCell({ row, getValue }: { row: any; getValue: () => any }) {
	const update = trpc.useMutation('overview.update');

	const infoId = row.original!.id;
	const initalValue = getValue();
	const [value, setValue] = useState<Phase>(initalValue ?? '');
	const items = [
		{ label: 'Maintain', value: Phase.MAINTAIN },
		{ label: 'Cutting', value: Phase.CUTTING },
		{ label: 'Bulking', value: Phase.BULKING },
	];

	const colors: Record<Phase, Color> = {
		[Phase.MAINTAIN]: 'brand',
		[Phase.CUTTING]: 'success',
		[Phase.BULKING]: 'error',
	};

	return (
		<div className="block h-12 -my-4 w-28">
			<Select
				onChange={async (phase) => {
					setValue(phase as Phase);
					await update.mutateAsync({
						phase: phase as Phase,
						infoId,
					});
				}}
				value={value}
				items={items}
				badge
				variant="subtle"
				color={colors[value]}
			/>
		</div>
	);
}

function TextCell({ getValue, row }: { instance: any; row: any; getValue: () => any }) {
	const infoId = row.original!.id;
	const initialValue = getValue() as string;
	const [value, setValue] = useState(initialValue ?? '');
	const update = trpc.useMutation('overview.update');

	return (
		<input
			className="block w-full h-8 -my-4 bg-secondary focus:ring-0 focus:ring-accent-primary focus:bg-accent-primary"
			value={value as string}
			onChange={(e) => setValue(e.target.value)}
			onBlur={async () => await update.mutateAsync({ infoId, notes: value })}
		/>
	);
}

function CheckboxCell({
	getValue,
	row,
	disabled,
	updateKey,
}: {
	disabled?: boolean;
	instance: any;
	row: any;
	getValue: () => any;
	updateKey?: keyof OverviewData;
}) {
	const infoId = row.original!.id;
	const initialValue = getValue();
	const [value, setValue] = useState(initialValue ?? '');
	const update = trpc.useMutation('overview.update');

	async function onChange(checked: boolean) {
		if (updateKey) {
			setValue(checked);
			await update.mutateAsync({ infoId, [updateKey]: checked });
		}
	}

	return (
		<Checkbox
			disabled={disabled}
			checked={value}
			onChecked={async (checked) => onChange(checked)}
		/>
	);
}