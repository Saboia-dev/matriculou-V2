import type { CSSProperties } from "react";
const paths: Record<string, string> = {
  arrow: "M5 12h14m-6-6 6 6-6 6", diagonal: "M6 18 18 6M6 6h12v12", search: "m16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0", school: "m2 9 10-5 10 5-10 5-10-5m4 2v6c4 3 8 3 12 0v-6m4-2v8", pin: "M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0ZM14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0", compare: "M8 4 4 8l4 4M4 8h13M16 12l4 4-4 4M20 16H7", heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z", chat: "M4 5h16v11H10l-4 4v-4H4ZM8 10h8M8 13h5", dot: "M13.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0", check: "m5 12 4 4L19 6", book: "M12 5v16M3 3c4-1 7 0 9 2 2-2 5-3 9-2v16c-4-1-7 0-9 2-2-2-5-3-9-2Z", pause: "M8 5v14M16 5v14", play: "m8 5 10 7-10 7Z", left: "m14 5-7 7 7 7", right: "m10 5 7 7-7 7", down: "M12 4v16m-6-6 6 6 6-6", close: "m6 6 12 12M6 18 18 6", globe: "M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0ZM3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18",
  user: "M20 21a8 8 0 0 0-16 0M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  file: "M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8Zm0 0v5h5M9 13h6M9 17h6",
  upload: "M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  download: "M12 4v12m-5-5 5 5 5-5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3",
  logout: "M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 17l5-5-5-5M15 12H3",
  edit: "M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  shield: "M12 3 5 6v6c0 4.5 3 8 7 9 4-1 7-4.5 7-9V6ZM9 12l2 2 4-4",
  camera: "M4 8h3l2-3h6l2 3h3v11H4ZM15 13a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  mail: "M3 6h18v12H3zM3 7l9 7 9-7",
  plus: "M12 5v14M5 12h14",
  grid: "M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z",
  menu: "M4 7h16M4 12h16M4 17h16",
  filter: "M4 5h16l-6 8v6l-4 1v-7Z",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2",
  star: "m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9Z",
};
export function CinemaIcon({ name, size = 20, style }: { name: string; size?: number; style?: CSSProperties }) { return <svg className="cinemaIcon" style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.dot} /></svg>; }
