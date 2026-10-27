import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Instituições', description: 'Pesquise instituições por localização, rede, tipo, modalidade e faixa de mensalidade.' };
export default function Page(){return <MatriculouApp view="instituicoes"/>}
