import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Clickable from './Clickable';

type Props = {
	activeIndex?: number;
	items: {
		label: string;
		href?: string;
		onClick?: (index: number) => void;
		scroll?: boolean;
	}[];
};

export default function Tabs({ activeIndex, items }: Props) {
	const { asPath } = useRouter();
	const [selected, setSelected] = useState(
		activeIndex ?? items.findIndex((item) => item.href === asPath) ?? 0
	);

	useEffect(() => {
		if (activeIndex) {
			setSelected(activeIndex!);
		}
	}, [activeIndex]);
	useEffect(() => {
		if (asPath) {
			items.findIndex((item) => item.href === asPath);
		}
	}, [asPath]);

	const length = items.length;

	const options = new Map([
		[
			2,
			{
				translate: {
					'translate-x-0': selected === 0,
					'translate-x-[100%]': selected === 1,
				},
				width: 'w-1/2',
			},
		],
		[
			3,
			{
				translate: {
					'translate-x-0': selected === 0,
					'translate-x-full': selected === 1,
					'translate-x-[200%]': selected === 2,
				},
				width: 'w-1/3',
			},
		],
	]);

	const mappedOptions = options.get(length);

	return (
		<nav className="relative max-w-xs overflow-x-scroll rounded-md ring-1 bg-secondary ring-accent-primary">
			<div
				className={clsx(
					'absolute inset-y-0 h-full transition-transform transform',
					mappedOptions?.width,
					mappedOptions?.translate
				)}
			>
				<div className={clsx('w-full h-full bg-accent-primary rounded-md')}></div>
			</div>
			<div className="relative flex w-full h-full">
				{items.map(({ label, href, onClick, scroll }, index) => (
					<Clickable
						onClick={() => {
							setSelected(index);
							onClick && onClick(index);
						}}
						scroll={Boolean(scroll) || undefined}
						key={label}
						href={href}
						className={clsx(
							'py-1 w-1/3 text-center text-sm cursor-pointer select-none focus:outline-none capitalize font-medium',
							mappedOptions?.width
						)}
					>
						<span>{label}</span>
					</Clickable>
				))}
			</div>
		</nav>
	);
}
