import { courseInfo } from './content';

export type ChatMessage = { id: string; from: 'bot' | 'user'; text: string; href?: string; linkLabel?: string };
export const welcome: ChatMessage = { id: 'welcome', from: 'bot', text: 'Oi, eu sou a Mia, seu guia no Matriculou. Um curso, uma cidade ou uma dúvida: por onde começa o seu próximo capítulo?' };
export const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function chatReply(input: string, awaitingCity = false): { message: ChatMessage; awaitingCity: boolean } {
  const q = normalize(input);
  const make = (text: string, href?: string, linkLabel?: string, city = false) => ({ message: { id: crypto.randomUUID(), from: 'bot' as const, text, href, linkLabel }, awaitingCity: city });
  if (/compar/.test(q)) return make('Escolher fica mais fácil quando você vê tudo junto. Compare até quatro instituições por localização, investimento, bolsas e avaliação. Para cursos, a comparação fica no próprio catálogo.', '/comparar', 'Montar minha comparação');
  if (/perto|proxim[oa]|bairro|cidade|localiza/.test(q) && !awaitingCity) return make('Em qual cidade você quer estudar? Digite o nome e eu abro a busca para você. Você também pode combinar cidade e estado, como “São Paulo SP”.', undefined, undefined, true);
  if (/\bpublicas?\b|gratuit|sem mensalidade/.test(q)) return make('Vamos começar pelas instituições públicas. O catálogo já vai abrir com o filtro de rede aplicado; você pode refinar por localização e modalidade.', '/instituicoes?rede=publica', 'Explorar instituições públicas');
  if (/privad|particular/.test(q)) return make('Encontre instituições privadas e compare o investimento. Você pode ajustar o valor máximo na busca.', '/instituicoes?rede=privada', 'Explorar instituições privadas');
  if (/ead|distancia|online/.test(q)) return make('Estudar de onde você estiver também é um caminho. Separei o filtro EAD para você explorar as instituições com ofertas nessa modalidade.', '/instituicoes?modalidade=ead', 'Encontrar opções EAD');
  const course = courseInfo.find(c => q.includes(normalize(c.name)));
  if (course) return make(`${course.name}: ${course.desc} A duração de referência é ${course.duration}. Você pode conhecer as disciplinas e comparar com outros cursos no catálogo. A oferta varia por instituição.`, `/cursos?q=${encodeURIComponent(course.name)}`, `Conhecer ${course.name}`);
  const area = [...new Set(courseInfo.map(c => c.area))].find(a => q.includes(normalize(a)));
  if (area) return make(`Vamos explorar ${area.toLowerCase()}? Reuni os cursos dessa área para você conhecer a formação, as disciplinas e os caminhos profissionais.`, `/cursos?area=${encodeURIComponent(area)}`, `Ver cursos de ${area}`);
  if (/bolsa|preco|mensalidade|custa|valor|barat|ate\s*r?\$?\s*\d/.test(q)) {
    const amount = q.match(/(?:ate|r\$)\s*(\d[\d.]*(?:,\d{1,2})?)/)?.[1];
    const max = amount ? Number(amount.replace(/\./g, '').replace(',', '.')) : undefined;
    return make(max !== undefined ? `Vamos buscar opções de até R$ ${max.toLocaleString('pt-BR')}/mês. O valor é uma referência: confirme as condições do curso com a instituição.` : 'O investimento muda conforme curso, campus e modalidade. No catálogo, use o valor máximo e veja a indicação de bolsas em cada instituição. Confirme as condições diretamente com ela.', max !== undefined ? `/instituicoes?max=${max}` : '/instituicoes', 'Explorar por investimento');
  }
  if (/favorit|salvar|document|perfil|conta|login/.test(q)) return make('Seu perfil reúne instituições favoritas e documentos. Entre na sua conta para guardar as opções que fazem sentido para você e retomar a pesquisa depois.', '/perfil', 'Acessar meu perfil');
  if (/curso|estudar|indecis|nao sei|comec/.test(q)) return make('Você não precisa ter todas as respostas agora. Explore os cursos por área e abra os detalhes para descobrir o que se aprende e quais caminhos cada formação oferece.', '/cursos', 'Descobrir meus caminhos');
  if (/^(oi|ola|bom dia|boa tarde|boa noite|obrigad)/.test(q)) return make('Que bom ter você por aqui. Posso ajudar a explorar cursos, filtrar instituições por cidade ou investimento e entender o comparador. O que você quer descobrir?');
  if (awaitingCity) return make(`Pronto: vamos procurar por “${input}”. Se não aparecerem resultados, tente só o nome da cidade ou use o filtro de estado.`, `/instituicoes?q=${encodeURIComponent(input)}`, `Buscar em ${input}`);
  return make('Ainda não tenho uma resposta específica para isso. Sou um guia automático do catálogo: posso ajudar com cursos, cidades, instituições públicas, EAD, mensalidades ou comparação.', '/como-funciona', 'Entender como funciona');
}
