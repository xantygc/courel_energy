"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useNextStep } from "nextstepjs";
import { simularAnual, truncate2 } from "@/lib/calculator";

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DIAS_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const MESES_CORTO = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const INITIAL_CONSUMOS = MESES.map((m, i) => ({
  dias: DIAS_MES[i],
  pp1: 3.45, pp2: 3.45,
  kp1: [85, 75, 60, 50, 45, 55, 80, 75, 60, 65, 70, 88][i],
  kp2: [130, 115, 90, 75, 70, 82, 120, 115, 88, 98, 108, 135][i],
  kp3: [255, 225, 175, 148, 138, 162, 235, 225, 172, 192, 212, 265][i],
  exc: 0
}));

export default function App() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { startNextStep } = useNextStep();

  const [tab, setTab] = useState("config");
  const [configTab, setConfigTab] = useState("cuenta");
  const [rates, setRates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userConfig, setUserConfig] = useState<any>({ bonoSocialDia: 0, autoconsumoEstimado: 0 });
  const [costs, setCosts] = useState<any>({});
  const [consumos, setConsumos] = useState<any[]>([]); // This will now hold database consumptions

  // Consumption form
  const [showConsForm, setShowConsForm] = useState(false);
  const [consFormData, setConsFormData] = useState<any>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    dias: 30, pp1: 3.45, pp2: 3.45, kp1: 0, kp2: 0, kp3: 0, exc: 0
  });

  // Rate form
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState<any>({});
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadModal, setUploadModal] = useState<{ show: boolean; type: 'success' | 'error'; message: string } | null>(null);

  // Resultados
  const [selectedRateIdx, setSelectedRateIdx] = useState(0);
  const [selectedMesIdx, setSelectedMesIdx] = useState(0);

  // Sync tabs with tour steps
  const { currentStep, currentTour } = useNextStep();

  useEffect(() => {
    if (currentTour === 'mainTour') {
      if (currentStep === 1 || currentStep === 2) setTab("config");
      else if (currentStep === 3 || currentStep === 4) setTab("consumos");
      else if (currentStep === 5 || currentStep === 6) setTab("resultados");
    }
  }, [currentStep, currentTour]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();

      // Auto-start tour if never seen
      const hasSeenTour = localStorage.getItem("hasSeenFacturioTour");
      if (!hasSeenTour) {
        setTimeout(() => {
          startNextStep("mainTour");
          localStorage.setItem("hasSeenFacturioTour", "true");
        }, 1000);
      }
    }
  }, [status]);

  const fetchData = async () => {
    try {
      const [rRes, cRes, confRes, consRes] = await Promise.all([
        fetch("/api/rates"),
        fetch("/api/costs"),
        fetch("/api/user/config"),
        fetch("/api/consumptions")
      ]);
      const [ratesData, costsData, configData, consData] = await Promise.all([
        rRes.json(),
        cRes.json(),
        confRes.json(),
        consRes.json()
      ]);
      console.log("Loaded costs:", costsData);
      setRates(ratesData);
      setCosts(costsData);
      setUserConfig(configData);
      setConsumos(consData);
      if ((configData as any).role === "admin" || (session?.user as any).role === "admin") {
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleBillUpload = async (file: File) => {
    setIsUploading(true);
    setUploadModal(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/bills/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let msg = "Error al procesar la factura";
        try {
          const err = await res.json();
          if (err.error) msg = err.error;
        } catch (e) { }
        throw new Error(msg);
      }

      const nc = await res.json();

      const idx = consumos.findIndex(c => c.year === nc.year && c.month === nc.month);
      if (idx > -1) {
        const nw = [...consumos];
        nw[idx] = nc;
        setConsumos(nw);
      } else {
        setConsumos([...consumos, nc].sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month)));
      }

      setUploadModal({ show: true, type: 'success', message: "La factura ha sido procesada y guardada correctamente en tu historial." });
    } catch (e: any) {
      console.error(e);
      setUploadModal({ show: true, type: 'error', message: e.message || "Fallo de red o servidor al subir la factura." });
    } finally {
      setIsUploading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`¿Estás SEGURO de que quieres eliminar al usuario ${email}? Esta acción es irreversible.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
      } else {
        const txt = await res.text();
        alert(txt || "Error al eliminar usuario");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const saveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      potP1Punta: +formData.potP1Punta || 0,
      potP2Valle: +formData.potP2Valle || 0,
      energiaP1Punta: +formData.energiaP1Punta || 0,
      energiaP2Llana: +formData.energiaP2Llana || 0,
      energiaP3Valle: +formData.energiaP3Valle || 0,
      excedentes: +formData.excedentes || 0,
      cuotaMensual: +formData.cuotaMensual || 0,
      extraKwp: +formData.extraKwp || 0,
    };

    if (editingIndex === -1) {
      // Create
      const res = await fetch("/api/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const nr = await res.json();
        setRates([...rates, nr]);
      }
    } else {
      // Update
      const rateId = rates[editingIndex].id;
      const res = await fetch(`/api/rates/${rateId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const nr = await res.json();
        const nw = [...rates];
        nw[editingIndex] = nr;
        setRates(nw);
      }
    }
    setShowForm(false);
  };

  const deleteRate = async (idx: number) => {
    const rate = rates[idx];
    if (!confirm(`¿Eliminar "${rate.comercializadora} — ${rate.nombre}"?`)) return;
    const res = await fetch(`/api/rates/${rate.id}`, { method: "DELETE" });
    if (res.ok) {
      setRates(rates.filter((_, i) => i !== idx));
    }
  };

  const openForm = (idx: number) => {
    setEditingIndex(idx);
    setShowForm(true);
    if (idx === -1) {
      setFormData({
        comercializadora: "", nombre: "", potP1Punta: "", potP2Valle: "",
        energiaP1Punta: "", energiaP2Llana: "", energiaP3Valle: "", excedentes: "",
        cuotaMensual: 0, extraKwp: 0, isPublic: false
      });
    } else {
      setFormData(rates[idx]);
    }
  };

  const saveUserConfig = async () => {
    setLoadingConfig(true);
    await fetch("/api/user/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userConfig),
    });
    setLoadingConfig(false);
  };

  const saveCosts = async () => {
    setLoadingConfig(true);
    await fetch("/api/costs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(costs),
    });
    setLoadingConfig(false);
  };

  const saveConsumption = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/consumptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consFormData),
    });
    if (res.ok) {
      const nc = await res.json();
      // Update local state: if exists update, else add
      const idx = consumos.findIndex(c => c.year === nc.year && c.month === nc.month);
      if (idx > -1) {
        const nw = [...consumos];
        nw[idx] = nc;
        setConsumos(nw);
      } else {
        setConsumos([...consumos, nc].sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month)));
      }
      setShowConsForm(false);
    }
  };

  const editConsumption = (c: any) => {
    setConsFormData({
      year: c.year,
      month: c.month,
      dias: c.dias,
      pp1: c.pp1,
      pp2: c.pp2,
      kp1: c.kp1,
      kp2: c.kp2,
      kp3: c.kp3,
      exc: c.exc
    });
    setShowConsForm(true);
    // Scroll to top or to the form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteConsumption = async (id: string) => {
    if (!confirm("¿Eliminar este registro de consumo?")) return;
    const res = await fetch(`/api/consumptions/${id}`, { method: "DELETE" });
    if (res.ok) {
      setConsumos(consumos.filter(c => c.id !== id));
    }
  };

  const sumConsumo = (k: string) => truncate2(consumos.reduce((s, c) => s + (+(c as any)[k] || 0), 0));

  const isAdmin = (session?.user as any)?.role === "admin";
  const userId = (session?.user as any)?.id;

  if (status === "loading" || !session) return null;

  // -- RENDERING --
  const renderConfig = (isActive: boolean) => {
    const isAdmin = (session?.user as any)?.role === "admin";

    return (
      <div className={`page ${isActive ? 'active' : ''}`} style={isActive ? { display: 'block' } : { display: 'none' }}>
        {isAdmin && (
          <div className="sec-tabs" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
            <button className={`tab-btn-sm ${configTab === 'cuenta' ? 'active' : ''}`} onClick={() => setConfigTab('cuenta')}>Mi Cuenta</button>
            <button className={`tab-btn-sm ${configTab === 'usuarios' ? 'active' : ''}`} onClick={() => setConfigTab('usuarios')}>Usuarios</button>
            <button className={`tab-btn-sm ${configTab === 'boe' ? 'active' : ''}`} onClick={() => setConfigTab('boe')}>Costes BOE</button>
            <button className={`tab-btn-sm ${configTab === 'tarifas' ? 'active' : ''}`} onClick={() => setConfigTab('tarifas')}>Tarifas Públicas</button>
          </div>
        )}

        {(!isAdmin || configTab === 'cuenta') && (
          <>
            <div className="card">
              <div className="sec-head">
                <span className="sec-title">Parámetros del suministro ({session.user?.email})</span>
                <button className="btn-primary btn-sm" onClick={saveUserConfig} disabled={loadingConfig}>
                  {loadingConfig ? "Guardando..." : "Guardar"}
                </button>
              </div>
              <div className="g5">
                <div className="field">
                  <label>Bono Social (€/día)</label>
                  <input type="number" step="0.00001" value={userConfig.bonoSocialDia}
                    onChange={e => setUserConfig({ ...userConfig, bonoSocialDia: e.target.value })} />
                </div>
                <div className="field">
                  <label>Autoconsumo est. (0-1)</label>
                  <input type="number" step="0.01" min="0" max="1" value={userConfig.autoconsumoEstimado}
                    onChange={e => setUserConfig({ ...userConfig, autoconsumoEstimado: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="card" style={{ border: "1px solid var(--red-dim)", background: "rgba(255, 0, 0, 0.02)" }}>
              <div className="sec-head">
                <span className="sec-title" style={{ color: "var(--red)" }}>Zona de Peligro</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text3)", marginBottom: "1rem" }}>
                Al eliminar tu cuenta, se borrarán permanentemente tus consumos y tarifas privadas.
                Las tarifas públicas se anonimizarán. Esta acción no se puede deshacer.
              </p>
              <button
                className="btn-sm btn-danger"
                onClick={async () => {
                  if (confirm("¿Estás SEGURO de que quieres eliminar tu cuenta? Esta acción es irreversible.")) {
                    if (confirm("Confirma por última vez: se borrarán todos tus datos personales.")) {
                      const res = await fetch("/api/user/delete", { method: "DELETE" });
                      if (res.ok) {
                        signOut({ callbackUrl: "/" });
                      } else {
                        alert("Error al eliminar la cuenta.");
                      }
                    }
                  }
                }}
              >
                Eliminar cuenta permanentemente
              </button>
            </div>
          </>
        )}

        {isAdmin && configTab === 'usuarios' && (
          <div className="card">
            <div className="sec-head">
              <span className="sec-title">Gestión de Usuarios</span>
            </div>
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Email</th>
                    <th style={{ textAlign: "left" }}>Nombre</th>
                    <th>Rol</th>
                    <th>Registro</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.name || "-"}</td>
                      <td className="r">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          style={{ fontSize: "12px", padding: "2px 4px" }}
                          disabled={u.email === "santiago.gonzalez.courel@gmail.com"}
                        >
                          <option value="regular">Regular</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="r" style={{ fontSize: "11px", color: "var(--text3)" }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {u.email !== "santiago.gonzalez.courel@gmail.com" && (
                          <button className="btn-sm btn-danger" onClick={() => deleteUser(u.id, u.email)}>✕</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {isAdmin && configTab === 'boe' && (
          <div className="card">
            <div className="sec-head">
              <span className="sec-title">Costes Regulados BOE (Global)</span>
              <button className="btn-primary btn-sm" onClick={saveCosts} disabled={loadingConfig}>
                {loadingConfig ? "Guardando..." : "Guardar Costes"}
              </button>
            </div>
            <div className="g5" style={{ marginBottom: "1rem" }}>
              <div className="field"><label>Peaje P1 (c€/kWh)</label><input type="number" step="0.0001" value={costs.peajeP1 ?? 0} onChange={e => setCosts({ ...costs, peajeP1: e.target.value })} /></div>
              <div className="field"><label>Peaje P2 (c€/kWh)</label><input type="number" step="0.0001" value={costs.peajeP2 ?? 0} onChange={e => setCosts({ ...costs, peajeP2: e.target.value })} /></div>
              <div className="field"><label>Peaje P3 (c€/kWh)</label><input type="number" step="0.0001" value={costs.peajeP3 ?? 0} onChange={e => setCosts({ ...costs, peajeP3: e.target.value })} /></div>
              <div className="field"><label>Pot BOE P1 (€/kW·año)</label><input type="number" step="0.00001" value={costs.potBoeP1 ?? 0} onChange={e => setCosts({ ...costs, potBoeP1: e.target.value })} /></div>
              <div className="field"><label>Pot BOE P2 (€/kW·año)</label><input type="number" step="0.00001" value={costs.potBoeP2 ?? 0} onChange={e => setCosts({ ...costs, potBoeP2: e.target.value })} /></div>
            </div>
            <div className="g5">
              <div className="field"><label>Imp. Eléc. (%)</label><input type="number" step="0.0001" value={costs.impuestoElectrico ?? 0} onChange={e => setCosts({ ...costs, impuestoElectrico: e.target.value })} /></div>
              <div className="field"><label>IVA (%)</label><input type="number" step="0.01" value={costs.iva ?? 0} onChange={e => setCosts({ ...costs, iva: e.target.value })} /></div>
              <div className="field"><label>Alquiler cto. (€/día)</label><input type="number" step="0.00001" value={costs.alquilerContadorDia ?? 0} onChange={e => setCosts({ ...costs, alquilerContadorDia: e.target.value })} /></div>
              <div className="field"><label>Financ. Bono Soc. (€/día)</label><input type="number" step="0.000001" value={costs.financiacionBonoSocialDia ?? 0} onChange={e => setCosts({ ...costs, financiacionBonoSocialDia: e.target.value })} /></div>
            </div>
          </div>
        )}

        {(!isAdmin || configTab === 'tarifas' || configTab === 'cuenta') && (
          <div className="card">
            <div className="sec-head">
              <span className="sec-title">
                {configTab === 'tarifas' ? 'Tarifas Públicas' : 'Mis tarifas personalizadas'}
              </span>
              <button id="add-rate-btn" className="btn-primary btn-sm" onClick={() => openForm(-1)}>+ Añadir tarifa</button>
            </div>

            {showForm && (
              <div className="tarifa-form">
                <div style={{ fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text2)", marginBottom: 14 }}>
                  {editingIndex === -1 ? 'Nueva tarifa' : 'Editar tarifa'}
                </div>
                <form onSubmit={saveRate}>
                  <div className="g2" style={{ marginBottom: 10 }}>
                    <div className="field"><label>Comercializadora</label><input type="text" value={formData.comercializadora} onChange={e => setFormData({ ...formData, comercializadora: e.target.value })} required /></div>
                    <div className="field"><label>Nombre tarifa</label><input type="text" value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} required /></div>
                  </div>
                  <div className="g4" style={{ marginBottom: 10 }}>
                    <div className="field"><label>Pot P1 punta (€/kW·año)</label><input type="number" step="0.0001" value={formData.potP1Punta} onChange={e => setFormData({ ...formData, potP1Punta: e.target.value })} required /></div>
                    <div className="field"><label>Pot P2 valle (€/kW·año)</label><input type="number" step="0.0001" value={formData.potP2Valle} onChange={e => setFormData({ ...formData, potP2Valle: e.target.value })} required /></div>
                    <div className="field"><label>Energía P1 punta (c€/kWh)</label><input type="number" step="0.0001" value={formData.energiaP1Punta} onChange={e => setFormData({ ...formData, energiaP1Punta: e.target.value })} required /></div>
                    <div className="field"><label>Energía P2 llana (c€/kWh)</label><input type="number" step="0.0001" value={formData.energiaP2Llana} onChange={e => setFormData({ ...formData, energiaP2Llana: e.target.value })} required /></div>
                  </div>
                  <div className="g4" style={{ marginBottom: 14 }}>
                    <div className="field"><label>Energía P3 valle (c€/kWh)</label><input type="number" step="0.0001" value={formData.energiaP3Valle} onChange={e => setFormData({ ...formData, energiaP3Valle: e.target.value })} required /></div>
                    <div className="field"><label>Excedentes (c€/kWh)</label><input type="number" step="0.0001" value={formData.excedentes} onChange={e => setFormData({ ...formData, excedentes: e.target.value })} required /></div>
                    <div className="field"><label>Cuota mensual (€/mes)</label><input type="number" step="0.01" value={formData.cuotaMensual} onChange={e => setFormData({ ...formData, cuotaMensual: e.target.value })} /></div>
                    {isAdmin && (
                      <div className="field" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "14px" }}>
                        <input type="checkbox" checked={formData.isPublic} onChange={e => setFormData({ ...formData, isPublic: e.target.checked })} style={{ width: "auto", margin: 0 }} />
                        <label style={{ margin: 0 }}>Pública (Visible para todos)</label>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit" className="btn-primary btn-sm">Guardar</button>
                    <button type="button" className="btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
                  </div>
                </form>
              </div>
            )}

            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Comercializadora</th>
                    <th style={{ textAlign: "left" }}>Tarifa</th>
                    <th>Pot P1</th>
                    <th>Pot P2</th>
                    <th>E P1</th>
                    <th>E P2</th>
                    <th>E P3</th>
                    <th>Exc</th>
                    {isAdmin && <th>Pública</th>}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {rates
                    .filter(t => {
                      if (!isAdmin) return true; // Regular sees all their available (public + own)
                      if (configTab === 'tarifas') return t.isPublic;
                      if (configTab === 'cuenta') return !t.isPublic;
                      return true;
                    })
                    .map((t, i) => (
                      <tr key={t.id}>
                        <td>{t.comercializadora}</td>
                        <td>{t.nombre}</td>
                        <td className="r">{(+t.potP1Punta).toFixed(2)}</td>
                        <td className="r">{(+t.potP2Valle).toFixed(2)}</td>
                        <td className="r">{(+t.energiaP1Punta).toFixed(2)}</td>
                        <td className="r">{(+t.energiaP2Llana).toFixed(2)}</td>
                        <td className="r">{(+t.energiaP3Valle).toFixed(2)}</td>
                        <td className="r">{(+t.excedentes).toFixed(2)}</td>
                        {isAdmin && <td className="r">{t.isPublic ? "Sí" : "No"}</td>}
                        <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                          {(t.userId === userId || isAdmin) && (
                            <>
                              <button className="btn-sm" onClick={() => openForm(rates.indexOf(t))} style={{ marginRight: 4 }}>Editar</button>
                              <button className="btn-sm btn-danger" onClick={() => deleteRate(rates.indexOf(t))}>✕</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  {rates.length === 0 && <tr><td colSpan={10} style={{ textAlign: "center", color: "var(--text3)", padding: "2rem" }}>Sin tarifas.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderConsumos = (isActive: boolean) => {
    // Chart data: latest 12 entries, chronologically
    const chartData = [...consumos]
      .sort((a, b) => (a.year * 12 + a.month) - (b.year * 12 + b.month))
      .slice(-12);

    const rawMax = Math.max(...chartData.map(c => (+c.kp1 || 0) + (+c.kp2 || 0) + (+c.kp3 || 0)), 1);
    const maxCons = rawMax * 1.4; // 40% headroom so max bar is never at 100% height
    const yMid = Math.round(maxCons / 2);
    const yTop = Math.round(maxCons);

    return (
      <div className={`page ${isActive ? 'active' : ''}`} style={isActive ? { display: 'block' } : { display: 'none' }}>
        {consumos.length > 0 && (
          <div className="card">
            <div className="sec-head">
              <span className="sec-title">Consumo Total por Periodo (kWh)</span>
            </div>
            <div className="chart-container">
              <div className="chart-bars">
                {/* Y-axis */}
                <div className="chart-y-axis">
                  <div className="chart-y-label" style={{ bottom: '100%' }}>{yTop}</div>
                  <div className="chart-y-label" style={{ bottom: '50%' }}>{yMid}</div>
                  <div className="chart-y-label" style={{ bottom: '0%' }}>0</div>
                  <div className="chart-y-tick" style={{ bottom: '100%' }} />
                  <div className="chart-y-tick" style={{ bottom: '50%' }} />
                  <div className="chart-y-tick" style={{ bottom: '0%' }} />
                </div>
                {chartData.map(c => {
                  const total = (+c.kp1 || 0) + (+c.kp2 || 0) + (+c.kp3 || 0);
                  const h = (total / maxCons) * 100;
                  return (
                    <div key={c.id} className="chart-bar-wrap">
                      <div className="chart-bar" style={{ height: `${h}%` }}>
                        <div className="chart-bar-inner">
                          <div className="bar-part p1" style={{ height: `${((+c.kp1 || 0) / total) * 100}%` }} title={`Punta: ${c.kp1} kWh`}></div>
                          <div className="bar-part p2" style={{ height: `${((+c.kp2 || 0) / total) * 100}%` }} title={`Llana: ${c.kp2} kWh`}></div>
                          <div className="bar-part p3" style={{ height: `${((+c.kp3 || 0) / total) * 100}%` }} title={`Valle: ${c.kp3} kWh`}></div>
                        </div>
                        <div className="chart-bar-val">{total.toFixed(0)}</div>
                      </div>
                      <div className="chart-label">{MESES_CORTO[c.month - 1]} {c.year}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="sec-head">
            <span className="sec-title">Historial de Consumo</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button id="add-consumption-btn" className="btn-primary btn-sm" onClick={() => setShowConsForm(!showConsForm)}>
                {showConsForm ? "Cancelar" : "+ Añadir Mes"}
              </button>

              <label className={`btn btn-sm ${isUploading ? 'disabled' : ''}`} style={{ cursor: "pointer", margin: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "4px" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" /></svg>
                {isUploading ? "Procesando..." : "Subir Factura"}
                <input type="file" accept="image/*,.pdf" style={{ display: "none" }}
                  disabled={isUploading}
                  onChange={e => e.target.files?.[0] && handleBillUpload(e.target.files[0])} />
              </label>
            </div>
          </div>

          {showConsForm && (
            <div className="tarifa-form" style={{ marginBottom: "2rem" }}>
              <form onSubmit={saveConsumption}>
                <div className="g2" style={{ marginBottom: 10 }}>
                  <div className="field">
                    <label>Año</label>
                    <input type="number" value={consFormData.year} onChange={e => setConsFormData({ ...consFormData, year: e.target.value })} required />
                  </div>
                  <div className="field">
                    <label>Mes</label>
                    <select value={consFormData.month} onChange={e => setConsFormData({ ...consFormData, month: e.target.value })} required>
                      {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className="g4" style={{ marginBottom: 10 }}>
                  <div className="field"><label>Días</label><input type="number" value={consFormData.dias} onChange={e => setConsFormData({ ...consFormData, dias: e.target.value })} required /></div>
                  <div className="field"><label>Pot P1 (kW)</label><input type="number" step="0.01" value={consFormData.pp1} onChange={e => setConsFormData({ ...consFormData, pp1: e.target.value })} required /></div>
                  <div className="field"><label>Pot P2 (kW)</label><input type="number" step="0.01" value={consFormData.pp2} onChange={e => setConsFormData({ ...consFormData, pp2: e.target.value })} required /></div>
                  <div className="field"><label>kWh P1 Punta</label><input type="number" value={consFormData.kp1} onChange={e => setConsFormData({ ...consFormData, kp1: e.target.value })} required /></div>
                </div>
                <div className="g4" style={{ marginBottom: 14 }}>
                  <div className="field"><label>kWh P2 Llana</label><input type="number" value={consFormData.kp2} onChange={e => setConsFormData({ ...consFormData, kp2: e.target.value })} required /></div>
                  <div className="field"><label>kWh P3 Valle</label><input type="number" value={consFormData.kp3} onChange={e => setConsFormData({ ...consFormData, kp3: e.target.value })} required /></div>
                  <div className="field"><label>Exc/Prod (kWh)</label><input type="number" value={consFormData.exc} onChange={e => setConsFormData({ ...consFormData, exc: e.target.value })} required /></div>
                </div>
                <button type="submit" className="btn-primary btn-sm">Guardar Consumo</button>
              </form>
            </div>
          )}

          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ textAlign: "left" }}>Periodo</th>
                  <th>Días</th>
                  <th>Pot P1</th>
                  <th>Pot P2</th>
                  <th>P1</th>
                  <th>P2</th>
                  <th>P3</th>
                  <th>Exc</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {consumos.length === 0 && <tr><td colSpan={9} style={{ textAlign: "center", color: "var(--text3)", padding: "2rem" }}>No hay registros de consumo. Añade uno para comenzar.</td></tr>}
                {consumos.map((c, i) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{MESES[c.month - 1]} {c.year}</td>
                    <td className="r">{c.dias}</td>
                    <td className="r">{(+c.pp1).toFixed(2)}</td>
                    <td className="r">{(+c.pp2).toFixed(2)}</td>
                    <td className="r">{c.kp1}</td>
                    <td className="r">{c.kp2}</td>
                    <td className="r">{c.kp3}</td>
                    <td className="r">{c.exc}</td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button className="btn-sm" onClick={() => editConsumption(c)} style={{ marginRight: 4 }}>Editar</button>
                      <button className="btn-sm btn-danger" onClick={() => deleteConsumption(c.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
              {consumos.length > 0 && (
                <tfoot>
                  <tr>
                    <td>TOTAL</td>
                    <td className="r">{sumConsumo('dias')}</td>
                    <td></td>
                    <td></td>
                    <td className="r">{sumConsumo('kp1').toFixed(2)}</td>
                    <td className="r">{sumConsumo('kp2').toFixed(2)}</td>
                    <td className="r">{sumConsumo('kp3').toFixed(2)}</td>
                    <td className="r">{sumConsumo('exc').toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderResultados = (isActive: boolean) => {
    if (!rates.length || !costs.peajeP1 || !consumos.length) {
      return (
        <div className={`page ${isActive ? 'active' : ''}`} style={isActive ? { display: 'block' } : { display: 'none' }}>
          <div className="empty">
            <p>
              {!consumos.length
                ? "Añade al menos un mes de consumo en la pestaña Consumos"
                : "Añade al menos una tarifa en la pestaña Configuración y espera a que carguen los datos"}
            </p>
          </div>
        </div>
      );
    }

    let resultados = rates.map(t => simularAnual(t, consumos, userConfig, costs));
    resultados.sort((a, b) => a.totalAnual - b.totalAnual);

    const maxTotal = resultados[resultados.length - 1].totalAnual;
    const minTotal = resultados[0].totalAnual;
    const totalKwh = resultados[0].totalKwh;

    const best = resultados[0];
    const worst = resultados[resultados.length - 1];
    const ahorro = worst.totalAnual - best.totalAnual;

    // Safety checks for selected idx
    const safeRateIdx = selectedRateIdx >= resultados.length ? 0 : selectedRateIdx;
    const sel = resultados[safeRateIdx];

    const safeMesIdx = selectedMesIdx >= sel.meses.length ? 0 : selectedMesIdx;
    const mes = sel.meses[safeMesIdx];
    const consItem = consumos[safeMesIdx];

    const fmE = (v: number) => v.toFixed(2) + " €";
    const tieneExc = mes.exc > 0;

    return (
      <div className={`page ${isActive ? 'active' : ''}`} style={isActive ? { display: 'block' } : { display: 'none' }}>
        <div id="ranking-section" className="sec-head" style={{ marginBottom: "1rem" }}><span className="sec-title">Ranking comparativo</span></div>
        <div className="chips">
          <div className="chip"><div className="cl">Mejor tarifa</div><div className="cv">{best.tarifa.comercializadora}</div></div>
          <div className="chip"><div className="cl">Coste total mín.</div><div className="cv">{best.totalAnual.toFixed(2)} €</div></div>
          <div className="chip"><div className="cl">Ahorro máx. vs peor</div><div className="cv" style={{ color: "var(--accent)" }}>{ahorro.toFixed(2)} €</div></div>
          <div className="chip"><div className="cl">Consumo total</div><div className="cv">{totalKwh.toFixed(0)} kWh</div></div>
          <div className="chip"><div className="cl">Precio medio mín.</div><div className="cv">{best.precioMedio.toFixed(1)} c€/kWh</div></div>
        </div>

        <div className="res-grid">
          {resultados.map((r, i) => {
            const isBest = i === 0;
            const isSel = i === safeRateIdx;
            const ah = r.totalAnual - minTotal;
            const pct = maxTotal > minTotal ? ((r.totalAnual - minTotal) / (maxTotal - minTotal) * 100) : 0;
            return (
              <div key={i} className={`res-card ${isBest ? 'best' : ''} ${isSel ? 'selected' : ''}`} onClick={() => setSelectedRateIdx(i)}>
                {ah < 0.01 && isBest && <span className="ahorro-tag">Mejor</span>}
                {!isBest && ah > 0 && <span className="ahorro-tag" style={{ background: "var(--red-dim)", color: "var(--red)" }}>+{(ah).toFixed(2)} €</span>}
                <div className="rank">#{i + 1}</div>
                <div className="com">{r.tarifa.comercializadora}</div>
                <div className="nom">{r.tarifa.nombre}</div>
                <div className="price">{r.totalAnual.toFixed(0)} €</div>
                <div className="sub">{r.precioMedio.toFixed(1)} c€/kWh · {totalKwh.toFixed(0)} kWh</div>
                <div className="bar-bg"><div className="bar-fill" style={{ width: `${100 - pct}%` }}></div></div>
              </div>
            );
          })}
        </div>

        <div className="detail-panel">
          <div className="sec-head" style={{ marginBottom: "1rem" }}>
            <span className="sec-title">{sel.tarifa.comercializadora} — {sel.tarifa.nombre}</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>Haz clic en un periodo para ver el desglose</span>
          </div>
          <div className="month-grid">
            {sel.meses.map((m: any, i: number) => (
              <div key={i} className={`month-cell ${i === safeMesIdx ? 'active' : ''}`} onClick={() => setSelectedMesIdx(i)}>
                <div className="mn">{MESES_CORTO[consumos[i].month - 1]}</div>
                <div className="mv">{m.total.toFixed(0)}€</div>
              </div>
            ))}
          </div>

          <div className="g2" style={{ gap: "1rem" }}>
            <div>
              <div className="inv">
                <div className="inv-title">Desglose factura — {MESES[consItem.month - 1]} {consItem.year} ({mes.dias} días)</div>

                <div className="inv-row"><span className="lbl">Término de potencia</span><span className="val">{fmE(mes.P)}</span></div>
                <div className="inv-row sub"><span className="lbl">Pot P1: {consItem.pp1} kW · Pot P2: {consItem.pp2} kW</span><span className="val"></span></div>
                <div className="inv-row sub"><span className="lbl">Margen s/BOE</span><span className="val">{fmE(mes.margenPot)}</span></div>
                <hr className="inv-sep" />

                <div className="inv-row"><span className="lbl">Término de energía</span><span className="val">{fmE(mes.En)}</span></div>
                <div className="inv-row sub"><span className="lbl">P1: {mes.kp1.toFixed(1)} kWh × {+sel.tarifa.energiaP1Punta} c€</span><span className="val">{fmE(mes.kp1 * +sel.tarifa.energiaP1Punta / 100)}</span></div>
                <div className="inv-row sub"><span className="lbl">P2: {mes.kp2.toFixed(1)} kWh × {+sel.tarifa.energiaP2Llana} c€</span><span className="val">{fmE(mes.kp2 * +sel.tarifa.energiaP2Llana / 100)}</span></div>
                <div className="inv-row sub"><span className="lbl">P3: {mes.kp3.toFixed(1)} kWh × {+sel.tarifa.energiaP3Valle} c€</span><span className="val">{fmE(mes.kp3 * +sel.tarifa.energiaP3Valle / 100)}</span></div>
                <div className="inv-row sub"><span className="lbl">Peajes y cargos incluidos</span><span className="val">{fmE(mes.peajes)}</span></div>

                {tieneExc && (
                  <>
                    <hr className="inv-sep" />
                    <div className="inv-row" style={{ color: "var(--accent2)" }}><span className="lbl">Excedentes vertidos</span><span className="val" style={{ color: "var(--accent2)" }}>— {fmE(mes.valExc)}</span></div>
                    <div className="inv-row sub"><span className="lbl">{mes.exc.toFixed(1)} kWh × {+sel.tarifa.excedentes} c€</span><span className="val"></span></div>
                    <div className="inv-row sub"><span className="lbl">→ Compensa energía</span><span className="val">— {fmE(mes.excAEn)}</span></div>
                    {mes.excReg > 0 && <div className="inv-row sub" style={{ color: "var(--red)" }}><span className="lbl">→ Excedentes regalados</span><span className="val">{fmE(mes.excReg)}</span></div>}
                    <div className="inv-row"><span className="lbl">Energía facturada neta</span><span className="val">{fmE(mes.enFact)}</span></div>
                  </>
                )}

                <hr className="inv-sep" />
                {mes.bs > 0 && <div className="inv-row"><span className="lbl">Bono Social</span><span className="val">{fmE(mes.bs)}</span></div>}
                <div className="inv-row"><span className="lbl">Alquiler contador</span><span className="val">{fmE(mes.alq)}</span></div>
                <div className="inv-row"><span className="lbl">Financiación Bono Social</span><span className="val">{fmE(mes.fbs)}</span></div>
                <div className="inv-row"><span className="lbl">Impuesto Eléctrico ({(+costs.impuestoElectrico).toFixed(3)}%)</span><span className="val">{fmE(mes.ie)}</span></div>
                {mes.cuota > 0 && <div className="inv-row"><span className="lbl">Cuota mensual</span><span className="val">{fmE(mes.cuota)}</span></div>}

                <hr className="inv-sep" />
                <div className="inv-row"><span className="lbl">Base imponible</span><span className="val">{fmE(mes.base)}</span></div>
                <div className="inv-row"><span className="lbl">IVA ({(+costs.iva).toFixed(2)}%)</span><span className="val">{fmE(mes.ivaAmt)}</span></div>

                <hr className="inv-sep" />
                <div className="inv-total">
                  <span className="lbl">Total factura</span>
                  <span className="val">{mes.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            <div>
              <div className="inv">
                <div className="inv-title">Historial resumido — {sel.tarifa.nombre}</div>
                {sel.meses.map((m: any, i: number) => (
                  <div key={i} className="inv-row">
                    <span className="lbl" style={i === safeMesIdx ? { color: "var(--accent2)" } : {}}>{MESES[consumos[i].month - 1]} {consumos[i].year}</span>
                    <span className="val" style={i === safeMesIdx ? { color: "var(--accent2)" } : {}}>
                      {m.total.toFixed(2)} €
                      <span style={{ color: "var(--text3)", fontSize: 11, marginLeft: 4 }}>{m.totalKwh.toFixed(0)} kWh</span>
                    </span>
                  </div>
                ))}
                <hr className="inv-sep" />
                <div className="inv-total">
                  <span className="lbl">Total acumulado</span>
                  <span className="val">{sel.totalAnual.toFixed(2)} €</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="nav" id="dashboard-nav" style={{ flexWrap: "wrap", gap: "1rem", paddingTop: "1rem", paddingBottom: "1rem" }}>
        <Link href="/" className="nav-logo" style={{ padding: 0, border: "none", margin: 0, textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: "24px", height: "24px" }}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
          <span className="logo-text" style={{ fontSize: "1.25rem", fontWeight: "bold", letterSpacing: "-0.025em" }}>Facturio</span>
        </Link>
        <div style={{ display: "flex", gap: "10px", marginLeft: "2rem" }}>
          <button id="step-config" className={`tab-btn ${tab === 'config' ? 'active' : ''}`} onClick={() => setTab('config')}>Configuración</button>
          <button id="step-consumos" className={`tab-btn ${tab === 'consumos' ? 'active' : ''}`} onClick={() => setTab('consumos')}>Consumos</button>
          <button id="step-resultados" className={`tab-btn ${tab === 'resultados' ? 'active' : ''}`} onClick={() => setTab('resultados')}>Resultados</button>
          <a href="/faq" className="tab-btn" style={{ textDecoration: "none" }} target="_blank" rel="noreferrer">Ayuda</a>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "var(--text2)", fontSize: 13 }}>{session.user?.email} {isAdmin && <span style={{ background: "var(--accent)", color: "var(--bg)", padding: "2px 6px", borderRadius: 4, fontWeight: "bold", fontSize: 11, marginLeft: 4 }}>ADMIN</span>}</span>
          <button className="btn-sm" onClick={() => signOut()}>Salir</button>
        </div>
      </div>

      <div className="app">
        {renderConfig(tab === 'config')}
        {renderConsumos(tab === 'consumos')}
        {renderResultados(tab === 'resultados')}
      </div>

      <div className="footer">
        <div className="footer-inner">
          <div className="footer-hl">¿Te ha ahorrado dinero?</div>
          <div className="footer-sub">Facturio es gratuito y de código abierto.<br />Si te ha ayudado a elegir la mejor tarifa, un café es la mejor forma de mantenerlo vivo.</div>
          <a className="coffee-btn-lg" href="https://buymeacoffee.com/courel" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" /></svg>
            Invítame a un café en buymeacoffee.com/courel
          </a>

          <div style={{ marginTop: "1rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "center" }}>
            <Link href="/terms" style={{ fontSize: "12px", color: "var(--text3)", textDecoration: "underline" }}>
              Términos y Condiciones
            </Link>
            <div style={{ display: "flex", gap: "1.25rem", alignItems: "center", marginTop: "0.5rem" }}>
              <a href="https://github.com/xantygc/courel_energy" target="_blank" rel="noreferrer" style={{ color: "var(--text3)", transition: "color 0.2s" }} title="GitHub">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              </a>
              <a href="https://www.linkedin.com/in/santiago-gonz%C3%A1lez-courel-1237875a/" target="_blank" rel="noreferrer" style={{ color: "var(--text3)", transition: "color 0.2s" }} title="LinkedIn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {isUploading && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "var(--bg)", padding: "2.5rem", borderRadius: "12px", border: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
            <div style={{ width: "48px", height: "48px", border: "4px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <span style={{ fontWeight: 600, fontSize: "1.1rem" }}>Procesando factura...</span>
            <span style={{ color: "var(--text3)", fontSize: "0.85rem", textAlign: "center", maxWidth: "250px" }}>Esto puede tardar unos momentos dependiendo del tamaño del archivo.</span>
          </div>
        </div>
      )}

      {uploadModal?.show && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", zIndex: 10000, display: "flex", justifyContent: "center", alignItems: "center", backdropFilter: "blur(4px)" }}>
          <div style={{ background: "var(--bg)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border)", maxWidth: "420px", width: "90%", display: "flex", flexDirection: "column", gap: "1.5rem", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {uploadModal.type === 'success' ? (
                <svg style={{ color: "var(--accent)", width: "28px", height: "28px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              ) : (
                <svg style={{ color: "var(--red)", width: "28px", height: "28px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              )}
              <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{uploadModal.type === 'success' ? 'Carga Exitosa' : 'Aviso'}</h3>
            </div>
            <p style={{ margin: 0, color: "var(--text)", lineHeight: 1.5, fontSize: "1rem" }}>{uploadModal.message}</p>
            <button className={uploadModal.type === 'success' ? 'btn-primary' : 'btn'} style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", border: uploadModal.type === 'error' ? "1px solid var(--red)" : "" }} onClick={() => setUploadModal(null)}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
