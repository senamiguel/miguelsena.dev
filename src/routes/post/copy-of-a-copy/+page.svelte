<script>
    import PostLayout from '$lib/components/PostLayout.svelte';
</script>

<PostLayout
    title="Everything's a copy of a copy of a copy."
    date="March 7, 2026"
    readingTime="3 min read"
    tags={['web', 'misc']}
    slug="copy-of-a-copy"
>
    <p>
        Nowadays, much of the web feels strangely identical.
        Websites, portfolios and blogs often follow the same fonts, the same colors, the same layouts, the same AI generated texts.
    </p>

    <p>
        Everything is optimized. Everything looks clean.
        Everything looks… the same.
    </p>

    <blockquote>
        "Everything is a copy of a copy of a copy."
    </blockquote>

    <p>
        Because of that, I wanted to build something slightly different.
        Something that reflects my personality and feels more human xd.
    </p>

    <p>
        And to be honest, I'm also using this blog to practice my English writing skills hehe.
    </p>

    <h2>Why a Blog in 2026?</h2>

    <p>
        I've always wanted a place to write about things I learn,
        things I build, and random ideas that cross my mind. (It's running 314 miles per hour)
    </p>

    <p>
        Social media is great for short thoughts, (not really lol)
        but sometimes you need more space to think.
        This blog is that space.
    </p>

    <h2>What to Expect</h2>

    <p>
        I'll write about whatever catches my attention. Mostly:
    </p>

    <ul>
        <li>Development experiments</li>
        <li>Random projects I'm building</li>
        <li>Thoughts about tech and the open web</li>
        <li>Occasional Linux nerd stuff</li>
    </ul>

    <h2>My Own Sanctuary</h2>

    <p>
        This site is intentionally simple.
    </p>

    <p>
        No dashboards. No endless frameworks stacked on top of each other and unnecessary complexity.
    </p>

    <p>
        Just code, text and ideas.
        A small chunk of the internet that belongs to me.
    </p>

    <h3>The Technical Stack</h3>

    <p>
        This site is built with <a href="https://svelte.dev">SvelteKit</a>
        and runs on Bun.
    </p>

    <p>
        No API. No database.
        Just static files, the way the web was meant to be.
    </p>

    <p>
        And I also have to thank
        <a href="https://matdoes.dev">matdoesdev</a>
        for the inspiration. ty bruv.
    </p>

    <pre><code>const post = "just a .svelte file";
const api = null;
const happiness = Infinity;</code></pre>

    <hr>

    <p>
        No analytics. No tracking.
        I probably won't know how many people read this.
        And honestly, I kind of like it that way.
    </p>

    <p>
        <strong>Thanks for reading!</strong>
        If you want to say hi, feel free to
        <a href="mailto:miguel@miguelsena.dev">send me an email</a>.
    </p>

</PostLayout>