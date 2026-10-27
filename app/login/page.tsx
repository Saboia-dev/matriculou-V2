import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Entrar', description: 'Acesse sua conta no Matriculou.', robots: { index: false } };
export default function Page(){return <MatriculouApp view="login"/>}
