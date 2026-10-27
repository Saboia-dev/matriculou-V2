import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Política de Cookies', description: 'O que o Matriculou guarda no seu navegador e por quê.' };
export default function Page(){return <MatriculouApp view="cookies"/>}
