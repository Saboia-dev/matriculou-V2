import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Criar conta', description: 'Crie sua conta gratuita no Matriculou.' };
export default function Page(){return <MatriculouApp view="cadastro"/>}
