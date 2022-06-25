import { useState } from 'react';
import { useRouter } from 'next/router';
import NextError from 'next/error';
import { XIcon } from '@heroicons/react/solid';

import AppLayout from 'components/layouts/AppLayout';
import { StackedList, StackedListHeader, StackedListItem } from 'components/ui/StackedList';
import Card from 'components/ui/Card';
import IconButton from 'components/ui/IconButton';

import { authenticatedRoute } from 'utils/redirects';
import { trpc } from 'utils/trpc';
import { toFixed } from 'utils/misc';
import Button from 'components/ui/Button';
import NutritionComposer from 'components/nutrition/NutritionComposer';

export default function Home() {
	const { query } = useRouter();
	const { category, date } = query as { category: string; date: string };

	const [showStoreModal, setShowStoreModal] = useState(false);

	const utils = trpc.useContext();
	const { data, error } = trpc.useQuery(['nutrition.show', { category, measuredFormat: date }]);
	const removeMutation = trpc.useMutation(['nutrition.destroy']);

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
		<AppLayout
			title="Nutrition"
			actions={<Button onClick={() => setShowStoreModal(true)}>Add</Button>}
			small
		>
			<div className="space-y-4">
				<NutritionComposer now open={showStoreModal} close={() => setShowStoreModal(false)} />
				<StackedList grouped>
					<StackedListHeader primary={category} seconary="Carbs  •  Protein  •  Fat">
						{data?.map(
							({ name, amount, calories, carbohydrates, protein, fat, id, synced }, idx) => (
								<StackedListItem
									key={idx}
									primary={`${amount} ${name}`}
									secondary={`${calories} kcal`}
									tertiary={`${toFixed(carbohydrates)}g • ${toFixed(protein)}g • ${toFixed(fat)}g`}
									quaternary={
										!synced && (
											<IconButton
												ariaLabel="destroy"
												loading={removeMutation.isLoading}
												fullRounded
												size="xxs"
												color="secondary"
												icon={<XIcon />}
												onClick={async () =>
													await removeMutation.mutateAsync(
														{ id },
														{
															onSuccess: () =>
																utils.invalidateQueries([
																	'nutrition.show',
																	{ category, measuredFormat: date },
																]),
														}
													)
												}
											/>
										)
									}
								/>
							)
						)}
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
