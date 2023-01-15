import React, { useState } from 'react';
import clsx from 'clsx';
import {
	ColumnDef,
	ColumnOrderState,
	flexRender,
	getCoreRowModel,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';
import { Habits, Mood, Phase } from '@prisma/client';
import { ItemInterface, ReactSortable } from 'react-sortablejs';
import { DotsHorizontalIcon, MenuIcon } from '@heroicons/react/solid';

import Select from 'components/ui/Select';
import IconButton from 'components/ui/IconButton';
import SlideOver from 'components/ui/SlideOver';
import OverviewEditModal from './OverviewEditModal';
import Checkbox from 'components/ui/Checkbox';
import CheckboxDiv from 'components/ui/CheckDiv';

import { api } from 'utils/api';
import { mappedShortPhases, phaseBorderColors, phaseColors } from 'utils/phase';

import { OverviewData } from 'types';
import { ChevronRightIcon } from '@heroicons/react/outline';
import Switch from 'components/ui/Switch';
import { mappedMoods } from 'utils/mood';

type Props = {
	items: OverviewData[];
	hiddenTableHeaders: string[];
	orderOverviewColumns: string[];
	habits: Habits[];
};

const defaultColumns: ColumnDef<OverviewData>[] = [
	{
		id: 'toggle',
		accessorKey: 'toggle',
		cell: ({ row }) => (
			<Checkbox
				color="secondary"
				checked={row.getIsSelected()}
				onChange={row.getToggleSelectedHandler()}
			/>
		),
		header: ({ table }) => (
			<Checkbox
				color="secondary"
				checked={table.getIsAllRowsSelected()}
				onChange={table.getToggleAllRowsSelectedHandler()}
			/>
		),
		enableSorting: false,
	},
	{
		accessorKey: 'date',
		id: 'date',
		header: 'Date',
		cell: (info) => info.getValue(),
	},
	{
		accessorKey: 'Mood',
		id: 'mood',
		cell: ({ cell }) => <MoodCell {...cell} />,
	},
	{
		header: 'Phase',
		accessorKey: 'phase',
		id: 'phase',
		cell: ({ cell }) => <PhaseCell {...cell} />,
	},
	{
		header: 'Calories',
		accessorKey: 'calories',
		id: 'calories',
		cell: (info) => info.getValue() ?? '-',
	},
	{
		header: 'Weight',
		accessorKey: 'weight',
		id: 'weight',
		cell: (info) => info.getValue() ?? '-',
	},
	{
		accessorKey: 'bodyFat',
		id: 'bodyFat',
		header: 'Body Fat',
		cell: (info) => info.getValue() ?? '-',
	},
	{
		header: 'Training',
		accessorKey: 'training',
		id: 'training',
		cell: ({ cell, table }) => <CheckboxDivCell disabled {...cell} table={table} />,
	},
	{
		header: 'Notes',
		accessorKey: 'notes',
		id: 'notes',
		cell: ({ cell, table }) => <TextCell {...cell} table={table} />,
	},
];

export default function OverviewTable({
	items,
	hiddenTableHeaders,
	orderOverviewColumns,
	habits,
}: Props) {
	const initialVisibility = orderOverviewColumns.reduce<Record<string, any>>((acc, curr) => {
		acc[curr] = hiddenTableHeaders.includes(curr) ? false : true;
		return acc;
	}, {});

	const [data] = React.useState(() => [...items]);

	const habitColumns: ColumnDef<OverviewData>[] = habits.map(({ name, id }) => ({
		id,
		header: () => name,
		cell: ({ cell, table }) => (
			// @ts-ignore
			<CheckboxDivCell isHabit updateKey={id} {...cell} table={table} />
		),
	}));

	const [columns] = React.useState<typeof defaultColumns>(() => [
		...defaultColumns,
		...habitColumns,
	]);

	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibility);
	const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(orderOverviewColumns);

	const [columnVisibilityList, setColumnVisibilityList] = useState<ItemInterface[]>(
		Object.entries(columnVisibility).map(([id, visible]) => ({ id, visible }))
	);

	const [open, setOpen] = useState(false);

	const editUser = api.user.edit.useMutation();

	const [rowSelection, setRowSelection] = useState({});

	const table = useReactTable<OverviewData>({
		data,
		columns,
		state: {
			rowSelection,
			columnVisibility,
			columnOrder,
		},
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnOrderChange: setColumnOrder,
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
			<div className="block max-h-screen overflow-x-auto ">
				<table className="relative min-w-full overflow-x-scroll divide-y shadow table-fixed divide-accent-primary ring-1 bg-secondary ring-accent-primary md:rounded-lg">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr
								className="sticky top-0 z-10 font-medium tracking-wider text-left uppercase bg-secondary text-xxs text-primary"
								key={headerGroup.id}
							>
								{headerGroup.headers.map((header) => (
									<th className="px-2 py-3" key={header.id} colSpan={header.colSpan}>
										{header.isPlaceholder
											? null
											: flexRender(header.column.columnDef.header, header.getContext())}
									</th>
								))}
								<th>
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
						{table.getRowModel().rows.map((row) => (
							<tr className="" key={row.id}>
								{row.getVisibleCells().map((cell, index) => (
									<td
										className={clsx(
											'px-2 py-3 text-sm text-left  whitespace-nowrap',
											index === row.getVisibleCells().length - 1
										)}
										key={cell.id}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
								<td
									className={clsx(
										'   py-3 text-sm text-left whitespace-nowrap border-r',
										phaseBorderColors[row.original?.phase as Phase]
									)}
								>
									<IconButton
										href={`/overview/${row.original?.id}`}
										size="xs"
										fullRounded
										icon={<ChevronRightIcon />}
										ariaLabel="show"
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

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
											<span className="ml-1 text-sm capitalize">
												{habits.find((h) => h.id === id)?.name || id}
											</span>
										</div>
										<Switch
											checked={visible}
											onChange={async () => {
												table.getColumn(id as string).toggleVisibility(!visible);
												await editColumVisibility(id as string, !visible);
											}}
										/>
									</div>
								</div>
							</div>
						))}
				</ReactSortable>
			</SlideOver>
			<OverviewEditModal
				filterIds={
					table.getSelectedRowModel().flatRows.flatMap(({ original }) => original!.id) as string[]
				}
				visibleHabits={habits.filter(
					(h) => columnVisibilityList.find((c) => c.id === h.id)?.visible
				)}
				onChange={() => setRowSelection([])}
			/>
		</>
	);
}

function PhaseCell({ row, getValue }: { row: any; getValue: () => any }) {
	const update = api.overview.update.useMutation();

	const infoId = row.original!.id;
	const initalValue = getValue();
	const [value, setValue] = useState<Phase>(initalValue ?? '');

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
			items={mappedShortPhases}
			badge
			variant="subtle"
			color={phaseColors[value]}
		/>
	);
}
function MoodCell({ row, getValue }: { row: any; getValue: () => any }) {
	const update = api.overview.update.useMutation();

	const infoId = row.original!.id;
	const initalValue = getValue();
	const [value, setValue] = useState<Mood>(initalValue);
	return (
		<Select
			onChange={async (mood) => {
				setValue(mood as Mood);
				await update.mutateAsync({
					mood: mood as Mood,
					infoId,
				});
			}}
			badge
			value={value}
			items={mappedMoods}
			variant="subtle"
		/>
	);
}

function TextCell({ getValue, row }: { table: any; row: any; getValue: () => any }) {
	const infoId = row.original!.id;
	const initialValue = getValue() as string;
	const [value, setValue] = useState(initialValue ?? '');
	const update = api.overview.update.useMutation();

	return (
		<input
			className="block w-full h-8 -my-4 bg-secondary focus:ring-0 focus:ring-accent-primary focus:bg-accent-primary"
			value={value as string}
			onChange={(e) => setValue(e.target.value)}
			onBlur={async () => await update.mutateAsync({ infoId, notes: value })}
		/>
	);
}

function CheckboxDivCell({
	getValue,
	row,
	disabled,
	updateKey,
	isHabit,
}: {
	disabled?: boolean;
	table: any;
	row: any;
	getValue: () => any;
	updateKey?: keyof OverviewData;
	isHabit?: boolean;
}) {
	const infoId = row.original!.id;
	const initialValue = getValue();
	const [value, setValue] = useState(initialValue ?? '');
	const update = api.overview.update.useMutation();

	async function onChange(checked: boolean) {
		if (updateKey) {
			setValue(checked);
			if (isHabit) return await update.mutateAsync({ infoId, habitId: updateKey });
			await update.mutateAsync({ infoId, [updateKey]: checked });
		}
	}

	return (
		<CheckboxDiv
			disabled={disabled}
			checked={value}
			onChange={async (checked) => onChange(checked)}
		/>
	);
}
