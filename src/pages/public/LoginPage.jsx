import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";
import { loginSchema } from "../../schemas/loginSchema";
import AuthLayout from "../../components/modules/sidebar/AuthLayout";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

const ROLE_ROUTES = {
  1: "/admin/dashboard",
  2: "/donor/dashboard",
  3: "/transporter/dashboard",
};

export default function LoginPage() {
  usePageTitle("Iniciar sesión");
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginUser(data);
      const role = res.usuario?.tipoUsuario;
      navigate(ROLE_ROUTES[role] ?? "/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const leftContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="mt-16">
        <h2 className="text-white text-3xl font-bold leading-snug">
          Conectando a quienes dan<br />con quienes más<br />necesitan.
        </h2>
        <p className="text-gray-300 text-sm mt-4 leading-relaxed">
          Seguimiento transparente y en tiempo real de cada donación ante emergencias naturales en Costa Rica.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {[
          { label: "Donaciones registradas", value: "1,247" },
          { label: "Entregadas exitosamente", value: "986" },
          { label: "Transportistas activos", value: "34" },
        ].map((s) => (
          <div key={s.label} className="flex items-center justify-between bg-dark-800 rounded-xl px-4 py-3">
            <span className="text-gray-300 text-sm">{s.label}</span>
            <span className="text-white font-bold">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const rightContent = (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Iniciar sesión</h1>
      <p className="text-gray-500 text-sm mt-1 mb-6">Ingresá con tu cuenta para continuar</p>

<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <InputField
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.cr"
          error={errors.identificacion?.message}
          {...register("identificacion")}
        />
        <div>
          <InputField
            label="Contraseña"
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
                {showPassword ? (
                  <EyeOff aria-hidden="true" className="w-4 h-4" />
                ) : (
                  <Eye aria-hidden="true" className="w-4 h-4" />
                )}
              </button>
            }
            {...register("password")}
          />
          <div className="text-right mt-1">
            <Link
              to="/forgot-password"
              className="text-xs text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-400 rounded"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>
        <Button type="submit" loading={loading} className="w-full">Iniciar sesión</Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿Sos donante y no tenés cuenta?{" "}
        <Link to="/register" className="text-primary-600 font-medium hover:underline">Registrarse</Link>
      </p>
    </div>
  );

  return <AuthLayout leftContent={leftContent} rightContent={rightContent} />;
}
