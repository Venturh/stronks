import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { AppType } from 'next/app';
import { api } from 'utils/api';

import '../../public/global.css';

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
}) => {
	return (
		<SessionProvider session={session}>
			<ThemeProvider attribute="class">
				<Component {...pageProps} />
			</ThemeProvider>
		</SessionProvider>
	);
};

export default api.withTRPC(MyApp);
