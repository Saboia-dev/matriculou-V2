"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { CinemaIcon } from "./CinemaIcon";
import { useScrollScene } from "./useScrollScene";

const scenes = {
  institutions: { image: "library", caption: "Um lugar para pertencer.", number: "01", words: ["Explore", "Encontre", "Imagine-se"] },
  courses: { image: "classroom", caption: "Conhecimento abre caminhos.", number: "02", words: ["Descubra", "Entenda", "Vá além"] },
  compare: { image: "students", caption: "Perspectiva para decidir.", number: "03", words: ["Observe", "Compare", "Escolha"] },
};

export default function CinematicPageHero({ kind, children }: { kind: keyof typeof scenes; children: ReactNode }) {
  const scene = scenes[kind];
  const { ref } = useScrollScene<HTMLElement>((gsap, _scroll, element) => {
    gsap.fromTo(".routeCinemaCopy > *", { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .09, duration: .85, ease: "power3.out", clearProps: "transform,opacity" });
    const media = gsap.matchMedia();
    media.add("(min-width: 800px)", () => {
      gsap.fromTo(".routeCinemaPicture", { yPercent: -7, scale: 1.12, rotate: 2 }, { yPercent: 12, scale: 1, rotate: -2, ease: "none", scrollTrigger: { trigger: element, start: "top top", end: "bottom top", scrub: .7 } });
      gsap.to(".routeCinemaOrbit", { rotate: 100, y: 55, ease: "none", scrollTrigger: { trigger: element, start: "top top", end: "bottom top", scrub: 1 } });
    });
    return () => media.revert();
  });

  return <header ref={ref} className={`pageHero routeCinemaHero routeCinema-${kind}`}>
    <div className="routeCinemaOrbit" aria-hidden="true"><i /><i /></div>
    <div className="routeCinemaLayout">
      <div className="routeCinemaCopy">{children}</div>
      <div className="routeCinemaVisual" aria-hidden="true">
        <div className="routeCinemaPicture"><Image src={`/images/cinema/${scene.image}.jpg`} alt="" fill sizes="(max-width: 799px) 100vw, 38vw" priority /><span /></div>
        <span className="routeCinemaFrame">MATRICULOU / PERSPECTIVAS</span>
        <span className="routeCinemaCaption"><CinemaIcon name="spark" size={18} />{scene.caption}</span>
        <span className="routeCinemaNumber">{scene.number}</span>
      </div>
    </div>
    <div className="routeCinemaFoot"><span>O PRÓXIMO PASSO COMEÇA AQUI</span><div>{scene.words.map((word, index) => <span key={word}><small>0{index + 1}</small>{word}</span>)}</div><CinemaIcon name="down" size={17} /></div>
  </header>;
}
