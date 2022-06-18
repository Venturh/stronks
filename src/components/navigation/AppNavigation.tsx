import { Dialog, Transition } from '@headlessui/react';
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
							<Dialog.Panel className="relative flex flex-col w-48 bg-primary">
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
