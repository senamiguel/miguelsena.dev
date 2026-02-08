
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}></div>
      <div className={styles.scanlines}></div>
      <div className={styles.glow}></div>

      <main className={styles.main}>
        <header className={styles.headerContainer}>
          <img src="/sparkles.gif" alt="" className={styles.sparkle} />
          <h1 className={styles.headerTitle}>welcome to Miguel&apos;s site!!!</h1>
          <img src="/sparkles.gif" alt="" className={styles.sparkle} />
        </header>

        <section className={styles.intro}>
          <p>
            Hi, thanks for stopping by. I am Miguel, and I make things on the internet. This is my personal web site on the world wide web. 🐈
          </p>
        </section>

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
                <a href="https://linkedin.com/in/senamiguel" target="_blank" rel="noopener noreferrer" className={styles.link}>LinkedIn</a>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Contact</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.year}>Mail:</span>
                <a href="mailto:miguelaugustosena@gmail.com" className={styles.link}>miguel@example.com</a>
              </li>
              <li className={styles.listItem}>
                <span className={styles.year}>PGP:</span>
                <a href="#" className={styles.link}>Key</a>
              </li>
              <li className={styles.listItem}>
                <span className={styles.year}>Matrix:</span>
                <span style={{ color: '#ccc' }}>@miguel:matrix.org</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.year} style={{ width: 'auto' }}>Fediverse:</span>
                <a href="#" className={styles.link}>@miguel@social.instance</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Buttons Section - Crowded Grid look */}
        <section className={styles.buttonsSection}>
          <h3 className={styles.buttonsTitle}>Buttons</h3>
          <div className={styles.buttonsGrid}>
            <div className={styles.button88x31}>next.js</div>
            <div className={styles.button88x31}>react</div>
            <div className={styles.button88x31}>typescript</div>
            <div className={styles.button88x31}>dotnet</div>
            <div className={styles.button88x31}>csharp</div>
            <div className={styles.button88x31}>vscode</div>
            <div className={styles.button88x31}>linux</div>
            <div className={styles.button88x31}>github</div>
            <div className={styles.button88x31}>brazil</div>
            <div className={styles.button88x31}>coffee</div>
            <div className={styles.button88x31}>neovim</div>
            <div className={styles.button88x31}>docker</div>
            <div className={styles.button88x31}>azure</div>
            <div className={styles.button88x31}>vercel</div>
            <div className={styles.button88x31}>postgres</div>
            <div className={styles.button88x31}>redis</div>
          </div>
        </section>

        {/* Blog Section */}
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
        </footer>
      </main>
    </div>
  );
}
