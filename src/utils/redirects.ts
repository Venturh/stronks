import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getSession, getCsrfToken } from 'next-auth/react';

export async function unauthenticatedRoute(ctx: GetServerSidePropsContext, redirect = '/') {
	const session = await getSession(ctx);
	const csrfToken = await getCsrfToken(ctx);

	if (session) {
		return {
			redirect: {
				destination: redirect,
				permanent: false,
			},
		};
	}

	return {
		props: { session, csrfToken },
	};
}

export async function authenticatedRoute(
	ctx: GetServerSidePropsContext,
	key?: string,
	queries?: string[],
	redirect = '/auth/login'
): Promise<GetServerSidePropsResult<{ session: any }>> {
	const session = await getSession(ctx);

	if (key) {
		const query = ctx.query[key];
		if (queries && queries.length > 0 && !queries?.includes(query as string)) {
			return {
				notFound: true,
			};
		}
	}

	if (!session) {
		return {
			redirect: {
				destination: redirect,
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
}
