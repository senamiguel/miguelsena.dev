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

    /* ── Back navigation ── */
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

    /* ── Page header ── */
    .pageHeader {
        margin-bottom: 3rem;
        border-bottom: 1px dashed #333;
        padding-bottom: 2rem;
        text-align: center;
    }

    .pageTitle {
        background: linear-gradient(0deg, #aaa, #fff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(2px 2px #333);
        font-size: 2.4rem;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 0.5rem;
    }

    .pageSubtitle {
        font-size: 0.95rem;
        color: #9aa39a;
        font-family: var(--font-geist-mono), monospace;
    }

    /* ── Form ── */
    .publishForm {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .formGroup {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .formLabel {
        font-size: 0.8rem;
        font-family: var(--font-geist-mono), monospace;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        opacity: 0.85;
    }

    .formInput,
    .formTextarea,
    .formSelect {
        background: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 0.85rem 1.1rem;
        font-size: 1rem;
        color: #fff;
        font-family: inherit;
        transition: all 0.2s;
        outline: none;
        width: 100%;
    }

    .formInput::placeholder,
    .formTextarea::placeholder {
        color: #9aa39a;
        font-style: italic;
        opacity: 0.8;
    }

    .formInput:focus,
    .formTextarea:focus,
    .formSelect:focus {
        border-color: rgba(13, 199, 249, 0.5);
        box-shadow: 0 0 12px rgba(13, 199, 249, 0.1), inset 0 0 6px rgba(13, 199, 249, 0.05);
        background: rgba(0, 0, 0, 0.55);
    }

    .formInput:hover,
    .formTextarea:hover,
    .formSelect:hover {
        border-color: rgba(255, 255, 255, 0.15);
    }

    .titleInput {
        font-size: 1.6rem;
        font-weight: 700;
        padding: 1rem 1.2rem;
        letter-spacing: -0.01em;
    }

    .formTextarea {
        min-height: 360px;
        resize: vertical;
        line-height: 1.75;
        font-family: var(--font-geist-mono), monospace;
        font-size: 0.92rem;
    }

    .formSelect {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230dc7f9' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        padding-right: 2.5rem;
    }

    .formSelect option {
        background: #0a0a0a;
        color: #e6efe6;
    }

    /* ── Tags input ── */
    .tagsContainer {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        align-items: center;
        background: rgba(0, 0, 0, 0.45);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 0.6rem 0.8rem;
        min-height: 48px;
        transition: all 0.2s;
        cursor: text;
    }

    .tagsContainer:focus-within {
        border-color: rgba(13, 199, 249, 0.5);
        box-shadow: 0 0 12px rgba(13, 199, 249, 0.1), inset 0 0 6px rgba(13, 199, 249, 0.05);
        background: rgba(0, 0, 0, 0.55);
    }

    .tag {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.2rem 0.6rem;
        border: 1px solid rgba(13, 199, 249, 0.3);
        border-radius: 3px;
        font-size: 0.78rem;
        color: var(--accent);
        font-family: var(--font-geist-mono), monospace;
        background: rgba(13, 199, 249, 0.06);
        animation: tagIn 0.2s ease-out;
    }

    @keyframes tagIn {
        from {
            opacity: 0;
            transform: scale(0.85);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .tagRemove {
        cursor: pointer;
        background: none;
        border: none;
        color: rgba(13, 199, 249, 0.5);
        font-size: 0.85rem;
        padding: 0;
        line-height: 1;
        transition: all 0.15s;
        font-family: var(--font-geist-mono), monospace;
    }

    .tagRemove:hover {
        color: #ff6b6b;
        text-shadow: 0 0 6px rgba(255, 107, 107, 0.4);
    }

    .tagInput {
        flex: 1;
        min-width: 100px;
        background: none;
        border: none;
        outline: none;
        color: #fff;
        font-size: 0.88rem;
        font-family: var(--font-geist-mono), monospace;
        padding: 0.25rem 0;
    }

    .tagInput::placeholder {
        color: #9aa39a;
        font-style: italic;
        opacity: 0.8;
    }

    .tagHint {
        font-size: 0.72rem;
        color: #666;
        font-family: var(--font-geist-mono), monospace;
        margin-top: -0.2rem;
    }

    /* ── Row groups ── */
    .formRow {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
    }



    /* ── Separator ── */
    .separator {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin: 1.5rem 0;
        opacity: 0.6;
    }

    .separatorLine {
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, #333, transparent);
    }

    .separatorDots {
        font-family: var(--font-geist-mono), monospace;
        font-size: 0.8rem;
        color: #555;
        letter-spacing: 0.5rem;
    }

    /* ── Preview toggle ── */
    .previewToggle {
        display: flex;
        gap: 0;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        overflow: hidden;
        width: fit-content;
    }

    .toggleBtn {
        padding: 0.55rem 1.4rem;
        font-size: 0.8rem;
        font-family: var(--font-geist-mono), monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        background: transparent;
        border: none;
        color: #666;
        cursor: pointer;
        transition: all 0.2s;
    }

    .toggleBtn:hover {
        color: #999;
        background: rgba(255, 255, 255, 0.03);
    }

    .toggleBtn.active {
        background: rgba(13, 199, 249, 0.1);
        color: var(--accent);
        text-shadow: 0 0 6px rgba(13, 199, 249, 0.3);
    }

    /* ── Preview ── */
    .previewPane {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 6px;
        padding: 2rem 2rem;
        min-height: 360px;
        line-height: 1.8;
        color: #cfe6df;
        font-size: 1.05rem;
    }

    .previewPane :global(h1) {
        background: linear-gradient(0deg, #aaa, #fff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .previewPane :global(h2) {
        font-family: var(--font-dm-serif), serif;
        font-size: 1.6rem;
        font-weight: normal;
        color: #f8fff8;
        margin: 2rem 0 1rem 0;
        text-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
    }

    .previewPane :global(h3) {
        font-family: var(--font-dm-serif), serif;
        font-size: 1.3rem;
        font-weight: normal;
        color: #e8f5e8;
        margin: 1.5rem 0 0.8rem 0;
    }

    .previewPane :global(p) {
        margin-bottom: 1.4rem;
    }

    .previewPane :global(a) {
        color: var(--accent);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.18s;
    }

    .previewPane :global(a:hover) {
        text-shadow: 0 0 8px rgba(13, 199, 249, 0.9);
        border-bottom-color: var(--accent);
    }

    .previewPane :global(blockquote) {
        border-left: 3px solid rgba(13, 199, 249, 0.4);
        margin: 1.5rem 0;
        padding: 0.8rem 1.2rem;
        background: rgba(13, 199, 249, 0.04);
        color: #b0d0c8;
        font-style: italic;
        border-radius: 0 4px 4px 0;
    }

    .previewPane :global(code) {
        font-family: var(--font-geist-mono), 'Courier New', monospace;
        background: rgba(255, 255, 255, 0.06);
        padding: 0.15rem 0.4rem;
        border-radius: 3px;
        font-size: 0.9em;
        color: #e0ffe0;
        border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .previewPane :global(pre) {
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 1.2rem 1.4rem;
        overflow-x: auto;
        margin: 1.5rem 0;
        font-size: 0.88rem;
        line-height: 1.6;
    }

    .previewPane :global(pre code) {
        background: none;
        padding: 0;
        border: none;
        font-size: inherit;
    }

    .previewPane :global(ul),
    .previewPane :global(ol) {
        margin: 1rem 0 1.4rem 1.5rem;
    }

    .previewPane :global(li) {
        margin-bottom: 0.5rem;
    }

    .previewPane :global(hr) {
        border: none;
        border-top: 1px dashed #333;
        margin: 2rem 0;
    }

    .previewPane :global(strong) {
        color: #f0fff0;
        font-weight: 600;
    }

    .previewPane :global(em) {
        color: #b8dccc;
    }

    .previewPlaceholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 200px;
        opacity: 0.35;
        gap: 0.8rem;
    }

    .previewPlaceholder span:first-child {
        font-size: 2.5rem;
    }

    .previewPlaceholder span:last-child {
        font-family: var(--font-geist-mono), monospace;
        font-size: 0.85rem;
        color: #666;
    }

    /* ── Actions bar ── */
    .actionsBar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding-top: 1.5rem;
        border-top: 1px dashed #333;
    }

    .actionsLeft {
        display: flex;
        gap: 0.8rem;
        align-items: center;
    }

    .btnPublish {
        padding: 0.75rem 2rem;
        background: linear-gradient(180deg, rgba(13, 199, 249, 0.2), rgba(13, 199, 249, 0.08));
        border: 1px solid rgba(13, 199, 249, 0.4);
        border-radius: 6px;
        color: var(--accent);
        font-size: 0.88rem;
        font-family: var(--font-geist-mono), monospace;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        cursor: pointer;
        transition: all 0.22s;
        position: relative;
        overflow: hidden;
    }

    .btnPublish::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(13, 199, 249, 0.08) 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.22s;
    }

    .btnPublish:hover {
        border-color: var(--accent);
        box-shadow: 0 0 18px rgba(13, 199, 249, 0.2), 0 0 6px rgba(13, 199, 249, 0.1);
        text-shadow: 0 0 8px rgba(13, 199, 249, 0.9);
        transform: translateY(-1px);
    }

    .btnPublish:hover::before {
        opacity: 1;
    }

    .btnPublish:active {
        transform: translateY(0);
    }

    .btnDraft {
        padding: 0.75rem 1.6rem;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        color: #9aa39a;
        font-size: 0.85rem;
        font-family: var(--font-geist-mono), monospace;
        letter-spacing: 0.04em;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btnDraft:hover {
        border-color: rgba(255, 255, 255, 0.2);
        color: #ccc;
        background: rgba(255, 255, 255, 0.03);
    }

    .charCount {
        font-size: 0.75rem;
        font-family: var(--font-geist-mono), monospace;
        color: #555;
    }

    /* ── Footer ── */
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

    /* ── Status indicator ── */
    .statusBar {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.75rem;
        font-family: var(--font-geist-mono), monospace;
        color: #555;
        padding: 0.5rem 0;
    }

    .statusDot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #333;
        transition: background 0.3s;
    }

    .statusDot.editing {
        background: #f0c040;
        box-shadow: 0 0 6px rgba(240, 192, 64, 0.4);
    }

    .statusDot.ready {
        background: #4caf50;
        box-shadow: 0 0 6px rgba(76, 175, 80, 0.4);
    }

    @media (max-width: 600px) {
        .pageTitle {
            font-size: 1.8rem;
        }

        main {
            padding: 1.5rem 1rem;
        }

        .formRow {
            grid-template-columns: 1fr;
        }

        .actionsBar {
            flex-direction: column;
            align-items: stretch;
        }

        .actionsLeft {
            justify-content: center;
        }

        .charCount {
            text-align: center;
        }

        .previewToggle {
            width: 100%;
        }

        .toggleBtn {
            flex: 1;
        }
    }
</style>

<script>
    import { sky, sparkles } from '$lib';

    let title = $state('');
    let content = $state('');
    let excerpt = $state('');
    let category = $state('blog');
    let tags = $state([]);
    let tagInput = $state('');

    let activeTab = $state('write');

    // Derived states
    let wordCount = $derived(content.trim() ? content.trim().split(/\s+/).length : 0);
    let readingTime = $derived(Math.max(1, Math.ceil(wordCount / 200)));
    let isReady = $derived(title.trim().length > 0 && content.trim().length > 0);
    let statusText = $derived(
        !title.trim() && !content.trim()
            ? 'empty'
            : isReady
              ? 'ready to publish'
              : 'editing...'
    );
    let statusClass = $derived(
        isReady ? 'ready' : title.trim() || content.trim() ? 'editing' : ''
    );

    function addTag(e) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const value = tagInput.trim().replace(/,/g, '').toLowerCase();
            if (value && !tags.includes(value) && tags.length < 8) {
                tags = [...tags, value];
                tagInput = '';
            }
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            tags = tags.slice(0, -1);
        }
    }

    function removeTag(index) {
        tags = tags.filter((_, i) => i !== index);
    }



    /** Basic Markdown → HTML (titles, bold, italic, code, links, lists, blockquotes, hr) */
    function markdownToHtml(md) {
        if (!md) return '';
        let html = md
            // code blocks
            .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
            // inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // headings
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            // bold & italic
            .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            // blockquotes
            .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
            // horizontal rule
            .replace(/^---$/gm, '<hr>')
            // unordered lists
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            // paragraphs
            .replace(/\n\n/g, '</p><p>')
            // line breaks
            .replace(/\n/g, '<br>');

        // wrap in paragraph
        html = '<p>' + html + '</p>';

        // clean up list items → wrap in ul
        html = html.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');
        // merge consecutive uls
        html = html.replace(/<\/ul>\s*<ul>/g, '');
        // clean empty paragraphs
        html = html.replace(/<p>\s*<\/p>/g, '');
        // clean paragraphs wrapping block elements
        html = html.replace(/<p>\s*(<h[1-3]>)/g, '$1');
        html = html.replace(/(<\/h[1-3]>)\s*<\/p>/g, '$1');
        html = html.replace(/<p>\s*(<blockquote>)/g, '$1');
        html = html.replace(/(<\/blockquote>)\s*<\/p>/g, '$1');
        html = html.replace(/<p>\s*(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)\s*<\/p>/g, '$1');
        html = html.replace(/<p>\s*(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');
        html = html.replace(/<p>\s*(<hr>)/g, '$1');
        html = html.replace(/(<hr>)\s*<\/p>/g, '$1');

        return html;
    }

    function handlePublish() {
        if (!isReady) return;
        // In a real app, this would send to an API
        const postData = {
            title: title.trim(),
            content: content.trim(),
            excerpt: excerpt.trim(),
            category,
            tags,

            createdAt: new Date().toISOString()
        };
        console.log('Publishing post:', postData);
        alert('Post published successfully! (demo)');
    }

    function handleSaveDraft() {
        const draftData = {
            title: title.trim(),
            content: content.trim(),
            excerpt: excerpt.trim(),
            category,
            tags,
            savedAt: new Date().toISOString()
        };
        console.log('Draft saved:', draftData);
        alert('Draft saved! (demo)');
    }
</script>

<svelte:head>
    <title>New Post — Miguel Sena</title>
    <meta name="description" content="Create a new blog post on Miguel Sena's site." />
</svelte:head>

<div class="min-h-100">
    <div class="backgroundImage" style:--bg-img="url('{sky}')"></div>
    <div class="glow"></div>

    <main class="font-legible">
        <!-- Back navigation -->
        <nav class="backNav">
            <a href="/" class="backLink">
                <span class="backArrow">←</span>
                <span>back to home</span>
            </a>
        </nav>

        <!-- Page header -->
        <header class="pageHeader">
            <h1 class="pageTitle font-comic">Create Post</h1>
            <p class="pageSubtitle">write something for the world</p>
        </header>

        <!-- Status bar -->
        <div class="statusBar">
            <span class="statusDot {statusClass}"></span>
            <span>{statusText}</span>
            {#if wordCount > 0}
                <span>·</span>
                <span>{wordCount} words</span>
                <span>·</span>
                <span>~{readingTime} min read</span>
            {/if}
        </div>

        <!-- Preview toggle -->
        <div style="margin-bottom: 1.5rem;">
            <div class="previewToggle">
                <button
                    class="toggleBtn"
                    class:active={activeTab === 'write'}
                    onclick={() => (activeTab = 'write')}
                >
                    ✎ Write
                </button>
                <button
                    class="toggleBtn"
                    class:active={activeTab === 'preview'}
                    onclick={() => (activeTab = 'preview')}
                >
                    ⎙ Preview
                </button>
            </div>
        </div>

        {#if activeTab === 'write'}
            <!-- Write mode -->
            <div class="publishForm">
                <!-- Title -->
                <div class="formGroup">
                    <label for="post-title" class="formLabel">Title</label>
                    <input
                        id="post-title"
                        type="text"
                        class="formInput titleInput"
                        placeholder="An interesting title..."
                        bind:value={title}
                    />
                </div>


                <!-- Excerpt -->
                <div class="formGroup">
                    <label for="post-excerpt" class="formLabel">Excerpt</label>
                    <input
                        id="post-excerpt"
                        type="text"
                        class="formInput"
                        placeholder="A short summary for the post listing..."
                        bind:value={excerpt}
                    />
                </div>

                <!-- Category & Tags row -->
                <div class="formRow">
                    <div class="formGroup">
                        <label for="post-category" class="formLabel">Category</label>
                        <select id="post-category" class="formSelect" bind:value={category}>
                            <option value="blog">Blog</option>
                            <option value="tutorial">Tutorial</option>
                            <option value="project">Project</option>
                            <option value="thoughts">Thoughts</option>
                            <option value="misc">Misc</option>
                        </select>
                    </div>

                    <div class="formGroup">
                        <label class="formLabel" for="tag-input">Tags</label>
                        <div class="tagsContainer">
                            {#each tags as tag, i}
                                <span class="tag">
                                    #{tag}
                                    <button
                                        class="tagRemove"
                                        onclick={() => removeTag(i)}
                                        aria-label="Remove tag {tag}"
                                    >×</button>
                                </span>
                            {/each}
                            <input
                                id="tag-input"
                                type="text"
                                class="tagInput"
                                placeholder={tags.length === 0 ? 'type & press enter...' : ''}
                                bind:value={tagInput}
                                onkeydown={addTag}
                            />
                        </div>
                        <span class="tagHint">press enter or comma to add · {8 - tags.length} remaining</span>
                    </div>
                </div>

                <div class="separator">
                    <div class="separatorLine"></div>
                    <img src="{sparkles}" alt="" width="48" height="18" style="opacity: 0.7;">
                    <div class="separatorLine"></div>
                </div>

                <!-- Content -->
                <div class="formGroup">
                    <label for="post-content" class="formLabel">Content (Markdown)</label>
                    <textarea
                        id="post-content"
                        class="formTextarea"
                        placeholder="# Your post starts here...&#10;&#10;Write in **Markdown**. Use headings, lists, code blocks, and more.&#10;&#10;## Example Section&#10;&#10;- Item one&#10;- Item two&#10;&#10;> A nice blockquote"
                        bind:value={content}
                    ></textarea>
                </div>

                <!-- Actions -->
                <div class="actionsBar">
                    <div class="actionsLeft">
                        <button class="btnPublish" onclick={handlePublish} disabled={!isReady}>
                            ↑ Publish
                        </button>
                        <button class="btnDraft" onclick={handleSaveDraft}>
                            Save Draft
                        </button>
                    </div>
                    <span class="charCount">{content.length} characters</span>
                </div>
            </div>
        {:else}
            <!-- Preview mode -->
            <div class="previewPane">
                {#if title || content}
                    {#if title}
                        <h1>{title}</h1>
                    {/if}
                    {#if tags.length > 0}
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem;">
                            {#each tags as tag}
                                <span class="tag">#{tag}</span>
                            {/each}
                        </div>
                    {/if}
                    {#if content}
                        {@html markdownToHtml(content)}
                    {/if}
                {:else}
                    <div class="previewPlaceholder">
                        <span>📝</span>
                        <span>Start writing to see a preview</span>
                    </div>
                {/if}
            </div>

            <!-- Actions (also in preview) -->
            <div class="actionsBar" style="margin-top: 2rem;">
                <div class="actionsLeft">
                    <button class="btnPublish" onclick={handlePublish} disabled={!isReady}>
                        ↑ Publish
                    </button>
                    <button class="btnDraft" onclick={handleSaveDraft}>
                        Save Draft
                    </button>
                </div>
                <span class="charCount">{content.length} characters · {wordCount} words</span>
            </div>
        {/if}

        <!-- Footer -->
        <footer class="footer">
            <p>
                This site is <a href="/" class="link">open source</a>.
                <br />
                © 2026 Miguel Sena. copyleft.
            </p>
        </footer>
    </main>
</div>
