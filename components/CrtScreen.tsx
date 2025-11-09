import React, { useEffect, useRef } from 'react';
import styles from './CrtScreen.module.css';

type CrtScreenProps = {
  children: React.ReactNode; 
};

const CrtScreen = ({ children }: CrtScreenProps) => {
  const contentRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div className={styles.crt}>
      <div className={styles.screen}>
        <pre ref={contentRef} className={styles.content}>
          {children}
        </pre>
      </div>
    </div>
  );
};

export default CrtScreen;