import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/solid';
import { Fragment } from 'react';
import Sidebar from './Sidebar';

type Props = {
	sidebarOpen: boolean;
	setSidebarOpen: (value: boolean) => void;
};

export function AppNavigation({ sidebarOpen, setSidebarOpen }: Props) {
	return (
		<>
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog as="div" className="relative z-40 md:hidden" onClose={setSidebarOpen}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
					</Transition.Child>

					<div className="fixed inset-0 z-40 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<Dialog.Panel className="relative max-w-xs w-full bg-primary pt-5 pb-4 flex-1 flex flex-col">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<div className="absolute top-0 right-0 -mr-14 p-1">
										<button
											type="button"
											className="h-12 w-12 rounded-full flex items-center justify-center focus:outline-none focus:bg-gray-600"
											onClick={() => setSidebarOpen(false)}
										>
											<XIcon className="h-6 w-6 text-white" aria-hidden="true" />
											<span className="sr-only">Close sidebar</span>
										</button>
									</div>
								</Transition.Child>
								<Sidebar />
							</Dialog.Panel>
						</Transition.Child>
						<div className="flex-shrink-0 w-14" aria-hidden="true" />
					</div>
				</Dialog>
			</Transition.Root>
			<div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
				<Sidebar />
			</div>
		</>
	);
}
