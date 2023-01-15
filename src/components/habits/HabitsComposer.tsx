import { Habits } from '@prisma/client';
import FormSelect from 'components/ui/FormSelect';
import Input from 'components/ui/Input';
import { MenuItem } from 'components/ui/Menu';
import { useFormValidation } from 'hooks/useForm';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { createHabitSchema, mappedHabitCategories, updateHabitSchema } from 'shared/habits';
import { api } from 'utils/api';

const FormModal = dynamic(() => import('components/ui/FormModal'), { ssr: false });

type Props = {
	open: boolean;
	setOpen: () => void;
	habit?: Habits;
};

export default function HabitComposer({ open, setOpen, habit }: Props) {
	const { push } = useRouter();
	const form = useFormValidation({
		schema: habit ? updateHabitSchema : createHabitSchema,
		defaultValues: habit,
	});

	function resetForm() {
		setOpen();
		form.reset();
	}

	const context = api.useContext();
	const mutation = api.habits[habit ? 'update' : 'store'].useMutation({
		onSuccess: () => {
			if (habit) context.habits.show.invalidate();
			else context.habits.index.invalidate();
			resetForm();
		},
	});

	const deleteHabit = api.habits.delete.useMutation({
		onSuccess: () => {
			push('/habits');
		},
	});

	const categoryMenuItems: MenuItem[] = Object.entries(mappedHabitCategories).map(
		([value, label]) => ({
			label,
			value,
		})
	);

	useEffect(() => {
		if (habit) {
			form.reset(habit);
		}
	}, [habit]);

	return (
		<FormModal
			title="Create new habit"
			open={open}
			loading={mutation.isLoading || deleteHabit.isLoading}
			setOpen={() => resetForm()}
			//@ts-expect-error yep
			form={form}
			deleteAction={habit ? async () => await deleteHabit.mutateAsync({ id: habit.id }) : undefined}
			submitButtonText={habit ? 'Update' : 'Create'}
			onSubmit={async (data) => {
				//@ts-expect-error yep
				await mutation.mutateAsync(data, {});
			}}
		>
			<div className="grid gap-4 ">
				<Input label="Name" {...form.register('name')} />
				<Input label="Emote" {...form.register('emote')} />
				<FormSelect
					color="secondary"
					variant="solid"
					label="Category"
					placeholder="Choose category"
					items={categoryMenuItems}
					{...form.register('category')}
				/>
			</div>
		</FormModal>
	);
}
