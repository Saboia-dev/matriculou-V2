import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Meu perfil', description: 'Favoritos, documentos e dados da sua conta.', robots: { index: false } };
export default function Page(){return <MatriculouApp view="perfil"/>}
