import { normalize } from "./chat";

// Area and pictogram for any course name, including courses that only exist in the
// database. Rules are checked in order, so the specific ones come first.
const rules: [RegExp, string, string][] = [
  [/medicina veterinaria|veterinari/, "Saúde", "veterinaria"],
  [/odontolog/, "Saúde", "odontologia"],
  [/educacao fisica/, "Saúde", "esporte"],
  [/medicina|enfermagem|farmacia|biomedicina|fisioterapia|nutricao|psicologia/, "Saúde", "saude"],
  [/direito/, "Direito", "direito"],
  [/aeroespacial|aeronave|aeronautic/, "Engenharia", "aviacao"],
  [/florestal|agronomia|ambiental|agronegocio|zootecnia/, "Meio ambiente", "ambiente"],
  [/licenciatura|pedagogia/, "Educação", "educacao"],
  [/^ensino /, "Educação", "escola"],
  [/engenharia d[ae] computacao/, "Tecnologia", "tecnologia"],
  [/civil|edificacoes|arquitetura/, "Engenharia", "construcao"],
  [/automacao|mecatronica|eletronica|eletromecanica|controle/, "Engenharia", "automacao"],
  [/polimeros|quimica/, "Ciências", "ciencias"],
  [/biologic|biotecnologia/, "Ciências", "biologia"],
  [/engenharia|mecanica|producao|fabricacao/, "Engenharia", "engenharia"],
  [/sistemas|computacao|informatica|redes|software|dados|desenvolvimento/, "Tecnologia", "tecnologia"],
  [/publicidade|propaganda|jornalismo|comunicacao/, "Criatividade", "comunicacao"],
  [/design|artes|moda|audiovisual/, "Criatividade", "criatividade"],
  [/logistica/, "Negócios", "logistica"],
  [/turismo|hotelaria/, "Negócios", "turismo"],
  [/administracao|gestao|economic|contab|marketing|comercio/, "Negócios", "negocios"],
];

export function courseArea(name: string): { area: string; icon: string } {
  const key = normalize(name);
  const rule = rules.find(([pattern]) => pattern.test(key));
  const [, area, icon] = rule || [null, "Outras áreas", "educacao"];
  return { area, icon: `/images/course-icons/${icon}.svg` };
}
