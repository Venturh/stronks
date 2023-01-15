import { PrismaClient } from '@prisma/client';
import { env } from 'process';

declare global {
	// eslint-disable-next-line no-var
	var db: PrismaClient | undefined;
}

export const db =
	global.db ||
	new PrismaClient({
		log:
			//   env.NODE_ENV === "development" ? ["query", "error", "warn"] :
			['error'],
	});

if (env.NODE_ENV !== 'production') {
	global.db = db;
}
