import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as typeof global & {
	db?: PrismaClient;
};

export const db: PrismaClient =
	prismaGlobal.db ||
	new PrismaClient({
		// log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
	});

if (process.env.NODE_ENV !== 'production') {
	prismaGlobal.db = db;
}
