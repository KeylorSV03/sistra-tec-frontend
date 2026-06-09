import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { usePageTitle } from "../../hooks/usePageTitle";
import { authService } from "../../services/api";
import { resetPasswordSchema } from "../../schemas/forgotPasswordSchema";
import AuthLayout from "../../components/modules/sidebar/AuthLayout";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

export default function ResetPasswordPage() {
  usePageTitle("Nueva contraseña");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("sistra_reset_token");
    if (!token) {
      navigate("/forgot-password", { replace: true });
      return;
    }
    setResetToken(token);
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async ({ password }) => {
    setLoading(true);
    try {
      await authService.restablecerContrasena(resetToken, password);
      sessionStorage.removeItem("sistra_reset_email");
      sessionStorage.removeItem("sistra_reset_token");
      toast.success("¡Contraseña actualizada! Iniciá sesión.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const leftContent = (
    <div className="flex flex-col justify-center h-full">
      <h2 className="text-white text-3xl font-bold leading-snug">
        Creá tu nueva<br />contraseña.
      </h2>
      <p className="text-gray-300 text-sm mt-4 leading-relaxed">
        Elegí una contraseña segura de al menos 8 caracteres. Una vez guardada, podés iniciar sesión normalmente.
      </p>
    </div>
  );

  const rightContent = (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Nueva contraseña</h1>
      <p className="text-gray-500 text-sm mt-1 mb-6">
        Ingresá y confirmá tu nueva contraseña.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <InputField
          label="Nueva contraseña"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password?.message}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPassword}
              className="inline-flex w-6 h-6 items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded"
            >
              {showPassword ? <EyeOff aria-hidden="true" className="w-4 h-4" /> : <Eye aria-hidden="true" className="w-4 h-4" />}
            </button>
          }
          {...register("password")}
        />
        <InputField
          label="Confirmar contraseña"
          type={showConfirmar ? "text" : "password"}
          placeholder="••••••••"
          error={errors.confirmar?.message}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowConfirmar((p) => !p)}
              aria-label={showConfirmar ? "Ocultar confirmación" : "Mostrar confirmación"}
              aria-pressed={showConfirmar}
              className="inline-flex w-6 h-6 items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-400 rounded"
            >
              {showConfirmar ? <EyeOff aria-hidden="true" className="w-4 h-4" /> : <Eye aria-hidden="true" className="w-4 h-4" />}
            </button>
          }
          {...register("confirmar")}
        />
        <Button type="submit" loading={loading} className="w-full">
          Guardar contraseña
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/login" className="text-primary-600 font-medium hover:underline">
          ← Volver al inicio de sesión
        </Link>
      </p>
    </div>
  );

  return <AuthLayout leftContent={leftContent} rightContent={rightContent} />;
}
