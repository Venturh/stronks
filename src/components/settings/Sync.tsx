import { useState } from 'react';

import Switch from 'components/ui/Switch';
import { DescriptionList } from 'components/ui/DescripitonList';

import { trpc } from 'utils/trpc';

export default function Sync() {
	const { data } = trpc.useQuery(['syncSettings.data']);

	const utils = trpc.useContext();

	const toggle = trpc.useMutation('syncSettings.toggle', {
		async onSuccess() {
			await utils.invalidateQueries(['syncSettings.data']);
		},
	});

	const sync = trpc.useMutation(['fit.retrieveFitnessData']);

	const [syncMeasurements, setSyncMeasurements] = useState(data?.syncMeasurements ?? false);
	const [syncSteps, setSyncSteps] = useState(data?.syncSteps ?? false);
	const [syncNutrition, setSyncNutrition] = useState(data?.syncNutrition ?? false);
	const [syncWorkout, setSyncWorkout] = useState(data?.syncWorkout ?? false);
	return (
		<DescriptionList
			title="Google Fit"
			description="Define which data you want to sync with Google Fit."
			action={{
				loading: sync.isLoading,
				children: 'Sync latest',
				onClick: async () => await sync.mutateAsync(),
			}}
		>
			<div className="py-4">
				<Switch
					label="Weight"
					description="This will sync your weight and body fat from Google Fit."
					checked={syncMeasurements}
					onChange={(value) => {
						setSyncMeasurements(value);
						toggle.mutateAsync({ id: data?.id ?? '', syncMeasurements: value });
					}}
				/>
			</div>
			<div className="py-4">
				<Switch
					label="Nutrition"
					description="This will sync your nutrition data from Google Fit."
					checked={syncNutrition}
					onChange={(value) => {
						setSyncNutrition(value);
						toggle.mutateAsync({ id: data?.id ?? '', syncNutrition: value });
					}}
				/>
			</div>
			<div className="py-4">
				<Switch
					label="Workouts"
					description="This will sync your workouts from Google Fit."
					checked={syncWorkout}
					onChange={(value) => {
						setSyncWorkout(value);
						toggle.mutateAsync({ id: data?.id ?? '', syncWorkout: value });
					}}
				/>
			</div>
			<div className="py-4">
				<Switch
					label="Steps"
					description="This will sync your steps from Google Fit."
					checked={syncSteps}
					onChange={(value) => {
						setSyncSteps(value);
						toggle.mutateAsync({ id: data?.id ?? '', syncSteps: value });
					}}
				/>
			</div>
		</DescriptionList>
	);
}
