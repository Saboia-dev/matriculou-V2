import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Seus direitos (LGPD)', description: 'Formulário para exercer seus direitos de titular de dados pessoais.' };
export default function Page(){return <MatriculouApp view="lgpd"/>}
