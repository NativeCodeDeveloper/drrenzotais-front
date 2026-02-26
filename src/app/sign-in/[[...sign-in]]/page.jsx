"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import OrbBackground from "@/Componentes/OrbBackground";

export default function Page() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isLoaded) {
    return (
      <main className="min-h-screen grid place-items-center bg-black">
        <div className="animate-pulse text-white/40 text-sm font-[family-name:var(--font-inter)]">Cargando...</div>
      </main>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await signIn.create({
        identifier: email.trim(),
        password: password,
      });

      if (res.status === "complete") {
        await setActive({ session: res.createdSessionId });
        router.push("/dashboard");
      } else {
        setError("Se requiere un factor adicional para completar el ingreso.");
      }
    } catch (err) {
      const msg =
        err?.errors?.[0]?.message ||
        "No pudimos iniciar sesion. Revisa tus datos e intentalo nuevamente.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleOAuth(provider) {
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/dashboard",
      });
    } catch (err) {
      const msg =
        err?.errors?.[0]?.message || "No fue posible continuar con el proveedor.";
      setError(msg);
    }
  }

  return (
    <OrbBackground orbX={0.5} orbY={0.5}>
      <div className="min-h-screen flex items-center justify-center px-4 py-8 font-[family-name:var(--font-inter)]">
        <div className="relative z-10 w-full max-w-[860px]">

          {/* Top bar */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-fuchsia-500 to-violet-600 flex items-center justify-center">
                <span className="text-[9px] font-black text-white leading-none">AC</span>
              </div>
              <span className="font-[family-name:var(--font-michroma)] text-[13px] text-white/70">AgendaClinica</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] text-white/30">Cloud clinical operating system</span>
            </div>
          </div>

          {/* Layout principal: dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

            {/* Columna izquierda: Brand + info */}
            <div className="text-center md:text-left">
              <h1 className="font-[family-name:var(--font-michroma)] text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide leading-tight">
                Agenda
                <br />
                <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  Clinica
                </span>
              </h1>
              <p className="font-[family-name:var(--font-michroma)] text-[10px] sm:text-[11px] text-white/20 tracking-[0.25em] mt-4 uppercase">
                Healthcare Information System
              </p>

              <p className="text-[13px] text-white/40 mt-6 leading-relaxed max-w-sm mx-auto md:mx-0">
                Plataforma integral para la gestion de agendamientos, fichas clinicas y administracion de tu centro de salud.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mt-6 justify-center md:justify-start">
                <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
                  <span className="h-1 w-1 rounded-full bg-fuchsia-400" />
                  <span className="text-[11px] text-white/40">Agenda inteligente</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
                  <span className="h-1 w-1 rounded-full bg-violet-400" />
                  <span className="text-[11px] text-white/40">Fichas clinicas</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5">
                  <span className="h-1 w-1 rounded-full bg-indigo-400" />
                  <span className="text-[11px] text-white/40">Notificaciones</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 max-w-sm mx-auto md:mx-0">
                <div>
                  <div className="text-2xl font-bold text-white/90">99.9%</div>
                  <div className="text-[10px] text-white/25 mt-0.5">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white/90">256</div>
                  <div className="text-[10px] text-white/25 mt-0.5">Bit encryption</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white/90">24/7</div>
                  <div className="text-[10px] text-white/25 mt-0.5">Soporte</div>
                </div>
              </div>
            </div>

            {/* Columna derecha: Card login */}
            <div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/50 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_80px_rgba(120,40,200,0.08)]">
                <div className="mb-6">
                  <h2 className="text-[15px] font-medium text-white/90">Iniciar sesion</h2>
                  <p className="text-[13px] text-white/30 mt-1">Accede a tu panel de administracion</p>
                </div>

                {/* OAuth */}
                <button
                  type="button"
                  onClick={() => handleOAuth("google")}
                  className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-[13px] font-normal text-white/70 transition-all hover:bg-white/[0.08] hover:text-white hover:border-white/[0.15] active:scale-[0.98]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.1 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 19.5-7.6 21-18v-6.5z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 16.1 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 5.1 29.6 3 24 3 16.1 3 9.2 7.4 6.3 14.7z"/>
                    <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.1C29.3 35 26.8 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.4 5C9.1 41.7 16 45 24 45z"/>
                    <path fill="#1976D2" d="M45 24c0-1.4-.1-2.4-.4-3.5H24v8h11.3c-.5 2.6-2 4.8-4.1 6.3l6.2 5.1C40.7 37.4 45 31.4 45 24z"/>
                  </svg>
                  Continuar con Google
                </button>

                {/* Divider */}
                <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-[11px] text-white/20">o</span>
                  <div className="h-px flex-1 bg-white/[0.06]" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] text-white/40" htmlFor="email">
                      Correo electronico
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 text-[13px] text-white/90 placeholder:text-white/15 outline-none focus:border-white/[0.2] focus:bg-white/[0.06] transition-all"
                      placeholder="tu@correo.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] text-white/40" htmlFor="password">
                      Contrasena
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-10 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 text-[13px] text-white/90 placeholder:text-white/15 outline-none focus:border-white/[0.2] focus:bg-white/[0.06] transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3.5 py-2.5">
                      <p className="text-[12px] text-red-400/90">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-10 rounded-lg bg-white text-black text-[13px] font-medium transition-all hover:bg-white/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed mt-2"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Ingresando...
                      </span>
                    ) : (
                      "Ingresar"
                    )}
                  </button>
                </form>

                {/* Footer card */}
                <div className="mt-6 pt-5 border-t border-white/[0.06]">
                  <p className="text-center text-[11px] text-white/20">
                    Sin acceso? Contacta al administrador de tu clinica.
                  </p>
                </div>
              </div>

              {/* Trust badges debajo del card */}
              <div className="flex items-center justify-center gap-5 mt-5">
                <div className="flex items-center gap-1.5">
                  <svg className="h-3 w-3 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span className="text-[10px] text-white/20">SSL Secured</span>
                </div>
                <div className="h-3 w-px bg-white/[0.06]" />
                <div className="flex items-center gap-1.5">
                  <svg className="h-3 w-3 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                  <span className="text-[10px] text-white/20">HIPAA Ready</span>
                </div>
                <div className="h-3 w-px bg-white/[0.06]" />
                <div className="flex items-center gap-1.5">
                  <svg className="h-3 w-3 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <span className="text-[10px] text-white/20">Encrypted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 flex items-center justify-between text-[10px] text-white/15">
            <span>AgendaClinica v2.0</span>
            <span>Powered by NativeCode</span>
          </div>
        </div>
      </div>
    </OrbBackground>
  );
}
