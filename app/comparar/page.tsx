import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Comparar instituições', description: 'Compare até quatro instituições lado a lado.' };
export default function Page(){return <MatriculouApp view="comparar"/>}
