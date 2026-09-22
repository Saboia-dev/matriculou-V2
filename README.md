# Matriculou

## Experiência editorial

A abertura integra navbar transparente, fotografia em tela cheia, cinco cenas e títulos condensados. A página usa tons de carvão e detalhes em coral, com fontes locais, navegação por capítulos e animações GSAP que respeitam movimento reduzido e podem ser pausadas.

- Atlas 3D de áreas: arraste a esfera, use as setas do teclado ou selecione uma área para abrir os cursos correspondentes.
- Mia: guia automático do catálogo com mensagens livres, sugestões, busca por cidade/rede/modalidade/investimento, histórico da sessão, nova conversa e exportação em texto. As respostas são locais, sem serviço de IA externo.
- Links de cursos e do chat aplicam filtros também ao navegar dentro da mesma página.
- Página 404 própria, com busca, caminhos de retorno e status HTTP 404.
- Sem configuração do Supabase, o catálogo usa instituições fictícias identificadas como demonstração; login e cadastro não simulam uma autenticação. Com configuração, os dados e a autenticação continuam usando o Supabase.

Validação: `npm run build` e `npm run test:e2e`. Os testes usam Chrome instalado. Para registrar capturas e verificar os links com o site em `localhost:3000`, execute `node scripts/review-editorial.mjs`; os arquivos ficam em `artifacts/editorial/`.

## Histórico da interface

Protótipo Next.js com uma direção visual editorial/tecnológica em verde musgo, creme e coral.

## O que foi incluído

- Perfil somente depois do login.
- Login/cadastro com estado salvo no `localStorage`.
- Favoritos persistentes com botão de coração nas instituições.
- Catálogo com filtros de rede pública/privada, tipo de instituição, estado, modalidade, bolsa e preço máximo.
- Carrossel de instituições na página inicial.
- Modal detalhado de instituição com imagem, localização, avaliação, modalidade, investimento e destaques.
- Página de cursos com busca e filtros por área.
- Modal "Entender mais" em cada curso com disciplinas, duração, faixa de preço, carreiras e instituições.
- Botão para abrir as faculdades que oferecem cada curso.
- Comparador de instituições.
- Página Sobre.
- Página Como funciona.
- Animações com GSAP, microinterações, hover, toasts, menu mobile e transições.
- Imagens de instituições por URLs pesquisadas na web.
- `image-sources.md` com os links das imagens e páginas consultadas.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Observação sobre dados

O projeto é um protótipo de interface. Valores de mensalidade, bolsas e disponibilidade devem ser conectados a uma fonte oficial/banco de dados antes de produção, pois podem mudar por campus, curso, turno e processo seletivo.


## Refinamentos v4

- Cards de instituições com ações alinhadas na mesma altura, independentemente do tamanho do nome.
- Botões de ação das instituições padronizados para “Comparar” e “Ver instituição”.
- Navegação do perfil com ícones e contadores alinhados em colunas fixas.
- Catálogo de cursos com definições específicas por curso: formação, modalidades, turnos, perfil, competências, carreiras, estágio, foco prático, ingresso e grade.
- Comparador de cursos ampliado com critérios específicos para cada formação.
- Melhorias de foco, estados de interação, hierarquia visual, espaçamento e consistência dos cards.
