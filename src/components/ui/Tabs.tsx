import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import Clickable from './Clickable';

export type TabItem = {
	label: string;
	value?: string;
	href?: string;
	onClick?: ({ index, value }: { index: number; value: string }) => void;
	scroll?: boolean;
};

type Props = {
	activeIndex?: number;
	items: TabItem[];
	maxWidth?: string;
};

export default function Tabs({ activeIndex, items, maxWidth }: Props) {
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

	return (
		<nav
			className={clsx(
				'relative w-full overflow-x-auto rounded-md ring-1 bg-secondary ring-accent-primary',
				maxWidth ?? 'max-w-xl'
			)}
		>
			<div
				className={clsx('absolute inset-y-0 h-full transition-transform transform')}
				style={{
					width: `calc(100% / ${length})`,
					transform: `translateX(${selected * 100}%)`,
				}}
			>
				<div className={clsx('w-full h-full bg-accent-primary rounded-md')}></div>
			</div>
			<div className="relative flex h-full">
				{items.map(({ label, value, href, onClick, scroll }, index) => (
					<Clickable
						onClick={() => {
							setSelected(index);
							onClick && onClick({ index, value: value ?? label });
						}}
						scroll={Boolean(scroll) || undefined}
						key={label}
						href={href}
						className={clsx(
							'py-1  text-center text-sm cursor-pointer select-none focus:outline-none capitalize font-medium'
						)}
						style={{
							width: `calc(100% / ${length})`,
						}}
					>
						<span>{label}</span>
					</Clickable>
				))}
			</div>
		</nav>
	);
}
