import DatePicker from 'components/ui/DatePicker';
import DescriptionList from 'components/ui/DescripitonList';
import Form from 'components/ui/Form';
import ThemeSwitch from 'components/ui/ThemeToggle';
import { useFormValidation } from 'hooks/useForm';
import { z } from 'zod';

const schema = z.object({
	dateRange: z.string(),
});

export default function GeneralSettings() {
	const form = useFormValidation({ schema });

	return (
		<DescriptionList title="General" description="Define app behavior.">
			<div className="py-4">
				<ThemeSwitch />
				<Form form={form} headless>
					<div className="grid gap-4 sm:grid-cols-2">
						<DatePicker
							range
							label="Start"
							{...(form.register('dateRange'),
							{
								value: form.getValues('dateRange'),
								onChange: (val) => {
									console.log(val);
									form.setValue('dateRange', val as any);
								},
							})}
						/>
					</div>
				</Form>
			</div>
		</DescriptionList>
	);
}
