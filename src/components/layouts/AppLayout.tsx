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
							<div className="flex items-center justify-between w-full py-3 ml-3 md:hidden ">
								{title && (
									<div className="flex" style={{ flex: '0 0 auto' }}>
										<span className="font-medium leading-7 text-primary">{title}</span>
									</div>
								)}
								{actions && (
									<div className="flex items-center justify-end flex-auto w-full">{actions}</div>
								)}
							</div>
						</div>

						<div>
							<div className="sticky z-20 top-[63px] md:top-0 bg-secondary">
								<div className="border-b border-accent-primary">
									<div className="items-center justify-between hidden w-full px-4 py-3 md:flex ">
										{title && (
											<div className="flex" style={{ flex: '0 0 auto' }}>
												<span className="font-medium leading-7 text-primary">{title}</span>
											</div>
										)}
										{actions && (
											<div className="flex items-center justify-end flex-auto w-full">
												{actions}
											</div>
										)}
									</div>
								</div>
								{secondaryActions && (
									<div className="py-3 border-b bg-secondary border-accent-primary">
										<div className="w-full px-4">{secondaryActions}</div>
									</div>
								)}
							</div>
							<div
								className={clsx(
									'px-4 mx-auto overflow-x-scroll overflow-y-hidden mt-4 md:px-0',
									small ? 'max-w-4xl ' : 'max-w-7xl'
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
