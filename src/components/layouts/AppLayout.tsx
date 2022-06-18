import { useState } from 'react';
import { MenuAlt2Icon } from '@heroicons/react/outline';
import { AppNavigation } from 'components/navigation/AppNavigation';
import Seo from 'components/ui/Seo';

type Props = {
	children: React.ReactNode;
	title: string;
};

export default function AppLayout({ children, title }: Props) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<Seo title={title} />
			<div>
				<AppNavigation sidebarOpen={sidebarOpen} setSidebarOpen={(open) => setSidebarOpen(open)} />
				<div className="md:pl-64">
					<div className="flex flex-col max-w-5xl mx-auto">
						<div className="sticky top-0 z-50 flex items-center justify-between flex-shrink-0 h-16 px-4 sm:hidden ">
							<button
								type="button"
								className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 md:hidden"
								onClick={() => setSidebarOpen(!sidebarOpen)}
							>
								<span className="sr-only">Open sidebar</span>
								<MenuAlt2Icon className="w-6 h-6" aria-hidden="true" />
							</button>
						</div>

						<div className="px-2 py-3 overflow-scroll">{children}</div>
					</div>
				</div>
			</div>
		</>
	);
}
