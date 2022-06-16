import { User } from '@prisma/client';
import 'next-auth';

export interface SessionUser {
	id: string;
	name: string | null;
	email: string | null;
	image: string | null;
}

declare module 'next-auth' {
	interface Session {
		id: string;
		user?: User;
		expires_at: number;
	}
}
