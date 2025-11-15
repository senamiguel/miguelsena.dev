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
  // Return simple message, will be handled specially in page.tsx
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
      "'python' is not recognized as a DOS command.\nThis is a portfolio, not an IDE! 💻",
      "'python' nao e reconhecido como um comando do DOS.\nIsto e um portfolio, nao uma IDE! 💻"
    )
  };
});

registerCommand('node', (args, ctx) => {
  return {
    output: tr(ctx,
      "'node' is not recognized as a DOS command.\nThis is a portfolio, not an IDE! 💻",
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
  if (args.trim() === 'status') {
    return {
      output: tr(ctx,
        'On branch main\nNothing to commit, living the dream! 🎨',
        'Na branch main\nNada para commitar, vivendo o sonho! 🎨'
      )
    };
  }
  if (args.trim() === 'push') {
    return {
      output: tr(ctx,
        'Pushing to origin...\nEverything up-to-date! ✅',
        'Enviando para origin...\nTudo atualizado! ✅'
      )
    };
  }
});

registerCommand('npm', (args, ctx) => {
  if (args.trim() === 'install') {
    return {
      output: '',
      animate: true,
      lines: tr(ctx,
        'installing dependencies...|fetching packages...|building...|added 1337 packages in 0.420s 📦',
        'Instalando dependencias...|Baixando pacotes...|Compilando...|Adicionados 1337 pacotes em 0.420s 📦'
      ).split('|')
    };
  }
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
      'A Resposta para a Pergunta Fundamental\nda Vida, do Universo e de Tudo.\n🌌'
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
      '💖 Meu bem, voce e muito especial para mim!|Obrigado por estar sempre ao meu lado.|Te amo! - Miguel||Para uma namorada incrivel, um easter egg sos seu!'
    ).split('|')
  };
});
