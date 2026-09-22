"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type CinemaSettings = { enabled: boolean; paused: boolean; reduced: boolean; lite: boolean; toggle: () => void };
const CinemaContext = createContext<CinemaSettings>({ enabled: false, paused: false, reduced: false, lite: false, toggle: () => {} });
export const useCinema = () => useContext(CinemaContext);

export default function CinemaProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false), [reduced, setReduced] = useState(true), [lite, setLite] = useState(false);
  const pathname = usePathname();
  const progress = useRef<HTMLDivElement>(null);
  const enabled = !paused && !reduced;

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    const navigatorInfo = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    setLite((navigatorInfo.deviceMemory || 8) < 4 || (navigatorInfo.hardwareConcurrency || 4) < 4 || !!navigatorInfo.connection?.saveData);
    try { setPaused(sessionStorage.getItem("matriculou-cinema-paused") === "true"); } catch {}
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.cinema = enabled ? "on" : "off";
    document.documentElement.dataset.cinemaQuality = lite ? "lite" : "full";
    return () => { delete document.documentElement.dataset.cinema; delete document.documentElement.dataset.cinemaQuality; };
  }, [enabled, lite]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${distance > 0 ? Math.min(1, scrollY / distance) : 0})`;
      document.querySelector(".nav")?.classList.toggle("cinemaNavScrolled", scrollY > 36);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule); resize.observe(document.body);
    addEventListener("scroll", schedule, { passive: true }); addEventListener("resize", schedule); update();
    return () => { cancelAnimationFrame(frame); resize.disconnect(); removeEventListener("scroll", schedule); removeEventListener("resize", schedule); };
  }, [pathname]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false, teardown = () => {};
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const disposers: (() => void)[] = [];
      const seen = new WeakSet<Element>();
      const context = gsap.context(() => {});
      const discover = () => {
        const nodes = document.querySelectorAll<HTMLElement>("[data-cinema-reveal], .pageTransition .sectionHead, .pageTransition .courseLarge, .pageTransition .cards3>.instCard, .pageTransition .profileCard, .pageTransition .stepsGrid>article, .pageTransition .simpleGrid>article, .pageTransition .bijkStory, .pageTransition .compareSlot, .pageTransition .compareHint, .pageTransition .resultBar, footer>div");
        nodes.forEach((element, index) => {
          if (seen.has(element) || element.closest(".filmJourney") || element.getBoundingClientRect().height === 0) return;
          seen.add(element);
          // Never hide elements that are already visible or focused.
          if (element.getBoundingClientRect().top < innerHeight * .9 || element.contains(document.activeElement)) return;
          context.add(() => {
            gsap.fromTo(element, { opacity: .16, y: lite ? 18 : 45 }, {
              opacity: 1, y: 0, duration: .95, delay: Math.min(index % 3 * .065, .13), ease: "power3.out", clearProps: "transform,opacity",
              scrollTrigger: { trigger: element, start: "top 94%", once: true },
            });
          });
        });
      };
      context.add(() => {
        const intro = document.querySelectorAll<HTMLElement>(".pageTransition .simpleHero>*,.pageTransition .aboutIntro>div:first-child>*,.pageTransition .authArt h1,.pageTransition .authArt p");
        if (intro.length) gsap.fromTo(intro, { opacity: 0, y: lite ? 10 : 25 }, { opacity: 1, y: 0, duration: .9, stagger: .09, ease: "power3.out", clearProps: "transform,opacity" });
        const logo = document.querySelector<HTMLElement>(".aboutLogoCard");
        if (logo && !lite) gsap.fromTo(logo, { rotate: -3, y: 10 }, { rotate: 3, y: -25, ease: "none", scrollTrigger: { trigger: logo.parentElement, start: "top 15%", end: "bottom top", scrub: .8 } });
        const finalOrbit = document.querySelector<HTMLElement>(".filmFinaleOrbit");
        if (finalOrbit && !lite) gsap.to(finalOrbit, { rotation: 40, scale: 1.13, ease: "none", scrollTrigger: { trigger: finalOrbit.parentElement, start: "top bottom", end: "bottom top", scrub: .8 } });
      });
      discover();
      let mutationFrame = 0;
      const observer = new MutationObserver(records => {
        if (!records.some(r => r.addedNodes.length)) return;
        cancelAnimationFrame(mutationFrame);
        mutationFrame = requestAnimationFrame(() => { discover(); ScrollTrigger.refresh(); });
      });
      observer.observe(document.querySelector(".pageTransition") || document.body, { childList: true, subtree: true });
      if (!lite && matchMedia("(hover: hover) and (pointer: fine)").matches) {
        let active: HTMLElement | null = null, targetX = 0, targetY = 0, pointerFrame = 0;
        const reset = () => { if (active) { active.style.setProperty("--tilt-x", "0deg"); active.style.setProperty("--tilt-y", "0deg"); active.style.setProperty("--magnet-x", "0px"); active.style.setProperty("--magnet-y", "0px"); active.removeAttribute("data-pointer-active"); } active = null; };
        const renderPointer = () => {
          pointerFrame = 0; if (!active) return;
          const rect = active.getBoundingClientRect();
          const x = (targetX - rect.left) / rect.width - .5, y = (targetY - rect.top) / rect.height - .5;
          active.style.setProperty("--light-x", `${targetX - rect.left}px`); active.style.setProperty("--light-y", `${targetY - rect.top}px`);
          if (active.matches("[data-cinema-tilt]")) { active.style.setProperty("--tilt-x", `${-y * 5}deg`); active.style.setProperty("--tilt-y", `${x * 5}deg`); }
          else { active.style.setProperty("--magnet-x", `${x * 7}px`); active.style.setProperty("--magnet-y", `${y * 7}px`); }
        };
        const move = (e: PointerEvent) => {
          const element = (e.target as Element).closest<HTMLElement>("[data-magnetic], [data-cinema-tilt]");
          if (element !== active) { reset(); active = element; active?.setAttribute("data-pointer-active", "true"); }
          targetX = e.clientX; targetY = e.clientY;
          if (active && !pointerFrame) pointerFrame = requestAnimationFrame(renderPointer);
        };
        document.addEventListener("pointermove", move, { passive: true }); document.addEventListener("pointerleave", reset); window.addEventListener("blur", reset);
        disposers.push(() => { cancelAnimationFrame(pointerFrame); reset(); document.removeEventListener("pointermove", move); document.removeEventListener("pointerleave", reset); window.removeEventListener("blur", reset); });
      }
      const refresh = () => ScrollTrigger.refresh();
      document.fonts.ready.then(() => { if (!cancelled) refresh(); });
      window.addEventListener("load", refresh);
      teardown = () => { observer.disconnect(); cancelAnimationFrame(mutationFrame); disposers.forEach(fn => fn()); context.revert(); window.removeEventListener("load", refresh); };
    }).catch(() => { /* The static experience remains fully usable. */ });
    return () => { cancelled = true; teardown(); };
  }, [enabled, lite, pathname]);

  const toggle = () => setPaused(current => { const next = !current; try { sessionStorage.setItem("matriculou-cinema-paused", String(next)); } catch {} return next; });
  return <CinemaContext.Provider value={{ enabled, paused, reduced, lite, toggle }}>
    <div className="cinemaReadingTrack" aria-hidden="true"><div ref={progress} /></div>
    {children}
    {!reduced && <button className="cinemaMotionControl" onClick={toggle} aria-pressed={paused} aria-label={paused ? "Ativar efeitos visuais" : "Pausar efeitos visuais"} title={paused ? "Ativar efeitos visuais" : "Pausar efeitos visuais"}><svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">{paused ? <path d="M5 3 12 8 5 13Z" fill="currentColor" /> : <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" />}</svg><span>{paused ? "Efeitos pausados" : "Efeitos ativos"}</span></button>}
  </CinemaContext.Provider>;
}
