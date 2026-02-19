export const prerender = false;

/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        // Usa variável de ambiente do Docker/Production se existir, caso não usa localhost pra DEV
        const API_URL = process.env.PUBLIC_API_URL || 'http://127.0.0.1:3000';

        const res = await fetch(`${API_URL}/api/posts`, {
            signal: AbortSignal.timeout(3000)
        });

        if (res.ok) {
            const posts = await res.json();
            return {
                posts
            };
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
    }

    return {
        posts: []
    };
}
