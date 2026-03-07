<script>
    import PostLayout from '$lib/components/PostLayout.svelte';
</script>

<PostLayout
    title="Título do Post"
    date="March 7, 2026"
    readingTime="X min read"
    tags={['tag1', 'tag2']}
    slug="slug-do-post"
>
    <p>
        Primeiro parágrafo do post. Uma boa introdução ajuda o leitor a saber
        do que se trata.
    </p>

    <h2>Seção Principal</h2>

    <p>
        Conteúdo da seção. Você pode usar <a href="https://example.com">links</a>,
        <strong>negrito</strong> e <em>itálico</em> livremente.
    </p>

    <blockquote>
        "Citações ficam assim. Bonitas e com destaque visual."
    </blockquote>

    <h3>Sub-seção</h3>

    <p>Listas são úteis para organizar ideias:</p>

    <ul>
        <li>Primeiro item</li>
        <li>Segundo item</li>
        <li>Terceiro item</li>
    </ul>

    <p>Blocos de código para demonstrações técnicas:</p>

    <pre><code>const x = "hello world";
console.log(x);</code></pre>

    <hr>

    <p>
        <strong>Obrigado por ler!</strong> Qualquer dúvida,
        <a href="mailto:miguel@miguelsena.dev">mande um email</a>.
    </p>
</PostLayout>
