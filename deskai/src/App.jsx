import { useState, useEffect, useRef } from "react";

// ─── Inline styles (no Tailwind dependency beyond basics) ──────────────────
const COLORS = {
  bg: "#0a0d14",
  surface: "#111827",
  surfaceHover: "#1a2236",
  border: "#1e2d45",
  accent: "#3b82f6",
  accentGlow: "rgba(59,130,246,0.25)",
  accentHover: "#60a5fa",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  text: "#f1f5f9",
  muted: "#64748b",
  subtle: "#94a3b8",
};

const PRIORITY_CONFIG = {
  Low: { color: "#10b981", bg: "rgba(16,185,129,0.12)", label: "Low" },
  Medium: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: "Medium" },
  High: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", label: "High" },
};

const STATUS_CONFIG = {
  Open: { color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  "In Progress": { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  Resolved: { color: "#10b981", bg: "rgba(16,185,129,0.12)" },
  Closed: { color: "#64748b", bg: "rgba(100,116,139,0.12)" },
};

// ─── Reusable Components ────────────────────────────────────────────────────

function Badge({ label, color, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      color, background: bg, border: `1px solid ${color}33`,
      fontFamily: "'DM Mono', monospace",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
      {label}
    </span>
  );
}

function StatCard({ icon, label, value, color, delta }) {
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 16, padding: "20px 24px",
      display: "flex", flexDirection: "column", gap: 8,
      transition: "border-color .2s, box-shadow .2s",
      boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 26 }}>{icon}</span>
        {delta !== undefined && (
          <span style={{ fontSize: 12, color: delta >= 0 ? COLORS.success : COLORS.danger, fontWeight: 600 }}>
            {delta >= 0 ? "+" : ""}{delta}%
          </span>
        )}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: color || COLORS.text, fontFamily: "'DM Mono', monospace", letterSpacing: -1 }}>
        {value}
      </div>
      <div style={{ fontSize: 13, color: COLORS.muted, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: COLORS.accent,
          animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.2;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }`}</style>
    </div>
  );
}

// ─── Auth Pages ─────────────────────────────────────────────────────────────

function AuthPage({ mode, users, setUsers, onLogin, onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) return setError("All fields are required.");
    if (password.length < 6) return setError("Password must be 6+ characters.");

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    if (isLogin) {
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) { setLoading(false); return setError("Invalid credentials."); }
      onLogin(found);
    } else {
      if (users.find(u => u.email === email)) { setLoading(false); return setError("Email already registered."); }
      const newUser = { email, password, name: email.split("@")[0], role: "Agent", avatar: email[0].toUpperCase(), joinedAt: new Date().toISOString() };
      setUsers(prev => [...prev, newUser]);
      onLogin(newUser);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: COLORS.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Syne', sans-serif",
      backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #475569; }
        input:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111827; }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 3px; }
      `}</style>

      <div style={{ width: 420, padding: 24 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, borderRadius: 16, marginBottom: 16,
            background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            boxShadow: "0 8px 32px rgba(59,130,246,0.4)",
            fontSize: 26,
          }}>🎯</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: COLORS.text, letterSpacing: -0.5 }}>DeskAI</div>
          <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>AI-Powered IT Support Platform</div>
        </div>

        {/* Card */}
        <div style={{
          background: COLORS.surface, border: `1px solid ${COLORS.border}`,
          borderRadius: 20, padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 6 }}>
            {isLogin ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ fontSize: 14, color: COLORS.muted, marginBottom: 28 }}>
            {isLogin ? "Sign in to your workspace" : "Join your team's helpdesk"}
          </p>

          {[
            { label: "Email address", value: email, setter: setEmail, type: "email", placeholder: "you@company.com" },
            { label: "Password", value: password, setter: setPassword, type: "password", placeholder: "Min 6 characters" },
          ].map(({ label, value, setter, type, placeholder }) => (
            <div key={label} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: COLORS.subtle, marginBottom: 8 }}>{label}</label>
              <input
                type={type} value={value} placeholder={placeholder}
                onChange={e => setter(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                  borderRadius: 10, color: COLORS.text, fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", transition: "all .2s",
                }}
              />
            </div>
          ))}

          {error && (
            <div style={{
              padding: "10px 14px", background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8,
              color: "#f87171", fontSize: 13, marginBottom: 16,
            }}>{error}</div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{
            width: "100%", padding: "13px", borderRadius: 10, border: "none",
            background: loading ? COLORS.border : "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "white", fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer",
            fontFamily: "'Syne', sans-serif", transition: "all .2s",
            boxShadow: loading ? "none" : "0 4px 20px rgba(59,130,246,0.4)",
          }}>
            {loading ? <Spinner /> : (isLogin ? "Sign In →" : "Create Account →")}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: COLORS.muted, marginTop: 20 }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={onSwitch} style={{ color: COLORS.accentHover, cursor: "pointer", fontWeight: 600 }}>
              {isLogin ? "Register" : "Sign In"}
            </span>
          </p>
        </div>

        {/* Demo hint */}
        <p style={{ textAlign: "center", fontSize: 12, color: COLORS.muted, marginTop: 16 }}>
          ✦ Register with any email to explore the full demo
        </p>
      </div>
    </div>
  );
}

// ─── AI Ticket Modal ─────────────────────────────────────────────────────────

function CreateTicketModal({ onClose, onSubmit }) {
  const [issue, setIssue] = useState("");
  const [type, setType] = useState("Internet");
  const [priority, setPriority] = useState("Medium");
  const textRef = useRef();

  useEffect(() => { textRef.current?.focus(); }, []);

  // Fires AFTER ticket is created — updates suggestion in background
  const fetchAISuggestionAsync = async (ticketId, issueText) => {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are an expert IT helpdesk AI. Respond ONLY with a valid JSON object (no markdown, no fences):
{"suggestion":"2-3 actionable steps the user can try right now","category":"one of: Internet,Password,Hardware,Software,Email,VPN,Printer,Security,Other","priority":"one of: Low,Medium,High"}`,
          messages: [{ role: "user", content: `IT Issue: "${issueText}"` }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      return { suggestion: parsed.suggestion, category: parsed.category, priority: parsed.priority };
    } catch {
      return { suggestion: "Restart the affected service, clear cache, and contact IT if the issue persists." };
    }
  };

  // Submit instantly — no waiting
  const handleSubmit = () => {
    if (!issue.trim()) return;
    onSubmit({
      issue: issue.trim(), type, priority,
      suggestion: null, // null = "AI analyzing…" state
      fetchAI: fetchAISuggestionAsync,
    });
  };

  const types = ["Internet", "Password", "Hardware", "Software", "Email", "VPN", "Printer", "Security", "Other"];

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20,
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 24, padding: 32, width: "100%", maxWidth: 560,
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        animation: "slideUp .25s ease-out",
      }}>
        <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }`}</style>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>Raise New Ticket</h3>
            <p style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>AI will analyze & categorize your issue</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 22 }}>✕</button>
        </div>

        {/* Issue textarea */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.subtle, display: "block", marginBottom: 8 }}>Describe your issue *</label>
          <textarea
            ref={textRef} value={issue}
            onChange={e => { setIssue(e.target.value); setAiSuggestion(""); setAiCategory(""); }}
            placeholder="e.g. My laptop won't connect to the office Wi-Fi since this morning..."
            rows={4}
            style={{
              width: "100%", padding: "12px 16px",
              background: COLORS.bg, border: `1px solid ${COLORS.border}`,
              borderRadius: 12, color: COLORS.text, fontSize: 14, resize: "vertical",
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
            }}
          />
        </div>

        {/* Type & Priority */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Category", value: type, setter: setType, options: types },
            { label: "Priority", value: priority, setter: setPriority, options: ["Low", "Medium", "High"] },
          ].map(({ label, value, setter, options }) => (
            <div key={label}>
              <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.subtle, display: "block", marginBottom: 8 }}>{label}</label>
              <select value={value} onChange={e => setter(e.target.value)} style={{
                width: "100%", padding: "11px 14px",
                background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                borderRadius: 10, color: COLORS.text, fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
              }}>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Submit — fires instantly */}
        <button onClick={handleSubmit} disabled={!issue.trim()} style={{
          width: "100%", padding: "13px", borderRadius: 10, border: "none",
          background: !issue.trim() ? COLORS.border : "linear-gradient(135deg, #2563eb, #7c3aed)",
          color: "white", fontSize: 15, fontWeight: 700, cursor: !issue.trim() ? "default" : "pointer",
          fontFamily: "'Syne', sans-serif", boxShadow: issue.trim() ? "0 4px 20px rgba(59,130,246,0.3)" : "none",
          transition: "all .2s",
        }}>
          Create Ticket →
        </button>
      </div>
    </div>
  );
}

// ─── Ticket Card ─────────────────────────────────────────────────────────────

function TicketCard({ ticket, onUpdateStatus, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const p = PRIORITY_CONFIG[ticket.priority] || PRIORITY_CONFIG.Low;
  const s = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.Open;

  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 16, overflow: "hidden",
      transition: "border-color .2s, box-shadow .2s",
      boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.accent + "55"; e.currentTarget.style.boxShadow = `0 4px 24px rgba(59,130,246,0.1)`; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.2)"; }}
    >
      {/* Priority stripe */}
      <div style={{ height: 3, background: p.color, opacity: 0.8 }} />

      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'DM Mono', monospace" }}>
                #{String(ticket.id).slice(-6)}
              </span>
              <Badge label={ticket.status} color={s.color} bg={s.bg} />
              <Badge label={ticket.priority} color={p.color} bg={p.bg} />
              <Badge label={ticket.type} color={COLORS.subtle} bg="rgba(148,163,184,0.1)" />
            </div>
            <p style={{ fontSize: 15, color: COLORS.text, fontWeight: 500, lineHeight: 1.5, marginBottom: 6 }}>
              {ticket.issue}
            </p>
            <p style={{ fontSize: 12, color: COLORS.muted }}>{ticket.date}</p>
          </div>
          <button onClick={() => setExpanded(!expanded)} style={{
            background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8,
            color: COLORS.muted, cursor: "pointer", padding: "6px 10px", fontSize: 13,
            transition: "all .2s", whiteSpace: "nowrap",
          }}>
            {expanded ? "▲ Less" : "▼ More"}
          </button>
        </div>

        {expanded && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${COLORS.border}`, animation: "slideUp .2s ease-out" }}>
            {ticket.suggestion === null ? (
              <div style={{
                padding: "12px 14px", background: "rgba(59,130,246,0.04)",
                border: "1px dashed rgba(59,130,246,0.2)", borderRadius: 10, marginBottom: 14,
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Spinner />
                  <span style={{ fontSize: 13, color: COLORS.muted }}>AI is analyzing your issue…</span>
                </div>
              </div>
            ) : ticket.suggestion ? (
              <div style={{
                padding: "12px 14px", background: "rgba(59,130,246,0.06)",
                border: "1px solid rgba(59,130,246,0.15)", borderRadius: 10, marginBottom: 14,
              }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                  <span>🤖</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, textTransform: "uppercase", letterSpacing: 1 }}>AI Suggestion</span>
                </div>
                <p style={{ fontSize: 13, color: COLORS.subtle, lineHeight: 1.7 }}>{ticket.suggestion}</p>
              </div>
            ) : null}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["In Progress", "Resolved", "Closed"].map(status => {
                const cfg = STATUS_CONFIG[status];
                return (
                  <button key={status} onClick={() => onUpdateStatus(ticket.id, status)}
                    disabled={ticket.status === status}
                    style={{
                      padding: "7px 14px", borderRadius: 8, border: `1px solid ${cfg.color}44`,
                      background: ticket.status === status ? cfg.bg : "transparent",
                      color: ticket.status === status ? cfg.color : COLORS.muted,
                      fontSize: 13, fontWeight: 600, cursor: ticket.status === status ? "default" : "pointer",
                      transition: "all .2s",
                    }}>
                    {status}
                  </button>
                );
              })}
              <button onClick={() => onDelete(ticket.id)} style={{
                padding: "7px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)",
                background: "transparent", color: "#f87171", fontSize: 13, fontWeight: 600,
                cursor: "pointer", marginLeft: "auto", transition: "all .2s",
              }}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

function Dashboard({ user, onLogout, tickets, setTickets }) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [activeTab, setActiveTab] = useState("tickets"); // tickets | analytics

  const createTicket = ({ issue, type, priority, fetchAI }) => {
    const id = Date.now();
    const newTicket = {
      id, type, issue, priority,
      status: "Open",
      suggestion: null, // AI will fill this in the background
      date: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      createdBy: user.email,
    };
    // 1. Close modal & add ticket instantly
    setShowModal(false);
    setTickets(prev => [newTicket, ...prev]);
    // 2. Fetch AI suggestion silently in background
    fetchAI(id, issue).then(({ suggestion, category, priority: aiPriority }) => {
      setTickets(prev => prev.map(t =>
        t.id === id
          ? { ...t, suggestion, type: category || t.type, priority: aiPriority || t.priority }
          : t
      ));
    });
  };

  const updateStatus = (id, status) => setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  const deleteTicket = (id) => setTickets(prev => prev.filter(t => t.id !== id));

  const filtered = tickets.filter(t => {
    const matchSearch = t.issue.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || t.status === filterStatus;
    const matchPriority = filterPriority === "All" || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "Open").length,
    inProgress: tickets.filter(t => t.status === "In Progress").length,
    resolved: tickets.filter(t => t.status === "Resolved").length,
  };

  // Analytics data
  const typeBreakdown = ["Internet", "Password", "Hardware", "Software", "Email", "VPN", "Printer", "Security", "Other"].map(type => ({
    type, count: tickets.filter(t => t.type === type).length,
  })).filter(d => d.count > 0);

  const maxCount = Math.max(...typeBreakdown.map(d => d.count), 1);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', sans-serif", color: COLORS.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        select { appearance: none; }
        input::placeholder { color: #475569; }
        input:focus, select:focus, textarea:focus { outline: none; border-color: #3b82f6 !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0d14; }
        ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 3px; }
        @keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
      `}</style>

      {/* Topbar */}
      <header style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,13,20,0.85)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
          }}>🎯</div>
          <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, fontFamily: "'Syne', sans-serif" }}>DeskAI</span>
          <span style={{ padding: "2px 8px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: 6, fontSize: 11, color: COLORS.accent, fontWeight: 600, fontFamily: "'DM Mono', monospace" }}>BETA</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{user.name || user.email}</div>
            <div style={{ fontSize: 12, color: COLORS.muted }}>{user.role || "Agent"}</div>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #1d4ed8, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "white",
          }}>{user.avatar || user.email[0].toUpperCase()}</div>
          <button onClick={onLogout} style={{
            padding: "8px 16px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
            background: "transparent", color: COLORS.muted, fontSize: 13, fontWeight: 600,
            cursor: "pointer", transition: "all .2s",
          }}>Sign out</button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Page heading */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: COLORS.text, fontFamily: "'Syne', sans-serif", letterSpacing: -0.5 }}>
              Support Dashboard
            </h1>
            <p style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <button onClick={() => setShowModal(true)} style={{
            padding: "12px 24px", borderRadius: 12, border: "none",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "white", fontSize: 14, fontWeight: 700,
            cursor: "pointer", fontFamily: "'Syne', sans-serif",
            boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
            display: "flex", alignItems: "center", gap: 8, transition: "all .2s",
          }}>
            + New Ticket
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard icon="🎫" label="Total Tickets" value={stats.total} />
          <StatCard icon="🔵" label="Open" value={stats.open} color={COLORS.accent} />
          <StatCard icon="🟡" label="In Progress" value={stats.inProgress} color={COLORS.warning} />
          <StatCard icon="✅" label="Resolved" value={stats.resolved} color={COLORS.success} />
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: COLORS.surface, padding: 4, borderRadius: 12, width: "fit-content", border: `1px solid ${COLORS.border}` }}>
          {["tickets", "analytics"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "8px 20px", borderRadius: 9, border: "none",
              background: activeTab === tab ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "transparent",
              color: activeTab === tab ? "white" : COLORS.muted,
              fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .2s",
              textTransform: "capitalize",
            }}>
              {tab === "tickets" ? `🎫 Tickets (${filtered.length})` : "📊 Analytics"}
            </button>
          ))}
        </div>

        {activeTab === "tickets" && (
          <>
            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: COLORS.muted, fontSize: 15 }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..."
                  style={{
                    width: "100%", padding: "10px 16px 10px 36px",
                    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 10, color: COLORS.text, fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                />
              </div>
              {[
                { label: "Status", value: filterStatus, setter: setFilterStatus, options: ["All", "Open", "In Progress", "Resolved", "Closed"] },
                { label: "Priority", value: filterPriority, setter: setFilterPriority, options: ["All", "Low", "Medium", "High"] },
              ].map(({ label, value, setter, options }) => (
                <select key={label} value={value} onChange={e => setter(e.target.value)} style={{
                  padding: "10px 14px", background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                  borderRadius: 10, color: value === "All" ? COLORS.muted : COLORS.text, fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                }}>
                  {options.map(o => <option key={o} value={o}>{o === "All" ? `All ${label}s` : o}</option>)}
                </select>
              ))}
            </div>

            {/* Tickets list */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>
                  {tickets.length === 0 ? "No tickets yet" : "No matching tickets"}
                </h3>
                <p style={{ color: COLORS.muted, fontSize: 14 }}>
                  {tickets.length === 0 ? "Create your first ticket to get started." : "Try adjusting your filters."}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filtered.map(t => (
                  <TicketCard key={t.id} ticket={t} onUpdateStatus={updateStatus} onDelete={deleteTicket} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "analytics" && (
          <div style={{ animation: "fadeIn .3s ease-out" }}>
            {tickets.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <p style={{ color: COLORS.muted }}>Create some tickets to see analytics.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 20 }}>
                {/* Status breakdown */}
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Status Breakdown</h3>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
                      const count = tickets.filter(t => t.status === status).length;
                      const pct = tickets.length ? Math.round((count / tickets.length) * 100) : 0;
                      return (
                        <div key={status} style={{ flex: 1, minWidth: 120, textAlign: "center" }}>
                          <div style={{
                            height: 6, borderRadius: 4, background: COLORS.border, marginBottom: 8, overflow: "hidden",
                          }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: cfg.color, borderRadius: 4, transition: "width 1s ease-out" }} />
                          </div>
                          <div style={{ fontSize: 22, fontWeight: 700, color: cfg.color, fontFamily: "'DM Mono', monospace" }}>{count}</div>
                          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{status}</div>
                          <div style={{ fontSize: 11, color: COLORS.muted }}>{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Category breakdown */}
                {typeBreakdown.length > 0 && (
                  <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Issues by Category</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {typeBreakdown.sort((a, b) => b.count - a.count).map(({ type, count }) => (
                        <div key={type} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 90, fontSize: 13, color: COLORS.subtle, textAlign: "right" }}>{type}</div>
                          <div style={{ flex: 1, height: 8, background: COLORS.border, borderRadius: 4, overflow: "hidden" }}>
                            <div style={{
                              width: `${(count / maxCount) * 100}%`, height: "100%",
                              background: "linear-gradient(90deg, #2563eb, #7c3aed)", borderRadius: 4,
                              transition: "width 1s ease-out",
                            }} />
                          </div>
                          <div style={{ width: 24, fontSize: 13, fontWeight: 700, color: COLORS.text, fontFamily: "'DM Mono', monospace" }}>{count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority breakdown */}
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Priority Distribution</h3>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    {Object.entries(PRIORITY_CONFIG).map(([priority, cfg]) => {
                      const count = tickets.filter(t => t.priority === priority).length;
                      const pct = tickets.length ? Math.round((count / tickets.length) * 100) : 0;
                      return (
                        <div key={priority} style={{
                          flex: 1, minWidth: 100, padding: "16px 20px",
                          background: cfg.bg, border: `1px solid ${cfg.color}33`, borderRadius: 12, textAlign: "center",
                        }}>
                          <div style={{ fontSize: 28, fontWeight: 700, color: cfg.color, fontFamily: "'DM Mono', monospace" }}>{count}</div>
                          <div style={{ fontSize: 13, color: cfg.color, fontWeight: 600, marginTop: 2 }}>{priority}</div>
                          <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 1 }}>{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {showModal && <CreateTicketModal onClose={() => setShowModal(false)} onSubmit={createTicket} />}
    </div>
  );
}

// ─── Root App ────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([{ email: "demo@deskai.io", password: "demo123", name: "Demo User", role: "Admin", avatar: "D" }]);
  const [tickets, setTickets] = useState([
    { id: 1700000001, type: "Internet", issue: "Unable to connect to the company VPN from home since the latest Windows update.", priority: "High", status: "In Progress", suggestion: "Roll back the Windows update, clear DNS cache with 'ipconfig /flushdns', and reinstall the VPN client. If the issue persists, check firewall exceptions.", date: "29 Mar 2025, 09:14 AM", createdBy: "demo@deskai.io" },
    { id: 1700000002, type: "Password", issue: "Locked out of Microsoft 365 account after too many failed login attempts.", priority: "Medium", status: "Open", suggestion: "Wait 15 minutes for the account lockout to reset, then use the self-service password reset at account.microsoft.com. Enable MFA afterwards.", date: "29 Mar 2025, 10:32 AM", createdBy: "demo@deskai.io" },
    { id: 1700000003, type: "Hardware", issue: "Laptop battery drains completely within 2 hours even after calibration.", priority: "Low", status: "Resolved", suggestion: "Run a battery health report via 'powercfg /batteryreport', update power drivers, and consider scheduling a battery replacement if health is below 40%.", date: "28 Mar 2025, 03:45 PM", createdBy: "demo@deskai.io" },
  ]);

  const login = (u) => { setUser(u); setPage("dashboard"); };
  const logout = () => { setUser(null); setPage("login"); };

  if (page === "dashboard" && user) {
    return <Dashboard user={user} onLogout={logout} tickets={tickets} setTickets={setTickets} />;
  }

  return (
    <AuthPage
      mode={page}
      users={users}
      setUsers={setUsers}
      onLogin={login}
      onSwitch={() => setPage(page === "login" ? "register" : "login")}
    />
  );
}