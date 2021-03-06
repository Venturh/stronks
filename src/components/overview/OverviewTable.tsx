import React, { useState } from 'react';
import { EyeOffIcon } from '@heroicons/react/outline';
import {
	ColumnOrderState,
	createTable,
	getCoreRowModel,
	useTableInstance,
	VisibilityState,
} from '@tanstack/react-table';
import { Phase } from '@prisma/client';
import { ItemInterface, ReactSortable } from 'react-sortablejs';

import Select from 'components/ui/Select';
import Checkbox from 'components/ui/Checkbox';
import NestedMenu from 'components/ui/NestedMenu';

import { trpc } from 'utils/trpc';
import type { Color } from '../ui/Button';
import { OverviewData } from 'types';
import { DotsHorizontalIcon, EyeIcon, MenuIcon } from '@heroicons/react/solid';
import IconButton from '../ui/IconButton';
import SlideOver from '../ui/SlideOver';
import clsx from 'clsx';
import OverviewEditModal from './OverviewEditModal';

type Props = {
	items: OverviewData[];
	hiddenTableHeaders: string[];
	orderOverviewColumns: string[];
};
const table = createTable().setRowType<OverviewData>();

const defaultColumns = [
	table.createDisplayColumn({
		id: 'toggle',
		cell: ({ row }) => (
			<Checkbox
				color="secondary"
				checked={row.getIsSelected()}
				onChange={row.getToggleSelectedHandler()}
			/>
		),
		header: ({ instance }) => (
			<Checkbox
				color="secondary"
				checked={instance.getIsAllRowsSelected()}
				onChange={instance.getToggleAllRowsSelectedHandler()}
			/>
		),
		enableSorting: false,
	}),
	table.createDataColumn('date', {
		cell: (info) => info.getValue(),
	}),
	table.createDataColumn('phase', {
		header: () => 'Phase',
		cell: ({ cell }) => <PhaseCell {...cell} />,
	}),
	table.createDataColumn('calories', {
		header: 'Calories',
		cell: (info) => info.getValue() ?? '-',
	}),
	table.createDataColumn('weight', {
		header: () => 'Weight',
		cell: (info) => info.getValue() ?? '-',
	}),
	table.createDataColumn('bodyFat', {
		header: 'Body fat',
		cell: (info) => info.getValue() ?? '-',
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

export default function OverviewTable({ items, hiddenTableHeaders, orderOverviewColumns }: Props) {
	const orderOverviewColumnsWithCheckbox = ['toggle', ...orderOverviewColumns];
	const initialVisibility = orderOverviewColumnsWithCheckbox.reduce<Record<string, any>>(
		(acc, curr) => {
			acc[curr] = hiddenTableHeaders.includes(curr) ? false : true;
			return acc;
		},
		{}
	);

	const [data] = React.useState(() => [...items]);
	const [columns] = React.useState<typeof defaultColumns>(() => [...defaultColumns]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibility);
	const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
		orderOverviewColumnsWithCheckbox
	);
	const [columnVisibilityList, setColumnVisibilityList] = useState<ItemInterface[]>(
		Object.entries(columnVisibility).map(([id, visible]) => ({ id, visible }))
	);

	const [open, setOpen] = useState(false);

	const editUser = trpc.useMutation('user.edit');

	const [rowSelection, setRowSelection] = useState({});
	const instance = useTableInstance(table, {
		data,
		columns,
		state: {
			rowSelection,
			columnVisibility,
			columnOrder,
		},
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
	});

	async function editColumVisibility(id: string, show: boolean) {
		const visibility = {
			...columnVisibility,
			[id]: show,
		};
		const hiddenOverviewColumns = Object.keys(visibility).filter((key) => !visibility[key]);
		await editUser.mutateAsync({
			data: {
				hiddenOverviewColumns,
			},
		});
		setColumnVisibilityList(
			columnVisibilityList.map((item) => ({ ...item, visible: visibility[item.id] }))
		);
	}

	async function editColumnOrder(list: ItemInterface[]) {
		const idOrder = list.map((item) => item.id as string);
		setColumnOrder(idOrder);
		setColumnVisibilityList(list);
		await editUser.mutateAsync({
			data: {
				orderOverviewColumns: idOrder,
			},
		});
	}

	return (
		<>
			<table className="relative min-w-full overflow-x-scroll divide-y shadow table-fixed divide-accent-primary ring-1 bg-secondary ring-accent-primary md:rounded-lg">
				<thead>
					{instance.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header, i) => (
								<th
									className={clsx('font-medium tracking-wider text-left uppercase text-primary', {
										'relative w-12 px-6 sm:w-16 sm:px-8': header.id === 'toggle',
										'min-w-[8rem]': i === 1,
									})}
									key={header.id}
									colSpan={header.colSpan}
								>
									{header.id !== 'toggle' ? (
										<NestedMenu
											className={clsx(
												'py-4 px-1.5 font-medium tracking-wider text-left uppercase text-xxs text-primary',
												{
													'min-w-[8rem]': i === 1,
												}
											)}
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
									) : (
										<span>{header.isPlaceholder ? null : header.renderHeader()}</span>
									)}
								</th>
							))}
							<th className="py-4 px-1.5 font-medium tracking-wider text-left uppercase text-xxs text-primary">
								<IconButton
									onClick={() => setOpen(!open)}
									size="xs"
									fullRounded
									icon={<DotsHorizontalIcon />}
									ariaLabel="settings"
								/>
							</th>
						</tr>
					))}
				</thead>
				<tbody className="relative divide-y divide-accent-primary">
					{instance.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell, index) => (
								<td
									className={clsx(
										'px-2 py-3 text-sm text-left  whitespace-nowrap',
										index === 0 ? 'relative w-12 px-6 sm:w-16 sm:px-8' : 'w-28'
									)}
									key={cell.id}
								>
									{cell.renderCell()}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<SlideOver title="Settings" open={open} onClose={() => setOpen(false)}>
				<ReactSortable
					className="divide-y divide-accent-primary"
					animation={200}
					delay={1}
					swap
					list={columnVisibilityList.filter((c) => c.id !== 'toggle')}
					setList={async (list, sortable, store) => {
						if (
							store.dragging &&
							store.dragging.props &&
							JSON.stringify(store.dragging.props.list) !== JSON.stringify(list)
						) {
							await editColumnOrder([columnVisibilityList[0], ...list]);
						}
					}}
				>
					{columnVisibilityList
						.filter((c) => c.id !== 'toggle')
						.map(({ id, visible }) => (
							<div key={id} className="cursor-default bg-secondary hover:bg-accent-secondary">
								<div className="w-full px-4 py-2 ">
									<div className="flex justify-between">
										<div className="flex items-center ">
											<MenuIcon className="w-3.5 h-3.5 text-secondary" />
											<span className="ml-1 text-sm capitalize">{id}</span>
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
							</div>
						))}
				</ReactSortable>
			</SlideOver>
			<OverviewEditModal
				filterIds={instance.getSelectedRowModel().flatRows.flatMap(({ original }) => original!.id)}
				onChange={() => setRowSelection([])}
			/>
		</>
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
			color="secondary"
			disabled={disabled}
			checked={value}
			onChecked={async (checked) => onChange(checked)}
		/>
	);
}
