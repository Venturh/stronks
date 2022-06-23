import clsx from 'clsx';
import { useState } from 'react';
import { MenuAlt2Icon } from '@heroicons/react/outline';

import { AppNavigation } from 'components/navigation/AppNavigation';
import Seo from 'components/ui/Seo';

type Props = {
	children: React.ReactNode;
	title: string;
	actions?: React.ReactNode;
	secondaryActions?: React.ReactNode;
	small?: boolean;
};

export default function AppLayout({ children, title, small, actions, secondaryActions }: Props) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<Seo title={title} />
			<div>
				<AppNavigation sidebarOpen={sidebarOpen} setSidebarOpen={(open) => setSidebarOpen(open)} />
				<div className="md:pl-48 ">
					<div className="flex flex-col">
						<div className="sticky top-0 z-50 flex items-center flex-shrink-0 h-16 px-4 bg-secondary md:hidden ">
							<button
								type="button"
								className="text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
								onClick={() => setSidebarOpen(!sidebarOpen)}
							>
								<span className="sr-only">Open sidebar</span>
								<MenuAlt2Icon className="w-6 h-6" aria-hidden="true" />
							</button>
							<div className="items-center justify-between px-4 md:hidden ">
								{title && <h2 className="py-2 font-medium leading-7 text-primary ">{title}</h2>}
								{actions && actions}
							</div>
						</div>

						<div>
							<div className="sticky z-20 top-[63px] md:top-0 bg-secondary">
								<div className="border-b border-accent-primary">
									<div className="items-center justify-between hidden px-4 md:flex ">
										{title && <h2 className="py-3 font-medium leading-7 text-primary ">{title}</h2>}
										{actions && actions}
									</div>
								</div>
								{secondaryActions && (
									<div className="py-3 border-b bg-secondary border-accent-primary">
										<div className="px-4">{secondaryActions}</div>
									</div>
								)}
							</div>
							<div
								className={clsx(
									{ 'max-w-4xl mx-auto': small },
									'px-4 overflow-scroll mt-4 md:px-0'
								)}
							>
								{children}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
