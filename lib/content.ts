export type Institution = { id:string; name:string; city:string; state:string; network:string; type:string; mec:number; price:number; scholarships:boolean; image:string|null; imageCredit?: { author:string; license:string; source:string } | null; };
export type Offer = {id:string; institution_id:string; course_name:string; level:string; modality:string; shift:string; period:string};
export type UserProfile = {id:string; email:string; name:string; avatar_url:string|null};
export const nav=[{href:'/instituicoes',label:'Instituições'},{href:'/cursos',label:'Cursos'},{href:'/comparar',label:'Comparar'},{href:'/como-funciona',label:'Como funciona'},{href:'/sobre',label:'Sobre'}];
export type CourseDetail = {
  name: string;
  area: string;
  duration: string;
  icon: string;
  desc: string;
  price: number;
  grade: string[];
  level: string;
  modality: string;
  shifts: string[];
  profile: string;
  skills: string[];
  careers: string[];
  internship: string;
  practicalFocus: string;
  entryPath: string;
};


export const courseInfo: CourseDetail[] = [
 {
  name:'Administração', area:'Negócios', duration:'4 anos', icon:'/images/course-icons/negocios.svg',
  desc:'Formação para gestão, estratégia, finanças, pessoas e operação de negócios.',
  price:1250, level:'Bacharelado', modality:'Presencial, EAD e híbrido',
  shifts:['Manhã','Tarde','Noite'], profile:'Indicado para quem gosta de organizar processos, analisar cenários, liderar pessoas e transformar objetivos em resultados.',
  skills:['Gestão e liderança','Finanças','Análise de dados','Marketing','Planejamento estratégico','Negociação'],
  careers:['Administrador','Analista financeiro','Analista de negócios','Gestor de pessoas','Consultor','Empreendedor'],
  internship:'Estágio recomendado a partir das etapas intermediárias, conforme a instituição.',
  practicalFocus:'Projetos de gestão, estudos de caso, planejamento e resolução de problemas empresariais.',
  entryPath:'Vestibular, ENEM e outras formas de ingresso definidas pela instituição.',
  grade:['Teoria Geral da Administração','Contabilidade','Economia','Gestão de Pessoas','Marketing','Finanças Empresariais','Planejamento Estratégico','Empreendedorismo']
 },
 {
  name:'Análise e Desenvolvimento de Sistemas', area:'Tecnologia', duration:'2 a 3 anos', icon:'/images/course-icons/tecnologia.svg',
  desc:'Curso tecnológico focado em programação, sistemas, dados, APIs e produtos digitais.',
  price:720, level:'Tecnólogo', modality:'Presencial, EAD e híbrido',
  shifts:['Manhã','Tarde','Noite'], profile:'Ideal para quem quer entrar mais rapidamente no mercado de tecnologia e construir soluções digitais.',
  skills:['Programação','Banco de dados','APIs','Desenvolvimento web','Testes','Análise de sistemas'],
  careers:['Desenvolvedor de software','Analista de sistemas','Desenvolvedor web','Analista de dados','QA','Analista de suporte'],
  internship:'Estágio comum em empresas de tecnologia e áreas de desenvolvimento.',
  practicalFocus:'Projetos integradores, desenvolvimento de aplicações, APIs e banco de dados.',
  entryPath:'Vestibular, ENEM e modalidades de ingresso oferecidas pela instituição.',
  grade:['Lógica de Programação','Banco de Dados','Desenvolvimento Web','Engenharia de Software','Estruturas de Dados','APIs e Integrações','UX e Produtos Digitais','Projeto Integrador']
 },
 {
  name:'Ciência da Computação', area:'Tecnologia', duration:'4 anos', icon:'/images/course-icons/tecnologia.svg',
  desc:'Formação ampla em algoritmos, software, dados, inteligência artificial e fundamentos da computação.',
  price:1450, level:'Bacharelado', modality:'Presencial, EAD e híbrido',
  shifts:['Manhã','Tarde','Noite'], profile:'Para quem quer uma base mais profunda em computação, raciocínio lógico e desenvolvimento de soluções complexas.',
  skills:['Algoritmos','Estruturas de dados','IA','Programação','Sistemas','Pensamento computacional'],
  careers:['Engenheiro de software','Cientista de dados','Engenheiro de dados','Especialista em IA','Desenvolvedor','Pesquisador'],
  internship:'Estágio recomendado e frequentemente integrado à experiência profissional do aluno.',
  practicalFocus:'Laboratórios, projetos de software, experimentos computacionais e iniciação científica.',
  entryPath:'Vestibular, ENEM e outras modalidades de ingresso da instituição.',
  grade:['Algoritmos','Estruturas de Dados','Sistemas Operacionais','Banco de Dados','Redes de Computadores','Inteligência Artificial','Engenharia de Software','Computação Teórica']
 },
 {
  name:'Direito', area:'Direito', duration:'5 anos', icon:'/images/course-icons/direito.svg',
  desc:'Formação jurídica em legislação, argumentação, prática profissional e organização do sistema de Justiça.',
  price:1350, level:'Bacharelado', modality:'Presencial',
  shifts:['Manhã','Tarde','Noite'], profile:'Indicado para quem se interessa por leis, argumentação, leitura, análise de situações e defesa de direitos.',
  skills:['Argumentação','Pesquisa jurídica','Interpretação de leis','Negociação','Redação jurídica','Oratória'],
  careers:['Advogado','Analista jurídico','Consultor','Carreiras públicas','Mediador','Compliance'],
  internship:'A prática jurídica e o estágio seguem as regras da instituição e do curso.',
  practicalFocus:'Núcleo de prática jurídica, estudos de casos, peças processuais e simulações.',
  entryPath:'Vestibular, ENEM e formas de ingresso disponibilizadas pela instituição.',
  grade:['Introdução ao Direito','Direito Constitucional','Direito Civil','Direito Penal','Direito do Trabalho','Processo Civil','Ética Profissional','Prática Jurídica']
 },
 {
  name:'Enfermagem', area:'Saúde', duration:'5 anos', icon:'/images/course-icons/saude.svg',
  desc:'Formação para cuidado em saúde, prevenção, assistência, gestão e atendimento em diferentes contextos.',
  price:1150, level:'Bacharelado', modality:'Presencial',
  shifts:['Manhã','Tarde','Noite'], profile:'Para quem busca uma carreira na área da saúde com contato direto com pacientes e trabalho em equipe.',
  skills:['Cuidado ao paciente','Comunicação','Procedimentos assistenciais','Gestão','Educação em saúde','Trabalho em equipe'],
  careers:['Enfermeiro','Gestor de enfermagem','Saúde coletiva','Auditoria em saúde','Educação em saúde','Pesquisa'],
  internship:'Estágios e atividades práticas fazem parte da formação conforme a matriz da instituição.',
  practicalFocus:'Laboratórios, simulações e vivências práticas em serviços de saúde.',
  entryPath:'Vestibular, ENEM e outras formas de ingresso da instituição.',
  grade:['Anatomia','Fisiologia','Saúde Coletiva','Fundamentos de Enfermagem','Farmacologia','Saúde da Criança','Saúde do Adulto','Estágio Supervisionado']
 },
 {
  name:'Engenharia Civil', area:'Engenharia', duration:'5 anos', icon:'/images/course-icons/engenharia.svg',
  desc:'Projetos, estruturas, materiais, obras, infraestrutura e planejamento técnico.',
  price:1550, level:'Bacharelado', modality:'Presencial e híbrido',
  shifts:['Manhã','Tarde','Noite'], profile:'Para quem gosta de matemática, física, projetos e da aplicação prática da engenharia na construção e infraestrutura.',
  skills:['Cálculo','Projetos','Gestão de obras','Modelagem','Análise estrutural','Planejamento'],
  careers:['Engenheiro civil','Engenheiro de obras','Projetista','Gestor de projetos','Consultor','Perito'],
  internship:'Estágio supervisionado costuma fazer parte da trajetória profissional do estudante.',
  practicalFocus:'Laboratórios, projetos estruturais, visitas técnicas e gestão de obras.',
  entryPath:'Vestibular, ENEM e modalidades de ingresso definidas pela instituição.',
  grade:['Cálculo','Física','Mecânica dos Solos','Materiais de Construção','Estruturas','Geotecnia','Saneamento','Gestão de Obras']
 },
 {
  name:'Medicina', area:'Saúde', duration:'6 anos', icon:'/images/course-icons/saude.svg',
  desc:'Formação médica com fundamentos clínicos, saúde coletiva, diagnóstico e cuidado integral.',
  price:8200, level:'Bacharelado', modality:'Presencial',
  shifts:['Manhã','Tarde','Integral'], profile:'Formação de alta carga prática e teórica para atuação médica, com contato progressivo com diferentes áreas da saúde.',
  skills:['Raciocínio clínico','Comunicação','Anamnese','Trabalho em equipe','Tomada de decisão','Ética'],
  careers:['Médico','Atenção primária','Medicina hospitalar','Pesquisa','Gestão em saúde','Especialização médica'],
  internship:'O internato integra a etapa final da graduação, conforme o projeto pedagógico.',
  practicalFocus:'Laboratórios, simulações, atividades clínicas e internato.',
  entryPath:'Processos seletivos e modalidades de ingresso definidos pela instituição.',
  grade:['Anatomia','Histologia','Fisiologia','Patologia','Farmacologia','Clínica Médica','Cirurgia','Internato']
 },
 {
  name:'Design Gráfico', area:'Criatividade', duration:'2 a 4 anos', icon:'/images/course-icons/criatividade.svg',
  desc:'Criação visual para marcas, interfaces, comunicação, produtos e experiências digitais.',
  price:980, level:'Tecnólogo ou Bacharelado', modality:'Presencial, EAD e híbrido',
  shifts:['Manhã','Tarde','Noite'], profile:'Para pessoas criativas que gostam de comunicação visual, tecnologia, composição e desenvolvimento de projetos.',
  skills:['Direção de arte','Tipografia','Identidade visual','UX/UI','Ilustração','Ferramentas digitais'],
  careers:['Designer gráfico','Diretor de arte','UI designer','Designer de marca','Ilustrador','Designer freelancer'],
  internship:'Estágio pode complementar a formação e a construção do portfólio.',
  practicalFocus:'Projetos autorais, identidade visual, interfaces e portfólio profissional.',
  entryPath:'Vestibular, ENEM e formas de ingresso da instituição.',
  grade:['Fundamentos do Design','Tipografia','Cor','Identidade Visual','Ilustração','Design Digital','UX/UI','Projeto de Portfólio']
 },
 {
  name:'Medicina Veterinária', area:'Saúde', duration:'5 anos', icon:'/images/course-icons/saude.svg',
  desc:'Formação em saúde animal, clínica, produção, prevenção e saúde pública.',
  price:1900, level:'Bacharelado', modality:'Presencial',
  shifts:['Manhã','Tarde','Integral'], profile:'Para quem se interessa por animais, saúde, ciência e atuação clínica ou produtiva.',
  skills:['Medicina animal','Diagnóstico','Cirurgia','Prevenção','Bem-estar animal','Saúde pública'],
  careers:['Médico-veterinário','Clínica veterinária','Saúde pública','Produção animal','Laboratórios','Pesquisa'],
  internship:'Atividades práticas e estágios integram a formação conforme a instituição.',
  practicalFocus:'Laboratórios, clínica, manejo, procedimentos e atividades de campo.',
  entryPath:'Vestibular, ENEM e modalidades de ingresso oferecidas pela instituição.',
  grade:['Anatomia Animal','Fisiologia Animal','Microbiologia','Patologia','Farmacologia Veterinária','Clínica Médica','Cirurgia Veterinária','Saúde Pública']
 },
 {
  name:'Ensino Fundamental', area:'Educação', duration:'9 anos', icon:'/images/course-icons/educacao.svg',
  desc:'Etapa da educação básica que desenvolve conhecimentos, competências e autonomia ao longo dos anos escolares.',
  price:850, level:'Educação Básica', modality:'Presencial, EAD e híbrido',
  shifts:['Manhã','Tarde','Integral'], profile:'Voltado ao desenvolvimento acadêmico, social e cultural de crianças e adolescentes.',
  skills:['Leitura e escrita','Raciocínio lógico','Pesquisa','Comunicação','Autonomia','Cultura digital'],
  careers:['Formação escolar básica'], 
  internship:'Não se aplica como estágio profissional do estudante.',
  practicalFocus:'Projetos interdisciplinares, atividades práticas, tecnologia e cultura digital.',
  entryPath:'Matrícula e critérios definidos pela rede ou instituição de ensino.',
  grade:['Língua Portuguesa','Matemática','Ciências','História','Geografia','Arte','Educação Física','Tecnologia e Cultura Digital']
 },
];
