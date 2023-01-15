import { Fragment, useState } from 'react';
import { Transition } from '@headlessui/react';
import { Habits, Phase } from '@prisma/client';

import Button from 'components/ui/Button';
import Select from 'components/ui/Select';
import Checkbox from 'components/ui/Checkbox';

import { api } from 'utils/api';
import { mappedPhases } from 'utils/phase';

type Props = {
	filterIds: string[];
	visibleHabits: Habits[];
	onChange: () => void;
};

export default function OverviewEditModal({ filterIds, visibleHabits, onChange }: Props) {
	const update = api.overview.bulkUpdate.useMutation({
		onSuccess: async () => await context.overview.index.invalidate(),
	});
	const context = api.useContext();

	const [phase, setSelectedPhase] = useState<Phase>(Phase.MAINTAIN);
	const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

	async function submit() {
		await update.mutateAsync({ infoIds: filterIds, phase, habitIds: selectedHabits });
		await context.overview.index.invalidate();
		setSelectedHabits([]);
		setSelectedPhase(Phase.MAINTAIN);
		onChange();
	}

	function onChecked(checked: boolean, habit: Habits) {
		if (checked) {
			setSelectedHabits([...selectedHabits, habit.id]);
		} else {
			setSelectedHabits(selectedHabits.filter((id) => id !== habit.id));
		}
	}

	return (
		<div className="fixed z-10 flex items-end px-4 py-6 -translate-x-1/2 left-1/2 bottom-2 sm:p-6 sm:items-start">
			<div className="flex flex-col items-center w-full space-y-4 sm:items-end">
				<Transition
					show={filterIds.length > 0}
					as={Fragment}
					enter="transform ease-out duration-300 transition"
					enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
					enterTo="translate-y-0 opacity-100 sm:translate-x-0"
					leave="transition ease-in duration-100"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="flex items-center p-4 space-x-4 rounded shadow bg-accent-primary ring-1 ring-accent-secondary">
						<div>{filterIds.length} selected</div>
						<div className="block w-28">
							<Select
								value={phase}
								onChange={(phase) => setSelectedPhase(phase as Phase)}
								items={mappedPhases}
							/>
						</div>
						{visibleHabits.map((habit) => (
							<div className="block w-16" key={habit.id}>
								<Checkbox
									onChecked={(checked) => onChecked(checked, habit)}
									color="accent"
									label={habit.name}
								/>
							</div>
						))}
						<Button size="sm" onClick={submit}>
							Save
						</Button>
					</div>
				</Transition>
			</div>
		</div>
	);
}
