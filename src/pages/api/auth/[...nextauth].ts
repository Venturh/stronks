import NextAuth, { NextAuthOptions, User as NextAuthUser } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { db } from 'server/db';

import dayjs from 'dayjs';
import { Account } from '@prisma/client';

export interface NextAuthUserWithStringId extends NextAuthUser {
	id: string;
}

async function refreshAccessToken(account: Account) {
	try {
		const url =
			'https://oauth2.googleapis.com/token?' +
			new URLSearchParams({
				clientId: process.env.GOOGLE_CLIENT_ID ?? '',
				clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
				grant_type: 'refresh_token',
				refresh_token: account.refresh_token ?? '',
			});

		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
		});

		const data = await response.json();

		if (!!data.error) {
			throw new Error(data.error_description);
		}

		const expires_at = dayjs().add(data.expires_in, 'seconds').unix();
		try {
			await db.account.update({
				where: {
					id: account.id,
				},
				data: {
					access_token: data.access_token,
					expires_at,
				},
			});
		} catch (error) {
			console.log('acc', error);
		}

		return { expires_at };
	} catch (error) {
		return { expires_at: account.expires_at };
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID ?? '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
					scope:
						'openid email profile https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.location.read https://www.googleapis.com/auth/fitness.body.read https://www.googleapis.com/auth/fitness.nutrition.read https://www.googleapis.com/auth/fitness.reproductive_health.read',
				},
			},
		}),
	],
	secret: process.env.COOKIE_SECRET,

	session: {
		strategy: 'database',
		maxAge: 60 * 60,
	},

	callbacks: {
		async redirect({ baseUrl }) {
			return baseUrl;
		},
		async session({ session, user }) {
			if (session.user) {
				session.user.id = user.id;
			}

			//TODO somehow get expires_at from session
			const account = await db.account.findFirst({
				where: {
					userId: user.id,
					provider: 'google',
				},
			});

			if (account) {
				const accessTokenExpires = account.expires_at ?? 0;
				const expired = Date.now() > accessTokenExpires * 1000;
				// console.log('accessTokenExpires', expired);
				if (expired) {
					const { expires_at } = await refreshAccessToken(account);
					session.expires_at = expires_at!;
				}
			}
			return session;
		},
	},

	events: {
		createUser: async ({ user }) => {
			await db.googleFitSetting.create({
				data: { userId: user.id },
			});
			if (user.image === null) {
				await db.user.update({
					where: { id: user.id },
					data: {
						image: `https://api.multiavatar.com/${user.name ?? user.email}.png`,
					},
				});
			}
			await db.user.update({
				where: { id: user.id },
				data: {
					hiddenOverviewColumns: [],
					orderOverviewColumns: [
						'date',
						'mood',
						'phase',
						'calories',
						'weight',
						'bodyFat',
						'training',
						'notes',
					],
				},
			});
		},
	},

	debug: false,
	adapter: PrismaAdapter(db),
};

export default NextAuth(authOptions);
