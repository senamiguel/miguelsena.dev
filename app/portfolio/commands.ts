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
  const parts = commandLine.trim().toLowerCase().split(' ');
  const command = parts[0];
  const args = parts.slice(1).join(' ');

  const handler = commands[command];
  if (handler) {
    const result = handler(args, ctx);
    if (result) return result;
  }

  return { output: `Illegal command: ${commandLine}` };
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
      return { output: '' };
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
      return { output: '' };
    } else {
      return { output: t.terminal.errors.invalidDir };
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
      ctx.setShowAboutImage(false);
      return { output: t.terminal.errors.cannotStartDir.replace('{fileName}', fileName) };
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
  return {
    output: tr(ctx,
      "Current date is: 11-13-2025\n(Time is an illusion in DOS) ⏰",
      "Data atual: 13-11-2025\n(O tempo e uma ilusao no DOS) ⏰"
    )
  };
});

registerCommand('time', (args, ctx) => {
  return {
    output: tr(ctx, "Current time is: ADVENTURE TIME! 🕐", "Hora atual: HORA DA AVENTURA! 🕐")
  };
});

registerCommand('echo', (args, ctx) => {
  if (args.trim() === '' || args.trim() === 'hello') {
    return {
      output: tr(ctx, "Hello! 👋 Echo... echo... echo...", "Ola! 👋 Eco... eco... eco...")
    };
  }
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
  return {
    output: tr(ctx,
      "'python' is not recognized as a DOS command.\nThis is a portfolio, not an IDE! ",
      "'python' nao e reconhecido como um comando do DOS.\nIsto e um portfolio, nao uma IDE! "
    )
  };
});

registerCommand('node', (args, ctx) => {
  return {
    output: tr(ctx,
      "'node' is not recognized as a DOS command.\nThis is a portfolio, not an IDE!",
      "'node' nao e reconhecido como um comando do DOS.\nIsto e um portfolio, nao uma IDE! 💻"
    )
  };
});

registerCommand('java', (args, ctx) => {
  return {
    output: tr(ctx,
      "'java' is not recognized as a DOS command.\nThis is a portfolio, not an IDE! 💻",
      "'java' nao e reconhecido como um comando do DOS.\nIsto e um portfolio, nao uma IDE! 💻"
    )
  };
});

registerCommand('git', (args, ctx) => {
  const subcommand = args.trim();
  
  if (subcommand === 'status') {
    return {
      output: tr(ctx,
        'On branch main\nNothing to commit, living the dream! 🎨',
        'Na branch main\nNada para commitar, vivendo o sonho! 🎨'
      )
    };
  }
  
  if (subcommand === 'push') {
    return {
      output: tr(ctx,
        'Pushing to origin...\nEverything up-to-date! ✅',
        'Enviando para origin...\nTudo atualizado! ✅'
      )
    };
  }
  
  if (subcommand === 'pull') {
    return {
      output: tr(ctx,
        'Already up to date. 🔄',
        'Ja esta atualizado. 🔄'
      )
    };
  }
  
  if (subcommand === 'log') {
    return {
      output: tr(ctx,
        'commit a1b2c3d (HEAD -> main)\nAuthor: Miguel Sena\nDate: Nov 14 2025\n\n    feat: added awesome portfolio terminal',
        'commit a1b2c3d (HEAD -> main)\nAutor: Miguel Sena\nData: 14 Nov 2025\n\n    feat: adicionado terminal incrivel ao portfolio'
      )
    };
  }
  
  if (subcommand === 'branch') {
    return {
      output: '* main\n  feature/awesome-terminal'
    };
  }
  
  if (subcommand === 'diff') {
    return {
      output: tr(ctx,
        'No changes detected. All good! ✨',
        'Nenhuma mudanca detectada. Ta tudo certo! ✨'
      )
    };
  }
  
  if (subcommand === '--help' || subcommand === '-h') {
    return {
      output: tr(ctx,
        'Are you serious?',
        'Ta de zoeira?'
      )
    };
  }
  
  if (subcommand === 'commit') {
    return {
      output: tr(ctx,
        'Nothing to commit! Try doing some work first. 💼',
        'Nada para commitar! Tenta fazer algum trabalho primeiro. 💼'
      )
    };
  }
  
  if (subcommand === 'clone') {
    return {
      output: tr(ctx,
        'Cloning into portfolio...\nDone! But it\'s already here. 🤷',
        'Clonando para portfolio...\nPronto! Mas ja esta aqui. 🤷'
      )
    };
  }
  
  if (subcommand === 'init') {
    return {
      output: tr(ctx,
        'Already initialized! This repo is ready to go. 🚀',
        'Ja inicializado! Este repo esta pronto. 🚀'
      )
    };
  }
  
  if (subcommand === '') {
    return {
      output: tr(ctx,
        "usage: git <command>\n\nTry: status, push, pull, log, branch",
        "uso: git <comando>\n\nTente: status, push, pull, log, branch"
      )
    };
  }
  
  return {
    output: `git: '${subcommand}' is not a git command. See "git --help".`
  };
});

registerCommand('npm', (args, ctx) => {
  const subcommand = args.trim();
  
  if (subcommand === 'install' || subcommand === 'i') {
    return {
      output: '',
      animate: true,
      lines: tr(ctx,
        'installing dependencies...|fetching packages...|building...|added 1337 packages in 0.420s 📦',
        'Instalando dependencias...|Baixando pacotes...|Compilando...|Adicionados 1337 pacotes em 0.420s 📦'
      ).split('|')
    };
  }
  
  if (subcommand === 'start') {
    return {
      output: tr(ctx,
        'Starting development server...\nServer already running on http://localhost:3000 🚀',
        'Iniciando servidor de desenvolvimento...\nServidor ja rodando em http://localhost:3000 🚀'
      )
    };
  }
  
  if (subcommand === 'run dev') {
    return {
      output: tr(ctx,
        'Starting Next.js dev server...\n✓ Ready on http://localhost:3000',
        'Iniciando servidor dev Next.js...\n✓ Pronto em http://localhost:3000'
      )
    };
  }
  
  if (subcommand === 'run build') {
    return {
      output: '',
      animate: true,
      lines: tr(ctx,
        'Building for production...|Compiling...|Optimizing...|✓ Build complete! Ready to deploy. 🎉',
        'Construindo para producao...|Compilando...|Otimizando...|✓ Build completo! Pronto para deploy. 🎉'
      ).split('|')
    };
  }
  
  if (subcommand === 'test') {
    return {
      output: tr(ctx,
        'Running tests...\n✓ All tests passed! (just kidding, no tests here) 🧪',
        'Executando testes...\n✓ Todos os testes passaram! (brincadeira, nao tem testes aqui) 🧪'
      )
    };
  }
  
  if (subcommand === 'version' || subcommand === '-v') {
    return {
      output: '10.9.0 (but who\'s counting?) 📦'
    };
  }
  
  if (subcommand === 'update') {
    return {
      output: tr(ctx,
        'Checking for updates...\nAll packages are up to date! 📦✨',
        'Verificando atualizacoes...\nTodos os pacotes estao atualizados! 📦✨'
      )
    };
  }
  
  if (subcommand === 'audit') {
    return {
      output: tr(ctx,
        'found 0 vulnerabilities\nEverything looks secure! 🔒',
        'encontradas 0 vulnerabilidades\nTudo parece seguro! 🔒'
      )
    };
  }
  
  if (subcommand === 'list' || subcommand === 'ls') {
    return {
      output: 'portfolio@1.0.0\n├── react@18.3.0\n├── next@16.0.1\n└── typescript@5.7.0\n\n(and 1334 more packages...)'
    };
  }
  
  if (subcommand === '') {
    return {
      output: tr(ctx,
        "usage: npm <command>\n\nTry: install, start, test, run build",
        "uso: npm <comando>\n\nTente: install, start, test, run build"
      )
    };
  }
  
  return {
    output: `npm: unknown command '${subcommand}'. Run 'npm' for usage.`
  };
});

registerCommand('make', (args, ctx) => {
  if (args.trim() === 'me a sandwich') {
    return {
      output: tr(ctx, 'What? Make it yourself! 🥪', 'O que? Faca voce mesmo! 🥪')
    };
  }
});

registerCommand('hello', (args, ctx) => {
  return {
    output: tr(ctx,
      'Hello there! 👋\nThanks for visiting my portfolio!',
      'Ola! 👋\nObrigado por visitar meu portfolio!'
    )
  };
});

registerCommand('hi', (args, ctx) => {
  return commands['hello'](args, ctx);
});

registerCommand('coffee', (args, ctx) => {
  return {
    output: `    ( (\n     ) )\n  .______.\n  |      |]\n  \\      /\n   \`----'\n\n${tr(ctx, "Here's your coffee! ☕", "Aqui esta seu coffee! ☕")}`
  };
});

registerCommand('tea', (args, ctx) => {
  return {
    output: `    ( (\n     ) )\n  .______.\n  |      |]\n  \\      /\n   \`----'\n\n${tr(ctx, "Here's your tea! ☕", "Aqui esta seu tea! ☕")}`
  };
});

registerCommand('42', (args, ctx) => {
  return {
    output: tr(ctx,
      'The Answer to the Ultimate Question\nof Life, the Universe, and Everything.\n🌌',
      'A Resposta para a Pergunta Fundamental\nda Vida, do Universo e de Tudo Mais.\n🌌'
    )
  };
});

registerCommand('vim', (args, ctx) => {
  return {
    output: tr(ctx,
      "Text editors? In MY DOS terminal?\nWe don't do that here. ✍️❌",
      "Editores de texto? No MEU terminal DOS?\nAqui nao fazemos isso. ✍️❌"
    )
  };
});

registerCommand('nano', (args, ctx) => {
  return commands['vim'](args, ctx);
});

registerCommand('emacs', (args, ctx) => {
  return commands['vim'](args, ctx);
});

registerCommand('duda', (args, ctx) => {
  return {
    output: '',
    animate: true,
    lines: tr(ctx,
      '💖 Honey, you are very special to me!|Thank you for always being by my side.|I love you! - Miguel||For an amazing girlfriend, a unique easter egg just for you!',
      '💖 Meu bem, voce e muito especial para mim!|Obrigado por estar sempre ao meu lado.|Te amo! - Miguel||Para uma namorada incrivel, um easter egg so seu!'
    ).split('|')
  };
});

registerCommand('yarn', (args, ctx) => {
  return {
    output: tr(ctx,
      "yarn? We're an npm shop here! Try 'npm' instead. 🧶",
      "yarn? Aqui usamos npm! Tenta 'npm'. 🧶"
    )
  };
});

registerCommand('pnpm', (args, ctx) => {
  return {
    output: tr(ctx,
      "pnpm? Fancy! But we use npm here. 📦",
      "pnpm? Chique! Mas aqui usamos npm. 📦"
    )
  };
});

registerCommand('docker', (args, ctx) => {
  return {
    output: tr(ctx,
      "Docker? In MS-DOS?\nNice try, but containers don't exist yet! 🐋",
      "Docker? No MS-DOS?\nBoa tentativa, mas containers ainda nao existem! 🐋"
    )
  };
});

registerCommand('code', (args, ctx) => {
  return {
    output: tr(ctx,
      "Opening VS Code...\nJust kidding! We're already in the best IDE. 💻✨",
      "Abrindo VS Code...\nBrincadeira! Ja estamos na melhor IDE. 💻✨"
    )
  };
});

registerCommand('neofetch', (args, ctx) => {
  const art = `
        ____  ____  ____
       / __ \\/ __ \\/ __/
      / / / / / / /\\ \\  
     /_/ /_/_/ /_/___/  
  `;
  
  return {
    output: art + tr(ctx,
      '\n\nOS: MS-DOS 6.22\nHost: PORTFOLIO.TERMINAL\nKernel: Miguel.Brain.v1.0\nUptime: ∞ hours\nPackages: Too many easter eggs\nShell: Custom DOS Shell\nTerminal: CRT Screen\nCPU: Coffee-Powered\nMemory: Unlimited imagination',
      '\n\nSO: MS-DOS 6.22\nHost: PORTFOLIO.TERMINAL\nKernel: Miguel.Cerebro.v1.0\nUptime: ∞ horas\nPacotes: Muitos easter eggs\nShell: Custom DOS Shell\nTerminal: Tela CRT\nCPU: Movido a Cafe\nMemoria: Imaginacao ilimitada'
    )
  };
});

registerCommand('htop', (args, ctx) => {
  return {
    output: tr(ctx,
      "CPU: [████████░░] 80% (mostly processing easter eggs)\nRAM: [██████░░░░] 60% (storing memories)\nSWAP: [░░░░░░░░░░] 0% (we don't need it)\n\nProcesses:\n 1. awesome.exe - Running\n 2. creativity.exe - Running\n 3. coffee.exe - Consuming",
      "CPU: [████████░░] 80% (processando easter eggs)\nRAM: [██████░░░░] 60% (guardando memorias)\nSWAP: [░░░░░░░░░░] 0% (nao precisamos)\n\nProcessos:\n 1. awesome.exe - Rodando\n 2. creativity.exe - Rodando\n 3. coffee.exe - Consumindo"
    )
  };
});

registerCommand('top', (args, ctx) => {
  return commands['htop'](args, ctx);
});
