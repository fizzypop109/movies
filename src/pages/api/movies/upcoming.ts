// pages/api/movies/upcoming.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { tmdbFetch } from '@/lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = await tmdbFetch('/movie/upcoming');
    res.status(200).json(data);
}