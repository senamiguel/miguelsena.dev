/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import CrtScreen from '@/components/CrtScreen';
import styles from '../page.module.css';
import { useState, useEffect, useRef } from 'react';

const CONSTRUCTION_TEXT_DESKTOP = [
  'Microsoft(R) MS-DOS(R) Version 6.22',
  '(C)Copyright Microsoft Corp 1981-1994.',
  '',
  'C:\\>CD CONSTRUCTION',
  '',
  '    +===============================================+',
  '    |                                               |',
  '    |      U N D E R   C O N S T R U C T I O N      |',
  '    |                                               |',
  '    +===============================================+',
  '    |                                               |',
  '    |      This page is currently being built...    |',
  '    |                                               |',
  '    |           Please check back later!            |',
  '    |                                               |',
  '    |               In the meantime:                |',
  '    |      > Visit my GitHub: /senamiguel           |',
  '    |      > Check my LinkedIn: /in/sena-miguel     |',
  '    |      > Email: miguelaugustosena@gmail.com     |',
  '    |                                               |',
  '    +===============================================+',
  '    |                                               |',
  '    |            [Press any key to exit]            |',
  '    |                                               |',
  '    +===============================================+',
  '',
  'C:\\CONSTRUCTION>'
].join('\n');

const CONSTRUCTION_TEXT_MOBILE = [
  'Microsoft(R) MS-DOS(R) 6.22',
  '(C)Copyright Microsoft Corp',
  '1981-1994.',
  '',
  'C:\\>CD CONSTRUCTION',
  '',
  '  +=========================+',
  '  |                         |',
  '  |        U N D E R        |',
  '  | C O N S T R U C T I O N |',
  '  |                         |',
  '  +=========================+',
  '  |                         |',
  '  | This page is currently  |',
  '  | being built...          |',
  '  |                         |',
  '  | Please check back       |',
  '  | later!                  |',
  '  |                         |',
  '  | In the meantime:        |',
  '  | > GitHub: /senamiguel   |',
  '  | > LinkedIn:             |',
  '  |   /in/sena-miguel       |',
  '  | > Email:                |',
  '  |   miguelaugustosena     |',
  '  |   @gmail.com            |',
  '  |                         |',
  '  +=========================+',
  '  |                         |',
  '  | [Press any key to exit] |',
  '  |                         |',
  '  +=========================+',
  '',
  'C:\\CONSTRUCTION>'
].join('\n');

export default function UnderConstruction() {
  const [showCursor, setShowCursor] = useState(true);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [constructionText, setConstructionText] = useState(CONSTRUCTION_TEXT_DESKTOP);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setConstructionText(mobile ? CONSTRUCTION_TEXT_MOBILE : CONSTRUCTION_TEXT_DESKTOP);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 153);

    return () => clearInterval(cursorTimer);
  }, []);

  // Use a ref to keep track of the current index so we don't need to
  // reattach listeners or re-create timers on every index change.
  const currentIndexRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    let timeoutId: number | undefined;

    // reset when constructionText changes
    // Defer resets to avoid calling setState synchronously inside an effect
    const resetTimeoutId = window.setTimeout(() => {
      setDisplayText('');
      setCurrentIndex(0);
      currentIndexRef.current = 0;
    }, 0);

    const run = () => {
      if (!mounted) return;
      if (currentIndexRef.current < constructionText.length) {
        timeoutId = window.setTimeout(() => {
          setCurrentIndex(prev => {
            const next = prev + 1;
            currentIndexRef.current = next;
            setDisplayText(constructionText.slice(0, next));
            return next;
          });
          run();
        }, 5);
      }
    };

    run();

    return () => {
      mounted = false;
      if (resetTimeoutId) window.clearTimeout(resetTimeoutId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [constructionText]);

  // Attach keydown listener once and use the ref to check progress
  useEffect(() => {
    const handleKeyPress = (_e: KeyboardEvent) => {
      if (currentIndexRef.current >= constructionText.length) {
        window.location.href = 'https://www.google.com';
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [constructionText]);

  return (
    <main className={styles.main}>
      <CrtScreen>
        {displayText}
        {showCursor && currentIndex >= constructionText.length && "_"}
      </CrtScreen>
      {currentIndex >= constructionText.length && (
        <div className={styles.mobileButtons}>
          <button
            className={styles.commandButton}
            onClick={() => window.location.href = 'https://www.google.com'}
          >
            Exit
          </button>
        </div>
      )}
    </main>
  );
}
