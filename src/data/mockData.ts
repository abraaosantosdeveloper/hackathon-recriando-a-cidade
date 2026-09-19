export type Agency = "Emlurb" | "Guarda" | "COP" | "Manutenção";
export type DataSource =
  | "156"
  | "Conecta Recife"
  | "Emlurb"
  | "Dados Vivos"
  | "ESIG"
  | "Guarda Municipal";
export type Status = "stable" | "attention" | "critical" | "insufficient";
export type UrbanEvent = {
  id: string;
  category: string;
  description: string;
  time: string;
  simulated: true;
};
export type Intervention = {
  id: string;
  status: "planned" | "active" | "done";
  action: string;
  note: string;
  photo: boolean;
  plannedAt: string;
  startedAt?: string;
  completedAt?: string;
};
export type Space = {
  id: string;
  name: string;
  type: string;
  neighborhood: string;
  rpa: number;
  latitude: number;
  longitude: number;
  status: Status;
  priority: "P1" | "P2" | "P3";
  trend: string;
  dataConfidence: "Alta" | "Média" | "Baixa";
  summary: string;
  issues: string[];
  sources: DataSource[];
  recentEvents: UrbanEvent[];
  interventions: Intervention[];
  citizenConfirmations: number;
  lastUpdated: string;
  agencies: Agency[];
  persistence: number;
  people: number;
  waitHours: number;
};
const places: [string, string, number, number, Status][] = [
  ["Praça Exemplo Central", "Centro", -8.054, -34.895, "attention"],
  ["Parque Exemplo Norte", "Zona norte", -8.025, -34.918, "critical"],
  ["Praça Jardim das Pontes", "Centro expandido", -8.043, -34.906, "critical"],
  ["Espaço Cultural Exemplo", "Zona oeste", -8.052, -34.943, "critical"],
  ["Praça Comunitária Sul", "Zona sul", -8.105, -34.91, "insufficient"],
  ["Parque dos Encontros", "Zona oeste", -8.035, -34.948, "insufficient"],
  ["Praça Caminho do Sol", "Zona norte", -8.015, -34.936, "attention"],
  ["Jardim Exemplo Leste", "Centro", -8.063, -34.881, "attention"],
  ["Praça das Conexões", "Zona sul", -8.083, -34.909, "attention"],
  ["Parque Horizonte", "Zona oeste", -8.073, -34.947, "attention"],
  ["Praça Bons Encontros", "Zona norte", -8.032, -34.901, "stable"],
  ["Jardim do Amanhã", "Zona sul", -8.125, -34.916, "stable"],
  ["Praça das Águas", "Centro", -8.065, -34.912, "stable"],
  ["Parque Exemplo Capibaribe", "Zona oeste", -8.046, -34.927, "stable"],
  ["Praça do Cuidado", "Zona norte", -8.018, -34.906, "stable"],
  ["Jardim Compartilhado", "Zona sul", -8.094, -34.925, "stable"],
  ["Praça da Brisa", "Zona sul", -8.115, -34.899, "stable"],
  ["Parque dos Caminhos", "Zona oeste", -8.06, -34.96, "stable"],
  ["Praça das Flores", "Zona norte", -8.007, -34.923, "stable"],
  ["Jardim das Ideias", "Centro", -8.074, -34.895, "stable"],
  ["Praça Novo Dia", "Zona oeste", -8.088, -34.94, "stable"],
  ["Parque do Abraço", "Zona norte", -8.025, -34.96, "stable"],
  ["Praça do Horizonte", "Zona sul", -8.137, -34.919, "stable"],
  ["Jardim das Descobertas", "Zona oeste", -8.083, -34.97, "stable"],
];
export const initialSpaces: Space[] = places.map(
  ([name, neighborhood, latitude, longitude, status], i) => ({
    id: `space-${i}`,
    name,
    type: name.startsWith("Parque") ? "Parque" : "Praça",
    neighborhood,
    rpa: (i % 6) + 1,
    latitude,
    longitude,
    status,
    priority:
      i === 2
        ? "P2"
        : status === "critical"
          ? "P1"
          : status === "attention"
            ? "P2"
            : "P3",
    trend: status === "critical" ? "↑ aumentando" : "→ sem mudança",
    dataConfidence:
      status === "insufficient" ? "Baixa" : i % 3 === 0 ? "Média" : "Alta",
    summary:
      status === "insufficient"
        ? "Dados insuficientes para uma classificação segura."
        : status === "stable"
          ? "Um espaço cuidado, pronto para novos encontros."
          : "Sinais recentes indicam que este espaço precisa de cuidado.",
    issues:
      status === "stable"
        ? []
        : status === "insufficient"
          ? ["Vistoria preventiva"]
          : i === 0
            ? ["Iluminação", "Limpeza"]
            : [
                "Iluminação",
                "Mobiliário",
                ...(i === 1 ? ["Registro operacional"] : []),
              ],
    sources:
      status === "insufficient"
        ? ["ESIG"]
        : ["156", "Conecta Recife", "Emlurb", "Dados Vivos"],
    recentEvents:
      status === "stable" || status === "insufficient"
        ? []
        : [
            {
              id: `event-${i}`,
              category: "Iluminação",
              description: "Solicitação simulada de cuidado no espaço",
              time: "Hoje, 14:02",
              simulated: true,
            },
          ],
    interventions:
      i === 10
        ? [
            {
              id: "seed-done",
              status: "done",
              action: "Iluminação restaurada",
              note: "Vistoria e manutenção concluídas. Resultado simulado.",
              photo: false,
              plannedAt: "Hoje, 08:00",
              startedAt: "Hoje, 09:00",
              completedAt: "Hoje, 11:20",
            },
          ]
        : i === 12
          ? [
              {
                id: "seed-clean",
                status: "done",
                action: "Limpeza concluída",
                note: "Espaço pronto para uso.",
                photo: false,
                plannedAt: "Ontem, 08:00",
                startedAt: "Ontem, 09:00",
                completedAt: "Ontem, 10:20",
              },
            ]
          : i === 13
            ? [
                {
                  id: "seed-repair",
                  status: "done",
                  action: "Mobiliário reparado",
                  note: "Bancos revisados.",
                  photo: false,
                  plannedAt: "Ontem, 10:00",
                  startedAt: "Ontem, 11:00",
                  completedAt: "Ontem, 14:00",
                },
              ]
            : i === 1 || i === 2
              ? [
                  {
                    id: `seed-${i}`,
                    status: "planned",
                    action: "Vistoria integrada",
                    note: "",
                    photo: false,
                    plannedAt: "Hoje, 14:15",
                  },
                ]
              : [],
    citizenConfirmations: i === 0 ? 3 : i % 5,
    lastUpdated: "Hoje, 14:20",
    agencies: i === 1 ? ["Emlurb", "Guarda", "Manutenção", "COP"] : ["Emlurb"],
    persistence: i === 1 ? 48 : 8,
    people: i === 1 ? 850 : 320,
    waitHours: i === 1 ? 24 : 8,
  }),
);
