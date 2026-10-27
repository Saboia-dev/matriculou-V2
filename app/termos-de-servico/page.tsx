import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Termos de Serviço', description: 'Condições da conta, dos favoritos e da área de documentos do Matriculou.' };
export default function Page(){return <MatriculouApp view="termos-servico"/>}
