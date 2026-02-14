import styles from './page.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { getButtonImages } from './getButtonImages';
import Win95Player from '../components/Win95Player';

export default async function Home() {
  const buttonImages = getButtonImages();
  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}></div>
      <div className={styles.scanlines}></div>
      <div className={styles.glow}></div>

      <main className={styles.main}>
        <header className={styles.headerContainer}>
          <Image src="/sparkles.gif" alt="" className={styles.sparkle} width={64} height={24} unoptimized={true} />
          <h1 className={styles.headerTitle}>welcome to Miguel&apos;s site!!!</h1>
          <Image src="/sparkles.gif" alt="" className={styles.sparkle} width={64} height={24} />
        </header>

        <section className={styles.intro}>
          <p>
           Hi. I&apos;m Miguel. I build things for the internet. Sometimes useful. Sometimes weird. This is my corner of the web.
          </p>
        </section>

        <div style={{ margin: '1.5rem 0' }}>
          <Win95Player />
        </div>

        <div className={styles.grid}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Projects</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.year}>2024:</span>
                <Link href="#project-invoicehub" className={styles.link}>InvoiceHub</Link>
              </li>
              <li className={styles.listItem}>
                <span className={styles.year}>2024:</span>
                <Link href="#project-taskflow" className={styles.link}>TaskFlow</Link>
              </li>
              <li className={styles.listItem}>
                <span className={styles.year}>2023:</span>
                <Link href="/portfolio" className={styles.link}>Portfolio Terminal</Link>
              </li>
              <li className={styles.listItem}>
                <span className={styles.year}>2022:</span>
                <Link href="#project-ui-kit" className={styles.link}>Retro UI Kit</Link>
              </li>
              <li className={styles.listItem}>
                <span className={styles.year}>2021:</span>
                <Link href="#project-finance" className={styles.link}>Blazor Finance</Link>
              </li>
              <li className={styles.listItem}>
                <Link href="/portfolio" className={styles.link} style={{ opacity: 0.7, fontSize: '0.9rem' }}>Show more</Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Links</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <Link href="#blog" className={styles.link}>My blog is below. Scroll down!</Link>
              </li>
              <li style={{ height: '1rem' }}></li>
              <li className={styles.listItem}>
                <span className={styles.year}>Code:</span>
                <a href="https://github.com/senamiguel" target="_blank" rel="noopener noreferrer" className={styles.link}>GitHub</a>
              </li>
              <li className={styles.listItem}>
                <span className={styles.year}>Work:</span>
                <a href="https://linkedin.com/in/sena-miguel" target="_blank" rel="noopener noreferrer" className={styles.link}>LinkedIn</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Contact</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <div className={styles.contactText}>
                  <p>Email is the best way to reach me.</p>
                  <p>Encrypted emails using my PGP key are appreciated.</p>
                  <p>I might reply fast. I might reply in three days. But, probably I&apos;ll reply.</p>
                  <p>
                    <a href="mailto:miguel@miguelsena.dev" className={styles.link}>miguel@miguelsena.dev</a>
                  </p>
                </div>
              </li>
              <li className={styles.listItem}>
                <span className={styles.year}>PGP:</span>
                <a className={styles.link} href="public.asc">Key</a>
              </li>

            </ul>
          </div>
        </div>

        <section className={styles.buttonsSection}>
          <h3 className={styles.buttonsTitle}>Buttons</h3>
          <div className={styles.buttonsGrid}>
            {(() => {
              const urlMap: Record<string, string> = {
                'blahaj.png': 'https://pt.aliexpress.com/item/1005006748783518.html',
                'aphex.png': 'https://open.spotify.com/intl-pt/album/7aNclGRxTysfh6z0d8671k',
                'ayanami.png': 'https://evangelion.fandom.com/wiki/Rei_Ayanami',
                'clubp.png':'https://play.cpavalanche.net/',
                'adhd.gif': '/portfolio',
                'dnf.gif':'https://docs.fedoraproject.org/pt_BR/quick-docs/dnf/',
                'blahaj2.gif': 'https://pt.aliexpress.com/item/1005006748783518.html',
                'fedora.gif': 'https://fedoraproject.org',
                'kde.gif': 'https://kde.org',
                'keepthewebfree.gif': 'https://yesterweb.org/no-to-web3/',
                'mine.png':'minecraft.net',
                'mullvad.png':'https://mullvad.net/',
                'nyan.gif':'https://www.nyan.cat/index.php?cat=original',
                'noweb3.gif': 'https://yesterweb.org/no-to-web3/',
                'social.gif':'https://stallman.org/facebook.html'
              };

              return buttonImages.map((file) => {
                const name = file.replace(/\.[^.]+$/, '');
                const href = urlMap[file] ?? `https://www.google.com/search?q=${encodeURIComponent(name)}`;
                return (
                  <a key={file} href={href} target="_blank" rel="noopener noreferrer">
                    <Image
                      src={`/buttons/${file}`}
                      alt={name}
                      className={styles.button88x31}
                      width={88}
                      height={31}
                      unoptimized={file.toLowerCase().endsWith('.gif')}
                    />
                  </a>
                );
              });
            })()}
          </div>
        </section>

        <section id="blog" className={styles.blogSection}>
          <h2 className={styles.buttonsTitle} style={{ textAlign: 'center', marginBottom: '3rem' }}>Writing</h2>

          <article className={styles.post}>
            <h3 className={styles.postTitle}>
              <Link href="#" className={styles.link}>Hello World: About Me</Link>
            </h3>
            <div className={styles.postDate}>February 7, 2026</div>
            <div className={styles.postPreview}>
              Hello! I am Miguel, a software engineer dedicated to building robust and scalable web applications.
              With a strong foundation in the Microsoft stack and modern frontend...
            </div>
          </article>

          <article className={styles.post}>
            <h3 className={styles.postTitle}>
              <Link href="#" className={styles.link}>Building a Terminal in React</Link>
            </h3>
            <div className={styles.postDate}>December 15, 2025</div>
            <div className={styles.postPreview}>
              I recently built a portfolio site that mimics an MS-DOS terminal. It features a complete file system, command parsing, and retro styling.
              The challenge was managing state for a simulated file system structure...
            </div>
          </article>
        </section>

        <footer className={styles.footer}>
          <p>
            This site is <a href="#" className={styles.link}>open source</a>.
            <br />
            &copy; {new Date().getFullYear()} Miguel Sena. copyleft.
          </p>
            <div style={{ marginTop: '0.5rem' }}>
              {/* external counter — keep native img to avoid remotePatterns config */}
              <img src="https://counter.matdoes.dev/" alt="visitor counter" style={{ height: 18 }} />
            </div>
        </footer>
      </main>
    </div>
  );
}
