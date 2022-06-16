import { PrismaClient } from '@prisma/client';
import { inferAsyncReturnType } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient({
	log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
export const createContext = async ({ req, res }: CreateNextContextOptions) => {
	const session = await getSession({ req });
	return {
		req,
		res,
		prisma,
		session,
		user: session?.user,
	};
};

export type Context = inferAsyncReturnType<typeof createContext>;
