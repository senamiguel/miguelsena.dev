'use client';
import { useState } from 'react';
import styles from './LanguageModeSelector.module.css';
import { Language, Mode, Translations } from '@/app/portfolio/translations';

interface LanguageModeSelectorProps {
  onSelect: (language: Language, mode: Mode) => void;
}

const LanguageModeSelector = ({ onSelect }: LanguageModeSelectorProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
  };

  const handleModeSelect = (mode: Mode) => {
    setSelectedMode(mode);
    if (selectedLanguage) {
      onSelect(selectedLanguage, mode);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {!selectedLanguage ? (
          <div className={styles.section}>
            <h2 className={styles.title}>Select Language / Selecione o Idioma</h2>
            <div className={styles.options}>
              <button
                className={styles.option}
                onClick={() => handleLanguageSelect('en')}
              >
                <span className={styles.flag}>🇺🇸</span>
                <span className={styles.label}>English</span>
              </button>
              <button
                className={styles.option}
                onClick={() => window.alert("Em construção...")}
              >
                <span className={styles.flag}>🇧🇷</span>
                <span className={styles.label}>Portugues</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.section}>
            <h2 className={styles.title}>
              {selectedLanguage === 'en' ? 'Select Mode' : 'Selecione o Modo'}
            </h2>
            <div className={styles.options}>
              <button
                className={styles.option}
                onClick={() => handleModeSelect('beginner')}
              >
                <div className={styles.modeContent}>
                  <span className={styles.modeTitle}>
                    {selectedLanguage === 'en' ? 'Beginner Mode' : 'Modo Leigo'}
                  </span>
                  <span className={styles.modeDesc}>
                    {selectedLanguage === 'en'
                      ? 'Easy-to-use buttons for everyone'
                      : 'Botoes faceis de usar para todos'}
                  </span>
                </div>
              </button>
              <button
                className={styles.option}
                onClick={() => handleModeSelect('advanced')}
              >
                <div className={styles.modeContent}>
                  <span className={styles.modeTitle}>
                    {selectedLanguage === 'en' ? 'Advanced Mode' : 'Modo Avancado'}
                  </span>
                  <span className={styles.modeDesc}>
                    {selectedLanguage === 'en'
                      ? 'Type commands like a pro'
                      : 'Digite comandos como um profissional'}
                  </span>
                </div>
              </button>
            </div>
            <button
              className={styles.backButton}
              onClick={() => setSelectedLanguage(null)}
            >
              ← {selectedLanguage === 'en' ? 'Back' : 'Voltar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageModeSelector;

