import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="landing-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      
      <header className="main-header">
        <Link href="/" className="nav-logo" style={{ padding: 0, border: "none", margin: 0 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          <span className="logo-text" style={{ fontSize: "1.25rem", fontWeight: "bold", letterSpacing: "-0.025em" }}>Courel Energy</span>
        </Link>
        <nav className="main-header-nav">
          <a href="https://github.com/xantygc/courel_energy" target="_blank" rel="noopener noreferrer" className="btn-sm hide-mobile" style={{ textDecoration: "none", background: "transparent", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 0.5rem" }} title="Ver código en GitHub">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <Link href="/login" className="btn-sm" style={{ textDecoration: "none", background: "transparent", border: "1px solid var(--border)" }}>
            <span className="hide-mobile">Iniciar Sesión</span>
            <span className="show-mobile">Entrar</span>
          </Link>
          <Link href="/register" className="btn-primary btn-sm" style={{ textDecoration: "none" }}>
            Registrarse
          </Link>
        </nav>
      </header>

      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 2rem", textAlign: "center" }}>
        
        <div style={{ maxWidth: "800px", display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center" }}>
          <span style={{ 
            background: "rgba(59, 130, 246, 0.1)", 
            color: "var(--accent)", 
            padding: "0.25rem 0.75rem", 
            borderRadius: "1rem", 
            fontSize: "0.875rem", 
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Simulador Energético Profesional
          </span>
          
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 5vw, 4rem)", 
            fontWeight: 800, 
            lineHeight: 1.1, 
            letterSpacing: "-0.02em",
            color: "var(--text)",
            margin: 0
          }}>
            Optimiza tu tarifa de la luz <br/> de forma <span style={{ color: "var(--accent)" }}>inteligente</span>
          </h1>
          
          <p style={{ 
            fontSize: "clamp(1rem, 1.5vw, 1.15rem)", 
            color: "var(--text2)", 
            maxWidth: "700px",
            lineHeight: 1.6,
            margin: 0
          }}>
            CourelEnergy nace de una convicción simple: el acceso a la información energética no debería depender de quién te la puede pagar. 
            Por eso es gratuito, de código abierto, y siempre lo será. 
            Compara tarifas, entiende tu factura y decide con libertad — sin intermediarios, sin agenda comercial, sin letra pequeña.
          </p>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            background: "rgba(61, 255, 192, 0.06)",
            border: "1px solid rgba(61, 255, 192, 0.2)",
            borderRadius: "8px",
            padding: "0.75rem 1.25rem",
            fontSize: "13px",
            color: "var(--text2)",
            maxWidth: "520px",
            textAlign: "left"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent2)" strokeWidth="2" style={{ flexShrink: 0 }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>
              Proyecto <strong style={{ color: "var(--accent2)" }}>sin ánimo de lucro</strong>, gratuito y de código abierto.
              Hecho para ser compartido — si te ayuda, compártelo con quien pueda aprovecharlo.
            </span>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <Link href="/register" className="btn-primary" style={{ textDecoration: "none", padding: "0.75rem 2rem", fontSize: "1rem", borderRadius: "8px" }}>
              Crear cuenta gratis
            </Link>
            <Link href="/login" className="btn-sm" style={{ textDecoration: "none", padding: "0.75rem 2rem", fontSize: "1rem", borderRadius: "8px", background: "var(--surface)", border: "1px solid var(--border)" }}>
              Entrar al simulador
            </Link>
          </div>
        </div>

        <div style={{ marginTop: "4rem", width: "100%", maxWidth: "1000px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--surface)", padding: "2rem", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", textAlign: "left" }}>
            <div>
              <div style={{ color: "var(--accent)", marginBottom: "0.5rem" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg></div>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 0.5rem 0" }}>Múltiples Tarifas</h3>
              <p style={{ color: "var(--text3)", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>Añade y compara diferentes configuraciones de comercializadoras en un único panel de control.</p>
            </div>
            <div>
              <div style={{ color: "var(--accent2)", marginBottom: "0.5rem" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 0.5rem 0" }}>Simulador BOE</h3>
              <p style={{ color: "var(--text3)", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>Estimaciones fieles a la regulación con factores de potencia, impuestos y alquiler de equipos de medida incluidos.</p>
            </div>
            <div>
              <div style={{ color: "var(--green)", marginBottom: "0.5rem" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 0.5rem 0" }}>Cálculo de Excedentes</h3>
              <p style={{ color: "var(--text3)", fontSize: "0.9rem", margin: 0, lineHeight: 1.5 }}>Gestiona las compensaciones de energía y descubre cuánto te ahorras o cuánto estás regalando a la red.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-hl">¿Te ha ahorrado dinero?</div>
          <div className="footer-sub">
            CourelEnergy es gratuito y de código abierto.<br/>
            Si te ha ayudado a elegir la mejor tarifa, un café es la mejor forma de mantenerlo vivo.
          </div>
          <a className="coffee-btn-lg" href="https://buymeacoffee.com/courel" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" /></svg>
            Invítame a un café en buymeacoffee.com/courel
          </a>

          <div style={{ marginTop: "2rem", paddingTop: "2rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            <Link href="/terms" style={{ fontSize: "12px", color: "var(--text3)", textDecoration: "underline" }}>
              Términos y Condiciones
            </Link>
            <Link href="/faq#disclaimer" style={{ fontSize: "12px", color: "var(--text3)", textDecoration: "underline" }}>
              Aviso Legal y Descargo de Responsabilidad
            </Link>
            <a
              href="https://github.com/xantygc/courel_energy"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "12px", color: "var(--text3)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
