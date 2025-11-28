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

// ==========================
// Projects content (PT/EN)
// ==========================
function projectHeader(title: string) {
  const line = '─'.repeat(Math.max(3, Math.min(31, title.length + 8)));
  return [
    `┌${line}┐`,
    `│  ${title.padEnd(line.length - 4, ' ')}  │`,
    `└${line}┘`,
    ''
  ];
}

function projectPortfolio(lang: Language): string {
  const header = projectHeader(lang === 'pt' ? '🖥️ Portfolio Terminal' : '🖥️ Terminal Portfolio');
  const body = lang === 'pt'
    ? [
        'Stack: Next.js, React, TypeScript, CSS Modules',
        'Tema CRT retrô com comandos (git, npm, etc.) e autocomplete.',
        'Destaques:',
        '- Autocomplete com rotação por Tab (comandos/args).',
        '- Easter eggs (42, sl, etc.) e animações.',
        '- Modo iniciante com botões e dicas.',
        '',
        'Experimente:',
        "- 'help', 'dir', 'cd skills', 'start skills.txt'",
      ]
    : [
        'Stack: Next.js, React, TypeScript, CSS Modules',
        'Retro CRT theme with commands (git, npm, etc.) and autocomplete.',
        'Highlights:',
        '- Tab-cycling autocomplete (commands/args).',
        '- Easter eggs (42, sl, etc.) and animations.',
        '- Beginner mode with buttons and tips.',
        '',
        'Try:',
        "- 'help', 'dir', 'cd skills', 'start skills.txt'",
      ];
  return [...header, ...body, ''].join('\n');
}

function projectInvoiceHub(lang: Language): string {
  const header = projectHeader(lang === 'pt' ? '📄 InvoiceHub (ASP.NET + Angular)' : '📄 InvoiceHub (ASP.NET + Angular)');
  const body = lang === 'pt'
    ? [
        'Emissao de notas, multi-tenant, perfis (admin/financeiro/vendas).',
        'Stack: ASP.NET Core, EF Core, Angular, PostgreSQL.',
        'Integrações: Stripe, e-mail, exportação PDF.',
        'Qualidade: testes (xUnit), CI/CD, Docker.',
      ]
    : [
        'Billing app, multi-tenant, roles (admin/finance/sales).',
        'Stack: ASP.NET Core, EF Core, Angular, PostgreSQL.',
        'Integrations: Stripe, email, PDF export.',
        'Quality: tests (xUnit), CI/CD, Docker.',
      ];
  return [...header, ...body, ''].join('\n');
}

function projectTaskFlow(lang: Language): string {
  const header = projectHeader(lang === 'pt' ? '✅ TaskFlow (NestJS + Postgres)' : '✅ TaskFlow (NestJS + Postgres)');
  const body = lang === 'pt'
    ? [
        'Gestão de tarefas com filas e realtime.',
        'Stack: NestJS, PostgreSQL, Redis, Bull, WebSockets.',
        'Infra: Docker Compose, migrações, seeds.',
        'Extras: RBAC, auditoria, relatórios.',
      ]
    : [
        'Task management with queues and realtime.',
        'Stack: NestJS, PostgreSQL, Redis, Bull, WebSockets.',
        'Infra: Docker Compose, migrations, seeds.',
        'Extras: RBAC, auditing, reports.',
      ];
  return [...header, ...body, ''].join('\n');
}

function projectRetroUI(lang: Language): string {
  const header = projectHeader(lang === 'pt' ? '🟩 Retro CRT UI Kit' : '🟩 Retro CRT UI Kit');
  const body = lang === 'pt'
    ? [
        'Design system com tema CRT neon para React.',
        'Componentes: Botões, cards, terminal, tipografia.',
        'Foco: Acessibilidade, CSS vars, dark-mode.',
        'Licença: MIT, open-source.',
      ]
    : [
        'Design system with neon CRT theme for React.',
        'Components: Buttons, cards, terminal, typography.',
        'Focus: Accessibility, CSS vars, dark-mode.',
        'License: MIT, open-source.',
      ];
  return [...header, ...body, ''].join('\n');
}

function projectBlazorFinance(lang: Language): string {
  const header = projectHeader(lang === 'pt' ? '💰 Blazor Finance' : '💰 Blazor Finance');
  const body = lang === 'pt'
    ? [
        'Dashboard de finanças pessoais.',
        'Stack: Blazor Server, EF Core, Charts, Identity.',
        'Recursos: metas, categorias, relatórios mensais.',
      ]
    : [
        'Personal finance dashboard.',
        'Stack: Blazor Server, EF Core, Charts, Identity.',
        'Features: goals, categories, monthly reports.',
      ];
  return [...header, ...body, ''].join('\n');
}

function projectModernization(lang: Language): string {
  const header = projectHeader(lang === 'pt' ? '🏗️ Modernização WebForms → ASP.NET Core' : '🏗️ Modernization WebForms → ASP.NET Core');
  const body = lang === 'pt'
    ? [
        'Migração incremental usando Strangler Fig Pattern.',
        'Práticas: DDD light, CQRS, testes de contrato.',
        'Observabilidade: logs estruturados, métricas.',
      ]
    : [
        'Incremental migration using Strangler Fig Pattern.',
        'Practices: light DDD, CQRS, contract tests.',
        'Observability: structured logs, metrics.',
      ];
  return [...header, ...body, ''].join('\n');
}

function getProjectFiles(lang: Language) {
  return {
    "portfolio-terminal.txt": {
      type: 'file' as const,
      extension: 'TXT',
      size: 1024,
      date: '11-09-25',
      time: '10:10a',
      content: projectPortfolio(lang)
    },
    "invoicehub.txt": {
      type: 'file' as const,
      extension: 'TXT',
      size: 1024,
      date: '11-08-25',
      time: '2:30p',
      content: projectInvoiceHub(lang)
    },
    "taskflow.txt": {
      type: 'file' as const,
      extension: 'TXT',
      size: 768,
      date: '11-08-25',
      time: '5:45p',
      content: projectTaskFlow(lang)
    },
    "retro-crt-ui.txt": {
      type: 'file' as const,
      extension: 'TXT',
      size: 640,
      date: '11-07-25',
      time: '11:20a',
      content: projectRetroUI(lang)
    },
    "blazor-finance.txt": {
      type: 'file' as const,
      extension: 'TXT',
      size: 640,
      date: '11-06-25',
      time: '4:05p',
      content: projectBlazorFinance(lang)
    },
    "modernization.txt": {
      type: 'file' as const,
      extension: 'TXT',
      size: 700,
      date: '11-05-25',
      time: '3:00p',
      content: projectModernization(lang)
    },
    "readme.txt": {
      type: 'file' as const,
      extension: 'TXT',
      size: 320,
      date: '11-08-25',
      time: '9:20a',
      content: (
        lang === 'pt'
          ? [
              'Bem-vindo aos projetos! Abra um arquivo com:',
              "- 'start portfolio-terminal.txt'",
              "- 'start invoicehub.txt'",
              "- 'start taskflow.txt'",
              "- 'start retro-crt-ui.txt'",
              "- 'start blazor-finance.txt'",
              "- 'start modernization.txt'",
            ]
          : [
              'Welcome to projects! Open a file with:',
              "- 'start portfolio-terminal.txt'",
              "- 'start invoicehub.txt'",
              "- 'start taskflow.txt'",
              "- 'start retro-crt-ui.txt'",
              "- 'start blazor-finance.txt'",
              "- 'start modernization.txt'",
            ]
      ).join('\n')
    }
  } as const;
}

// Skills content helpers (PT/EN) with 20-slot bars (each = 5%)
function getFrontendSkills(lang: Language): string {
  if (lang === 'pt') {
    return [
      "┌───────────────────────────────┐",
      "│      💻 Frontend Skills         │",
      "└───────────────────────────────┘",
      "",
      "HTML/CSS         [███████████████████░] 95%",
      "WebForms (.NET)  [████████████████░░░░] 80%",
      "Blazor           [████████████░░░░░░░░] 60%",
      "Angular          [█████████████░░░░░░░] 65%",
      "JavaScript       [█████████████░░░░░░░] 65%",
      "TypeScript       [████████████░░░░░░░░] 60%",
      "React            [████████░░░░░░░░░░░░] 40%",
      "UI/UX/Figma      [████████████░░░░░░░░] 60%",
      "",
      "Destaque: experiencia forte em WebForms, aplicacoes empresariais e",
      "frameworks Microsoft; front moderno em evolucao.",
      "",
      "Use 'start backend.txt' para backend ou 'start skills.txt' para painel geral."
    ].join('\n');
  }
  return [
    "┌───────────────────────────────┐",
    "│      💻 Frontend Skills         │",
    "└───────────────────────────────┘",
    "",
    "HTML/CSS         [███████████████████░] 95%",
    "WebForms (.NET)  [████████████████░░░░] 80%",
    "Blazor           [████████████░░░░░░░░] 60%",
    "Angular          [█████████████░░░░░░░] 65%",
    "JavaScript       [█████████████░░░░░░░] 65%",
    "TypeScript       [████████████░░░░░░░░] 60%",
    "React            [████████░░░░░░░░░░░░] 40%",
    "UI/UX/Figma      [████████████░░░░░░░░] 60%",
    "",
    "Highlight: strong experience in WebForms, enterprise apps,",
    "and Microsoft stack; modern frontend evolving.",
    "",
    "Use 'start backend.txt' for backend or 'start skills.txt' for the dashboard."
  ].join('\n');
}

function getBackendSkills(lang: Language): string {
  if (lang === 'pt') {
    return [
      "┌───────────────────────────────┐",
      "│       🖥️ Backend Skills         │",
      "└───────────────────────────────┘",
      "",
      "C# / .NET        [██████████████████░░] 90%",
      "ASP.NET (MVC/API)[█████████████████░░░] 85%",
      "NestJS           [███████████████░░░░░] 75%",
      "Node.js          [██████████████░░░░░░] 70%",
      "Python           [████████████░░░░░░░░] 60%",
      "PHP/Laravel      [████████████░░░░░░░░] 60%",
      "APIs REST        [████████████████░░░░] 80%",
      "Oracle PL/SQL    [███████████████░░░░░] 75%",
      "MySQL            [███████████████░░░░░] 75%",
      "Redis            [████████████░░░░░░░░] 60%",
      "RabbitMQ         [██████████░░░░░░░░░░] 50%",
      "Docker/CI/CD     [█████████████░░░░░░░] 65%",
      "Git/GitHub       [████████████████░░░░] 80%",
      "",
      "Destaque: backend e meu forte; dominio do ecossistema .NET e APIs robustas.",
      "",
      "Use 'start frontend.txt' para frontend ou 'start skills.txt' para painel geral."
    ].join('\n');
  }
  return [
    "┌───────────────────────────────┐",
    "│       🖥️ Backend Skills         │",
    "└───────────────────────────────┘",
    "",
    "C# / .NET        [██████████████████░░] 90%",
    "ASP.NET (MVC/API)[█████████████████░░░] 85%",
    "NestJS           [███████████████░░░░░] 75%",
    "Node.js          [██████████████░░░░░░] 70%",
    "Python           [████████████░░░░░░░░] 60%",
    "PHP/Laravel      [████████████░░░░░░░░] 60%",
    "REST APIs        [████████████████░░░░] 80%",
    "PostgreSQL       [███████████████░░░░░] 75%",
    "MySQL            [███████████████░░░░░] 75%",
    "Redis            [████████████░░░░░░░░] 60%",
    "RabbitMQ         [██████████░░░░░░░░░░] 50%",
    "Docker/CI/CD     [█████████████░░░░░░░] 65%",
    "Git/GitHub       [████████████████░░░░] 80%",
    "",
    "Highlight: backend is my core; solid .NET ecosystem and robust APIs.",
    "",
    "Use 'start frontend.txt' for frontend or 'start skills.txt' for the dashboard."
  ].join('\n');
}

function getSoftSkills(lang: Language): string {
  if (lang === 'pt') {
    return [
      "┌───────────────────────────────┐",
      "│        🤝 Soft Skills           │",
      "└───────────────────────────────┘",
      "",
      "Criatividade     [████████████████████] 100%🧩",
      "Comunicacao      [██████████████████░░] 90% 🗣️",
      "Lideranca        [████████████████░░░░] 80% 👑",
      "Proatividade     [██████████████████░░] 90% ⚡",
      "Autonomia        [██████████████████░░] 90% 🏃",
      "Ingles (B2)      [█████████████████░░░] 85% 🇺🇸",
      "Frances (A2)     [████████░░░░░░░░░░░░] 40% 🇫🇷",
      "",
      "Destaque: lideranca tecnica, didatica forte, tomada de decisao.",
      "",
      "Use 'start frontend.txt' ou 'start backend.txt' para skills tecnicas."
    ].join('\n');
  }
  return [
    "┌───────────────────────────────┐",
    "│        🤝 Soft Skills           │",
    "└───────────────────────────────┘",
    "",
    "Creativity      [████████████████████] 100%🧩",
    "Communication   [██████████████████░░] 90% 🗣️",
    "Leadership      [████████████████░░░░] 80% 👑",
    "Proactivity     [██████████████████░░] 90% ⚡",
    "Autonomy        [██████████████████░░] 90% 🏃",
    "English (B2)    [█████████████████░░░] 85% 🇺🇸",
    "French (A2)     [████████░░░░░░░░░░░░] 40% 🇫🇷",
    "",
    "Highlight: technical leadership, strong teaching, decision-making.",
    "",
    "Use 'start frontend.txt' or 'start backend.txt' for technical skills."
  ].join('\n');
}

function getSkillsPanel(lang: Language): string {
  if (lang === 'pt') {
    return [
      "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓",
      "┃         🌟 Painel de Skills 🌟             ┃",
      "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛",
      "",
      "Frontend   [██████████████░░░░░░] 70% 💻 | WebForms, Angular, Blazor",
      "Backend    [██████████████████░░] 90% 🖥️ | .NET, NestJS, Node.js, SQL",
      "SoftSkills [██████████████████░░] 90% 🤝 | Liderança, didática, comunicação",
      "Idiomas    [█████████████████░░░] 85% 🌎 | Inglês B2, Francês A2",
      "",
      "Acesse detalhes: 'start frontend.txt', 'start backend.txt', 'start softskills.txt'",
      "",
      "Miguel Sena - 2025 - Portfolio Terminal Edition"
    ].join('\n');
  }
  return [
    "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓",
    "┃         🌟 Skills Dashboard 🌟             ┃",
    "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛",
    "",
    "Frontend   [██████████████░░░░░░] 70% 💻 | WebForms, Angular, Blazor",
    "Backend    [██████████████████░░] 90% 🖥️ | .NET, NestJS, Node.js, SQL",
    "Soft Skills[██████████████████░░] 90% 🤝 | Leadership, teaching, comms",
    "Languages  [█████████████████░░░] 85% 🌎 | English B2, French A2",
    "",
    "Open details: 'start frontend.txt', 'start backend.txt', 'start softskills.txt'",
    "",
    "Miguel Sena -  2025 - Portfolio Terminal Edition"
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
          ...getProjectFiles(lang),
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
        children: {

          "frontend.txt": {
            type: 'file',
            extension: "TXT",
            size: 512,
            date: "11-08-25",
            time: "9:03a",
            content: getFrontendSkills(lang)
          },

          "backend.txt": {
            type: 'file',
            extension: "TXT",
            size: 512,
            date: "11-08-25",
            time: "9:04a",
            content: getBackendSkills(lang)
          },

          "softskills.txt": {
            type: 'file',
            extension: "TXT",
            size: 256,
            date: "11-08-25",
            time: "9:05a",
            content: getSoftSkills(lang)
          },

          "skills.txt": {
            type: 'file',
            extension: "TXT",
            size: 256,
            date: "11-08-25",
            time: "9:06a",
            content: getSkillsPanel(lang)
          }

        },
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
    if (selectedMode === 'beginner') {
      const tips = lang === 'pt'
        ? [
            '',
            'Dicas (Modo Iniciante):',
            '- Use os botoes para navegar.',
            "- 'dir' lista o que tem aqui.",
            "- 'cd nome' entra numa pasta. 'cd ..' volta.",
            "- 'start arquivo' abre um arquivo (ex.: start about).",
            "- Se no computador, pressione Tab para completar comandos.",
          ].join('\n')
        : [
            '',
            'Tips (Beginner Mode):',
            '- Use the buttons these buttons to navigate.',
            "- 'dir' lists what is here.",
            "- 'cd name' enters a folder. 'cd ..' goes back.",
            "- 'start file' opens a file (e.g.: start about).",
            "- If you are on PC, press Tab to autocomplete commands.",
          ].join('\n');
      setDosText(defaultText + tips + '\n' + `C:${root.path}>`);
    } else {
      setDosText(defaultText + '\n' + `C:${root.path}>`);
    }
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

      // Compute prompt to print, preferring an override path from the command result (e.g., after 'cd')
      const computedPrompt = result && (result as any).promptPath
        ? `C:${(result as any).promptPath}>`
        : (currentDir ? `C:${currentDir.path}>` : 'C:\\>');

      // Handle animated responses
      if (result.animate && result.lines) {
        animateLines(result.lines, computedPrompt);
        return prev;
      }

      // Handle directory changes (or regular prompt draw)
      const newPrompt = computedPrompt;
      
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
        const promptEnd = currentLine.indexOf('>');
        const printedPromptLength = promptEnd >= 0 ? (promptEnd + 1) : currentPrompt.length;
        const commandText = currentLine.substring(printedPromptLength);
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
          const promptEnd = currentLine.indexOf('>');
          const printedPromptLength = promptEnd >= 0 ? (promptEnd + 1) : currentPrompt.length;
          if (currentLine.length > printedPromptLength) return prev.slice(0, -1);
          return prev;
        });
        return;
      }

      if (e.key === "Tab") {
  const lastLineIndex = dosText.lastIndexOf('\n');
  const currentLine = dosText.substring(lastLineIndex + 1);
  const promptEnd = currentLine.indexOf('>');
  const printedPrompt = promptEnd >= 0 ? currentLine.substring(0, promptEnd + 1) : currentPrompt;
  const inputPortion = currentLine.substring(printedPrompt.length);
        const firstSpace = inputPortion.indexOf(' ');

        // COMMAND NAME MODE
        if (firstSpace === -1) {
          const typed = inputPortion.trim();
          if (suggestionMode === 'command' && autoSuggestions.length > 0) {
            // Cycle existing list
            const nextIndex = (autoCycleIndex + 1) % autoSuggestions.length;
            setAutoCycleIndex(nextIndex);
            const chosen = autoSuggestions[nextIndex];
            setDosText(prev => prev.substring(0, lastLineIndex + 1) + printedPrompt + chosen);
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
          setDosText(prev => prev.substring(0, lastLineIndex + 1) + printedPrompt + pool[0]);
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

        // Always allow cycling suggestions for arg mode, regardless of basePrefix
        if (suggestionMode === 'arg' && autoSuggestions.length > 0) {
          const nextIndex = (autoCycleIndex + 1) % autoSuggestions.length;
          setAutoCycleIndex(nextIndex);
          const chosenArg = autoSuggestions[nextIndex];
          const remainder = argTokenEnd === -1 ? '' : afterCmd.substring(argTokenEnd);
          setDosText(prev => prev.substring(0, lastLineIndex + 1) + printedPrompt + commandPart + ' ' + chosenArg + remainder);
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
        setDosText(prev => prev.substring(0, lastLineIndex + 1) + printedPrompt + commandPart + ' ' + chosenArg + remainder);
        return;
      }

      if (e.key === "ArrowLeft") {
        setDosText(prev => {
          const lastLineIndex = prev.lastIndexOf('\n');
          const currentLine = prev.substring(lastLineIndex + 1);
          const promptEnd = currentLine.indexOf('>');
          const printedPromptLength = promptEnd >= 0 ? (promptEnd + 1) : currentPrompt.length;
          if (currentLine.length > printedPromptLength) return prev.slice(0, -1);
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
            const line = prev.substring(lastLineIndex + 1);
            const promptEnd = line.indexOf('>');
            const printedPrompt = promptEnd >= 0 ? line.substring(0, promptEnd + 1) : currentPrompt;
            return prev.substring(0, lastLineIndex + 1) + printedPrompt + commandHistory[commandHistory.length - 1 - newIndex];
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
            const line = prev.substring(lastLineIndex + 1);
            const promptEnd = line.indexOf('>');
            const printedPrompt = promptEnd >= 0 ? line.substring(0, promptEnd + 1) : currentPrompt;
            return prev.substring(0, lastLineIndex + 1) + printedPrompt + commandHistory[commandHistory.length - 1 - newIndex];
          });
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setDosText(prev => {
            const lastLineIndex = prev.lastIndexOf('\n');
            const line = prev.substring(lastLineIndex + 1);
            const promptEnd = line.indexOf('>');
            const printedPrompt = promptEnd >= 0 ? line.substring(0, promptEnd + 1) : currentPrompt;
            return prev.substring(0, lastLineIndex + 1) + printedPrompt;
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
      { label: tLocal.buttons.goTo1000Projects, command: '1000projects' },
    ] : [
      { label: 'help', command: 'help' },
      { label: 'dir', command: 'dir' },
      { label: 'cls', command: 'cls' },
      { label: 'restart', command: 'restart' },
      { label: '1000projects', command: '1000projects' },
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
              title={`${language === 'pt' ? 'Executar:' : 'Run:'} ${cmd.command}`}
            >
              {cmd.label}
            </button>
          ))}
        </div>
      )}
    </main>
  );
}
