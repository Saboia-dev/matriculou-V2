"use client";

import Link from "next/link";
import CatalogQuery from "./CatalogQuery";
import CinematicHome from "./cinema/CinematicHome";
import CinematicPageHero from "./cinema/CinematicPageHero";
import ScrollStory from "./cinema/ScrollStory";
import NextChapter from "./cinema/NextChapter";
import { demoInstitutions, demoOffers } from "../lib/demo-content";
import { normalize } from "../lib/chat";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import type { Institution, Offer, UserProfile, CourseDetail } from "../lib/content";
import { courseInfo, nav } from "../lib/content";

type View =
  | "home"
  | "instituicoes"
  | "cursos"
  | "comparar"
  | "como"
  | "sobre"
  | "perfil"
  | "login"
  | "cadastro";


const Icon = ({ n, s = 20 }: { n: string; s?: number }) => (
  <span className="ico" style={{ fontSize: s }}>
    {(
      {
        heart: "♡",
        search: "⌕",
        arrow: "→",
        user: "◉",
        menu: "☰",
        close: "×",
        pin: "⌖",
        grid: "▦",
        check: "✓",
        logout: "↪",
        upload: "↑",
        edit: "✎",
        star: "★",
        book: "▤",
        filter: "☷",
        plus: "+",
        clock: "◷",
        file: "□",
        school: "⌂",
      } as Record<string, string>
    )[n] || "✦"}
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
      <img src="/images/matriculou-logo-white.png" alt="Matriculou" />
    </Link>
  );
}

function BIJKLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`bijkLogo ${className}`}>
      <img src="/images/bijk-logo.png" alt="BIJK" />
    </div>
  );
}

function NavBar({
  user,
  onMenu,
  activeView,
}: {
  user: UserProfile | null;
  onMenu: () => void;
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
                <img src={user.avatar_url} alt="Foto de perfil" />
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

      <aside className="mobileMenu" ref={panel} role="dialog" aria-modal="true" aria-label="Menu de navegação">
        <button className="closeBtn" onClick={onClose} aria-label="Fechar menu">
          ×
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
        <img
          src={i.image || "/images/course-icons/educacao.svg"}
          alt=""
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.src = "/images/course-icons/educacao.svg";
          }}
        />

        <span className="badge">
          {i.network === "publica" ? "Pública" : "Privada"} · {i.type}
        </span>

        <button
          aria-label="Favoritar"
          className={liked ? "heart liked" : "heart"}
          onClick={onLike}
        >
          <Icon n="heart" s={25} />
        </button>
      </div>

      <div className="instBody">
        <div className="rating">
          <span>★ {Number(i.rating || 0).toFixed(1)}</span>
          <span>• MEC {i.mec || "-"}</span>
        </div>

        <h3>{i.name}</h3>

        <p className="place">
          <Icon n="pin" s={17} /> {i.city}, {i.state}
        </p>

        <div className="chips">
          <span>{i.scholarships ? "Bolsas" : "Sem bolsa"}</span>

          <span>
            {i.price > 0
              ? `R$ ${i.price.toLocaleString("pt-BR")}/mês`
              : "Gratuita"}
          </span>
        </div>

        <div className="cardActions">
          <button className="outline" onClick={onCompare}>
            <Icon n="grid" s={17} /> Comparar
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
  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={onClose}>
          ×
        </button>

        <img className="modalImage" src={i.image} alt="" />

        <div className="modalBody">
          <span className="eyebrow">
            {i.network === "publica" ? "Pública" : "Privada"} · {i.type}
          </span>

          <h2>{i.name}</h2>

          <p>
            Tenha uma visão rápida da instituição antes de decidir. Consulte
            localização, avaliação, investimento, bolsas e situação de vagas.
          </p>

          <div className="detailGrid">
            <div>
              <small>Localização</small>
              <b>
                {i.city}, {i.state}
              </b>
            </div>

            <div>
              <small>Avaliação</small>
              <b>★ {Number(i.rating || 0).toFixed(1)}</b>
            </div>

            <div>
              <small>Nota MEC</small>
              <b>{i.mec || "-"}</b>
            </div>

            <div>
              <small>Mensalidade média</small>
              <b>
                {i.price > 0
                  ? `R$ ${i.price.toLocaleString("pt-BR")}`
                  : "Gratuita"}
              </b>
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
              <small>Vagas</small>
              <b>{i.vacancy || "Consulte"}</b>
            </div>

            <div>
              <small>Avaliações</small>
              <b>{i.reviews || 0}</b>
            </div>
          </div>

          <button
            className="button"
            onClick={() => {
              onCompare();
              onClose();
            }}
          >
            Adicionar à comparação <Icon n="grid" s={18} />
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
}: {
  institutions: Institution[];
  offers: Offer[];
  liked: string[];
  onLike: (id: string) => void;
  onCompare: (id: string) => void;
  onOpen: (i: Institution) => void;
}) {
  const [q, setQ] = useState("");

  const [network, setNetwork] = useState("todas");
  const [type, setType] = useState("todos");
  const [state, setState] = useState("todos");
  const [mode, setMode] = useState("todos");
  const [max, setMax] = useState("");

  const types = [
    ...new Set(institutions.map((i) => i.type).filter(Boolean)),
  ].sort();

  const states = [
    ...new Set(institutions.map((i) => i.state).filter(Boolean)),
  ].sort();

  const filtered = institutions
    .filter((i) =>
      normalize(`${i.name} ${i.city} ${i.state}`).includes(normalize(q))
    )
    .filter(
      (i) => network === "todas" || i.network === network
    )
    .filter((i) => type === "todos" || i.type === type)
    .filter((i) => state === "todos" || i.state === state)
    .filter((i) => !max || i.price <= Number(max))
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

  return (
    <main className="page">
      <CatalogQuery onChange={params => {
    setQ(params.get("q") || "");
    setNetwork(["publica", "privada"].includes(params.get("rede") || "") ? params.get("rede")! : "todas");
    setMode(["ead", "presencial", "hibrido"].includes(params.get("modalidade") || "") ? params.get("modalidade")! : "todos");
    const price = params.get("max");
    setMax(price && Number.isFinite(Number(price)) && Number(price) >= 0 ? price : "");
        }}/><CinematicPageHero kind="institutions">
        <span className="eyebrow white">
          Instituições atualizadas
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
                onChange={(e) => setQ(e.target.value)}
                placeholder="Instituição, cidade ou estado"
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
                {types.map((x) => <option key={x} value={x}>{x}</option>)}
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
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  placeholder="Sem limite"
                />
              </div>
            </label>
          </div>

          <div className="activeFilters">
            {q && <span>Busca: {q}</span>}
            {network !== "todas" && <span>{network === "publica" ? "Pública" : "Privada"}</span>}
            {type !== "todos" && <span>{type}</span>}
            {state !== "todos" && <span>{state}</span>}
            {mode !== "todos" && <span>{mode === "ead" ? "EAD" : mode === "hibrido" ? "Híbrido" : "Presencial"}</span>}
            {max && <span>Até R$ {Number(max).toLocaleString("pt-BR")}</span>}
            {!q && network === "todas" && type === "todos" && state === "todos" && mode === "todos" && !max && <span className="mutedFilter">Todos os resultados</span>}
          </div>
        </div>

        <div className="resultBar">
          <div><b>{filtered.length} instituições</b><span>Resultados encontrados</span></div>
          <span>Favoritos ficam salvos no seu perfil.</span>
        </div>

        <div className="cards3">
          {filtered.map((i) => (
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

        {!filtered.length && (
          <div className="emptySmall">
            Nenhuma instituição encontrada com esses filtros.
          </div>
        )}
      </section>
    </main>
  );
}

const getCourseDetail = (name: string): CourseDetail => {
  const info = courseInfo.find((c) => c.name.toLowerCase() === name.toLowerCase());
  if (info) return info;

  return {
    name,
    area: "Outras áreas",
    duration: "Consulte",
    icon: "/images/course-icons/educacao.svg",
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

  return (
    <div className="modalBackdrop" onClick={onClose}>
      <div
        className="modal courseModal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="closeBtn" onClick={onClose}>
          ×
        </button>

        <div className="courseModalHead">
          <img src={course.icon} alt="" />

          <div>
            <span className="eyebrow">{course.area}</span>
            <h2>{course.name}</h2>
            <p>{course.desc}</p>
          </div>
        </div>

        <div className="detailGrid courseDetailGrid">
          <div><small>Formação</small><b>{course.level}</b></div>
          <div><small>Duração</small><b>{course.duration}</b></div>
          <div><small>Preço médio</small><b>{course.price ? `R$ ${course.price.toLocaleString("pt-BR")}/mês` : "Varia por instituição"}</b></div>
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
    ["Preço médio", (c: CourseDetail) => values(c).price],
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
                      <img src={c.icon} alt="" />
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
                        label === "Preço médio"
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
    ...new Set(courseInfo.map((c) => c.area)),
  ];

  const data = names.length
    ? [
        ...new Set([
          ...courseInfo.map((c) => c.name),
          ...names,
        ]),
      ]
    : courseInfo.map((c) => c.name);

  const filtered = data
    .filter((n) =>
      normalize(n).includes(normalize(q))
    )
    .filter(
      (n) =>
        area === "Todas" ||
        courseInfo.find((c) => c.name === n)?.area ===
          area
    );

  const detail = (name: string): CourseDetail => getCourseDetail(name);

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
    <main className="page">
      <CatalogQuery onChange={params => {
    setQ(params.get("q") || "");
    const requestedArea = params.get("area");
    setArea(courseInfo.some(c => c.area === requestedArea) ? requestedArea! : "Todas");
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
                onChange={(e) => setQ(e.target.value)}
                placeholder="Pesquisar curso..."
              />
            </div>

            {["Todas", ...areas].map((a) => (
              <button
                className={
                  area === a
                    ? "filterPill active"
                    : "filterPill"
                }
                key={a}
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

              const rel = institutions.filter((i) =>
                offers.some(
                  (o) =>
                    o.course_name?.toLowerCase() ===
                      name.toLowerCase() &&
                    o.institution_id === i.id
                )
              );

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
                    <img src={info.icon} alt="" />
                  </div>

                  <span>{info.area}</span>

                  <h2>{name}</h2>

                  <p>{info.desc}</p>

                  <div className="courseMeta">
                    <b>{info.duration}</b>

                    <span>
                      {rel.length
                        ? `${rel.length} instituições`
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
                      onClick={() =>
                        toggleCompare(name)
                      }
                    >
                      <span>
                        {isSelected ? "✓" : "□"}
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
    ["Tipo", (i: Institution) => i.type || "Não informado"],
    ["Localização", (i: Institution) => `${i.city}, ${i.state}`],
    ["Avaliação", (i: Institution) => `★ ${Number(i.rating || 0).toFixed(1)} (${i.reviews || 0} avaliações)`],
    ["Nota MEC", (i: Institution) => i.mec || "Não informada"],
    ["Mensalidade média", (i: Institution) => i.price ? `R$ ${i.price.toLocaleString("pt-BR")}/mês` : "Gratuita"],
    ["Bolsas", (i: Institution) => i.scholarships ? "Disponíveis" : "Não informadas"],
    ["Situação de vagas", (i: Institution) => i.vacancy || "Consulte"],
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
                      <img src={i.image || "/images/course-icons/educacao.svg"} alt="" />
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
                      ×
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
                    <span className={label === "Avaliação" || label === "Mensalidade média" ? "compareValue strong" : "compareValue"}>
                      {get(i)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("matriculou-compare");
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: string[]) => {
    setIds(next);
    try { sessionStorage.setItem("matriculou-compare", JSON.stringify(next)); } catch {}
  };

  const remove = (id: string) => persist(ids.filter((x) => x !== id));

  const add = (id: string) => {
    if (ids.includes(id)) return;
    if (ids.length >= 4) return;
    persist([...ids, id]);
    setModal(false);
  };

  const selected = ids.map((id) => institutions.find((i) => i.id === id)).filter(Boolean) as Institution[];
  const types = [...new Set(institutions.map((i) => i.type).filter(Boolean))].sort();
  const options = institutions.filter((i) => (type === "todos" || i.type === type) && !ids.includes(i.id));

  return (
    <main className="page">
      <CinematicPageHero kind="compare">
        <span className="eyebrow white">Comparador</span>
        <h1>Compare com calma.</h1>
        <p>Escolha até quatro instituições e veja localização, avaliação, investimento, bolsas e vagas em uma única visão.</p>
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
                        <img src={i.image || "/images/course-icons/educacao.svg"} alt="" />
                        <div><b>{i.name}</b><span>{i.city}, {i.state}</span></div>
                        <button onClick={() => remove(i.id)} aria-label={`Remover ${i.name}`}>×</button>
                      </>
                    ) : (
                      <><span className="compareSlotPlus">+</span><span>Adicionar instituição</span></>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="compareHint">
              <div className="emptyIcon">▦</div>
              <div><b>Monte sua comparação</b><span>Escolha instituições e veja diferenças de preço, avaliação, bolsas e vagas em uma única visão.</span></div>
            </div>
          </div>
        ) : (
          <InstitutionCompareTable institutions={selected} onEdit={() => setModal(true)} onRemove={remove} />
        )}
      </section>

      {modal && (
        <div className="modalBackdrop" onClick={() => setModal(false)}>
          <div className="picker comparePicker" onClick={(e) => e.stopPropagation()}>
            <button className="closeBtn" onClick={() => setModal(false)}>×</button>
            <span className="eyebrow">Adicionar ao comparador</span>
            <h2>Escolha suas instituições.</h2>
            <p>Filtre por tipo e selecione até quatro opções para comparar.</p>
            <div className="pickerTypes">
              <button className={type === "todos" ? "active" : ""} onClick={() => setType("todos")}>Todas</button>
              {types.map((t) => <button className={type === t ? "active" : ""} key={t} onClick={() => setType(t)}>{t}</button>)}
            </div>
            <div className="pickerList">
              {options.map((i) => (
                <button key={i.id} onClick={() => add(i.id)}>
                  <img src={i.image || "/images/course-icons/educacao.svg"} alt="" />
                  <span><b>{i.name}</b><small>{i.city}, {i.state} · {i.network === "publica" ? "Pública" : "Privada"}</small></span>
                  <strong>Adicionar</strong>
                </button>
              ))}
              {!options.length && <div className="emptySmall">Não há outras instituições disponíveis com este filtro.</div>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Profile({
  user,
  onUser,
  liked,
  onLike,
  showToast,
}: {
  user: UserProfile;
  onUser: (u: UserProfile) => void;
  liked: Institution[];
  onLike: (id: string) => void;
  showToast: (s: string) => void;
}) {
  const [section, setSection] = useState<
    "dados" | "documentos" | "favoritos"
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

  useEffect(() => {
    const loadDocs = async () => {
      const { data } = await supabase
      .from("documentos_usuario")
      .select("id,nome,path,created_at")
      .order("created_at", {
        ascending: false,
      });

      setDocs(
        (data || []).map((doc) => ({
          ...doc,
          url: doc.path
            ? supabase.storage
                .from("pre-matriculas")
                .getPublicUrl(doc.path).data.publicUrl
            : "",
        }))
      );
    };

    loadDocs();
  }, []);

  const avatar = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      return showToast(
        "Escolha uma imagem válida."
      );
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

    setDocFile(file);
  };

  const resetDocForm = () => {
    setDocName("");
    setDocFile(null);
    setEditingDoc(null);
  };

  const saveDoc = async () => {
    const name = docName.trim();
    if (!name) {
      showToast("Informe o nome do documento.");
      return;
    }

    const currentDoc = docs.find((doc) => doc.id === editingDoc);
    if (!editingDoc && !docFile) {
      showToast("Envie uma foto do documento.");
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

      url = `${supabase.storage
        .from("pre-matriculas")
        .getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;
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

  return (
    <main className="profilePage">
      <div className="profileShell">
        <aside className="profileSidebar">
          <div className="sideIdentity">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Foto de perfil"
              />
            ) : (
              <span>
                {initials(user.name)}
              </span>
            )}

            <div>
              <b>{user.name}</b>
              <small>{user.email}</small>
            </div>
          </div>

          <div className="sideNav">
            <button
              className={
                section === "dados"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSection("dados")
              }
            >
              <Icon n="user" /> Dados da conta
            </button>

            <button
              className={
                section === "favoritos"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSection("favoritos")
              }
            >
              <Icon n="heart" /> Favoritos{" "}
              <span>{liked.length}</span>
            </button>

            <button
              className={
                section === "documentos"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSection("documentos")
              }
            >
              <Icon n="file" /> Documentos{" "}
              <span>{docs.length}</span>
            </button>
          </div>

          <Link
            href="/instituicoes"
            className="sideCta"
          >
            Encontrar instituições{" "}
            <Icon n="arrow" />
          </Link>
        </aside>

        <section className="profileMain">
          <div className="profileTitle">
            <div>
              <span className="eyebrow">
                Meu perfil
              </span>

              <h1>
                Olá,{" "}
                {user.name.split(" ")[0]}.
              </h1>

              <p>
                Seu espaço para organizar escolhas,
                favoritas e documentos.
              </p>
            </div>

            <label className="button gold uploadAvatar">
              <Icon n="upload" /> Mudar imagem

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) =>
                  e.target.files?.[0] &&
                  avatar(
                    e.target.files[0]
                  )
                }
              />
            </label>
          </div>

          {section === "dados" && (
            <div className="profileGrid">
              <div className="profileCard">
                <span className="eyebrow">
                  Conta
                </span>

                <h2>Seus dados</h2>

                <label>
                  Nome completo

                  <input
                    value={user.name}
                    readOnly
                  />
                </label>

                <label>
                  E-mail

                  <input
                    value={user.email}
                    disabled
                  />
                </label>

              </div>

              <div className="profileCard profileHighlight">
                <span className="eyebrow">
                  Sua jornada
                </span>

                <h2>
                  Tudo organizado em um só lugar.
                </h2>

                <p>
                  Favorite instituições na página de
                  busca, compare suas opções e mantenha
                  seus documentos organizados.
                </p>

                <div className="miniStats">
                  <div>
                    <b>{liked.length}</b>
                    <span>favoritas</span>
                  </div>

                  <div>
                    <b>{docs.length}</b>
                    <span>documentos</span>
                  </div>

                  <div>
                    <b>4</b>
                    <span>máx. no comparador</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === "favoritos" && (
            <div className="profileCard fullCard">
              <div className="sectionHead">
                <div>
                  <span className="eyebrow">
                    Sua coleção
                  </span>

                  <h2>
                    Instituições favoritas
                  </h2>

                  <p>
                    As instituições que você favoritou
                    na página Instituições aparecem
                    automaticamente aqui.
                  </p>
                </div>

                <Link
                  href="/instituicoes"
                  className="outline"
                >
                  Adicionar mais
                </Link>
              </div>

              {liked.length ? (
                <div className="favoriteGrid">
                  {liked.map((i) => (
                    <article key={i.id}>
                      <img
                        src={i.image}
                        alt=""
                      />

                      <div>
                        <b>{i.name}</b>

                        <span>
                          {i.city}, {i.state}
                        </span>

                        <button
                          onClick={() =>
                            onLike(i.id)
                          }
                        >
                          Remover favorito
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="emptySmall">
                  Você ainda não favoritou nenhuma
                  instituição. Vá até{" "}
                  <Link href="/instituicoes">
                    Instituições
                  </Link>{" "}
                  e toque no coração.
                </div>
              )}
            </div>
          )}

          {section === "documentos" && (
            <div className="profileGrid">
              <div className="profileCard">
                <span className="eyebrow">
                  Organização
                </span>

                <h2>
                  {editingDoc ? "Editar documento" : "Adicionar documento"}
                </h2>

                <p>
                  Informe o nome e envie uma foto para manter seus documentos
                  sempre à mão.
                </p>

                <label className="documentNameField">
                  Nome do documento

                  <input
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    placeholder="Ex.: Documento de identidade"
                  />
                </label>

                <label className="dropzone">
                  <Icon n="upload" s={32} />

                  <b>
                    {docFile
                      ? docFile.name
                      : editingDoc
                      ? "Trocar foto do documento"
                      : "Selecionar foto"}
                  </b>

                  <span>
                    JPG, JPEG, PNG ou WEBP
                  </span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      chooseDocFile(
                        e.target.files[0]
                      )
                    }
                  />
                </label>

                <div className="documentFormActions">
                  <button
                    className="button"
                    type="button"
                    onClick={saveDoc}
                    disabled={docBusy}
                  >
                    {docBusy
                      ? "Salvando..."
                      : editingDoc
                      ? "Salvar edição"
                      : "Adicionar documento"}
                    <Icon n="check" />
                  </button>

                  {editingDoc && (
                    <button
                      className="outline"
                      type="button"
                      onClick={resetDocForm}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>

              <div className="profileCard">
                <span className="eyebrow">
                  Documentos enviados
                </span>

                <h2>Seus documentos</h2>

                <div className="docList">
                  {docs.length ? (
                    docs.map((d) => (
                      <div key={d.id}>
                        <Icon n="file" />

                        {d.url ? (
                          <a
                            className="docName"
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {d.nome}
                          </a>
                        ) : (
                          <span className="docName">{d.nome}</span>
                        )}

                        <div className="docActions">
                          <button
                            type="button"
                            onClick={() => editDoc(d)}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteDoc(d)}
                          >
                            Apagar
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="emptySmall">
                      Nenhum documento enviado ainda.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
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
  const [busy, setBusy] = useState(false);

  const submit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    if (!isSupabaseConfigured) { showToast("Login indisponível nesta demonstração. Explore os cursos e o comparador livremente."); return; }
    setBusy(true);

    if (register) {
      const { data, error } =
        await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nome_completo: name,
            },
          },
        });

      if (error) {
        showToast(error.message);
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
        name: name || "Usuário",
        avatar_url: null,
      };

      await supabase
        .from("usuarios")
        .upsert({
          id: u.id,
          email: u.email,
          nome_completo: u.name,
        });

      onDone(u);

      router.push("/perfil");
    } else {
      const { data, error } =
        await supabase.auth.signInWithPassword(
          {
            email,
            password,
          }
        );

      if (error) {
        showToast(
          "E-mail ou senha inválidos."
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
    <main className="authPage">
      <div className="authArt">
        <MatriculouLogo />

        <div>
          <span className="eyebrow white">
            Uma experiência criada pela BIJK
          </span>

          <h1>
            {register
              ? "Seu próximo capítulo começa com uma escolha."
              : "Tudo que importa para sua próxima escolha, em um só lugar."}
          </h1>

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
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                placeholder="Como podemos te chamar?"
              />
            </label>
          )}

          <label>
            E-mail

            <input
              required
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="voce@email.com"
            />
          </label>

          <label>
            Senha

            <input
              required
              minLength={6}
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Mínimo de 6 caracteres"
            />
          </label>

          <button
            className="button full"
            disabled={busy}
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
      <main className="simplePage">
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
    <main className="simplePage aboutPage">
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
        <Link href="/" className="footerBrand"><img src="/images/matriculou-logo-white.png" alt="Matriculou" /></Link>

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
              rating:
                x.avaliacao_media,
              reviews:
                x.total_avaliacoes,
              image:
                x.foto_capa,
              vacancy:
                x.status_vaga,
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
                x.curso_nome,
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

  const show = (s: string) => {
    setToast(s);

    setTimeout(
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
          showToast={show}
        />
      ) : (
        <main className="lockedPage">
          <h1>
            Seu perfil aparece depois do login.
          </h1>

          <p>
            Entre para acessar favoritas,
            documentos e sua jornada organizada.
          </p>

          <Link
            href="/login"
            className="button"
          >
            Entrar
          </Link>
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

    default:
      content = (
        <SimplePage kind="sobre" />
      );
  }

  return (
    <>
      <NavBar
        user={user}
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
        {catalogStatus === "demo" && ["instituicoes", "comparar"].includes(view) && <p className="catalogNotice" role="status">Modo demonstração · instituições, avaliações e valores fictícios para explorar a experiência.</p>}
        {catalogStatus === "error" && <p className="catalogNotice" role="status">Não foi possível carregar o catálogo. Tente novamente em instantes. Os cursos continuam disponíveis.</p>}
        {content}
        {!["home", "login", "cadastro"].includes(view) && <NextChapter view={view}/>}
      </div>

      {view === "perfil" &&
        user && (
          <div className="logoutFloat">
            <button
              className="outline"
              onClick={logout}
            >
              <Icon n="logout" /> Sair da conta
            </button>
          </div>
        )}

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
