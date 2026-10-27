# Matriculou + Supabase + BIJK

Projeto Next.js do Matriculou conectado ao Supabase.

## Configuração

1. Instale as dependências com `npm install`.
2. O arquivo `.env.local` já contém a URL e a chave pública do projeto Supabase usado pelo projeto.
3. No SQL Editor do Supabase, execute `supabase/setup.sql`.
4. Depois execute `supabase/seed_47_instituicoes.sql` para carregar as 47 instituições e suas ofertas.
5. Em seguida, execute `supabase/lgpd-conformidade.sql`, `supabase/instituicoes-fotos-e-ampliacao.sql` e, por último, `supabase/correcao-dados-catalogo.sql` (corrige conceitos MEC atribuídos a escolas e nomes de curso duplicados).

## Storage

O `setup.sql` cria os buckets `avatars` e `pre-matriculas` e suas políticas de acesso. Isso corrige o erro de `Bucket not found` no upload de foto de perfil.

## Login

A sessão está configurada com `persistSession: false`, então o acesso não fica salvo no navegador depois de uma recarga/novo acesso. O usuário precisa entrar novamente.

## Identidade visual

- A logo do **Matriculou** aparece no navbar e nas áreas gerais do site.
- A logo da **BIJK** aparece somente na página **Sobre a BIJK**.
- A home usa um carrossel com transição suave entre imagens.
