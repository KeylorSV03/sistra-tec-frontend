import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { toast } from "react-toastify";

import { authService } from "../../services/api";
import { usePageTitle } from "../../hooks/usePageTitle";
import { registerDonorSchema } from "../../schemas/registerDonorSchema";
import AuthLayout from "../../components/modules/sidebar/AuthLayout";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

export default function RegisterPage() {
  usePageTitle("Registrarse");
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerDonorSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.registrarDonante({
        nombre: data.nombre,
        correo: data.correo,
        password: data.password,
      });
      toast.success("¡Cuenta creada! Ya podés iniciar sesión.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const leftContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="mt-16">
        <h2 className="text-white text-4xl font-bold leading-tight">
          Registrate como donante y empezá a marcar la diferencia.
        </h2>
        <p className="text-gray-300 text-sm mt-4 leading-relaxed">
          Solo donantes pueden crear cuentas directamente. Las cuentas de
          transportistas son creadas por el equipo administrador.
        </p>
      </div>

      <div className="bg-dark-700 rounded-2xl p-5">
        <p className="text-gray-300 text-sm">
          <span className="mr-1" aria-hidden="true">🔒</span>
          <strong className="text-white">Tus datos están seguros.</strong> Solo
          usamos tu información para identificar tus donaciones y enviarte
          actualizaciones de estado.
        </p>
      </div>
    </div>
  );

  const rightContent = (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Crear cuenta de donante
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <InputField
          label="Nombre completo"
          type="text"
          placeholder="Ej: María González Pérez"
          hint="Tu nombre aparecerá en el historial de la donación y en los reportes del sistema."
          error={errors.nombre?.message}
          {...register("nombre")}
        />

        <InputField
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.cr"
          hint="Usaremos este correo para enviarte actualizaciones sobre tus donaciones. No compartimos tu correo con terceros."
          error={errors.correo?.message}
          {...register("correo")}
        />

        <InputField
          label="Contraseña"
          type={showPass ? "text" : "password"}
          placeholder="Mínimo 8 caracteres"
          hint="Elegí una contraseña segura. Solo vos podrás acceder a tu cuenta."
          error={errors.password?.message}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPass}
              className="inline-flex w-6 h-6 items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded"
            >
              {showPass ? (
                <EyeOff aria-hidden="true" className="w-4 h-4" />
              ) : (
                <Eye aria-hidden="true" className="w-4 h-4" />
              )}
            </button>
          }
          {...register("password")}
        />

        <InputField
          label="Confirmar contraseña"
          type={showConfirm ? "text" : "password"}
          placeholder="Repetí tu contraseña"
          hint="Confirmá tu contraseña para evitar errores de escritura."
          error={errors.confirmPassword?.message}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              aria-label={showConfirm ? "Ocultar confirmacion de contraseña" : "Mostrar confirmacion de contraseña"}
              aria-pressed={showConfirm}
              className="inline-flex w-6 h-6 items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded"
            >
              {showConfirm ? (
                <EyeOff aria-hidden="true" className="w-4 h-4" />
              ) : (
                <Eye aria-hidden="true" className="w-4 h-4" />
              )}
            </button>
          }
          {...register("confirmPassword")}
        />

        {/* Terms */}
        <div className="text-center">
          <label className="flex items-center justify-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              aria-invalid={errors.terminos ? "true" : undefined}
              aria-describedby={errors.terminos ? "terminos-error" : undefined}
              className="w-4 h-4 accent-primary-600"
              {...register("terminos")}
            />
            <span>
              Acepto los terminos de uso y la politica de privacidad
            </span>
          </label>
          {errors.terminos && (
            <p id="terminos-error" role="alert" className="text-xs text-red-600 mt-1">
              {errors.terminos.message}
            </p>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Crear cuenta
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => navigate("/login")}
        >
          Cancelar
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  );

  return <AuthLayout leftContent={leftContent} rightContent={rightContent} />;
}
