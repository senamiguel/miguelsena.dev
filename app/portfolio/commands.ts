import { Language, translations } from './translations';

export interface Directory {
  path: string;
  children: { [key: string]: FileSystemNode };
  parent?: Directory;
}

export interface FileSystemNode {
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

export interface CommandContext {
  currentDir: Directory;
  language: Language;
  mode: 'beginner' | 'advanced';
  setCurrentDir: (dir: Directory) => void;
  setShowAboutImage: (show: boolean) => void;
  prompt: string;
}

export interface CommandResult {
  output: string;
  animate?: boolean;
  lines?: string[];
  // If provided, UI will render next prompt using this path (e.g., after 'cd')
  promptPath?: string;
}

export type CommandHandler = (
  args: string,
  ctx: CommandContext
) => CommandResult | void;

// Command registry
const commands: Record<string, CommandHandler> = {};

export function registerCommand(name: string, handler: CommandHandler) {
  commands[name] = handler;
}

export function executeCommand(
  commandLine: string,
  ctx: CommandContext
): CommandResult {
  const trimmed = commandLine.trim();
  if (trimmed === '') return { output: '' };
  const firstSpace = trimmed.indexOf(' ');
  const command = (firstSpace === -1 ? trimmed : trimmed.slice(0, firstSpace)).toLowerCase();
  const args = firstSpace === -1 ? '' : trimmed.slice(firstSpace + 1); // preserve original casing & spacing of args

  const handler = commands[command];
  if (handler) {
    const result = handler(args, ctx);
    if (result) return result;
  }

  // Friendly fallback with suggestions
  const names = Object.keys(commands);
  const starts = names.filter(n => n.startsWith(command)).slice(0, 6);
  const contains = names.filter(n => !n.startsWith(command) && n.includes(command)).slice(0, 6 - starts.length);
  const suggestions = [...starts, ...contains];
  if (suggestions.length) {
    const list = suggestions.join(', ');
    return {
      output: tr(
        ctx,
        `Unknown command: ${commandLine}\nDid you mean: ${list}?\nTip: type 'help' to see available commands.`,
        `Comando desconhecido: ${commandLine}\nVoce quis dizer: ${list}?\nDica: digite 'help' para ver os comandos disponiveis.`
      )
    };
  }

  return { output: tr(ctx,
    `Unknown command: ${commandLine}\nTip: type 'help' to see available commands.`,
    `Comando desconhecido: ${commandLine}\nDica: digite 'help' para ver os comandos disponiveis.`
  ) };
}

// Return a snapshot of registered command names (lowercase)
export function getCommandNames(): string[] {
  return Object.keys(commands);
}

// Helper to get translation
function tr(ctx: CommandContext, en: string, pt: string): string {
  return ctx.language === 'pt' ? pt : en;
}

// ============================================================================
// SYSTEM COMMANDS
// ============================================================================

registerCommand('cls', (args, ctx) => {
  ctx.setShowAboutImage(false);
  return { output: '' };
});

registerCommand('clear', (args, ctx) => {
  ctx.setShowAboutImage(false);
  return { output: '' };
});

registerCommand('restart', (args, ctx) => {
  ctx.setShowAboutImage(false);
  const t = translations[ctx.language];
  const defaultText = [
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
  
  return { output: defaultText };
});

registerCommand('help', (args, ctx) => {
  const t = translations[ctx.language];
  return { output: t.terminal.commands.help };
});

// ============================================================================
// FILE SYSTEM COMMANDS
// ============================================================================

registerCommand('dir', (args, ctx) => {
  const lines = [
    '',
    ' Volume in drive C is MIGUELSENA.DEV',
    ' Volume Serial Number is 1994-0A0D',
    '',
    ` Directory of C:${ctx.currentDir.path}`,
    ''
  ];

  let fileCount = 0;
  let dirCount = 0;
  let totalFileSize = 0;

  for (const [name, entry] of Object.entries(ctx.currentDir.children)) {
    const upperName = name.toUpperCase();
    
    if (entry.type === 'dir') {
      const namePart = upperName.padEnd(13);
      lines.push(`${namePart}<DIR>      ${entry.date}  ${entry.time}`);
      dirCount++;
    } else {
      const namePart = upperName.padEnd(8);
      const extPart = (entry.extension || "").padEnd(4);
      const sizePart = (entry.size || 0).toString().padStart(10);
      lines.push(`${namePart} ${extPart} ${sizePart} ${entry.date}  ${entry.time}`);
      fileCount++;
      totalFileSize += entry.size || 0;
    }
  }

  const totalSizeStr = totalFileSize.toLocaleString();
  lines.push(`       ${fileCount} file(s) ${totalSizeStr.padStart(13)} bytes`);
  lines.push(`       ${dirCount} dir(s)   4,194,304 bytes free`);
  lines.push('');

  return { output: lines.join('\n') };
});

registerCommand('cd', (args, ctx) => {
  const t = translations[ctx.language];
  const targetDirName = args.trim();

  if (targetDirName === '..') {
    if (ctx.currentDir.parent) {
      ctx.setCurrentDir(ctx.currentDir.parent);
      return { output: '', promptPath: ctx.currentDir.parent.path };
    } else {
      if (ctx.mode === 'advanced') {
        window.location.href = '/';
        return { output: '' };
      }
      return { output: '' };
    }
  }

  if (ctx.currentDir.children && ctx.currentDir.children.hasOwnProperty(targetDirName)) {
    const newEntry = ctx.currentDir.children[targetDirName];

    if (newEntry.type === 'dir') {
      ctx.setCurrentDir(newEntry as Directory);
      return { output: '', promptPath: (newEntry as Directory).path };
    } else {
      // Trying to cd into a file -> hint to use start
      return {
        output: tr(
          ctx,
          `That's a file. Use 'start ${targetDirName}' to open it.`,
          `Isso e um arquivo. Use 'start ${targetDirName}' para abrir.`
        )
      };
    }
  }
  
  return { output: t.terminal.errors.invalidDir };
});

registerCommand('start', (args, ctx) => {
  const t = translations[ctx.language];
  const fileName = args.trim();

  if (ctx.currentDir.children && ctx.currentDir.children.hasOwnProperty(fileName)) {
    const fileEntry = ctx.currentDir.children[fileName];

    if (fileEntry.type === 'file') {
      if (fileEntry.content) {
        if (fileName.toLowerCase() === 'about') {
          ctx.setShowAboutImage(true);
        } else {
          ctx.setShowAboutImage(false);
        }
        return { output: fileEntry.content };
      } else {
        ctx.setShowAboutImage(false);
        return { output: t.terminal.errors.emptyFile.replace('{fileName}', fileName) };
      }
    } else {
      // Trying to start a directory -> hint to use cd
      ctx.setShowAboutImage(false);
      return {
        output: tr(
          ctx,
          `That's a directory. Use 'cd ${fileName}' to enter it.`,
          `Isso e uma pasta. Use 'cd ${fileName}' para entrar.`
        )
      };
    }
  }
  
  ctx.setShowAboutImage(false);
  return { output: `${t.terminal.errors.fileNotFound} ${fileName}` };
});

// ============================================================================
// UNIX COMMANDS (WITH HINTS)
// ============================================================================

registerCommand('ls', (args, ctx) => {
  return {
    output: tr(ctx,
      "This is MS-DOS, not Unix!\nTry 'dir' instead. 💾",
      "Isto e MS-DOS, nao Unix!\nTente 'dir' em vez disso. 💾"
    )
  };
});

registerCommand('pwd', (args, ctx) => {
  const hint = tr(ctx, "(But we're using 'cd' here, buddy!)", "(Mas aqui usamos 'cd', beleza?)");
  return { output: `C:${ctx.currentDir?.path || '\\'}\n${hint}` };
});

registerCommand('exit', (args, ctx) => {
  return {
    output: tr(ctx,
      "You can checkout anytime you like,\nbut you can never leave! 🎸\n(Try the Home button instead)",
      "Voce pode fazer check-out quando quiser,\nmas nunca podera sair! 🎸\n(Tente o botao Inicio)"
    )
  };
});

registerCommand('quit', (args, ctx) => {
  return commands['exit'](args, ctx);
});

registerCommand('sudo', (args, ctx) => {
  if (args.trim() === '') {
    return {
      output: "\n[sudo] password for user: \nSorry, this is MS-DOS, not Linux! 🐧❌"
    };
  }
  
  const command = args.trim();
  return {
    output: tr(ctx,
      `[sudo] Nice try, but '${command}' isn't allowed here! 🔒`,
      `[sudo] Boa tentativa, mas '${command}' nao e permitido aqui! 🔒`
    )
  };
});

// ============================================================================
// EASTER EGGS
// ============================================================================

registerCommand('rm', (args, ctx) => {
  const trimmed = args.trim();
  if (trimmed === '-rf' || trimmed === '-rf /' || trimmed === '-rf *') {
    return {
      output: '',
      animate: true,
      lines: tr(ctx,
        'Deleting all files...|Just kidding! Nice try though. 😄|Your files are safe... for now.',
        'Deletando todos os arquivos...|Brincadeira! Boa tentativa 😄|Seus arquivos estao seguros... por enquanto.'
      ).split('|')
    };
  }
});

registerCommand('hack', (args, ctx) => {
  return {
    output: '',
    animate: true,
    lines: tr(ctx,
      'Initiating hack sequence...|[████████████] 100%|Access denied. You\'re not Mr. Robot. 🤖',
      'Iniciando sequencia de invasao...|[████████████] 100%|Acesso negado. Voce nao e o Mr. Robot. 🤖'
    ).split('|')
  };
});

registerCommand('matrix', (args, ctx) => {
  return {
    output: '',
    animate: true,
    lines: tr(ctx,
      'Wake up, Neo...|The Matrix has you...|Follow the white rabbit. 🐰',
      'Acorde, Neo...|A Matrix pegou voce...|Siga o coelho branco. 🐰'
    ).split('|')
  };
});

registerCommand('ping', (args, ctx) => {
  return {
    output: '',
    animate: true,
    lines: tr(ctx,
      'Pinging google.com [142.250.185.78]|Request timed out.|Just kidding, no internet for you! 📶❌',
      'Pingando google.com [142.250.185.78]|Tempo esgotado para a solicitacao.|Brincadeira, sem internet pra voce! 📶❌'
    ).split('|')
  };
});

registerCommand('format', (args, ctx) => {
  if (args.trim() === 'c:') {
    return {
      output: '',
      animate: true,
      lines: tr(ctx,
        'Formatting C: drive...|Progress: [▓▓▓▓▓▓▓▓▓▓] 99%|ERROR: Just kidding! 😅',
        'Formatando unidade C: ...|Progresso: [▓▓▓▓▓▓▓▓▓▓] 99%|ERRO: zoeira! 😅'
      ).split('|')
    };
  }
});

registerCommand('tree', (args, ctx) => {
  return {
    output: `🌳\n${tr(ctx, "There's your tree!", "Ta ai sua arvore!")}`
  };
});

registerCommand('whoami', (args, ctx) => {
  return {
    output: tr(ctx,
      "You are a curious visitor.\nWelcome to my portfolio! 👋",
      "Voce e um visitante curioso.\nBem-vindo ao meu portfolio! 👋"
    )
  };
});

registerCommand('date', (args, ctx) => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  return {
    output: tr(ctx,
      `Current date is: ${month}-${day}-${year}\n(Time is an illusion in DOS) ⏰`,
      `Data atual: ${day}-${month}-${year}\n(O tempo e uma ilusao no DOS) ⏰`
    )
  };
});

registerCommand('time', (args, ctx) => {
  return {
    output: tr(ctx, "Current time is: ADVENTURE TIME! 🕐", "Hora atual: HORA DA AVENTURA! 🕐")
  };
});

// Fun easter eggs
registerCommand('42', (args, ctx) => {
  return {
    output: tr(
      ctx,
      "The Answer to the Ultimate Question of Life, the Universe, and Everything is... 42. 🌌",
      "A Resposta Para a Grande Pergunta da Vida, do Universo e de Tudo mais =... 42. 🌌."
    )
  };
});

registerCommand('duda', (args, ctx) => {
  const heart = [
    "  __  __   __  __  ",
    " /  \\/  \\ /  \\/  \\",
    " \\      / \\      / ",
    "  \\    /   \\    /  ",
    "   \\__/     \\__/   ",
  ].join('\n');
  const msg = tr(
    ctx,
    "For Duda: thanks for being the brightest part of my universe. ❤",
    "Para a Duda: voce e a parte mais brilhante do meu universo. ❤"
  );
  return { output: `${heart}\n\n${msg}` };
});

registerCommand('echo', (args, ctx) => {
  // DOS style: echo with no args prints a blank line. Otherwise just output the raw args.
  if (args === '') return { output: '' };
  return { output: args };
});

registerCommand('cat', (args, ctx) => {
  return {
    output: "     /\\_/\\  \n    ( o.o ) \n     > ^ <\n\nMeow! 🐱"
  };
});

registerCommand('sl', (args, ctx) => {
  return {
    output: tr(ctx,
      "🚂💨 Choo choo! (Steam Locomotive passed by)\n(This is what happens when you type 'ls' wrong!)",
      "🚂💨 Choo choo! (A locomotiva passou!)\n(Isso acontece quando voce digita 'ls' errado!)"
    )
  };
});

registerCommand('cowsay', (args, ctx) => {
  const message = args.trim() || 'Hello!';
  const msgLength = message.length;
  const border = "_".repeat(msgLength + 2);
  
  return {
    output: ` ${border}\n< ${message} >\n ${border.replace(/_/g, "-")}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`
  };
});

registerCommand('ipconfig', (args, ctx) => {
  return {
    output: `IP Address: 127.0.0.1\n${tr(ctx, "No place like home! 🏠", "Nada como o lar! 🏠")}`
  };
});

registerCommand('ifconfig', (args, ctx) => {
  return commands['ipconfig'](args, ctx);
});

registerCommand('python', (args, ctx) => {
  if (args.trim() === '') {
    return {
      output: `    ____        __  __                 
   / __ \\__  __/ /_/ /_  ____  ____   
  / /_/ / / / / __/ __ \\/ __ \\/ __ \\  
 / ____/ /_/ / /_/ / / / /_/ / / / /  
/_/    \\__, /\\__/_/ /_/\\____/_/ /_/   
      /____/                          

${tr(ctx,
  "Python 3.13.0 (MS-DOS port)\nType 'help' for more information.\n>>> import this\nThe Zen of Python:\n- Simple is better than complex.\n- Now is better than never.\n- But you can't actually run Python here! 🐍",
  "Python 3.13.0 (versao MS-DOS)\nDigite 'help' para mais informacoes.\n>>> import this\nO Zen do Python:\n- Simples e melhor que complexo.\n- Agora e melhor que nunca.\n- Mas voce nao pode rodar Python aqui! 🐍"
)}`
    };
  }
  
  return {
    output: tr(ctx,
      `>>> ${args}\nSyntaxError: This is a portfolio, not a Python interpreter! 🐍`,
      `>>> ${args}\nSyntaxError: Isto e um portfolio, nao um interpretador Python! 🐍`
    )
  };
});

registerCommand('node', (args, ctx) => {
  if (args.trim() === '' || args.trim() === '--version' || args.trim() === '-v') {
    return {
      output: `
   _   _           _        _     
  | \\ | | ___   __| | ___  (_)___ 
  |  \\| |/ _ \\ / _\` |/ _ \\ | / __|
  | |\\  | (_) | (_| |  __/_| \\__ \\
  |_| \\_|\\___/ \\__,_|\\___(_) |___/
                          |__/    

${tr(ctx,
  "Node.js v22.11.0\nWelcome to Node.js REPL.\n> console.log('Hello from the terminal!')\nHello from the terminal!\n> process.exit()\nJust kidding! This isn't real Node.js 😄",
  "Node.js v22.11.0\nBem-vindo ao Node.js REPL.\n> console.log('Ola do terminal!')\nOla do terminal!\n> process.exit()\nBrincadeira! Isso nao e Node.js de verdade 😄"
)}`
    };
  }
  
  if (args.includes('.js')) {
    return {
      output: tr(ctx,
        `node: attempting to run '${args}'\nError: File system is read-only in this dimension! 📁🔒`,
        `node: tentando executar '${args}'\nErro: Sistema de arquivos e somente leitura nesta dimensao! 📁🔒`
      )
    };
  }
  
  return {
    output: tr(ctx,
      `> ${args}\nReferenceError: This is a portfolio terminal, not a JS runtime! 💚`,
      `> ${args}\nReferenceError: Este e um terminal de portfolio, nao um runtime JS! 💚`
    )
  };
});

registerCommand('java', (args, ctx) => {
  if (args.trim() === '' || args.trim() === '-version' || args.trim() === '--version') {
    return {
      output: `
     _                  
    | | __ ___   ____ _ 
 _  | |/ _\` \\ \\ / / _\` |
| |_| | (_| |\\ V / (_| |
 \\___/ \\__,_| \\_/ \\__,_|

${tr(ctx,
  "java version \"21.0.1\" 2023-10-17 LTS\nJava(TM) SE Runtime Environment (build 21.0.1+12-LTS-29)\nJava HotSpot(TM) 64-Bit Server VM (build 21.0.1+12-LTS-29)\n\nBut this is MS-DOS, so no JVM for you! ☕❌",
  "java version \"21.0.1\" 2023-10-17 LTS\nJava(TM) SE Runtime Environment (build 21.0.1+12-LTS-29)\nJava HotSpot(TM) 64-Bit Server VM (build 21.0.1+12-LTS-29)\n\nMas isso e MS-DOS, entao sem JVM pra voce! ☕❌"
)}`
    };
  }
  
  if (args.includes('.java') || args.includes('.class')) {
    return {
      output: tr(ctx,
        `javac: compiling ${args}\nError: OutOfMemoryError: MS-DOS ran out of conventional memory!\n(640K ought to be enough for anybody) 💾`,
        `javac: compilando ${args}\nErro: OutOfMemoryError: MS-DOS ficou sem memoria convencional!\n(640K deveria ser suficiente para qualquer um) 💾`
      )
    };
  }
  
  return {
    output: tr(ctx,
      `Exception in thread "main":\nPortfolioException: Cannot run Java in a DOS terminal!\n  at miguel.portfolio.Terminal.main(Terminal.java:1994) ☕`,
      `Exception in thread "main":\nPortfolioException: Nao pode rodar Java num terminal DOS!\n  at miguel.portfolio.Terminal.main(Terminal.java:1994) ☕`
    )
  };
});

// ============================================================================
// EASTER EGGS
// ============================================================================

registerCommand('rm', (args, ctx) => {
  const trimmed = args.trim();
  if (trimmed === '-rf' || trimmed === '-rf /' || trimmed === '-rf *') {
    return {
      output: '',
      animate: true,
      lines: tr(ctx,
        'Deleting all files...|Just kidding! Nice try though. 😄|Your files are safe... for now.',
        'Deletando todos os arquivos...|Brincadeira! Boa tentativa 😄|Seus arquivos estao seguros... por enquanto.'
      ).split('|')
    };
  }
});

registerCommand('hack', (args, ctx) => {
  return {
    output: '',
    animate: true,
    lines: tr(ctx,
      'Initiating hack sequence...|[████████████] 100%|Access denied. You\'re not Mr. Robot. 🤖',
      'Iniciando sequencia de invasao...|[████████████] 100%|Acesso negado. Voce nao e o Mr. Robot. 🤖'
    ).split('|')
  };
});

registerCommand('matrix', (args, ctx) => {
  return {
    output: '',
    animate: true,
    lines: tr(ctx,
      'Wake up, Neo...|The Matrix has you...|Follow the white rabbit. 🐰',
      'Acorde, Neo...|A Matrix pegou voce...|Siga o coelho branco. 🐰'
    ).split('|')
  };
});

registerCommand('ping', (args, ctx) => {
  return {
    output: '',
    animate: true,
    lines: tr(ctx,
      'Pinging google.com [142.250.185.78]|Request timed out.|Just kidding, no internet for you! 📶❌',
      'Pingando google.com [142.250.185.78]|Tempo esgotado para a solicitacao.|Brincadeira, sem internet pra voce! 📶❌'
    ).split('|')
  };
});

registerCommand('format', (args, ctx) => {
  if (args.trim() === 'c:') {
    return {
      output: '',
      animate: true,
      lines: tr(ctx,
        'Formatting C: drive...|Progress: [▓▓▓▓▓▓▓▓▓▓] 99%|ERROR: Just kidding! 😅',
        'Formatando unidade C: ...|Progresso: [▓▓▓▓▓▓▓▓▓▓] 99%|ERRO: zoeira! 😅'
      ).split('|')
    };
  }
});

registerCommand('tree', (args, ctx) => {
  return {
    output: `🌳\n${tr(ctx, "There's your tree!", "Ta ai sua arvore!")}`
  };
});

registerCommand('whoami', (args, ctx) => {
  return {
    output: tr(ctx,
      "You are a curious visitor.\nWelcome to my portfolio! 👋",
      "Voce e um visitante curioso.\nBem-vindo ao meu portfolio! 👋"
    )
  };
});

registerCommand('date', (args, ctx) => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  return {
    output: tr(ctx,
      `Current date is: ${month}-${day}-${year}\n(Time is an illusion in DOS) ⏰`,
      `Data atual: ${day}-${month}-${year}\n(O tempo e uma ilusao no DOS) ⏰`
    )
  };
});

registerCommand('time', (args, ctx) => {
  return {
    output: tr(ctx, "Current time is: ADVENTURE TIME! 🕐", "Hora atual: HORA DA AVENTURA! 🕐")
  };
});

registerCommand('echo', (args, ctx) => {
  if (args === '') return { output: '' };
  return { output: args };
}),

registerCommand('cat', (args, ctx) => {
  return {
    output: "     /\\_/\\  \n    ( o.o ) \n     > ^ <\n\nMeow! 🐱"
  };
});

registerCommand('sl', (args, ctx) => {
  return {
    output: tr(ctx,
      "🚂💨 Choo choo! (Steam Locomotive passed by)\n(This is what happens when you type 'ls' wrong!)",
      "🚂💨 Choo choo! (A locomotiva passou!)\n(Isso acontece quando voce digita 'ls' errado!)"
    )
  };
});

registerCommand('cowsay', (args, ctx) => {
  const message = args.trim() || 'Hello!';
  const msgLength = message.length;
  const border = "_".repeat(msgLength + 2);
  
  return {
    output: ` ${border}\n< ${message} >\n ${border.replace(/_/g, "-")}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`
  };
});

registerCommand('ipconfig', (args, ctx) => {
  return {
    output: `IP Address: 127.0.0.1\n${tr(ctx, "No place like home! 🏠", "Nada como o lar! 🏠")}`
  };
});

registerCommand('ifconfig', (args, ctx) => {
  return commands['ipconfig'](args, ctx);
});

registerCommand('python', (args, ctx) => {
  if (args.trim() === '') {
    return {
      output: `    ____        __  __                 
   / __ \\__  __/ /_/ /_  ____  ____   
  / /_/ / / / / __/ __ \\/ __ \\/ __ \\  
 / ____/ /_/ / /_/ / / / /_/ / / / /  
/_/    \\__, /\\__/_/ /_/\\____/_/ /_/   
      /____/                          

${tr(ctx,
  "Python 3.13.0 (MS-DOS port)\nType 'help' for more information.\n>>> import this\nThe Zen of Python:\n- Simple is better than complex.\n- Now is better than never.\n- But you can't actually run Python here! 🐍",
  "Python 3.13.0 (versao MS-DOS)\nDigite 'help' para mais informacoes.\n>>> import this\nO Zen do Python:\n- Simples e melhor que complexo.\n- Agora e melhor que nunca.\n- Mas voce nao pode rodar Python aqui! 🐍"
)}`
    };
  }
  
  return {
    output: tr(ctx,
      `>>> ${args}\nSyntaxError: This is a portfolio, not a Python interpreter! 🐍`,
      `>>> ${args}\nSyntaxError: Isto e um portfolio, nao um interpretador Python! 🐍`
    )
  };
});

registerCommand('node', (args, ctx) => {
  if (args.trim() === '' || args.trim() === '--version' || args.trim() === '-v') {
    return {
      output: `
   _   _           _        _     
  | \\ | | ___   __| | ___  (_)___ 
  |  \\| |/ _ \\ / _\` |/ _ \\ | / __|
  | |\\  | (_) | (_| |  __/_| \\__ \\
  |_| \\_|\\___/ \\__,_|\\___(_) |___/
                          |__/    

${tr(ctx,
  "Node.js v22.11.0\nWelcome to Node.js REPL.\n> console.log('Hello from the terminal!')\nHello from the terminal!\n> process.exit()\nJust kidding! This isn't real Node.js 😄",
  "Node.js v22.11.0\nBem-vindo ao Node.js REPL.\n> console.log('Ola do terminal!')\nOla do terminal!\n> process.exit()\nBrincadeira! Isso nao e Node.js de verdade 😄"
)}`
    };
  }
  
  if (args.includes('.js')) {
    return {
      output: tr(ctx,
        `node: attempting to run '${args}'\nError: File system is read-only in this dimension! 📁🔒`,
        `node: tentando executar '${args}'\nErro: Sistema de arquivos e somente leitura nesta dimensao! 📁🔒`
      )
    };
  }
  
  return {
    output: tr(ctx,
      `> ${args}\nReferenceError: This is a portfolio terminal, not a JS runtime! 💚`,
      `> ${args}\nReferenceError: Este e um terminal de portfolio, nao um runtime JS! 💚`
    )
  };
});

registerCommand('java', (args, ctx) => {
  if (args.trim() === '' || args.trim() === '-version' || args.trim() === '--version') {
    return {
      output: `
     _                  
    | | __ ___   ____ _ 
 _  | |/ _\` \\ \\ / / _\` |
| |_| | (_| |\\ V / (_| |
 \\___/ \\__,_| \\_/ \\__,_|

${tr(ctx,
  "java version \"21.0.1\" 2023-10-17 LTS\nJava(TM) SE Runtime Environment (build 21.0.1+12-LTS-29)\nJava HotSpot(TM) 64-Bit Server VM (build 21.0.1+12-LTS-29)\n\nBut this is MS-DOS, so no JVM for you! ☕❌",
  "java version \"21.0.1\" 2023-10-17 LTS\nJava(TM) SE Runtime Environment (build 21.0.1+12-LTS-29)\nJava HotSpot(TM) 64-Bit Server VM (build 21.0.1+12-LTS-29)\n\nMas isso e MS-DOS, entao sem JVM pra voce! ☕❌"
)}`
    };
  }
  
  if (args.includes('.java') || args.includes('.class')) {
    return {
      output: tr(ctx,
        `javac: compiling ${args}\nError: OutOfMemoryError: MS-DOS ran out of conventional memory!\n(640K ought to be enough for anybody) 💾`,
        `javac: compilando ${args}\nErro: OutOfMemoryError: MS-DOS ficou sem memoria convencional!\n(640K deveria ser suficiente para qualquer um) 💾`
      )
    };
  }
  
  return {
    output: tr(ctx,
      `Exception in thread "main":\nPortfolioException: Cannot run Java in a DOS terminal!\n  at miguel.portfolio.Terminal.main(Terminal.java:1994) ☕`,
      `Exception in thread "main":\nPortfolioException: Nao pode rodar Java num terminal DOS!\n  at miguel.portfolio.Terminal.main(Terminal.java:1994) ☕`
    )
  };
});

// ============================================================================
// EASTER EGGS
// ============================================================================

registerCommand('rm', (args, ctx) => {
  const trimmed = args.trim();
  if (trimmed === '-rf' || trimmed === '-rf /' || trimmed === '-rf *') {
    return {
      output: '',
      animate: true,
      lines: tr(ctx,
        'Deleting all files...|Just kidding! Nice try though. 😄|Your files are safe... for now.',
        'Deletando todos os arquivos...|Brincadeira! Boa tentativa 😄|Seus arquivos estao seguros... por enquanto.'
      ).split('|')
    };
  }
});

registerCommand('hack', (args, ctx) => {
  return {
    output: '',
    animate: true,
    lines: tr(ctx,
      'Initiating hack sequence...|[████████████] 100%|Access denied. You\'re not Mr. Robot. 🤖',
      'Iniciando sequencia de invasao...|[████████████] 100%|Acesso negado. Voce nao e o Mr. Robot. 🤖'
    ).split('|')
  };
});

registerCommand('matrix', (args, ctx) => {
  return {
    output: '',
    animate: true,
    lines: tr(ctx,
      'Wake up, Neo...|The Matrix has you...|Follow the white rabbit. 🐰',
      'Acorde, Neo...|A Matrix pegou voce...|Siga o coelho branco. 🐰'
    ).split('|')
  };
});

registerCommand('ping', (args, ctx) => {
  return {
    output: '',
    animate: true,
    lines: tr(ctx,
      'Pinging google.com [142.250.185.78]|Request timed out.|Just kidding, no internet for you! 📶❌',
      'Pingando google.com [142.250.185.78]|Tempo esgotado para a solicitacao.|Brincadeira, sem internet pra voce! 📶❌'
    ).split('|')
  };
});

registerCommand('format', (args, ctx) => {
  if (args.trim() === 'c:') {
    return {
      output: '',
      animate: true,
      lines: tr(ctx,
        'Formatting C: drive...|Progress: [▓▓▓▓▓▓▓▓▓▓] 99%|ERROR: Just kidding! 😅',
        'Formatando unidade C: ...|Progresso: [▓▓▓▓▓▓▓▓▓▓] 99%|ERRO: zoeira! 😅'
      ).split('|')
    };
  }
});

registerCommand('tree', (args, ctx) => {
  return {
    output: `🌳\n${tr(ctx, "There's your tree!", "Ta ai sua arvore!")}`
  };
});

registerCommand('whoami', (args, ctx) => {
  return {
    output: tr(ctx,
      "You are a curious visitor.\nWelcome to my portfolio! 👋",
      "Voce e um visitante curioso.\nBem-vindo ao meu portfolio! 👋"
    )
  };
});

registerCommand('date', (args, ctx) => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  return {
    output: tr(ctx,
      `Current date is: ${month}-${day}-${year}\n(Time is an illusion in DOS) ⏰`,
      `Data atual: ${day}-${month}-${year}\n(O tempo e uma ilusao no DOS) ⏰`
    )
  };
});

registerCommand('time', (args, ctx) => {
  return {
    output: tr(ctx, "Current time is: ADVENTURE TIME! 🕐", "Hora atual: HORA DA AVENTURA! 🕐")
  };
});

registerCommand('echo', (args, ctx) => {
  if (args === '') return { output: '' };
  return { output: args };
});

registerCommand('cat', (args, ctx) => {
  return {
    output: "     /\\_/\\  \n    ( o.o ) \n     > ^ <\n\nMeow! 🐱"
  };
});

registerCommand('sl', (args, ctx) => {
  return {
    output: tr(ctx,
      "🚂💨 Choo choo! (Steam Locomotive passed by)\n(This is what happens when you type 'ls' wrong!)",
      "🚂💨 Choo choo! (A locomotiva passou!)\n(Isso acontece quando voce digita 'ls' errado!)"
    )
  };
});

registerCommand('cowsay', (args, ctx) => {
  const message = args.trim() || 'Hello!';
  const msgLength = message.length;
  const border = "_".repeat(msgLength + 2);
  
  return {
    output: ` ${border}\n< ${message} >\n ${border.replace(/_/g, "-")}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`
  };
});

registerCommand('ipconfig', (args, ctx) => {
  return {
    output: `IP Address: 127.0.0.1\n${tr(ctx, "No place like home! 🏠", "Nada como o lar! 🏠")}`
  };
});

registerCommand('ifconfig', (args, ctx) => {
  return commands['ipconfig'](args, ctx);
});

registerCommand('python', (args, ctx) => {
  if (args.trim() === '') {
    return {
      output: `    ____        __  __                 
   / __ \\__  __/ /_/ /_  ____  ____   
  / /_/ / / / / __/ __ \\/ __ \\/ __ \\  
 / ____/ /_/ / /_/ / / / /_/ / / / /  
/_/    \\__, /\\__/_/ /_/\\____/_/ /_/   
      /____/                          

${tr(ctx,
  "Python 3.13.0 (MS-DOS port)\nType 'help' for more information.\n>>> import this\nThe Zen of Python:\n- Simple is better than complex.\n- Now is better than never.\n- But you can't actually run Python here! 🐍",
  "Python 3.13.0 (versao MS-DOS)\nDigite 'help' para mais informacoes.\n>>> import this\nO Zen do Python:\n- Simples e melhor que complexo.\n- Agora e melhor que nunca.\n- Mas voce nao pode rodar Python aqui! 🐍"
)}`
    };
  }
  
  return {
    output: tr(ctx,
      `>>> ${args}\nSyntaxError: This is a portfolio, not a Python interpreter! 🐍`,
      `>>> ${args}\nSyntaxError: Isto e um portfolio, nao um interpretador Python! 🐍`
    )
  };
});

registerCommand('node', (args, ctx) => {
  if (args.trim() === '' || args.trim() === '--version' || args.trim() === '-v') {
    return {
      output: `
   _   _           _        _     
  | \\ | | ___   __| | ___  (_)___ 
  |  \\| |/ _ \\ / _\` |/ _ \\ | / __|
  | |\\  | (_) | (_| |  __/_| \\__ \\
  |_| \\_|\\___/ \\__,_|\\___(_) |___/
                          |__/    

${tr(ctx,
  "Node.js v22.11.0\nWelcome to Node.js REPL.\n> console.log('Hello from the terminal!')\nHello from the terminal!\n> process.exit()\nJust kidding! This isn't real Node.js 😄",
  "Node.js v22.11.0\nBem-vindo ao Node.js REPL.\n> console.log('Ola do terminal!')\nOla do terminal!\n> process.exit()\nBrincadeira! Isso nao e Node.js de verdade 😄"
)}`
    };
  }
  
  if (args.includes('.js')) {
    return {
      output: tr(ctx,
        `node: attempting to run '${args}'\nError: File system is read-only in this dimension! 📁🔒`,
        `node: tentando executar '${args}'\nErro: Sistema de arquivos e somente leitura nesta dimensao! 📁🔒`
      )
    };
  }
  
  return {
    output: tr(ctx,
      `> ${args}\nReferenceError: This is a portfolio terminal, not a JS runtime! 💚`,
      `> ${args}\nReferenceError: Este e um terminal de portfolio, nao um runtime JS! 💚`
    )
  };
});

registerCommand('java', (args, ctx) => {
  if (args.trim() === '' || args.trim() === '-version' || args.trim() === '--version') {
    return {
      output: `
     _                  
    | | __ ___   ____ _ 
 _  | |/ _\` \\ \\ / / _\` |
| |_| | (_| |\\ V / (_| |
 \\___/ \\__,_| \\_/ \\__,_|

${tr(ctx,
  "java version \"21.0.1\" 2023-10-17 LTS\nJava(TM) SE Runtime Environment (build 21.0.1+12-LTS-29)\nJava HotSpot(TM) 64-Bit Server VM (build 21.0.1+12-LTS-29)\n\nBut this is MS-DOS, so no JVM for you! ☕❌",
  "java version \"21.0.1\" 2023-10-17 LTS\nJava(TM) SE Runtime Environment (build 21.0.1+12-LTS-29)\nJava HotSpot(TM) 64-Bit Server VM (build 21.0.1+12-LTS-29)\n\nMas isso e MS-DOS, entao sem JVM pra voce! ☕❌"
)}`
    };
  }
  
  if (args.includes('.java') || args.includes('.class')) {
    return {
      output: tr(ctx,
        `javac: compiling ${args}\nError: OutOfMemoryError: MS-DOS ran out of conventional memory!\n(640K ought to be enough for anybody) 💾`,
        `javac: compilando ${args}\nErro: OutOfMemoryError: MS-DOS ficou sem memoria convencional!\n(640K deveria ser suficiente para qualquer um) 💾`
      )
    };
  }
  
  return {
    output: tr(ctx,
      `Exception in thread "main":\nPortfolioException: Cannot run Java in a DOS terminal!\n  at miguel.portfolio.Terminal.main(Terminal.java:1994) ☕`,
      `Exception in thread "main":\nPortfolioException: Nao pode rodar Java num terminal DOS!\n  at miguel.portfolio.Terminal.main(Terminal.java:1994) ☕`
    )
  };
});
