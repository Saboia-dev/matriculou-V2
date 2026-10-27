import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Termos de Uso', description: 'Regras de uso do site e das informações do catálogo do Matriculou.' };
export default function Page(){return <MatriculouApp view="termos-uso"/>}
