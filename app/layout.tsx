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
import './legal.css';
import './profile.css';
import './polish.css';
import CinemaProvider from '../components/cinema/CinemaProvider';
import HelpChat from '../components/HelpChat';
import CookieNotice from '../components/CookieNotice';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Matriculou — encontre seu próximo caminho', template: '%s · Matriculou' },
  description: 'Compare instituições, descubra cursos, favorite opções e acompanhe sua jornada educacional.',
  openGraph: { type: 'website', locale: 'pt_BR', siteName: 'Matriculou', images: ['/images/cinema/students.jpg'] },
};

// Fonts and images are self-hosted, so Supabase is the only origin the page talks to early on.
// Warming its connection saves the DNS + TLS round trips on the first catalog or login request.
const supabaseOrigin = (() => {
  try { return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : null; } catch { return null; }
})();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><head>{supabaseOrigin && <><link rel="preconnect" href={supabaseOrigin} crossOrigin="anonymous" /><link rel="dns-prefetch" href={supabaseOrigin} /></>}</head><body><a className="skipLink" href="#conteudo">Pular para o conteúdo</a><CinemaProvider>{children}<HelpChat /><CookieNotice /></CinemaProvider></body></html>;
}
