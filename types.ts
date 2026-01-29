
export interface TerminalTheme {
  name: string;
  background: string;
  text: string;
  cursor: string;
  accent: string;
  border: string;
}

export type WindowStyle = 'macos' | 'windows' | 'none';

export interface TerminalSettings {
  theme: string;
  windowStyle: WindowStyle;
  fontSize: number;
  padding: number;
  showTitle: boolean;
  title: string;
  lineSpacing: number;
  opacity: number;
  shadow: boolean;
  width: number;
}

export const THEMES: Record<string, TerminalTheme> = {
  'monokai': {
    name: 'Monokai',
    background: '#272822',
    text: '#f8f8f2',
    cursor: '#f8f8f0',
    accent: '#a6e22e',
    border: '#3e3d32'
  },
  'dracula': {
    name: 'Dracula',
    background: '#282a36',
    text: '#f8f8f2',
    cursor: '#f8f8f2',
    accent: '#bd93f9',
    border: '#44475a'
  },
  'night-owl': {
    name: 'Night Owl',
    background: '#011627',
    text: '#d6deeb',
    cursor: '#7e57c2',
    accent: '#addb67',
    border: '#1d3b53'
  },
  'solarized-dark': {
    name: 'Solarized Dark',
    background: '#002b36',
    text: '#839496',
    cursor: '#93a1a1',
    accent: '#2aa198',
    border: '#073642'
  },
  'one-dark': {
    name: 'One Dark',
    background: '#282c34',
    text: '#abb2bf',
    cursor: '#528bff',
    accent: '#98c379',
    border: '#181a1f'
  }
};
