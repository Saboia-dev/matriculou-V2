import Link from 'next/link';
import Image from 'next/image';
import { CinemaIcon } from '../components/cinema/CinemaIcon';

export default function NotFound() {
  return <>
    <header className="nav"><div className="navInner"><Link href="/" className="matriculouLogo"><img src="/images/matriculou-logo-white.png" alt="Matriculou"/></Link><nav className="missingNav" aria-label="Navegação principal"><Link href="/instituicoes">Instituições</Link><Link href="/cursos">Cursos</Link></nav><Link className="missingHome" href="/">Voltar ao início <CinemaIcon name="diagonal" size={17}/></Link></div></header>
    <main className="missingPage" id="conteudo">
      <Image src="/images/cinema/library.jpg" alt="Corredor de biblioteca com estantes cheias de livros" fill sizes="100vw" priority className="missingBackground"/>
      <div className="missingContent"><span className="filmSectionLabel"><i/>FORA DO MAPA. DENTRO DAS POSSIBILIDADES.</span>
        <div className="missingCode" aria-label="Erro 404"><span>4</span><div className="missingOrbit" aria-hidden="true"><i/><i/><i/><b>?</b></div><span>4</span></div>
        <h1>Esse caminho<br/><em>ainda não existe.</em></h1><p>A página pode ter mudado de endereço.<br/>Seu próximo capítulo continua esperando por você.</p>
        <div className="missingActions"><Link href="/" className="button">Voltar ao início<CinemaIcon name="diagonal" size={18}/></Link><Link href="/cursos" className="filmTextLink">Descobrir outro caminho<CinemaIcon name="right" size={18}/></Link></div>
        <form className="missingSearch" action="/instituicoes" method="get"><label className="srOnly" htmlFor="missing-search">Buscar uma instituição ou cidade</label><CinemaIcon name="search" size={18}/><input id="missing-search" name="q" placeholder="Encontre uma instituição ou cidade" required maxLength={120}/><button aria-label="Buscar instituições" type="submit"><CinemaIcon name="right" size={20}/></button></form>
      </div><div className="missingFoot"><span>MATRICULOU / ROTA 404</span><span>ÀS VEZES, SE PERDER É O COMEÇO DE UMA DESCOBERTA.</span></div>
    </main>
  </>;
}
