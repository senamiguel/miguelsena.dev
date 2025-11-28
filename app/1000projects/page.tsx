"use client";
import CrtScreen from '@/components/CrtScreen';
import styles from '../portfolio/page.module.css';
import { useState, useEffect } from 'react';

type Language = 'en' | 'pt';

const translations = {
  en: {
    selectLanguage: 'Select Language / Selecione o Idioma',
    english: 'English',
    portuguese: 'Português',
    title: '1000 PROJECTS IN 1000 DAYS',
    subtitle: 'A daily coding challenge',
    description: [
      'The concept is simple:',
      'Build one project every day for 1000 days.',
      '',
      'No excuses. No skipping. Just code.',
      '',
      'Each project can be:',
      '- A small utility or script',
      '- A learning exercise',
      '- An API or microservice',
      '- A UI component',
      '- A game or experiment',
      '- Anything that involves code',
      '',
      'The goal is not perfection.',
      'The goal is consistency.',
      '',
      'Day by day, project by project,',
      'building a portfolio of 1000 works.',
    ],
    stats: {
      title: 'STATUS',
      day: 'Current Day',
      projects: 'Projects Completed',
      streak: 'Current Streak',
    },
    footer: 'Press any key to return to portfolio',
    goHome: 'Go to Portfolio',
  },
  pt: {
    selectLanguage: 'Select Language / Selecione o Idioma',
    english: 'English',
    portuguese: 'Português',
    title: '1000 PROJETOS EM 1000 DIAS',
    subtitle: 'Um desafio diario de programacao',
    description: [
      'O conceito e simples:',
      'Construir um projeto por dia durante 1000 dias.',
      '',
      'Sem desculpas. Sem pular. Apenas codigo.',
      '',
      'Cada projeto pode ser:',
      '- Uma pequena utilidade ou script',
      '- Um exercicio de aprendizado',
      '- Uma API ou microservico',
      '- Um componente de UI',
      '- Um jogo ou experimento',
      '- Qualquer coisa que envolva codigo',
      '',
      'O objetivo nao e perfeicao.',
      'O objetivo e consistencia.',
      '',
      'Dia apos dia, projeto apos projeto,',
      'construindo um portfolio de 1000 obras.',
    ],
    stats: {
      title: 'STATUS',
      day: 'Dia Atual',
      projects: 'Projetos Completos',
      streak: 'Sequencia Atual',
    },
    footer: 'Pressione qualquer tecla para voltar ao portfolio',
    goHome: 'Ir para Portfolio',
  },
};

// Calculate days since start date
function getDaysSinceStart(startDate: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(diffDays, 1000);
}

export default function ThousandProjects() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [showCursor, setShowCursor] = useState(true);
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [fullText, setFullText] = useState('');

  // Start date for the challenge - can be adjusted
  const startDate = new Date('2025-11-28');
  const currentDay = getDaysSinceStart(startDate);
  const projectsCompleted = Math.max(0, currentDay - 1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 153);

    return () => clearInterval(cursorTimer);
  }, [mounted]);

  const generateTerminalText = (lang: Language): string => {
    const t = translations[lang];
    const width = 50;
    const line = '='.repeat(width);
    const thinLine = '-'.repeat(width);
    
    const centerText = (text: string): string => {
      const padding = Math.max(0, Math.floor((width - text.length) / 2));
      return ' '.repeat(padding) + text;
    };

    const lines = [
      'Microsoft(R) MS-DOS(R) Version 6.22',
      '(C)Copyright Microsoft Corp 1981-1994.',
      '',
      'C:\\>CD 1000PROJECTS',
      '',
      `+${line}+`,
      '|' + centerText(t.title) + ' '.repeat(width - centerText(t.title).length) + '|',
      '|' + centerText(t.subtitle) + ' '.repeat(width - centerText(t.subtitle).length) + '|',
      `+${line}+`,
      '',
      ...t.description,
      '',
      `+${thinLine}+`,
      `| ${t.stats.title.padEnd(width - 2)} |`,
      `+${thinLine}+`,
      `| ${t.stats.day}: ${String(currentDay).padStart(4)} / 1000`.padEnd(width) + ' |',
      `| ${t.stats.projects}: ${String(projectsCompleted).padStart(4)}`.padEnd(width) + ' |',
      `| ${t.stats.streak}: ${String(currentDay).padStart(4)} ${lang === 'pt' ? 'dias' : 'days'}`.padEnd(width) + ' |',
      `+${thinLine}+`,
      '',
      '',
      'C:\\1000PROJECTS>',
    ];

    return lines.join('\n');
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    const text = generateTerminalText(lang);
    setFullText(text);
    setDisplayText('');
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (!language || !fullText) return;
    
    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 3);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, fullText, language]);

  useEffect(() => {
    if (!language) return;
    
    const handleKeyPress = () => {
      if (currentIndex >= fullText.length) {
        window.location.href = '/portfolio';
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, fullText, language]);

  // Language selection screen
  if (!language) {
    return (
      <main className={styles.main}>
        <CrtScreen>
          {`Microsoft(R) MS-DOS(R) Version 6.22
(C)Copyright Microsoft Corp 1981-1994.

C:\\>SELECT LANGUAGE

+==================================================+
|                                                  |
|       Select Language / Selecione o Idioma       |
|                                                  |
+==================================================+

  [1] English
  [2] Portugues

C:\\>`}
          {mounted && showCursor && "_"}
        </CrtScreen>
        <div className={styles.mobileButtons}>
          <button
            className={styles.commandButton}
            onClick={() => handleLanguageSelect('en')}
          >
            🇺🇸 English
          </button>
          <button
            className={styles.commandButton}
            onClick={() => handleLanguageSelect('pt')}
          >
            🇧🇷 Português
          </button>
        </div>
      </main>
    );
  }

  const t = translations[language];

  return (
    <main className={styles.main}>
      <CrtScreen>
        {displayText}
        {mounted && showCursor && currentIndex >= fullText.length && "_"}
      </CrtScreen>
      <div className={styles.headerButtons}>
        <button
          className={styles.homeButton}
          onClick={() => window.location.href = '/portfolio'}
        >
          {t.goHome}
        </button>
      </div>
      {currentIndex >= fullText.length && (
        <div className={styles.mobileButtons}>
          <button
            className={styles.commandButton}
            onClick={() => window.location.href = '/portfolio'}
          >
            {t.goHome}
          </button>
          <button
            className={styles.commandButton}
            onClick={() => setLanguage(null)}
          >
            {language === 'pt' ? 'Mudar Idioma' : 'Change Language'}
          </button>
        </div>
      )}
    </main>
  );
}
