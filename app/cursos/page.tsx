import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Cursos', description: 'Conheça duração, disciplinas, carreiras e instituições de cada curso.' };
export default function Page(){return <MatriculouApp view="cursos"/>}
