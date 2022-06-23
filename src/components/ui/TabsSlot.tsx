import { cloneElement, ReactElement } from 'react';
import clsx from 'clsx';
import { Tab } from '@headlessui/react';

type Props = {
	options: {
		label: string;
		slot: ReactElement;
	}[];
};

const Slot = ({ type, ...rest }: { type: React.ReactElement }) => {
	return cloneElement(type, { ...rest });
};

export default function TabsSlot({ options }: Props) {
	return (
		<Tab.Group as="div">
			<Tab.List className="flex w-48 rounded-md ring-1 bg-primary ring-accent-primary">
				{options.map(({ label }) => (
					<Tab
						key={label}
						className={({ selected }) =>
							clsx(
								selected
									? 'bg-accent-primary text-primary'
									: 'text-secondary hover:text-primary hover:bg-accent-primary ',
								'py-0.5 w-full text-sm font-medium leading-5 rounded-md',
								'focus:outline-none'
							)
						}
					>
						{label}
					</Tab>
				))}
			</Tab.List>
			<Tab.Panels className="h-full mt-4 rounded-lg">
				{options.map((option, idx) => (
					<Tab.Panel className="h-full" key={idx}>
						<Slot type={option.slot} />
					</Tab.Panel>
				))}
			</Tab.Panels>
		</Tab.Group>
	);
}
