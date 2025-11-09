"use client";
import CrtScreen from '@/components/CrtScreen';
import styles from './page.module.css';
import { useState, useEffect } from 'react';

interface FileSystemNode {
  type: 'dir' | 'file';
  date: string;
  time: string;
  path?: string;
  children?: { [key: string]: FileSystemNode };
  size?: number;
  extension?: string;
  parent?: Directory;
}

interface Directory {
  path: string;
  children: { [key: string]: FileSystemNode };
  parent?: Directory;
}

function addParentLinks(dir: Directory, parent: Directory | null) {
  dir.parent = parent ? parent : undefined;
  
  if (!dir.children) {
    return;
  }

  for (const key of Object.keys(dir.children)) {
    const child = dir.children[key];
    
    child.parent = dir;
    
    if (child.type === 'dir') {
      addParentLinks(child as Directory, dir);
    }
  }
}

const ROOT: Directory = {
  path: "\\",
  children: {
    "projects": { 
      type: 'dir', 
      path: "\\projects", 
      children: {
        "site.txt": { type: 'file', size: 1337, extension: 'TXT', date: '11-09-25', time: '10:00a' }
      },
      date: "11-08-25",
      time: "9:10a"
    },
    "skills": { 
      type: 'dir', 
      path: "\\skills", 
      children: {},
      date: "11-08-25",
      time: "9:02a"
    },
    "about": {
      type: 'file',
      extension: "TXT",
      size: 1024,
      date: "11-07-25",
      time: "4:55p"
    },
    "contact": {
      type: 'file',
      extension: "BAT",
      size: 256,
      date: "11-08-25",
      time: "9:11a"
    }
  }
};

addParentLinks(ROOT, null);

const COMMANDS: Record<string, string> = {
  "help": "\nAvailable commands: \nhelp - Show a list of the available commands. \ncls - Clear the screen. \nrestart - Restart the session.\ndir - List the contents of the current directory.\n",
  "" :"",
};

const STATIC_DEFAULT_TEXT = [
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
  'ABOUT    TXT       1,024 11-07-25  4:55p',
  'CONTACT  BAT         256 11-08-25  9:11a',
  '       2 file(s)          1,280 bytes',
  '       2 dir(s)   4,194,304 bytes free',
  '',
  'Type "help" to see the list of available commands.',
  ''
].join('\n');

const formatDirLine = (name: string, entry: FileSystemNode): string => {
  const upperName = name.toUpperCase();
  
  if (entry.type === 'dir') {
    const namePart = upperName.padEnd(13);
    return `${namePart}<DIR>      ${entry.date}  ${entry.time}`;
  } else {
    const namePart = upperName.padEnd(8);
    const extPart = (entry.extension || "").padEnd(4);
    const sizePart = (entry.size || 0).toString().padStart(10);
    return `${namePart} ${extPart} ${sizePart} ${entry.date}  ${entry.time}`;
  }
};

const generateDirOutput = (dir: Directory): string => {
  const lines = [
    `\n Volume in drive C is MIGUELSENA.SITE`,
    ` Volume Serial Number is 1994-0A0D`,
    ``,
    ` Directory of C:${dir.path}`,
    ``
  ];

  let fileCount = 0;
  let dirCount = 0;
  let totalFileSize = 0;

  for (const [name, entry] of Object.entries(dir.children)) {
    lines.push(formatDirLine(name, entry));
    
    if (entry.type === 'dir') {
      dirCount++;
    } else {
      fileCount++;
      totalFileSize += entry.size || 0;
    }
  }

  const totalSizeStr = totalFileSize.toLocaleString();
  lines.push(`       ${fileCount} file(s) ${totalSizeStr.padStart(13)} bytes`);
  lines.push(`       ${dirCount} dir(s)   4,194,304 bytes free`);
  lines.push(``);
  
  return lines.join('\n');
};


export default function Home() {

  const [currentDir, setCurrentDir] = useState<Directory>(ROOT);
  const currentPrompt = `C:${currentDir.path}>`;

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [showCursor, setShowCursor] = useState(true);
  const [dosText, setDosText] = useState(STATIC_DEFAULT_TEXT + '\n' + `C:${ROOT.path}>`);

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
        const commandText = currentLine.substring(currentPrompt.length);
        const finalCommand = commandText.trim().toLowerCase();

        if (finalCommand && !commandHistory.includes(finalCommand)) {
          setCommandHistory(prev => [...prev, finalCommand]);
        }
        setHistoryIndex(-1);

        setDosText((prev: string) => {
          if (finalCommand === "cls" || finalCommand === "clear") {
            return currentPrompt;
          }

          if (finalCommand === "restart") {
            setCurrentDir(ROOT);
            return STATIC_DEFAULT_TEXT + '\n' + `C:${ROOT.path}>`;
          }

          if (finalCommand === "dir") {
            const dirOutput = generateDirOutput(currentDir);
            return prev + "\n" + dirOutput + currentPrompt;
          }
          
          if (finalCommand.startsWith("cd ")){
            const targetDirName = finalCommand.substring(3).trim();

            if (targetDirName === "..") {
              if (currentDir.parent) {
                setCurrentDir(currentDir.parent);
                return prev + "\n" + `C:${currentDir.parent.path}>`;
              } else {
                return prev + "\n" + currentPrompt;
              }
            }

            if (currentDir.children && currentDir.children.hasOwnProperty(targetDirName)){
              const newEntry = currentDir.children[targetDirName];

              if (newEntry.type === 'dir') {
                setCurrentDir(newEntry as Directory);
                return prev + "\n" + `C:${newEntry.path}>`;
              } else {
                return prev + "\nThe directory name is invalid.\n" + currentPrompt;
              }
            }
            return prev + "\nInvalid directory.\n" + currentPrompt;
          }

          if (COMMANDS.hasOwnProperty(finalCommand)) {
            return prev + "\n" + COMMANDS[finalCommand] + "\n" + currentPrompt;
          }
          return prev + `\nIllegal command: ${finalCommand}\n` + currentPrompt;
        });

        setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 0);

      } else if (e.key === "Backspace") {
        setDosText((prev: string) => {
          const lastLineIndex = prev.lastIndexOf('\n');
          const currentLine = prev.substring(lastLineIndex + 1);

          if (currentLine.length > currentPrompt.length) {
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

          if (currentLine.length > currentPrompt.length) {
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
            return prev.substring(0, lastLineIndex + 1) + currentPrompt + commandHistory[commandHistory.length - 1 - newIndex];
          });
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);

          setDosText(prev => {
            const lastLineIndex = prev.lastIndexOf('\n');
            return prev.substring(0, lastLineIndex + 1) + currentPrompt + commandHistory[commandHistory.length - 1 - newIndex];
          });
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setDosText(prev => {
            const lastLineIndex = prev.lastIndexOf('\n');
            return prev.substring(0, lastLineIndex + 1) + currentPrompt;
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
  }, [dosText, currentDir, commandHistory, historyIndex]);

  return (
    <main className={styles.main}>
      <CrtScreen>
        {dosText}
        {showCursor && "_"}
      </CrtScreen>
    </main>
  );
}