import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Como funciona', description: 'Como pesquisar, entender, comparar e organizar sua escolha no Matriculou.' };
export default function Page(){return <MatriculouApp view="como"/>}
