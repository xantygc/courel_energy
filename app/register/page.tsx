"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error(await res.text() || "Error en el registro");
      }

      setSuccess(true);
      // Auto-login after successful registration
      const loginRes = await signIn("credentials", { email, password, redirect: false });
      if (!loginRes?.error) {
        router.push("/dashboard");
        router.refresh();
      } else {
        // Registration succeeded but auto-login failed — direct to login
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1 className="auth-title">CourelEnergy</h1>
        <p className="auth-subtitle">Crea tu cuenta gratis</p>
      </div>
      <div className="card">
        {success ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
            <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: "1rem", marginBottom: "0.5rem" }}>
              ¡Registro completado!
            </div>
            <p style={{ color: "var(--text2)", fontSize: "13px" }}>
              Accediendo al simulador...
            </p>
          </div>
        ) : (
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
              <label>Contraseña (mín. 6 caracteres)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="field auth-field" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginTop: "1rem" }}>
              <input
                type="checkbox"
                id="terms"
                required
                style={{ width: "auto", marginTop: "3px" }}
              />
              <label htmlFor="terms" style={{ fontSize: "12px", color: "var(--text2)", cursor: "pointer", fontWeight: "normal" }}>
                Acepto los <Link href="/terms" target="_blank" style={{ color: "var(--accent)", textDecoration: "underline" }}>Términos y Condiciones</Link> y consiento el uso de mi email para recibir actualizaciones de CourelEnergy.
              </label>
            </div>
            <button disabled={loading} type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
              {loading ? "Registrando..." : "Crear cuenta"}
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
        )}
        {!success && (
          <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "12px" }}>
            ¿Ya estás registrado? <Link href="/login" style={{ color: "var(--accent)", textDecoration: "none" }}>Inicia sesión</Link>
          </div>
        )}
      </div>
    </div>
  );
}
