import FormSelect from 'components/ui/FormSelect';
import Input from 'components/ui/Input';
import dayjs from 'dayjs';
import { useFormValidation } from 'hooks/useForm';
import dynamic from 'next/dynamic';
import { trpc } from 'utils/trpc';
import { z } from 'zod';

const FormModal = dynamic(() => import('components/ui/FormModal'), { ssr: false });

export const createNutritionSchema = z.object({
	date: z.string(),
	name: z.string().min(1),
	amount: z.string().min(1),
	calories: z.number(),
	category: z.string(),
	protein: z.number().nullable(),
	carbohydrates: z.number().nullable(),
	fat: z.number().nullable(),
});

type Props = {
	open: boolean;
	close: () => void;
	now?: boolean;
};

export default function NutritionComposer({ open, close, now = false }: Props) {
	const form = useFormValidation({
		schema: createNutritionSchema,
		defaultValues: {
			date: now ? dayjs().format('YYYY-MM-DD') : undefined,
			protein: null,
			carbohydrates: null,
			fat: null,
		},
	});

	function resetForm() {
		close();
		form.reset();
	}

	const utils = trpc.useContext();
	const storeMutation = trpc.useMutation(['nutrition.store']);

	return (
		<FormModal
			title="Add Nutrition"
			open={open}
			loading={storeMutation.isLoading}
			setOpen={() => resetForm()}
			//@ts-expect-error yep
			form={form}
			submitButtonText="Add"
			onSubmit={async (data) => {
				//@ts-expect-error yep
				await storeMutation.mutateAsync(data, {
					onSuccess: () => {
						utils.invalidateQueries(['nutrition.index']);
						resetForm();
					},
				});
			}}
		>
			<div>
				<div className="grid gap-4 sm:grid-cols-2">
					<Input className="col-span-2" label="Name" {...form.register('name')} />
					<Input label="Amount" {...form.register('amount')} />
					<Input
						label="Calories"
						type="number"
						{...form.register('calories', { valueAsNumber: true })}
					/>
					<Input label="Date" type="date" {...form.register('date')} />
					<FormSelect
						color="secondary"
						variant="solid"
						label="Category"
						placeholder="Choose category"
						items={[
							{ text: 'Breakfast', value: 'breakfast' },
							{ text: 'Lunch', value: 'lunch' },
							{ text: 'Dinner', value: 'dinner' },
							{ text: 'Snack', value: 'snack' },
						]}
						{...form.register('category')}
					/>
				</div>
				<div className="grid gap-4 mt-4 sm:grid-cols-3">
					<Input label="Protein" {...(form.register('protein'), { valueAsNumber: true })} />
					<Input label="Carbs" {...(form.register('carbohydrates'), { valueAsNumber: true })} />
					<Input label="Fat" {...(form.register('fat'), { valueAsNumber: true })} />
				</div>
			</div>
		</FormModal>
	);
}
