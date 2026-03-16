import Link from "next/link";

const faqs = [
  {
    q: "¿Qué es CourelEnergy y para qué sirve?",
    a: "CourelEnergy es un simulador de facturas eléctricas que te permite comparar el coste anual de diferentes tarifas de luz (Iberdrola, Endesa, Octopus Energy, etc.) con tu propio consumo real. Así puedes saber qué tarifa te sale más barata y cuánto ahorrarías cambiando de comercializadora."
  },
  {
    q: "¿Cómo empiezo a usarlo?",
    a: "Regístrate o inicia sesión. Una vez dentro verás tres pestañas: Configuración, Consumos y Resultados. El flujo normal es: (1) revisar las tarifas disponibles en Configuración, (2) introducir tu consumo mensual en Consumos, y (3) ir a Resultados para ver el ranking."
  },
  {
    q: "¿Qué tarifas están disponibles?",
    a: "El administrador publica tarifas públicas (visibles para todos los usuarios) de las principales comercializadoras. Tú también puedes añadir tus propias tarifas privadas si tienes una oferta personalizada o quieres comparar un caso concreto."
  },
  {
    q: "¿Cómo añado una tarifa propia?",
    a: "En la pestaña Configuración, haz clic en «+ Añadir tarifa». Rellena el nombre de la comercializadora, nombre de la tarifa, y los precios de potencia (P1 y P2 en €/kW·año) y energía (P1, P2, P3 en c€/kWh). Si tienes placas solares, indica también el precio de excedentes. Guarda y ya aparecerá en el comparador."
  },
  {
    q: "¿Qué datos necesito de mis facturas?",
    a: "En la pestaña Consumos debes introducir, mes a mes: (1) los días del período de facturación, (2) la potencia contratada P1 y P2 en kW, (3) el consumo en kWh de cada período (punta, llana y valle). Estos datos los encontrarás en cualquier factura eléctrica en la sección de «Desglose de energía»."
  },
  {
    q: "¿Qué son P1, P2 y P3?",
    a: "Son los tres períodos horarios del discriminador horario 3.0TD (tarifa de peaje): P1 (Punta) es el período más caro, en horas de mayor demanda — en invierno de 10h a 14h y de 18h a 22h en días laborables. P2 (Llana) son horas intermedias. P3 (Valle) es el más barato — noches y fines de semana. Las comercializadoras aplican precios distintos en cada período."
  },
  {
    q: "¿Qué es el Bono Social?",
    a: "El Bono Social es un descuento en la factura eléctrica para consumidores vulnerables reconocido por el gobierno. Si eres beneficiario, introduce el importe en €/día en el apartado de Configuración → Parámetros del suministro. Si no lo eres, déjalo en 0."
  },
  {
    q: "¿Cómo funciona el autoconsumo?",
    a: "Si tienes placas solares, el campo «Autoconsumo estimado (0–1)» permite indicar qué fracción de tu consumo cubres con generación propia. Por ejemplo, 0.3 significa que el 30% de tu consumo proviene de tus propias placas. El simulador descontará ese porcentaje del consumo de red y calculará los excedentes que verterías a la red."
  },
  {
    q: "¿Qué muestran los Resultados?",
    a: "La pestaña de Resultados muestra un ranking de todas las tarifas ordenadas de menor a mayor coste anual. Puedes ver el ahorro respecto a la peor tarifa, el precio medio en c€/kWh y el desglose mes a mes. Al hacer clic en un mes ves la factura completa con todos los conceptos: potencia, energía, peajes, impuesto eléctrico, IVA, etc."
  },
  {
    q: "Los costes regulados (peajes, IVA, impuesto) ¿se actualizan solos?",
    a: "Los costes regulados (peajes BOE, impuesto eléctrico, IVA, alquiler del contador) los gestiona el administrador y son los mismos para todos los usuarios. Se corresponden con la regulación vigente. Tú no necesitas modificarlos."
  },
  {
    q: "¿Mis datos son privados?",
    a: "Sí. Tu consumo mensual solo existe en tu sesión del navegador (no se guarda en el servidor). Tus tarifas privadas solo son visibles para ti. Las tarifas públicas las comparte el administrador con todos los usuarios para facilitar la comparativa."
  },
  {
    q: "¿Puedo usar la aplicación sin registrarme?",
    a: "No, es necesario tener una cuenta para acceder al simulador. El registro es gratuito y solo requiere un email y contraseña (o tu cuenta de Google)."
  }
];

export default function FaqPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>

      {/* NAV */}
      <div className="nav">
        <Link href="/" className="nav-logo" style={{ textDecoration: "none" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          CourelEnergy
        </Link>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.75rem 0" }}>
          <Link href="/login" className="btn-sm" style={{ textDecoration: "none" }}>Iniciar Sesión</Link>
          <Link href="/register" className="btn-primary btn-sm" style={{ textDecoration: "none" }}>Registrarse</Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="app" style={{ maxWidth: 780 }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <div className="sec-title" style={{ marginBottom: "0.5rem" }}>Documentación</div>
          <h1 style={{ fontFamily: "var(--font-head)", fontSize: "2rem", fontWeight: 700, color: "var(--text)", marginBottom: "0.75rem" }}>
            Cómo usar el comparador
          </h1>
          <p style={{ color: "var(--text2)", lineHeight: 1.7 }}>
            Todo lo que necesitas saber para sacar partido al simulador de facturas eléctricas como usuario.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {faqs.map((item, i) => (
            <details key={i} className="card" style={{ padding: 0, cursor: "pointer" }}>
              <summary style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 1.25rem",
                fontFamily: "var(--font-head)",
                fontSize: "15px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: "var(--text)",
                listStyle: "none",
                userSelect: "none",
              }}>
                <span>{item.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0, marginLeft: "1rem", color: "var(--accent)", transition: "transform .2s" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div style={{ padding: "0 1.25rem 1.25rem", color: "var(--text2)", lineHeight: 1.7, fontSize: "13px", borderTop: "1px solid var(--border)" }}>
                <p style={{ marginTop: "1rem" }}>{item.a}</p>
              </div>
            </details>
          ))}
        </div>

        <div id="disclaimer" className="card" style={{ marginTop: "3rem", border: "1px solid var(--amber)", background: "var(--amber-dim)", padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", color: "var(--amber)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <h2 style={{ fontFamily: "var(--font-head)", fontSize: "18px", fontWeight: 700, margin: 0 }}>Aviso importante</h2>
          </div>
          <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: 1.6 }}>
            Las tarifas y parámetros regulados que encontrarás aquí se mantienen con la mejor intención, pero pueden no estar completamente actualizados o reflejar con exactitud las condiciones de cada comercializadora en cada momento. 
          </p>
          <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: 1.6, marginTop: "1rem" }}>
            Úsalos como punto de partida, <strong>contrasta siempre con tu contrato y con las fuentes oficiales</strong> antes de tomar ninguna decisión. 
            CourelEnergy es una herramienta de orientación, no un asesor energético.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-inner">
          <div className="footer-hl">¿Te ha ahorrado dinero?</div>
          <div className="footer-sub">
            CourelEnergy es gratuito y de código abierto.<br />
            Si te ha ayudado a elegir la mejor tarifa, un café es la mejor forma de mantenerlo vivo.
          </div>
          <a className="coffee-btn-lg" href="https://buymeacoffee.com/courel" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z" />
            </svg>
            Invítame a un café en buymeacoffee.com/courel
          </a>
 
          <div style={{ marginTop: "2rem", paddingTop: "2rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
            <Link href="/terms" style={{ fontSize: "12px", color: "var(--text3)", textDecoration: "underline" }}>
              Términos y Condiciones
            </Link>
            <a
              href="https://github.com/xantygc/courel_energy"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "12px", color: "var(--text3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Repository
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
