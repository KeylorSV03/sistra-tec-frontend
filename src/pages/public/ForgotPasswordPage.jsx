import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "react-toastify";

import { usePageTitle } from "../../hooks/usePageTitle";
import { authService } from "../../services/api";
import { forgotPasswordSchema } from "../../schemas/forgotPasswordSchema";
import AuthLayout from "../../components/modules/sidebar/AuthLayout";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

export default function ForgotPasswordPage() {
  usePageTitle("Recuperar contraseña");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async ({ correo }) => {
    setLoading(true);
    try {
      await authService.olvidarContrasena(correo);
      sessionStorage.setItem("sistra_reset_email", correo);
      toast.success("Código enviado. Revisá tu correo.");
      navigate("/forgot-password/verify");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const leftContent = (
    <div className="flex flex-col justify-center h-full">
      <h2 className="text-white text-3xl font-bold leading-snug">
        Recuperá el acceso<br />a tu cuenta.
      </h2>
      <p className="text-gray-300 text-sm mt-4 leading-relaxed">
        Te enviamos un código a tu correo para que puedas restablecer tu contraseña de forma segura.
      </p>
    </div>
  );

  const rightContent = (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Olvidé mi contraseña</h1>
      <p className="text-gray-500 text-sm mt-1 mb-6">
        Ingresá tu correo y te enviaremos un código de verificación.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <InputField
          label="Correo electrónico"
          type="email"
          placeholder="tu@correo.cr"
          error={errors.correo?.message}
          {...register("correo")}
        />
        <Button type="submit" loading={loading} className="w-full">
          Enviar código
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
