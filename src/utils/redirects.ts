import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getSession, getCsrfToken, signIn } from 'next-auth/react';

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
	redirect = '/auth/login'
): Promise<GetServerSidePropsResult<{ session: any }>> {
	const session = await getSession(ctx);

	// if (session?.error === 'RefreshAccessTokenError') {
	// 	console.log('session error', session?.error);
	// 	signIn();
	// }

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
