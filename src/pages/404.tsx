import { ChevronRightIcon } from '@heroicons/react/solid';
import { useSession } from 'next-auth/react';

import Clickable from 'components/ui/Clickable';
import Logo from 'components/ui/Logo';
import Seo from 'components/ui/Seo';

export default function NotFound() {
	const { data } = useSession();

	return (
		<>
			<Seo title="Not Found" description="The page you are looking for could not be found." />
			<div className="bg-primary">
				<main className="w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div className="flex-shrink-0 pt-16 text-center">
						<Logo />
					</div>
					<div className="max-w-xl py-6 mx-auto">
						<div className="text-center">
							<p className="text-sm font-semibold tracking-wide uppercase text-brand-primary">
								404 error
							</p>
							<h1 className="mt-2 text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
								This page does not exist.
							</h1>
							<p className="mt-2 text-lg text-secondary">
								The page you are looking for could not be found.
							</p>
						</div>
						{/* <div className="mt-12">
							<h2 className="text-sm font-semibold tracking-wide uppercase text-secondary">
								Available pages
							</h2>
							<ul
								role="list"
								className="mt-4 border-t border-b divide-y border-accent-primary divide-accent-primary"
							>
								{links.map((link, linkIdx) => (
									<li key={linkIdx}>
										<Clickable
											href={link.href}
											className="relative flex items-start py-6 space-x-4"
										>
											<div className="flex-shrink-0">
												<span className="flex items-center justify-center w-12 h-12 rounded-lg bg-secondary">
													<link.icon className="w-6 h-6 text-brand-primary" aria-hidden="true" />
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<h3 className="text-base font-medium text-primary">{link.name}</h3>
												<p className="text-base text-secondary">{link.description}</p>
											</div>
											<div className="self-center flex-shrink-0">
												<ChevronRightIcon className="w-5 h-5 text-secondary" aria-hidden="true" />
											</div>
										</Clickable>
									</li>
								))}
							</ul>
						</div> */}
					</div>
				</main>
			</div>
		</>
	);
}
