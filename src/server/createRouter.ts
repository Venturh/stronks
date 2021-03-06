import { router } from '@trpc/server';
import { Context } from 'server/context';

export function createRouter() {
	return router<Context>();
}
