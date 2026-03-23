"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email o contraseña incorrecta");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 className="auth-title">Facturio</h1>
        </Link>
        <p className="auth-subtitle">Inicia sesión para continuar</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ color: "var(--red)", marginBottom: "1rem", fontSize: "12px", textAlign: "center" }}>
              {error}
            </div>
          )}
          <div className="field auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field auth-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button disabled={loading} type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          {/* <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1rem 0" }}>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
            <span style={{ fontSize: "11px", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em" }}>o</span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid var(--border)" }} />
          </div>
 
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            style={{
              width: "100%",
              justifyContent: "center",
              gap: "0.5rem",
              display: "flex",
              alignItems: "center",
              background: "var(--bg3)",
              border: "1px solid var(--border2)",
              color: "var(--text)",
              cursor: "pointer",
              padding: "7px 14px",
              borderRadius: "var(--r)",
              fontFamily: "var(--font-head)",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.06em"
            }}
          >
            <svg width="18" height="18" viewBox="0 0 48 48" fill="none">
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.8C34.3 33.1 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l6.1-6.1C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.2-2.7-.2-4z"/>
              <path fill="#34A853" d="M6.3 14.7l7 5.1C15.1 16.1 19.2 13 24 13c3 0 5.8 1.1 7.9 3l6.1-6.1C34.3 6.1 29.4 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
              <path fill="#FBBC05" d="M24 44c5.2 0 9.9-1.8 13.6-4.7l-6.3-5.2C29.4 35.8 26.8 37 24 37c-5.7 0-10.5-3.8-12.2-9l-7 5.4C8.3 40 15.5 44 24 44z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.8c-1 2.9-3.1 5.3-5.9 6.8l6.3 5.2C40.8 37 44.5 31 44.5 24c0-1.3-.2-2.7-.2-4z"/>
            </svg>
            Continuar con Google
          </button> */}
        </form>
        <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "12px" }}>
          ¿No tienes cuenta? <Link href="/register" style={{ color: "var(--accent)", textDecoration: "none" }}>Regístrate</Link>
        </div>
      </div>
    </div>
  );
}
