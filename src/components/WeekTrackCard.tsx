import clsx from 'clsx';
import { pluralize } from 'utils/misc';

type Props = {
	days?: { active: boolean; weekDay: string }[];
	primary?: number;
	secondary?: string | React.ReactNode;
};

export default function WeekTrackCard({ days, primary, secondary }: Props) {
	return (
		<div className="my-4">
			<div className="divide-y rounded-lg shadow divide-accent-primary bg-secondary">
				<div className="w-full px-2 py-3 ">
					<span className="text-sm font-medium">This Week</span>
					<div className="flex items-end justify-between space-x-6">
						<div className="flex-1 truncate">
							<h3 className="font-medium truncate text-primary">
								<span className="text-2xl font-medium">{primary}</span>
								<span> {pluralize('day', primary ?? 0)}</span>
							</h3>
							<p className="mt-1 text-secondary">{secondary}</p>
						</div>
						<div className="flex space-x-4">
							{days?.map((stat) => (
								<div className="flex flex-col" key={stat.weekDay}>
									<div
										className={clsx(
											'rounded-full h-4 w-4',
											stat.active ? 'bg-success-primary' : 'bg-accent-primary'
										)}
									/>
									<span className="mt-2 text-sm">{stat.weekDay}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
