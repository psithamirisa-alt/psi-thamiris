import { useState } from "react";

const COLORS = {
  grad1: "linear-gradient(135deg, #a855f7 0%, #7c3aed 40%, #4f86c6 100%)",
  grad2: "linear-gradient(135deg, #c084fc 0%, #a855f7 100%)",
  purple: "#7c3aed",
  purpleLight: "#a855f7",
  purplePale: "#f3e8ff",
  blue: "#4f86c6",
  bg: "#f8f5ff",
  white: "#ffffff",
  text: "#1e1b2e",
  muted: "#7c6f9a",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#f59e0b",
};

const initialPatients = [
  { id: 1, name: "Vanessa Hersbach", phone: "85999990001", nextSession: "2026-06-01", value: 180, status: "ativo", notes: "Ansiedade e relacionamentos. Primeira vez em terapia.", sessions: [] },
  { id: 2, name: "João Mendes", phone: "85999990002", nextSession: "2026-06-01", value: 180, status: "ativo", notes: "Luto e autoconhecimento.", sessions: [] },
  { id: 3, name: "Livia Esteves", phone: "85999990003", nextSession: "2026-06-01", value: 200, status: "ativo", notes: "Burnout profissional.", sessions: [] },
  { id: 4, name: "Arthur Pinheiro", phone: "85999990004", nextSession: "2026-06-01", value: 180, status: "ativo", notes: "Questões familiares.", sessions: [] },
  { id: 5, name: "Louis Phelippe", phone: "85999990005", nextSession: "2026-06-02", value: 160, status: "ativo", notes: "Depressão leve.", sessions: [] },
];

const initialSessions = [
  { id: 1, patientId: 1, date: "2026-05-26", time: "09:00", status: "confirmada", paid: true },
  { id: 2, patientId: 2, date: "2026-05-26", time: "10:00", status: "confirmada", paid: false },
  { id: 3, patientId: 3, date: "2026-05-27", time: "14:00", status: "pendente", paid: false },
  { id: 4, patientId: 4, date: "2026-05-28", time: "15:00", status: "pendente", paid: false },
  { id: 5, patientId: 5, date: "2026-05-29", time: "11:00", status: "confirmada", paid: true },
];

function Avatar({ name, size = 40 }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const hue = name.charCodeAt(0) * 7 % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `hsl(${hue}, 60%, 75%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: `hsl(${hue}, 60%, 30%)`,
      flexShrink: 0, fontFamily: "Nunito, sans-serif",
    }}>{initials}</div>
  );
}

function Header({ title, onMenu, onBack, backLabel }) {
  return (
    <div style={{
      background: COLORS.grad1,
      padding: "20px 20px 28px",
      borderRadius: "0 0 28px 28px",
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 8px 32px rgba(124,58,237,0.25)",
    }}>
      {onBack ? (
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: "8px 14px", color: "#fff", cursor: "pointer", fontSize: 14, fontFamily: "Nunito, sans-serif" }}>
          ← {backLabel || "Voltar"}
        </button>
      ) : (
        <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", fontFamily: "Nunito, sans-serif", flex: 1 }}>
          🧠 Psi.app
        </div>
      )}
      <div style={{ flex: 1, color: "#fff", fontWeight: 700, fontSize: 16, fontFamily: "Nunito, sans-serif", textAlign: onBack ? "center" : "right" }}>
        {onBack ? title : ""}
      </div>
      {onMenu && (
        <button onClick={onMenu} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 12, padding: 10, cursor: "pointer", color: "#fff", fontSize: 18 }}>☰</button>
      )}
    </div>
  );
}

function NavBar({ active, setActive }) {
  const tabs = [
    { id: "pacientes", icon: "👥", label: "Pacientes" },
    { id: "agenda", icon: "📅", label: "Agenda" },
    { id: "financeiro", icon: "💰", label: "Financeiro" },
    { id: "sessao", icon: "🧠", label: "Sessão IA" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, maxWidth: 480, margin: "0 auto",
      background: "#fff", borderTop: "1px solid #ede9fe",
      display: "flex", boxShadow: "0 -4px 20px rgba(124,58,237,0.1)",
      zIndex: 100,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)} style={{
          flex: 1, border: "none", background: "none", padding: "12px 0 10px",
          cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
        }}>
          <span style={{ fontSize: 22 }}>{t.icon}</span>
          <span style={{ fontSize: 11, color: active === t.id ? COLORS.purple : COLORS.muted, fontWeight: active === t.id ? 700 : 400, fontFamily: "Nunito, sans-serif" }}>
            {t.label}
          </span>
          {active === t.id && <div style={{ width: 20, height: 3, borderRadius: 2, background: COLORS.purpleLight }} />}
        </button>
      ))}
    </div>
  );
}

// ── PACIENTES ──────────────────────────────────────────
function PatientsScreen({ patients, setPatients, sessions }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newP, setNewP] = useState({ name: "", phone: "", value: "", notes: "" });

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  function daysUntil(dateStr) {
    const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    return diff;
  }

  function addPatient() {
    if (!newP.name) return;
    setPatients(prev => [...prev, { ...newP, id: Date.now(), status: "ativo", value: Number(newP.value) || 0, sessions: [], nextSession: "" }]);
    setNewP({ name: "", phone: "", value: "", notes: "" });
    setAdding(false);
  }

  if (selected) {
    const patSessions = sessions.filter(s => s.patientId === selected.id);
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, paddingBottom: 80 }}>
        <Header title={selected.name} onBack={() => setSelected(null)} backLabel="Pacientes" />
        <div style={{ padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(124,58,237,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <Avatar name={selected.name} size={56} />
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: COLORS.text, fontFamily: "Nunito, sans-serif" }}>{selected.name}</div>
                <div style={{ color: COLORS.muted, fontSize: 14, fontFamily: "Nunito, sans-serif" }}>📱 {selected.phone}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: COLORS.purplePale, borderRadius: 12, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: COLORS.purple, fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>VALOR/SESSÃO</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.purple, fontFamily: "Nunito, sans-serif" }}>R$ {selected.value}</div>
              </div>
              <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "10px 14px" }}>
                <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 700, fontFamily: "Nunito, sans-serif" }}>STATUS</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.green, fontFamily: "Nunito, sans-serif", textTransform: "capitalize" }}>{selected.status}</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: 20, marginBottom: 16, boxShadow: "0 2px 12px rgba(124,58,237,0.08)" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 10, fontFamily: "Nunito, sans-serif" }}>📝 Prontuário / Anotações</div>
            <textarea
              defaultValue={selected.notes}
              rows={5}
              style={{ width: "100%", border: "1.5px solid #ede9fe", borderRadius: 12, padding: 12, fontSize: 14, fontFamily: "Nunito, sans-serif", color: COLORS.text, resize: "none", outline: "none", boxSizing: "border-box" }}
              placeholder="Anotações clínicas, histórico, observações..."
            />
          </div>

          <div style={{ background: "#fff", borderRadius: 20, padding: 20, boxShadow: "0 2px 12px rgba(124,58,237,0.08)" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 12, fontFamily: "Nunito, sans-serif" }}>📋 Sessões</div>
            {patSessions.length === 0 ? (
              <div style={{ color: COLORS.muted, fontSize: 14, textAlign: "center", padding: 20, fontFamily: "Nunito, sans-serif" }}>Nenhuma sessão registrada</div>
            ) : patSessions.map(s => (
              <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3e8ff" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.text, fontFamily: "Nunito, sans-serif" }}>{s.date} · {s.time}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "Nunito, sans-serif" }}>{s.status}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.paid ? COLORS.green : COLORS.red, background: s.paid ? "#f0fdf4" : "#fef2f2", padding: "4px 10px", borderRadius: 20, fontFamily: "Nunito, sans-serif" }}>
                  {s.paid ? "Pago" : "Pendente"}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <a href={`https://wa.me/55${selected.phone}`} target="_blank" rel="noreferrer" style={{
              flex: 1, background: "#25D366", color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontWeight: 700, fontSize: 14,
              textAlign: "center", textDecoration: "none", fontFamily: "Nunito, sans-serif",
            }}>💬 WhatsApp</a>
            <button style={{ flex: 1, background: COLORS.grad2, color: "#fff", border: "none", borderRadius: 14, padding: "14px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
              📅 Agendar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (adding) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, paddingBottom: 80 }}>
        <Header title="Nova Paciente" onBack={() => setAdding(false)} backLabel="Cancelar" />
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { label: "Nome completo *", key: "name", placeholder: "Ex: Maria Silva" },
            { label: "Telefone (WhatsApp)", key: "phone", placeholder: "Ex: 85999990000" },
            { label: "Valor da sessão (R$)", key: "value", placeholder: "Ex: 180", type: "number" },
          ].map(f => (
            <div key={f.key}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.purple, marginBottom: 6, fontFamily: "Nunito, sans-serif" }}>{f.label}</div>
              <input
                type={f.type || "text"}
                placeholder={f.placeholder}
                value={newP[f.key]}
                onChange={e => setNewP(p => ({ ...p, [f.key]: e.target.value }))}
                style={{ width: "100%", border: "1.5px solid #ede9fe", borderRadius: 12, padding: "12px 14px", fontSize: 14, fontFamily: "Nunito, sans-serif", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          ))}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.purple, marginBottom: 6, fontFamily: "Nunito, sans-serif" }}>Anotações iniciais</div>
            <textarea
              rows={4}
              placeholder="Queixa principal, histórico..."
              value={newP.notes}
              onChange={e => setNewP(p => ({ ...p, notes: e.target.value }))}
              style={{ width: "100%", border: "1.5px solid #ede9fe", borderRadius: 12, padding: "12px 14px", fontSize: 14, fontFamily: "Nunito, sans-serif", outline: "none", resize: "none", boxSizing: "border-box" }}
            />
          </div>
          <button onClick={addPatient} style={{ background: COLORS.grad1, color: "#fff", border: "none", borderRadius: 14, padding: "16px", fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "Nunito, sans-serif", marginTop: 8 }}>
            + Adicionar Paciente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, paddingBottom: 80 }}>
      <Header onMenu={() => {}} />
      <div style={{ padding: "0 16px", marginTop: -12 }}>
        <div style={{ background: "#fff", borderRadius: 16, display: "flex", alignItems: "center", padding: "12px 16px", boxShadow: "0 2px 12px rgba(124,58,237,0.1)", marginBottom: 16 }}>
          <span style={{ marginRight: 10, fontSize: 18 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar paciente..."
            style={{ border: "none", outline: "none", flex: 1, fontSize: 15, fontFamily: "Nunito, sans-serif", color: COLORS.text }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.text, fontFamily: "Nunito, sans-serif" }}>
            Pacientes ativos <span style={{ color: COLORS.muted, fontWeight: 400 }}>({filtered.length})</span>
          </div>
          <button onClick={() => setAdding(true)} style={{
            background: COLORS.grad2, color: "#fff", border: "none", borderRadius: 20, padding: "8px 16px",
            fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Nunito, sans-serif",
          }}>+ Adicionar</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(p => {
            const days = daysUntil(p.nextSession);
            return (
              <div key={p.id} onClick={() => setSelected(p)} style={{
                background: "#fff", borderRadius: 18, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 14,
                boxShadow: "0 2px 10px rgba(124,58,237,0.07)",
                cursor: "pointer", transition: "transform 0.15s",
              }}>
                <Avatar name={p.name} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, fontFamily: "Nunito, sans-serif" }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, fontFamily: "Nunito, sans-serif" }}>
                    {p.nextSession ? `● Próxima sessão em ${days} dia${days !== 1 ? "s" : ""}` : "Sem sessão agendada"}
                  </div>
                </div>
                <a href={`https://wa.me/55${p.phone}`} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer"
                  style={{ background: "#25D366", borderRadius: 12, padding: "8px 10px", fontSize: 18, textDecoration: "none" }}>💬</a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── AGENDA ─────────────────────────────────────────────
function AgendaScreen({ patients, sessions, setSessions }) {
  const [selectedDate, setSelectedDate] = useState("2026-05-26");
  const daySessions = sessions.filter(s => s.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));

  const days = ["2026-05-26", "2026-05-27", "2026-05-28", "2026-05-29", "2026-05-30", "2026-05-31", "2026-06-01"];
  const dayLabels = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const dayNums = [26, 27, 28, 29, 30, 31, 1];

  function confirmSession(id) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, status: "confirmada" } : s));
  }

  function sendConfirmation(session) {
    const patient = patients.find(p => p.id === session.patientId);
    if (!patient) return;
    const msg = encodeURIComponent(`Olá, ${patient.name.split(" ")[0]}! 🤍\n\nPassando para confirmar sua sessão:\n📅 ${session.date} às ${session.time}\n\nVocê confirma presença?`);
    window.open(`https://wa.me/55${patient.phone}?text=${msg}`, "_blank");
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, paddingBottom: 80 }}>
      <div style={{ background: COLORS.grad1, padding: "20px 20px 28px", borderRadius: "0 0 28px 28px", boxShadow: "0 8px 32px rgba(124,58,237,0.25)" }}>
        <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", fontFamily: "Nunito, sans-serif", marginBottom: 16 }}>📅 Agenda</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {days.map((d, i) => (
            <button key={d} onClick={() => setSelectedDate(d)} style={{
              flexShrink: 0, background: selectedDate === d ? "#fff" : "rgba(255,255,255,0.2)",
              border: "none", borderRadius: 14, padding: "10px 14px", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            }}>
              <span style={{ fontSize: 11, color: selectedDate === d ? COLORS.purple : "#fff", fontWeight: 600, fontFamily: "Nunito, sans-serif" }}>{dayLabels[i]}</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: selectedDate === d ? COLORS.purple : "#fff", fontFamily: "Nunito, sans-serif" }}>{dayNums[i]}</span>
              {sessions.filter(s => s.date === d).length > 0 && (
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: selectedDate === d ? COLORS.purpleLight : "rgba(255,255,255,0.8)" }} />
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {daySessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.muted, fontFamily: "Nunito, sans-serif" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🌿</div>
            <div style={{ fontWeight: 600 }}>Nenhuma sessão neste dia</div>
          </div>
        ) : daySessions.map(s => {
          const patient = patients.find(p => p.id === s.patientId);
          return (
            <div key={s.id} style={{
              background: "#fff", borderRadius: 18, padding: 16, marginBottom: 12,
              boxShadow: "0 2px 10px rgba(124,58,237,0.07)",
              borderLeft: `4px solid ${s.status === "confirmada" ? COLORS.green : COLORS.yellow}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                {patient && <Avatar name={patient.name} size={44} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, fontFamily: "Nunito, sans-serif" }}>{patient?.name}</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, fontFamily: "Nunito, sans-serif" }}>🕐 {s.time} · R$ {patient?.value}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.status === "confirmada" ? COLORS.green : COLORS.yellow, background: s.status === "confirmada" ? "#f0fdf4" : "#fffbeb", padding: "4px 10px", borderRadius: 20, fontFamily: "Nunito, sans-serif" }}>
                  {s.status === "confirmada" ? "✓ Confirmada" : "Pendente"}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => sendConfirmation(s)} style={{ flex: 1, background: "#25D366", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
                  💬 Confirmar
                </button>
                {s.status !== "confirmada" && (
                  <button onClick={() => confirmSession(s.id)} style={{ flex: 1, background: COLORS.purplePale, color: COLORS.purple, border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
                    ✓ Marcar confirmada
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── FINANCEIRO ─────────────────────────────────────────
function FinanceiroScreen({ patients, sessions, setSessions }) {
  const [tab, setTab] = useState("resumo");

  const totalMes = sessions.filter(s => s.paid).reduce((acc, s) => {
    const p = patients.find(pt => pt.id === s.patientId);
    return acc + (p?.value || 0);
  }, 0);

  const pendente = sessions.filter(s => !s.paid).reduce((acc, s) => {
    const p = patients.find(pt => pt.id === s.patientId);
    return acc + (p?.value || 0);
  }, 0);

  function markPaid(id) {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, paid: true } : s));
  }

  function sendCharge(session) {
    const patient = patients.find(p => p.id === session.patientId);
    if (!patient) return;
    const msg = encodeURIComponent(`Olá, ${patient.name.split(" ")[0]}! 🤍\n\nPassando para lembrar sobre o pagamento da sessão de ${session.date}.\n\n💰 Valor: R$ ${patient.value}\n\nChave Pix: [SUA CHAVE]\n\nObrigada! 🌿`);
    window.open(`https://wa.me/55${patient.phone}?text=${msg}`, "_blank");
  }

  const unpaid = sessions.filter(s => !s.paid);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, paddingBottom: 80 }}>
      <div style={{ background: COLORS.grad1, padding: "20px 20px 28px", borderRadius: "0 0 28px 28px", boxShadow: "0 8px 32px rgba(124,58,237,0.25)" }}>
        <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", fontFamily: "Nunito, sans-serif", marginBottom: 16 }}>💰 Financeiro</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600, fontFamily: "Nunito, sans-serif" }}>RECEBIDO / MÊS</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: "Nunito, sans-serif" }}>R$ {totalMes}</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 16, padding: "14px 16px" }}>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600, fontFamily: "Nunito, sans-serif" }}>A RECEBER</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: "Nunito, sans-serif" }}>R$ {pendente}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", background: "#fff", borderRadius: 14, padding: 4, marginBottom: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.08)" }}>
          {["resumo", "pendentes"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, border: "none", borderRadius: 10, padding: "10px",
              background: tab === t ? COLORS.grad2 : "transparent",
              color: tab === t ? "#fff" : COLORS.muted,
              fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Nunito, sans-serif",
            }}>
              {t === "resumo" ? "📊 Resumo" : `⚠️ Pendentes (${unpaid.length})`}
            </button>
          ))}
        </div>

        {tab === "resumo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {patients.map(p => {
              const pSessions = sessions.filter(s => s.patientId === p.id);
              const paid = pSessions.filter(s => s.paid).length;
              const total = pSessions.length;
              return (
                <div key={p.id} style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Avatar name={p.name} size={40} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, fontFamily: "Nunito, sans-serif" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "Nunito, sans-serif" }}>{paid}/{total} sessões pagas · R$ {p.value}/sessão</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.purple, fontFamily: "Nunito, sans-serif" }}>
                      R$ {paid * p.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "pendentes" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {unpaid.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: COLORS.muted, fontFamily: "Nunito, sans-serif" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                <div style={{ fontWeight: 600 }}>Tudo em dia!</div>
              </div>
            ) : unpaid.map(s => {
              const patient = patients.find(p => p.id === s.patientId);
              return (
                <div key={s.id} style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.07)", borderLeft: `4px solid ${COLORS.red}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    {patient && <Avatar name={patient.name} size={40} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, fontFamily: "Nunito, sans-serif" }}>{patient?.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "Nunito, sans-serif" }}>Sessão {s.date} · {s.time}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: COLORS.red, fontFamily: "Nunito, sans-serif" }}>R$ {patient?.value}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => sendCharge(s)} style={{ flex: 1, background: "#25D366", color: "#fff", border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
                      💬 Cobrar
                    </button>
                    <button onClick={() => markPaid(s.id)} style={{ flex: 1, background: COLORS.purplePale, color: COLORS.purple, border: "none", borderRadius: 10, padding: "10px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "Nunito, sans-serif" }}>
                      ✓ Marcar pago
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── SESSÃO IA ──────────────────────────────────────────
function SessaoIAScreen({ patients }) {
  const [selectedPatient, setSelectedPatient] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("sala");

  function generateMeetLink() {
    const code = Math.random().toString(36).substring(2, 5) + "-" + Math.random().toString(36).substring(2, 7) + "-" + Math.random().toString(36).substring(2, 5);
    setMeetLink(`https://meet.google.com/${code}`);
  }

  async function analyzeTranscript() {
    if (!transcript.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const patient = patients.find(p => p.id === Number(selectedPatient));
      const patientName = patient ? patient.name : "paciente";

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Você é um assistente clínico para psicólogos. Analise transcrições de sessões terapêuticas e retorne APENAS um JSON válido, sem texto adicional, sem markdown, sem blocos de código. O JSON deve ter exatamente esta estrutura:
{
  "resumo": "resumo clínico objetivo em 3-4 frases",
  "temasPrincipais": ["tema1", "tema2", "tema3"],
  "emocoes": ["emoção1", "emoção2"],
  "pontosCriticos": ["ponto importante 1", "ponto importante 2"],
  "sugestoesProximaSessao": ["sugestão 1", "sugestão 2"],
  "notaProntuario": "texto pronto para inserir no prontuário, em linguagem clínica"
}`,
          messages: [{
            role: "user",
            content: `Analise esta transcrição de sessão com ${patientName}:\n\n${transcript}`
          }]
        })
      });

      const data = await response.json();
      const text = data.content?.map(i => i.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setResult({ error: "Erro ao analisar. Verifique a transcrição e tente novamente." });
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, paddingBottom: 80 }}>
      <div style={{ background: COLORS.grad1, padding: "20px 20px 28px", borderRadius: "0 0 28px 28px", boxShadow: "0 8px 32px rgba(124,58,237,0.25)" }}>
        <div style={{ fontWeight: 800, fontSize: 20, color: "#fff", fontFamily: "Nunito, sans-serif", marginBottom: 4 }}>🧠 Sessão + IA</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontFamily: "Nunito, sans-serif" }}>Sala de atendimento e análise clínica</div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Tabs */}
        <div style={{ display: "flex", background: "#fff", borderRadius: 14, padding: 4, marginBottom: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.08)" }}>
          {[["sala", "🎥 Sala"], ["ia", "🤖 Análise IA"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              flex: 1, border: "none", borderRadius: 10, padding: "10px",
              background: tab === id ? COLORS.grad2 : "transparent",
              color: tab === id ? "#fff" : COLORS.muted,
              fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Nunito, sans-serif",
            }}>{label}</button>
          ))}
        </div>

        {/* Selecionar paciente */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 14, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.purple, marginBottom: 8, fontFamily: "Nunito, sans-serif" }}>PACIENTE DA SESSÃO</div>
          <select
            value={selectedPatient}
            onChange={e => setSelectedPatient(e.target.value)}
            style={{ width: "100%", border: "1.5px solid #ede9fe", borderRadius: 12, padding: "10px 14px", fontSize: 14, fontFamily: "Nunito, sans-serif", color: COLORS.text, outline: "none", background: "#fff" }}
          >
            <option value="">Selecionar paciente...</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        {/* SALA */}
        {tab === "sala" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.purple, marginBottom: 12, fontFamily: "Nunito, sans-serif" }}>🎥 SALA DE VIDEOCHAMADA</div>

              <button onClick={generateMeetLink} style={{
                width: "100%", background: COLORS.grad1, color: "#fff", border: "none",
                borderRadius: 14, padding: "14px", fontWeight: 800, fontSize: 15,
                cursor: "pointer", fontFamily: "Nunito, sans-serif", marginBottom: 12,
              }}>
                ✨ Gerar link Google Meet
              </button>

              {meetLink && (
                <div>
                  <div style={{ background: COLORS.purplePale, borderRadius: 12, padding: "12px 14px", marginBottom: 10, wordBreak: "break-all", fontSize: 13, color: COLORS.purple, fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                    {meetLink}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={meetLink} target="_blank" rel="noreferrer" style={{
                      flex: 1, background: "#4285F4", color: "#fff", border: "none", borderRadius: 12,
                      padding: "12px", fontWeight: 700, fontSize: 14, textAlign: "center",
                      textDecoration: "none", fontFamily: "Nunito, sans-serif",
                    }}>
                      📹 Entrar na sala
                    </a>
                    <button onClick={() => {
                      const patient = patients.find(p => p.id === Number(selectedPatient));
                      if (!patient) return alert("Selecione uma paciente primeiro");
                      const msg = encodeURIComponent(`Olá, ${patient.name.split(" ")[0]}! 🤍\n\nAqui está o link para nossa sessão:\n${meetLink}\n\nTe vejo em breve! 🌿`);
                      window.open(`https://wa.me/55${patient.phone}?text=${msg}`, "_blank");
                    }} style={{
                      flex: 1, background: "#25D366", color: "#fff", border: "none", borderRadius: 12,
                      padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Nunito, sans-serif",
                    }}>
                      💬 Enviar link
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, marginBottom: 8, fontFamily: "Nunito, sans-serif" }}>💡 DICA</div>
              <div style={{ fontSize: 13, color: COLORS.muted, lineHeight: 1.6, fontFamily: "Nunito, sans-serif" }}>
                Após a sessão, ative a <strong>transcrição automática</strong> do Google Meet (Atividades → Transcrição). Cole o texto gerado na aba <strong>Análise IA</strong> para gerar o resumo clínico automaticamente.
              </div>
            </div>
          </div>
        )}

        {/* ANÁLISE IA */}
        {tab === "ia" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.purple, marginBottom: 8, fontFamily: "Nunito, sans-serif" }}>📋 COLE A TRANSCRIÇÃO DA SESSÃO</div>
              <textarea
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                rows={8}
                placeholder="Cole aqui a transcrição gerada pelo Google Meet ou Zoom..."
                style={{ width: "100%", border: "1.5px solid #ede9fe", borderRadius: 12, padding: "12px 14px", fontSize: 13, fontFamily: "Nunito, sans-serif", color: COLORS.text, resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }}
              />
              <button
                onClick={analyzeTranscript}
                disabled={loading || !transcript.trim()}
                style={{
                  width: "100%", background: loading || !transcript.trim() ? "#e0d7f5" : COLORS.grad1,
                  color: loading || !transcript.trim() ? COLORS.muted : "#fff",
                  border: "none", borderRadius: 14, padding: "14px",
                  fontWeight: 800, fontSize: 15, cursor: loading || !transcript.trim() ? "default" : "pointer",
                  fontFamily: "Nunito, sans-serif", marginTop: 12,
                }}
              >
                {loading ? "🔄 Analisando..." : "🧠 Analisar com IA"}
              </button>
            </div>

            {result && !result.error && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Resumo */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.purple, marginBottom: 8, fontFamily: "Nunito, sans-serif" }}>📝 RESUMO CLÍNICO</div>
                  <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6, fontFamily: "Nunito, sans-serif" }}>{result.resumo}</div>
                </div>

                {/* Temas e Emoções */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div style={{ background: "#fff", borderRadius: 16, padding: 14, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.purple, marginBottom: 8, fontFamily: "Nunito, sans-serif" }}>🗣️ TEMAS</div>
                    {result.temasPrincipais?.map((t, i) => (
                      <div key={i} style={{ fontSize: 12, background: COLORS.purplePale, color: COLORS.purple, padding: "4px 10px", borderRadius: 20, marginBottom: 4, fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>{t}</div>
                    ))}
                  </div>
                  <div style={{ background: "#fff", borderRadius: 16, padding: 14, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 8, fontFamily: "Nunito, sans-serif" }}>💛 EMOÇÕES</div>
                    {result.emocoes?.map((e, i) => (
                      <div key={i} style={{ fontSize: 12, background: "#fffbeb", color: "#92400e", padding: "4px 10px", borderRadius: 20, marginBottom: 4, fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>{e}</div>
                    ))}
                  </div>
                </div>

                {/* Pontos críticos */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.red, marginBottom: 8, fontFamily: "Nunito, sans-serif" }}>⚠️ PONTOS DE ATENÇÃO</div>
                  {result.pontosCriticos?.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: COLORS.red, fontSize: 14 }}>•</span>
                      <span style={{ fontSize: 13, color: COLORS.text, fontFamily: "Nunito, sans-serif", lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>

                {/* Próxima sessão */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.green, marginBottom: 8, fontFamily: "Nunito, sans-serif" }}>🌿 SUGESTÕES PRÓXIMA SESSÃO</div>
                  {result.sugestoesProximaSessao?.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: COLORS.green, fontSize: 14 }}>→</span>
                      <span style={{ fontSize: 13, color: COLORS.text, fontFamily: "Nunito, sans-serif", lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>

                {/* Nota prontuário */}
                <div style={{ background: "#fff", borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(124,58,237,0.07)" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.purple, marginBottom: 8, fontFamily: "Nunito, sans-serif" }}>📋 NOTA PARA O PRONTUÁRIO</div>
                  <div style={{ background: COLORS.purplePale, borderRadius: 12, padding: "12px 14px", fontSize: 13, color: COLORS.text, lineHeight: 1.6, fontFamily: "Nunito, sans-serif" }}>
                    {result.notaProntuario}
                  </div>
                  <button onClick={() => navigator.clipboard?.writeText(result.notaProntuario)} style={{
                    width: "100%", background: COLORS.purplePale, color: COLORS.purple, border: "none",
                    borderRadius: 12, padding: "10px", fontWeight: 700, fontSize: 13,
                    cursor: "pointer", fontFamily: "Nunito, sans-serif", marginTop: 10,
                  }}>
                    📋 Copiar nota
                  </button>
                </div>
              </div>
            )}

            {result?.error && (
              <div style={{ background: "#fef2f2", borderRadius: 16, padding: 16, color: COLORS.red, fontFamily: "Nunito, sans-serif", fontSize: 14 }}>
                ⚠️ {result.error}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── APP ROOT ───────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("pacientes");
  const [patients, setPatients] = useState(initialPatients);
  const [sessions, setSessions] = useState(initialSessions);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", position: "relative", fontFamily: "Nunito, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');`}</style>
      {screen === "pacientes" && <PatientsScreen patients={patients} setPatients={setPatients} sessions={sessions} />}
      {screen === "agenda" && <AgendaScreen patients={patients} sessions={sessions} setSessions={setSessions} />}
      {screen === "financeiro" && <FinanceiroScreen patients={patients} sessions={sessions} setSessions={setSessions} />}
      {screen === "sessao" && <SessaoIAScreen patients={patients} />}
      <NavBar active={screen} setActive={setScreen} />
    </div>
  );
}
