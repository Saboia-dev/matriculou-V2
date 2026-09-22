import type { Metadata } from 'next';
import '@fontsource/barlow-condensed/600.css';
import '@fontsource/barlow-condensed/700.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import './globals.css';
import './cinema.css';
import './site-cinema.css';
import './editorial.css';
import CinemaProvider from '../components/cinema/CinemaProvider';
import HelpChat from '../components/HelpChat';

export const metadata: Metadata = {
  title: 'Matriculou — encontre seu próximo caminho',
  description: 'Compare instituições, descubra cursos, favorite opções e acompanhe sua jornada educacional.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body><CinemaProvider>{children}<HelpChat /></CinemaProvider></body></html>;
}
