// Illustrative photos for institutions without a licensed photo of their own. They show a
// generic learning space, never the institution, and are always labelled as illustrative.
export type Illustration = { src: string; alt: string; author: string; license: string; source: string };

const pexels = (file: string, alt: string, source: string): Illustration => ({ src: `/images/cinema/${file}`, alt, author: "Pexels", license: "Licença Pexels", source });
const commons = (file: string, alt: string, author: string, license: string, source: string): Illustration => ({ src: `/images/ilustrativas/${file}`, alt, author, license, source });

const sets: Record<string, Illustration[]> = {
  tecnico: [
    commons("tecnico-8.jpg", "Laboratório de eletricidade com bancadas de experimentos", "Bruno Oliveira", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Laborat%C3%B3rio_Eletricidade_FEAU.jpg"),
    commons("tecnico-11.jpg", "Laboratório de informática com fileiras de computadores", "Kiruthikapalani", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Computer_Laboratory.jpg"),
    commons("tecnico-9.jpg", "Bancada de eletrônica com osciloscópio e multímetro", "Radarvector", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Keysight_InfiniiVision_DSOX_4024A_and_digital_multimeter_and_power_supply_in_laboratory_use.jpg"),
  ],
  escola: [
    pexels("classroom.jpg", "Professor explica geometria no quadro enquanto um aluno levanta a mão", "https://www.pexels.com/photo/5212345/"),
    commons("tecnico-1.jpg", "Sala multimídia escolar com computadores e cadeiras vermelhas", "Mosborne01", "CC BY-SA 3.0", "https://commons.wikimedia.org/wiki/File:Ashs-media-suite.jpg"),
  ],
  universidade: [
    commons("universidade-0.jpg", "Prédio universitário com gramado em frente", "Universidade de Brasília", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:Pr%C3%A9dio_de_Ci%C3%AAncia_da_Computa%C3%A7%C3%A3o_e_Estat%C3%ADstica_e_Instituto_de_Ci%C3%AAncia_Pol%C3%ADtica_(29187520524).jpg"),
    commons("universidade-5.jpg", "Prédios de um campus universitário sob céu azul", "Universidade de Brasília", "CC BY 2.0", "https://commons.wikimedia.org/wiki/File:CIC_Est_-_Departamentos_de_Ci%C3%AAncia_da_Computa%C3%A7%C3%A3o_e_Estat%C3%ADstica._(29764879028).jpg"),
    pexels("students.jpg", "Três estudantes conversam sentados na escada de um campus", "https://www.pexels.com/photo/1438072/"),
    pexels("campus.jpg", "Formandos de beca jogam os capelos para o alto em uma formatura ao ar livre", "https://www.pexels.com/photo/267885/"),
    pexels("future.jpg", "Formandos de beca comemoram jogando os capelos para o alto", "https://www.pexels.com/photo/1205651/"),
  ],
  faculdade: [
    commons("faculdade-1.jpg", "Auditório de aulas com fileiras de cadeiras", "Yinan Chen", "Domínio público", "https://commons.wikimedia.org/wiki/File:Gfp-lecture-hall.jpg"),
    commons("faculdade-2.jpg", "Estantes de livros em uma biblioteca universitária", "TAGU", "CC BY-SA 4.0", "https://commons.wikimedia.org/wiki/File:Estantes_-_Biblioteca_de_Veterinarias.JPG"),
    pexels("library.jpg", "Corredor de biblioteca com estantes cheias de livros", "https://www.pexels.com/photo/256541/"),
  ],
};

/** Stable choice per institution, so the same card always shows the same picture. */
export function illustrationFor(id: string, type: string): Illustration {
  const set = sets[type] || sets.universidade;
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return set[hash % set.length];
}

export const allIllustrations = Object.values(sets).flat();
