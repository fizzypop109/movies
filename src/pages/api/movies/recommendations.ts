import type { NextApiRequest, NextApiResponse } from 'next';
import { tmdbFetch } from '@/lib';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { ids } = req.query;

    if (!ids || typeof ids !== 'string') {
        return res.status(400).json({ error: 'Movie IDs are required' });
    }

    const movieIds = ids.split(',').slice(0, 5); // Limit to 5 to avoid too many requests

    try {
        const allRecs = await Promise.all(
            movieIds.map((id) => tmdbFetch(`/movie/${id}/recommendations`))
        );

        // Flatten, deduplicate, and remove movies already in the watchlist
        const seen = new Set<number>(movieIds.map(Number));
        const unique: any[] = [];

        for (const rec of allRecs) {
            for (const movie of rec.results || []) {
                if (!seen.has(movie.id)) {
                    seen.add(movie.id);
                    unique.push(movie);
                }
            }
        }

        // Sort by vote average and return top 20
        const sorted = unique
            .sort((a, b) => b.vote_average - a.vote_average)
            .slice(0, 20);

        res.status(200).json({ results: sorted });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
}