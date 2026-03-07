<style>
    .backgroundImage {
        background-image: var(--bg-img);
        background-size: cover;
        background-repeat: repeat;
        position: fixed;
        width: 100vw;
        height: 100%;
        opacity: 15%;
        user-select: none;
        pointer-events: none;
    }

    .glow {
        position: fixed;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 73vw;
        height: 73vh;
        background: radial-gradient(circle, rgba(13, 199, 249, 0.08) 0%, rgba(0, 0, 0, 0) 44%);
        pointer-events: none;
        z-index: 0;
    }

    main {
        margin: 0 auto;
        max-width: 780px;
        padding: 2rem 2rem 1rem 2rem;
        position: relative;
        z-index: 10;
    }


    .backNav {
        margin-bottom: 2.5rem;
    }

    .backLink {
        color: var(--accent);
        text-decoration: none;
        font-size: 0.95rem;
        font-family: var(--font-geist-mono), monospace;
        transition: all 0.18s;
        position: relative;
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        opacity: 0.75;
    }

    .backLink:hover {
        opacity: 1;
        text-shadow: 0 0 8px rgba(13, 199, 249, 0.9);
    }

    .backArrow {
        transition: transform 0.18s;
    }

    .backLink:hover .backArrow {
        transform: translateX(-3px);
    }


    .articleHeader {
        margin-bottom: 3rem;
        border-bottom: 1px dashed #333;
        padding-bottom: 2rem;
    }

    .articleTitle {
        background: linear-gradient(0deg, #aaa, #fff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(2px 2px #333);
        font-size: 2.4rem;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 1rem;
    }

    .articleMeta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 1rem;
        font-size: 0.9rem;
        color: #9aa39a;
        font-family: var(--font-geist-mono), monospace;
    }

    .metaDivider {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #555;
    }

    .tag {
        display: inline-block;
        padding: 0.15rem 0.55rem;
        border: 1px solid rgba(13, 199, 249, 0.3);
        border-radius: 3px;
        font-size: 0.75rem;
        color: var(--accent);
        font-family: var(--font-geist-mono), monospace;
        background: rgba(13, 199, 249, 0.06);
        transition: all 0.18s;
    }

    .tag:hover {
        border-color: var(--accent);
        background: rgba(13, 199, 249, 0.12);
        text-shadow: 0 0 6px rgba(13, 199, 249, 0.4);
    }

    .tagsRow {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.3rem;
    }


    .articleBody {
        line-height: 1.8;
        color: #cfe6df;
        font-size: 1.05rem;
    }

    .articleBody :global(h2) {
        font-family: var(--font-dm-serif), serif;
        font-size: 1.6rem;
        font-weight: normal;
        color: #f8fff8;
        margin: 2.5rem 0 1rem 0;
        text-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
    }

    .articleBody :global(h3) {
        font-family: var(--font-dm-serif), serif;
        font-size: 1.3rem;
        font-weight: normal;
        color: #e8f5e8;
        margin: 2rem 0 0.8rem 0;
    }

    .articleBody :global(p) {
        margin-bottom: 1.4rem;
    }

    .articleBody :global(a) {
        color: var(--accent);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.18s;
    }

    .articleBody :global(a:hover) {
        text-shadow: 0 0 8px rgba(13, 199, 249, 0.9);
        border-bottom-color: var(--accent);
    }

    .articleBody :global(blockquote) {
        border-left: 3px solid rgba(13, 199, 249, 0.4);
        margin: 1.5rem 0;
        padding: 0.8rem 1.2rem;
        background: rgba(13, 199, 249, 0.04);
        color: #b0d0c8;
        font-style: italic;
        border-radius: 0 4px 4px 0;
    }

    .articleBody :global(code) {
        font-family: var(--font-geist-mono), 'Courier New', monospace;
        background: rgba(255, 255, 255, 0.06);
        padding: 0.15rem 0.4rem;
        border-radius: 3px;
        font-size: 0.9em;
        color: #e0ffe0;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .articleBody :global(pre) {
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 1.2rem 1.4rem;
        overflow-x: auto;
        margin: 1.5rem 0;
        font-size: 0.88rem;
        line-height: 1.6;
    }

    .articleBody :global(pre code) {
        background: none;
        padding: 0;
        border: none;
        font-size: inherit;
    }

    .articleBody :global(ul),
    .articleBody :global(ol) {
        margin: 1rem 0 1.4rem 1.5rem;
    }

    .articleBody :global(li) {
        margin-bottom: 0.5rem;
    }

    .articleBody :global(hr) {
        border: none;
        border-top: 1px dashed #333;
        margin: 2.5rem 0;
    }

    .articleBody :global(img) {
        max-width: 100%;
        border-radius: 6px;
        margin: 1.5rem 0;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .articleBody :global(strong) {
        color: #f0fff0;
        font-weight: 600;
    }

    .articleBody :global(em) {
        color: #b8dccc;
    }


    .separator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin: 3rem 0 2rem 0;
        opacity: 0.6;
    }

    .separatorLine {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, #333, transparent);
    }


    .postNav {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px dashed #333;
    }

    .navCard {
        padding: 1.2rem;
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.22);
        text-decoration: none;
        transition: all 0.2s;
    }

    .navCard:hover {
        border-color: rgba(13, 199, 249, 0.3);
        background: rgba(13, 199, 249, 0.04);
    }

    .navCardLabel {
        font-size: 0.75rem;
        font-family: var(--font-geist-mono), monospace;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.4rem;
    }

    .navCardTitle {
        color: var(--accent);
        font-size: 0.95rem;
        line-height: 1.3;
        transition: all 0.18s;
    }

    .navCard:hover .navCardTitle {
        text-shadow: 0 0 8px rgba(13, 199, 249, 0.9);
    }

    .navCardNext {
        text-align: right;
    }

    @media (max-width: 600px) {
        .postNav {
            grid-template-columns: 1fr;
        }

        .navCardNext {
            text-align: left;
        }

        .articleTitle {
            font-size: 1.8rem;
        }

        main {
            padding: 1.5rem 1rem;
        }
    }


    .footer {
        text-align: center;
        margin-top: 4rem;
        padding-bottom: 2rem;
        opacity: 0.5;
        font-size: 0.8rem;
    }

    .link {
        color: var(--accent);
        text-decoration: none;
        transition: all 0.18s;
        position: relative;
        border-bottom: 1px solid transparent;
    }

    .link:hover {
        text-shadow: 0 0 8px rgba(13, 199, 249, 0.9);
        border-bottom-color: var(--accent);
    }
</style>

<script>
    import { sky, sparkles } from '$lib';
    import { getAdjacentPosts } from '$lib/posts.js';


    let { title, date, readingTime, tags, slug, children } = $props();

    const { prev, next } = getAdjacentPosts(slug);
</script>

<svelte:head>
    <title>{title} — Miguel Sena</title>
    <meta name="description" content="A blog post by Miguel Sena: {title}" />
</svelte:head>

<div class="min-h-100">
    <div class="backgroundImage" style:--bg-img="url('{sky}')"></div>
    <div class="glow"></div>

    <main class="font-legible">

        <nav class="backNav">
            <a href="/#blog" class="backLink">
                <span class="backArrow">←</span>
                <span>back to home</span>
            </a>
        </nav>


        <header class="articleHeader">
            <h1 class="articleTitle font-comic">{title}</h1>

            <div class="articleMeta">
                <time>{date}</time>
                <span class="metaDivider"></span>
                <span>{readingTime}</span>
            </div>

            <div class="tagsRow" style="margin-top: 0.8rem;">
                {#each tags as tag}
                    <span class="tag">#{tag}</span>
                {/each}
            </div>
        </header>


        <article class="articleBody">
            {@render children()}
        </article>


        <div class="separator">
            <div class="separatorLine"></div>
            <img src="{sparkles}" alt="" width="48" height="18" style="opacity: 0.7;">
            <div class="separatorLine"></div>
        </div>


        <nav class="postNav">
            {#if prev}
                <a href="/post/{prev.slug}" class="navCard">
                    <div class="navCardLabel">← Previous</div>
                    <div class="navCardTitle">{prev.title}</div>
                </a>
            {:else}
                <div></div>
            {/if}

            {#if next}
                <a href="/post/{next.slug}" class="navCard navCardNext">
                    <div class="navCardLabel">Next →</div>
                    <div class="navCardTitle">{next.title}</div>
                </a>
            {:else}
                <div></div>
            {/if}
        </nav>


        <footer class="footer">
            <p>
                This site is <a href="/" class="link">open source</a>.
                <br />
                © 2026 Miguel Sena. copyleft.
            </p>
        </footer>
    </main>
</div>
