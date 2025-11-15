"use client";
import CrtScreen from '@/components/CrtScreen';
import styles from '../page.module.css';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    if (currentIndex < constructionText.length) {
      const timer = setTimeout(() => {
        setDisplayText(constructionText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 5);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, constructionText]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentIndex >= constructionText.length) {
        window.location.href = 'https://www.google.com';
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, constructionText]);

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
