"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="auth-container" style={{ maxWidth: "800px", margin: "4rem auto", padding: "0 2rem" }}>
      <div className="auth-header" style={{ textAlign: "left", marginBottom: "2rem" }}>
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 className="auth-title">CourelEnergy</h1>
        </Link>
        <p className="auth-subtitle">Términos y Condiciones de Uso</p>
      </div>
      
      <div className="card" style={{ padding: "2rem", lineHeight: "1.6", color: "var(--text)" }}>
        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>1. Aceptación de los Términos</h2>
          <p>Al registrarte en CourelEnergy, aceptas cumplir con estos términos. Si no estás de acuerdo, por favor no utilices el servicio.</p>
        </section>

        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>2. Uso de Datos (Email)</h2>
          <p>Solicitamos tu correo electrónico únicamente para:</p>
          <ul>
            <li>Gestionar tu cuenta de usuario.</li>
            <li>Enviarte actualizaciones relacionadas exclusivamente con el proyecto CourelEnergy (mejoras, nuevas funcionalidades o cambios importantes).</li>
          </ul>
          <p><strong>Compromiso de Privacidad:</strong> Nunca venderemos, alquilaremos ni compartiremos tu email con terceros para fines comerciales o publicitarios ajenos a CourelEnergy.</p>
        </section>

        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>3. Naturaleza del Servicio</h2>
          <p>CourelEnergy es una herramienta de simulación gratuita y de código abierto. Aunque nos esforzamos por la exactitud, no garantizamos que los cálculos reflejen exactamente tu factura real debido a la complejidad de las tarifas eléctricas.</p>
        </section>

        <section style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>4. Cancelación de Cuenta</h2>
          <p>Puedes solicitar la eliminación de tu cuenta y todos tus datos asociados en cualquier momento.</p>
        </section>

        <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1rem", textAlign: "center" }}>
          <Link href="/register" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
            Volver al Registro
          </Link>
        </div>
      </div>
    </div>
  );
}
