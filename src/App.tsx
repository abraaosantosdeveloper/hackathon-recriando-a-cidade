import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  Info,
  Layers,
  Leaf,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
  Network,
  Clock,
  LocateFixed,
  Route,
  Plus,
  Building2,
} from "lucide-react";
import { initialSpaces, type Space, type Status } from "./data/mockData";

const states: Record<Status, { label: string; symbol: string }> = {
  stable: { label: "Estável", symbol: "●" },
  attention: { label: "Em atenção", symbol: "▲" },
  critical: { label: "Crítico", symbol: "◆" },
  insufficient: { label: "Dados insuficientes", symbol: "○" },
};
const last = (s: Space) => {
  const intervention = s.interventions.at(-1);
  // Keep the completed history when a new report reopens care.
  return intervention?.status === "done" && s.status !== "stable"
    ? undefined
    : intervention;
};
const publicState = (s: Space) =>
  last(s)?.status === "done"
    ? "Resolvido"
    : last(s)?.status === "active"
      ? "Em atendimento"
      : states[s.status].label;
const now = () =>
  `Hoje, ${new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
function StatusBadge({ space }: { space: Space }) {
  return (
    <span
      className={`badge ${last(space)?.status === "active" ? "active" : space.status}`}
    >
      {last(space)?.status === "done" ? "✓" : states[space.status].symbol}{" "}
      {publicState(space)}
    </span>
  );
}
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prior = document.activeElement as HTMLElement;
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const els = ref.current?.querySelectorAll<HTMLElement>(
          'button,input,select,textarea,[tabindex="0"]',
        );
        if (!els?.length) return;
        const first = els[0],
          end = els[els.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          end.focus();
        } else if (!e.shiftKey && document.activeElement === end) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      prior?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="modal"
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-button" aria-label="Fechar" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function MapFocus({ selected }: { selected: Space | null }) {
  const map = useMap();
  useEffect(() => {
    if (selected)
      map.flyTo([selected.latitude, selected.longitude], 13, { duration: 0.7 });
  }, [selected, map]);
  return (
    <button
      className="map-recenter"
      aria-label="Centralizar mapa em Recife"
      onClick={() => map.flyTo([-8.065, -34.922], 12)}
    >
      <LocateFixed size={19} />
    </button>
  );
}
function CityMap({
  spaces,
  selected,
  onSelect,
  mini = false,
}: {
  spaces: Space[];
  selected: Space | null;
  onSelect: (s: Space) => void;
  mini?: boolean;
}) {
  const [offline, setOffline] = useState(false);
  return (
    <div className={`map-wrap ${mini ? "mini-map" : ""}`}>
      <MapContainer
        center={[-8.065, -34.922]}
        zoom={12}
        scrollWheelZoom={false}
        className="city-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{ tileerror: () => setOffline(true) }}
        />
        {spaces.map((s) => (
          <Marker
            key={s.id}
            position={[s.latitude, s.longitude]}
            icon={L.divIcon({
              className: "marker-wrapper",
              html: `<div class="space-marker ${s.status} ${selected?.id === s.id ? "selected" : ""}">${states[s.status].symbol}</div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            })}
            eventHandlers={{ click: () => onSelect(s) }}
          >
            <Tooltip direction="top">
              {s.name} · {publicState(s)}
            </Tooltip>
          </Marker>
        ))}
        <MapFocus selected={selected} />
      </MapContainer>
      <div className="map-label">
        <span className="live-dot" /> RECIFE{" "}
        <span>· Territórios de cuidado</span>
      </div>
      <div className="map-demo">Dados demonstrativos · locais ilustrativos</div>
      {offline && (
        <div className="map-offline">
          Mapa-base indisponível. Os espaços simulados continuam navegáveis pela
          lista.
        </div>
      )}
      <div className="map-legend">
        {Object.entries(states).map(([key, v]) => (
          <span key={key}>
            <b className={key}>{v.symbol}</b>
            {v.label}
          </span>
        ))}
      </div>
    </div>
  );
}
function Timeline({ space }: { space: Space }) {
  const action = last(space);
  const step =
    action?.status === "done"
      ? 4
      : action?.status === "active"
        ? 2
        : action
          ? 1
          : 0;
  return (
    <div className="timeline">
      {[
        "Identificado",
        "Encaminhado",
        "Em atendimento",
        "Resolvido",
        "Retorno ao cidadão",
      ].map((label, i) => (
        <div key={label} className={i <= step ? "reached" : ""}>
          <span>{i <= step ? <Check size={13} /> : i + 1}</span>
          <strong>{label}</strong>
          <small>
            {i === 0
              ? "Sinal recebido"
              : i === 1
                ? action?.plannedAt
                : i === 2
                  ? action?.startedAt
                  : i >= 3
                    ? action?.completedAt
                    : ""}
          </small>
        </div>
      ))}
    </div>
  );
}
function App() {
  const [spaces, setSpaces] = useState<Space[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("mapa-vivo-v1") || "null");
      return stored?.version === 1 &&
        Array.isArray(stored.spaces) &&
        stored.spaces.length === 24
        ? stored.spaces
        : structuredClone(initialSpaces);
    } catch {
      return structuredClone(initialSpaces);
    }
  });
  const [selectedId, setSelectedId] = useState("space-0");
  const [toast, setToast] = useState("");
  const [modal, setModal] = useState<
    "sources" | "report" | "result" | "compare" | null
  >(null);
  const [reportType, setReportType] = useState("Limpeza");
  const [sent, setSent] = useState(false);
  const [actionText, setActionText] = useState("");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [agency, setAgency] = useState("Todas");
  const [rpa, setRpa] = useState("Todas");
  const [category, setCategory] = useState("Todas");
  const [coverage, setCoverage] = useState("Todas");
  const [priorityOnly, setPriorityOnly] = useState(false);
  const location = useLocation(),
    navigate = useNavigate();
  const page = location.pathname;
  const citizen = page === "/cidadao";
  const management = page === "/gestao";
  const selected = spaces.find((s) => s.id === selectedId)!;
  useEffect(() => {
    try {
      localStorage.setItem(
        "mapa-vivo-v1",
        JSON.stringify({ version: 1, spaces }),
      );
    } catch {
      /* Continue in memory if browser storage is unavailable. */
    }
  }, [spaces]);
  useEffect(() => {
    setQuery("");
    setFilter("Todos");
    setAgency("Todas");
    setRpa("Todas");
    setCategory("Todas");
    setCoverage("Todas");
    setPriorityOnly(false);
  }, [page]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 6000);
      return () => clearTimeout(t);
    }
  }, [toast]);
  const update = (id: string, fn: (s: Space) => Space) =>
    setSpaces((old) => old.map((s) => (s.id === id ? fn(s) : s)));
  function confirm() {
    update(selectedId, (s) => ({
      ...s,
      citizenConfirmations: s.citizenConfirmations + 1,
      persistence: s.persistence + 1,
      lastUpdated: now(),
      recentEvents: [
        ...s.recentEvents,
        {
          id: crypto.randomUUID(),
          category: "Confirmação",
          description: "Cidadão confirma que a situação continua (simulado)",
          time: now(),
          simulated: true,
        },
      ],
    }));
    setToast(
      "Obrigado. Sua confirmação ajuda a Prefeitura a saber que a situação continua.",
    );
  }
  function plan() {
    update(selectedId, (s) => ({
      ...s,
      interventions: [
        ...s.interventions,
        {
          id: crypto.randomUUID(),
          status: "planned",
          action:
            s.status === "insufficient"
              ? "Vistoria preventiva"
              : "Vistoria + manutenção",
          note: "",
          photo: false,
          plannedAt: now(),
        },
      ],
      lastUpdated: now(),
    }));
    setToast("Intervenção encaminhada à fila da Emlurb.");
  }
  function assume(id: string) {
    update(id, (s) => ({
      ...s,
      interventions: s.interventions.map((a, i) =>
        i === s.interventions.length - 1
          ? { ...a, status: "active", startedAt: now() }
          : a,
      ),
      lastUpdated: now(),
    }));
    setToast("Equipe acionada. O cidadão já pode acompanhar o atendimento.");
  }
  function complete() {
    if (!actionText.trim()) return;
    update(selectedId, (s) => ({
      ...s,
      status: "stable",
      trend: "↓ melhorando",
      issues: [],
      lastUpdated: now(),
      interventions: s.interventions.map((a, i) =>
        i === s.interventions.length - 1
          ? {
              ...a,
              status: "done",
              action: actionText.trim(),
              note,
              photo,
              completedAt: now(),
            }
          : a,
      ),
    }));
    setModal(null);
    setToast(
      "Intervenção concluída. Resultado publicado para o cidadão e em Transparência.",
    );
  }
  const filtered = spaces.filter(
    (s) =>
      `${s.name} ${s.neighborhood}`
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR")) &&
      (filter === "Todos" ||
        (filter === "Estáveis"
          ? s.status === "stable"
          : filter === "Em atenção"
            ? s.status === "attention"
            : filter === "Críticos"
              ? s.status === "critical"
              : filter === "Dados insuficientes"
                ? s.status === "insufficient"
                : publicState(s) === filter)) &&
      (agency === "Todas" ||
        s.agencies.includes(agency as Space["agencies"][number])) &&
      (rpa === "Todas" || String(s.rpa) === rpa) &&
      (category === "Todas" || s.issues.includes(category)) &&
      (coverage === "Todas" || s.dataConfidence === coverage) &&
      (!priorityOnly || s.priority === "P1"),
  );
  const done = spaces.flatMap((s) =>
      s.interventions
        .filter((a) => a.status === "done")
        .map((a) => ({ ...s, status: "stable" as const, interventions: [a] })),
    ),
    active = spaces.filter((s) => last(s)?.status === "active"),
    queue = spaces.filter(
      (s) =>
        last(s) &&
        last(s)?.status !== "done" &&
        (agency === "Todas" ||
          s.agencies.includes(agency as Space["agencies"][number])),
    );
  const select = (s: Space) => setSelectedId(s.id);
  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <MapPin size={24} />
            <i />
          </span>
          <span>
            mapa vivo<strong>RECIFE</strong>
          </span>
        </Link>
        <nav aria-label="Navegação principal">
          {[
            ["/cidadao", "Cidadão"],
            ["/gestao", "Gestão"],
            ["/operacoes", "Operações"],
            ["/transparencia", "Transparência"],
          ].map(([to, label]) => (
            <NavLink key={to} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="demo-controls">
          <span>
            <span className="live-dot" /> Modo demonstração
          </span>
          <button
            title="Restaurar todos os dados iniciais"
            onClick={() => {
              setSpaces(structuredClone(initialSpaces));
              setSelectedId("space-0");
              setToast(
                "Demonstração reiniciada. Todos os dados foram restaurados.",
              );
            }}
          >
            <RotateCcw size={14} /> Reiniciar demo
          </button>
        </div>
      </header>
      <div className="notice">
        <span>
          <Info size={13} /> Dados demonstrativos. Locais e ocorrências são
          simulados.
        </span>
        <button onClick={() => setModal("sources")}>
          Como o Mapa Vivo funciona? <ArrowUpRight size={14} />
        </button>
      </div>
      {page === "/" ? (
        <main className="intro">
          <div className="intro-copy">
            <span className="eyebrow">RECIFE · UMA CIDADE QUE CUIDA</span>
            <h1>
              A cidade se transforma.
              <br />O cuidado <em>aparece.</em>
            </h1>
            <p className="intro-name">MAPA VIVO RECIFE</p>
            <p>
              Da ocorrência isolada à inteligência territorial.
              <br />
              Do problema identificado à ação pública visível.
            </p>
            <button className="primary" onClick={() => navigate("/gestao")}>
              Explorar demonstração <ArrowRight size={18} />
            </button>
            <div className="intro-pillars">
              {[
                "Integração",
                "Território",
                "Prevenção",
                "Ação coordenada",
                "Transparência",
              ].map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
          <div className="intro-visual">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="river" />
            <div className="city-grid" />
            <div className="floating-card card-top">
              <span className="round-icon">
                <Users size={20} />
              </span>
              <div>
                <small>UM SINAL DA CIDADE</small>
                <strong>Alguém pediu cuidado.</strong>
              </div>
            </div>
            <div className="hero-pin">
              <MapPin size={62} />
            </div>
            <div className="floating-card card-bottom">
              <span className="round-icon green">
                <CheckCircle2 size={22} />
              </span>
              <div>
                <small>UM RESULTADO PARA TODOS</small>
                <strong>O espaço ganhou vida.</strong>
                <p>✓ Intervenção concluída</p>
              </div>
            </div>
            <span className="visual-caption">
              Sinal → território → ação → resultado
            </span>
          </div>
        </main>
      ) : (
        <main className="workspace">
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {citizen
                  ? "CUIDADO QUE SE VÊ"
                  : management
                    ? "INTELIGÊNCIA TERRITORIAL"
                    : page === "/operacoes"
                      ? "DA DECISÃO À AÇÃO"
                      : "CADA AÇÃO CONTA"}
              </div>
              <h1>
                {citizen
                  ? "Mapa do cuidado"
                  : management
                    ? "Pulso operacional"
                    : page === "/operacoes"
                      ? "Cuidado em movimento"
                      : "Resultado visível"}
                <span className="heading-dot">.</span>
              </h1>
              <p>
                {citizen
                  ? "Veja como os espaços públicos estão sendo cuidados."
                  : management
                    ? "Onde precisamos agir primeiro?"
                    : page === "/operacoes"
                      ? "Equipes conectadas. Territórios bem cuidados."
                      : "Do problema identificado à ação concluída."}
              </p>
            </div>
            <div className="heading-side">
              <span className="city-chip">
                <MapPin size={15} /> Recife, PE
              </span>
              <small>
                <span className="live-dot" /> Cenário simulado · atualizado
                nesta sessão
              </small>
            </div>
          </div>
          {(citizen || management) && (
            <>
              <div className="map-toolbar">
                <label className="search">
                  <Search size={18} />
                  <input
                    aria-label="Buscar praça, parque ou bairro"
                    placeholder={
                      citizen
                        ? "Buscar praça, parque ou bairro"
                        : "Encontre um espaço ou território"
                    }
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                {citizen ? (
                  <div className="pills">
                    {[
                      "Todos",
                      "Estáveis",
                      "Em atenção",
                      "Em atendimento",
                      "Resolvidos",
                    ].map((f) => (
                      <button
                        key={f}
                        className={
                          filter === (f === "Resolvidos" ? "Resolvido" : f)
                            ? "chosen"
                            : ""
                        }
                        onClick={() =>
                          setFilter(f === "Resolvidos" ? "Resolvido" : f)
                        }
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                ) : (
                  <>
                    <label className="select-label">
                      Estado
                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        {[
                          "Todos",
                          "Estáveis",
                          "Em atenção",
                          "Críticos",
                          "Dados insuficientes",
                        ].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label className="select-label">
                      Órgão
                      <select
                        value={agency}
                        onChange={(e) => setAgency(e.target.value)}
                      >
                        {["Todas", "Emlurb", "Guarda", "COP"].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label className="select-label">
                      Categoria
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {[
                          "Todas",
                          "Iluminação",
                          "Limpeza",
                          "Mobiliário",
                          "Vistoria preventiva",
                        ].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label className="select-label">
                      RPA
                      <select
                        value={rpa}
                        onChange={(e) => setRpa(e.target.value)}
                      >
                        {["Todas", "1", "2", "3", "4", "5", "6"].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                    <label className="select-label">
                      Cobertura
                      <select
                        value={coverage}
                        onChange={(e) => setCoverage(e.target.value)}
                      >
                        {["Todas", "Alta", "Média", "Baixa"].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </label>
                  </>
                )}
              </div>
              {management ? (
                <div className="territory-summary">
                  {(
                    [
                      "critical",
                      "attention",
                      "stable",
                      "insufficient",
                    ] as Status[]
                  ).map((key) => (
                    <button
                      key={key}
                      onClick={() =>
                        setFilter(
                          key === "critical"
                            ? "Críticos"
                            : key === "attention"
                              ? "Em atenção"
                              : key === "stable"
                                ? "Estáveis"
                                : "Dados insuficientes",
                        )
                      }
                    >
                      <span className={`state-icon ${key}`}>
                        {states[key].symbol}
                      </span>
                      <strong>
                        {spaces.filter((s) => s.status === key).length}
                      </strong>
                      <span>
                        {key === "stable"
                          ? "estáveis"
                          : key === "critical"
                            ? "críticos"
                            : key === "attention"
                              ? "em atenção"
                              : "com dados insuficientes"}
                      </span>
                    </button>
                  ))}
                  <button
                    className={
                      priorityOnly
                        ? "priority-toggle enabled"
                        : "priority-toggle"
                    }
                    onClick={() => setPriorityOnly(!priorityOnly)}
                  >
                    <Layers size={15} />
                    {priorityOnly
                      ? "Mostrando prioridades P1"
                      : "Mostrar apenas prioridades"}
                  </button>
                </div>
              ) : (
                <div className="citizen-question">
                  <Compass size={18} />
                  <strong>Como está um espaço perto de você?</strong>
                  <span>Selecione no mapa para acompanhar.</span>
                </div>
              )}
              <div className="map-layout">
                <div className="map-main">
                  <CityMap
                    spaces={filtered}
                    selected={
                      filtered.some((s) => s.id === selectedId)
                        ? selected
                        : null
                    }
                    onSelect={select}
                  />
                  <div className="map-bottom">
                    <span>
                      <Layers size={14} /> {filtered.length} espaços no mapa
                    </span>
                    <span>
                      Selecione um território para ver sua história{" "}
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
                <aside className="space-drawer">
                  <div className="drawer-label">
                    <span>
                      {selectedId === "space-0"
                        ? "CASO DEMONSTRAÇÃO"
                        : "HISTÓRIA DO TERRITÓRIO"}
                    </span>
                    <MapPin size={16} />
                  </div>
                  <div className="drawer-title">
                    <h2>{selected.name}</h2>
                    <p>
                      {selected.type} · {selected.neighborhood} · RPA{" "}
                      {selected.rpa}
                    </p>
                  </div>
                  <StatusBadge space={selected} />
                  {management && (
                    <div className="priority-row">
                      <div>
                        <small>Prioridade operacional</small>
                        <strong className="priority-badge">
                          {selected.priority}
                        </strong>
                      </div>
                      <div>
                        <small>Tendência</small>
                        <strong>{selected.trend}</strong>
                      </div>
                    </div>
                  )}
                  {selected.status === "insufficient" ? (
                    <div className="confidence-warning">
                      <Info size={20} />
                      <strong>
                        Dados insuficientes para uma classificação segura.
                      </strong>
                      <p>
                        Poucas fontes recentes disponíveis. Não é possível
                        concluir que o território está estável.
                      </p>
                      <b>Vistoria preventiva recomendada.</b>
                    </div>
                  ) : (
                    <>
                      <h3>
                        {citizen
                          ? "O que identificamos"
                          : "Por que este espaço pede atenção?"}
                      </h3>
                      {selected.status === "stable" ? (
                        <p className="body-copy">
                          {last(selected)?.status === "done"
                            ? last(selected)?.action
                            : selected.summary}
                        </p>
                      ) : (
                        <ul className="reason-list">
                          {(citizen
                            ? selected.issues.map(
                                (i) => `${i}: cuidado pendente`,
                              )
                            : [
                                "Problemas semelhantes repetidos nos últimos dias",
                                "Demandas ainda sem resolução",
                                "Diferentes categorias no mesmo território",
                                ...(selected.status === "critical"
                                  ? ["Aumento em relação ao próprio histórico"]
                                  : []),
                              ]
                          ).map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                  {management ? (
                    <>
                      <div className="signals">
                        <span>
                          <Users size={15} />{" "}
                          <strong>{selected.citizenConfirmations}</strong>{" "}
                          confirmações recentes
                        </span>
                        <span>
                          <Clock size={15} /> Persistência:{" "}
                          <strong>{selected.persistence}h</strong>
                        </span>
                      </div>
                      <h3>Fontes que compõem a leitura</h3>
                      <div className="source-tags">
                        {selected.sources.map((s) => (
                          <span key={s}>{s}</span>
                        ))}
                      </div>
                      <div className="coverage">
                        <span>Cobertura dos dados</span>
                        <strong
                          className={
                            selected.dataConfidence === "Baixa" ? "low" : ""
                          }
                        >
                          {selected.dataConfidence}{" "}
                          <span>
                            ● ● {selected.dataConfidence === "Alta" ? "●" : "○"}
                          </span>
                        </strong>
                      </div>
                      {selected.dataConfidence === "Baixa" && (
                        <p className="small-note">
                          A ausência de registros não significa ausência de
                          problemas.
                        </p>
                      )}
                      <button
                        className="primary wide"
                        disabled={
                          last(selected)?.status === "planned" ||
                          last(selected)?.status === "active"
                        }
                        onClick={plan}
                      >
                        {last(selected)?.status === "planned"
                          ? "✓ Intervenção planejada"
                          : last(selected)?.status === "active"
                            ? "Equipe em atendimento"
                            : "Planejar intervenção"}
                        <ArrowRight size={16} />
                      </button>
                      {last(selected) && last(selected)?.status !== "done" && (
                        <Link className="text-link" to="/operacoes">
                          Acompanhar na fila de operações{" "}
                          <ChevronRight size={14} />
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <h3>O que está sendo feito</h3>
                      <div className="public-progress">
                        <CheckCircle2 size={19} />
                        <div>
                          <strong>
                            {last(selected)?.status === "done"
                              ? "Resolvido"
                              : last(selected)?.status === "active"
                                ? "Equipe acionada"
                                : last(selected)?.status === "planned"
                                  ? "Vistoria programada"
                                  : "Sinais em análise"}
                          </strong>
                          <small>
                            {last(selected)?.status === "done"
                              ? "Resultado disponível para a população"
                              : "Acompanhe aqui as próximas etapas."}
                          </small>
                        </div>
                      </div>
                      <div className="updated">
                        Última atualização{" "}
                        <strong>{selected.lastUpdated}</strong>
                      </div>
                      <button className="primary wide" onClick={confirm}>
                        Ainda está assim? <Plus size={16} />
                      </button>
                      <p className="confirmation-count">
                        {selected.citizenConfirmations} confirmações recentes
                      </p>
                      <button
                        className="secondary wide"
                        onClick={() => {
                          setSent(false);
                          setModal("report");
                        }}
                      >
                        Informar outro problema <ArrowUpRight size={15} />
                      </button>
                    </>
                  )}
                </aside>
              </div>
              <div className="space-browser">
                <span>Explorar espaços</span>
                {filtered.length === 0 ? (
                  <p>Nenhum espaço encontrado. Ajuste os filtros ou a busca.</p>
                ) : (
                  filtered.map((s) => (
                    <button
                      key={s.id}
                      className={selectedId === s.id ? "selected" : ""}
                      onClick={() => select(s)}
                    >
                      <span className={s.status}>
                        {states[s.status].symbol}
                      </span>
                      {s.name.replace("Praça ", "").replace("Parque ", "")}
                      <ChevronRight size={12} />
                    </button>
                  ))
                )}
              </div>
              {management ? (
                <div className="insight-grid">
                  <section className="insight-card">
                    <div className="round-icon">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h2>Criticidade não é prioridade.</h2>
                      <p>
                        Criticidade mostra a condição atual.
                        <br />
                        Prioridade organiza a resposta pública.
                      </p>
                      <button
                        className="text-link"
                        onClick={() => setModal("compare")}
                      >
                        Comparar dois territórios <ArrowRight size={15} />
                      </button>
                    </div>
                  </section>
                  <section className="insight-card equity">
                    <div className="round-icon">
                      <Users size={20} />
                    </div>
                    <div>
                      <span className="eyebrow">EQUIDADE TERRITORIAL</span>
                      <h2>Visibilidade não é sinônimo de necessidade.</h2>
                      <p>
                        Áreas com menos registros digitais não são
                        automaticamente classificadas como estáveis.
                      </p>
                      <button
                        className="text-link"
                        onClick={() => {
                          setFilter("Dados insuficientes");
                          setSelectedId("space-4");
                        }}
                      >
                        Conhecer territórios com baixa cobertura{" "}
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </section>
                </div>
              ) : (
                <section className="recent-section">
                  <div>
                    <span className="eyebrow">RESULTADOS NO TERRITÓRIO</span>
                    <h2>O que mudou perto de você?</h2>
                    <p>
                      {done.length} ações concluídas · {active.length} em
                      andamento ·{" "}
                      {spaces.filter((s) => s.status === "attention").length}{" "}
                      espaços em atenção
                    </p>
                  </div>
                  <div className="recent-cards">
                    {done
                      .slice()
                      .reverse()
                      .slice(0, 3)
                      .map((s) => (
                        <button
                          key={`${s.id}-${last(s)?.id}`}
                          onClick={() => select(s)}
                        >
                          <CheckCircle2 size={21} />
                          <strong>{last(s)?.action}</strong>
                          <span>{s.name}</span>
                          <small>
                            {last(s)?.completedAt} <ArrowUpRight size={14} />
                          </small>
                        </button>
                      ))}
                  </div>
                </section>
              )}
            </>
          )}
          {page === "/operacoes" && (
            <>
              <div className="operations-bar">
                <div className="pills">
                  {["Todas", "Emlurb", "Guarda", "COP"].map((a) => (
                    <button
                      key={a}
                      className={agency === a ? "chosen" : ""}
                      onClick={() => setAgency(a)}
                    >
                      {a === "Todas" ? "Todas as equipes" : a}
                    </button>
                  ))}
                </div>
                <span>{queue.length} territórios aguardando cuidado</span>
              </div>
              {agency === "Emlurb" && (
                <div className="agency-guide">
                  <span>
                    <Zap size={17} /> Iluminação recorrente → inspeção
                    preventiva
                  </span>
                  <span>
                    <Leaf size={17} /> Descarte recorrente → limpeza + vistoria
                  </span>
                  <span>
                    <Building2 size={17} /> Mobiliário danificado → manutenção
                  </span>
                </div>
              )}
              <div className="operations-layout">
                <section className="queue">
                  {queue.length === 0 ? (
                    <div className="empty-state">
                      <CheckCircle2 size={36} />
                      <h2>Fila em dia por aqui.</h2>
                      <p>
                        Planeje uma intervenção na Gestão para encaminhar um
                        novo território.
                      </p>
                      <Link to="/gestao" className="text-link">
                        Ir para Gestão <ArrowRight size={16} />
                      </Link>
                    </div>
                  ) : (
                    queue.map((s) => (
                      <article className="queue-card" key={s.id}>
                        <div className="queue-top">
                          <span className="eyebrow">
                            {s.agencies.includes("COP")
                              ? "ALERTA INTERSETORIAL"
                              : "CUIDADO DO TERRITÓRIO"}
                          </span>
                          <span className="priority-badge">
                            Prioridade {s.priority}
                          </span>
                        </div>
                        <h2>{s.name}</h2>
                        <p className="location-line">
                          <MapPin size={14} />
                          {s.neighborhood} · RPA {s.rpa}
                        </p>
                        <StatusBadge space={s} />
                        <h3>Problemas correlacionados</h3>
                        <p>{s.issues.join(" + ")}</p>
                        <div className="queue-facts">
                          <span>
                            {s.recentEvents.length + s.citizenConfirmations}{" "}
                            registros associados
                          </span>
                          <span>Persistência: {s.persistence}h</span>
                        </div>
                        <div className="suggestion">
                          <Route size={18} />
                          <div>
                            <small>Ação sugerida</small>
                            <strong>{last(s)?.action}</strong>
                          </div>
                          <div className="source-tags">
                            {s.agencies.map((a) => (
                              <span key={a}>{a}</span>
                            ))}
                          </div>
                        </div>
                        {agency === "COP" && (
                          <>
                            <p className="coordination">
                              Coordenação necessária · atuação conjunta
                            </p>
                            <div className="cop-timeline">
                              {[
                                "14:02 · Alerta gerado",
                                "14:05 · Emlurb notificada",
                                "14:07 · Guarda notificada",
                                "14:15 · Ação conjunta programada",
                              ].map((t) => (
                                <span key={t}>
                                  <CheckCircle2 size={14} />
                                  {t}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                        <div className="queue-actions">
                          <button
                            className="primary"
                            onClick={() => {
                              if (last(s)?.status === "active") {
                                setSelectedId(s.id);
                                setActionText(last(s)?.action || "");
                                setNote("");
                                setPhoto(false);
                                setModal("result");
                              } else assume(s.id);
                            }}
                          >
                            {last(s)?.status === "active"
                              ? "Marcar como concluído"
                              : "Assumir ação"}
                            <ArrowRight size={16} />
                          </button>
                          <button
                            className="secondary"
                            onClick={() => {
                              select(s);
                              navigate("/gestao");
                            }}
                          >
                            Ver território <MapPin size={15} />
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </section>
                <aside className="operations-aside">
                  <span className="round-icon">
                    <Network size={24} />
                  </span>
                  <h2>
                    O espaço público passa a ter história, não apenas
                    protocolos.
                  </h2>
                  <p>
                    Cada equipe atualiza uma mesma história. A Gestão acompanha,
                    o COP coordena e o cidadão vê o resultado.
                  </p>
                  <div className="mini-steps">
                    <span>
                      01 <b>Assuma o cuidado</b>
                    </span>
                    <span>
                      02 <b>Registre o resultado</b>
                    </span>
                    <span>
                      03 <b>Devolva à população</b>
                    </span>
                  </div>
                  <div className="small-note">
                    Todos os encaminhamentos e notificações desta demonstração
                    são simulados.
                  </div>
                </aside>
              </div>
            </>
          )}
          {page === "/transparencia" && (
            <>
              <div className="results-metrics">
                <div>
                  <CheckCircle2 />
                  <strong>{done.length}</strong>
                  <span>Ações concluídas</span>
                </div>
                <div>
                  <Route />
                  <strong>{active.length}</strong>
                  <span>Em andamento</span>
                </div>
                <div>
                  <Clock />
                  <strong>6h</strong>
                  <span>Tempo médio de resposta*</span>
                </div>
                <div>
                  <Sparkles />
                  <strong>32%</strong>
                  <span>Recorrências reduzidas*</span>
                </div>
              </div>
              <p className="metric-note">
                * Indicadores ilustrativos, sem medição real. Contagens de ações
                acompanham esta demonstração.
              </p>
              <div className="section-title">
                <div>
                  <span className="eyebrow">ANTES E DEPOIS</span>
                  <h2>Uma ação muda a história de um lugar.</h2>
                </div>
                <span>{done.length} resultados visíveis</span>
              </div>
              {done
                .slice()
                .reverse()
                .map((s) => (
                  <article
                    className="transparency-card"
                    key={`${s.id}-${last(s)?.id}`}
                  >
                    <div className="transparency-heading">
                      <div>
                        <h2>{s.name}</h2>
                        <p>
                          <MapPin size={14} />
                          {s.neighborhood} · intervenção simulada
                        </p>
                      </div>
                      <StatusBadge space={s} />
                    </div>
                    <div className="before-after">
                      <div>
                        <span>01 / ANTES</span>
                        <h3>
                          {s.id === "space-0"
                            ? "Iluminação e limpeza pendentes"
                            : "Cuidado pendente no espaço"}
                        </h3>
                        <p>Sinais reunidos e necessidade identificada.</p>
                      </div>
                      <ArrowRight />
                      <div>
                        <span>02 / AÇÃO</span>
                        <h3>{last(s)?.action}</h3>
                        <p>
                          {last(s)?.note ||
                            "Vistoria e atendimento no território."}
                        </p>
                        {last(s)?.photo && (
                          <small>
                            ▧ Foto simulada anexada · evidência ilustrativa
                          </small>
                        )}
                      </div>
                      <ArrowRight />
                      <div className="after">
                        <span>03 / DEPOIS</span>
                        <h3>
                          <CheckCircle2 size={20} /> Espaço cuidado
                        </h3>
                        <p>Resultado registrado e devolvido à população.</p>
                      </div>
                    </div>
                    <Timeline space={s} />
                  </article>
                ))}
              <div className="closing-note">
                <ShieldCheck size={21} />
                <div>
                  <strong>
                    Resolvido é o começo de um novo acompanhamento.
                  </strong>
                  <p>
                    A população pode confirmar se o cuidado permanece e informar
                    uma nova necessidade.
                  </p>
                </div>
                <Link className="text-link" to="/cidadao">
                  Ver mapa do cuidado <ArrowRight size={16} />
                </Link>
              </div>
            </>
          )}
        </main>
      )}
      <footer>
        <span className="footer-brand">
          <MapPin size={16} /> mapa vivo <b>RECIFE</b>
        </span>
        <p>
          O Mapa Vivo analisa territórios e eventos, não perfis individuais.
          {citizen && (
            <>
              <br />
              Nenhuma informação pessoal ou ocorrência sensível é exibida.
            </>
          )}
        </p>
        <span>PROTÓTIPO CONCEITUAL · RECIFE</span>
      </footer>
      {toast && (
        <div role="status" className="toast">
          <CheckCircle2 size={20} />
          <span>{toast}</span>
          <button aria-label="Fechar aviso" onClick={() => setToast("")}>
            <X size={16} />
          </button>
        </div>
      )}
      {modal === "sources" && (
        <Modal
          title="A cidade já produz os sinais."
          onClose={() => setModal(null)}
        >
          <p className="modal-lead">
            O Mapa Vivo faz esses sinais conversarem.
          </p>
          <div className="sources-grid">
            {[
              ["156 / Conecta Recife", "Percepção do cidadão"],
              ["Emlurb", "Execução e manutenção"],
              ["Dados Vivos", "Sinais recentes"],
              ["ESIG", "Praças, parques e território"],
              ["Guarda Municipal", "Ocorrências operacionais"],
              ["COP", "Coordenação"],
            ].map(([a, b]) => (
              <div key={a}>
                <Network size={18} />
                <strong>{a}</strong>
                <span>↓ {b}</span>
              </div>
            ))}
          </div>
          <div className="converge">
            ↓ ↓ ↓
            <strong>
              <MapPin size={23} /> MAPA VIVO RECIFE
            </strong>
            <span>↓ Gestão · Órgãos · Cidadão</span>
          </div>
          <p className="small-note">
            Integrações conceituais. Este protótipo usa somente dados simulados,
            sem conexão com sistemas municipais.
          </p>
        </Modal>
      )}
      {modal === "compare" && (
        <Modal
          title="A mesma criticidade. Prioridades diferentes."
          onClose={() => setModal(null)}
        >
          <p className="modal-lead">
            A condição do espaço e a ordem do atendimento respondem a perguntas
            diferentes.
          </p>
          <div className="compare-grid">
            {[spaces[2], spaces[1]].map((s, i) => (
              <div key={s.id}>
                <span className="eyebrow">ESPAÇO {i === 0 ? "A" : "B"}</span>
                <h3>{s.name}</h3>
                <span className="badge critical">
                  ◆ Crítico no cenário inicial
                </span>
                <strong className="compare-priority">{s.priority}</strong>
                <p>
                  Persistência <b>{s.persistence}h</b>
                </p>
                <p>
                  Pessoas potencialmente afetadas <b>{s.people}</b>
                </p>
                <p>
                  Tempo aguardando <b>{s.waitHours}h</b>
                </p>
                <p>
                  Cobertura histórica de serviços{" "}
                  <b>{i === 0 ? "Regular" : "Menor atendimento"}</b>
                </p>
              </div>
            ))}
          </div>
          <div className="equity-explanation">
            <Users size={20} />
            <p>
              Equidade é considerada para evitar que territórios historicamente
              menos atendidos permaneçam invisíveis. Renda não é usada como
              indicador de degradação.
            </p>
          </div>
          <p className="small-note">
            Prioridades ilustrativas, sem cálculo automatizado.
          </p>
        </Modal>
      )}
      {modal === "report" && (
        <Modal
          title={sent ? "Recebemos." : "O que precisa de cuidado?"}
          onClose={() => setModal(null)}
        >
          {sent ? (
            <div className="report-success">
              <CheckCircle2 size={48} />
              <span className="badge active">✓ Status: Recebido</span>
              <p>
                Você não precisa descobrir qual órgão é responsável. O Mapa Vivo
                conecta o registro ao território e direciona a informação.
              </p>
              <button className="primary wide" onClick={() => setModal(null)}>
                Voltar ao mapa <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="report-options">
                {[
                  "Limpeza",
                  "Iluminação",
                  "Mobiliário",
                  "Dano no espaço",
                  "Outro",
                ].map((t) => (
                  <button
                    className={reportType === t ? "chosen" : ""}
                    key={t}
                    onClick={() => setReportType(t)}
                  >
                    {t === "Iluminação" ? (
                      <Zap />
                    ) : t === "Limpeza" ? (
                      <Leaf />
                    ) : (
                      <MapPin />
                    )}
                    {t}
                  </button>
                ))}
              </div>
              <h3>É neste local?</h3>
              <CityMap
                spaces={[selected]}
                selected={selected}
                onSelect={() => {}}
                mini
              />
              <p className="report-location">
                <MapPin size={16} />
                {selected.name} · localização simulada
              </p>
              <button
                className="primary wide"
                onClick={() => {
                  update(selectedId, (s) => ({
                    ...s,
                    issues: [...new Set([...s.issues, reportType])],
                    status: s.status === "stable" ? "attention" : s.status,
                    recentEvents: [
                      ...s.recentEvents,
                      {
                        id: crypto.randomUUID(),
                        category: reportType,
                        description: `Registro cidadão simulado: ${reportType}`,
                        time: now(),
                        simulated: true,
                      },
                    ],
                    lastUpdated: now(),
                  }));
                  setSent(true);
                }}
              >
                Confirmar e enviar <ArrowRight size={17} />
              </button>
            </>
          )}
        </Modal>
      )}
      {modal === "result" && (
        <Modal title="Registrar resultado" onClose={() => setModal(null)}>
          <p className="modal-lead">{selected.name}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              complete();
            }}
          >
            <label className="form-label">
              Ação executada
              <input
                required
                maxLength={120}
                value={actionText}
                onChange={(e) => setActionText(e.target.value)}
                placeholder="Ex.: Iluminação restaurada"
              />
            </label>
            <label className="form-label">
              Observação curta
              <textarea
                maxLength={280}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Conte o que mudou neste espaço."
              />
            </label>
            <label className="photo-check">
              <input
                type="checkbox"
                checked={photo}
                onChange={(e) => setPhoto(e.target.checked)}
              />{" "}
              Incluir foto simulada (opcional)
            </label>
            {photo && (
              <div className="simulated-photo">
                <Leaf size={32} />
                <span>ESPAÇO CUIDADO · IMAGEM SIMULADA</span>
              </div>
            )}
            <button type="submit" className="primary wide">
              Concluir intervenção <CheckCircle2 size={17} />
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
export default App;
