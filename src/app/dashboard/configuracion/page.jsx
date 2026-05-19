"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function ConfiguracionPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("La nueva contrasena debe tener al menos 8 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setSubmitting(true);
    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
      });
      setSuccess("Contrasena actualizada correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        "No se pudo actualizar la contrasena. Verifica tu contrasena actual.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">Configuracion de cuenta</h1>
          <p className="text-sm text-gray-500 mt-1">Administra tu credencial de acceso</p>
        </div>

        {/* User info */}
        <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-blue-900 text-white text-sm font-semibold shrink-0">
              {user?.firstName?.[0]?.toUpperCase() || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user?.fullName || "Usuario"}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Change password form */}
        <div className="rounded-xl border border-gray-200 p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-900">Cambiar contrasena</h2>
            <p className="text-xs text-gray-500 mt-1">Ingresa tu contrasena actual y luego la nueva.</p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="currentPassword" className="block text-xs font-medium text-gray-600">
                Contrasena actual
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="Tu contrasena actual"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="newPassword" className="block text-xs font-medium text-gray-600">
                Nueva contrasena
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="Minimo 8 caracteres"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-600">
                Confirmar nueva contrasena
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="Repite la nueva contrasena"
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
                <p className="text-xs text-emerald-700">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-10 rounded-lg bg-[#0c111d] text-white text-sm font-medium transition-all hover:bg-[#0c111d]/90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Actualizando...
                </span>
              ) : (
                "Actualizar contrasena"
              )}
            </button>
          </form>
        </div>

        {/* Sign out */}
        <div className="rounded-xl border border-gray-200 p-5 sm:p-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Cerrar sesion</h2>
              <p className="text-xs text-gray-500 mt-1">Salir de tu cuenta en este dispositivo.</p>
            </div>
            <button
              onClick={handleSignOut}
              className="shrink-0 h-9 px-4 rounded-lg border border-red-200 bg-white text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
