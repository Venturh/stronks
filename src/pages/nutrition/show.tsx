import { useRouter } from 'next/router';
import NextError from 'next/error';

import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import Card from 'components/ui/Card';

import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';
import { toFixed } from 'utils/misc';

export default function Home() {
	const { query } = useRouter();
	const { category, date } = query as { category: string; date: string };

	const { data, error } = trpc.useQuery(['nutrition.show', { category, measuredFormat: date }]);

	if (error) {
		return <NextError statusCode={404} />;
	}

	const summary = data?.reduce(
		(acc, cur) => {
			acc.calories += cur.calories ?? 0;
			acc.carbohydrates += cur.carbohydrates ?? 0;
			acc.fat += cur.fat ?? 0;
			acc.protein += cur.protein ?? 0;
			return acc;
		},
		{ calories: 0, carbohydrates: 0, fat: 0, protein: 0 }
	);

	return (
		<AppLayout title="Nutrition" small>
			<div className="space-y-4">
				<StackedList grouped>
					<StackedListHeader primary={category} seconary="Carbs  •  Protein  •  Fat">
						{data?.map(({ name, amount, calories, carbohydrates, protein, fat }, idx) => (
							<StackedListItem
								key={idx}
								primary={`${amount} ${name}`}
								secondary={`${calories} kcal`}
								tertiary={`${toFixed(carbohydrates)}g • ${toFixed(protein)}g • ${toFixed(fat)}g`}
							/>
						))}
					</StackedListHeader>
				</StackedList>
				<Card
					main={`${summary?.calories} kcal`}
					second={`Carbs: ${toFixed(summary?.carbohydrates)}g •  Protein: ${toFixed(
						summary?.protein
					)}g • Fat: ${toFixed(summary?.fat)}g`}
				/>
			</div>
		</AppLayout>
	);
}

export const getServerSideProps = authenticatedRoute;
