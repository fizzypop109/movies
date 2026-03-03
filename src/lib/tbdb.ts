const BASE_URL = 'https://api.themoviedb.org/3';

export async function tmdbFetch(endpoint: string, params?: Record<string, string>) {
    const url = new URL(`${BASE_URL}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    }

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
    };

    const res = await fetch(url.toString(), options);
    return res.json();
}