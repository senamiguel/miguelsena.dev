/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/exhaustive-deps */

"use client";
import CrtScreen from '@/components/CrtScreen';
import LanguageModeSelector from '@/components/LanguageModeSelector';
import styles from './page.module.css';
import { useState, useEffect, useRef } from 'react';
import { Language, Mode, translations } from './translations';
import { executeCommand, Directory, FileSystemNode } from './commands';




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

const STATIC_DEFAULT_TEXT = [
  'Microsoft(R) MS-DOS(R) Version 6.22',
  '(C)Copyright Microsoft Corp 1981-1994.',
  '',
  'C:\\>DIR',
  ' Volume in drive C is MIGUELSENA.DEV',
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
    `\n Volume in drive C is MIGUELSENA.DEV`,
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

  const [showCursor, setShowCursor] = useState(false);
  const [dosText, setDosText] = useState('');
  const [showAboutImage, setShowAboutImage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Helper: progressively append lines to the CRT, then reprint the prompt
  const baitingRef = useRef(false);
  const baitPrint = (lines: string[], prompt: string, step = 300) => {
    // Prevent duplicate scheduled prints (e.g., dev StrictMode or double handlers)
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

  const tr = (en: string, pt: string) => (language === 'pt' ? pt : en);

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
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
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

          if (finalCommand.startsWith("cd ")) {
            const targetDirName = finalCommand.substring(3).trim();

            if (targetDirName === "..") {
              if (currentDir.parent) {
                setCurrentDir(currentDir.parent);
                return prev + "\n" + `C:${currentDir.parent.path}>`;
              } else {
                if (mode === 'advanced') {
                  window.location.href = '/';
                  return prev;
                }
                return prev + "\n" + currentPrompt;
              }
            }

            if (currentDir.children && currentDir.children.hasOwnProperty(targetDirName)) {
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

          
          if (finalCommand === "rm -rf" || finalCommand === "rm -rf /" || finalCommand === "rm -rf *") {
            const isPt = language === 'pt';
            const lines = isPt
              ? [
                'Deletando todos os arquivos...',
                'Brincadeira! Boa tentativa 😄',
                'Seus arquivos estao seguros... por enquanto.'
              ]
              : [
                'Deleting all files...',
                'Just kidding! Nice try though. 😄',
                'Your files are safe... for now.'
              ];
            baitPrint(lines, currentPrompt);
            return prev;
          }

          if (finalCommand === "sudo rm -rf /" || finalCommand === "sudo rm -rf") {
            const isPt = language === 'pt';
            const lines = isPt
              ? [
                '[sudo] senha para o usuario: ********',
                'ACESSO NEGADO! O que voce estava pensando?! 🚫'
              ]
              : [
                '[sudo] password for user: ********',
                'Access DENIED! What were you thinking?! 🚫'
              ];
            baitPrint(lines, currentPrompt);
            return prev;
          }

          if (finalCommand === "hack" || finalCommand === "hack nasa") {
            const isPt = language === 'pt';
            const lines = isPt
              ? [
                'Iniciando sequencia de invasao...',
                '[████████████] 100%',
                'Acesso negado. Voce nao e o Mr. Robot. 🤖'
              ]
              : [
                'Initiating hack sequence...',
                '[████████████] 100%',
                "Access denied. You're not Mr. Robot. 🤖"
              ];
            baitPrint(lines, currentPrompt);
            return prev;
          }

          if (finalCommand === "matrix") {
            const isPt = language === 'pt';
            const lines = isPt
              ? ['Acorde, Neo...', 'A Matrix pegou voce...', 'Siga o coelho branco. 🐰']
              : ['Wake up, Neo...', 'The Matrix has you...', 'Follow the white rabbit. 🐰'];
            baitPrint(lines, currentPrompt);
            return prev;
          }

          if (finalCommand === "sudo" || finalCommand === "sudo apt-get install") {
            return prev + "\n\n[sudo] password for user: \nSorry, this is MS-DOS, not Linux! 🐧❌\n" + currentPrompt;
          }

          if (finalCommand === "exit" || finalCommand === "quit") {
            const msg = tr(
              "You can checkout anytime you like,\nbut you can never leave! 🎸\n(Try the Home button instead)",
              "Voce pode fazer check-out quando quiser,\nmas nunca podera sair! 🎸\n(Tente o botao Inicio)"
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "pwd") {
            const hint = tr("(But we're using 'cd' here, buddy!)", "(Mas aqui usamos 'cd', beleza?)");
            return prev + `\n\nC:${currentDir?.path || '\\'}\n${hint}\n` + currentPrompt;
          }

          if (finalCommand === "ls" || finalCommand === "ls -la") {
            const msg = tr(
              "This is MS-DOS, not Unix!\nTry 'dir' instead. 💾",
              "Isto e MS-DOS, nao Unix!\nTente 'dir' em vez disso. 💾"
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "vim" || finalCommand === "nano" || finalCommand === "emacs") {
            const msg = tr(
              "Text editors? In MY DOS terminal?\nWe don't do that here. ✍️❌",
              "Editores de texto? No MEU terminal DOS?\nAqui nao fazemos isso. ✍️❌"
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "ping google.com" || finalCommand === "ping") {
            const isPt = language === 'pt';
            const lines = isPt
              ? [
                'Pingando google.com [142.250.185.78]',
                'Tempo esgotado para a solicitacao.',
                'Brincadeira, sem internet pra voce! 📶❌'
              ]
              : [
                'Pinging google.com [142.250.185.78]',
                'Request timed out.',
                'Just kidding, no internet for you! 📶❌'
              ];
            baitPrint(lines, currentPrompt);
            return prev;
          }

          if (finalCommand === "format c:") {
            const isPt = language === 'pt';
            const lines = isPt
              ? [
                'Formatando unidade C: ...',
                'Progresso: [▓▓▓▓▓▓▓▓▓▓] 99%',
                'ERRO: zoeira! 😅'
              ]
              : [
                'Formatting C: drive...',
                'Progress: [▓▓▓▓▓▓▓▓▓▓] 99%',
                'ERROR: Just kidding! 😅'
              ];
            baitPrint(lines, currentPrompt);
            return prev;
          }

          if (finalCommand === "tree") {
            const msg = tr("There's your tree!", "Ta ai sua arvore!");
            return prev + "\n\n🌳\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "whoami") {
            const msg = tr(
              "You are a curious visitor.\nWelcome to my portfolio! 👋",
              "Voce e um visitante curioso.\nBem-vindo ao meu portfolio! 👋"
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "date") {
            const msg = tr(
              "Current date is: 11-13-2025\n(Time is an illusion in DOS) ⏰",
              "Data atual: 13-11-2025\n(O tempo e uma ilusao no DOS) ⏰"
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "time") {
            const msg = tr("Current time is: ADVENTURE TIME! 🕐", "Hora atual: HORA DA AVENTURA! 🕐");
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "echo hello" || finalCommand === "echo") {
            const msg = tr("Hello! 👋 Echo... echo... echo...", "Ola! 👋 Eco... eco... eco...");
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "cat") {
            return prev + "\n\n     /\\_/\\  \n    ( o.o ) \n     > ^ <\n\nMeow! 🐱\n" + currentPrompt;
          }

          if (finalCommand === "sl") {
            if (baitingRef.current) return prev;
            baitingRef.current = true;
            
            const isPt = language === 'pt';
            const baseText = prev;
            
            const frames = [
              "                                                    (  ) (@@) ( )  (@)  ()",
              "                                                   (@@@)",
              "                                               (    )",
              "                                                (@@@@)",
              "                                              (   )",
              "",
              "                                ====        ________                ___________",
              "                            _D _|  |_______/        \\__I_I_____===__|___________|",
              "                             |(_)---  |   H\\________/ |   |        =|___ ___|   |",
              "                             /     |  |   H  |  |     |   |         ||_| |_||   |",
              "                            |      |  |   H  |__--------------------| [___] |   |",
              "                            | ________|___H__/__|_____/[][]~\\_______|       |   |",
              "                            |/ |   |-----------I_____I [][] []  D   |=======|___|",
              "                            /__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|",
              "                             |/-=|___|=O=====O=====O=====O   |_____/~\\___/      |",
              "                              \\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
            ].join('\n');
            
            const frame2 = [
              "                                       (  ) (@@) ( )  (@)  ()",
              "                                      (@@@)",
              "                                  (    )",
              "                                   (@@@@)",
              "                                 (   )",
              "",
              "                   ====        ________                ___________",
              "               _D _|  |_______/        \\__I_I_____===__|___________|",
              "                |(_)---  |   H\\________/ |   |        =|___ ___|   |",
              "                /     |  |   H  |  |     |   |         ||_| |_||   |",
              "               |      |  |   H  |__--------------------| [___] |   |",
              "               | ________|___H__/__|_____/[][]~\\_______|       |   |",
              "               |/ |   |-----------I_____I [][] []  D   |=======|___|",
              "               /__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|",
              "                |/-=|___|=O=====O=====O=====O   |_____/~\\___/      |",
              "                 \\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
            ].join('\n');
            
            const frame3 = [
              "          (  ) (@@) ( )  (@)  ()",
              "         (@@@)",
              "     (    )",
              "      (@@@@)",
              "    (   )",
              "",
              "====        ________                ___________",
              "_D _|  |_______/        \\__I_I_____===__|___________|",
              "|(_)---  |   H\\________/ |   |        =|___ ___|   |",
              "/     |  |   H  |  |     |   |         ||_| |_||   |",
              "|      |  |   H  |__--------------------| [___] |   |",
              "| ________|___H__/__|_____/[][]~\\_______|       |   |",
              "|/ |   |-----------I_____I [][] []  D   |=======|___|",
              "/__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|",
              "|/-=|___|=O=====O=====O=====O   |_____/~\\___/      |",
              "\\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
            ].join('\n');
            
            const finalMsg = isPt 
              ? "\n🚂💨 Choo choo! (A locomotiva passou!)\n(Isso acontece quando voce digita 'ls' errado!)"
              : "\n🚂💨 Choo choo! (Steam Locomotive passed by)\n(This is what happens when you type 'ls' wrong!)";
            
            
            setTimeout(() => {
              setDosText(baseText + "\n\n" + frames);
            }, 0);
            
            
            setTimeout(() => {
              setDosText(baseText + "\n\n" + frame2);
            }, 200);
            
            
            setTimeout(() => {
              setDosText(baseText + "\n\n" + frame3);
            }, 400);
            
            
            setTimeout(() => {
              setDosText(baseText + finalMsg + "\n" + currentPrompt);
              baitingRef.current = false;
            }, 600);
            
            return prev;
          }

          if (finalCommand === "cowsay" || finalCommand === "cowsay hello") {
            return prev + "\n\n _______\n< Hello! >\n -------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n" + currentPrompt;
          }

          if (finalCommand.startsWith("cowsay ")) {
            const message = finalCommand.substring(7).trim();
            if (message && message !== "hello") {
              const msgLength = message.length;
              const border = "_".repeat(msgLength + 2);
              return prev + `\n\n ${border}\n< ${message} >\n ${border.replace(/_/g, "-")}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n` + currentPrompt;
            }
            return prev + "\n\n _______\n< Hello! >\n -------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n" + currentPrompt;
          }

          if (finalCommand === "ipconfig" || finalCommand === "ifconfig") {
            const msg = tr("No place like home! 🏠", "Nada como o lar! 🏠");
            return prev + "\n\nIP Address: 127.0.0.1\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "ping localhost") {
            const msg = tr("Reply from 127.0.0.1: You found yourself! 🎯", "Resposta de 127.0.0.1: Voce se encontrou! 🎯");
            return prev + "\n\nPinging localhost [127.0.0.1]\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand.startsWith("sudo ")) {
            const command = finalCommand.substring(5);
            const msg = tr(
              `[sudo] Nice try, but '${command}' isn't allowed here! 🔒`,
              `[sudo] Boa tentativa, mas '${command}' nao e permitido aqui! 🔒`
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "python" || finalCommand === "node" || finalCommand === "java") {
            const msg = tr(
              `'${finalCommand}' is not recognized as a DOS command.\nThis is a portfolio, not an IDE! 💻`,
              `'${finalCommand}' nao e reconhecido como um comando do DOS.\nIsto e um portfolio, nao uma IDE! 💻`
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "git status") {
            const msg = tr(
              'On branch main\nNothing to commit, living the dream! 🎨',
              'Na branch main\nNada para commitar, vivendo o sonho! 🎨'
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "git push") {
            const msg = tr(
              'Pushing to origin...\nEverything up-to-date! ✅',
              'Enviando para origin...\nTudo atualizado! ✅'
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "npm install") {
            return prev + "\n\ninstalling dependencies...\nadded 1337 packages in 0.420s 📦\n" + currentPrompt;
          }

          if (finalCommand === "make me a sandwich") {
            const msg = tr('What? Make it yourself! 🥪', 'O que? Faca voce mesmo! 🥪');
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "sudo make me a sandwich") {
            const msg1 = tr('Okay. 🥪', 'Beleza. 🥪');
            const msg2 = tr("*poof* There's your sandwich!", '*poof* Ai esta o seu sanduiche!');
            return prev + "\n\n" + msg1 + "\n" + msg2 + "\n" + currentPrompt;
          }

          if (finalCommand === "hello" || finalCommand === "hi") {
            const msg = tr(
              'Hello there! 👋\nThanks for visiting my portfolio!',
              'Ola! 👋\nObrigado por visitar meu portfolio!'
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "coffee" || finalCommand === "tea") {
            const msg = tr(`Here's your ${finalCommand}! ☕`, `Aqui esta seu ${finalCommand}! ☕`);
            return prev + `\n\n    ( (\n     ) )\n  .______.\n  |      |]\n  \\      /\n   \`----'\n\n${msg}\n` + currentPrompt;
          }

          if (finalCommand === "clear all" || finalCommand === "cls all") {
            const msg = tr("Clearing... EVERYTHING!\nJust kidding, use 'cls' for that. 😄", "Limpando... TUDO!\nBrincadeira, use 'cls' pra isso. 😄");
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "hack the planet") {
            const msg = tr('HACK THE PLANET! 🌍\n*plays 90s hacker movie soundtrack*', 'HACKEAR O PLANETA! 🌍\n*toca trilha de filme hacker dos anos 90*');
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "42") {
            const msg = tr(
              'The Answer to the Ultimate Question\nof Life, the Universe, and Everything.\n🌌',
              'A Resposta para a Pergunta Fundamental\nda Vida, do Universo e de Tudo.\n🌌'
            );
            return prev + "\n\n" + msg + "\n" + currentPrompt;
          }

          if (finalCommand === "help") {
            return prev + "\n" + t.terminal.commands.help + "\n" + currentPrompt;
          }

          if (finalCommand === "duda") {
            const isPt = language === 'pt';
            const lines = isPt
              ? [
                '💖 Meu bem, voce e muito especial para mim!',
                'Obrigado por estar sempre ao meu lado.',
                'Te amo! - Miguel',
                '',
                'Para uma namorada incrivel, um easter egg sos seu!'
              ]
              : [
                '💖 Honey, you are very special to me!',
                'Thank you for always being by my side.',
                'I love you! - Miguel',
                '',
                'For an amazing girlfriend, a unique easter egg just for you!'
              ];
            baitPrint(lines, currentPrompt);
            return prev;
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

      if (finalCommand.startsWith("cd ")) {
        if (!currentDir) return prev;
        const targetDirName = finalCommand.substring(3).trim();

        if (targetDirName === "..") {
          if (currentDir.parent) {
            setCurrentDir(currentDir.parent);
            return prev + "\n" + `C:${currentDir.parent.path}>`;
          } else {
            if (mode === 'advanced') {
              window.location.href = '/';
              return prev;
            }
            return prev + "\n" + currentPrompt;
          }
        }

        if (currentDir.children && currentDir.children.hasOwnProperty(targetDirName)) {
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

      
      if (finalCommand === "rm -rf" || finalCommand === "rm -rf /" || finalCommand === "rm -rf *") {
        const isPt = language === 'pt';
        const lines = isPt
          ? [
            'Deletando todos os arquivos...',
            'Brincadeira! Boa tentativa 😄',
            'Seus arquivos estao seguros... por enquanto.'
          ]
          : [
            'Deleting all files...',
            'Just kidding! Nice try though. 😄',
            'Your files are safe... for now.'
          ];
        baitPrint(lines, currentPrompt);
        return prev;
      }

      if (finalCommand === "duda") {
        const isPt = language === 'pt';
        const lines = isPt
          ? [
            '💖 Meu bem, voce e muito especial para mim!',
            'Obrigado por estar sempre ao meu lado.',
            'Te amo! - Miguel',
            '',
            'Para uma namorada incrivel, um easter egg sos seu!'
          ]
          : [
            '💖 Honey, you are very special to me!',
            'Thank you for always being by my side.',
            'I love you! - Miguel',
            '',
            'For an amazing girlfriend, a unique easter egg just for you!'
          ];
        baitPrint(lines, currentPrompt);
        return prev;
      }

      if (finalCommand === "sudo rm -rf /" || finalCommand === "sudo rm -rf") {
        const isPt = language === 'pt';
        const lines = isPt
          ? ['[sudo] senha para o usuario: ********', 'ACESSO NEGADO! O que voce estava pensando?! 🚫']
          : ['[sudo] password for user: ********', 'Access DENIED! What were you thinking?! 🚫'];
        baitPrint(lines, currentPrompt);
        return prev;
      }

      if (finalCommand === "hack" || finalCommand === "hack nasa") {
        const isPt = language === 'pt';
        const lines = isPt
          ? [
            'Iniciando   sequencia de invasao...',
            '[████████████] 100%',
            'Acesso negado. Voce nao e o Mr. Robot. 🤖'
          ]
          : [
            'Initiating hack sequence...',
            '[████████████] 100%',
            "Access denied. You're not Mr. Robot. 🤖"
          ];
        baitPrint(lines, currentPrompt);
        return prev;
      }

      if (finalCommand === "matrix") {
        const isPt = language === 'pt';
        const lines = isPt
          ? ['Acorde, Neo...', 'A Matrix pegou voce...', 'Siga o coelho branco. 🐰']
          : ['Wake up, Neo...', 'The Matrix has you...', 'Follow the white rabbit. 🐰'];
        baitPrint(lines, currentPrompt);
        return prev;
      }

      if (finalCommand === "sudo" || finalCommand === "sudo apt-get install") {
        return prev + "\n\n[sudo] password for user: \nSorry, this is MS-DOS, not Linux! 🐧❌\n" + currentPrompt;
      }

      if (finalCommand === "exit" || finalCommand === "quit") {
        const msg = tr(
          "You can checkout anytime you like,\nbut you can never leave! 🎸\n(Try the Home button instead)",
          "Voce pode fazer check-out quando quiser,\nmas nunca podera sair! 🎸\n(Tente o botao Inicio)"
        );
        return prev + "\n\n" + msg + "\n" + currentPrompt;
      }

      if (finalCommand === "pwd") {
        const hint = tr("(But we're using 'cd' here, buddy!)", "(Mas aqui usamos 'cd', beleza?)");
        return prev + `\n\nC:${currentDir?.path || '\\'}\n${hint}\n` + currentPrompt;
      }

      if (finalCommand === "ls" || finalCommand === "ls -la") {
        const msg = tr(
          "This is MS-DOS, not Unix!\nTry 'dir' instead. 💾",
          "Isto e MS-DOS, nao Unix!\nTente 'dir' em vez disso. 💾"
        );
        return prev + "\n\n" + msg + "\n" + currentPrompt;
      }

      if (finalCommand === "vim" || finalCommand === "nano" || finalCommand === "emacs") {
        const msg = tr(
          "Text editors? In MY DOS terminal?\nWe don't do that here. ✍️❌",
          "Editores de texto? No MEU terminal DOS?\nAqui nao fazemos isso. ✍️❌"
        );
        return prev + "\n\n" + msg + "\n" + currentPrompt;
      }

      if (finalCommand === "ping google.com" || finalCommand === "ping") {
        const isPt = language === 'pt';
        const lines = isPt
          ? [
            'Pingando google.com [142.250.185.78]',
            'Tempo esgotado para a solicitacao.',
            'Brincadeira, sem internet pra voce! 📶❌'
          ]
          : [
            'Pinging google.com [142.250.185.78]',
            'Request timed out.',
            'Just kidding, no internet for you! 📶❌'
          ];
        baitPrint(lines, currentPrompt);
        return prev;
      }

      if (finalCommand === "format c:") {
        const isPt = language === 'pt';
        const lines = isPt
          ? [
            'Formatando unidade C: ...',
            'Progresso: [▓▓▓▓▓▓▓▓▓▓] 99%',
            'ERRO: zoeira! 😅'
          ]
          : [
            'Formatting C: drive...',
            'Progress: [▓▓▓▓▓▓▓▓▓▓] 99%',
            'ERROR: Just kidding! 😅'
          ];
        baitPrint(lines, currentPrompt);
        return prev;
      }

      if (finalCommand === "tree") {
        const msg = tr("There's your tree!", "Ta ai sua arvore!");
        return prev + "\n\n🌳\n" + msg + "\n" + currentPrompt;
      }

      if (finalCommand === "whoami") {
        const msg = tr(
          "You are a curious visitor.\nWelcome to my portfolio! 👋",
          "Voce e um visitante curioso.\nBem-vindo ao meu portfolio! 👋"
        );
        return prev + "\n\n" + msg + "\n" + currentPrompt;
      }

      if (finalCommand === "date") {
        const msg = tr(
          "Current date is: 11-13-2025\n(Time is an illusion in DOS) ⏰",
          "Data atual: 13-11-2025\n(O tempo e uma ilusao no DOS) ⏰"
        );
        return prev + "\n\n" + msg + "\n" + currentPrompt;
      }

      if (finalCommand === "time") {
        const msg = tr("Current time is: ADVENTURE TIME! 🕐", "Hora atual: HORA DA AVENTURA! 🕐");
        return prev + "\n\n" + msg + "\n" + currentPrompt;
      }

      if (finalCommand === "echo hello" || finalCommand === "echo") {
        const msg = tr("Hello! 👋 Echo... echo... echo...", "Ola! 👋 Eco... eco... eco...");
        return prev + "\n\n" + msg + "\n" + currentPrompt;
      }

      if (finalCommand === "cat") {
        return prev + "\n\n     /\\_/\\  \n    ( o.o ) \n     > ^ <\n\nMeow! 🐱\n" + currentPrompt;
      }

      if (finalCommand === "sl") {
        if (baitingRef.current) return prev;
        baitingRef.current = true;
        
        const isPt = language === 'pt';
        const baseText = prev;
        
        const frames = [
          "                                                    (  ) (@@) ( )  (@)  ()",
          "                                                   (@@@)",
          "                                               (    )",
          "                                                (@@@@)",
          "                                              (   )",
          "",
          "                                ====        ________                ___________",
          "                            _D _|  |_______/        \\__I_I_____===__|___________|",
          "                             |(_)---  |   H\\________/ |   |        =|___ ___|   |",
          "                             /     |  |   H  |  |     |   |         ||_| |_||   |",
          "                            |      |  |   H  |__--------------------| [___] |   |",
          "                            | ________|___H__/__|_____/[][]~\\_______|       |   |",
          "                            |/ |   |-----------I_____I [][] []  D   |=======|___|",
          "                            /__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|",
          "                             |/-=|___|=O=====O=====O=====O   |_____/~\\___/      |",
          "                              \\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
        ].join('\n');
        
        const frame2 = [
          "                                       (  ) (@@) ( )  (@)  ()",
          "                                      (@@@)",
          "                                  (    )",
          "                                   (@@@@)",
          "                                 (   )",
          "",
          "                   ====        ________                ___________",
          "               _D _|  |_______/        \\__I_I_____===__|___________|",
          "                |(_)---  |   H\\________/ |   |        =|___ ___|   |",
          "                /     |  |   H  |  |     |   |         ||_| |_||   |",
          "               |      |  |   H  |__--------------------| [___] |   |",
          "               | ________|___H__/__|_____/[][]~\\_______|       |   |",
          "               |/ |   |-----------I_____I [][] []  D   |=======|___|",
          "               /__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|",
          "                |/-=|___|=O=====O=====O=====O   |_____/~\\___/      |",
          "                 \\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
        ].join('\n');
        
        const frame3 = [
          "          (  ) (@@) ( )  (@)  ()",
          "         (@@@)",
          "     (    )",
          "      (@@@@)",
          "    (   )",
          "",
          "====        ________                ___________",
          "_D _|  |_______/        \\__I_I_____===__|___________|",
          "|(_)---  |   H\\________/ |   |        =|___ ___|   |",
          "/     |  |   H  |  |     |   |         ||_| |_||   |",
          "|      |  |   H  |__--------------------| [___] |   |",
          "| ________|___H__/__|_____/[][]~\\_______|       |   |",
          "|/ |   |-----------I_____I [][] []  D   |=======|___|",
          "/__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|",
          "|/-=|___|=O=====O=====O=====O   |_____/~\\___/      |",
          "\\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
        ].join('\n');
        
        const finalMsg = isPt 
          ? "\n🚂💨 Choo choo! (A locomotiva passou!)\n(Isso acontece quando voce digita 'ls' errado!)"
          : "\n🚂💨 Choo choo! (Steam Locomotive passed by)\n(This is what happens when you type 'ls' wrong!)";
        
        
        setTimeout(() => {
          setDosText(baseText + "\n\n" + frames);
        }, 0);
        
        
        setTimeout(() => {
          setDosText(baseText + "\n\n" + frame2);
        }, 200);
        
        
        setTimeout(() => {
          setDosText(baseText + "\n\n" + frame3);
        }, 400);
        
        
        setTimeout(() => {
          setDosText(baseText + finalMsg + "\n" + currentPrompt);
          baitingRef.current = false;
        }, 600);
        
        return prev;
      }

      if (finalCommand === "cowsay" || finalCommand === "cowsay hello") {
        return prev + "\n\n _______\n< Hello! >\n -------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n" + currentPrompt;
      }

      if (finalCommand.startsWith("cowsay ")) {
        const message = finalCommand.substring(7).trim();
        if (message && message !== "hello") {
          const msgLength = message.length;
          const border = "_".repeat(msgLength + 2);
          return prev + `\n\n ${border}\n< ${message} >\n ${border.replace(/_/g, "-")}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n` + currentPrompt;
        }
        return prev + "\n\n _______\n< Hello! >\n -------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n" + currentPrompt;
      }

      if (finalCommand === "ipconfig" || finalCommand === "ifconfig") {
        return prev + "\n\nIP Address: 127.0.0.1\nNo place like home! 🏠\n" + currentPrompt;
      }

      if (finalCommand === "ping localhost") {
        return prev + "\n\nPinging localhost [127.0.0.1]\nReply from 127.0.0.1: You found yourself! 🎯\n" + currentPrompt;
      }

      if (finalCommand.startsWith("sudo ")) {
        const command = finalCommand.substring(5);
        return prev + `\n\n[sudo] Nice try, but '${command}' isn't allowed here! 🔒\n` + currentPrompt;
      }

      if (finalCommand === "python" || finalCommand === "node" || finalCommand === "java") {
        return prev + `\n\n'${finalCommand}' is not recognized as a DOS command.\nThis is a portfolio, not an IDE! 💻\n` + currentPrompt;
      }

      if (finalCommand === "git status") {
        return prev + "\n\nOn branch main\nNothing to commit, living the dream! 🎨\n" + currentPrompt;
      }

      if (finalCommand === "git push") {
        return prev + "\n\nPushing to origin...\nEverything up-to-date! ✅\n" + currentPrompt;
      }

      if (finalCommand === "npm install") {
        return prev + "\n\ninstalling dependencies...\nadded 1337 packages in 0.420s 📦\n" + currentPrompt;
      }

      if (finalCommand === "make me a sandwich") {
        return prev + "\n\nWhat? Make it yourself! 🥪\n" + currentPrompt;
      }

      if (finalCommand === "sudo make me a sandwich") {
        return prev + "\n\nOkay. 🥪\n*poof* There's your sandwich!\n" + currentPrompt;
      }

      if (finalCommand === "hello" || finalCommand === "hi") {
        return prev + "\n\nHello there! 👋\nThanks for visiting my portfolio!\n" + currentPrompt;
      }

      if (finalCommand === "coffee" || finalCommand === "tea") {
        return prev + `\n\n    ( (\n     ) )\n  .______.\n  |      |]\n  \\      /\n   \`----'\n\nHere's your ${finalCommand}! ☕\n` + currentPrompt;
      }

      if (finalCommand === "clear all" || finalCommand === "cls all") {
        return prev + "\n\nClearing... EVERYTHING!\nJust kidding, use 'cls' for that. 😄\n" + currentPrompt;
      }

      if (finalCommand === "hack the planet") {
        return prev + "\n\nHACK THE PLANET! 🌍\n*plays 90s hacker movie soundtrack*\n" + currentPrompt;
      }

      if (finalCommand === "42") {
        return prev + "\n\nThe Answer to the Ultimate Question\nof Life, the Universe, and Everything.\n🌌\n" + currentPrompt;
      }

      if (finalCommand === "help") {
        return prev + "\n" + t.terminal.commands.help + "\n" + currentPrompt;
      }
      return prev + `\nIllegal command: ${finalCommand}\n` + currentPrompt;
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

        if (finalCommand.startsWith("cd ")) {
          if (!currentDir) return prev;
          const targetDirName = finalCommand.substring(3).trim();

          if (targetDirName === "..") {
            if (currentDir.parent) {
              setCurrentDir(currentDir.parent);
              setIsTyping(false);
              return prev + "\n" + `C:${currentDir.parent.path}>`;
            } else {
              setIsTyping(false);
              if (mode === 'advanced') {
                window.location.href = '/';
                return prev;
              }
              return prev + "\n" + prompt;
            }
          }

          if (currentDir.children && currentDir.children.hasOwnProperty(targetDirName)) {
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

        
        if (finalCommand === "rm -rf" || finalCommand === "rm -rf /" || finalCommand === "rm -rf *") {
          setIsTyping(false);
          const isPt = language === 'pt';
          const lines = isPt
            ? ['Deletando todos os arquivos...', 'Brincadeira! Boa tentativa 😄', 'Seus arquivos estao seguros... por enquanto.']
            : ['Deleting all files...', 'Just kidding! Nice try though. 😄', 'Your files are safe... for now.'];
          baitPrint(lines, prompt);
          return prev;
        }

        if (finalCommand === "duda") {
          const isPt = language === 'pt';
          const lines = isPt
            ? [
              '💖 Meu bem, voce e muito especial para mim!',
              'Obrigado por estar sempre ao meu lado.',
              'Te amo! - Miguel',
              '',
              'Para uma namorada incrivel, um easter egg sos seu!'
            ]
            : [
              '💖 Honey, you are very special to me!',
              'Thank you for always being by my side.',
              'I love you! - Miguel',
              '',
              'For an amazing girlfriend, a unique easter egg just for you!'
            ];
          baitPrint(lines, prompt);
          return prev;
        }

        if (finalCommand === "sudo rm -rf /" || finalCommand === "sudo rm -rf") {
          setIsTyping(false);
          const isPt = language === 'pt';
          const lines = isPt
            ? ['[sudo] senha para o usuario: ********', 'ACESSO NEGADO! O que voce estava pensando?! 🚫']
            : ['[sudo] password for user: ********', 'Access DENIED! What were you thinking?! 🚫'];
          baitPrint(lines, prompt);
          return prev;
        }

        if (finalCommand === "hack" || finalCommand === "hack nasa") {
          setIsTyping(false);
          const isPt = language === 'pt';
          const lines = isPt
            ? [
              'Iniciando sequencia de invasao...',
              '[████████████] 100%',
              'Acesso negado. Voce nao e o Mr. Robot. 🤖'
            ]
            : [
              'Initiating hack sequence...',
              '[████████████] 100%',
              "Access denied. You're not Mr. Robot. 🤖"
            ];
          baitPrint(lines, prompt);
          setIsTyping(false);
          return prev;
        }

        if (finalCommand === "sl") {
          setIsTyping(false);
          if (baitingRef.current) return prev;
          baitingRef.current = true;
          
          const isPt = language === 'pt';
          const baseText = prev;
          
          const frames = [
            "                                                    (  ) (@@) ( )  (@)  ()",
            "                                                   (@@@)",
            "                                               (    )",
            "                                                (@@@@)",
            "                                              (   )",
            "",
            "                                ====        ________                ___________",
            "                            _D _|  |_______/        \\__I_I_____===__|___________|",
            "                             |(_)---  |   H\\________/ |   |        =|___ ___|   |",
            "                             /     |  |   H  |  |     |   |         ||_| |_||   |",
            "                            |      |  |   H  |__--------------------| [___] |   |",
            "                            | ________|___H__/__|_____/[][]~\\_______|       |   |",
            "                            |/ |   |-----------I_____I [][] []  D   |=======|___|",
            "                            /__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|",
            "                             |/-=|___|=O=====O=====O=====O   |_____/~\\___/      |",
            "                              \\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
          ].join('\n');
          
          const frame2 = [
            "                                       (  ) (@@) ( )  (@)  ()",
            "                                      (@@@)",
            "                                  (    )",
            "                                   (@@@@)",
            "                                 (   )",
            "",
            "                   ====        ________                ___________",
            "               _D _|  |_______/        \\__I_I_____===__|___________|",
            "                |(_)---  |   H\\________/ |   |        =|___ ___|   |",
            "                /     |  |   H  |  |     |   |         ||_| |_||   |",
            "               |      |  |   H  |__--------------------| [___] |   |",
            "               | ________|___H__/__|_____/[][]~\\_______|       |   |",
            "               |/ |   |-----------I_____I [][] []  D   |=======|___|",
            "               /__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|",
            "                |/-=|___|=O=====O=====O=====O   |_____/~\\___/      |",
            "                 \\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
          ].join('\n');
          
          const frame3 = [
            "          (  ) (@@) ( )  (@)  ()",
            "         (@@@)",
            "     (    )",
            "      (@@@@)",
            "    (   )",
            "",
            "====        ________                ___________",
            "_D _|  |_______/        \\__I_I_____===__|___________|",
            "|(_)---  |   H\\________/ |   |        =|___ ___|   |",
            "/     |  |   H  |  |     |   |         ||_| |_||   |",
            "|      |  |   H  |__--------------------| [___] |   |",
            "| ________|___H__/__|_____/[][]~\\_______|       |   |",
            "|/ |   |-----------I_____I [][] []  D   |=======|___|",
            "/__/=| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__|",
            "|/-=|___|=O=====O=====O=====O   |_____/~\\___/      |",
            "\\_/      \\__/  \\__/  \\__/  \\__/      \\_/",
          ].join('\n');
          
          const finalMsg = isPt 
            ? "\n🚂💨 Choo choo! (A locomotiva passou!)\n(Isso acontece quando voce digita 'ls' errado!)"
            : "\n🚂💨 Choo choo! (Steam Locomotive passed by)\n(This is what happens when you type 'ls' wrong!)";
          
          
          setTimeout(() => {
            setDosText(baseText + "\n\n" + frames);
          }, 0);
          
          
          setTimeout(() => {
            setDosText(baseText + "\n\n" + frame2);
          }, 200);
          
          
          setTimeout(() => {
            setDosText(baseText + "\n\n" + frame3);
          }, 400);
          
          
          setTimeout(() => {
            setDosText(baseText + finalMsg + "\n" + prompt);
            baitingRef.current = false;
          }, 600);
          
          return prev;
        }

        if (finalCommand === "cowsay" || finalCommand === "cowsay hello") {
          setIsTyping(false);
          return prev + "\n\n _______\n< Hello! >\n -------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n" + prompt;
        }

        if (finalCommand.startsWith("cowsay ")) {
          setIsTyping(false);
          const message = finalCommand.substring(7).trim();
          if (message && message !== "hello") {
            const msgLength = message.length;
            const border = "_".repeat(msgLength + 2);
            return prev + `\n\n ${border}\n< ${message} >\n ${border.replace(/_/g, "-")}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n` + prompt;
          }
          return prev + "\n\n _______\n< Hello! >\n -------\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||\n" + prompt;
        }

        if (finalCommand === "ipconfig" || finalCommand === "ifconfig") {
          setIsTyping(false);
          const msg = tr("No place like home! 🏠", "Nada como o lar! 🏠");
          return prev + "\n\nIP Address: 127.0.0.1\n" + msg + "\n" + prompt;
        }

        if (finalCommand === "ping localhost") {
          setIsTyping(false);
          const msg = tr("Reply from 127.0.0.1: You found yourself! 🎯", "Resposta de 127.0.0.1: Voce se encontrou! 🎯");
          return prev + "\n\nPinging localhost [127.0.0.1]\n" + msg + "\n" + prompt;
        }

        if (finalCommand.startsWith("sudo ")) {
          const command = finalCommand.substring(5);
          setIsTyping(false);
          const msg = tr(
            `[sudo] Nice try, but '${command}' isn't allowed here! 🔒`,
            `[sudo] Boa tentativa, mas '${command}' nao e permitido aqui! 🔒`
          );
          return prev + "\n\n" + msg + "\n" + prompt;
        }

        if (finalCommand === "python" || finalCommand === "node" || finalCommand === "java") {
          setIsTyping(false);
          const msg = tr(
            `'${finalCommand}' is not recognized as a DOS command.\nThis is a portfolio, not an IDE! 💻`,
            `'${finalCommand}' nao e reconhecido como um comando do DOS.\nIsto e um portfolio, nao uma IDE! 💻`
          );
          return prev + "\n\n" + msg + "\n" + prompt;
        }

        if (finalCommand === "git status") {
          setIsTyping(false);
          const msg = tr(
            'On branch main\nNothing to commit, living the dream! 🎨',
            'Na branch main\nNada para commitar, vivendo o sonho! 🎨'
          );
          return prev + "\n\n" + msg + "\n" + prompt;
        }

        if (finalCommand === "git push") {
          setIsTyping(false);
          const msg = tr(
            'Pushing to origin...\nEverything up-to-date! ✅',
            'Enviando para origin...\nTudo atualizado! ✅'
          );
          return prev + "\n\n" + msg + "\n" + prompt;
        }

        if (finalCommand === "npm install") {
          setIsTyping(false);
          const isPt = language === 'pt';
          const lines = isPt
            ? ['Instalando dependencias...', 'Baixando pacotes...', 'Compilando...', 'Adicionados 1337 pacotes em 0.420s 📦']
            : ['installing dependencies...', 'fetching packages...', 'building...', 'added 1337 packages in 0.420s 📦'];
          baitPrint(lines, prompt);
          return prev;
        }

        if (finalCommand === "make me a sandwich") {
          setIsTyping(false);
          const msg = tr('What? Make it yourself! 🥪', 'O que? Faca voce mesmo! 🥪');
          return prev + "\n\n" + msg + "\n" + prompt;
        }

        if (finalCommand === "sudo make me a sandwich") {
          setIsTyping(false);
          const msg1 = tr('Okay. 🥪', 'Beleza. 🥪');
          const msg2 = tr("*poof* There's your sandwich!", '*poof* Ai esta o seu sanduiche!');
          return prev + "\n\n" + msg1 + "\n" + msg2 + "\n" + prompt;
        }

        if (finalCommand === "hello" || finalCommand === "hi") {
          setIsTyping(false);
          const msg = tr(
            'Hello there! 👋\nThanks for visiting my portfolio!',
            'Ola! 👋\nObrigado por visitar meu portfolio!'
          );
          return prev + "\n\n" + msg + "\n" + prompt;
        }

        if (finalCommand === "coffee" || finalCommand === "tea") {
          setIsTyping(false);
          const msg = tr(`Here's your ${finalCommand}! ☕`, `Aqui esta seu ${finalCommand}! ☕`);
          return prev + `\n\n    ( (\n     ) )\n  .______.\n  |      |]\n  \\      /\n   \`----'\n\n${msg}\n` + prompt;
        }

        if (finalCommand === "clear all" || finalCommand === "cls all") {
          setIsTyping(false);
          const msg = tr("Clearing... EVERYTHING!\nJust kidding, use 'cls' for that. 😄", "Limpando... TUDO!\nBrincadeira, use 'cls' pra isso. 😄");
          return prev + "\n\n" + msg + "\n" + prompt;
        }

        if (finalCommand === "hack the planet") {
          setIsTyping(false);
          const msg = tr('HACK THE PLANET! 🌍\n*plays 90s hacker movie soundtrack*', 'HACKEAR O PLANETA! 🌍\n*toca trilha de filme hacker dos anos 90*');
          return prev + "\n\n" + msg + "\n" + prompt;
        }

        if (finalCommand === "42") {
          setIsTyping(false);
          const msg = tr(
            'The Answer to the Ultimate Question\nof Life, the Universe, and Everything.\n🌌',
            'A Resposta para a Pergunta Fundamental\nda Vida, do Universo e de Tudo.\n🌌'
          );
          return prev + "\n\n" + msg + "\n" + prompt;
        }

        if (finalCommand === "help") {
          setIsTyping(false);
          return prev + "\n" + t.terminal.commands.help + "\n" + prompt;
        }
        if (finalCommand === "duda") {
          setIsTyping(false);
          const isPt = language === 'pt';
          const lines = isPt
            ? [
              '💖 Meu bem, voce e muito especial para mim!',
              'Obrigado por estar sempre ao meu lado.',
              'Te amo! - Miguel',
              '',
              'Para uma namorada incrivel, um easter egg sos seu!'
            ]
            : [
              '💖 Honey, you are very special to me!',
              'Thank you for always being by my side.',
              'I love you! - Miguel',
              '',
              'For an amazing girlfriend, a unique easter egg just for you!'
            ];
          baitPrint(lines, prompt);
          return prev;
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
        {mounted && showCursor && "_"}
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