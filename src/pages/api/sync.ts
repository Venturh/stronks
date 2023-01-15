import { db } from 'server/db';
import type { NextApiRequest, NextApiResponse } from 'next';
import { syncData } from 'server/api/routers/fit/router';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		// if (ACTION_KEY === APP_KEY) {
		const users = await db.user.findMany();
		for (const user of users) {
			await syncData(user);
		}
		res.status(200).json({ success: 'true' });
		// } else {
		// 	res.status(401);
		// }
	} catch (err) {
		res.status(500);
	}
}
