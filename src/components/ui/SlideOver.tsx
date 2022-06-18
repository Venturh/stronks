import { Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import IconButton from './IconButton';

type Props = {
	children: React.ReactNode;
	open: boolean;
	onClose: () => void;
	title?: string;
};

export default function SlideOver({ children, open, onClose, title }: Props) {
	const initalFocusRef = useRef(null);
	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog initialFocus={initalFocusRef} as="div" className="relative z-10" onClose={onClose}>
				<div className="fixed inset-0" />

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="w-screen max-w-md pointer-events-auto">
									<div className="flex flex-col h-full py-6 overflow-y-scroll border-l shadow-xl bg-secondary border-l-accent-primary">
										<div className="px-4">
											<div className="flex items-start justify-between">
												<Dialog.Title className="text-lg font-medium text-primary">
													{title}
												</Dialog.Title>
												<div className="flex items-center ml-3 h-7">
													<IconButton
														size="sm"
														onClick={onClose}
														icon={<XIcon />}
														ariaLabel="close"
														color="secondary"
														variant="ghost"
														fullRounded
													/>
												</div>
											</div>
										</div>
										<div ref={initalFocusRef} className="relative flex-1 mt-6">
											{children}
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
