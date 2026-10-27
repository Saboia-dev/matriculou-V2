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
  price:850, level:'Educação Básica', modality:'Presencial',
  shifts:['Manhã','Tarde','Integral'], profile:'Voltado ao desenvolvimento acadêmico, social e cultural de crianças e adolescentes.',
  skills:['Leitura e escrita','Raciocínio lógico','Pesquisa','Comunicação','Autonomia','Cultura digital'],
  careers:['Formação escolar básica'], 
  internship:'Não se aplica como estágio profissional do estudante.',
  practicalFocus:'Projetos interdisciplinares, atividades práticas, tecnologia e cultura digital.',
  entryPath:'Matrícula e critérios definidos pela rede ou instituição de ensino.',
  grade:['Língua Portuguesa','Matemática','Ciências','História','Geografia','Arte','Educação Física','Tecnologia e Cultura Digital']
 },
 {
  name:'Ensino Médio', area:'Educação', duration:'3 anos', icon:'/images/course-icons/escola.svg',
  desc:'Etapa final da educação básica, com formação geral e itinerários formativos que preparam para o ensino superior e o trabalho.',
  price:0, level:'Educação Básica', modality:'Presencial',
  shifts:['Manhã','Tarde','Integral'], profile:'Para adolescentes que concluíram o ensino fundamental e vão aprofundar conhecimentos e escolher caminhos.',
  skills:['Leitura e argumentação','Raciocínio matemático','Investigação científica','Pensamento crítico','Projeto de vida','Cultura digital'],
  careers:['Ensino superior','Educação profissional e técnica','ENEM e vestibulares'],
  internship:'Não obrigatório; algumas escolas oferecem itinerário técnico com estágio.',
  practicalFocus:'Projetos, laboratórios, itinerários formativos e preparação para o ENEM.',
  entryPath:'Matrícula ou processo seletivo definido pela rede ou instituição de ensino.',
  grade:['Linguagens e suas Tecnologias','Matemática e suas Tecnologias','Ciências da Natureza','Ciências Humanas e Sociais','Língua Inglesa','Educação Física','Projeto de Vida','Itinerários Formativos']
 },
 {
  name:'Odontologia', area:'Saúde', duration:'5 anos', icon:'/images/course-icons/odontologia.svg',
  desc:'Formação para prevenção, diagnóstico e tratamento da saúde bucal, com intensa prática clínica.',
  price:0, level:'Bacharelado', modality:'Presencial',
  shifts:['Manhã','Tarde','Integral'], profile:'Para quem tem habilidade manual, atenção a detalhes e interesse em cuidar de pessoas.',
  skills:['Diagnóstico bucal','Procedimentos clínicos','Biossegurança','Atendimento humanizado','Saúde coletiva','Gestão de consultório'],
  careers:['Cirurgião-dentista','Clínica própria','Saúde pública','Especialização odontológica','Pesquisa','Docência'],
  internship:'Clínicas e estágios supervisionados fazem parte da formação.',
  practicalFocus:'Laboratórios, clínicas-escola e atendimento supervisionado a pacientes.',
  entryPath:'Vestibular, ENEM e outras formas de ingresso da instituição.',
  grade:['Anatomia','Histologia','Microbiologia','Dentística','Periodontia','Endodontia','Prótese Dentária','Clínica Integrada']
 },
 {
  name:'Engenharia de Computação', area:'Tecnologia', duration:'5 anos', icon:'/images/course-icons/tecnologia.svg',
  desc:'Une computação e engenharia elétrica para projetar hardware, software embarcado, redes e sistemas.',
  price:0, level:'Bacharelado', modality:'Presencial',
  shifts:['Manhã','Tarde','Integral','Noite'], profile:'Para quem gosta de matemática, programação e de entender como os computadores funcionam por dentro.',
  skills:['Programação','Eletrônica digital','Sistemas embarcados','Redes','Arquitetura de computadores','Cálculo'],
  careers:['Engenheiro de computação','Desenvolvedor de sistemas embarcados','Engenheiro de software','Engenheiro de redes','IoT e automação','Pesquisa'],
  internship:'Estágio supervisionado obrigatório nas engenharias, conforme a instituição.',
  practicalFocus:'Laboratórios de eletrônica e programação, projetos de hardware e software.',
  entryPath:'Vestibular, ENEM e outras formas de ingresso da instituição.',
  grade:['Cálculo','Física','Circuitos Elétricos','Eletrônica Digital','Algoritmos','Arquitetura de Computadores','Sistemas Embarcados','Redes de Computadores']
 },
 {
  name:'Engenharia Mecânica', area:'Engenharia', duration:'5 anos', icon:'/images/course-icons/engenharia.svg',
  desc:'Projeto, fabricação e manutenção de máquinas, motores, sistemas térmicos e processos industriais.',
  price:0, level:'Bacharelado', modality:'Presencial',
  shifts:['Manhã','Tarde','Integral','Noite'], profile:'Para quem gosta de física, máquinas e de resolver problemas técnicos na indústria.',
  skills:['Cálculo','Desenho técnico','Mecânica dos sólidos','Termodinâmica','Processos de fabricação','Projeto mecânico'],
  careers:['Engenheiro mecânico','Engenheiro de manutenção','Engenheiro de projetos','Indústria automotiva','Energia','Consultoria'],
  internship:'Estágio supervisionado obrigatório nas engenharias, conforme a instituição.',
  practicalFocus:'Laboratórios, oficinas, projetos de máquinas e visitas técnicas.',
  entryPath:'Vestibular, ENEM e outras formas de ingresso da instituição.',
  grade:['Cálculo','Física','Desenho Técnico','Resistência dos Materiais','Termodinâmica','Mecânica dos Fluidos','Processos de Fabricação','Elementos de Máquinas']
 },
 {
  name:'Engenharia de Produção', area:'Engenharia', duration:'5 anos', icon:'/images/course-icons/engenharia.svg',
  desc:'Gestão e otimização de processos produtivos, qualidade, logística e operações em empresas.',
  price:0, level:'Bacharelado', modality:'Presencial',
  shifts:['Manhã','Tarde','Noite'], profile:'Para quem une interesse por números, processos e gestão de pessoas e recursos.',
  skills:['Gestão de operações','Qualidade','Logística','Pesquisa operacional','Análise de dados','Gestão de projetos'],
  careers:['Engenheiro de produção','Analista de processos','Gestor de qualidade','Logística e cadeia de suprimentos','Consultoria','Planejamento'],
  internship:'Estágio supervisionado obrigatório nas engenharias, conforme a instituição.',
  practicalFocus:'Projetos de melhoria de processos, simulações e estudos de caso em empresas.',
  entryPath:'Vestibular, ENEM e outras formas de ingresso da instituição.',
  grade:['Cálculo','Estatística','Pesquisa Operacional','Gestão da Qualidade','Planejamento e Controle da Produção','Logística','Ergonomia','Engenharia Econômica']
 },
 {
  name:'Sistemas de Informação', area:'Tecnologia', duration:'4 anos', icon:'/images/course-icons/tecnologia.svg',
  desc:'Combina tecnologia e gestão para desenvolver, integrar e administrar sistemas nas organizações.',
  price:0, level:'Bacharelado', modality:'Presencial, EAD e híbrido',
  shifts:['Manhã','Tarde','Noite'], profile:'Para quem gosta de tecnologia e quer aplicá-la à solução de problemas de empresas.',
  skills:['Programação','Banco de dados','Análise de sistemas','Gestão de TI','Segurança da informação','Análise de dados'],
  careers:['Analista de sistemas','Desenvolvedor','Gestor de TI','Analista de dados','Consultor de TI','Analista de segurança'],
  internship:'Estágio comum em empresas de tecnologia e áreas de TI.',
  practicalFocus:'Projetos de software, modelagem de sistemas e casos reais de negócio.',
  entryPath:'Vestibular, ENEM e outras formas de ingresso da instituição.',
  grade:['Algoritmos','Banco de Dados','Engenharia de Software','Redes de Computadores','Sistemas Operacionais','Gestão de Projetos','Segurança da Informação','Sistemas de Apoio à Decisão']
 },
 {
  name:'Ciências Econômicas', area:'Negócios', duration:'4 anos', icon:'/images/course-icons/negocios.svg',
  desc:'Estudo de mercados, políticas públicas, finanças e do comportamento da economia.',
  price:0, level:'Bacharelado', modality:'Presencial',
  shifts:['Manhã','Tarde','Noite'], profile:'Para quem gosta de matemática, atualidades e de entender como decisões econômicas afetam a sociedade.',
  skills:['Análise econômica','Estatística','Econometria','Finanças','Políticas públicas','Leitura de cenários'],
  careers:['Economista','Analista financeiro','Analista de mercado','Setor público','Consultoria','Pesquisa'],
  internship:'Estágio pode ser obrigatório ou opcional, conforme a instituição.',
  practicalFocus:'Análise de dados, modelos econômicos, monografia e estudos de conjuntura.',
  entryPath:'Vestibular, ENEM e outras formas de ingresso da instituição.',
  grade:['Microeconomia','Macroeconomia','Matemática','Estatística','Econometria','Contabilidade Social','Economia Brasileira','História Econômica']
 },
 {
  name:'Pedagogia', area:'Educação', duration:'4 anos', icon:'/images/course-icons/educacao.svg',
  desc:'Licenciatura para atuar na educação infantil, nos anos iniciais do ensino fundamental e na gestão escolar.',
  price:0, level:'Licenciatura', modality:'Presencial e semipresencial',
  shifts:['Manhã','Tarde','Noite'], profile:'Para quem gosta de ensinar, de crianças e de pensar sobre como as pessoas aprendem.',
  skills:['Didática','Alfabetização','Planejamento pedagógico','Inclusão','Gestão escolar','Avaliação da aprendizagem'],
  careers:['Professor da educação infantil','Professor dos anos iniciais','Coordenador pedagógico','Gestor escolar','Pedagogia empresarial','Educação não formal'],
  internship:'Estágio supervisionado obrigatório em escolas.',
  practicalFocus:'Estágios em escolas, projetos pedagógicos e prática de ensino.',
  entryPath:'Vestibular, ENEM e outras formas de ingresso da instituição.',
  grade:['Didática','Psicologia da Educação','Alfabetização e Letramento','Educação Infantil','Políticas Educacionais','Educação Inclusiva','Gestão Escolar','Estágio Supervisionado']
 },
 {
  name:'Técnico em Informática', area:'Tecnologia', duration:'1 a 3 anos', icon:'/images/course-icons/tecnologia.svg',
  desc:'Curso técnico de nível médio em programação, manutenção de computadores, redes e suporte.',
  price:0, level:'Técnico de nível médio', modality:'Presencial',
  shifts:['Manhã','Tarde','Noite'], profile:'Para quem quer uma formação rápida e prática para começar a trabalhar com tecnologia.',
  skills:['Lógica de programação','Manutenção de computadores','Redes','Banco de dados','Desenvolvimento web','Suporte técnico'],
  careers:['Técnico em informática','Suporte técnico','Programador júnior','Técnico de redes','Help desk'],
  internship:'Estágio pode ser exigido conforme o plano de curso da instituição.',
  practicalFocus:'Laboratórios de informática, projetos de software e montagem de equipamentos.',
  entryPath:'Processo seletivo da instituição; o integrado é cursado junto com o ensino médio.',
  grade:['Lógica de Programação','Arquitetura de Computadores','Sistemas Operacionais','Redes de Computadores','Banco de Dados','Desenvolvimento Web','Manutenção de Computadores','Projeto Integrador']
 },
];
