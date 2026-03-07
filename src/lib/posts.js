export const posts = [
    {
        title: 'Everything\'s a copy of a copy of a copy.',
        slug: 'copy-of-a-copy',
        date: 'March 7, 2026',
        excerpt: 'Nowadays, much of the web feels strangely identical. Websites, portfolios and blogs often follow the same fonts, the same colors, the same layouts, the same AI generated texts.',
        tags: ['web', 'misc'],
        readingTime: '3 min read',
    },
];

export function getPostBySlug(slug) {
    return posts.find(p => p.slug === slug) || null;
}

export function getAdjacentPosts(slug) {
    const index = posts.findIndex(p => p.slug === slug);
    return {
        prev: index < posts.length - 1 ? posts[index + 1] : null,
        next: index > 0 ? posts[index - 1] : null,
    };
}
