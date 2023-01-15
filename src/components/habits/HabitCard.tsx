import { CheckCircleIcon } from '@heroicons/react/solid';
import { Habits } from '@prisma/client';
import clsx from 'clsx';
import { mappedHabitCategories } from 'shared/habits';
import { api } from 'utils/api';

type Props = {
	habit: Habits;
	infoId: string;
	checked: boolean;
};

export default function HabitCard({ habit, infoId, checked }: Props) {
	const context = api.useContext();
	const { mutateAsync, isLoading } = api.habits.complete.useMutation({
		onSuccess: () => context.overview.show.invalidate({ id: infoId }),
	});
	return (
		<button
			type="button"
			onClick={() => mutateAsync({ habitId: habit.id, infoId })}
			className={clsx(
				'p-4 text-left rounded-lg  hover relative  px-5 py-2.5 overflow-hidden group bg-brand-secondary  hover:bg-gradient-to-r hover:from-brand-secondary hover:to-brand-primary text-white hover:ring-2 hover:ring-offset-2 ring-offset-bg-primary hover:ring-brand-primary transition-all ease-out duration-300',
				{ 'bg-gradient-to-r from-brand-secondary  to-brand-primary': isLoading }
			)}
		>
			<span className="absolute w-20 h-32 -mt-12 transition-all duration-1000 transform translate-x-24 bg-white -right-0 opacity-10 rotate-12 group-hover:-translate-x-64 ease"></span>
			<div className="flex flex-row justify-between">
				<div>{habit.emote}</div>
				<CheckCircleIcon className={clsx('h-6 w-6', { 'opacity-50 ': !checked })} />
			</div>
			<div>
				<p>{habit.name}</p>
				<p>{mappedHabitCategories[habit.category]}</p>
			</div>
		</button>
	);
}
