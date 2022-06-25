import { Transition } from '@headlessui/react';
import { Phase } from '@prisma/client';
import Button from 'components/ui/Button';
import Checkbox from 'components/ui/Checkbox';
import Select from 'components/ui/Select';
import { Fragment, useState } from 'react';
import { trpc } from 'utils/trpc';

type Props = {
	filterIds: string[];
	onChange: () => void;
};

export default function OverviewEditModal({ filterIds, onChange }: Props) {
	const update = trpc.useMutation('overview.bulk-update');

	const phases = [
		{ label: 'Maintain', value: Phase.MAINTAIN },
		{ label: 'Cutting', value: Phase.CUTTING },
		{ label: 'Bulking', value: Phase.BULKING },
	];

	const [phase, setSelectedPhase] = useState<Phase>(Phase.MAINTAIN);
	const [creatine, setCreatine] = useState(false);

	async function submit() {
		await update.mutateAsync({ infoIds: filterIds, phase, creatine });
		onChange();
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
								items={phases}
							/>
						</div>
						<div className="block w-28">
							<Checkbox
								color="accent"
								label="Creatine"
								checked={creatine}
								onChange={(e) => setCreatine(e.target.checked)}
							/>
						</div>
						<Button size="sm" onClick={submit}>
							Save
						</Button>
					</div>
				</Transition>
			</div>
		</div>
	);
}
