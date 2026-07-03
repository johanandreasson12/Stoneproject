import { useState, useEffect } from "react";

// ── Supabase ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ffoqeukrzkjimifrpvve.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmb3FldWtyemtqaW1pZnJwdnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MzI1NTgsImV4cCI6MjA5NzIwODU1OH0.K7KV4RLImvfmUP0Nd3yXG9KYXlav6ayKwbM2IskUk3o";
const HEADERS = { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Prefer": "return=representation" };
const API = `${SUPABASE_URL}/rest/v1/projects`;

// camelCase → snake_case för Supabase
const toDb = (p) => ({
  referens: p.referens,
  lopnummer: p.lopnummer,
  namn: p.namn,
  produkt: p.produkt,
  kategori: p.kategori,
  status: p.status,
  varde: p.värde || 0,
  ansvarig: p.ansvarig,
  notat: p.notat,
  uppdaterad: p.uppdaterad,
  kalkyl_deadline: p.kalkylDeadline || null,
  uppfoljnings_datum: p.uppföljningsDatum || null,
  sannolikhet: p.sannolikhet || 50,
  kontakt_logg: p.kontaktLogg || [],
  tapp_orsak: p.tappOrsak || null,
  tapp_kommentar: p.tappKommentar || null,
  order_nummer: p.orderNummer || null,
  orderstatus: p.orderstatus || null,
  material: p.material || null,
  matningstyp: p.mätningstyp || null,
  matning_ue: p.mätningUE || false,
  matning_ue_order_skickad: p.mätningUEOrderSkickad || false,
  ue_matning_kostnad: p.ueMatningKostnad || null,
  prelim_vecka_matning: p.prelimVeckaMätning || null,
  bekraftad_matning_datum: p.bekraftadMatningDatum || null,
  leveranstyp: p.leveranstyp || null,
  leverans_ue: p.leveransUE || false,
  installation_ue_order_skickad: p.installationUEOrderSkickad || false,
  ue_installation_kostnad: p.ueInstallationKostnad || null,
  prelim_vecka_leverans: p.prelimVeckaLeverans || null,
  bekraftad_installation_datum: p.bekraftadInstallationDatum || null,
  producent: p.producent || null,
  har_vask: p.harVask || false,
  vask_tillhandahaller: p.vaskTillhandahåller || null,
  vask_modell: p.vaskModell || null,
  vask_order_skickad: p.vaskOrderSkickad || false,
  vask_skickad_datum: p.vaskSkickadDatum || null,
  vask_ordernummer: p.vaskOrdernummer || null,
  vask_inkopspris: p.vaskInköpspris || null,
  vask_leverans_datum: p.vaskLeveransDatum || null,
  order_skickad_leverantor: p.orderSkickadLeverantör || false,
  leverantor_skickad_datum: p.leverantörSkickadDatum || null,
  leverantor_ordernummer: p.leverantörOrdernummer || null,
  leverantor_inkopspris: p.leverantörInköpspris || null,
  produktion_start_datum: p.produktionStartDatum || null,
  fardig_dag: p.fardigDag || null,
  ue_info_skickad: p.ueInfoSkickad || false,
  ue_info_skickad_datum: p.ueInfoSkickadDatum || null,
  frakt_ska_bokas: p.fraktSkaBokas || false,
  frakt_fran: p.fraktFran || null,
  frakt_till: p.fraktTill || null,
  frakt_bokad: p.fraktBokad || false,
  frakt_bokad_datum: p.fraktBokadDatum || null,
  frakt_ordernummer: p.fraktOrdernummer || null,
  frakt_kostnad: p.fraktKostnad || null,
  frakt_leveransdag: p.fraktLeveransdag || null,
  projekt_todos: p.projektTodos || [],
  delfaktureringar: p.delfaktureringar || [],
  attester: p.attester || {},
  ignorerade_todos: p.ignoreradeTodos || {},
});

// snake_case → camelCase från Supabase
const fromDb = (r) => ({
  id: r.id,
  referens: r.referens,
  lopnummer: r.lopnummer,
  namn: r.namn,
  produkt: r.produkt,
  kategori: r.kategori,
  status: r.status,
  värde: r.varde || 0,
  ansvarig: r.ansvarig,
  notat: r.notat,
  uppdaterad: r.uppdaterad,
  kalkylDeadline: r.kalkyl_deadline,
  uppföljningsDatum: r.uppfoljnings_datum || "",
  sannolikhet: r.sannolikhet || 50,
  kontaktLogg: r.kontakt_logg || [],
  tappOrsak: r.tapp_orsak,
  tappKommentar: r.tapp_kommentar,
  orderNummer: r.order_nummer || "",
  orderstatus: r.orderstatus || "",
  material: r.material || "",
  mätningstyp: r.matningstyp || "färdiga_mått",
  mätningUE: r.matning_ue || false,
  mätningUEOrderSkickad: r.matning_ue_order_skickad || false,
  ueMatningKostnad: r.ue_matning_kostnad || "",
  prelimVeckaMätning: r.prelim_vecka_matning || "",
  bekraftadMatningDatum: r.bekraftad_matning_datum || "",
  leveranstyp: r.leveranstyp || "skickas_till_kund",
  leveransUE: r.leverans_ue || false,
  installationUEOrderSkickad: r.installation_ue_order_skickad || false,
  ueInstallationKostnad: r.ue_installation_kostnad || "",
  prelimVeckaLeverans: r.prelim_vecka_leverans || "",
  bekraftadInstallationDatum: r.bekraftad_installation_datum || "",
  producent: r.producent || "Cosentino",
  harVask: r.har_vask || false,
  vaskTillhandahåller: r.vask_tillhandahaller || "vi",
  vaskModell: r.vask_modell || "",
  vaskOrderSkickad: r.vask_order_skickad || false,
  vaskSkickadDatum: r.vask_skickad_datum || "",
  vaskOrdernummer: r.vask_ordernummer || "",
  vaskInköpspris: r.vask_inkopspris || "",
  vaskLeveransDatum: r.vask_leverans_datum || "",
  orderSkickadLeverantör: r.order_skickad_leverantor || false,
  leverantörSkickadDatum: r.leverantor_skickad_datum || "",
  leverantörOrdernummer: r.leverantor_ordernummer || "",
  leverantörInköpspris: r.leverantor_inkopspris || "",
  produktionStartDatum: r.produktion_start_datum || "",
  fardigDag: r.fardig_dag || "",
  ueInfoSkickad: r.ue_info_skickad || false,
  ueInfoSkickadDatum: r.ue_info_skickad_datum || "",
  fraktSkaBokas: r.frakt_ska_bokas || false,
  fraktFran: r.frakt_fran || "",
  fraktTill: r.frakt_till || "",
  fraktBokad: r.frakt_bokad || false,
  fraktBokadDatum: r.frakt_bokad_datum || "",
  fraktOrdernummer: r.frakt_ordernummer || "",
  fraktKostnad: r.frakt_kostnad || "",
  fraktLeveransdag: r.frakt_leveransdag || "",
  projektTodos: r.projekt_todos || [],
  delfaktureringar: r.delfaktureringar || [],
  attester: r.attester || {},
  ignoreradeTodos: r.ignorerade_todos || {},
});

// ── Palett ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#F7F8FA", surface: "#FFFFFF", border: "#E4E7EC",
  text: "#0F1923", muted: "#6B7280",
  accent: "#1A56DB", accentLight: "#EBF0FF",
  green: "#0E9F6E", greenLight: "#ECFDF5",
  orange: "#D97706", orangeLight: "#FFFBEB",
  red: "#E02424", redLight: "#FEF2F2",
  purple: "#7C3AED", purpleLight: "#F5F3FF",
  teal: "#0E7490", tealLight: "#CFFAFE",
  grayLight: "#F3F4F6",
};

// ── Kategorier ───────────────────────────────────────────────────────────────
const KATEGORIER = ["bänkskivor", "fönsterbänkar", "fasader", "möbler", "övrigt"];
const KAT_META = {
  bänkskivor:    { label: "Bänkskivor",    color: "#0369A1", bg: "#E0F2FE" },
  fönsterbänkar: { label: "Fönsterbänkar", color: "#7C3AED", bg: "#F5F3FF" },
  fasader:       { label: "Fasader",       color: "#065F46", bg: "#ECFDF5" },
  möbler:        { label: "Möbler",        color: "#92400E", bg: "#FEF3C7" },
  övrigt:        { label: "Övrigt",        color: "#374151", bg: "#F3F4F6" },
};

// ── Orderstatusflöde ─────────────────────────────────────────────────────────
const ORDER_STEG = [
  { id: "invänta_mått",          label: "Inväntar mått" },
  { id: "mätning_bokad",         label: "Mätning bokad" },
  { id: "mätning_utförd",        label: "Klar för produktion" },
  { id: "i_produktion",          label: "I produktion" },
  { id: "klar_leverans",         label: "Klar att levereras" },
  { id: "på_väg",                label: "På väg till kund" },
  { id: "pagaende_installation", label: "Pågående installation" },
  { id: "installerad",           label: "Installerad" },
];

// ── Tappade-orsaker ──────────────────────────────────────────────────────────
const TAPP_ORSAKER = ["Pris", "Konkurrent", "Timing", "Övrigt"];

// ── Projektstatusmetadata ────────────────────────────────────────────────────
const STATUS_META = {
  kalkyl:   { label: "Ska räknas på", color: C.teal,    bg: C.tealLight,   dot: C.teal },
  offert:   { label: "Öppen offert",  color: C.orange,  bg: C.orangeLight, dot: "#F59E0B" },
  order:    { label: "Order",         color: C.accent,  bg: C.accentLight, dot: C.accent },
  service:  { label: "Serviceärende", color: C.purple,  bg: C.purpleLight, dot: C.purple },
  avslutad: { label: "Avslutad",      color: C.green,   bg: C.greenLight,  dot: C.green },
  faktureras: { label: "Faktureras",   color: "#0E7490", bg: "#CFFAFE",     dot: "#0E7490" },
  tappad:   { label: "Tappad",        color: C.red,     bg: C.redLight,    dot: C.red },
};

const SEK = (n) => (n || 0).toLocaleString("sv-SE") + " kr";

const delfakturerat = (p) => (p.delfaktureringar || []).reduce((s, d) => s + (Number(d.belopp) || 0), 0);
const kvarstående = (p) => (p.värde || 0) - delfakturerat(p);

const attestBelopp = (p, key) => {
  const a = (p.attester || {})[key];
  return a && a.faktiskKostnad ? Number(a.faktiskKostnad) : null;
};
const inköpBelopp = (p, key, budget) => attestBelopp(p, key) !== null ? attestBelopp(p, key) : (Number(budget) || 0);

const beraknaKostnad = (p) => {
  return (
    inköpBelopp(p, "sten", p.leverantörInköpspris) +
    inköpBelopp(p, "vask", p.vaskInköpspris) +
    inköpBelopp(p, "frakt", p.fraktKostnad) +
    inköpBelopp(p, "uematning", p.ueMatningKostnad) +
    inköpBelopp(p, "ueinstallation", p.ueInstallationKostnad)
  );
};

const beraknaTB = (p) => (p.värde || 0) - beraknaKostnad(p);
const today = () => new Date().toISOString().slice(0, 10);

// ── Exempeldata ──────────────────────────────────────────────────────────────

// ── Löpnummer ───────────────────────────────────────────────────────────────
const START_LOPNUMMER = 330;

// ── Sidor ────────────────────────────────────────────────────────────────────
const PAGES = [
  { id: "alla",     label: "Alla projekt",    icon: "⬡", filter: null, todo: true },
  { id: "kalkyl",   label: "Ska räknas på",   icon: "🧮", filter: "kalkyl" },
  { id: "offert",   label: "Öppna offerter",  icon: "📄", filter: "offert" },
  { id: "order",    label: "Orders",          icon: "📦", filter: "order" },
  { id: "service",  label: "Serviceärenden",  icon: "🔧", filter: "service" },
  { id: "faktureras", label: "Faktureras",     icon: "🧾", filter: "faktureras" },
  { id: "avslutad", label: "Avslutade",       icon: "✅", filter: "avslutad" },
  { id: "tappad",   label: "Tappade",         icon: "❌", filter: "tappad" },
];

// ── Gemensamma småkomponenter ─────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || {};
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 10px", borderRadius: 20, background: m.bg, color: m.color, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: m.dot, display: "inline-block" }} />
      {m.label}
    </span>
  );
};

const KategoriChip = ({ kategori }) => {
  const m = KAT_META[kategori] || KAT_META["övrigt"];
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, background: m.bg, color: m.color, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{m.label}</span>;
};

const KpiCard = ({ label, value, sub, color }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", flex: "1 1 130px" }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 800, color: color || C.text, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{sub}</div>}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{label}</span>
    {children}
  </div>
);

const inputSt = { border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: "inherit", outline: "none", color: C.text, background: C.surface };
const selectSt = { ...inputSt, cursor: "pointer" };

const Section = ({ title, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>{title}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{children}</div>
  </div>
);

const Toggle = ({ label, val, onChange, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <input type="checkbox" checked={val} onChange={e => onChange(e.target.checked)} style={{ width: 16, height: 16 }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{label}</span>
    </label>
    {val && <div style={{ paddingLeft: 26, display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>}
  </div>
);

// ── OFFERT-CRM MODAL ─────────────────────────────────────────────────────────
const OffertModal = ({ project, onClose, onSave, onDelete, onPromoteToOrder }) => {
  const [form, setForm] = useState({ ...project });
  const [nyLogg, setNyLogg] = useState("");
  const [showTapp, setShowTapp] = useState(false);
  const [tappOrsak, setTappOrsak] = useState(form.tappOrsak || "Pris");
  const [tappKommentar, setTappKommentar] = useState(form.tappKommentar || "");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addLogg = () => {
    if (!nyLogg.trim()) return;
    const entry = { datum: today(), text: nyLogg.trim() };
    set("kontaktLogg", [entry, ...(form.kontaktLogg || [])]);
    setNyLogg("");
  };

  const dagar = form.uppföljningsDatum ? Math.round((new Date(form.uppföljningsDatum) - new Date()) / 86400000) : null;
  const påminnelseColor = dagar === null ? C.muted : dagar < 0 ? C.red : dagar <= 2 ? C.orange : C.green;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }} onClick={onClose}>
      <div style={{ background: C.surface, borderRadius: 16, width: "100%", maxWidth: 620, maxHeight: "92vh", overflowY: "auto", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: C.orangeLight, borderRadius: "16px 16px 0 0" }}>
          <div>
            <div style={{ fontSize: 11, color: C.orange, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{form.referens} · Offert</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.text }}>{form.namn}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{form.produkt}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted }}>×</button>
        </div>

        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20, flex: 1, overflowY: "auto" }}>

          {/* Baskort */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Kund"><input value={form.namn} onChange={e => set("namn", e.target.value)} style={inputSt} /></Field>
            <Field label="Produkt"><input value={form.produkt} onChange={e => set("produkt", e.target.value)} style={inputSt} /></Field>
            <Field label="Ansvarig"><input value={form.ansvarig} onChange={e => set("ansvarig", e.target.value)} style={inputSt} /></Field>
            <Field label="Offert­värde (kr)"><input type="number" value={form.värde} onChange={e => set("värde", Number(e.target.value))} style={inputSt} /></Field>
            <Field label="Kategori">
              <select value={form.kategori} onChange={e => set("kategori", e.target.value)} style={selectSt}>
                {KATEGORIER.map(k => <option key={k} value={k}>{KAT_META[k].label}</option>)}
              </select>
            </Field>
            <Field label="Notat"><input value={form.notat} onChange={e => set("notat", e.target.value)} style={inputSt} /></Field>
          </div>

          {/* CRM-sektion */}
          <div style={{ background: C.grayLight, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>CRM-uppföljning</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Nästa uppföljning">
                <input type="date" value={form.uppföljningsDatum} onChange={e => set("uppföljningsDatum", e.target.value)} style={inputSt} />
                {dagar !== null && (
                  <span style={{ fontSize: 11, color: påminnelseColor, fontWeight: 600, marginTop: 2 }}>
                    {dagar < 0 ? `${Math.abs(dagar)} dag${Math.abs(dagar) !== 1 ? "ar" : ""} försenad` : dagar === 0 ? "Idag!" : `Om ${dagar} dag${dagar !== 1 ? "ar" : ""}`}
                  </span>
                )}
              </Field>
              <Field label="Sannolikhet att bli order">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input type="range" min={0} max={100} step={5} value={form.sannolikhet} onChange={e => set("sannolikhet", Number(e.target.value))} style={{ flex: 1 }} />
                  <span style={{ fontSize: 15, fontWeight: 700, color: form.sannolikhet >= 70 ? C.green : form.sannolikhet >= 40 ? C.orange : C.red, minWidth: 38 }}>{form.sannolikhet}%</span>
                </div>
              </Field>
            </div>
          </div>

          {/* Kontaktlogg */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Kontaktlogg</div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={nyLogg} onChange={e => setNyLogg(e.target.value)} onKeyDown={e => e.key === "Enter" && addLogg()} placeholder="Vad sades? Tryck Enter för att spara…" style={{ ...inputSt, flex: 1 }} />
              <button onClick={addLogg} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", fontWeight: 700, cursor: "pointer" }}>+</button>
            </div>
            {(form.kontaktLogg || []).length === 0 ? (
              <div style={{ fontSize: 13, color: C.muted, fontStyle: "italic" }}>Ingen logg ännu.</div>
            ) : (form.kontaktLogg || []).map((l, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 12px", background: C.grayLight, borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap", paddingTop: 1 }}>{l.datum}</span>
                <span style={{ fontSize: 13, color: C.text }}>{l.text}</span>
              </div>
            ))}
          </div>

          {/* Projekt todos */}
          <ProjektTodosPanel todos={form.projektTodos} onChange={async v => {
                set("projektTodos", v);
                await sb.from("projects").update({ projekt_todos: v }).eq("id", form.id);
                setProjects(ps => ps.map(p => p.id === form.id ? { ...p, projektTodos: v } : p));
              }} />

          {/* Markera som tappad */}
          {!showTapp ? (
            <button onClick={() => setShowTapp(true)} style={{ background: C.redLight, color: C.red, border: `1px solid ${C.red}`, borderRadius: 8, padding: "8px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", alignSelf: "flex-start" }}>
              Markera som tappad order
            </button>
          ) : (
            <div style={{ background: C.redLight, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12, border: `1px solid ${C.red}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.red, textTransform: "uppercase" }}>Tappad order – ange orsak</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Orsak">
                  <select value={tappOrsak} onChange={e => setTappOrsak(e.target.value)} style={selectSt}>
                    {TAPP_ORSAKER.map(o => <option key={o}>{o}</option>)}
                  </select>
                </Field>
                <Field label="Kommentar">
                  <input value={tappKommentar} onChange={e => setTappKommentar(e.target.value)} placeholder="Fritext…" style={inputSt} />
                </Field>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { onSave({ ...form, status: "tappad", tappOrsak, tappKommentar }); }} style={{ background: C.red, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 700, cursor: "pointer" }}>Bekräfta tappad</button>
                <button onClick={() => setShowTapp(false)} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 14px", cursor: "pointer", color: C.muted }}>Avbryt</button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => onDelete(project.id)} style={{ background: "none", color: C.red, border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Ta bort</button>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => onSave(form)} style={{ background: C.grayLight, color: C.text, border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Spara</button>
            <button onClick={() => onPromoteToOrder(form)} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              → Konvertera till order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── NY ORDER-FORMULÄR (dyker upp vid konvertering) ───────────────────────────
const OrderFormulär = ({ project, onClose, onSave }) => {
  const [f, setF] = useState({
    orderNummer: "",
    orderstatus: "invänta_mått",
    material: "",
    mätningstyp: "färdiga_mått",
    mätningUE: false,
    prelimVeckaMätning: "",
    leveranstyp: "skickas_till_kund",
    leveransUE: false,
    prelimVeckaLeverans: "",
    producent: "Cosentino",
    harVask: false,
    vaskTillhandahåller: "vi",
    vaskModell: "",
    vaskOrderSkickad: false,
    vaskOrdernummer: "",
    vaskInköpspris: "",
    vaskLeveransDatum: "",
    orderSkickadLeverantör: false,
    leverantörOrdernummer: "",
    leverantörInköpspris: "",
    fraktSkaBokas: false,
    fraktFran: "",
    fraktTill: "",
    fraktBokad: false,
    fraktOrdernummer: "",
    fraktKostnad: "",
    fraktLeveransdag: "",
    ...project,
    status: "order",
  });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }} onClick={onClose}>
      <div style={{ background: C.surface, borderRadius: 16, width: "100%", maxWidth: 780, maxHeight: "94vh", overflowY: "scroll", boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "22px 28px 18px", borderBottom: `1px solid ${C.border}`, background: C.accentLight, borderRadius: "16px 16px 0 0" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Ny order – {project.referens}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>{project.namn}</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>{project.produkt} · {SEK(project.värde)}</div>
        </div>

        <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Orderstatus & Fortnox */}
          <Section title="Order­information">
            <Field label="Ordernummer i Fortnox">
              <input value={f.orderNummer} onChange={e => set("orderNummer", e.target.value)} placeholder="FTX-XXXXX" style={inputSt} />
            </Field>
            <Field label="Orderstatus">
              <select value={f.orderstatus} onChange={e => set("orderstatus", e.target.value)} style={selectSt}>
                {ORDER_STEG.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Material" style={{ gridColumn: "span 2" }}>
              <input value={f.material} onChange={e => set("material", e.target.value)} placeholder="T.ex. Carrara marmor 20mm, polerad" style={inputSt} />
            </Field>
            <Field label="Vem producerar">
              <select value={f.producent} onChange={e => set("producent", e.target.value)} style={selectSt}>
                {["Cosentino", "Landernäs", "Luso Rochas", "Annan leverantör"].map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
          </Section>

          {/* Mätning */}
          <Section title="Mätning">
            <Field label="Måtttyp">
              <select value={f.mätningstyp} onChange={e => set("mätningstyp", e.target.value)} style={selectSt}>
                <option value="färdiga_mått">Färdiga mått från kund</option>
                <option value="kontrollmätas">Ska kontrollmätas</option>
              </select>
            </Field>
            {f.mätningstyp === "kontrollmätas" && (
              <Field label="Vem kontrollmäter">
                <select value={f.mätningUE ? "ue" : "vi"} onChange={e => set("mätningUE", e.target.value === "ue")} style={selectSt}>
                  <option value="vi">Vi gör det</option>
                  <option value="ue">Underentreprenör</option>
                </select>
              </Field>
            )}
            <Field label="Preliminär vecka för mätning">
              <input value={f.prelimVeckaMätning} onChange={e => set("prelimVeckaMätning", e.target.value)} placeholder="t.ex. 28" style={inputSt} />
            </Field>
          </Section>

          {/* Leverans */}
          <Section title="Leverans">
            <Field label="Leveranstyp">
              <select value={f.leveranstyp} onChange={e => set("leveranstyp", e.target.value)} style={selectSt}>
                <option value="skickas_till_kund">Skickas till kund</option>
                <option value="avhämtas">Avhämtas på lager</option>
                <option value="installeras_av_oss">Installeras av oss</option>
              </select>
            </Field>
            {f.leveranstyp === "installeras_av_oss" && (
              <Field label="Vem installerar">
                <select value={f.leveransUE ? "ue" : "vi"} onChange={e => set("leveransUE", e.target.value === "ue")} style={selectSt}>
                  <option value="vi">Vi gör det</option>
                  <option value="ue">Underentreprenör</option>
                </select>
              </Field>
            )}
            <Field label="Preliminär vecka för leverans">
              <input value={f.prelimVeckaLeverans} onChange={e => set("prelimVeckaLeverans", e.target.value)} placeholder="t.ex. 30" style={inputSt} />
            </Field>
          </Section>

          {/* Vask */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>Vask</div>
            <Toggle label="Ordern innehåller vask" val={f.harVask} onChange={v => set("harVask", v)}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Tillhandahåller">
                  <select value={f.vaskTillhandahåller} onChange={e => set("vaskTillhandahåller", e.target.value)} style={selectSt}>
                    <option value="vi">Vi tillhandahåller</option>
                    <option value="kund">Kunden tillhandahåller</option>
                  </select>
                </Field>
                <Field label="Modell">
                  <input value={f.vaskModell} onChange={e => set("vaskModell", e.target.value)} placeholder="T.ex. Blanco Etagon 500" style={inputSt} />
                </Field>
                {f.vaskTillhandahåller === "vi" && (
                  <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: 10 }}>
                    <Toggle label="Order skickad till vaskleverantör" val={f.vaskOrderSkickad} onChange={v => set("vaskOrderSkickad", v)}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        <Field label="Ordernummer"><input value={f.vaskOrdernummer} onChange={e => set("vaskOrdernummer", e.target.value)} style={inputSt} /></Field>
                        <Field label="Inköpspris (kr)"><input type="number" value={f.vaskInköpspris} onChange={e => set("vaskInköpspris", e.target.value)} style={inputSt} /></Field>
                        <Field label="Bekräftad leverans"><input type="date" value={f.vaskLeveransDatum} onChange={e => set("vaskLeveransDatum", e.target.value)} style={inputSt} /></Field>
                      </div>
                    </Toggle>
                  </div>
                )}
              </div>
            </Toggle>
          </div>

          {/* Order till leverantör */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8, paddingBottom: 6, borderBottom: `1px solid ${C.border}` }}>Order till stenleverantör</div>
            <Toggle label="Order skickad till leverantör" val={f.orderSkickadLeverantör} onChange={v => { set("orderSkickadLeverantör", v); if (v && !f.leverantörSkickadDatum) set("leverantörSkickadDatum", today()); }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Ordernummer hos leverantör"><input value={f.leverantörOrdernummer} onChange={e => set("leverantörOrdernummer", e.target.value)} style={inputSt} /></Field>
                <Field label="Inköpspris (kr)"><input type="number" value={f.leverantörInköpspris} onChange={e => set("leverantörInköpspris", e.target.value)} style={inputSt} /></Field>
              </div>
            </Toggle>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: "18px 28px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 18px", cursor: "pointer", color: C.muted, fontWeight: 600 }}>Avbryt</button>
          <button onClick={() => onSave(f)} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            Skapa order →
          </button>
        </div>
      </div>
    </div>
  );
};

// ── ORDERDETALJ MODAL ────────────────────────────────────────────────────────
const OrderModal = ({ project, onClose, onSave, onDelete }) => {
  const [f, setF] = useState({ ...project });
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));
  const stegIndex = ORDER_STEG.findIndex(s => s.id === f.orderstatus);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }} onClick={onClose}>
      <div style={{ background: C.surface, borderRadius: 16, width: "100%", maxWidth: 780, maxHeight: "94vh", overflowY: "scroll", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "20px 28px 16px", borderBottom: `1px solid ${C.border}`, background: C.accentLight, borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{f.referens} · {f.orderNummer || "Fortnox-nr saknas"}</div>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.text }}>{f.namn}</div>
            <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>
              {f.produkt} · {SEK(f.värde)}
              {delfakturerat(f) > 0 && <span style={{ marginLeft: 10, color: C.orange, fontWeight: 600 }}>· Kvarstår: {SEK(kvarstående(f))}</span>}
            </div>
            {beraknaKostnad(f) > 0 && (
              <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                <span style={{ fontSize: 12, color: C.muted }}>Inköp: <strong style={{ color: C.text }}>{SEK(beraknaKostnad(f))}</strong></span>
                <span style={{ fontSize: 12, color: C.muted }}>TB: <strong style={{ color: beraknaTB(f) >= 0 ? C.green : C.red }}>{SEK(beraknaTB(f))} ({f.värde ? Math.round(beraknaTB(f) / f.värde * 100) : 0}%)</strong></span>
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted }}>×</button>
        </div>

        {/* Statusflöde */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 0, minWidth: 700 }}>
            {ORDER_STEG.map((s, i) => {
              const done = i < stegIndex;
              const active = i === stegIndex;
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <div onClick={() => { set("orderstatus", s.id); if (s.id === "i_produktion" && !f.produktionStartDatum) set("produktionStartDatum", today()); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", flex: 1 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${active ? C.accent : done ? C.green : C.border}`, background: active ? C.accent : done ? C.green : C.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: active || done ? "#fff" : C.muted, fontWeight: 700, transition: "all 0.15s" }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <div style={{ fontSize: 8, color: active ? C.accent : done ? C.green : C.muted, fontWeight: active ? 700 : 500, marginTop: 3, textAlign: "center", lineHeight: 1.2, maxWidth: 52 }}>{s.label}</div>
                  </div>
                  {i < ORDER_STEG.length - 1 && <div style={{ height: 2, flex: 0.2, background: done ? C.green : C.border, margin: "0 1px", marginBottom: 18 }} />}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: 28, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Baskort */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Kund"><input value={f.namn} onChange={e => set("namn", e.target.value)} style={inputSt} /></Field>
            <Field label="Produkt"><input value={f.produkt} onChange={e => set("produkt", e.target.value)} style={inputSt} /></Field>
            <Field label="Värde (kr)"><input type="number" value={f.värde} onChange={e => set("värde", Number(e.target.value))} style={inputSt} /></Field>
            <Field label="Kategori">
              <select value={f.kategori} onChange={e => set("kategori", e.target.value)} style={selectSt}>
                {KATEGORIER.map(k => <option key={k} value={k}>{KAT_META[k].label}</option>)}
              </select>
            </Field>
            <Field label="Fortnox-ordernummer"><input value={f.orderNummer || ""} onChange={e => set("orderNummer", e.target.value)} style={inputSt} /></Field>
            <Field label="Material"><input value={f.material || ""} onChange={e => set("material", e.target.value)} style={inputSt} /></Field>
            <Field label="Producent">
              <select value={f.producent || "Cosentino"} onChange={e => set("producent", e.target.value)} style={selectSt}>
                {["Cosentino", "Landernäs", "Luso Rochas", "Annan leverantör"].map(p => <option key={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Ansvarig"><input value={f.ansvarig} onChange={e => set("ansvarig", e.target.value)} style={inputSt} /></Field>
          </div>

          {/* Mätning & Leverans */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: C.grayLight, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Mätning</div>
              <Field label="Typ">
                <select value={f.mätningstyp || "färdiga_mått"} onChange={e => set("mätningstyp", e.target.value)} style={selectSt}>
                  <option value="färdiga_mått">Färdiga mått</option>
                  <option value="kontrollmätas">Kontrollmätas</option>
                </select>
              </Field>
              {f.mätningstyp === "kontrollmätas" && (
                <Field label="Utförs av">
                  <select value={f.mätningUE ? "ue" : "vi"} onChange={e => set("mätningUE", e.target.value === "ue")} style={selectSt}>
                    <option value="vi">Vi</option>
                    <option value="ue">Underentreprenör</option>
                  </select>
                </Field>
              )}
              <Field label="Preliminär vecka"><input value={f.prelimVeckaMätning || ""} onChange={e => set("prelimVeckaMätning", e.target.value)} placeholder="v." style={inputSt} /></Field>
              {f.mätningstyp === "kontrollmätas" && (
                <Field label="Bekräftat datum för mätning">
                  <input type="date" value={f.bekraftadMatningDatum || ""} onChange={e => set("bekraftadMatningDatum", e.target.value)} style={inputSt} />
                </Field>
              )}
              {f.mätningstyp === "kontrollmätas" && f.mätningUE && (
                <Field label="Kostnad UE mätning (kr)">
                  <input type="number" value={f.ueMatningKostnad || ""} onChange={e => set("ueMatningKostnad", e.target.value)} placeholder="0" style={inputSt} />
                </Field>
              )}
              {f.mätningstyp === "kontrollmätas" && f.mätningUE && (
                <Toggle label="UE-order för mätning skickad" val={!!f.mätningUEOrderSkickad} onChange={v => set("mätningUEOrderSkickad", v)}>
                  <div style={{ fontSize: 12, color: C.green }}>✓ Skickat</div>
                </Toggle>
              )}
            </div>
            <div style={{ background: C.grayLight, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Leverans</div>
              <Field label="Typ">
                <select value={f.leveranstyp || "skickas_till_kund"} onChange={e => set("leveranstyp", e.target.value)} style={selectSt}>
                  <option value="skickas_till_kund">Skickas till kund</option>
                  <option value="avhämtas">Avhämtas</option>
                  <option value="installeras_av_oss">Installeras av oss</option>
                </select>
              </Field>
              {f.leveranstyp === "installeras_av_oss" && (
                <Field label="Utförs av">
                  <select value={f.leveransUE ? "ue" : "vi"} onChange={e => set("leveransUE", e.target.value === "ue")} style={selectSt}>
                    <option value="vi">Vi</option>
                    <option value="ue">Underentreprenör</option>
                  </select>
                </Field>
              )}
              <Field label="Preliminär vecka"><input value={f.prelimVeckaLeverans || ""} onChange={e => set("prelimVeckaLeverans", e.target.value)} placeholder="v." style={inputSt} /></Field>
              {f.leveranstyp === "installeras_av_oss" && (
                <Field label="Bekräftat datum för installation">
                  <input type="date" value={f.bekraftadInstallationDatum || ""} onChange={e => set("bekraftadInstallationDatum", e.target.value)} style={inputSt} />
                </Field>
              )}
              {f.leveranstyp === "installeras_av_oss" && f.leveransUE && (
                <Field label="Kostnad UE installation (kr)">
                  <input type="number" value={f.ueInstallationKostnad || ""} onChange={e => set("ueInstallationKostnad", e.target.value)} placeholder="0" style={inputSt} />
                </Field>
              )}
              {f.leveranstyp === "installeras_av_oss" && f.leveransUE && (
                <Toggle label="UE-order för installation skickad" val={!!f.installationUEOrderSkickad} onChange={v => set("installationUEOrderSkickad", v)}>
                  <div style={{ fontSize: 12, color: C.green }}>✓ Skickat</div>
                </Toggle>
              )}
            </div>
          </div>

          {/* Vask */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Vask</div>
            <Toggle label="Ordern innehåller vask" val={!!f.harVask} onChange={v => set("harVask", v)}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Tillhandahåller">
                  <select value={f.vaskTillhandahåller || "vi"} onChange={e => set("vaskTillhandahåller", e.target.value)} style={selectSt}>
                    <option value="vi">Vi</option>
                    <option value="kund">Kunden</option>
                  </select>
                </Field>
                <Field label="Modell"><input value={f.vaskModell || ""} onChange={e => set("vaskModell", e.target.value)} style={inputSt} /></Field>
              </div>
              {f.vaskTillhandahåller === "vi" && (
                <Toggle label="Order skickad till vaskleverantör" val={!!f.vaskOrderSkickad} onChange={v => { set("vaskOrderSkickad", v); if (v && !f.vaskSkickadDatum) set("vaskSkickadDatum", today()); }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    <Field label="Ordernummer"><input value={f.vaskOrdernummer || ""} onChange={e => set("vaskOrdernummer", e.target.value)} style={inputSt} /></Field>
                    <Field label="Inköpspris (kr)"><input type="number" value={f.vaskInköpspris || ""} onChange={e => set("vaskInköpspris", e.target.value)} style={inputSt} /></Field>
                    <Field label="Leveransdatum"><input type="date" value={f.vaskLeveransDatum || ""} onChange={e => set("vaskLeveransDatum", e.target.value)} style={inputSt} /></Field>
                  </div>
                </Toggle>
              )}
            </Toggle>
          </div>

          {/* Order till leverantör */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Order till stenleverantör</div>
            <Toggle label="Order skickad till leverantör" val={!!f.orderSkickadLeverantör} onChange={v => { set("orderSkickadLeverantör", v); if (v && !f.leverantörSkickadDatum) set("leverantörSkickadDatum", today()); }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Ordernummer"><input value={f.leverantörOrdernummer || ""} onChange={e => set("leverantörOrdernummer", e.target.value)} style={inputSt} /></Field>
                <Field label="Inköpspris (kr)"><input type="number" value={f.leverantörInköpspris || ""} onChange={e => set("leverantörInköpspris", e.target.value)} style={inputSt} /></Field>
              </div>
            </Toggle>
          </div>

          {/* Produktion – färdigdag */}
          {(f.orderstatus === "i_produktion" || f.orderstatus === "klar_leverans" || f.orderstatus === "på_väg" || f.orderstatus === "pagaende_installation" || f.orderstatus === "installerad") && (
            <div style={{ background: C.grayLight, borderRadius: 10, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase" }}>Produktion</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Bekräftad dag färdig från produktion">
                  <input type="date" value={f.fardigDag || ""} onChange={e => set("fardigDag", e.target.value)} style={inputSt} />
                </Field>
                {f.leveranstyp === "installeras_av_oss" && f.leveransUE && (
                  <div style={{ gridColumn: "span 1" }}>
                    <Toggle label="Bekräftat att UE fått info om färdigdag" val={!!f.ueInfoSkickad} onChange={v => { set("ueInfoSkickad", v); if (v) set("ueInfoSkickadDatum", today()); }}>
                      <div style={{ fontSize: 12, color: C.green }}>✓ Klart {f.ueInfoSkickadDatum || ""}</div>
                    </Toggle>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Frakt */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Frakt</div>
            <Toggle label="Frakt ska bokas" val={!!f.fraktSkaBokas} onChange={v => set("fraktSkaBokas", v)}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Från">
                  <input value={f.fraktFran || ""} onChange={e => set("fraktFran", e.target.value)} placeholder="Avsändare / adress" style={inputSt} />
                </Field>
                <Field label="Till">
                  <input value={f.fraktTill || ""} onChange={e => set("fraktTill", e.target.value)} placeholder="Mottagare / adress" style={inputSt} />
                </Field>
                <Toggle label="Frakt bokad" val={!!f.fraktBokad} onChange={v => { set("fraktBokad", v); if (v) set("fraktBokadDatum", today()); }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    <Field label="Ordernr fraktbolag"><input value={f.fraktOrdernummer || ""} onChange={e => set("fraktOrdernummer", e.target.value)} style={inputSt} /></Field>
                    <Field label="Kostnad (kr)"><input type="number" value={f.fraktKostnad || ""} onChange={e => set("fraktKostnad", e.target.value)} style={inputSt} /></Field>
                    <Field label="Bekräftad leveransdag"><input type="date" value={f.fraktLeveransdag || ""} onChange={e => set("fraktLeveransdag", e.target.value)} style={inputSt} /></Field>
                  </div>
                </Toggle>
              </div>
            </Toggle>
          </div>

          {/* Attest */}
          <AttestPanel project={f} onChange={async v => {
            set("attester", v);
            await sb.from("projects").update({ attester: v }).eq("id", f.id);
            setProjects(ps => ps.map(p => p.id === f.id ? { ...p, attester: v } : p));
          }} />

          {/* Delfakturering */}
          <DelfaktureringPanel project={f} onChange={async v => {
            set("delfaktureringar", v);
            await sb.from("projects").update({ delfaktureringar: v }).eq("id", f.id);
            setProjects(ps => ps.map(p => p.id === f.id ? { ...p, delfaktureringar: v } : p));
          }} />

          {/* Projekt todos */}
          <ProjektTodosPanel todos={f.projektTodos} onChange={async v => {
                set("projektTodos", v);
                await sb.from("projects").update({ projekt_todos: v }).eq("id", f.id);
                setProjects(ps => ps.map(p => p.id === f.id ? { ...p, projektTodos: v } : p));
              }} />

          {/* Avsluta / fakturera order */}
          <div style={{ display: "flex", gap: 10 }}>
            {f.status !== "faktureras" && (
              <button onClick={() => onSave({ ...f, status: "faktureras" })} style={{ background: "#CFFAFE", color: "#0E7490", border: "1px solid #0E7490", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                🧾 Klar att fakturera
              </button>
            )}
            {f.status === "faktureras" && (
              <button onClick={() => onSave({ ...f, status: "avslutad" })} style={{ background: C.greenLight, color: C.green, border: `1px solid ${C.green}`, borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                ✓ Markera som avslutad
              </button>
            )}
          </div>
        </div>

        <div style={{ padding: "16px 28px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => onDelete(project.id)} style={{ background: "none", color: C.red, border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Ta bort</button>
          <button onClick={() => onSave(f)} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Spara</button>
        </div>
      </div>
    </div>
  );
};

// ── TAPPADE STATISTIK ────────────────────────────────────────────────────────
const TappadStatistik = ({ projects }) => {
  const tappade = projects.filter(p => p.status === "tappad");
  const total = tappade.length;
  const totalVärde = tappade.reduce((s, p) => s + (p.värde || 0), 0);
  const counts = {};
  TAPP_ORSAKER.forEach(o => { counts[o] = tappade.filter(p => p.tappOrsak === o).length; });

  return (
    <div style={{ background: C.redLight, border: `1px solid ${C.red}20`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.red, textTransform: "uppercase", letterSpacing: 0.8 }}>Statistik – tappade offerter</div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <div style={{ background: C.surface, borderRadius: 8, padding: "10px 16px", flex: "1 1 100px" }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Totalt tappade</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.red }}>{total}</div>
        </div>
        <div style={{ background: C.surface, borderRadius: 8, padding: "10px 16px", flex: "1 1 140px" }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Förlorat värde</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.red }}>{SEK(totalVärde)}</div>
        </div>
        {TAPP_ORSAKER.map(o => (
          <div key={o} style={{ background: C.surface, borderRadius: 8, padding: "10px 16px", flex: "1 1 90px" }}>
            <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>{o}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>{counts[o]}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{total ? Math.round(counts[o] / total * 100) : 0}%</div>
            </div>
            <div style={{ marginTop: 4, height: 4, borderRadius: 2, background: C.border, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${total ? counts[o] / total * 100 : 0}%`, background: C.red, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── ORDER PLANERINGSVY ────────────────────────────────────────────────────────
const OrderPlaneringsvyn = ({ projects, onOpen }) => {
  const orders = projects.filter(p => p.status === "order");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {ORDER_STEG.map(steg => {
        const grupp = orders.filter(p => p.orderstatus === steg.id);
        return (
          <div key={steg.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: C.grayLight, borderBottom: grupp.length ? `1px solid ${C.border}` : "none" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: grupp.length ? C.accent : C.border }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{steg.label}</div>
              <div style={{ fontSize: 11, color: C.muted, marginLeft: "auto" }}>{grupp.length} order{grupp.length !== 1 ? "s" : ""}</div>
            </div>
            {grupp.map(p => (
              <div key={p.id} onClick={() => onOpen(p)} style={{ padding: "10px 16px", display: "flex", gap: 16, alignItems: "center", cursor: "pointer", borderBottom: `1px solid ${C.border}` }}
                onMouseEnter={e => e.currentTarget.style.background = C.grayLight}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.namn}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{p.produkt} · {p.orderNummer || "Fortnox saknas"}</div>
                </div>
                <KategoriChip kategori={p.kategori} />
                {p.prelimVeckaLeverans && <div style={{ fontSize: 11, background: C.accentLight, color: C.accent, borderRadius: 6, padding: "2px 8px", fontWeight: 600 }}>v.{p.prelimVeckaLeverans}</div>}
                <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{SEK(p.värde)}</div>
                {beraknaKostnad(p) > 0 && <div style={{ fontSize: 11, fontWeight: 700, color: beraknaTB(p) >= 0 ? C.green : C.red }}>TB: {SEK(beraknaTB(p))}</div>}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// ── NY PROJEKT MODAL (flersteg) ──────────────────────────────────────────────
const NyProjektModal = ({ onClose, onSave, onSaveAndOrder, nextNummer, defaultStatus }) => {
  const [bas, setBas] = useState({
    namn: "",
    produkt: "",
    kategori: "bänkskivor",
    status: defaultStatus || "offert",
    värde: "",
    ansvarig: "",
    notat: "",
    kalkylDeadline: "",
    projektTodos: [],
  });
  const setBas_ = (k, v) => setBas(f => ({ ...f, [k]: v }));

  const lopnummer = nextNummer;
  const kanGåVidere = bas.namn.trim() && bas.produkt.trim() && (bas.status !== "kalkyl" || bas.kalkylDeadline);

  const [visaFel, setVisaFel] = useState(false);

  const handleNästa = () => {
    if (!bas.namn.trim() || !bas.produkt.trim()) { setVisaFel(true); return; }
    if (bas.status === "kalkyl" && !bas.kalkylDeadline) { setVisaFel(true); return; }
    if (bas.status === "order") {
      onSaveAndOrder(buildBas());
    } else {
      onSave(buildBas());
    }
  };

  const buildBas = () => ({
    id: Date.now(),
    referens: String(lopnummer),
    lopnummer,
    namn: bas.namn,
    produkt: bas.produkt,
    kategori: bas.kategori,
    status: bas.status,
    värde: Number(bas.värde) || 0,
    ansvarig: bas.ansvarig,
    notat: bas.notat,
    kalkylDeadline: bas.kalkylDeadline,
    uppdaterad: today(),
    uppföljningsDatum: "",
    sannolikhet: 50,
    kontaktLogg: [],
  });

  const TYPE_OPTIONS = [
    { id: "kalkyl",  label: "Räknas på",     icon: "🧮", desc: "Lead som ska kalkyleras" },
    { id: "offert",  label: "Offert",        icon: "📄", desc: "Öppen offert till kund" },
    { id: "order",   label: "Order",         icon: "📦", desc: "Bekräftad order – orderdetaljer i nästa steg" },
    { id: "service", label: "Serviceärende", icon: "🔧", desc: "Reklamation eller serviceuppdrag" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }} onClick={onClose}>
      <div style={{ background: C.surface, borderRadius: 16, width: "100%", maxWidth: 560, maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.22)" }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "22px 26px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Nytt projekt · #{lopnummer}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Grundinformation</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.muted, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 20, flex: 1, overflowY: "auto" }}>

          {/* Typ av projekt */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Typ av projekt</div>
            <div style={{ display: "flex", gap: 10 }}>
              {TYPE_OPTIONS.map(t => {
                const active = bas.status === t.id;
                return (
                  <button key={t.id} onClick={() => setBas_("status", t.id)} style={{
                    flex: 1, padding: "12px 10px", borderRadius: 10, cursor: "pointer", textAlign: "center",
                    border: `2px solid ${active ? C.accent : C.border}`,
                    background: active ? C.accentLight : C.surface,
                    transition: "all 0.15s",
                  }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: active ? C.accent : C.text }}>{t.label}</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2, lineHeight: 1.3 }}>{t.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Basfält */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Kund *">
              <input value={bas.namn} onChange={e => { setBas_("namn", e.target.value); setVisaFel(false); }} placeholder="Företagsnamn" style={{ ...inputSt, borderColor: visaFel && !bas.namn.trim() ? C.red : C.border }} autoFocus />
              {visaFel && !bas.namn.trim() && <span style={{ fontSize: 11, color: C.red, fontWeight: 600 }}>Obligatoriskt</span>}
            </Field>
            <Field label="Produkt / beskrivning *">
              <input value={bas.produkt} onChange={e => { setBas_("produkt", e.target.value); setVisaFel(false); }} placeholder="T.ex. Marmorbänkskiva 3m" style={{ ...inputSt, borderColor: visaFel && !bas.produkt.trim() ? C.red : C.border }} />
              {visaFel && !bas.produkt.trim() && <span style={{ fontSize: 11, color: C.red, fontWeight: 600 }}>Obligatoriskt</span>}
            </Field>
            <Field label="Kategori">
              <select value={bas.kategori} onChange={e => setBas_("kategori", e.target.value)} style={selectSt}>
                {KATEGORIER.map(k => <option key={k} value={k}>{KAT_META[k].label}</option>)}
              </select>
            </Field>
            <Field label="Värde (kr)">
              <input type="number" value={bas.värde} onChange={e => setBas_("värde", e.target.value)} placeholder="0" style={inputSt} />
            </Field>
            <Field label="Ansvarig">
              <input value={bas.ansvarig} onChange={e => setBas_("ansvarig", e.target.value)} placeholder="Namn" style={inputSt} />
            </Field>
            <Field label="Notat">
              <input value={bas.notat} onChange={e => setBas_("notat", e.target.value)} placeholder="Valfritt" style={inputSt} />
            </Field>
          </div>

          {/* Info om nästa steg */}
          {bas.status === "order" && (
            <div style={{ background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 10, padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 16 }}>ℹ️</span>
              <div style={{ fontSize: 13, color: C.accent }}>
                <strong>Nästa steg:</strong> Orderdetaljer – du fyller i material, mätning, leverans, vask och leverantörsorder.
              </div>
            </div>
          )}

          {/* Kalkyl-deadline */}
          {bas.status === "kalkyl" && (
            <div style={{ background: C.tealLight, border: `1px solid ${C.teal}40`, borderRadius: 10, padding: "16px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.teal, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Deadline för offert</div>
              <Field label="Offerten ska vara klar senast *">
                <input
                  type="date"
                  value={bas.kalkylDeadline}
                  style={{ ...inputSt, borderColor: visaFel && !bas.kalkylDeadline ? C.red : C.border }}
                  onChange={e => { setBas_("kalkylDeadline", e.target.value); setVisaFel(false); }}
                />
                {visaFel && !bas.kalkylDeadline && (
                  <span style={{ fontSize: 11, color: C.red, marginTop: 3, fontWeight: 600 }}>Obligatoriskt för kalkyler</span>
                )}
              </Field>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 26px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={onClose} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: C.muted, fontWeight: 600, fontSize: 13 }}>Avbryt</button>
          <button
            onClick={handleNästa}
            style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 22px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, opacity: kanGåVidere ? 1 : 0.45 }}
          >
            {bas.status === "order" ? "Nästa: Orderdetaljer →" : "Skapa projekt"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── GENERISK PROJEKTTABELL ───────────────────────────────────────────────────
const ProjektTabell = ({ projects, onOpen, showUppfoljning }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
    <div style={{ display: "grid", gridTemplateColumns: showUppfoljning ? "0.7fr 1.2fr 1.1fr 90px 100px 90px 80px" : "0.7fr 1.2fr 1.1fr 100px 90px 80px", borderBottom: `1px solid ${C.border}`, padding: "10px 16px", background: C.grayLight }}>
      {["Referens", "Kund", "Produkt", showUppfoljning ? "Uppföljning" : null, "Kategori", "Status", "Värde"].filter(Boolean).map(h => (
        <div key={h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 0.5, textTransform: "uppercase" }}>{h}</div>
      ))}
    </div>
    {projects.length === 0 ? (
      <div style={{ padding: 48, textAlign: "center", color: C.muted, fontSize: 14 }}>Inga projekt matchar.</div>
    ) : projects.map((p, i) => {
      const dagar = p.uppföljningsDatum ? Math.round((new Date(p.uppföljningsDatum) - new Date()) / 86400000) : null;
      const uppfColor = dagar === null ? C.muted : dagar < 0 ? C.red : dagar <= 2 ? C.orange : C.green;
      return (
        <div key={p.id} onClick={() => onOpen(p)} style={{ display: "grid", gridTemplateColumns: showUppfoljning ? "0.7fr 1.2fr 1.1fr 90px 100px 90px 80px" : "0.7fr 1.2fr 1.1fr 100px 90px 80px", padding: "12px 16px", cursor: "pointer", borderBottom: i < projects.length - 1 ? `1px solid ${C.border}` : "none", background: "transparent", transition: "background 0.1s" }}
          onMouseEnter={e => e.currentTarget.style.background = C.grayLight}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "flex", alignItems: "center" }}>
            {p.referens}{p.orderNummer ? <span style={{ color: C.accent }}>-{p.orderNummer.replace(/[^0-9]/g,'')}</span> : ""}
          </div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{p.namn}</div>
            {p.kalkylDeadline && <div style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>⏰ Deadline: {p.kalkylDeadline}</div>}
            {!p.kalkylDeadline && p.notat && <div style={{ fontSize: 11, color: C.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{p.notat}</div>}
          </div>
          <div style={{ fontSize: 13, color: C.text, display: "flex", alignItems: "center" }}>{p.produkt}</div>
          {showUppfoljning && (
            <div style={{ display: "flex", alignItems: "center" }}>
              {dagar !== null ? <span style={{ fontSize: 11, fontWeight: 700, color: uppfColor }}>{dagar < 0 ? `${Math.abs(dagar)}d sen` : dagar === 0 ? "Idag" : `${dagar}d`}</span> : <span style={{ fontSize: 11, color: C.muted }}>—</span>}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center" }}><KategoriChip kategori={p.kategori} /></div>
          <div style={{ display: "flex", alignItems: "center" }}><StatusBadge status={p.status} /></div>
          <div style={{ fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>{SEK(p.värde)}</div>
        </div>
      );
    })}
  </div>
);


// ── HJÄLP: vecka → datum (måndag den veckan) ─────────────────────────────────
const veckaDatum = (vecka) => {
  if (!vecka) return null;
  const v = parseInt(vecka);
  if (isNaN(v)) return null;
  const year = new Date().getFullYear();
  const jan4 = new Date(year, 0, 4);
  const startOfWeek1 = new Date(jan4);
  startOfWeek1.setDate(jan4.getDate() - ((jan4.getDay() + 6) % 7));
  const d = new Date(startOfWeek1);
  d.setDate(d.getDate() + (v - 1) * 7);
  return d;
};

const dagnarKvar = (datum) => {
  if (!datum) return null;
  return Math.round((new Date(datum) - new Date()) / 86400000);
};

const veckarKvar = (vecka) => {
  const d = veckaDatum(vecka);
  if (!d) return null;
  return Math.round((d - new Date()) / 86400000 / 7);
};

const BradeskorFarg = (dagar) => {
  if (dagar === null) return C.muted;
  if (dagar < 0) return C.red;
  if (dagar <= 7) return C.orange;
  return C.green;
};




// ── ATTEST-KOMPONENT ─────────────────────────────────────────────────────────
const AttestRad = ({ label, budgetBelopp, attestKey, attester, onChange }) => {
  const a = (attester || {})[attestKey] || {};
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ faktiskKostnad: a.faktiskKostnad || "", fakturanummer: a.fakturanummer || "", fakturadatum: a.fakturadatum || "" });

  if (!budgetBelopp && !a.faktiskKostnad) return null;

  const spara = () => {
    onChange({ ...(attester || {}), [attestKey]: { ...form, attesterad: true, attestDatum: today() } });
    setOpen(false);
  };

  const avAttest = () => {
    const ny = { ...(attester || {}) };
    delete ny[attestKey];
    onChange(ny);
    setOpen(false);
  };

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: a.attesterad ? C.greenLight : C.surface, cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${a.attesterad ? C.green : C.border}`, background: a.attesterad ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {a.attesterad && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{label}</div>
          <div style={{ fontSize: 11, color: C.muted }}>
            Budget: {SEK(Number(budgetBelopp) || 0)}
            {a.faktiskKostnad && <span style={{ color: a.faktiskKostnad > budgetBelopp ? C.red : C.green, marginLeft: 8 }}>· Faktura: {SEK(Number(a.faktiskKostnad))}</span>}
            {a.fakturanummer && <span style={{ color: C.muted, marginLeft: 8 }}>· #{a.fakturanummer}</span>}
          </div>
        </div>
        <span style={{ color: C.muted, fontSize: 12 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: 14, borderTop: `1px solid ${C.border}`, background: C.grayLight, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <Field label="Faktisk kostnad (kr)"><input type="number" value={form.faktiskKostnad} onChange={e => setForm(f => ({ ...f, faktiskKostnad: e.target.value }))} style={inputSt} /></Field>
            <Field label="Fakturanummer"><input value={form.fakturanummer} onChange={e => setForm(f => ({ ...f, fakturanummer: e.target.value }))} style={inputSt} /></Field>
            <Field label="Fakturadatum"><input type="date" value={form.fakturadatum} onChange={e => setForm(f => ({ ...f, fakturadatum: e.target.value }))} style={inputSt} /></Field>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={spara} style={{ background: C.green, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, cursor: "pointer" }}>✓ Attestera</button>
            {a.attesterad && <button onClick={avAttest} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 14px", cursor: "pointer", color: C.muted, fontSize: 13 }}>Ta bort attest</button>}
          </div>
        </div>
      )}
    </div>
  );
};

const AttestPanel = ({ project, onChange }) => {
  const harNågot = project.leverantörInköpspris || project.vaskInköpspris || project.fraktKostnad || project.ueMatningKostnad || project.ueInstallationKostnad;
  if (!harNågot) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Attestera fakturor</div>
      {project.leverantörInköpspris && <AttestRad label={`Stenmaterial – ${project.producent || "Leverantör"}`} budgetBelopp={project.leverantörInköpspris} attestKey="sten" attester={project.attester} onChange={onChange} />}
      {project.vaskInköpspris && project.harVask && <AttestRad label={`Vask – ${project.vaskModell || "Vask"}`} budgetBelopp={project.vaskInköpspris} attestKey="vask" attester={project.attester} onChange={onChange} />}
      {project.ueMatningKostnad && project.mätningUE && <AttestRad label="UE Mätning" budgetBelopp={project.ueMatningKostnad} attestKey="uematning" attester={project.attester} onChange={onChange} />}
      {project.ueInstallationKostnad && project.leveransUE && <AttestRad label="UE Installation" budgetBelopp={project.ueInstallationKostnad} attestKey="ueinstallation" attester={project.attester} onChange={onChange} />}
      {project.fraktKostnad && project.fraktSkaBokas && <AttestRad label="Frakt" budgetBelopp={project.fraktKostnad} attestKey="frakt" attester={project.attester} onChange={onChange} />}
    </div>
  );
};

// ── DELFAKTURERING ───────────────────────────────────────────────────────────
const DelfaktureringPanel = ({ project, onChange }) => {
  const [nyttBelopp, setNyttBelopp] = useState("");
  const [nyttDatum, setNyttDatum] = useState("");
  const [nyttNotat, setNyttNotat] = useState("");

  const laggTill = () => {
    if (!nyttBelopp) return;
    const ny = { id: Date.now(), belopp: Number(nyttBelopp), datum: nyttDatum, notat: nyttNotat };
    onChange([...(project.delfaktureringar || []), ny]);
    setNyttBelopp(""); setNyttDatum(""); setNyttNotat("");
  };

  const tabort = (id) => onChange((project.delfaktureringar || []).filter(d => d.id !== id));

  const totalt = delfakturerat(project);
  const kvar = kvarstående(project);
  const pct = project.värde ? Math.round(totalt / project.värde * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Delfakturering</div>

      {/* Summering */}
      {(project.delfaktureringar || []).length > 0 && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ background: C.greenLight, borderRadius: 8, padding: "8px 14px" }}>
            <div style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>Fakturerat</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.green }}>{SEK(totalt)} <span style={{ fontSize: 11, fontWeight: 400 }}>({pct}%)</span></div>
          </div>
          <div style={{ background: C.orangeLight, borderRadius: 8, padding: "8px 14px" }}>
            <div style={{ fontSize: 11, color: C.orange, fontWeight: 600 }}>Kvarstår</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.orange }}>{SEK(kvar)}</div>
          </div>
        </div>
      )}

      {/* Lista */}
      {(project.delfaktureringar || []).map((d, i) => (
        <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: C.grayLight, borderRadius: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{SEK(d.belopp)}</div>
            <div style={{ fontSize: 11, color: C.muted }}>{d.datum || "Inget datum"}{d.notat ? ` · ${d.notat}` : ""}</div>
          </div>
          <button onClick={() => tabort(d.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 16 }}>×</button>
        </div>
      ))}

      {/* Ny rad */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 130px 1fr auto", gap: 8 }}>
        <input type="number" value={nyttBelopp} onChange={e => setNyttBelopp(e.target.value)} placeholder="Belopp (kr)" style={inputSt} />
        <input type="date" value={nyttDatum} onChange={e => setNyttDatum(e.target.value)} style={inputSt} />
        <input value={nyttNotat} onChange={e => setNyttNotat(e.target.value)} placeholder="Notat (valfritt)" style={inputSt} />
        <button onClick={laggTill} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>+ Lägg till</button>
      </div>
    </div>
  );
};

// ── PROJEKT TODOS MINI-KOMPONENT ─────────────────────────────────────────────
const ProjektTodosPanel = ({ todos, onChange }) => {
  const [nyText, setNyText] = useState("");
  const [nyDatum, setNyDatum] = useState("");

  const laggTill = () => {
    if (!nyText.trim()) return;
    const ny = { id: Date.now(), text: nyText.trim(), datum: nyDatum, klar: false };
    onChange([...(todos || []), ny]);
    setNyText("");
    setNyDatum("");
  };

  const toggleKlar = (id) => {
    onChange((todos || []).map(t => t.id === id ? { ...t, klar: !t.klar } : t));
  };

  const tabort = (id) => {
    onChange((todos || []).filter(t => t.id !== id));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.8 }}>Att göra</div>
      {(todos || []).map(t => {
        const d = t.datum ? Math.round((new Date(t.datum) - new Date()) / 86400000) : null;
        const fc = d === null ? C.muted : d < 0 ? C.red : d <= 3 ? C.orange : C.green;
        return (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: t.klar ? C.grayLight : C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
            <input type="checkbox" checked={t.klar} onChange={() => toggleKlar(t.id)} style={{ width: 16, height: 16, cursor: "pointer", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: t.klar ? C.muted : C.text, textDecoration: t.klar ? "line-through" : "none" }}>{t.text}</div>
              {t.datum && <div style={{ fontSize: 11, fontWeight: 600, color: t.klar ? C.muted : fc }}>
                {d === null ? "" : d < 0 ? `${Math.abs(d)} dagar sen` : d === 0 ? "Idag!" : `Om ${d} dagar`} · {t.datum}
              </div>}
            </div>
            <button onClick={() => tabort(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 16, lineHeight: 1 }}>×</button>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 8 }}>
        <input value={nyText} onChange={e => setNyText(e.target.value)} onKeyDown={e => e.key === "Enter" && laggTill()} placeholder="Ny uppgift…" style={{ ...inputSt, flex: 1 }} />
        <input type="date" value={nyDatum} onChange={e => setNyDatum(e.target.value)} style={{ ...inputSt, width: 140 }} />
        <button onClick={laggTill} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 14px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>+ Lägg till</button>
      </div>
    </div>
  );
};

// ── ATT-GÖRA PANEL ───────────────────────────────────────────────────────────
const AtterGoraPanel = ({ projects, onOpen, kategoriFilter, onIgnorera }) => {
  const [katFilter, setKatFilter] = useState(kategoriFilter || null);

  // Generera uppgifter från alla projekt
  const uppgifter = [];



  const arIgnorerad = (projektId, nyckel) => {
    if (!nyckel) return false;
    const p = projects.find(pr => pr.id === projektId);
    if (!p) return false;
    const val = (p.ignoreradeTodos || {})[nyckel];
    if (!val) return false;
    if (val === "permanent") return true;
    if (val > today()) return true;
    return false;
  };

  projects.forEach(p => {
    if (katFilter && p.kategori !== katFilter) return;

    // Kalkyl-deadline
    if (p.status === "kalkyl" && p.kalkylDeadline) {
      const d = dagnarKvar(p.kalkylDeadline);
      if (!arIgnorerad(p.id, "kalkyl")) uppgifter.push({
        id: `kalkyl-${p.id}`, projekt: p, typ: "kalkyl",
        ikon: "🧮", label: "Offert ska räknas klart",
        detalj: `Deadline: ${p.kalkylDeadline}`,
        dagar: d, sortera: d ?? 9999, ignoreraNyckel: "kalkyl",
      });
    }

    // Mätning (order med preliminär vecka) – döljs när orderstatus passerat mätning eller bekräftat datum finns
    const matningKlar = ["mätning_utförd", "i_produktion", "klar_leverans", "på_väg", "pagaende_installation", "installerad", "faktureras"].includes(p.orderstatus);
    if (p.status === "order" && p.prelimVeckaMätning && p.mätningstyp === "kontrollmätas" && !matningKlar && !p.bekraftadMatningDatum) {
      const v = veckarKvar(p.prelimVeckaMätning);
      uppgifter.push({
        id: `matning-${p.id}`, projekt: p, typ: "matning",
        ikon: "📐", label: "Mätning ska utföras",
        detalj: `v.${p.prelimVeckaMätning}${p.mätningUE ? " (UE)" : " (vi)"}`,
        dagar: v !== null ? v * 7 : null, sortera: v !== null ? v * 7 : 9999, ignoreraNyckel: "matning",
      });
    }

    // Leverans (order med preliminär vecka)
    if (p.status === "order" && p.prelimVeckaLeverans) {
      const v = veckarKvar(p.prelimVeckaLeverans);
      uppgifter.push({
        id: `leverans-${p.id}`, projekt: p, typ: "leverans",
        ikon: "🚚", label: "Leverans",
        ignoreraNyckel: "leverans", detalj: `v.${p.prelimVeckaLeverans}${p.leveranstyp === "installeras_av_oss" ? (p.leveransUE ? " · Installation (UE)" : " · Installation (vi)") : p.leveranstyp === "avhämtas" ? " · Avhämtas" : " · Skickas"}`,
        dagar: v !== null ? v * 7 : null, sortera: v !== null ? v * 7 : 9999,
      });
    }

    // Vaskorder ej skickad
    if (p.status === "order" && p.harVask && p.vaskTillhandahåller === "vi" && !p.vaskOrderSkickad) {
      uppgifter.push({
        id: `vask-${p.id}`, projekt: p, typ: "vask",
        ikon: "🪣", label: "Vaskorder ej skickad till leverantör", ignoreraNyckel: "vask_order",
        detalj: p.vaskModell || "Modell ej angiven",
        dagar: null, sortera: -1,
      });
    }

    // Order ej skickad till stenleverantör
    if (p.status === "order" && !p.orderSkickadLeverantör) {
      uppgifter.push({
        id: `stenorder-${p.id}`, projekt: p, typ: "stenorder",
        ikon: "📋", label: "Order ej skickad till stenleverantör", ignoreraNyckel: "sten_order",
        detalj: p.producent || "Leverantör ej vald",
        dagar: null, sortera: -1,
      });
    }

    // Stenleverantör: skickad men saknar ordernummer/pris efter 5 dagar
    if (p.status === "order" && p.orderSkickadLeverantör && p.leverantörSkickadDatum) {
      const dagarSedan = Math.round((new Date() - new Date(p.leverantörSkickadDatum)) / 86400000);
      const saknarInfo = !p.leverantörOrdernummer || !p.leverantörInköpspris;
      if (dagarSedan >= 5 && saknarInfo) {
        uppgifter.push({
          id: `stenorder-info-${p.id}`, projekt: p, typ: "varning",
          ikon: "⚠️", ignoreraNyckel: "sten_info", label: `Ordernr/pris saknas hos ${p.producent || "leverantör"} – skickades för ${dagarSedan} dagar sedan`,
          detalj: `Fyll i ordernummer och inköpspris`,
          dagar: -1, sortera: -2,
        });
      }
    }

    // Vask: skickad men saknar ordernummer/pris efter 5 dagar
    if (p.status === "order" && p.harVask && p.vaskTillhandahåller === "vi" && p.vaskOrderSkickad && p.vaskSkickadDatum) {
      const dagarSedan = Math.round((new Date() - new Date(p.vaskSkickadDatum)) / 86400000);
      const saknarInfo = !p.vaskOrdernummer || !p.vaskInköpspris;
      if (dagarSedan >= 5 && saknarInfo) {
        uppgifter.push({
          id: `vask-info-${p.id}`, projekt: p, typ: "varning",
          ikon: "⚠️", ignoreraNyckel: "vask_info", label: `Vasknr/pris saknas – order skickades för ${dagarSedan} dagar sedan`,
          detalj: `${p.vaskModell || "Vask"} – fyll i ordernummer och inköpspris`,
          dagar: -1, sortera: -2,
        });
      }
    }

    // UE-mätning: order till UE ska vara skickad 2 veckor innan mätningsveckan
    if (p.status === "order" && p.mätningstyp === "kontrollmätas" && p.mätningUE && p.prelimVeckaMätning && !matningKlar) {
      const matningDatum = veckaDatum(parseInt(p.prelimVeckaMätning));
      if (matningDatum) {
        const deadline = new Date(matningDatum);
        deadline.setDate(deadline.getDate() - 14);
        const d = Math.round((deadline - new Date()) / 86400000);
        if (!p.mätningUEOrderSkickad) {
          uppgifter.push({
            id: `ue-mat-${p.id}`, projekt: p, typ: "ue",
            ikon: "📐", label: "UE-order för mätning ej skickad", ignoreraNyckel: "ue_mat",
            detalj: `Ska vara skickat senast ${deadline.toLocaleDateString("sv-SE")} (2v före v.${p.prelimVeckaMätning})`,
            dagar: d, sortera: d,
          });
        }
      }
    }

    // UE-installation: order till UE ska vara skickad 2 veckor innan leveransveckan
    if (p.status === "order" && p.leveranstyp === "installeras_av_oss" && p.leveransUE && p.prelimVeckaLeverans) {
      const levDatum = veckaDatum(parseInt(p.prelimVeckaLeverans));
      if (levDatum) {
        const deadline = new Date(levDatum);
        deadline.setDate(deadline.getDate() - 14);
        const d = Math.round((deadline - new Date()) / 86400000);
        if (!p.installationUEOrderSkickad) {
          uppgifter.push({
            id: `ue-inst-${p.id}`, projekt: p, typ: "ue",
            ikon: "🔨", label: "UE-order för installation ej skickad", ignoreraNyckel: "ue_inst",
            detalj: `Ska vara skickat senast ${deadline.toLocaleDateString("sv-SE")} (2v före v.${p.prelimVeckaLeverans})`,
            dagar: d, sortera: d,
          });
        }
      }
    }

    // Vask måste beställas senast samma vecka som mätning
    if (p.status === "order" && p.harVask && p.vaskTillhandahåller === "vi" && !p.vaskOrderSkickad && p.prelimVeckaMätning) {
      const matningDatum = veckaDatum(parseInt(p.prelimVeckaMätning));
      if (matningDatum) {
        const d = Math.round((matningDatum - new Date()) / 86400000);
        uppgifter.push({
          id: `vask-timing-${p.id}`, projekt: p, typ: "vask",
          ikon: "🪣", label: "Vask måste beställas senast mätningsveckan", ignoreraNyckel: "vask_timing",
          detalj: `Mätning v.${p.prelimVeckaMätning} – beställ senast då`,
          dagar: d, sortera: d + 0.5,
        });
      }
    }

    // Bekräfta färdigdag: inom 5 arbetsdagar efter att ordern gick till produktion
    if (p.status === "order" && p.orderstatus === "i_produktion" && p.produktionStartDatum && !p.fardigDag) {
      const start = new Date(p.produktionStartDatum);
      // Räkna 5 arbetsdagar
      let arbetsdagar = 0;
      const deadline = new Date(start);
      while (arbetsdagar < 5) {
        deadline.setDate(deadline.getDate() + 1);
        const dag = deadline.getDay();
        if (dag !== 0 && dag !== 6) arbetsdagar++;
      }
      const d = Math.round((deadline - new Date()) / 86400000);
      uppgifter.push({
        id: `fardigdag-${p.id}`, projekt: p, typ: "produktion",
        ikon: "📅", label: "Bekräfta dag när ordern är färdig från produktion", ignoreraNyckel: "fardigdag",
        detalj: `Order i produktion sedan ${p.produktionStartDatum} – svar senast ${deadline.toLocaleDateString("sv-SE")}`,
        dagar: d, sortera: d,
      });
    }

    // Info till installations-UE när färdigdag är bekräftad
    if (p.status === "order" && p.fardigDag && p.leveranstyp === "installeras_av_oss" && p.leveransUE && !p.ueInfoSkickad) {
      uppgifter.push({
        id: `ue-info-${p.id}`, projekt: p, typ: "varning",
        ikon: "📲", label: "Skicka färdigdag till installations-UE", ignoreraNyckel: "ue_info_dag",
        detalj: `Färdig: ${p.fardigDag} – UE har inte fått info`,
        dagar: 0, sortera: -1.5,
      });
    }

    // Projekt-todos med deadline
    if (p.projektTodos && p.projektTodos.length > 0) {
      p.projektTodos.forEach(todo => {
        if (todo.klar) return;
        const d = todo.datum ? Math.round((new Date(todo.datum) - new Date()) / 86400000) : null;
        uppgifter.push({
          id: `todo-${p.id}-${todo.id}`, projekt: p, typ: "todo",
          ikon: "☑️", label: todo.text, ignoreraNyckel: `todo_${todo.id}`,
          detalj: p.namn,
          dagar: d, sortera: d !== null ? d : 9998,
        });
      });
    }

    // Frakt: ska vara bokad senast 3 dagar innan färdigdag
    if (p.status === "order" && p.fraktSkaBokas && !p.fraktBokad && p.fardigDag) {
      const fardig = new Date(p.fardigDag);
      const deadline = new Date(fardig);
      deadline.setDate(deadline.getDate() - 3);
      const d = Math.round((deadline - new Date()) / 86400000);
      uppgifter.push({
        id: `frakt-${p.id}`, projekt: p, typ: "frakt",
        ikon: "🚛", label: "Frakt ej bokad", ignoreraNyckel: "frakt",
        detalj: `Boka senast ${deadline.toLocaleDateString("sv-SE")} (3 dagar före färdig ${p.fardigDag})`,
        dagar: d, sortera: d,
      });
    }

    // Bekräfta exakt mätningsdatum senast 1 vecka innan preliminär mätningsvecka
    if (p.status === "order" && p.mätningstyp === "kontrollmätas" && p.prelimVeckaMätning && !p.bekraftadMatningDatum && !matningKlar) {
      const matningStart = veckaDatum(parseInt(p.prelimVeckaMätning));
      if (matningStart) {
        const deadline = new Date(matningStart);
        deadline.setDate(deadline.getDate() - 7);
        const d = Math.round((deadline - new Date()) / 86400000);
        uppgifter.push({
          id: `bekrafta-matning-${p.id}`, projekt: p, typ: "matning",
          ikon: "📅", label: "Bekräfta exakt datum för mätning", ignoreraNyckel: "bekr_mat",
          detalj: `Senast ${deadline.toLocaleDateString("sv-SE")} – 1 vecka före prel. v.${p.prelimVeckaMätning}`,
          dagar: d, sortera: d - 0.1,
        });
      }
    }

    // Bekräfta exakt installationsdatum senast 1 vecka innan preliminär leveransvecka
    if (p.status === "order" && p.leveranstyp === "installeras_av_oss" && p.prelimVeckaLeverans && !p.bekraftadInstallationDatum) {
      const levStart = veckaDatum(parseInt(p.prelimVeckaLeverans));
      if (levStart) {
        const deadline = new Date(levStart);
        deadline.setDate(deadline.getDate() - 7);
        const d = Math.round((deadline - new Date()) / 86400000);
        uppgifter.push({
          id: `bekrafta-installation-${p.id}`, projekt: p, typ: "leverans",
          ikon: "🔨", label: "Bekräfta exakt datum för installation", ignoreraNyckel: "bekr_inst",
          detalj: `Senast ${deadline.toLocaleDateString("sv-SE")} – 1 vecka före prel. v.${p.prelimVeckaLeverans}`,
          dagar: d, sortera: d - 0.1,
        });
      }
    }

    // Varna om färdigdag från produktion är senare än 2 dagar före bekräftad installation
    if (p.status === "order" && p.fardigDag && p.bekraftadInstallationDatum) {
      const fardig = new Date(p.fardigDag);
      const installation = new Date(p.bekraftadInstallationDatum);
      const dagarMellan = Math.round((installation - fardig) / 86400000);
      if (dagarMellan < 2) {
        uppgifter.push({
          id: `fardig-konflikt-${p.id}`, projekt: p, typ: "varning",
          ikon: "⚠️", label: "Färdigdag för nära installationsdatum", ignoreraNyckel: "fardig_konflikt",
          detalj: `Klar ${p.fardigDag} – installation ${p.bekraftadInstallationDatum} (${dagarMellan} dag${dagarMellan !== 1 ? "ar" : ""} mellanrum, behöver minst 2)`,
          dagar: -1, sortera: -3,
        });
      }
    }
  });

  // Filter out ignored/snoozed items
  const visaUppgifter = uppgifter.filter(u => !arIgnorerad(u.projekt.id, u.ignoreraNyckel));
  visaUppgifter.sort((a, b) => a.sortera - b.sortera);

  const TYP_FARG = {
    kalkyl:     { color: C.teal,   bg: C.tealLight },
    matning:    { color: C.purple, bg: C.purpleLight },
    leverans:   { color: C.accent, bg: C.accentLight },
    vask:       { color: C.orange, bg: C.orangeLight },
    stenorder:  { color: C.red,    bg: C.redLight },
    varning:    { color: "#fff",   bg: C.red },
    ue:         { color: "#5B21B6", bg: "#EDE9FE" },
    produktion: { color: "#065F46", bg: "#D1FAE5" },
    frakt:      { color: "#1E40AF", bg: "#DBEAFE" },
    todo:       { color: "#374151", bg: "#F3F4F6" },
  };

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
      {/* Header */}
      <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", background: C.grayLight }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>✅</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Att göra</span>
          {uppgifter.length > 0 && (
            <span style={{ fontSize: 11, fontWeight: 700, background: C.red, color: "#fff", borderRadius: 10, padding: "1px 7px" }}>{uppgifter.length}</span>
          )}
        </div>
        {/* Kategorifilter */}
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => setKatFilter(null)} style={{ padding: "3px 10px", borderRadius: 20, border: `1.5px solid ${katFilter === null ? C.accent : C.border}`, background: katFilter === null ? C.accentLight : C.surface, color: katFilter === null ? C.accent : C.muted, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Alla</button>
          {KATEGORIER.map(k => {
            const m = KAT_META[k]; const active = katFilter === k;
            return <button key={k} onClick={() => setKatFilter(active ? null : k)} style={{ padding: "3px 10px", borderRadius: 20, border: `1.5px solid ${active ? m.color : C.border}`, background: active ? m.bg : C.surface, color: active ? m.color : C.muted, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{m.label}</button>;
          })}
        </div>
      </div>

      {/* Lista */}
      {visaUppgifter.length === 0 ? (
        <div style={{ padding: "24px", textAlign: "center", color: C.muted, fontSize: 13 }}>
          Inga uppgifter att visa 🎉
        </div>
      ) : (
        <div>
          {visaUppgifter.map((u, i) => {
            const tf = TYP_FARG[u.typ] || TYP_FARG.kalkyl;
            const nyckel = u.ignoreraNyckel || u.id;
            const tidsstatus = u.dagar === null ? <span style={{ fontSize: 11, fontWeight: 700, color: C.red, background: C.redLight, padding: "2px 8px", borderRadius: 6 }}>Åtgärda</span>
              : u.dagar < 0 ? <span style={{ fontSize: 11, fontWeight: 700, color: C.red }}>{Math.abs(u.dagar)}d sen</span>
              : u.dagar === 0 ? <span style={{ fontSize: 11, fontWeight: 700, color: C.red }}>Idag!</span>
              : u.dagar <= 7 ? <span style={{ fontSize: 11, fontWeight: 700, color: C.orange }}>Om {u.dagar}d</span>
              : <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>v.{u.projekt.prelimVeckaLeverans || u.projekt.prelimVeckaMätning || "?"}</span>;
            return (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 18px", borderBottom: i < visaUppgifter.length - 1 ? `1px solid ${C.border}` : "none", background: "transparent", transition: "background 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.grayLight}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {/* Klickbar del */}
                <div onClick={() => onOpen(u.projekt)} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, cursor: "pointer", minWidth: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: tf.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{u.ikon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: tf.color, marginBottom: 1 }}>{u.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{u.projekt.namn} <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>#{u.projekt.referens}</span></div>
                    <div style={{ fontSize: 11, color: C.muted }}>{u.detalj}</div>
                  </div>
                  <KategoriChip kategori={u.projekt.kategori} />
                  <div style={{ fontSize: 11, color: C.muted, whiteSpace: "nowrap" }}>{u.projekt.ansvarig}</div>
                  <div style={{ minWidth: 60, textAlign: "right" }}>{tidsstatus}</div>
                </div>
                {/* Knappar – UTANFÖR klickbar del */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <button onClick={() => { onIgnorera && onIgnorera(u.projekt, nyckel, "snooze7"); }} style={{ background: C.orangeLight, border: "none", borderRadius: 6, padding: "5px 9px", cursor: "pointer", fontSize: 13, color: C.orange }}>💤</button>
                  <button onClick={() => { onIgnorera && onIgnorera(u.projekt, nyckel, "permanent"); }} style={{ background: C.grayLight, border: "none", borderRadius: 6, padding: "5px 9px", cursor: "pointer", fontSize: 13, color: C.muted, fontWeight: 700 }}>✕</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── HUVUD-APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nextLopnummer, setNextLopnummer] = useState(START_LOPNUMMER);
  const [activePage, setActivePage] = useState("alla");
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [orderFormProjekt, setOrderFormProjekt] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Ladda projekt från Supabase
  useEffect(() => {
    fetch(`${API}?order=id.desc`, { headers: HEADERS })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const mapped = data.map(fromDb);
          setProjects(mapped);
          const maxNr = mapped.reduce((m, p) => Math.max(m, p.lopnummer || 0), START_LOPNUMMER - 1);
          setNextLopnummer(maxNr + 1);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const page = PAGES.find(p => p.id === activePage);
  const filtered = projects
    .filter(p => page.filter ? p.status === page.filter : true)
    .filter(p => kategoriFilter ? p.kategori === kategoriFilter : true)
    .filter(p => {
      const q = search.toLowerCase();
      return !q || p.namn.toLowerCase().includes(q) || p.produkt.toLowerCase().includes(q) || p.referens.toLowerCase().includes(q);
    });

  const totalVärde = filtered.reduce((s, p) => s + (p.värde || 0), 0);
  const totalKvarstaende = filtered.reduce((s, p) => s + kvarstående(p), 0);
  const counts = Object.fromEntries(Object.keys(STATUS_META).map(k => [k, projects.filter(p => p.status === k).length]));

  const saveProject = async (updated) => {
    const data = { ...toDb(updated), uppdaterad: today() };
    setSaving(true);
    await fetch(`${API}?id=eq.${updated.id}`, { method: "PATCH", headers: HEADERS, body: JSON.stringify(data) });
    setSaving(false);
    setProjects(ps => ps.map(p => p.id === updated.id ? { ...updated, uppdaterad: today() } : p));
    setSelected(null);
  };
  const deleteProject = async (id) => {
    await fetch(`${API}?id=eq.${id}`, { method: "DELETE", headers: HEADERS });
    setProjects(ps => ps.filter(p => p.id !== id));
    setSelected(null);
  };
  const addProject = async (p) => {
    setSaving(true);
    const { id: _id, ...rest } = p;
    const res = await fetch(API, { method: "POST", headers: HEADERS, body: JSON.stringify(toDb(rest)) });
    const [saved] = await res.json();
    setSaving(false);
    if (saved) setProjects(ps => [fromDb(saved), ...ps]);
    setNextLopnummer(n => n + 1);
    setShowNew(false);
  };

  const promoteToOrder = (proj) => {
    setSelected(null);
    setOrderFormProjekt(proj);
  };

  // Called when user picks "Order" in NyProjektModal → go straight to order form
  const newProjectAsOrder = (basProj) => {
    setShowNew(false);
    setOrderFormProjekt(basProj);
  };

  const saveOrder = async (orderData) => {
    const withStatus = { ...orderData, status: "order", uppdaterad: today() };
    setSaving(true);
    const exists = projects.some(p => p.id === orderData.id);
    if (exists) {
      await fetch(`${API}?id=eq.${orderData.id}`, { method: "PATCH", headers: HEADERS, body: JSON.stringify(toDb(withStatus)) });
      setProjects(ps => ps.map(p => p.id === orderData.id ? withStatus : p));
    } else {
      const { id: _id, ...rest } = withStatus;
      const res = await fetch(API, { method: "POST", headers: HEADERS, body: JSON.stringify(toDb(rest)) });
      const [saved] = await res.json();
      if (saved) setProjects(ps => [fromDb(saved), ...ps]);
    }
    setSaving(false);
    setOrderFormProjekt(null);
  };

  const openProject = (p) => setSelected(p);

  const ignoreraTodo = async (projekt, nyckel, typ) => {
    if (!nyckel || !projekt) return;
    const snoozeDate = typ === "snooze7" ? new Date(Date.now() + 7*24*60*60*1000).toISOString().slice(0,10) : "permanent";
    const nyIgnorade = { ...(projekt.ignoreradeTodos || {}), [nyckel]: snoozeDate };
    setProjects(ps => ps.map(p => p.id === projekt.id ? { ...p, ignoreradeTodos: nyIgnorade } : p));
    await sb.from("projects").update({ ignorerade_todos: nyIgnorade }).eq("id", projekt.id);
  };

  if (loading) return (
    <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif", background: C.bg, flexDirection: "column", gap: 16 }}>
      <div style={{ width: 40, height: 40, border: `4px solid ${C.border}`, borderTop: `4px solid ${C.accent}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <div style={{ fontSize: 14, color: C.muted }}>Laddar projekt…</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: C.bg, color: C.text }}>


      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? 220 : 0, minWidth: sidebarOpen ? 220 : 0, background: C.text, display: "flex", flexDirection: "column", transition: "width 0.2s, min-width 0.2s", overflow: "hidden" }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: -0.3 }}>⬡ Projektportalen</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Orderhantering</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {PAGES.map(p => {
            const count = p.filter ? counts[p.filter] : projects.length;
            const active = activePage === p.id;
            return (
              <button key={p.id} onClick={() => setActivePage(p.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: active ? "rgba(255,255,255,0.12)" : "transparent", color: active ? "#fff" : "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: active ? 600 : 400, textAlign: "left" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 9 }}><span>{p.icon}</span><span style={{ whiteSpace: "nowrap" }}>{p.label}</span></span>
                <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", borderRadius: 10, padding: "1px 6px" }}>{count}</span>
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>JA</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Johan Andreasson</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Säljare</div>
          </div>
        </div>
      </aside>

      {/* Huvud */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <header style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: C.muted, fontSize: 18, padding: 4 }}>☰</button>
          <div style={{ flex: 1, fontSize: 16, fontWeight: 700 }}>{page.label}</div>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.muted, fontSize: 13, pointerEvents: "none" }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Sök…" style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px 7px 30px", fontSize: 13, width: 200, outline: "none", fontFamily: "inherit" }} />
          </div>
          <button onClick={() => setShowNew(true)} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>+ Nytt projekt</button>
        </header>

        {/* KPI */}
        <div style={{ padding: "16px 24px 0", display: "flex", gap: 12, flexWrap: "wrap", flexShrink: 0 }}>
          <KpiCard label="Projekt" value={filtered.length} />
          <KpiCard label="Totalt värde" value={SEK(totalVärde)} color={C.accent} />
          {(activePage === "order" || activePage === "faktureras") && totalKvarstaende !== totalVärde && (
            <KpiCard label="Kvarstår att fakturera" value={SEK(totalKvarstaende)} color={C.orange} />
          )}
          {activePage === "alla" && <>
            <KpiCard label="Räknas på" value={counts.kalkyl || 0} color={C.teal} />
            <KpiCard label="Offerter" value={counts.offert} color={C.orange} />
            <KpiCard label="Orders" value={counts.order} color={C.accent} />
            <KpiCard label="Service" value={counts.service} color={C.purple} />
          </>}
          {activePage === "offert" && <>
            <KpiCard label="Förfallna uppföljningar" value={projects.filter(p => p.status === "offert" && p.uppföljningsDatum && new Date(p.uppföljningsDatum) < new Date()).length} color={C.red} />
            <KpiCard label="Snitt sannolikhet" value={Math.round(projects.filter(p => p.status === "offert").reduce((s, p) => s + (p.sannolikhet || 0), 0) / (counts.offert || 1)) + "%"} color={C.green} />
          </>}
          {(activePage === "order" || activePage === "faktureras" || activePage === "avslutad") && (() => {
            const tbProjekt = filtered.filter(p => beraknaKostnad(p) > 0);
            const totalTB = tbProjekt.reduce((s, p) => s + beraknaTB(p), 0);
            const snittTBPct = tbProjekt.length ? Math.round(tbProjekt.reduce((s, p) => s + (p.värde ? beraknaTB(p) / p.värde * 100 : 0), 0) / tbProjekt.length) : null;
            return tbProjekt.length > 0 ? <>
              <KpiCard label="Totalt TB" value={SEK(totalTB)} color={totalTB >= 0 ? C.green : C.red} />
              {snittTBPct !== null && <KpiCard label="Snitt TB%" value={snittTBPct + "%"} color={snittTBPct >= 40 ? C.green : snittTBPct >= 20 ? C.orange : C.red} />}
            </> : null;
          })()}
        </div>

        {/* Kategorifilter */}
        <div style={{ padding: "12px 24px 0", display: "flex", gap: 8, flexWrap: "wrap", flexShrink: 0 }}>
          <button onClick={() => setKategoriFilter(null)} style={{ padding: "4px 13px", borderRadius: 20, border: `1.5px solid ${kategoriFilter === null ? C.accent : C.border}`, background: kategoriFilter === null ? C.accentLight : C.surface, color: kategoriFilter === null ? C.accent : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Alla</button>
          {KATEGORIER.map(k => {
            const m = KAT_META[k]; const active = kategoriFilter === k;
            return <button key={k} onClick={() => setKategoriFilter(active ? null : k)} style={{ padding: "4px 13px", borderRadius: 20, border: `1.5px solid ${active ? m.color : C.border}`, background: active ? m.bg : C.surface, color: active ? m.color : C.muted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{m.label}</button>;
          })}
        </div>

        {/* Innehåll */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px 24px 24px", display: "flex", flexDirection: "column", gap: 16, minHeight: 0 }}>
          {activePage === "tappad" && <TappadStatistik projects={projects} />}
          {activePage === "alla" && <AtterGoraPanel projects={projects} onOpen={openProject} kategoriFilter={kategoriFilter} onIgnorera={ignoreraTodo} />}
          {activePage === "order"
            ? <OrderPlaneringsvyn projects={filtered} onOpen={openProject} />
            : <ProjektTabell projects={filtered} onOpen={openProject} showUppfoljning={activePage === "offert" || activePage === "alla"} />
          }
          {filtered.length > 0 && <div style={{ fontSize: 12, color: C.muted, textAlign: "right" }}>{filtered.length} projekt · {SEK(totalVärde)}</div>}
        </div>
      </main>

      {/* Modaler */}
      {selected && selected.status === "offert" && <OffertModal project={selected} onClose={() => setSelected(null)} onSave={saveProject} onDelete={deleteProject} onPromoteToOrder={promoteToOrder} />}
      {selected && (selected.status === "order" || selected.status === "faktureras") && <OrderModal project={selected} onClose={() => setSelected(null)} onSave={saveProject} onDelete={deleteProject} />}
      {selected && !["offert", "order", "faktureras"].includes(selected.status) && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }} onClick={() => setSelected(null)}>
          <div style={{ background: C.surface, borderRadius: 14, width: "100%", maxWidth: 480, padding: 28, boxShadow: "0 20px 60px rgba(0,0,0,0.18)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase" }}>{selected.referens}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.namn}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: C.muted }}>×</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[["Produkt", "produkt"], ["Ansvarig", "ansvarig"], ["Notat", "notat"]].map(([label, key]) => (
                <Field key={key} label={label}><input defaultValue={selected[key]} style={inputSt} onChange={e => setSelected(s => ({ ...s, [key]: e.target.value }))} /></Field>
              ))}
              <Field label="Värde (kr)"><input type="number" defaultValue={selected.värde} style={inputSt} onChange={e => setSelected(s => ({ ...s, värde: Number(e.target.value) }))} /></Field>
            </div>
            <ProjektTodosPanel todos={selected.projektTodos || []} onChange={v => {
              setSelected(s => ({ ...s, projektTodos: v }));
              saveProject({ ...selected, projektTodos: v }, true);
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
              <button onClick={() => deleteProject(selected.id)} style={{ background: "none", color: C.red, border: "none", cursor: "pointer", fontWeight: 600 }}>Ta bort</button>
              <div style={{ display: "flex", gap: 8 }}>
                {selected.status === "kalkyl" && (
                  <button onClick={() => saveProject({ ...selected, status: "offert" })} style={{ background: C.orangeLight, color: C.orange, border: `1px solid ${C.orange}`, borderRadius: 8, padding: "9px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
                    → Konvertera till offert
                  </button>
                )}
                <button onClick={() => saveProject(selected)} style={{ background: C.accent, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, cursor: "pointer" }}>Spara</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {orderFormProjekt && <OrderFormulär project={orderFormProjekt} onClose={() => setOrderFormProjekt(null)} onSave={saveOrder} />}
      {showNew && <NyProjektModal onClose={() => setShowNew(false)} onSave={addProject} onSaveAndOrder={newProjectAsOrder} nextNummer={nextLopnummer} defaultStatus={page.filter || "offert"} />}
    </div>
  );
}
