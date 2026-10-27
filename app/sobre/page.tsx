import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Sobre a BIJK', description: 'Conheça a BIJK, a equipe que desenvolve o Matriculou.' };
export default function Page(){return <MatriculouApp view="sobre"/>}
