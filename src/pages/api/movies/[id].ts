// pages/api/movies/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { tmdbFetch } from '@/lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Movie ID is required' });
    }

    const data = await tmdbFetch(`/movie/${id}`);
    res.status(200).json(data);
}