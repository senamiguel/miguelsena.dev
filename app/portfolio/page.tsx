"use client";
import CrtScreen from '@/components/CrtScreen';
import LanguageModeSelector from '@/components/LanguageModeSelector';
import styles from './page.module.css';
import { useState, useEffect, useRef } from 'react';
import { Language, Mode, translations } from './translations';
import { executeCommand, Directory, FileSystemNode, getCommandNames } from './commands';

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

// Content generation functions
function getAboutContent(lang: Language): string {
  const t = translations[lang];
  const width = 39; 

  const centerText = (text: string): string => {
    const clean = text.trim();
    const totalPadding = width - clean.length;
    if (totalPadding < 0) {
      return clean.substring(0, width);
    }
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
  const width = 39;

  const centerText = (text: string): string => {
    const clean = text.trim();
    const totalPadding = width - clean.length;
    if (totalPadding < 0) {
      return clean.substring(0, width);
    }
    const left = Math.floor(totalPadding / 2);
    const right = totalPadding - left;
    return ' '.repeat(left) + clean + ' '.repeat(right);
  };

  const padLine = (text: string = '') =>
    `    | ${text.padEnd(width, ' ')} |`;

  return [
    '',
    '    +' + '-'.repeat(width + 2) + '+',
    padLine(),
    `    | ${centerText(t.terminal.contact.title)} |`,
    padLine(),
    '    +' + '-'.repeat(width + 2) + '+',
    padLine(),
    padLine(`> LinkedIn: ${t.terminal.contact.linkedin}`),
    padLine(`> GitHub:   ${t.terminal.contact.github}`),
    padLine(`> Email:    ${t.terminal.contact.email}`),
    padLine(),
    '    +' + '-'.repeat(width + 2) + '+',
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

const createRoot = (lang: Language): Directory => {
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

export default function Home() {
  const [language, setLanguage] = useState<Language | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const t = language ? translations[language] : translations.en;

  const [currentDir, setCurrentDir] = useState<Directory | null>(null);
  const currentPrompt = currentDir ? `C:${currentDir.path}>` : 'C:\\>';

  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Autocomplete state
  const [autoSuggestions, setAutoSuggestions] = useState<string[]>([]);
  const [autoCycleIndex, setAutoCycleIndex] = useState(0);
  const [basePrefix, setBasePrefix] = useState<string>('');
  const [suggestionMode, setSuggestionMode] = useState<'command'|'arg'|null>(null);
  // Static subcommand sets for git & npm (first token after command)
  const gitSubs = [
    'status','log','commit','push','pull','branch','checkout','merge','stash','revert','reset','diff','tag','init','clone','add'
  ];
  const npmSubs = [
    'install','i','ci','run','start','build','test','publish','outdated','update','audit','cache','prune','init'
  ];

  const [showCursor, setShowCursor] = useState(false);
  const [dosText, setDosText] = useState('');
  const [showAboutImage, setShowAboutImage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Helper: progressively append lines to the CRT, then reprint the prompt
  const baitingRef = useRef(false);
  const animateLines = (lines: string[], prompt: string, step = 300) => {
    if (baitingRef.current) return;
    baitingRef.current = true;
    lines.forEach((line, idx) => {
      setTimeout(() => {
        setDosText(prev => prev + (prev.endsWith('\n') ? '' : '\n') + line);
      }, idx * step);
    });
    setTimeout(() => {
      setDosText(prev => prev + '\n' + prompt);
      baitingRef.current = false;
    }, lines.length * step + 50);
  };

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

  const processCommand = (commandLine: string) => {
    if (!currentDir || !language || !mode) return;

    // Special handling for 'sl' command with animation
    if (commandLine.trim().toLowerCase() === 'sl') {
      const frames = [
        "                                                    (  ) (@@) ( )  (@)  ()\n                                                   (@@@)\n                                               (    )\n                                                (@@@@)\n                                              (   )\n\n                                ====        ________                ___________\n                            _D _|  |_______/        \\__I_I_____===__|___________|\n                             |(_)---  |   H\\________/ |   |        =|___ ___|   |\n                             /     |  |   H  |  |     |   |         ||_| |_||   |\n                            |      |  |   H  |__--------------------| [___] |   |\n                            | ________|___H__/__|_____/[][]~\\_______|       |   |\n                            |/ |   |-----------I_____I [][] []  D   |=======|___|\n                            /__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|\n                             |/-=|___|=O=====O=====O=====O   |_____/~\\___/      |\n                              \\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
        "                                       (  ) (@@) ( )  (@)  ()\n                                      (@@@)\n                                  (    )\n                                   (@@@@)\n                                 (   )\n\n                   ====        ________                ___________\n               _D _|  |_______/        \\__I_I_____===__|___________|\n                |(_)---  |   H\\________/ |   |        =|___ ___|   |\n                /     |  |   H  |  |     |   |         ||_| |_||   |\n               |      |  |   H  |__--------------------| [___] |   |\n               | ________|___H__/__|_____/[][]~\\_______|       |   |\n               |/ |   |-----------I_____I [][] []  D   |=======|___|\n               /__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|\n                |/-=|___|=O=====O=====O=====O   |_____/~\\___/      |\n                 \\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
        "          (  ) (@@) ( )  (@)  ()\n         (@@@)\n     (    )\n      (@@@@)\n    (   )\n\n====        ________                ___________\n_D _|  |_______/        \\__I_I_____===__|___________|\n|(_)---  |   H\\________/ |   |        =|___ ___|   |\n/     |  |   H  |  |     |   |         ||_| |_||   |\n|      |  |   H  |__--------------------| [___] |   |\n| ________|___H__/__|_____/[][]~\\_______|       |   |\n|/ |   |-----------I_____I [][] []  D   |=======|___|\n/__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|\n|/-=|___|=O=====O=====O=====O   |_____/~\\___/      |\n\\_/      \\__/  \\__/  \\__/  \\__/      \\_/"
      ];
      
      if (baitingRef.current) return;
      baitingRef.current = true;
      
      const baseText = dosText;
      
      // Show frame 1
      setTimeout(() => {
        setDosText(baseText + "\n\n" + frames[0]);
      }, 0);
      
      // Show frame 2
      setTimeout(() => {
        setDosText(baseText + "\n\n" + frames[1]);
      }, 200);
      
      // Show frame 3
      setTimeout(() => {
        setDosText(baseText + "\n\n" + frames[2]);
      }, 400);
      
      // Show final message
      setTimeout(() => {
        const finalMsg = language === 'pt' 
          ? "\n🚂💨 Choo choo! (A locomotiva passou!)\n(Isso acontece quando voce digita 'ls' errado!)"
          : "\n🚂💨 Choo choo! (Steam Locomotive passed by)\n(This is what happens when you type 'ls' wrong!)";
        setDosText(baseText + finalMsg + "\n" + currentPrompt);
        baitingRef.current = false;
      }, 600);
      
      setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 700);
      return;
    }

    const result = executeCommand(commandLine, {
      currentDir,
      language,
      mode,
      setCurrentDir,
      setShowAboutImage,
      prompt: currentPrompt
    });

    setDosText((prev: string) => {
      // Handle special commands that clear or reset
      if (commandLine.trim().toLowerCase() === 'cls' || commandLine.trim().toLowerCase() === 'clear') {
        return currentPrompt;
      }

      if (commandLine.trim().toLowerCase() === 'restart') {
        const root = createRoot(language);
        addParentLinks(root, null);
        setCurrentDir(root);
        setShowAboutImage(false);
        const defaultText = getDefaultText(language);
        return defaultText + '\n' + `C:${root.path}>`;
      }

      // Handle animated responses
      if (result.animate && result.lines) {
        animateLines(result.lines, currentPrompt);
        return prev;
      }

      // Handle directory changes
      const newPrompt = currentDir ? `C:${currentDir.path}>` : 'C:\\>';
      
      // Regular output
      if (result.output) {
        return prev + '\n' + result.output + '\n' + newPrompt;
      }

      // No output, just update prompt
      return prev + '\n' + newPrompt;
    });

    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 0);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timerId = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 153);

    return () => {
      clearInterval(timerId);
    };
  }, [mounted]);

  useEffect(() => {
    if (!language || !mode || !currentDir || !mounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === "Enter") {
        const lastLineIndex = dosText.lastIndexOf('\n');
        const currentLine = dosText.substring(lastLineIndex + 1);
        const commandText = currentLine.substring(currentPrompt.length);
        const finalCommand = commandText.trim();

        // Reset autocomplete state
        setAutoSuggestions([]);
        setAutoCycleIndex(0);
        setBasePrefix('');
        setSuggestionMode(null);

        if (finalCommand && !commandHistory.includes(finalCommand)) {
          setCommandHistory(prev => [...prev, finalCommand]);
        }
        setHistoryIndex(-1);
        processCommand(finalCommand);
        return;
      }

      if (e.key === "Backspace") {
        setDosText(prev => {
          const lastLineIndex = prev.lastIndexOf('\n');
            const currentLine = prev.substring(lastLineIndex + 1);
            if (currentLine.length > currentPrompt.length) return prev.slice(0, -1);
            return prev;
        });
        return;
      }

      if (e.key === "Tab") {
        const lastLineIndex = dosText.lastIndexOf('\n');
        const currentLine = dosText.substring(lastLineIndex + 1);
        const inputPortion = currentLine.substring(currentPrompt.length);
        const firstSpace = inputPortion.indexOf(' ');

        // COMMAND NAME MODE
        if (firstSpace === -1) {
          const typed = inputPortion.trim();
          if (suggestionMode === 'command' && autoSuggestions.length > 0) {
            // Cycle existing list
            const nextIndex = (autoCycleIndex + 1) % autoSuggestions.length;
            setAutoCycleIndex(nextIndex);
            const chosen = autoSuggestions[nextIndex];
            setDosText(prev => prev.substring(0, lastLineIndex + 1) + currentPrompt + chosen);
            return;
          }
          const pool = typed === '' ? getCommandNames().sort() : getCommandNames().filter(c => c.startsWith(typed.toLowerCase())).sort();
          if (pool.length === 0) {
            setAutoSuggestions([]);
            setSuggestionMode(null);
            setBasePrefix('');
            setAutoCycleIndex(0);
            return;
          }
          setAutoSuggestions(pool);
          setSuggestionMode('command');
          setBasePrefix(typed);
          setAutoCycleIndex(0);
          setDosText(prev => prev.substring(0, lastLineIndex + 1) + currentPrompt + pool[0]);
          return;
        }

        // ARG MODE
        const commandPart = inputPortion.substring(0, firstSpace).trim().toLowerCase();
        const afterCmd = inputPortion.substring(firstSpace + 1);
        const argTokenEnd = afterCmd.indexOf(' ');
        const argPrefixRaw = (argTokenEnd === -1 ? afterCmd : afterCmd.substring(0, argTokenEnd));
        const argPrefix = argPrefixRaw.trim();
        if (argTokenEnd !== -1 && commandPart !== 'git' && commandPart !== 'npm') return; // don't complete deeper args (except git/npm)

        let pool: string[] = [];
        if (commandPart === 'cd' && currentDir) {
          pool = Object.entries(currentDir.children).filter(([, e2]) => e2.type === 'dir').map(([n]) => n);
          pool.unshift('..');
        } else if (commandPart === 'start' && currentDir) {
          pool = Object.entries(currentDir.children).filter(([, e2]) => e2.type === 'file').map(([n]) => n);
        } else if (commandPart === 'git') {
          pool = gitSubs;
        } else if (commandPart === 'npm') {
          pool = npmSubs;
        } else {
          return;
        }

        if (suggestionMode === 'arg' && autoSuggestions.length > 0 && basePrefix === commandPart + ' ' + argPrefix) {
          const nextIndex = (autoCycleIndex + 1) % autoSuggestions.length;
          setAutoCycleIndex(nextIndex);
          const chosenArg = autoSuggestions[nextIndex];
          const remainder = argTokenEnd === -1 ? '' : afterCmd.substring(argTokenEnd);
          setDosText(prev => prev.substring(0, lastLineIndex + 1) + currentPrompt + commandPart + ' ' + chosenArg + remainder);
          return;
        }

        const filtered = argPrefix === '' ? pool.sort() : pool.filter(p => p.startsWith(argPrefix.toLowerCase())).sort();
        if (!filtered.length) {
          setAutoSuggestions([]);
          setSuggestionMode(null);
          setBasePrefix('');
          setAutoCycleIndex(0);
          return;
        }
        setAutoSuggestions(filtered);
        setSuggestionMode('arg');
        setBasePrefix(commandPart + ' ' + argPrefix);
        setAutoCycleIndex(0);
        const chosenArg = filtered[0];
        const remainder = argTokenEnd === -1 ? '' : afterCmd.substring(argTokenEnd);
        setDosText(prev => prev.substring(0, lastLineIndex + 1) + currentPrompt + commandPart + ' ' + chosenArg + remainder);
        return;
      }

      if (e.key === "ArrowLeft") {
        setDosText(prev => {
          const lastLineIndex = prev.lastIndexOf('\n');
          const currentLine = prev.substring(lastLineIndex + 1);
          if (currentLine.length > currentPrompt.length) return prev.slice(0, -1);
          return prev;
        });
        return;
      }

      if (e.key === "ArrowUp") {
        if (commandHistory.length > 0) {
          const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
          setHistoryIndex(newIndex);
          setDosText(prev => {
            const lastLineIndex = prev.lastIndexOf('\n');
            return prev.substring(0, lastLineIndex + 1) + currentPrompt + commandHistory[commandHistory.length - 1 - newIndex];
          });
        }
        return;
      }

      if (e.key === "ArrowDown") {
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
        return;
      }

      if (e.key.length > 1) {
        if (e.key === "ArrowRight" || e.key === "Escape") {
          return; // ignored
        }
      } else {
        // normal character
        if (autoSuggestions.length) {
          setAutoSuggestions([]);
          setAutoCycleIndex(0);
          setBasePrefix('');
          setSuggestionMode(null);
        }
        setDosText(prev => prev + e.key);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dosText, currentDir, commandHistory, historyIndex, language, mode, mounted, currentPrompt, autoSuggestions, autoCycleIndex, basePrefix, suggestionMode]);

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
      const finalCommand = command.trim();
      if (finalCommand && !commandHistory.includes(finalCommand)) {
        setCommandHistory(prev => [...prev, finalCommand]);
      }
      setHistoryIndex(-1);
      processCommand(finalCommand);
      setIsTyping(false);
    }, totalDelay + 200);
  };

  const getAvailableCommands = () => {
    if (!language || !currentDir) return [];
    const tLocal = translations[language];
    const baseCommands = mode === 'beginner' ? [
      { label: tLocal.buttons.help, command: 'help' },
      { label: tLocal.buttons.listFiles, command: 'dir' },
      { label: tLocal.buttons.clear, command: 'cls' },
      { label: tLocal.buttons.restart, command: 'restart' },
    ] : [
      { label: 'help', command: 'help' },
      { label: 'dir', command: 'dir' },
      { label: 'cls', command: 'cls' },
      { label: 'restart', command: 'restart' },
    ];
    const dirCommands: Array<{ label: string; command: string }> = [];
    const fileCommands: Array<{ label: string; command: string }> = [];
    if (currentDir.parent) {
      dirCommands.push({ label: mode === 'beginner' ? tLocal.buttons.goBack : 'cd ..', command: 'cd ..' });
    }
    if (currentDir.children) {
      Object.entries(currentDir.children).forEach(([name, entry]) => {
        if (entry.type === 'dir') {
          const label = mode === 'beginner'
            ? (name === 'projects' ? tLocal.buttons.goToProjects : name === 'skills' ? tLocal.buttons.goToSkills : `cd ${name}`)
            : `cd ${name}`;
          dirCommands.push({ label, command: `cd ${name}` });
        } else {
          const label = mode === 'beginner'
            ? (name === 'about' ? tLocal.buttons.viewAbout : name === 'contact' ? tLocal.buttons.viewContact : name === 'site.txt' ? tLocal.buttons.viewProject : `start ${name}`)
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
        {mounted && showCursor && "_"}
        {autoSuggestions.length > 1 && (
          '\n' + '[ ' + autoSuggestions.join('  ') + ' ]'
        )}
      </CrtScreen>
      <div className={styles.headerButtons}>
        <button
          className={styles.homeButton}
          onClick={() => window.location.href = '/'}
        >
          {t.buttons.goHome}
        </button>
      </div>
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
