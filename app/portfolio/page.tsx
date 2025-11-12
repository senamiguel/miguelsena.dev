"use client";
import CrtScreen from '@/components/CrtScreen';
import LanguageModeSelector from '@/components/LanguageModeSelector';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { Language, Mode, translations } from './translations';


interface FileSystemNode {
  type: 'dir' | 'file';
  date: string;
  time: string;
  path?: string;
  children?: { [key: string]: FileSystemNode };
  size?: number;
  extension?: string;
  parent?: Directory;
  content?: string;
}

interface Directory {
  path: string;
  children: { [key: string]: FileSystemNode };
  parent?: Directory;
}



const ABOUT_ME_CONTENT = [
  '',
  '    +---------------------------------------+',
  '    |                                       |',
  '    |          M I G U E L   S E N A        |',
  '    |            Software Engineer          |',
  '    |                                       |',
  '    +---------------------------------------+',
  '    |                                       |',
  '    |   Hello! I\'m Miguel, a passionate    |',
  '    |   developer creating cool things      |',
  '    |   for the web.                        |',
  '    |                                       |',
  '    |   This terminal is my portfolio,      |',
  '    |   inspired by MS-DOS.                 |',
  '    |                                       |',
  '    +---------------------------------------+',
  '    |                                       |',
  '    |   Type \'cd projects\' to see my work.|',
  '    |                                       |',
  '    +---------------------------------------+',
  ''
].join('\n');

const CONTACT_CONTENT = [
  '',
  '    +---------------------------------------+',
  '    |                                       |',
  '    |          C O N T A C T   M E          |',
  '    |                                       |',
  '    +---------------------------------------+',
  '    |                                       |',
  '    |   > LinkedIn: /in/miguelsena          |',
  '    |   > GitHub:   /besena                 |',
  '    |   > Email:    contact@miguelsena.site |',
  '    |                                       |',
  '    +---------------------------------------+',
  ''
].join('\n');

const SITE_TXT_CONTENT = [
  '',
  '    This is the project file for this very website!',
  '    ',
  '    NAME: miguelsena.site',
  '    TYPE: Portfolio Terminal',
  '    TECH: React, Next.js, TypeScript',
  '    DESC: A recreation of an MS-DOS terminal',
  '          as a personal portfolio.',
  ''
].join('\n');



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

// ROOT will be created dynamically with translations
const createRoot = (lang: Language): Directory => {
  const t = translations[lang];
  return {
    path: "\\",
    children: {
      "projects": { 
        type: 'dir', 
        path: "\\projects", 
        children: {
          "site.txt": { 
            type: 'file', 
            size: 1337, 
            extension: 'TXT', 
            date: '11-09-25', 
            time: '10:00a',
            content: getSiteContent(lang)
          }
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
        time: "4:55p",
        content: getAboutContent(lang)
      },
      "contact": {
        type: 'file',
        extension: "BAT",
        size: 256,
        date: "11-08-25",
        time: "9:11a",
        content: getContactContent(lang)
      }
    }
  };
};


function getAboutContent(lang: Language): string {
  const t = translations[lang];
  const width = 39; // número de caracteres entre as bordas (ajuste conforme necessário)

  const centerText = (text: string): string => {
    const clean = text.trim();
    const totalPadding = width - clean.length;
    const left = Math.floor(totalPadding / 2);
    const right = totalPadding - left;
    return ' '.repeat(left) + clean + ' '.repeat(right);
  };

  const padLine = (text: string = '') =>
    `    | ${text.padEnd(width, ' ')} |`;

  const desc = t.terminal.about.description
    .map(line => padLine(line))
    .join('\n');

  return [
    '',
    '    +' + '-'.repeat(width + 2) + '+',
    padLine(),
    `    | ${centerText(t.terminal.about.title)} |`,
    `    | ${centerText(t.terminal.about.subtitle)} |`,
    padLine(),
    '    +' + '-'.repeat(width + 2) + '+',
    padLine(),
    desc,
    padLine(),
    '    +' + '-'.repeat(width + 2) + '+',
    padLine(),
    `    | ${centerText(t.terminal.about.instruction)} |`,
    padLine(),
    '    +' + '-'.repeat(width + 2) + '+',
    ''
  ].join('\n');
}


function getContactContent(lang: Language): string {
  const t = translations[lang];
  return [
    '',
    '    +---------------------------------------+',
    '    |                                       |',
    `    |          ${t.terminal.contact.title}          |`,
    '    |                                       |',
    '    +---------------------------------------+',
    '    |                                       |',
    `    |   > LinkedIn: ${t.terminal.contact.linkedin}           |`,
    `    |   > GitHub:   ${t.terminal.contact.github}                 |`,
    `    |   > Email:    ${t.terminal.contact.email} |`,
    '    |                                       |',
    '    +---------------------------------------+',
    ''
  ].join('\n');
}

function getSiteContent(lang: Language): string {
  const t = translations[lang];
  return [
    '',
    `    ${t.terminal.site.description}`,
    '    ',
    `    NAME: ${t.terminal.site.name}`,
    `    TYPE: ${t.terminal.site.type}`,
    `    TECH: ${t.terminal.site.tech}`,
    `    DESC: ${t.terminal.site.desc}`,
    ''
  ].join('\n');
}

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
  const [language, setLanguage] = useState<Language | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const t = language ? translations[language] : translations.en;

  const [currentDir, setCurrentDir] = useState<Directory | null>(null);
  const currentPrompt = currentDir ? `C:${currentDir.path}>` : 'C:\\>';

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [showCursor, setShowCursor] = useState(true);
  const [dosText, setDosText] = useState('');
  const [showAboutImage, setShowAboutImage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleLanguageModeSelect = (lang: Language, selectedMode: Mode) => {
    setLanguage(lang);
    setMode(selectedMode);
    const root = createRoot(lang);
    addParentLinks(root, null);
    setCurrentDir(root);
    const defaultText = getDefaultText(lang);
    setDosText(defaultText + '\n' + `C:${root.path}>`);
  };

  const getDefaultText = (lang: Language): string => {
    const t = translations[lang];
    return [
      ...t.terminal.default.header,
      '',
      'C:\\>DIR',
      t.terminal.default.volume,
      t.terminal.default.serial,
      '',
      `${t.terminal.default.directory}\\`,
      '',
      'PROJECTS     <DIR>      11-08-25  9:10a',
      'SKILLS       <DIR>      11-08-25  9:02a',
      'ABOUT    TXT       1,024 11-07-25  4:55p',
      'CONTACT  BAT         256 11-08-25  9:11a',
      `       2 ${t.terminal.default.files}          1,280 ${t.terminal.default.bytes}`,
      `       2 ${t.terminal.default.dirs}   4,194,304 ${t.terminal.default.free}`,
      '',
      t.terminal.default.helpInstruction,
    ].join('\n');
  };

  useEffect(() => {
    const timerId = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 153);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    if (!language || !mode || mode !== 'advanced' || !currentDir) return;
    
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
            setShowAboutImage(false);
            return currentPrompt;
          }

          if (finalCommand === "restart") {
            const root = createRoot(language);
            addParentLinks(root, null);
            setCurrentDir(root);
            setShowAboutImage(false);
            const defaultText = getDefaultText(language);
            return defaultText + '\n' + `C:${root.path}>`;
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
                return prev + `\n${t.terminal.errors.invalidDir}\n` + currentPrompt;
              }
            }
            return prev + `\n${t.terminal.errors.invalidDir}\n` + currentPrompt;
          }

          if (finalCommand.startsWith("start ")) {
            const fileName = finalCommand.substring(6).trim();

            if (currentDir.children && currentDir.children.hasOwnProperty(fileName)) {
              const fileEntry = currentDir.children[fileName];

              if (fileEntry.type === 'file') {
                if (fileEntry.content) {
                  if (fileName.toLowerCase() === 'about') {
                    setShowAboutImage(true);
                  } else {
                    setShowAboutImage(false);
                  }
                  return prev + "\n" + fileEntry.content + "\n" + currentPrompt;
                } else {
                  setShowAboutImage(false);
                  return prev + `\n${t.terminal.errors.emptyFile.replace('{fileName}', fileName)}\n` + currentPrompt;
                }
              } else {
                setShowAboutImage(false);
                return prev + `\n${t.terminal.errors.cannotStartDir.replace('{fileName}', fileName)}\n` + currentPrompt;
              }
            }
            setShowAboutImage(false);
            return prev + `\n${t.terminal.errors.fileNotFound} ${fileName}\n` + currentPrompt;
          }

          if (finalCommand === "help") {
            return prev + "\n" + t.terminal.commands.help + "\n" + currentPrompt;
          }
          return prev + `\n${t.terminal.errors.illegalCommand} ${finalCommand}\n` + currentPrompt;
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
  }, [dosText, currentDir, commandHistory, historyIndex, language, mode, t]);

  const executeCommand = (command: string) => {
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
        setShowAboutImage(false);
        return currentPrompt;
      }

          if (finalCommand === "restart") {
            if (!language) return prev;
            const root = createRoot(language);
            addParentLinks(root, null);
            setCurrentDir(root);
            setShowAboutImage(false);
            const defaultText = getDefaultText(language);
            return defaultText + '\n' + `C:${root.path}>`;
          }

      if (finalCommand === "dir") {
        if (!currentDir) return prev;
        const dirOutput = generateDirOutput(currentDir);
        return prev + "\n" + dirOutput + currentPrompt;
      }
      
      if (finalCommand.startsWith("cd ")){
        if (!currentDir) return prev;
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
            return prev + `\n${t.terminal.errors.invalidDir}\n` + currentPrompt;
          }
        }
        return prev + `\n${t.terminal.errors.invalidDir}\n` + currentPrompt;
      }

      if (finalCommand.startsWith("start ")) {
        if (!currentDir) return prev;
        const fileName = finalCommand.substring(6).trim();

        if (currentDir.children && currentDir.children.hasOwnProperty(fileName)) {
          const fileEntry = currentDir.children[fileName];

          if (fileEntry.type === 'file') {
            if (fileEntry.content) {

              if (fileName.toLowerCase() === 'about') {
                setShowAboutImage(true);
              } else {
                setShowAboutImage(false);
              }
              return prev + "\n" + fileEntry.content + "\n" + currentPrompt;
            } else {
              setShowAboutImage(false);
              return prev + `\nFile '${fileName}' is empty.\n` + currentPrompt;
            }
          } else {
            setShowAboutImage(false);
            return prev + `\nCannot start '${fileName}', it is a directory.\n` + currentPrompt;
          }
        }
        setShowAboutImage(false);
        return prev + `\nFile not found: ${fileName}\n` + currentPrompt;
      }

      if (finalCommand === "help") {
        return prev + "\n" + t.terminal.commands.help + "\n" + currentPrompt;
      }
      return prev + `\n${t.terminal.errors.illegalCommand} ${finalCommand}\n` + currentPrompt;
    });

    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 0);
  };

  const typeCommand = (command: string) => {
    if (isTyping || !currentDir || !language) return;
    
    setIsTyping(true);
    const prompt = `C:${currentDir.path}>`;
    
    setDosText(prev => {
      const lastLineIdx = prev.lastIndexOf('\n');
      const base = prev.substring(0, lastLineIdx + 1);
      return base + prompt;
    });
    

    const totalDelay = command.length * 50;
    command.split('').forEach((char, index) => {
      setTimeout(() => {
        setDosText(prev => {
          const lastLineIdx = prev.lastIndexOf('\n');
          const base = prev.substring(0, lastLineIdx + 1);
          return base + prompt + command.substring(0, index + 1);
        });
      }, index * 50);
    });
    

    setTimeout(() => {
      const finalCommand = command.trim().toLowerCase();
      
      if (finalCommand && !commandHistory.includes(finalCommand)) {
        setCommandHistory(prev => [...prev, finalCommand]);
      }
      setHistoryIndex(-1);

      setDosText((prev: string) => {
        if (finalCommand === "cls" || finalCommand === "clear") {
          setShowAboutImage(false);
          setIsTyping(false);
          return prompt;
        }

        if (finalCommand === "restart") {
          if (!language) return prev;
          const root = createRoot(language);
          addParentLinks(root, null);
          setCurrentDir(root);
          setShowAboutImage(false);
          setIsTyping(false);
          const defaultText = getDefaultText(language);
          return defaultText + '\n' + `C:${root.path}>`;
        }

        if (finalCommand === "dir") {
          if (!currentDir) return prev;
          const dirOutput = generateDirOutput(currentDir);
          setIsTyping(false);
          return prev + "\n" + dirOutput + prompt;
        }
        
        if (finalCommand.startsWith("cd ")){
          if (!currentDir) return prev;
          const targetDirName = finalCommand.substring(3).trim();

          if (targetDirName === "..") {
            if (currentDir.parent) {
              setCurrentDir(currentDir.parent);
              setIsTyping(false);
              return prev + "\n" + `C:${currentDir.parent.path}>`;
            } else {
              setIsTyping(false);
              return prev + "\n" + prompt;
            }
          }

          if (currentDir.children && currentDir.children.hasOwnProperty(targetDirName)){
            const newEntry = currentDir.children[targetDirName];

            if (newEntry.type === 'dir') {
              setCurrentDir(newEntry as Directory);
              setIsTyping(false);
              return prev + "\n" + `C:${newEntry.path}>`;
            } else {
              setIsTyping(false);
              return prev + `\n${t.terminal.errors.invalidDir}\n` + prompt;
            }
          }
          setIsTyping(false);
          return prev + `\n${t.terminal.errors.invalidDir}\n` + prompt;
        }

        if (finalCommand.startsWith("start ")) {
          if (!currentDir) return prev;
          const fileName = finalCommand.substring(6).trim();

          if (currentDir.children && currentDir.children.hasOwnProperty(fileName)) {
            const fileEntry = currentDir.children[fileName];

            if (fileEntry.type === 'file') {
              if (fileEntry.content) {
                if (fileName.toLowerCase() === 'about') {
                  setShowAboutImage(true);
                } else {
                  setShowAboutImage(false);
                }
                setIsTyping(false);
                return prev + "\n" + fileEntry.content + "\n" + prompt;
              } else {
                setShowAboutImage(false);
                setIsTyping(false);
                return prev + `\nFile '${fileName}' is empty.\n` + prompt;
              }
            } else {
              setShowAboutImage(false);
              setIsTyping(false);
              return prev + `\nCannot start '${fileName}', it is a directory.\n` + prompt;
            }
          }
          setShowAboutImage(false);
          setIsTyping(false);
          return prev + `\nFile not found: ${fileName}\n` + prompt;
        }

        if (finalCommand === "help") {
          setIsTyping(false);
          return prev + "\n" + t.terminal.commands.help + "\n" + prompt;
        }
        setIsTyping(false);
        return prev + `\nIllegal command: ${finalCommand}\n` + prompt;
      });

      setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
    }, totalDelay + 200);
  };

  const getAvailableCommands = () => {
    if (!language || !currentDir) return [];
    
    const baseCommands = mode === 'beginner' ? [
      { label: t.buttons.help, command: 'help' },
      { label: t.buttons.listFiles, command: 'dir' },
      { label: t.buttons.clear, command: 'cls' },
      { label: t.buttons.restart, command: 'restart' },
    ] : [
      { label: 'help', command: 'help' },
      { label: 'dir', command: 'dir' },
      { label: 'cls', command: 'cls' },
      { label: 'restart', command: 'restart' },
    ];

    const dirCommands: Array<{ label: string; command: string }> = [];
    const fileCommands: Array<{ label: string; command: string }> = [];

    if (currentDir.parent) {
      dirCommands.push({ 
        label: mode === 'beginner' ? t.buttons.goBack : 'cd ..', 
        command: 'cd ..' 
      });
    }

    if (currentDir.children) {
      Object.entries(currentDir.children).forEach(([name, entry]) => {
        if (entry.type === 'dir') {
          const label = mode === 'beginner' 
            ? (name === 'projects' ? t.buttons.goToProjects : name === 'skills' ? t.buttons.goToSkills : `cd ${name}`)
            : `cd ${name}`;
          dirCommands.push({ label, command: `cd ${name}` });
        } else {
          const label = mode === 'beginner'
            ? (name === 'about' ? t.buttons.viewAbout : name === 'contact' ? t.buttons.viewContact : name === 'site.txt' ? t.buttons.viewProject : `start ${name}`)
            : `start ${name}`;
          fileCommands.push({ label, command: `start ${name}` });
        }
      });
    }

    return [...baseCommands, ...dirCommands, ...fileCommands];
  };

  const availableCommands = getAvailableCommands();

  if (!language || !mode) {
    return (
      <main className={styles.main}>
        <LanguageModeSelector onSelect={handleLanguageModeSelect} />
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <CrtScreen imageSrc={showAboutImage ? '/5.jpeg' : undefined}>
        {dosText}
        {showCursor && "_"}
      </CrtScreen>
      {mode === 'beginner' && (
        <div className={styles.mobileButtons}>
          {availableCommands.map((cmd) => (
            <button
              key={cmd.command}
              className={styles.commandButton}
              onClick={() => typeCommand(cmd.command)}
              disabled={isTyping}
            >
              {cmd.label}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}