import type { NextApiRequest, NextApiResponse } from 'next';
import { tmdbFetch } from '@/lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query is required' });
    }

    const data = await tmdbFetch('/search/movie', { query: query as string });
    res.status(200).json(data);
}