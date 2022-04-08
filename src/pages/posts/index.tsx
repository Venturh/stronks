import { trpc } from 'utils/trpc';
import Link from 'next/link';
import AppLayout from 'components/layouts/AppLayout';

import Button from 'components/ui/Button';
import { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { authenticatedRoute } from 'utils/redirects';

export default function Posts() {
	const postsQuery = trpc.useQuery(['post.all']);

	// const utils = trpc.useContext();

	// prefetch all posts for instant navigation
	// useEffect(() => {
	// 	for (const { id } of postsQuery.data ?? []) {
	// 		utils.prefetchQuery(['post.byId', { id }]);
	// 	}
	// }, [postsQuery.data, utils]);

	return (
		<AppLayout title="Posts">
			<div className="divide-y-2 divide-accent-primary ">
				<div className="flex justify-between items-center">
					<div>
						<h2 className="text-3xl tracking-tight font-extrabold text-primary sm:text-4xl">
							Post
						</h2>
						<p className="text-xl text-secondary">All Posts</p>
					</div>
					<Button href="/posts/create">Create Post</Button>
				</div>
				<div className="mt-6 pt-6 grid gap-16 lg:grid-cols-2 lg:gap-x-5 lg:gap-y-12">
					{postsQuery.data?.map((post) => (
						<div key={post.id}>
							<p className="text-sm text-secondary">
								<span>{post.createdAt.toLocaleDateString()}</span>
							</p>
							<Link href={`/posts/${post.id}`}>
								<a className="mt-2 block">
									<p className="text-xl font-semibold text-primary">{post.title}</p>
									<p className="mt-3 text-base text-secondary">{post.text}</p>
								</a>
							</Link>
						</div>
					))}
				</div>
			</div>
		</AppLayout>
	);
}

export const getServerSideProps: GetServerSideProps = authenticatedRoute;
