import type { Metadata } from 'next';
import MatriculouApp from '../../components/MatriculouApp';

export const metadata: Metadata = { title: 'Política de Privacidade', description: 'Como o Matriculou trata e protege seus dados pessoais, conforme a LGPD.' };
export default function Page(){return <MatriculouApp view="privacidade"/>}
