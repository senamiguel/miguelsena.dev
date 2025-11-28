export type Language = 'en' | 'pt';
export type Mode = 'beginner' | 'advanced';

export interface Translations {
  language: {
    select: string;
    english: string;
    portuguese: string;
  };
  mode: {
    select: string;
    beginner: string;
    beginnerDesc: string;
    advanced: string;
    advancedDesc: string;
  };
  terminal: {
    about: {
      title: string;
      subtitle: string;
      description: string[];
      instruction: string;
    };
    contact: {
      title: string;
      linkedin: string;
      github: string;
      email: string;
    };
    site: {
      description: string;
      name: string;
      type: string;
      tech: string;
      desc: string;
    };
    commands: {
      help: string;
      dir: string;
      cls: string;
      restart: string;
      start: string;
      cd: string;
    };
    errors: {
      invalidDir: string;
      fileNotFound: string;
      emptyFile: string;
      cannotStartDir: string;
      illegalCommand: string;
    };
    default: {
      header: string[];
      volume: string;
      serial: string;
      directory: string;
      files: string;
      dirs: string;
      bytes: string;
      free: string;
      helpInstruction: string;
    };
  };
  buttons: {
    help: string;
    listFiles: string;
    clear: string;
    restart: string;
    viewAbout: string;
    viewContact: string;
    viewProject: string;
    goToProjects: string;
    goToSkills: string;
    goBack: string;
    goHome: string;
    goTo1000Projects: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    language: {
      select: 'Select Language',
      english: 'English',
      portuguese: 'Portuguese',
    },
    mode: {
      select: 'Select Mode',
      beginner: 'Beginner Mode',
      beginnerDesc: 'Easy-to-use buttons for everyone',
      advanced: 'Advanced Mode',
      advancedDesc: 'Type commands like a pro',
    },
    terminal: {
      about: {
        title: 'M I G U E L   S E N A    ',
        subtitle: '   Software Engineer        ',
        description: [
          "Hello! I'm Miguel, a passionate",
          'developer creating cool things',
          'for the web.',
          '',
          'This terminal is my portfolio,',
          'inspired by MS-DOS.',
        ],
        instruction: "Type 'cd projects' to see my work. ",
      },
      contact: {
        title: 'C O N T A C T   M E',
        linkedin: '/in/senamiguel',
        github: '/senamiguel',
        email: 'miguelaugustosena@gmail.com',
      },
      site: {
        description: 'This is the project file for this very website!',
        name: 'miguelsena.dev',
        type: 'Portfolio Terminal',
        tech: 'React, Next.js, TypeScript',
        desc: 'A recreation of an MS-DOS terminal as a personal portfolio.',
      },
      commands: {
        help: '\nAvailable commands: \nhelp - Show a list of the available commands. \ncls - Clear the screen. \nrestart - Restart the session.\ndir - List the contents of the current directory.\ncd [directory] - Change the current directory.\nstart [file] - Opens a file.\n1000projects - Visit the 1000 Projects Challenge.\n',
        dir: '',
        cls: '',
        restart: '',
        start: '',
        cd: '',
      },
      errors: {
        invalidDir: 'Invalid directory.',
        fileNotFound: 'File not found:',
        emptyFile: "File '{fileName}' is empty.",
        cannotStartDir: "Cannot start '{fileName}', it is a directory.",
        illegalCommand: 'Illegal command:',
      },
      default: {
        header: [
          'Microsoft(R) MS-DOS(R) Version 6.22',
          '(C)Copyright Microsoft Corp 1981-1994.',
        ],
        volume: ' Volume in drive C is MIGUELSENA.DEV',
        serial: ' Volume Serial Number is 1994-0A0D',
        directory: 'Directory of C:',
        files: 'file(s)',
        dirs: 'dir(s)',
        bytes: 'bytes',
        free: 'bytes free',
        helpInstruction: 'Type "help" to see the list of available commands.',
      },
    },
    buttons: {
      help: 'Help',
      listFiles: 'List Files',
      clear: 'Clear Screen',
      restart: 'Restart',
      viewAbout: 'About Me',
      viewContact: 'Contact',
      viewProject: 'View Project',
      goToProjects: 'Go to Projects',
      goToSkills: 'Go to Skills',
      goBack: 'Go Back',
      goHome: 'Go to Home',
      goTo1000Projects: '1000 Projects',
    },
  },
  pt: {
    language: {
      select: 'Selecione o Idioma',
      english: 'Ingles',
      portuguese: 'Portugues',
    },
    mode: {
      select: 'Selecione o Modo',
      beginner: 'Modo Leigo',
      beginnerDesc: 'Botoes faceis de usar para todos',
      advanced: 'Modo Avancado',
      advancedDesc: 'Digite comandos como um profissional',
    },
    terminal: {
      about: {
        title: 'M I G U E L   S E N A',
        subtitle: 'Engenheiro de Software',
        description: [
          'Ola! Eu sou o Miguel, um desenvolvedor',
          'apaixonado criando coisas legais',
          'para a web.',
          '',
          'Este terminal e meu portfolio,',
          'inspirado em MS-DOS.',
        ],
        instruction: "Digite 'cd projects' para ver meu trabalho.",
      },
      contact: {
        title: 'E N T R E   E M   C O N T A T O',
        linkedin: '/in/senamiguel',
        github: '/senamiguel',
        email: 'miguelaugustosena@gmail.com',
      },
      site: {
        description: 'Este e o arquivo do projeto deste site!',
        name: 'miguelsena.dev',
        type: 'Terminal Portfolio',
        tech: 'React, Next.js, TypeScript',
        desc: 'Uma recriacao de um terminal MS-DOS como portfolio pessoal.',
      },
      commands: {
        help: '\nComandos disponiveis: \nhelp - Mostra a lista de comandos disponiveis. \ncls - Limpa a tela. \nrestart - Reinicia a sessao.\ndir - Lista o conteudo do diretorio atual.\ncd [diretorio] - Muda o diretorio atual.\nstart [arquivo] - Abre um arquivo.\n1000projects - Visitar o Desafio 1000 Projetos.\n',
        dir: '',
        cls: '',
        restart: '',
        start: '',
        cd: '',
      },
      errors: {
        invalidDir: 'Diretorio invalido.',
        fileNotFound: 'Arquivo nao encontrado:',
        emptyFile: "O arquivo '{fileName}' esta vazio.",
        cannotStartDir: "Nao e possivel iniciar '{fileName}', e um diretorio.",
        illegalCommand: 'Comando ilegal:',
      },
      default: {
        header: [
          'Microsoft(R) MS-DOS(R) Versao 6.22',
          '(C)Copyright Microsoft Corp 1981-1994.',
        ],
        volume: ' Volume na unidade C e MIGUELSENA.DEV',
        serial: ' Numero de Serie do Volume e 1994-0A0D',
        directory: 'Diretorio de C:',
        files: 'arquivo(s)',
        dirs: 'diretorio(s)',
        bytes: 'bytes',
        free: 'bytes livres',
        helpInstruction: 'Digite "help" para ver a lista de comandos disponiveis.',
      },
    },
    buttons: {
      help: 'Ajuda',
      listFiles: 'Listar Arquivos',
      clear: 'Limpar Tela',
      restart: 'Reiniciar',
      viewAbout: 'Sobre Mim',
      viewContact: 'Contato',
      viewProject: 'Ver Projeto',
      goToProjects: 'Ir para Projetos',
      goToSkills: 'Ir para Habilidades',
      goBack: 'Voltar',
      goHome: 'Ir para Inicio',
      goTo1000Projects: '1000 Projetos',
    },
  },
};

