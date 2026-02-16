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

    main {
        margin: 0 auto;
        max-width: 1200px;
        padding: 1rem 2rem 1rem 2rem;
        position: relative;
        z-index: 10;
    }

    .headerContainer {
        text-align: center;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .headerTitle {
        background: linear-gradient(0deg, #aaa, #fff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(2px 2px #333);
        text-align: center;
        font-size: 32px;
        font-weight: 700;
        margin: 0;
    }

    .sparkle {
        width: 100px;
        height: auto;
        opacity: 0.9;
        display: block;
    }

    @keyframes twinkle {
        0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
    }

    .intro {
        font-size: 1.05rem;
        line-height: 1.6;
        margin-bottom: 4rem;
        max-width: 700px;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
        color: #cfe6df;
        font-family: inherit;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;
        margin-bottom: 5rem;
        overflow: visible;
    }

    @media (max-width: 768px) {
        .grid {
            grid-template-columns: 1fr;
            text-align: center;
        }
    }

    .columnTitle {
        font-family: var(--font-dm-serif), serif;
        font-size: 1.8rem;
        font-weight: normal;
        margin-bottom: 1.5rem;
        color: #f8fff8;
        text-align: center;
        text-shadow: 0 0 6px rgba(0, 0, 0, 0.6);
    }

    .list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .listItem {
        margin-bottom: 0.8rem;
        font-size: 1rem;
        display: flex;
        justify-content: flex-start;
    }

    .contactText {
        flex: 1 1 auto;
        min-width: 0;
    }

    .contactText p {
        margin: 0 0 0.35rem 0;
        line-height: 1.4;
        color: #cfe6df;
    }

    .contactText .link {
        display: inline-block;
        margin-top: 0.35rem;
    }

    @media (max-width: 768px) {
        .listItem {
            justify-content: center;
        }
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

    .year {
        opacity: 0.5;
        margin-right: 0.8rem;
        font-family: var(--font-geist-mono), monospace;
        font-size: 0.9rem;
    }

    .buttonsSection {
        text-align: center;
        margin-bottom: 5rem;
    }

    .buttonsTitle {
        font-family: var(--font-dm-serif), serif;
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
    }

    .buttonsGrid {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 2px;
        max-width: 640px;
        margin: 0 auto;
    }

    .button88x31 {
        width: 88px;
        height: 31px;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.6));
        border: 1px solid rgba(255, 255, 255, 0.06);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: #fff;
        text-decoration: none;
        font-family: var(--font-geist-mono), IBM-VGA, monospace;
        transition: filter 0.15s, transform 0.12s;
        margin: 1px;
    }

    .button88x31:hover {
        filter: brightness(1.25);
        transform: translateY(-1px);
        z-index: 10;
        border-color: rgba(255, 255, 255, 0.9);
    }


    .blogSection {
        border-top: 1px dashed #333;
        padding-top: 3rem;
    }


    .post {
        margin-bottom: 2.5rem;
    }

    .postTitle {
        font-size: 1.4rem;
        font-weight: bold;
        margin-bottom: 0.3rem;
    }

    .postDate {
        font-size: 0.9rem;
        color: #666;
        font-style: italic;
        margin-bottom: 0.5rem;
    }

    .postPreview {
        line-height: 1.6;
        color: #ccc;
        font-size: 1rem;
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

    .footer {
        text-align: center;
        margin-top: 4rem;
        padding-bottom: 2rem;
        opacity: 0.5;
        font-size: 0.8rem;
    }
</style>

<script>
    import {
        blahaj,
        aphex,
        ayanami,
        clubp,
        adhd,
        dnf,
        blahaj2,
        fedora,
        kde,
        keepthewebfree,
        mine,
        mullvad,
        nyan,
        noweb3,
        social,
        sky,
        sparkles
    } from '$lib';
	import Win95Player from '$lib/components/Win95Player.svelte';
</script>

<div class="min-h-100">
    <div class="backgroundImage" style:--bg-img="url('{sky}')" ></div>
    <div class="glow"></div>

    <main class="font-legible">
        <header class="headerContainer">
            <img src="{sparkles}" alt="" class="sparkle" width="64" height="24">
            <h1 class="headerTitle font-comic font-black">welcome to Miguel's site!!!</h1>
            <img src="{sparkles}" alt="" class="sparkle" width="64" height="24">
        </header>

        <section class="intro">
            <p class="font-legible">
                Hi. I'm Miguel. I build things for the internet. Sometimes useful. Sometimes weird. This is my corner of the web.
            </p>
        </section>

        <div style="margin: 1.5rem 0;">
            <Win95Player/>
        </div>

        <div class="grid">
            <div class="column">
                <h3 class="columnTitle">Projects</h3>
                <ul class="list">
                    <li class="listItem">
                        <span class="year">2024:</span>
                        <a href="#project-invoicehub" class="link">InvoiceHub</a>
                    </li>
                    <li class="listItem">
                        <span class="year">2024:</span>
                        <a href="#project-taskflow" class="link">TaskFlow</a>
                    </li>
                    <li class="listItem">
                        <span class="year">2023:</span>
                        <a href="/portfolio" class="link">Portfolio Terminal</a>
                    </li>
                    <li class="listItem">
                        <span class="year">2022:</span>
                        <a href="#project-ui-kit" class="link">Retro UI Kit</a>
                    </li>
                    <li class="listItem">
                        <span class="year">2021:</span>
                        <a href="#project-finance" class="link">Blazor Finance</a>
                    </li>
                    <li class="listItem">
                        <a href="/portfolio" class="link" style="opacity: 0.7; font-size: 0.9rem;">Show more</a>
                    </li>
                </ul>
            </div>

            <div class="column">
                <h3 class="columnTitle">Links</h3>
                <ul class="list">
                    <li class="listItem">
                        <a href="#blog" class="link">My blog is below. Scroll down!</a>
                    </li>
                    <li style="height: 1rem;"></li>
                    <li class="listItem">
                        <span class="year">Code:</span>
                        <a href="https://github.com/senamiguel" target="_blank" rel="noopener noreferrer" class="link">GitHub</a>
                    </li>
                    <li class="listItem">
                        <span class="year">Work:</span>
                        <a href="https://linkedin.com/in/sena-miguel" target="_blank" rel="noopener noreferrer" class="link">LinkedIn</a>
                    </li>
                </ul>
            </div>

            <div class="column">
                <h3 class="columnTitle">Contact</h3>
                <ul class="list">
                    <li class="listItem">
                        <div class="contactText">
                            <p>Email is the best way to reach me.</p>
                            <p>Encrypted emails using my PGP key are appreciated.</p>
                            <p>I might reply fast. I might reply in three days. But, probably I'll reply.</p>
                            <p>
                                <a href="mailto:miguel@miguelsena.dev" class="link">miguel@miguelsena.dev</a>
                            </p>
                        </div>
                    </li>
                    <li class="listItem">
                        <span class="year">PGP:</span>
                        <a class="link" href="public.asc">Key</a>
                    </li>
                </ul>
            </div>
        </div>

        <section class="buttonsSection">
            <h3 class="buttonsTitle">Buttons</h3>
            <div class="buttonsGrid">
                    <a href="/portfolio" target="_blank" rel="noopener noreferrer">
                        <img src={adhd} alt="adhd" class="button88x31" width="88" height="31">
                    </a>
                <a href="https://pt.aliexpress.com/item/1005006748783518.html" target="_blank" rel="noopener noreferrer">
                    <img src={blahaj} alt="blahaj" class="button88x31" width="88" height="31">
                </a>
                <a href="https://open.spotify.com/intl-pt/album/7aNclGRxTysfh6z0d8671k" target="_blank" rel="noopener noreferrer">
                    <img src={aphex} alt="aphex" class="button88x31" width="88" height="31">
                </a>
                <a href="https://evangelion.fandom.com/wiki/Rei_Ayanami" target="_blank" rel="noopener noreferrer">
                    <img src={ayanami} alt="ayanami" class="button88x31" width="88" height="31">
                </a>
                <a href="https://play.cpavalanche.net/" target="_blank" rel="noopener noreferrer">
                    <img src={clubp} alt="clubp" class="button88x31" width="88" height="31">
                </a>
                <a href="https://docs.fedoraproject.org/pt_BR/quick-docs/dnf/" target="_blank" rel="noopener noreferrer">
                    <img src={dnf} alt="dnf" class="button88x31" width="88" height="31">
                </a>
                <a href="https://pt.aliexpress.com/item/1005006748783518.html" target="_blank" rel="noopener noreferrer">
                    <img src={blahaj2} alt="blahaj2" class="button88x31" width="88" height="31">
                </a>
                <a href="https://fedoraproject.org" target="_blank" rel="noopener noreferrer">
                    <img src={fedora} alt="fedora" class="button88x31" width="88" height="31">
                </a>
                <a href="https://kde.org" target="_blank" rel="noopener noreferrer">
                    <img src={kde} alt="kde" class="button88x31" width="88" height="31">
                </a>
                <a href="https://yesterweb.org/no-to-web3/" target="_blank" rel="noopener noreferrer">
                    <img src={keepthewebfree} alt="keepthewebfree" class="button88x31" width="88" height="31">
                </a>
                <a href="minecraft.net" target="_blank" rel="noopener noreferrer">
                    <img src={mine} alt="mine" class="button88x31" width="88" height="31">
                </a>
                <a href="https://mullvad.net/" target="_blank" rel="noopener noreferrer">
                    <img src={mullvad} alt="mullvad" class="button88x31" width="88" height="31">
                </a>
                <a href="https://www.nyan.cat/index.php?cat=original" target="_blank" rel="noopener noreferrer">
                    <img src={nyan} alt="nyan" class="button88x31" width="88" height="31">
                </a>
                <a href="https://yesterweb.org/no-to-web3/" target="_blank" rel="noopener noreferrer">
                    <img src={noweb3} alt="noweb3" class="button88x31" width="88" height="31">
                </a>
                <a href="https://stallman.org/facebook.html" target="_blank" rel="noopener noreferrer">
                    <img src={social} alt="social" class="button88x31" width="88" height="31">
                </a>
            </div>
        </section>

        <section id="blog" class="blogSection">
            <h2 class="buttonsTitle" style="text-align: center; margin-bottom: 3rem;">Writing</h2>

            <article class="post">
                <h3 class="postTitle">
                    <a href="/" class="link">Lorem Ipsum: Dolor sit</a>
                </h3>
                <div class="postDate">February 7, 2026</div>
                <div class="postPreview">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Impedit ex officia quas facilis culpa sunt consectetur natus reprehenderit ratione, quaerat magni. Animi harum atque non. Tempora eos veniam inventore modi?
                </div>
            </article>

            <article class="post">
                <h3 class="postTitle">
                    <a href="/" class="link">Lorem Ipsum</a>
                </h3>
                <div class="postDate">December 15, 2025</div>
                <div class="postPreview">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur maxime sint repellat dignissimos beatae accusantium accusamus, itaque dolorum, non quo quisquam est nisi assumenda. Distinctio optio maiores rerum voluptatum soluta.
                </div>
            </article>
        </section>

        <footer class="footer">
            <p>
                This site is <a href="/" class="link">open source</a>.
                <br />
                © 2026 Miguel Sena. copyleft.
            </p>
            <div style="margin-top: 0.5rem;" class="flex justify-center">
                <img src="https://counter.matdoes.dev/" alt="visitor counter" style="height: 18px;">
            </div>
        </footer>
    </main>
</div>