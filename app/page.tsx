"use client";
import CrtScreen from '@/components/CrtScreen';
import styles from './page.module.css';
import { useState, useEffect } from 'react';

export default function Home() {

  const PROMPT = "C:\\>";
  const COMMANDS: Record<string, string> = {
    "help": "\nAvailable commands: \nhelp - Show a list of the available commands. \ncls - Clear the screen. \nrestart - Restart the session.\n",
    "" :""
  };

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const DEFAULT_DOS_TEXT = [
    'Microsoft(R) MS-DOS(R) Version 6.22',
    '(C)Copyright Microsoft Corp 1981-1994.',
    '',
    'C:\\>DIR',
    ' Volume in drive C is MIGUELSENA.SITE',
    ' Volume Serial Number is 1994-0A0D',
    '',
    'Directory of C:\\',
    '',
    'PROJECTS     <DIR>      11-08-25  9:10a',
    'SKILLS       <DIR>      11-08-25  9:02a',
    'ABOUT        TXT            1,024 11-07-25  4:55p',
    'CONTACT      BAT              256 11-08-25  9:11a',
    '       2 file(s)          1,280 bytes',
    '       2 dir(s)   4,194,304 bytes free',
    '',
    'Type "help" to see the list of available commands.',
    '',
    PROMPT
  ].join('\n');

  const [showCursor, setShowCursor] = useState(true);
  const [dosText, setDosText] = useState(DEFAULT_DOS_TEXT);

  useEffect(() => {
    const timerId = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 153);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === "Enter") {
        const lastLineIndex = dosText.lastIndexOf('\n');
        const currentLine = dosText.substring(lastLineIndex + 1);
        const commandText = currentLine.substring(PROMPT.length);
        const finalCommand = commandText.trim().toLowerCase();

        if (finalCommand && !commandHistory.includes(finalCommand)) {
          setCommandHistory(prev => [...prev, finalCommand]);
        }
        setHistoryIndex(-1);

        setDosText((prev: string) => {
          if (finalCommand === "cls" || finalCommand === "clear") {
            return PROMPT;
          }

          if (finalCommand === "restart") {
            return DEFAULT_DOS_TEXT;
          }
          if (COMMANDS.hasOwnProperty(finalCommand)) {
            return prev + "\n" + COMMANDS[finalCommand] + "\n" + PROMPT;
          }
          else{
            return prev + `\nIllegal command: ${finalCommand}.\n` + PROMPT;
          }

          return prev + "\n" + PROMPT;
        });

        setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 0);

      } else if (e.key === "Backspace") {

        setDosText((prev: string) => {
          const lastLineIndex = prev.lastIndexOf('\n');
          const currentLine = prev.substring(lastLineIndex + 1);

          if (currentLine.length > PROMPT.length) {
            return prev.slice(0, -1);
          } else {
            return prev;
          }
        });

      } else if (e.key === "Tab") {
        e.preventDefault();
        setDosText((prev: string) => prev + "    ");
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setDosText((prev: string) => {
          const lastLineIndex = prev.lastIndexOf('\n');
          const currentLine = prev.substring(lastLineIndex + 1);

          if (currentLine.length > PROMPT.length) {
            return prev.slice(0, -1);
          } else {
            return prev;
          }
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
          setHistoryIndex(newIndex);

          setDosText(prev => {
            const lastLineIndex = prev.lastIndexOf('\n');
            return prev.substring(0, lastLineIndex + 1) + PROMPT + commandHistory[commandHistory.length - 1 - newIndex];
          });
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);

          setDosText(prev => {
            const lastLineIndex = prev.lastIndexOf('\n');
            return prev.substring(0, lastLineIndex + 1) + PROMPT + commandHistory[commandHistory.length - 1 - newIndex];
          });
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setDosText(prev => {
            const lastLineIndex = prev.lastIndexOf('\n');
            return prev.substring(0, lastLineIndex + 1) + PROMPT;
          });
        }
      } else if (e.key.length > 1) {
        if (e.key === "ArrowRight" || e.key === "Escape") {
          e.preventDefault();
        }
      } else {

        setDosText((prev: string) => prev + e.key);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [DEFAULT_DOS_TEXT, PROMPT, commandHistory, historyIndex, dosText]);

  return (
    <main className={styles.main}>
      <CrtScreen>
        {dosText}
        {showCursor && "_"}

      </CrtScreen>
    </main>
  );
}