# Mapa Vivo Recife

**Do problema identificado à ação pública visível.** MVP frontend para demonstrar o ciclo de cuidado dos espaços públicos, como extensão conceitual do Conecta Recife.

## Executar

Requer Node.js 20.19+ ou 22.12+.

```sh
npm install
npm run dev
```

Abra http://localhost:5173 (ou o endereço informado pelo Vite).

```sh
npm run build
npm run preview
```

## Telas e roteiro do pitch

1. Na introdução, clique em **Explorar demonstração**.
2. Em **Gestão**, explore os estados, compare criticidade e prioridade e abra um espaço com dados insuficientes.
3. Em **Cidadão**, selecione **Praça Exemplo Central** e clique em **Ainda está assim?**. As confirmações passam de 3 para 4.
4. Volte à **Gestão**: a confirmação e a persistência foram atualizadas. Clique em **Planejar intervenção**.
5. Entre em **Operações → Emlurb**, encontre a Praça Exemplo Central e clique em **Assumir ação**. O cidadão passa a ver **Equipe acionada**.
6. Clique em **Marcar como concluído**, preencha o resultado e confirme **Concluir intervenção**.
7. Em **Cidadão**, o local aparece como **Resolvido**. Em **Transparência**, acompanhe o antes/depois e a linha do tempo completa.
8. Abra **Como o Mapa Vivo funciona?** para apresentar a conexão entre fontes. A aba **COP** mostra coordenação de casos multissetoriais.
9. **Reiniciar demo** restaura todos os dados iniciais. O estado é mantido localmente entre recargas.

O registro cidadão também funciona: selecione uma categoria, confira o local e envie. Novos registros reabrem o cuidado e preservam resultados anteriores.

## Dados e limites

Todos os 24 espaços, ocorrências, notificações, prioridades, indicadores e resultados são **simulados**. Coordenadas são ilustrativas; não representam problemas reais nos locais próximos. Sem vínculo oficial, autenticação, backend, banco ou integrações ativas.

A execução é local. O mapa-base OpenStreetMap e a fonte tipográfica usam internet. Sem conexão, fontes de fallback e a lista de espaços permitem continuar o fluxo. A foto opcional é uma ilustração identificada como simulada.

Uma implementação real integraria **156 / Conecta Recife, Emlurb, Dados Vivos, ESIG, Guarda Municipal e COP**. Baixo volume de dados nunca implica estabilidade, e renda não é usada como indicador de degradação.

## Estrutura e validação

- React, Vite, TypeScript, React Router, React Leaflet e Lucide.
- `src/data/mockData.ts`: tipos e cenário inicial.
- `src/App.tsx`: navegação, estado compartilhado e componentes reutilizáveis.
- `src/styles.css`: visual e adaptação desktop/mobile.
- `tests/demo.spec.ts`: ciclo completo em navegador, mapa carregado, filtros, persistência, modais, reinício e erros de execução.

```sh
npx playwright install chromium
npm run test:e2e
```

O texto anterior do repositório foi preservado em `docs/contexto-original.md`.
