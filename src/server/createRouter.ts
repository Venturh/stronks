import { Context } from './context';
import { router } from '@trpc/server';

/**
 * Helper function to create a router with context
 */
export function createRouter() {
	return router<Context>();
}
