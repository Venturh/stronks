import { httpBatchLink } from '@trpc/client/links/httpBatchLink';
import { loggerLink } from '@trpc/client/links/loggerLink';
import { withTRPC } from '@trpc/next';
import { NextPage, NextPageContext } from 'next';
import { getSession, SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { AppContext, AppProps } from 'next/app';
import type { AppRouter } from 'server/routers/_app';
import superjson from 'superjson';

import '../../public/global.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
	return (
		<SessionProvider session={pageProps.session}>
			<ThemeProvider attribute="class">
				<Component {...pageProps} />
			</ThemeProvider>
		</SessionProvider>
	);
};

MyApp.getInitialProps = async ({ ctx }: AppContext) => {
	return {
		pageProps: {
			session: await getSession(ctx),
		},
	};
};

function getBaseUrl() {
	if (typeof window !== 'undefined') {
		return '';
	}
	// reference for vercel.com
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	// // reference for render.com
	if (process.env.RENDER_INTERNAL_HOSTNAME) {
		return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
	}

	// assume localhost
	return `http://localhost:${process.env.PORT ?? 1337}`;
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */

		return {
			url: `${getBaseUrl()}/api/trpc`,
			/**
			 * @link https://trpc.io/docs/links
			 */
			links: [
				// adds pretty logs to your console in development and logs errors in production
				loggerLink({
					enabled: (opts) =>
						(process.env.NODE_ENV === 'development' && typeof window !== 'undefined') ||
						(opts.direction === 'down' && opts.result instanceof Error),
				}),
				httpBatchLink({
					url: `${getBaseUrl()}/api/trpc`,
				}),
			],
			/**
			 * @link https://trpc.io/docs/data-transformers
			 */
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
			headers: () => {
				if (ctx?.req) {
					// on ssr, forward client's headers to the server
					return {
						...ctx.req.headers,
						'x-ssr': '1',
					};
				}
				return {};
			},
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: true,
})(MyApp);
