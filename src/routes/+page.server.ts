/** @type {import('./$types').PageServerLoad} */
export async function load({ fetch }) {
    try {
        const API_URL = process.env.PUBLIC_API_URL || 'http://127.0.0.1:3000';

        const res = await fetch(`${API_URL}/api/posts`);

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
