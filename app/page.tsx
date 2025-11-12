"use client";
import CrtScreen from '@/components/CrtScreen';
import styles from './page.module.css';
import { useState, useEffect } from 'react';

const CONSTRUCTION_TEXT = [
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

export default function UnderConstruction() {
  const [showCursor, setShowCursor] = useState(true);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 153);

    return () => clearInterval(cursorTimer);
  }, []);

  useEffect(() => {
    if (currentIndex < CONSTRUCTION_TEXT.length) {
      const timer = setTimeout(() => {
        setDisplayText(CONSTRUCTION_TEXT.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 5);

      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentIndex >= CONSTRUCTION_TEXT.length) {
        window.location.href = 'https://www.google.com';
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  return (
    <main className={styles.main}>
      <CrtScreen>
        {displayText}
        {showCursor && currentIndex >= CONSTRUCTION_TEXT.length && "_"}
      </CrtScreen>
      {currentIndex >= CONSTRUCTION_TEXT.length && (
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
