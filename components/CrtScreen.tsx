import React, { useEffect, useRef } from 'react';
import styles from './CrtScreen.module.css';
import Image from 'next/image';

type CrtScreenProps = {
  children: React.ReactNode;
  imageSrc?: string;
};

const CrtScreen = ({ children, imageSrc }: CrtScreenProps) => {
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
        {imageSrc && (
          <div className={styles.imageContainer}>
            <Image
              src={imageSrc}
              alt="About me"
              width={500}
              height={600}
              className={styles.aboutImage}
              unoptimized
              priority
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CrtScreen;