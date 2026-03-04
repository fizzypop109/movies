// pages/api/movies/[id]/videos.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { tmdbFetch } from '@/lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ error: 'Movie ID is required' });
    }

    const data = await tmdbFetch(`/movie/${id}/videos`);

    // Filter to YouTube trailers only, prioritize official trailers
    const trailers = (data.results || [])
        .filter((v: any) => v.site === "YouTube" && (v.type === "Videos" || v.type === "Teaser"))
        .sort((a: any, b: any) => (b.official ? 1 : 0) - (a.official ? 1 : 0));

    res.status(200).json({ results: trailers });
}