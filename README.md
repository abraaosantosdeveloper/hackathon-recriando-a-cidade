# Insuficiência no Monitoramento da Ordem Pública em Espaços de Lazer e Turismo

### Sumário

[Introdução](#introdução)<br>
[Sobre a Equipe](#sobre-a-equipe)<br>
[O problema](#o-problema)<br>
[Objetivo de Longo Prazo](#objetivo-de-longo-prazo)<br>
[Resultados esperados](#resultados-esperados)<br>
[Indicadores de Sucesso](#indicadores-de-sucesso)<br>
[Riscos Associados](#riscos-associados)<br>
[A Solução](#a-solução)<br>

## Introdução

O presente documento tange à solução proposta para atender a demanda da Prefeitura do Recife no que se refere ao monitoramento de áreas de lazer, e garantia da ordem e preservação de patrimônio público. Neste contexto, abordaremos questões tais como potenciais aprimoramentos no sistema pré-existente, integrações com interfaces complementares, automação de mecanismos e afins.

Este desafio aborda a dificuldade do Recife em monitorar preventivamente situações que degradam a ordem pública em parques, praças e equipamentos de lazer e turismo — como descarte irregular de resíduos, depredação de patrimônio público, furtos, danos a mobiliários urbanos e outras ocorrências que afetam o uso qualificado dos espaços. A atuação do poder público tende a ser reativa e fragmentada, ocorrendo após a consolidação do problema ou por demanda pontual, em razão da limitação de instrumentos analíticos capazes de identificar padrões, antecipar riscos e orientar ações preventivas de forma territorializada e contínua.

## Sobre a Equipe

**Abraão Santos** • *Desenvolvedor Back-End* • [GitHub Profile](https://github.com/abraaosantosdeveloper)<br>
**Eduarda Assis** • *Desenvolvedor Back-End* • [GitHub Profile](https://github.com/Dudad771)<br>
**Marconis Paixão** • *Desenvolvedor Full-Stack* • [GitHub Profile](https://github.com/Junior010101)<br>

## O problema

Recife possui uma rede ampla de espaços públicos que concentram fluxos intensos e 
variáveis de pessoas — com maior pressão em fins de semana, períodos turísticos, eventos 
e determinadas faixas horárias. Esses territórios, por sua relevância simbólica, cultural e 
econômica, dependem de rotinas regulares de conservação, limpeza, fiscalização e atuação 
integrada entre diferentes áreas da gestão. No entanto, há dificuldade em consolidar uma 
visão única e preventiva do que ocorre nesses espaços: muitas ocorrências são percebidas 
tardiamente, registradas em bases desconectadas ou tratadas isoladamente por cada 
órgão. A ausência de uma capacidade analítica contínua reduz a previsibilidade, dificulta a 
priorização de equipes e limita a identificação de padrões de reincidência territorial, 
contribuindo para degradação do ambiente urbano, perda de atratividade turística e redução 
do uso seguro e qualificado dos espaços pela população.

## Objetivo de longo prazo

Fortalecer a capacidade do município de atuar preventivamente na manutenção da ordem 
pública em espaços de lazer e turismo, ampliando a conservação do patrimônio urbano, a 
eficiência operacional e a qualidade da experiência cidadã nesses territórios.

## Resultados esperados

– Identificação antecipada de padrões de degradação da ordem pública (recorrência 
territorial, sazonalidade e criticidade) 
– Priorização mais eficiente de rotinas de limpeza, conservação, fiscalização e manutenção 
– Redução da dependência de respostas emergenciais e de ações pontuais por demanda 
– Melhoria da preservação do patrimônio público e do uso qualarante dos espaços por 
cidadãos e visitantes

## Indicadores de Sucesso

– Redução da reincidência de ocorrências de descarte irregular e depredação em pontos 
críticos 
– Redução do tempo entre ocorrência, registro e intervenção adequada 
– Aumento da proporção de ações preventivas (programadas por risco e recorrência) em 
relação às reativas 
– Melhoria dos indicadores de conservação e satisfação dos usuários dos espaços 
públicos

## Riscos associados

– Fragmentação de dados e registros entre órgãos e canais 
– Capacidade operacional limitada para execução de ações preventivas em períodos de 
pico 
– Dificuldade de padronização de tipologias de ocorrência (denúncias, registros 
operacionais, vistorias) 
– Necessidade de comunicação clara com a população para estimular 
corresponsabilização sem gerar abordagem punitivista indiscriminada

## A solução

**1. Contexto**

O Recife já possui uma infraestrutura relevante de monitoramento e operação integrada, especialmente através do Centro de Operações do Recife (COP).

O desafio não é simplesmente “ter mais câmeras”.

O problema é transformar o monitoramento existente em uma capacidade contínua de:

detectar → interpretar → priorizar → responder → aprender.

A proposta é criar uma camada de inteligência especializada para praças, parques, quadras, áreas de convivência e outros espaços públicos de lazer.

**2. Problema**
```
Situação atual
Câmeras / sensores
        │
        ▼
    Imagens
        │
        ▼
     Operador
        │
        ▼
  Percepção humana
        │
        ▼
     Decisão
        │
        ▼
      Ação
```

**Esse modelo possui limitações:**

- grande volume de imagens;
- dependência da atenção humana;
- dificuldade de monitoramento contínuo;
- eventos podem passar despercebidos;
- informações ficam dispersas;
- pouca sistematização do histórico;
- dificuldade para transformar ocorrências em prevenção.
- Problema central

> Como ampliar a capacidade de monitoramento e resposta nos espaços públicos de lazer sem depender exclusivamente da observação humana das câmeras?

**3. Solução proposta**
Uma camada de inteligência operacional!

```
A solução recebe informações de diferentes fontes e transforma acontecimentos em eventos estruturados e acionáveis.

              ESPAÇO PÚBLICO
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
    Câmeras      Sensores     Cidadãos
       │            │            │
       └────────────┼────────────┘
                    ▼
             MOTOR DE EVENTOS
                    │
                    ▼
              CLASSIFICAÇÃO
                    │
                    ▼
              PRIORIZAÇÃO
                    │
                    ▼
                OPERADOR
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
         GCM       SAMU      CTTU
          │         │         │
          └─────────┼─────────┘
                    ▼
                 RESPOSTA
                    │
                    ▼
                HISTÓRICO
                    │
                    ▼
               INTELIGÊNCIA
```

**4. O que a IA identifica?**

A proposta não é identificar pessoas criminosas, 
a IA trabalha com eventos observáveis.

**Exemplos**

- aglomeração repentina;
- correria;
- conflito aparente;
- queda de pessoa;
- vandalismo;
- fumaça ou incêndio;
- objeto abandonado;
- acesso a área restrita;
- ocupação anormal;
- obstrução de passagem;
- alteração abrupta no fluxo de pessoas.

```
CÂMERA
   │
   ▼
Visão computacional
   │
   ▼
"Movimentação anormal"
   │
   ▼
Confiança: 91%
   │
   ▼
Operador
   │
   ├── Confirmar
   ├── Ignorar
   └── Encaminhar
```

### A decisão operacional permanece com uma pessoa.

**5. Fluxo operacional**

```
┌───────────────┐
│   OCORRÊNCIA  │
└───────┬───────┘
        ▼
┌───────────────┐
│    DETECÇÃO   │
│ IA / sensor   │
└───────┬───────┘
        ▼
┌───────────────┐
│ CLASSIFICAÇÃO │
└───────┬───────┘
        ▼
┌───────────────┐
│  PRIORIZAÇÃO  │
└───────┬───────┘
        ▼
┌───────────────┐
│   OPERADOR    │
└───────┬───────┘
        ▼
┌───────────────┐
│   DESPACHO    │
└───────┬───────┘
        ▼
┌───────────────┐
│    RESPOSTA   │
└───────┬───────┘
        ▼
┌───────────────┐
│   REGISTRO    │
└───────┬───────┘
        ▼
┌───────────────┐
│   APRENDIZADO │
└───────────────┘

```
**6. Dashboard**

O painel central teria três perspectivas.

**Monitoramento:**

```
┌──────────────────────────────────────┐
│       MONITORAMENTO EM TEMPO REAL    │
├──────────┬──────────┬────────────────┤
│ 42 locais│17 eventos│3 prioritários  │
├──────────┴──────────┴────────────────┤
│                                      │
│                MAPA                  │
│       ●             ●                │
│             ●                        │
│                    ●                 │
│       ●                              │
│                                      │
├──────────────────────────────────────┤
│ EVENTOS                              │
│ 🔴 Parque X — conflito.              │
│ 🟡 Praça Y — aglomeração             │
│ 🟡 Parque Z — queda                  │
└──────────────────────────────────────┘
Evento
EVENTO #19482

Local: Parque X
Horário: 21:43
Câmera: PX-04

Tipo:
Aglomeração anormal

Confiança:
91%

[ Visualizar ]

[ Confirmar ]

[ Descartar ]

[ Despachar equipe ]
Gestão
INDICADORES

Eventos por local
Eventos por horário
Tempo médio de resposta
Falsos positivos
Tipos de ocorrência
Recorrência
Cobertura das câmeras
```


**7. Mapa de cobertura**

Uma funcionalidade importante seria visualizar onde o município possui capacidade de monitoramento e onde existem lacunas.

```
ESPAÇO             COBERTURA

Parque A           ████████████████ 96%
Parque B           ███████████░░░░░ 71%
Praça C            █████░░░░░░░░░░░ 34%
Praça D            █████████████░░░ 82%
```

**Isso permite sair de:**

> “Temos X câmeras.”

**para:**

> “Qual é a cobertura operacional dos espaços públicos?”

**8. Ordem pública além da segurança**

O sistema também pode identificar problemas de zeladoria e infraestrutura.

```

                 EVENTO
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
     Segurança  Infraestrutura  Trânsito
        │           │           │
        ▼           ▼           ▼
       GCM        EMLURB        CTTU`

```

**Exemplos:**

- iluminação defeituosa;
- equipamento público danificado;
- vegetação obstruindo câmera;
- lixo acumulado;
- obstrução de passagem;
- vandalismo;
- problemas de acessibilidade.

Assim, o conceito de ordem pública deixa de significar apenas policiamento.

**9. Aprendizado operacional**

Cada evento gera dados.

```
EVENTO
  │
  ▼
DETECÇÃO
  │
  ▼
DECISÃO HUMANA
  │
  ├── Confirmado
  └── Falso positivo
  │
  ▼
RESPOSTA
  │
  ▼
TEMPO DE ATENDIMENTO
  │
  ▼
RESULTADO
```

Isso cria uma base histórica capaz de responder:

- Quais locais concentram eventos?
- Quais horários são mais críticos?
- Quais eventos se repetem?
- Onde existem pontos cegos?
- Qual é o tempo médio de resposta?
- Quais alertas geram mais falsos positivos?
- Que tipo de intervenção preventiva é necessária?


**10. Arquitetura de dados**
```
┌─────────────────────────────┐
│       FONTES DE DADOS       │
├─────────────────────────────┤
│ Câmeras                     │
│ Sensores                    │
│ Ocorrências                 │
│ Infraestrutura              │
│ Localização dos espaços     │
│ Equipes                     │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│     INGESTÃO / INTEGRAÇÃO   │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│       MOTOR DE EVENTOS      │
│                             │
│ IA + regras + contexto      │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│       EVENT STORE           │
│                             │
│ local + horário + tipo +    │
│ confiança + resposta        │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│       ANALYTICS             │
└─────────────────────────────┘
```

**11. MVP**

Para o hackathon, eu não tentaria implementar toda essa arquitetura.

O MVP poderia ter apenas:

**1. Mapa**

Espaços públicos + câmeras + cobertura.

**2. Simulação de vídeo**

Um conjunto pequeno de vídeos representando câmeras.

**3. Detecção**

Detectar alguns eventos:

- Aglomeração
- Correria
- Queda
- Objeto abandonado

**4. Central de eventos**

Evento → prioridade → operador → ação

**5. Histórico**

Registrar:

- quando
- onde
- o quê
- quem recebeu
- quanto demorou
- qual foi o resultado

**6. Dashboard analítico**

Mostrar os padrões acumulados.

**12. Diferencial**

A proposta não é:

> “mais uma plataforma de câmeras.”

É:

> “uma camada de inteligência que transforma monitoramento em capacidade de resposta e prevenção.”

A diferença pode ser resumida assim:

- Modelo tradicional	Proposta
- Câmera	Câmera + inteligência
- Imagem	Evento estruturado
- Operador observa	Sistema prioriza
- Reação	Resposta orientada
- Ocorrência isolada	Histórico
- Monitoramento	Aprendizado
- Segurança	Ordem pública integrada

**13. Tese do projeto**
Levar a capacidade de monitoramento integrado do Recife para o cotidiano dos espaços de lazer e convivência.

O Recife já possui infraestrutura, órgãos e capacidade operacional.

A oportunidade está em criar uma camada inteligente que conecte percepção, decisão, resposta e aprendizado.

```
              MONITORAMENTO
                    │
                    ▼
                INTELIGÊNCIA
                    │
                    ▼
                  AÇÃO
                    │
                    ▼
                RESULTADO
                    │
                    ▼
                 DADOS
                    │
                    ▼
                PREVENÇÃO
                    │
                    └───────────┐
                                │
                                ▼
                         MONITORAMENTO
```