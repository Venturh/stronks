import { Prisma } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { db } from 'lib/prisma';
import { createRouter } from 'server/createRouter';
import { postInputSchema } from 'pages/posts/create';

const defaultPostSelect = Prisma.validator<Prisma.PostSelect>()({
	id: true,
	title: true,
	text: true,
	createdAt: true,
	updatedAt: true,
});

export const postRouter = createRouter()
	// create
	.mutation('add', {
		input: postInputSchema,
		async resolve({ input }) {
			const post = await db.post.create({
				data: input,
				select: defaultPostSelect,
			});
			return post;
		},
	})
	// read
	.query('all', {
		async resolve() {
			/**
			 * For pagination you can have a look at this docs site
			 * @link https://trpc.io/docs/useInfiniteQuery
			 */

			return db.post.findMany({
				select: defaultPostSelect,
			});
		},
	})
	.query('byId', {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ input }) {
			const { id } = input;
			const post = await db.post.findUnique({
				where: { id },
				select: defaultPostSelect,
			});
			if (!post) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: `No post with id '${id}'`,
				});
			}
			return post;
		},
	})
	// update
	.mutation('edit', {
		input: z.object({
			id: z.string().uuid(),
			data: z.object({
				title: z.string().min(1).max(32).optional(),
				text: z.string().min(1).optional(),
			}),
		}),
		async resolve({ input }) {
			const { id, data } = input;
			const post = await db.post.update({
				where: { id },
				data,
				select: defaultPostSelect,
			});
			return post;
		},
	})
	// delete
	.mutation('delete', {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ input }) {
			const { id } = input;
			await db.post.delete({ where: { id } });
			return {
				id,
			};
		},
	});
