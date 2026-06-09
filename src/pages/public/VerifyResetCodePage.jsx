import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

import { usePageTitle } from "../../hooks/usePageTitle";
import { authService } from "../../services/api";
import { verifyCodeSchema } from "../../schemas/forgotPasswordSchema";
import AuthLayout from "../../components/modules/sidebar/AuthLayout";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

export default function VerifyResetCodePage() {
  usePageTitle("Verificar código");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [correo, setCorreo] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("sistra_reset_email");
    if (!saved) {
      navigate("/forgot-password", { replace: true });
      return;
    }
    setCorreo(saved);
  }, [navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(verifyCodeSchema) });

  const onSubmit = async ({ codigo }) => {
    setLoading(true);
    try {
      const res = await authService.verificarCodigo(correo, codigo);
      const resetToken = res.data?.resetToken;
      if (!resetToken) throw new Error("No se recibió el token de recuperación.");
      sessionStorage.setItem("sistra_reset_token", resetToken);
      toast.success("Código verificado. Creá tu nueva contraseña.");
      navigate("/forgot-password/reset");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const leftContent = (
    <div className="flex flex-col justify-center h-full">
      <h2 className="text-white text-3xl font-bold leading-snug">
        Revisá tu correo<br />electrónico.
      </h2>
      <p className="text-gray-300 text-sm mt-4 leading-relaxed">
        El código de verificación fue enviado a tu dirección de correo. Puede tardar unos minutos en llegar.
      </p>
    </div>
  );

  const rightContent = (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Verificar código</h1>
      <p className="text-gray-500 text-sm mt-1 mb-6">
        Ingresá el código que enviamos a <strong>{correo}</strong>.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <InputField
          label="Código de verificación"
          type="text"
          placeholder="Ej: 123456"
          error={errors.codigo?.message}
          {...register("codigo")}
        />
        <Button type="submit" loading={loading} className="w-full">
          Verificar código
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link to="/forgot-password" className="text-primary-600 font-medium hover:underline">
          ← Volver a ingresar correo
        </Link>
      </p>
    </div>
  );

  return <AuthLayout leftContent={leftContent} rightContent={rightContent} />;
}
