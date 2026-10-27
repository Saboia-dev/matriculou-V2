"use client";

import Link from "next/link";
import Image from "next/image";
import CatalogQuery from "./CatalogQuery";
import CinematicHome from "./cinema/CinematicHome";
import CinematicPageHero from "./cinema/CinematicPageHero";
import ScrollStory from "./cinema/ScrollStory";
import NextChapter from "./cinema/NextChapter";
import { demoInstitutions, demoOffers } from "../lib/demo-content";
import { normalize } from "../lib/chat";
import { matchesQuery, stateNames } from "../lib/search";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Institution, Offer, UserProfile, CourseDetail } from "../lib/content";
import { courseInfo, nav } from "../lib/content";
import LegalPage, { type LegalView } from "./LegalPages";
import { CinemaIcon } from "./cinema/CinemaIcon";
import { illustrationFor } from "../lib/illustrations";
import { courseArea } from "../lib/areas";
import { legal, legalLinks } from "../lib/legal";
import { clean, fieldError, guard } from "../lib/sanitize";
import { openConsentPreferences } from "../lib/consent";

type View =
  | "home"
  | "instituicoes"
  | "cursos"
  | "comparar"
  | "como"
  | "sobre"
  | "perfil"
  | "login"
  | "cadastro"
  | LegalView;

// Documents live in a private bucket and open only through short-lived links.
const signedUrlTtl = 60 * 60;

const legalViews: View[] =["privacidade", "termos-uso", "termos-servico", "cookies", "lgpd"];

// Monogram shown when an institution has no licensed photo, so no third-party
// image is hotlinked and the card keeps its layout.
const genericWords = /^(colégio|universidade|universitário|faculdade|faculdades|instituto|centro|escola|fundação|federal|estadual|de|da|do|das|dos|e)$/i;
// Short label for the monogram: "(UFRJ)", "PUC-SP — Campus…", "Faculdades FKB",
// "(IFSP Sorocaba)" → IFSP, "Centro Universitário Facens" → FACENS.
const monogram = (name: string) => {
  const outside = name.replace(/\(.*?\)/g, "").trim();
  const inParens = name.match(/\(([^)]+)\)/)?.[1]?.trim();
  const prefix = name.includes(" — ") ? name.split(" — ")[0].trim() : "";
  const single = (s?: string, max = 10) => (s && !/\s/.test(s) && s.length >= 2 && s.length <= max ? s : undefined);
  const caps = outside.split(/\s+/).find((w) => /^[A-ZÀ-Ú][A-ZÀ-Ú0-9-]{1,7}$/.test(w));
  const words = outside.split(/\s+/).filter((w) => /[a-zà-ú]/i.test(w) && w.length > 1 && !genericWords.test(w));
  const fallback = words.length === 1 && words[0].length <= 12 ? words[0] : words.slice(0, 3).map((w) => w[0]).join("");
  return (single(inParens) || single(prefix, 8) || caps || single(inParens?.split(" ")[0], 8) || fallback || name.slice(0, 2)).toUpperCase();
};
const placeholderImage = (name: string) => {
  const letters = monogram(name);
  const size = Math.min(84, Math.floor(520 / letters.length));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><rect width="400" height="260" fill="#1d2b33"/><circle cx="330" cy="40" r="120" fill="none" stroke="#f18465" stroke-opacity=".25"/><text x="50%" y="56%" text-anchor="middle" font-family="Arial,sans-serif" font-size="${size}" font-weight="700" fill="#f3f1ea">${letters}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

// Free licenses (CC BY / CC BY-SA) require author, license and source next to the photo.
function ImageCredit({ i }: { i: Institution }) {
  if (!i.image) {
    const art = illustrationFor(i.id, i.type);
    return (
      <p className="imageCredit">
        <b>Imagem ilustrativa</b>: não mostra {i.name}. Foto: {art.author} · {art.license}
        {" · "}<a href={art.source} target="_blank" rel="noopener noreferrer">fonte</a>
      </p>
    );
  }
  if (!i.imageCredit) return null;
  const { author, license, source } = i.imageCredit;
  return (
    <p className="imageCredit">
      Foto: {author}
      {license && <> · {license} (adaptada)</>}
      {source && <> · <a href={source} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></>}
    </p>
  );
}

// Institutions without a licensed photo get a labelled illustrative picture of a learning
// space; the monogram is only a fallback if an image fails to load.
// Served through next/image: WebP at the size each slot needs instead of the 960px source.
function InstitutionImage({ i, className, sizes = "(max-width: 700px) 92vw, 420px" }: { i: Institution; className?: string; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  const art = i.image ? null : illustrationFor(i.id, i.type);
  const src = i.image || art!.src;
  const alt = i.image ? `Foto de ${i.name}` : `Imagem ilustrativa: ${art!.alt}`;
  const title = i.image && i.imageCredit ? `Foto: ${i.imageCredit.author} · ${i.imageCredit.license}` : art ? `Imagem ilustrativa · ${art.author}` : undefined;
  if (failed || !src.startsWith("/")) {
    return (
      <img
        className={className}
        src={failed ? placeholderImage(i.name) : src}
        alt={failed ? `${i.name} (sem foto disponível)` : alt}
        title={title}
        width={960}
        height={640}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }
  return <Image className={className} src={src} alt={alt} title={title} width={960} height={640} sizes={sizes} quality={70} onError={() => setFailed(true)} />;
}

const priceLabel = (i: Institution, suffix = "/mês") =>
  i.price > 0
    ? `R$ ${i.price.toLocaleString("pt-BR")}${suffix}`
    : i.network === "publica"
    ? "Gratuita (ensino público)"
    : "Consulte a instituição";

const typeLabels: Record<string, string> = { universidade: "Universidade", faculdade: "Faculdade", tecnico: "Técnico", escola: "Escola", instituto: "Instituto", "centro universitário": "Centro universitário" };
const typeLabel = (type: string) => typeLabels[type] || (type ? type[0].toUpperCase() + type.slice(1) : "Não informado");

// The MEC concept (CI/IGC) only exists for higher-education institutions, never for schools.
const mecLabel = (i: Institution) => (i.type === "escola" ? "Não se aplica (educação básica)" : i.mec ? String(i.mec) : "Não informado");

// The same course spelled differently in the database is shown as a single course.
const courseAliases: Record<string, string> = { "engenharia da computacao": "Engenharia de Computação" };
const canonicalCourse = (name: string) => courseAliases[normalize(name.trim())] || name.trim();

function DataNotice() {
  return (
    <p className="dataNotice">
      Informações de referência, sujeitas a alteração. Confirme valores, bolsas e conceitos com a instituição e no{" "}
      <a href="https://emec.mec.gov.br" target="_blank" rel="noopener noreferrer">e-MEC</a>.
    </p>
  );
}

const authError = (message: string) => {
  if (/already registered|already exists/i.test(message)) return "Este e-mail já possui uma conta. Tente entrar.";
  if (/password/i.test(message)) return "Escolha uma senha mais forte, com pelo menos 8 caracteres.";
  if (/email/i.test(message)) return "Informe um e-mail válido.";
  if (/rate limit|too many/i.test(message)) return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  return "Não foi possível criar a conta agora. Tente novamente.";
};

function useEscape(onClose: () => void) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close.current(); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
}


// SVG icons; the size matches the optical size of the text glyphs they replaced.
const Icon = ({ n, s = 20 }: { n: string; s?: number }) => (
  <span className="ico">
    <CinemaIcon name={n} size={Math.round(s * 0.82)} />
  </span>
);

const initials = (name = "Usuário") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

function MatriculouLogo({ className = "" }: { className?: string }) {
  return (
    <Link className={`matriculouLogo ${className}`} href="/">
      <img src="/images/matriculou-logo-white.png" alt="Matriculou" width={162} height={55} />
    </Link>
  );
}

function BIJKLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`bijkLogo ${className}`}>
      <img src="/images/bijk-logo.png" alt="BIJK" width={160} height={160} loading="lazy" />
    </div>
  );
}

function NavBar({
  user,
  onMenu,
  menuOpen,
  activeView,
}: {
  user: UserProfile | null;
  onMenu: () => void;
  menuOpen: boolean;
  activeView: View;
}) {
  return (
    <header className="nav">
      <div className="navAura navAuraOne" />
      <div className="navAura navAuraTwo" />
      <div className="navInner">
        <MatriculouLogo />

        <nav className="desktopNav" aria-label="Navegação principal">
          {nav.map((x) => {
            const viewByHref: Record<string, View> = {
              "/instituicoes": "instituicoes",
              "/cursos": "cursos",
              "/comparar": "comparar",
              "/como-funciona": "como",
              "/sobre": "sobre",
            };
            const isActive = activeView === viewByHref[x.href];
            return (
              <Link
                key={x.href}
                href={x.href}
                aria-current={isActive ? "page" : undefined}
                className={isActive ? "active" : ""}
              >
                <span>{x.label}</span>
                {isActive && <i aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        <div className="navActions"><Link href="/instituicoes#busca" className="navSearch" aria-label="Buscar instituições"><Icon n="search" s={25}/></Link>
          {user ? (
            <Link href="/perfil" className="userMini">
              <span>
                Olá, <b>{user.name.split(" ")[0]}</b>
              </span>

              {user.avatar_url ? (
                <img src={user.avatar_url} alt="Foto de perfil" width={36} height={36} />
              ) : (
                <span className="avatar">{initials(user.name)}</span>
              )}
            </Link>
          ) : (
            <>
              <Link href="/login" className="loginLink">
                Entrar
              </Link>

              <Link href="/cadastro" className="button small">
                Criar conta
              </Link>
            </>
          )}

          <button
            className="menuBtn"
            onClick={onMenu}
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-controls="menu-principal"
          >
            <Icon n="menu" s={23} />
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileMenu({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: UserProfile | null;
}) {
  const panel = useRef<HTMLElement>(null);
  const closeMenu = useRef(onClose);
  closeMenu.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const keyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); closeMenu.current(); }
      if (e.key === "Tab") {
        const items = panel.current?.querySelectorAll<HTMLElement>("button,a[href]");
        if (!items?.length) return;
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", keyboard);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", keyboard); if (previous?.isConnected) previous.focus({ preventScroll: true }); };
  }, [open]);
  if (!open) return null;

  return (
    <>
      <div className="overlay" onClick={onClose} />

      <aside className="mobileMenu" id="menu-principal" ref={panel} role="dialog" aria-modal="true" aria-label="Menu de navegação">
        <button className="closeBtn" onClick={onClose} aria-label="Fechar menu">
          <Icon n="close" s={24} />
        </button>

        <MatriculouLogo />

        <div>
          {nav.map((x) => (
            <Link onClick={onClose} key={x.href} href={x.href}>
              {x.label}
            </Link>
          ))}

          {user ? (
            <Link onClick={onClose} href="/perfil">
              Meu perfil
            </Link>
          ) : (
            <>
              <Link onClick={onClose} href="/login">
                Entrar
              </Link>

              <Link onClick={onClose} href="/cadastro">
                Criar conta
              </Link>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function Toast({ text }: { text: string }) {
  return <div className="toast" role="status">{text}</div>;
}

function InstitutionCard({
  i,
  liked,
  onLike,
  onCompare,
  onOpen,
}: {
  i: Institution;
  liked: boolean;
  onLike: () => void;
  onCompare: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="instCard" data-cinema-tilt>
      <div className="instImage">
        <InstitutionImage i={i} />
        {!i.image && <span className="illustrativeTag">Imagem ilustrativa</span>}

        <span className="badge">
          {i.network === "publica" ? "Pública" : "Privada"} · {typeLabel(i.type)}
        </span>

        <button
          aria-label={liked ? `Remover ${i.name} dos favoritos` : `Favoritar ${i.name}`}
          aria-pressed={liked}
          className={liked ? "heart liked" : "heart"}
          onClick={onLike}
        >
          <Icon n="heart" s={25} />
        </button>
      </div>

      <div className="instBody">
        <div className="rating">
          <span>Conceito MEC: {mecLabel(i)}</span>
        </div>

        <h3>{i.name}</h3>

        <p className="place">
          <Icon n="pin" s={17} /> {i.city}, {i.state}
        </p>

        <div className="chips">
          <span>{i.scholarships ? "Bolsas" : "Bolsas não informadas"}</span>

          <span>{priceLabel(i)}</span>
        </div>

        <div className="cardActions">
          <button className="outline" onClick={onCompare}>
            <Icon n="compare" s={18} /> Comparar
          </button>

          <button className="button" onClick={onOpen}>
            Ver instituição <Icon n="arrow" s={18} />
          </button>
        </div>
      </div>
    </article>
  );
}

function InstitutionModal({
  i,
  onClose,
  onCompare,
}: {
  i: Institution;
  onClose: () => void;
  onCompare: () => void;
}) {
  useEscape(onClose);
  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="institution-modal-title" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={onClose} aria-label="Fechar detalhes" autoFocus>
          <Icon n="close" s={24} />
        </button>

        <InstitutionImage i={i} className="modalImage" sizes="(max-width: 900px) 100vw, 900px" />

        <div className="modalBody">
          <span className="eyebrow">
            {i.network === "publica" ? "Pública" : "Privada"} · {typeLabel(i.type)}
          </span>

          <h2 id="institution-modal-title">{i.name}</h2>

          <p>
            Tenha uma visão rápida da instituição antes de decidir. Consulte
            localização, conceito MEC, investimento e bolsas.
          </p>

          <div className="detailGrid">
            <div>
              <small>Localização</small>
              <b>
                {i.city}, {i.state}
              </b>
            </div>

            <div>
              <small>Conceito MEC</small>
              <b>{mecLabel(i)}</b>
            </div>

            <div>
              <small>Mensalidade média</small>
              <b>{priceLabel(i, "")}</b>
            </div>

            <div>
              <small>Rede</small>
              <b>{i.network === "publica" ? "Pública" : "Privada"}</b>
            </div>

            <div>
              <small>Bolsas</small>
              <b>{i.scholarships ? "Disponíveis" : "Não informadas"}</b>
            </div>

            <div>
              <small>Vagas e inscrições</small>
              <b>Consulte a instituição</b>
            </div>
          </div>

          <DataNotice />
          <ImageCredit i={i} />

          <button
            className="button"
            onClick={() => {
              onCompare();
              onClose();
            }}
          >
            Adicionar à comparação <Icon n="compare" s={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function InstitutionsView({
  institutions,
  offers,
  liked,
  onLike,
  onCompare,
  onOpen,
  loading,
}: {
  institutions: Institution[];
  offers: Offer[];
  liked: string[];
  onLike: (id: string) => void;
  onCompare: (id: string) => void;
  onOpen: (i: Institution) => void;
  loading: boolean;
}) {
  const [q, setQ] = useState("");

  const [network, setNetwork] = useState("todas");
  const [type, setType] = useState("todos");
  const [state, setState] = useState("todos");
  const [mode, setMode] = useState("todos");
  const [max, setMax] = useState("");
  // Progressive rendering: the first cards paint immediately, the rest join in idle time,
  // so a 100+ item catalog never blocks input. Counts and filters still use the full list.
  const [limit, setLimit] = useState(12);

  const types = [
    ...new Set(institutions.map((i) => i.type).filter(Boolean)),
  ].sort();

  const states = [
    ...new Set(institutions.map((i) => i.state).filter(Boolean)),
  ].sort();

  // Name, city, state (abbreviation and full name), type, network and courses offered.
  const searchText = useMemo(() => {
    const courses = new Map<string, string[]>();
    for (const o of offers) {
      if (!o.course_name) continue;
      if (!courses.has(o.institution_id)) courses.set(o.institution_id, []);
      courses.get(o.institution_id)!.push(o.course_name);
    }
    return new Map(institutions.map((i) => [
      i.id,
      [i.name, i.city, i.state, stateNames[i.state] || "", typeLabel(i.type), i.network === "publica" ? "pública" : "privada", ...(courses.get(i.id) || [])].join(" "),
    ]));
  }, [institutions, offers]);

  const filtered = institutions
    .filter((i) => matchesQuery(searchText.get(i.id) || i.name, q))
    .filter(
      (i) => network === "todas" || i.network === network
    )
    .filter((i) => type === "todos" || i.type === type)
    .filter((i) => state === "todos" || i.state === state)
    // Private institutions without a published fee are left out: the price is unknown, not zero.
    .filter((i) => !max || (i.network === "publica" ? i.price <= Number(max) : i.price > 0 && i.price <= Number(max)))
    .filter(
      (i) =>
        mode === "todos" ||
        offers.some(
          (o) =>
            o.institution_id === i.id &&
            (mode === "hibrido"
              ? [
                  "hibrido",
                  "semipresencial",
                  "híbrido",
                ].includes(
                  o.modality?.toLowerCase() || ""
                )
              : o.modality?.toLowerCase() === mode)
        )
    );

  useEffect(() => {
    if (limit >= filtered.length) return;
    const next = () => setLimit((current) => current + 12);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(next, { timeout: 300 });
      return () => cancelIdleCallback(id);
    }
    const id = setTimeout(next, 50);
    return () => clearTimeout(id);
  }, [limit, filtered.length]);

  return (
    <main className="page" id="conteudo">
      <CatalogQuery onChange={params => {
    setQ(params.get("q") || "");
    setNetwork(["publica", "privada"].includes(params.get("rede") || "") ? params.get("rede")! : "todas");
    setMode(["ead", "presencial", "hibrido"].includes(params.get("modalidade") || "") ? params.get("modalidade")! : "todos");
    const price = params.get("max");
    setMax(price && Number.isFinite(Number(price)) && Number(price) >= 0 ? price : "");
        }}/><CinematicPageHero kind="institutions">
        <span className="eyebrow white">
          Catálogo de instituições
        </span>

        <h1>Encontre a instituição certa.</h1>

        <p>
          Encontre instituições por localização, rede, tipo, modalidade e faixa de preço.
          Use os filtros para deixar a busca do seu jeito.
        </p>
      </CinematicPageHero>

      <section className="catalog" id="busca">
        <div className="filtersShell">
          <div className="filtersIntro">
            <div>
              <span className="eyebrow">Busca inteligente</span>
              <h2>Encontre pelo que importa para você.</h2>
              <p>Combine localização, rede, tipo, modalidade e investimento.</p>
            </div>
            <button
              className="filterClear"
              onClick={() => {
                setQ("");
                setNetwork("todas");
                setType("todos");
                setState("todos");
                setMode("todos");
                setMax("");
              }}
            >
              Limpar filtros
            </button>
          </div>

          <div className="filters">
            <label className="filterSearch">
              <Icon n="search" s={23} />
              <span>Pesquisar</span>
              <input
                value={q}
                maxLength={120}
                onChange={guard("text", setQ)}
                placeholder="Instituição, cidade, estado ou curso"
                aria-label="Pesquisar instituição, cidade, estado ou curso"
              />
            </label>

            <label className="filterField">
              <span>Rede</span>
              <select aria-label="Rede" value={network} onChange={(e) => setNetwork(e.target.value)}>
                <option value="todas">Pública ou privada</option>
                <option value="publica">Pública</option>
                <option value="privada">Privada</option>
              </select>
            </label>

            <label className="filterField">
              <span>Tipo</span>
              <select aria-label="Tipo de instituição" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="todos">Todos os tipos</option>
                {types.map((x) => <option key={x} value={x}>{typeLabel(x)}</option>)}
              </select>
            </label>

            <label className="filterField">
              <span>Localização</span>
              <select aria-label="Estado" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="todos">Todos os estados</option>
                {states.map((x) => <option key={x} value={x}>{x}</option>)}
              </select>
            </label>

            <label className="filterField">
              <span>Modalidade</span>
              <select aria-label="Modalidade" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="todos">Todas</option>
                <option value="presencial">Presencial</option>
                <option value="ead">EAD</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </label>

            <label className="filterField priceField">
              <span>Mensalidade máxima</span>
              <div className="priceControl">
                <small>R$</small>
                <input
                  type="number"
                  min="0"
                  step="50"
                  inputMode="numeric"
                  aria-label="Mensalidade máxima em reais"
                  value={max}
                  onChange={(e) => setMax(e.target.value.replace(/^-/, ""))}
                  placeholder="Sem limite"
                />
              </div>
            </label>
          </div>

          <div className="activeFilters">
            {q && <span>Busca: {q}</span>}
            {network !== "todas" && <span>{network === "publica" ? "Pública" : "Privada"}</span>}
            {type !== "todos" && <span>{typeLabel(type)}</span>}
            {state !== "todos" && <span>{state}</span>}
            {mode !== "todos" && <span>{mode === "ead" ? "EAD" : mode === "hibrido" ? "Híbrido" : "Presencial"}</span>}
            {max && <span>Até R$ {Number(max).toLocaleString("pt-BR")}</span>}
            {!q && network === "todas" && type === "todos" && state === "todos" && mode === "todos" && !max && <span className="mutedFilter">Todos os resultados</span>}
          </div>
        </div>

        <div className="resultBar">
          {loading
            ? <div><b>Carregando instituições…</b><span>Buscando o catálogo</span></div>
            : <div><b>{filtered.length} {filtered.length === 1 ? "instituição" : "instituições"}</b><span>{filtered.length === 1 ? "Resultado encontrado" : "Resultados encontrados"}</span></div>}
          <span>{max ? "Com valor máximo, entram as públicas e as privadas com mensalidade informada." : "Favoritos ficam salvos no seu perfil."}</span>
        </div>

        <div className="cards3">
          {filtered.slice(0, limit).map((i) => (
            <InstitutionCard
              key={i.id}
              i={i}
              liked={liked.includes(i.id)}
              onLike={() => onLike(i.id)}
              onCompare={() => onCompare(i.id)}
              onOpen={() => onOpen(i)}
            />
          ))}
        </div>

        {!filtered.length && !loading && (
          <div className="emptySmall">
            Nenhuma instituição encontrada com esses filtros. Tente outra palavra ou clique em “Limpar filtros”.
          </div>
        )}
      </section>
    </main>
  );
}

const getCourseDetail = (name: string): CourseDetail => {
  const info = courseInfo.find((c) => c.name.toLowerCase() === name.toLowerCase());
  const { area, icon } = courseArea(name);
  if (info) return { ...info, icon };

  return {
    name,
    area,
    duration: "Consulte",
    icon,
    desc: "Consulte a instituição para conhecer a estrutura e as características específicas deste curso.",
    price: 0,
    grade: [],
    level: "Consulte",
    modality: "Consulte",
    shifts: ["Consulte"],
    profile: "As características podem variar de acordo com a instituição e o projeto pedagógico.",
    skills: ["Conhecimentos técnicos", "Comunicação", "Trabalho em equipe"],
    careers: ["Consulte possibilidades de atuação"],
    internship: "Consulte a instituição.",
    practicalFocus: "Consulte a matriz curricular e as atividades práticas.",
    entryPath: "Consulte as formas de ingresso da instituição.",
  };
};

function CourseModal({
  course,
  offers,
  institutions,
  onClose,
}: {
  course: CourseDetail;
  offers: Offer[];
  institutions: Institution[];
  onClose: () => void;
}) {
  const related = institutions.filter((i) =>
    offers.some(
      (o) =>
        o.institution_id === i.id &&
        o.course_name?.toLowerCase() ===
          course.name.toLowerCase()
    )
  );

  useEscape(onClose);
  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div
        className="modal courseModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="closeBtn" onClick={onClose} aria-label="Fechar detalhes do curso" autoFocus>
          <Icon n="close" s={24} />
        </button>

        <div className="courseModalHead">
          <img src={course.icon} alt={`Ícone da área de ${course.area}`} width={92} height={92} />

          <div>
            <span className="eyebrow">{course.area}</span>
            <h2 id="course-modal-title">{course.name}</h2>
            <p>{course.desc}</p>
          </div>
        </div>

        <div className="detailGrid courseDetailGrid">
          <div><small>Formação</small><b>{course.level}</b></div>
          <div><small>Duração</small><b>{course.duration}</b></div>
          <div><small>Preço médio (referência)</small><b>{course.price ? `R$ ${course.price.toLocaleString("pt-BR")}/mês` : "Varia por instituição"}</b></div>
          <div><small>Instituições</small><b>{related.length || "Consulte"}</b></div>
          <div><small>Modalidade</small><b>{course.modality}</b></div>
          <div><small>Turnos</small><b>{course.shifts.join(" · ")}</b></div>
          <div><small>Estágio</small><b>{course.internship}</b></div>
          <div><small>Ingresso</small><b>{course.entryPath}</b></div>
        </div>

        <div className="courseInfoSections">
          <section className="courseInfoBlock">
            <span className="eyebrow">Perfil</span>
            <h3>Para quem é este curso?</h3>
            <p>{course.profile}</p>
          </section>
          <section className="courseInfoBlock">
            <span className="eyebrow">Prática</span>
            <h3>Como é a experiência?</h3>
            <p>{course.practicalFocus}</p>
          </section>
        </div>

        <div className="courseGrade">
          <h3>Principais competências</h3>
          <div className="gradeGrid">
            {course.skills.map((item) => <span key={item}><Icon n="check" s={16} /> {item}</span>)}
          </div>
        </div>

        <div className="courseGrade">
          <h3>Grade curricular de referência</h3>
          <div className="gradeGrid">
            {course.grade.map((item) => <span key={item}><Icon n="check" s={16} /> {item}</span>)}
          </div>
        </div>

        <div className="courseCareers">
          <div>
            <span className="eyebrow">Mercado</span>
            <h3>Possíveis caminhos profissionais</h3>
          </div>
          <div className="careerChips">
            {course.careers.map((career) => <span key={career}>{career}</span>)}
          </div>
        </div>

        {related.length > 0 && (
          <div className="relatedCourses">
            <h3>Onde encontrar</h3>

            {related.slice(0, 6).map((i) => (
              <div key={i.id}>
                <b>{i.name}</b>

                <span>
                  {i.city}, {i.state} ·{" "}
                  {i.network === "publica"
                    ? "Pública"
                    : "Privada"}
                </span>
              </div>
            ))}
          </div>
        )}

        <DataNotice />
      </div>
    </div>
  );
}

function CourseCompareTable({
  courses,
  onEdit,
}: {
  courses: CourseDetail[];
  onEdit: () => void;
}) {
  const values = (c: CourseDetail) => ({
    area: c.area,
    level: c.level,
    duration: c.duration,
    price: c.price ? `R$ ${c.price.toLocaleString("pt-BR")}/mês` : "Varia por instituição",
    modality: c.modality,
    shifts: c.shifts.join(" · "),
    profile: c.profile,
    practical: c.practicalFocus,
    internship: c.internship,
    skills: c.skills.join(" · "),
    careers: c.careers.join(" · "),
    subjects: c.grade.slice(0, 6).join(" · "),
  });

  const rows = [
    ["Área", (c: CourseDetail) => values(c).area],
    ["Formação", (c: CourseDetail) => values(c).level],
    ["Duração", (c: CourseDetail) => values(c).duration],
    ["Preço médio (referência)", (c: CourseDetail) => values(c).price],
    ["Modalidade", (c: CourseDetail) => values(c).modality],
    ["Turnos", (c: CourseDetail) => values(c).shifts],
    ["Perfil do curso", (c: CourseDetail) => values(c).profile],
    ["Foco prático", (c: CourseDetail) => values(c).practical],
    ["Estágio", (c: CourseDetail) => values(c).internship],
    ["Competências", (c: CourseDetail) => values(c).skills],
    ["Carreiras", (c: CourseDetail) => values(c).careers],
    ["Disciplinas", (c: CourseDetail) => values(c).subjects],
  ] as const;

  return (
    <section className="courseCompareResult">
      <div className="courseCompareTop">
        <div>
          <span className="eyebrow">Comparação</span>
          <h2>Veja tudo lado a lado.</h2>
          <p>
            Compare os cursos selecionados pelos principais critérios antes de
            decidir.
          </p>
        </div>

        <button className="outline" onClick={onEdit}>
          <Icon n="edit" s={17} /> Editar seleção
        </button>
      </div>

      <div className="courseCompareTableWrap">
        <table className="courseCompareTable">
          <thead>
            <tr>
              <th>Critério</th>

              {courses.map((c) => (
                <th key={c.name}>
                  <div className="compareCourseHead">
                    <div className="compareCourseIcon">
                      <img src={c.icon} alt={`Ícone da área de ${c.area}`} width={48} height={48} loading="lazy" />
                    </div>

                    <div>
                      <b>{c.name}</b>
                      <span>{c.area}</span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map(([label, get]) => (
              <tr key={label}>
                <th>{label}</th>

                {courses.map((c) => (
                  <td key={`${label}-${c.name}`}>
                    <span
                      className={
                        label === "Preço médio (referência)"
                          ? "compareValue strong"
                          : "compareValue"
                      }
                    >
                      {get(c)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DataNotice />

      <div className="courseCompareFooter">
        <span>
          <Icon n="check" s={17} /> {courses.length} cursos selecionados para
          comparação
        </span>

        <button className="button" onClick={onEdit}>
          Escolher outros cursos <Icon n="arrow" />
        </button>
      </div>
    </section>
  );
}

function CoursesView({
  offers,
  institutions,
}: {
  offers: Offer[];
  institutions: Institution[];
}) {
  const [q, setQ] = useState("");

  const [area, setArea] = useState("Todas");
  const [selected, setSelected] =
    useState<CourseDetail | null>(null);

  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const names = [
    ...new Set(
      offers
        .map((o) => o.course_name)
        .filter(Boolean)
    ),
  ];

  const areas = [
    ...new Set([...courseInfo.map((c) => c.area), ...names.map((n) => getCourseDetail(n).area)]),
  ].filter((a) => a !== "Outras áreas");
  const activeArea = areas.includes(area) ? area : "Todas";

  const data = names.length
    ? [
        ...new Set([
          ...courseInfo.map((c) => c.name),
          ...names,
        ]),
      ]
    : courseInfo.map((c) => c.name);

  const filtered = data
    .filter((n) => {
      const d = getCourseDetail(n);
      return matchesQuery(`${n} ${d.area} ${d.level}`, q);
    })
    .filter(
      (n) =>
        activeArea === "Todas" ||
        getCourseDetail(n).area === activeArea
    );

  const detail = (name: string): CourseDetail => getCourseDetail(name);

  // Institutions per course, built once per data load instead of per card and render.
  const institutionsByCourse = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const o of offers) {
      const key = o.course_name?.toLowerCase();
      if (!key) continue;
      if (!map.has(key)) map.set(key, new Set());
      map.get(key)!.add(o.institution_id);
    }
    return map;
  }, [offers]);

  const compareCourses = compareIds.map(detail);

  const toggleCompare = (name: string) => {
    setConfirmed(false);

    setCompareIds((current) =>
      current.includes(name)
        ? current.filter((x) => x !== name)
        : current.length >= 4
        ? current
        : [...current, name]
    );
  };

  return (
    <main className="page" id="conteudo">
      <CatalogQuery onChange={params => {
    setQ(params.get("q") || "");
    const requestedArea = params.get("area");
    setArea(requestedArea && requestedArea.length < 40 ? requestedArea : "Todas");
        }}/><CinematicPageHero kind="courses">
        <span className="eyebrow white">
          Explore cursos
        </span>

        <h1>Entenda antes de escolher.</h1>

        <p>
          Abra um curso para conhecer melhor sua duração, disciplinas, faixa
          de preço e instituições que oferecem o curso.
        </p>
      </CinematicPageHero>

      {!confirmed ? (
        <section className="catalog">
          <div className="courseFilters">
            <div className="filterSearch">
              <Icon n="search" s={23} />

              <input
                value={q}
                maxLength={120}
                onChange={guard("text", setQ)}
                placeholder="Pesquisar curso..."
                aria-label="Pesquisar curso"
              />
            </div>

            {["Todas", ...areas].map((a) => (
              <button
                className={
                  activeArea === a
                    ? "filterPill active"
                    : "filterPill"
                }
                key={a}
                aria-pressed={activeArea === a}
                onClick={() => setArea(a)}
              >
                {a}
              </button>
            ))}
          </div>

          <div className="courseSelectionBar">
            <div>
              <b>{compareIds.length}/4 cursos selecionados</b>

              <span>
                {compareIds.length < 2
                  ? "Selecione pelo menos 2 cursos para comparar."
                  : "Você pode comparar até 4 cursos lado a lado."}
              </span>
            </div>

            <div className="courseSelectionActions">
              {compareIds.length > 0 && (
                <button
                  className="outline"
                  onClick={() => setCompareIds([])}
                >
                  Limpar
                </button>
              )}

              <button
                className="button"
                disabled={compareIds.length < 2}
                onClick={() => setConfirmed(true)}
              >
                Confirmar seleção <Icon n="check" />
              </button>
            </div>
          </div>

          <div className="courseLargeGrid">
            {filtered.map((name) => {
              const info = detail(name);

              const relCount = institutionsByCourse.get(name.toLowerCase())?.size ?? 0;

              const isSelected =
                compareIds.includes(name);

              return (
                <article
                  className={
                    isSelected
                      ? "courseLarge courseCompareSelected"
                      : "courseLarge"
                  }
                  key={name}
                >
                  <div className="courseLargeIcon">
                    <img src={info.icon} alt={`Ícone da área de ${info.area}`} width={58} height={58} loading="lazy" />
                  </div>

                  <span>{info.area}</span>

                  <h2>{name}</h2>

                  <p>{info.desc}</p>

                  <div className="courseMeta">
                    <b>{info.duration}</b>

                    <span>
                      {relCount
                        ? `${relCount} instituições`
                        : "Consulte opções"}
                    </span>
                  </div>

                  <div className="courseCardActions">
                    <button
                      className={
                        isSelected
                          ? "compareToggle selected"
                          : "compareToggle"
                      }
                      aria-pressed={isSelected}
                      onClick={() =>
                        toggleCompare(name)
                      }
                    >
                      <span>
                        <Icon n={isSelected ? "check" : "compare"} s={18} />
                      </span>{" "}
                      {isSelected
                        ? "Selecionado"
                        : "Comparar"}
                    </button>

                    <button
                      className="button"
                      onClick={() =>
                        setSelected(info)
                      }
                    >
                      Entender mais <Icon n="arrow" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {!filtered.length && (
            <div className="emptySmall">
              Nenhum curso encontrado. Tente outra palavra ou escolha “Todas” as áreas.
            </div>
          )}
        </section>
      ) : (
        <CourseCompareTable
          courses={compareCourses}
          onEdit={() => setConfirmed(false)}
        />
      )}

      {selected && (
        <CourseModal
          course={selected}
          offers={offers}
          institutions={institutions}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}

function InstitutionCompareTable({
  institutions,
  onEdit,
  onRemove,
}: {
  institutions: Institution[];
  onEdit: () => void;
  onRemove: (id: string) => void;
}) {
  const rows = [
    ["Rede", (i: Institution) => i.network === "publica" ? "Pública" : "Privada"],
    ["Tipo", (i: Institution) => typeLabel(i.type)],
    ["Localização", (i: Institution) => `${i.city}, ${i.state}`],
    ["Conceito MEC", (i: Institution) => mecLabel(i)],
    ["Mensalidade média", (i: Institution) => priceLabel(i)],
    ["Bolsas", (i: Institution) => i.scholarships ? "Disponíveis" : "Não informadas"],
  ] as const;

  return (
    <section className="courseCompareResult institutionCompareResult">
      <div className="courseCompareTop">
        <div>
          <span className="eyebrow">Comparação de instituições</span>
          <h2>Veja as opções lado a lado.</h2>
          <p>Compare os pontos mais importantes antes de escolher onde estudar.</p>
        </div>
        <button className="outline" onClick={onEdit}>
          <Icon n="edit" s={17} /> Editar seleção
        </button>
      </div>

      <div className="courseCompareTableWrap">
        <table className="courseCompareTable institutionCompareTable">
          <thead>
            <tr>
              <th>Critério</th>
              {institutions.map((i) => (
                <th key={i.id}>
                  <div className="compareCourseHead">
                    <div className="compareInstitutionIcon">
                      <InstitutionImage i={i} sizes="96px" />
                    </div>
                    <div>
                      <b>{i.name}</b>
                      <span>{i.city}, {i.state}</span>
                    </div>
                    <button
                      className="compareRemove"
                      onClick={() => onRemove(i.id)}
                      aria-label={`Remover ${i.name} da comparação`}
                      title="Remover da comparação"
                    >
                      <Icon n="close" s={18} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, get]) => (
              <tr key={label}>
                <th>{label}</th>
                {institutions.map((i) => (
                  <td key={`${label}-${i.id}`}>
                    <span className={label === "Mensalidade média" ? "compareValue strong" : "compareValue"}>
                      {get(i)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DataNotice />

      <div className="courseCompareFooter">
        <span><Icon n="check" s={17} /> {institutions.length} instituições selecionadas para comparação</span>
        <button className="outline" onClick={onEdit}>Escolher outras <Icon n="arrow" /></button>
      </div>
    </section>
  );
}

function Compare({ institutions }: { institutions: Institution[] }) {
  const [ids, setIds] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [type, setType] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("matriculou-compare");
      const saved = raw ? JSON.parse(raw) : [];
      if (Array.isArray(saved)) setIds(saved.filter((x) => typeof x === "string").slice(0, 4));
    } catch {}
  }, []);

  const persist = (next: string[]) => {
    setIds(next);
    try { sessionStorage.setItem("matriculou-compare", JSON.stringify(next)); } catch {}
  };

  const remove = (id: string) => persist(ids.filter((x) => x !== id));

  const selected = ids.map((id) => institutions.find((i) => i.id === id)).filter(Boolean) as Institution[];

  // Counts only institutions that still exist in the catalog, so a stale id never blocks a slot.
  const add = (id: string) => {
    if (ids.includes(id) || selected.length >= 4) return;
    persist([...selected.map((i) => i.id), id]);
    setModal(false);
    setSearch("");
  };
  const types = [...new Set(institutions.map((i) => i.type).filter(Boolean))].sort();
  const full = selected.length >= 4;
  const options = institutions.filter((i) =>
    (type === "todos" || i.type === type) &&
    !ids.includes(i.id) &&
    matchesQuery(`${i.name} ${i.city} ${i.state} ${stateNames[i.state] || ""}`, search)
  );

  return (
    <main className="page" id="conteudo">
      <CinematicPageHero kind="compare">
        <span className="eyebrow white">Comparador</span>
        <h1>Compare com calma.</h1>
        <p>Escolha até quatro instituições e veja localização, conceito MEC, investimento e bolsas em uma única visão.</p>
      </CinematicPageHero>

      <section className="compareArea">
        {selected.length < 2 ? (
          <div className="compareWorkspace">
            <div className="compareHeader">
              <div>
                <b>{selected.length}/4 selecionadas</b>
                <span>Adicione pelo menos duas instituições para abrir a comparação.</span>
              </div>
              <button className="button" onClick={() => setModal(true)}>Adicionar instituição <Icon n="plus" /></button>
            </div>

            <div className="compareSlots">
              {[0, 1, 2, 3].map((slot) => {
                const i = selected[slot];
                return (
                  <div className={i ? "compareSlot filled" : "compareSlot"} key={slot}>
                    {i ? (
                      <>
                        <InstitutionImage i={i} sizes="160px" />
                        <div><b>{i.name}</b><span>{i.city}, {i.state}</span></div>
                        <button onClick={() => remove(i.id)} aria-label={`Remover ${i.name}`}><Icon n="close" s={20} /></button>
                      </>
                    ) : (
                      <><span className="compareSlotPlus"><Icon n="plus" s={28} /></span><span>Adicionar instituição</span></>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="compareHint">
              <div className="emptyIcon"><Icon n="compare" s={32} /></div>
              <div><b>Monte sua comparação</b><span>Escolha instituições e veja diferenças de preço, conceito MEC e bolsas em uma única visão.</span></div>
            </div>
          </div>
        ) : (
          <InstitutionCompareTable institutions={selected} onEdit={() => setModal(true)} onRemove={remove} />
        )}
      </section>

      {modal && <ComparePicker onClose={() => setModal(false)}>
            <span className="eyebrow">Adicionar ao comparador</span>
            <h2 id="compare-picker-title">Escolha suas instituições.</h2>
            <p>
              {full
                ? "Você já escolheu quatro instituições. Remova uma da comparação para adicionar outra."
                : `Pesquise, filtre por tipo e selecione até quatro opções (${selected.length}/4).`}
            </p>
            <label className="filterSearch pickerSearch">
              <Icon n="search" s={20} />
              <input
                value={search}
                maxLength={120}
                onChange={guard("text", setSearch)}
                placeholder="Instituição, cidade ou estado"
                aria-label="Pesquisar instituição para comparar"
              />
            </label>
            <div className="pickerTypes">
              <button className={type === "todos" ? "active" : ""} onClick={() => setType("todos")}>Todas</button>
              {types.map((t) => <button className={type === t ? "active" : ""} key={t} onClick={() => setType(t)}>{typeLabel(t)}</button>)}
            </div>
            <div className="pickerList">
              {options.map((i) => (
                <button key={i.id} onClick={() => add(i.id)} disabled={full}>
                  <InstitutionImage i={i} sizes="96px" />
                  <span><b>{i.name}</b><small>{i.city}, {i.state} · {i.network === "publica" ? "Pública" : "Privada"}</small></span>
                  <strong>{full ? "Limite atingido" : "Adicionar"}</strong>
                </button>
              ))}
              {!options.length && <div className="emptySmall">Não há outras instituições disponíveis com este filtro.</div>}
            </div>
      </ComparePicker>}
    </main>
  );
}

function ComparePicker({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  useEscape(onClose);
  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="picker comparePicker" role="dialog" aria-modal="true" aria-labelledby="compare-picker-title" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={onClose} aria-label="Fechar seleção" autoFocus><Icon n="close" s={24} /></button>
        {children}
      </div>
    </div>
  );
}

function Profile({
  user,
  onUser,
  liked,
  onLike,
  onLogout,
  showToast,
}: {
  user: UserProfile;
  onUser: (u: UserProfile) => void;
  liked: Institution[];
  onLike: (id: string) => void;
  onLogout: () => void;
  showToast: (s: string) => void;
}) {
  const [section, setSection] = useState<
    "dados" | "documentos" | "favoritos" | "privacidade"
  >("dados");

  const [docs, setDocs] = useState<
    {
      id: string;
      nome: string;
      path: string | null;
      created_at: string;
      url: string;
    }[]
  >([]);

  const [docName, setDocName] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [docBusy, setDocBusy] = useState(false);
  const [docConsent, setDocConsent] = useState(false);
  const [name, setName] = useState(user.name);
  const [nameBusy, setNameBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [comparing, setComparing] = useState(0);

  useEffect(() => {
    try { setComparing(JSON.parse(sessionStorage.getItem("matriculou-compare") || "[]").length); } catch {}
  }, []);

  useEffect(() => {
    const loadDocs = async () => {
      const { data } = await supabase
      .from("documentos_usuario")
      .select("id,nome,path,created_at")
      .order("created_at", {
        ascending: false,
      });

      const rows = data || [];
      const paths = rows.map((doc) => doc.path).filter(Boolean) as string[];
      const { data: signed } = paths.length
        ? await supabase.storage.from("pre-matriculas").createSignedUrls(paths, signedUrlTtl)
        : { data: [] };

      setDocs(
        rows.map((doc) => ({
          ...doc,
          url: signed?.find((s) => s.path === doc.path)?.signedUrl || "",
        }))
      );
    };

    loadDocs();
  }, []);

  const saveName = async () => {
    const next = clean(name);
    if (next.length < 2) return showToast("Informe seu nome completo.");
    const invalid = fieldError(next, "name");
    if (invalid) return showToast(invalid);
    setNameBusy(true);
    const { error } = await supabase.from("usuarios").update({ nome_completo: next }).eq("id", user.id);
    setNameBusy(false);
    if (error) return showToast("Não foi possível atualizar o nome.");
    onUser({ ...user, name: next });
    showToast("Nome atualizado");
  };

  // Portabilidade (LGPD, art. 18, V): a copy of everything stored for this account.
  const exportData = async () => {
    const [profile, favorites, documents] = await Promise.all([
      supabase.from("usuarios").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("favoritos").select("instituicao_id,instituicao_nome,created_at").eq("user_id", user.id),
      supabase.from("documentos_usuario").select("nome,path,created_at").eq("user_id", user.id),
    ]);
    const payload = { exportado_em: new Date().toISOString(), controlador: legal.controller, perfil: profile.data, favoritos: favorites.data || [], documentos: documents.data || [] };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "meus-dados-matriculou.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const deleteAccount = async () => {
    if (!window.confirm("Excluir sua conta apaga cadastro, favoritos, foto e documentos. Essa ação não pode ser desfeita. Deseja continuar?")) return;
    setDeleting(true);
    for (const bucket of ["pre-matriculas", "avatars"]) {
      const { data: root } = await supabase.storage.from(bucket).list(user.id);
      const { data: nested } = await supabase.storage.from(bucket).list(`${user.id}/documentos`);
      const files = [
        ...(root || []).filter((f) => f.id).map((f) => `${user.id}/${f.name}`),
        ...(nested || []).filter((f) => f.id).map((f) => `${user.id}/documentos/${f.name}`),
      ];
      if (files.length) await supabase.storage.from(bucket).remove(files);
    }
    const { error } = await supabase.rpc("delete_own_account");
    if (error) {
      setDeleting(false);
      showToast("Não foi possível excluir a conta agora. Use o formulário LGPD para concluir o pedido.");
      return;
    }
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const avatar = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      return showToast(
        "Escolha uma imagem válida."
      );
    }

    if (file.size > 2 * 1024 * 1024) {
      return showToast("A foto de perfil deve ter até 2 MB.");
    }

    const ext =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() || "jpg";

    const path = `${user.id}/avatar-${Date.now()}.${ext}`;

    const bucket = "avatars";

    const { error } =
      await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: false,
          contentType: file.type,
          cacheControl: "3600",
        });

    if (error) {
      showToast(
        error.message.includes(
          "Bucket not found"
        )
          ? "O bucket de fotos não existe. Execute o supabase/setup.sql no seu projeto."
          : error.message
      );

      return;
    }

    const { data } =
      supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    const avatarUrl = `${data.publicUrl}?v=${Date.now()}`;

    const { error: dbError } =
      await supabase
        .from("usuarios")
        .update({
          avatar_url: avatarUrl,
        })
        .eq("id", user.id);

    if (dbError) {
      return showToast(
        dbError.message
      );
    }

    onUser({
      ...user,
      avatar_url: avatarUrl,
    });

    showToast(
      "Imagem de perfil atualizada"
    );
  };

  const chooseDocFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Envie uma foto válida do documento.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast("O documento deve ter até 10 MB.");
      return;
    }

    setDocFile(file);
  };

  const resetDocForm = () => {
    setDocName("");
    setDocFile(null);
    setEditingDoc(null);
  };

  const saveDoc = async () => {
    const name = clean(docName);
    if (!name) {
      showToast("Informe o nome do documento.");
      return;
    }
    const invalid = fieldError(name, "text");
    if (invalid) {
      showToast(invalid);
      return;
    }

    const currentDoc = docs.find((doc) => doc.id === editingDoc);
    if (!editingDoc && !docFile) {
      showToast("Envie uma foto do documento.");
      return;
    }

    if (docFile && !docConsent) {
      showToast("Confirme o consentimento para guardar o documento.");
      return;
    }

    setDocBusy(true);
    let path = currentDoc?.path || null;
    let url = currentDoc?.url || "";

    if (docFile) {
      const safeName = docFile.name.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      path = `${user.id}/documentos/${Date.now()}-${safeName}`;

      const { error } = await supabase.storage
        .from("pre-matriculas")
        .upload(path, docFile, {
          contentType: docFile.type,
        });

      if (error) {
        setDocBusy(false);
        showToast(
          error.message.includes("Bucket not found")
            ? "O espaço de documentos não existe. Execute o supabase/setup.sql."
            : error.message
        );
        return;
      }

      const { data: signed } = await supabase.storage
        .from("pre-matriculas")
        .createSignedUrl(path, signedUrlTtl);
      url = signed?.signedUrl || "";
    }

    if (editingDoc) {
      const { error } = await supabase
        .from("documentos_usuario")
        .update({ nome: name, path })
        .eq("id", editingDoc)
        .eq("user_id", user.id);

      if (error) {
        setDocBusy(false);
        showToast(error.message);
        return;
      }

      if (docFile && currentDoc?.path) {
        await supabase.storage
          .from("pre-matriculas")
          .remove([currentDoc.path]);
      }

      setDocs((current) =>
        current.map((doc) =>
          doc.id === editingDoc
            ? { ...doc, nome: name, path, url }
            : doc
        )
      );
      showToast("Documento atualizado");
    } else {
      const { data, error } = await supabase
        .from("documentos_usuario")
        .insert({
          user_id: user.id,
          nome: name,
          path,
        })
        .select("id,nome,path,created_at")
        .single();

      if (error) {
        setDocBusy(false);
        showToast(error.message);
        return;
      }

      setDocs((current) => [
        { ...data, url },
        ...current,
      ]);
      showToast("Documento adicionado");
    }

    setDocBusy(false);
    resetDocForm();
  };

  const editDoc = (doc: (typeof docs)[number]) => {
    setEditingDoc(doc.id);
    setDocName(doc.nome);
    setDocFile(null);
  };

  const deleteDoc = async (doc: (typeof docs)[number]) => {
    const { error } = await supabase
      .from("documentos_usuario")
      .delete()
      .eq("id", doc.id)
      .eq("user_id", user.id);

    if (error) {
      showToast(error.message);
      return;
    }

    if (doc.path) {
      await supabase.storage
        .from("pre-matriculas")
        .remove([doc.path]);
    }

    setDocs((current) => current.filter((item) => item.id !== doc.id));
    if (editingDoc === doc.id) resetDocForm();
    showToast("Documento apagado");
  };

  const sections = [
    { id: "dados", label: "Minha conta", icon: "user", count: null },
    { id: "favoritos", label: "Favoritos", icon: "heart", count: liked.length },
    { id: "documentos", label: "Documentos", icon: "file", count: docs.length },
    { id: "privacidade", label: "Privacidade", icon: "shield", count: null },
  ] as const;

  return (
    <main className="accountPage" id="conteudo">
      <section className="accountHeader">
        <div className="accountCover" aria-hidden="true" />

        <div className="accountIdentity">
          <div className="accountAvatar">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={`Foto de perfil de ${user.name}`} width={128} height={128} />
            ) : (
              <span aria-hidden="true">{initials(user.name)}</span>
            )}
            <label className="accountAvatarEdit" title="Trocar foto de perfil">
              <Icon n="camera" s={20} />
              <span className="srOnly">Trocar foto de perfil</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => e.target.files?.[0] && avatar(e.target.files[0])}
              />
            </label>
          </div>

          <div className="accountName">
            <h1>{user.name}</h1>
            <p><Icon n="mail" s={17} /> {user.email}</p>
          </div>

          <div className="accountHeaderActions">
            <Link href="/instituicoes" className="accountButton">
              <Icon n="search" s={17} /> Encontrar instituições
            </Link>
            <button type="button" className="accountButton ghost" onClick={onLogout}>
              <Icon n="logout" s={17} /> Sair
            </button>
          </div>
        </div>

        <dl className="accountStats">
          <div><dt>Favoritas</dt><dd>{liked.length}</dd></div>
          <div><dt>Documentos</dt><dd>{docs.length}</dd></div>
          <div><dt>No comparador</dt><dd>{comparing}/4</dd></div>
        </dl>

        <nav className="accountTabs" aria-label="Seções do perfil">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={section === item.id ? "page" : undefined}
              onClick={() => setSection(item.id)}
            >
              <Icon n={item.icon} s={19} />
              <span>{item.label}</span>
              {item.count !== null && <small>{item.count}</small>}
            </button>
          ))}
        </nav>
      </section>

      <section className="accountContent">
        {section === "dados" && (
          <div className="accountGrid">
            <article className="accountCard">
              <header>
                <span className="accountCardIcon"><Icon n="user" s={21} /></span>
                <div><h2>Informações pessoais</h2><p>Mantenha seu nome sempre atualizado.</p></div>
              </header>

              <div className="nameEdit">
                <label>
                  Nome completo
                  <input value={name} maxLength={120} autoComplete="name" onChange={guard("name", setName)} />
                </label>
                <button type="button" className="accountButton" onClick={saveName} disabled={nameBusy || name.trim() === user.name}>
                  {nameBusy ? "Salvando..." : "Salvar"}
                </button>
              </div>

              <label>
                E-mail
                <input value={user.email} disabled />
              </label>
            </article>

            <aside className="accountCard accountSummary">
              <header>
                <span className="accountCardIcon"><Icon n="compare" s={21} /></span>
                <div><h2>Sua jornada</h2><p>Atalhos para continuar de onde parou.</p></div>
              </header>
              <div className="accountActions">
                <button type="button" className="accountAction" onClick={() => setSection("favoritos")}>
                  <Icon n="heart" s={21} />
                  <span><b>{liked.length} {liked.length === 1 ? "favorita" : "favoritas"}</b><small>Instituições que você guardou.</small></span>
                </button>
                <button type="button" className="accountAction" onClick={() => setSection("documentos")}>
                  <Icon n="file" s={21} />
                  <span><b>{docs.length} {docs.length === 1 ? "documento" : "documentos"}</b><small>Guardados de forma privada.</small></span>
                </button>
                <Link href="/comparar" className="accountAction">
                  <Icon n="compare" s={21} />
                  <span><b>Comparador</b><small>{comparing ? `${comparing} de 4 instituições selecionadas.` : "Compare até quatro instituições."}</small></span>
                </Link>
              </div>
            </aside>
          </div>
        )}

        {section === "favoritos" && (
          <article className="accountCard">
            <header>
              <span className="accountCardIcon"><Icon n="heart" s={21} /></span>
              <div><h2>Instituições favoritas</h2><p>As instituições que você marcou com o coração.</p></div>
              <Link href="/instituicoes" className="accountButton ghost"><Icon n="plus" s={17} /> Adicionar</Link>
            </header>

            {liked.length ? (
              <div className="accountFavorites">
                {liked.map((i) => (
                  <article key={i.id}>
                    <InstitutionImage i={i} sizes="(max-width: 600px) 92vw, 300px" />
                    <div>
                      <b>{i.name}</b>
                      <span><Icon n="pin" s={15} /> {i.city}, {i.state}</span>
                    </div>
                    <button type="button" onClick={() => onLike(i.id)} aria-label={`Remover ${i.name} dos favoritos`} title="Remover dos favoritos">
                      <Icon n="heart" s={19} />
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <div className="accountEmpty">
                <Icon n="heart" s={34} />
                <b>Nenhuma favorita ainda</b>
                <p>Vá até <Link href="/instituicoes">Instituições</Link> e toque no coração para guardar uma opção aqui.</p>
              </div>
            )}
          </article>
        )}

        {section === "documentos" && (
          <div className="accountGrid">
            <article className="accountCard">
              <header>
                <span className="accountCardIcon"><Icon n="upload" s={21} /></span>
                <div><h2>{editingDoc ? "Editar documento" : "Adicionar documento"}</h2><p>Informe o nome e envie uma foto.</p></div>
              </header>

              <label>
                Nome do documento
                <input value={docName} maxLength={120} onChange={guard("text", setDocName)} placeholder="Ex.: Documento de identidade" />
              </label>

              <label className="accountDrop">
                <Icon n="upload" s={28} />
                <b>{docFile ? docFile.name : editingDoc ? "Trocar foto do documento" : "Selecionar foto"}</b>
                <span>JPG, PNG ou WEBP · até 10 MB</span>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => e.target.files?.[0] && chooseDocFile(e.target.files[0])} />
              </label>

              <label className="legalCheck accountConsent">
                <input type="checkbox" checked={docConsent} onChange={(e) => setDocConsent(e.target.checked)} />
                <span>
                  Autorizo o Matriculou a guardar este documento de forma privada, apenas para minha organização.
                  Posso apagá-lo quando quiser. Saiba mais na <Link href="/privacidade">Política de Privacidade</Link>.
                </span>
              </label>

              <div className="accountFormActions">
                <button className="accountButton" type="button" onClick={saveDoc} disabled={docBusy}>
                  <Icon n="check" s={17} />
                  {docBusy ? "Salvando..." : editingDoc ? "Salvar edição" : "Adicionar documento"}
                </button>
                {editingDoc && (
                  <button className="accountButton ghost" type="button" onClick={resetDocForm}>Cancelar</button>
                )}
              </div>
            </article>

            <article className="accountCard">
              <header>
                <span className="accountCardIcon"><Icon n="file" s={21} /></span>
                <div><h2>Seus documentos</h2><p>Privados. Os links de abertura expiram em 1 hora.</p></div>
              </header>

              {docs.length ? (
                <ul className="accountDocs">
                  {docs.map((d) => (
                    <li key={d.id}>
                      <span className="accountDocIcon"><Icon n="file" s={19} /></span>
                      <div>
                        {d.url ? (
                          <a href={d.url} target="_blank" rel="noopener noreferrer">{d.nome}</a>
                        ) : (
                          <b>{d.nome}</b>
                        )}
                        <small>Enviado em {new Date(d.created_at).toLocaleDateString("pt-BR")}</small>
                      </div>
                      <button type="button" onClick={() => editDoc(d)} aria-label={`Editar ${d.nome}`} title="Editar"><Icon n="edit" s={17} /></button>
                      <button type="button" className="danger" onClick={() => deleteDoc(d)} aria-label={`Apagar ${d.nome}`} title="Apagar"><Icon n="trash" s={17} /></button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="accountEmpty">
                  <Icon n="file" s={34} />
                  <b>Nenhum documento enviado</b>
                  <p>Os documentos que você adicionar aparecem aqui.</p>
                </div>
              )}
            </article>
          </div>
        )}

        {section === "privacidade" && (
          <article className="accountCard accountNarrow">
            <header>
              <span className="accountCardIcon"><Icon n="shield" s={21} /></span>
              <div><h2>Privacidade e LGPD</h2><p>Seus dados, sob o seu controle.</p></div>
            </header>

            <div className="accountActions">
              <button type="button" className="accountAction" onClick={exportData}>
                <Icon n="download" s={21} />
                <span><b>Baixar meus dados</b><small>Cópia do cadastro, favoritos e documentos.</small></span>
              </button>
              <Link href="/lgpd" className="accountAction">
                <Icon n="mail" s={21} />
                <span><b>Outras solicitações</b><small>Correção, informação ou revogação de consentimento.</small></span>
              </Link>
              <Link href="/privacidade" className="accountAction">
                <Icon n="book" s={21} />
                <span><b>Política de Privacidade</b><small>Como tratamos e protegemos seus dados.</small></span>
              </Link>
            </div>

            <div className="accountDanger">
              <div>
                <b>Excluir minha conta</b>
                <small>Apaga cadastro, favoritos, foto e documentos de forma definitiva.</small>
              </div>
              <button type="button" className="accountButton danger" onClick={deleteAccount} disabled={deleting}>
                <Icon n="trash" s={17} /> {deleting ? "Excluindo..." : "Excluir conta"}
              </button>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}

function Auth({
  register,
  onDone,
  showToast,
}: {
  register: boolean;
  onDone: (u: UserProfile) => void;
  showToast: (s: string) => void;
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!isSupabaseConfigured) { showToast("Login indisponível nesta demonstração. Explore os cursos e o comparador livremente."); return; }
    if (register && (!acceptTerms || !ageConfirmed)) { showToast("Confirme os termos e a declaração de idade para continuar."); return; }
    setBusy(true);

    if (register) {
      const { data, error } =
        await supabase.auth.signUp({
          email: clean(email),
          password,
          options: {
            data: {
              nome_completo: clean(name),
              termos_versao: legal.version,
              termos_aceitos_em: new Date().toISOString(),
            },
          },
        });

      if (error) {
        showToast(authError(error.message));
        setBusy(false);
        return;
      }

      if (!data.user) {
        showToast(
          "Não foi possível criar a conta."
        );
        setBusy(false);
        return;
      }

      if (!data.session) {
        showToast(
          "Conta criada. Confirme seu e-mail para entrar."
        );
        setBusy(false);
        return;
      }

      const u = {
        id: data.user.id,
        email:
          data.user.email || email,
        name: clean(name) || "Usuário",
        avatar_url: null,
      };

      onDone(u);

      router.push("/perfil");
    } else {
      const { data, error } =
        await supabase.auth.signInWithPassword(
          {
            email: clean(email),
            password,
          }
        );

      if (error) {
        showToast(
          /confirm/i.test(error.message)
            ? "Confirme seu e-mail antes de entrar."
            : "E-mail ou senha inválidos."
        );
        setBusy(false);
        return;
      }

      const profile =
        await supabase
          .from("usuarios")
          .select(
            "nome_completo,avatar_url,email"
          )
          .eq("id", data.user.id)
          .maybeSingle();

      onDone({
        id: data.user.id,
        email:
          data.user.email || email,
        name:
          profile.data?.nome_completo ||
          data.user.user_metadata
            ?.nome_completo ||
          "Usuário",
        avatar_url:
          profile.data?.avatar_url ||
          null,
      });

      router.push("/perfil");
    }

    setBusy(false);
  };

  return (
    <main className="authPage" id="conteudo">
      <div className="authArt">
        <MatriculouLogo />

        <div>
          <span className="eyebrow white">
            Uma experiência criada pela BIJK
          </span>

          <p className="authArtTitle">
            {register
              ? "Seu próximo capítulo começa com uma escolha."
              : "Tudo que importa para sua próxima escolha, em um só lugar."}
          </p>

          <p>
            Uma experiência mais organizada para
            descobrir, comparar e acompanhar
            oportunidades educacionais.
          </p>
        </div>

        <div className="authTrust">
          <span>Pesquisa</span>
          <span>Comparação</span>
          <span>Documentos</span>
        </div>
      </div>

      <div className="authForm">
        <Link href="/" className="back">
          ← Voltar
        </Link>

        <span className="eyebrow">
          {register
            ? "Criar conta"
            : "Entrar"}
        </span>

        <h1>
          {register
            ? "Crie seu perfil."
            : "Bem-vindo de volta."}
        </h1>

        <p>
          {register
            ? "Salve favoritas e organize seus documentos."
            : "Acesse suas favoritas e seus documentos."}
        </p>

        <form onSubmit={submit}>
          {register && (
            <label>
              Nome completo

              <input
                required
                minLength={2}
                maxLength={120}
                autoComplete="name"
                value={name}
                onChange={guard("name", setName)}
                placeholder="Como podemos te chamar?"
              />
            </label>
          )}

          <label>
            E-mail

            <input
              required
              type="email"
              maxLength={160}
              autoComplete="email"
              value={email}
              onChange={guard("email", setEmail)}
              placeholder="voce@email.com"
            />
          </label>

          <label>
            Senha

            <input
              required
              minLength={register ? 8 : 6}
              type="password"
              autoComplete={register ? "new-password" : "current-password"}
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder={register ? "Mínimo de 8 caracteres" : "Sua senha"}
            />
          </label>

          {register && (
            <>
              <label className="legalCheck">
                <input type="checkbox" required checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                <span>
                  Li e aceito os <Link href="/termos-de-uso" target="_blank">Termos de Uso</Link>, os{" "}
                  <Link href="/termos-de-servico" target="_blank">Termos de Serviço</Link> e a{" "}
                  <Link href="/privacidade" target="_blank">Política de Privacidade</Link>.
                </span>
              </label>
              <label className="legalCheck">
                <input type="checkbox" required checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} />
                <span>Tenho 18 anos ou mais, ou tenho autorização do meu responsável legal para criar esta conta.</span>
              </label>
            </>
          )}

          <button
            className="button full"
            disabled={busy || (register && (!acceptTerms || !ageConfirmed))}
            title={register && (!acceptTerms || !ageConfirmed) ? "Aceite os termos para continuar" : undefined}
          >
            {busy
              ? "Aguarde..."
              : register
              ? "Criar minha conta"
              : "Entrar na minha conta"}{" "}
            <Icon n="arrow" />
          </button>
        </form>

        <p className="switchAuth">
          {register
            ? "Já possui uma conta?"
            : "Ainda não possui conta?"}{" "}
          <Link
            href={
              register
                ? "/login"
                : "/cadastro"
            }
          >
            {register
              ? "Entrar"
              : "Criar conta grátis"}
          </Link>
        </p>
      </div>
    </main>
  );
}

function SimplePage({
  kind,
}: {
  kind: "como" | "sobre";
}) {
  if (kind === "como") {
    return (
      <main className="simplePage" id="conteudo">
        <div className="simpleHero">
          <span className="eyebrow">
            Como funciona
          </span>

          <h1>
            Uma jornada simples para uma escolha
            importante.
          </h1>

          <p>
            A plataforma foi pensada para tirar a
            bagunça da pesquisa educacional e
            transformar muitas opções em uma decisão
            mais clara.
          </p>
        </div>

        <ScrollStory variant="guide" />
      </main>
    );
  }

  return (
    <main className="simplePage aboutPage" id="conteudo">
      <div className="aboutIntro">
        <div>
          <span className="eyebrow">
            Sobre a BIJK
          </span>

          <h1>
            Tecnologia com propósito para transformar
            ideias em experiências digitais.
          </h1>

          <p>
            A <b>BIJK</b> é uma startup de
            desenvolvimento que cria soluções digitais
            com foco em tecnologia, usabilidade e
            impacto real. Nossa proposta é transformar
            problemas do dia a dia em produtos simples,
            modernos e úteis para as pessoas.
          </p>
        </div>

        <div className="aboutLogoCard">
          <img
            src="/images/bijk-logo.png"
            alt="BIJK"
            width={320}
            height={320}
          />

          <span>
            Desenvolvimento · Tecnologia · Produto
          </span>
        </div>
      </div>

      <section className="bijkStory">
        <div>
          <span className="eyebrow">
            Quem está por trás
          </span>

          <h2>Da ideia ao produto.</h2>
        </div>

        <p>
          A BIJK trabalha na interseção entre
          desenvolvimento de software e experiência do
          usuário. Criamos plataformas que organizam
          informações, conectam pessoas e facilitam
          decisões, sempre buscando uma interface bonita
          sem abrir mão de funcionalidade.
        </p>

        <p>
          A plataforma representa essa visão: uma solução
          educacional que aproxima estudantes e famílias
          de instituições, cursos e oportunidades,
          reunindo pesquisa, comparação, favoritos e
          documentos em uma experiência única.
        </p>
      </section>

      <div className="simpleGrid">
        <article>
          <b>01</b>
          <h2>Produto</h2>
          <p>
            Interfaces pensadas para serem claras,
            confortáveis e fáceis de usar.
          </p>
        </article>

        <article>
          <b>02</b>
          <h2>Tecnologia</h2>
          <p>
            Aplicações conectadas a dados e serviços
            modernos para dar vida às ideias.
          </p>
        </article>

        <article>
          <b>03</b>
          <h2>Impacto</h2>
          <p>
            Projetos que buscam resolver problemas reais
            e aproximar tecnologia das pessoas.
          </p>
        </article>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer>
      <div>
        <Link href="/" className="footerBrand"><img src="/images/matriculou-logo-white.png" alt="Matriculou" width={162} height={55} /></Link>

        <p>
          Matriculou é uma experiência educacional
          desenvolvida pela BIJK para tornar a pesquisa,
          comparação e organização de oportunidades mais
          simples.
        </p>
      </div>

      <div>
        <b>Explorar</b>

        <Link href="/instituicoes">
          Instituições
        </Link>

        <Link href="/cursos">
          Cursos
        </Link>

        <Link href="/comparar">
          Comparar
        </Link>
      </div>

      <div>
        <b>Conheça</b>

        <Link href="/como-funciona">
          Como funciona
        </Link>

        <Link href="/sobre">
          Sobre a BIJK
        </Link>

        <Link href="/cadastro">
          Criar conta
        </Link>
      </div>

      <div>
        <b>Legal</b>

        {legalLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </div>

      <div className="footerLegal">
        <span>
          © {new Date().getFullYear()} {legal.controller}
          {legal.document ? ` · ${legal.document}` : ""}. O Matriculou não realiza matrículas e não tem vínculo com as instituições listadas.
        </span>
        <button type="button" className="footerConsent" onClick={openConsentPreferences}>Preferências de cookies</button>
        {legal.email && <a href={`mailto:${legal.email}`}>{legal.email}</a>}
      </div>
    </footer>
  );
}

export default function MatriculouApp({
  view = "home",
}: {
  view?: View;
}) {
  const [institutions, setInstitutions] =
    useState<Institution[]>(isSupabaseConfigured ? [] : demoInstitutions);

  const [offers, setOffers] =
    useState<Offer[]>(isSupabaseConfigured ? [] : demoOffers);

  const [user, setUser] =
    useState<UserProfile | null>(null);

  const [liked, setLiked] =
    useState<string[]>([]);

  const [menu, setMenu] =
    useState(false);

  const [toast, setToast] =
    useState("");

  const [modal, setModal] =
    useState<Institution | null>(null);
  const [catalogStatus, setCatalogStatus] = useState<"loading" | "ready" | "error" | "demo">(isSupabaseConfigured ? "loading" : "demo");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let alive = true;

    const loadUser = async (id: string) => {
      const { data } = await supabase
        .from("usuarios")
        .select(
          "id,email,nome_completo,avatar_url"
        )
        .eq("id", id)
        .maybeSingle();

      if (!alive || !data) return;

      setUser({
        id: data.id,
        email: data.email || "",
        name:
          data.nome_completo ||
          "Usuário",
        avatar_url:
          data.avatar_url,
      });

      const { data: f, error: favoritesError } =
        await supabase
          .from("favoritos")
          .select("instituicao_id")
          .eq("user_id", id);

      if (favoritesError) {
        const missingFavorites =
          favoritesError.code === "42P01" ||
          favoritesError.message.toLowerCase().includes("favoritos");

        if (missingFavorites) {
          console.warn(
            "A tabela public.favoritos ainda não foi criada. Execute supabase/setup.sql no Supabase."
          );
          setLiked([]);
        } else {
          console.warn("Não foi possível carregar favoritos:", favoritesError.message);
          setLiked([]);
        }
      } else {
        setLiked(
          (f || []).map((x: any) => x.instituicao_id)
        );
      }
    };

    const init = async () => {
      const [is, os] =
        await Promise.all([
          supabase
            .from("instituicoes")
            .select("*")
            .order("nome"),

          supabase
            .from("ofertas")
            .select("*"),
        ]);

      if (alive) {
        setCatalogStatus(is.error || os.error ? "error" : "ready");
        setInstitutions(
          (is.data || []).map(
            (x: any) => ({
              id: x.id,
              name: x.nome,
              city: x.cidade,
              state: x.estado,
              network: x.rede,
              type:
                x.tipo ||
                "instituição",
              mec: x.nota_mec,
              price:
                x.mensalidade_media ||
                0,
              scholarships:
                x.possui_bolsas,
              image:
                x.foto_capa || null,
              imageCredit:
                x.foto_capa && x.foto_autor
                  ? { author: x.foto_autor, license: x.foto_licenca || "", source: x.foto_fonte || "" }
                  : null,
            })
          )
        );

        setOffers(
          (os.data || []).map(
            (x: any) => ({
              id: x.id,
              institution_id:
                x.instituicao_id,
              course_name:
                x.curso_nome ? canonicalCourse(x.curso_nome) : x.curso_nome,
              level: x.nivel,
              modality:
                x.modalidade,
              shift: x.turno,
              period:
                x.periodo,
            })
          )
        );
      }
    };

    init().catch(() => { if (alive) setCatalogStatus("error"); });

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data.session) {
          loadUser(
            data.session.user.id
          );
        }
      });

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        async (_, s) => {
          if (s?.user) {
            await loadUser(
              s.user.id
            );
          } else {
            setUser(null);
            setLiked([]);
          }
        }
      );

    return () => {
      alive = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // A new message restarts the timer, so it is not cut short by the previous one.
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const show = (s: string) => {
    setToast(s);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast(""),
      3000
    );
  };

  const toggleLike = async (
    id: string
  ) => {
    if (!user) {
      show(
        "Entre na sua conta para salvar favoritas."
      );

      return;
    }

    const has =
      liked.includes(id);

    if (has) {
      const { error } =
        await supabase
          .from("favoritos")
          .delete()
          .eq("user_id", user.id)
          .eq(
            "instituicao_id",
            id
          );

      if (error) {
        if (error.code === "42P01" || error.message.toLowerCase().includes("favoritos")) {
          return show("A tabela de favoritos ainda não foi criada. Execute supabase/setup.sql no Supabase e recarregue o site.");
        }
        return show(error.message);
      }

      setLiked((x) =>
        x.filter(
          (v) => v !== id
        )
      );

      show(
        "Removida das favoritas"
      );
    } else {
      const i =
        institutions.find(
          (x) => x.id === id
        );

      const { error } =
        await supabase
          .from("favoritos")
          .insert({
            user_id: user.id,
            instituicao_id: id,
            instituicao_nome:
              i?.name,
          });

      if (error) {
        if (error.code === "42P01" || error.message.toLowerCase().includes("favoritos")) {
          return show("A tabela de favoritos ainda não foi criada. Execute supabase/setup.sql no Supabase e recarregue o site.");
        }
        return show(error.message);
      }

      setLiked((x) => [
        ...x,
        id,
      ]);

      show(
        "Adicionada às favoritas"
      );
    }
  };

  const addCompare = (id: string) => {
    try {
      const cur: string[] = JSON.parse(
        sessionStorage.getItem("matriculou-compare") || "[]"
      );

      if (cur.includes(id)) {
        show("Esta instituição já está no comparador");
        return;
      }

      if (cur.length >= 4) {
        show("O comparador permite até 4 instituições");
        return;
      }

      sessionStorage.setItem(
        "matriculou-compare",
        JSON.stringify([...cur, id])
      );
      show("Instituição adicionada ao comparador");
    } catch {
      show("Não foi possível atualizar o comparador");
    }
  };

  const onDone = (
    u: UserProfile
  ) => {
    setUser(u);
    show("Acesso realizado");
  };

  const logout = async () => {
    await supabase.auth.signOut();

    setUser(null);
    setLiked([]);

    window.location.href = "/";
  };

  let content: ReactNode;

  switch (view) {
    case "home":
      content = (
        <CinematicHome
          institutions={institutions}
          loading={catalogStatus === "loading"}
          demo={catalogStatus === "demo"}
          renderInstitution={(i) => (
            <InstitutionCard
              i={i}
              liked={liked.includes(i.id)}
              onLike={() => toggleLike(i.id)}
              onCompare={() => addCompare(i.id)}
              onOpen={() => setModal(i)}
            />
          )}
        />
      );
      break;

    case "instituicoes":
      content = (
        <InstitutionsView
          institutions={institutions}
          offers={offers}
          liked={liked}
          onLike={toggleLike}
          onCompare={addCompare}
          onOpen={setModal}
          loading={catalogStatus === "loading"}
        />
      );
      break;

    case "cursos":
      content = (
        <CoursesView
          offers={offers}
          institutions={institutions}
        />
      );
      break;

    case "comparar":
      content = (
        <Compare
          institutions={institutions}
        />
      );
      break;

    case "perfil":
      content = user ? (
        <Profile
          user={user}
          onUser={setUser}
          liked={institutions.filter(
            (i) =>
              liked.includes(i.id)
          )}
          onLike={toggleLike}
          onLogout={logout}
          showToast={show}
        />
      ) : (
        <main className="accountPage accountLocked" id="conteudo">
          <span className="accountCardIcon"><Icon n="user" s={30} /></span>
          <span className="eyebrow">Meu perfil</span>
          <h1>Seu perfil aparece depois do login.</h1>
          <p>Entre para acessar favoritas, documentos e sua jornada organizada.</p>
          <div className="accountFormActions">
            <Link href="/login" className="accountButton">Entrar <Icon n="arrow" s={18} /></Link>
            <Link href="/cadastro" className="accountButton ghost">Criar conta</Link>
          </div>
        </main>
      );
      break;

    case "login":
      content = (
        <Auth
          register={false}
          onDone={onDone}
          showToast={show}
        />
      );
      break;

    case "cadastro":
      content = (
        <Auth
          register
          onDone={onDone}
          showToast={show}
        />
      );
      break;

    case "como":
      content = (
        <SimplePage kind="como" />
      );
      break;

    case "privacidade":
    case "termos-uso":
    case "termos-servico":
    case "cookies":
    case "lgpd":
      content = <LegalPage key={user?.id || "visitante"} view={view} user={user} />;
      break;

    default:
      content = (
        <SimplePage kind="sobre" />
      );
  }

  return (
    <>
      <NavBar
        user={user}
        menuOpen={menu}
        activeView={view}
        onMenu={() =>
          setMenu(true)
        }
      />

      <MobileMenu
        open={menu}
        onClose={() =>
          setMenu(false)
        }
        user={user}
      />

      {toast && (
        <Toast text={toast} />
      )}

      <div className={`pageTransition view-${view}`} key={view}>
        <div className="screenGlow screenGlowOne" />
        <div className="screenGlow screenGlowTwo" />
        {catalogStatus === "demo" && ["instituicoes", "comparar"].includes(view) && <p className="catalogNotice" role="status">Modo demonstração · instituições e valores fictícios para explorar a experiência.</p>}
        {catalogStatus === "error" && !legalViews.includes(view) && <p className="catalogNotice" role="status">Não foi possível carregar o catálogo. Tente novamente em instantes. Os cursos continuam disponíveis.</p>}
        {content}
        {!["home", "login", "cadastro", "perfil", ...legalViews].includes(view) && <NextChapter view={view}/>}
      </div>

      {!["login", "cadastro"].includes(
        view
      ) && <Footer />}


      {modal && (
        <InstitutionModal
          i={modal}
          onClose={() =>
            setModal(null)
          }
          onCompare={() =>
            addCompare(
              modal.id
             )
          }
        />
      )}
    </>
  );
}
