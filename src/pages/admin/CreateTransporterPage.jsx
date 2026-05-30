import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ShieldCheck, UserPlus, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import { useAdminNav } from "../../hooks/useAdminNav.jsx";
import { createTransporterSchema } from "../../schemas/createTransporterSchema";
import { transporterService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

export default function CreateTransporterPage() {
  const navItems = useAdminNav();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createTransporterSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await transporterService.crear(data);
      toast.success("Transportista creado. Se envió la contraseña temporal al correo.");
      navigate("/admin/transporters");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear cuenta de transportista</h1>
          <p className="text-sm text-gray-500">Solo administradores pueden registrar transportistas</p>
        </div>
      </div>

      <div className="max-w-2xl flex flex-col gap-5">
        {/* Info banner */}
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-5 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary-700">
              Creación exclusiva para administradores
            </p>
            <p className="text-sm text-primary-600 mt-1">
              Las cuentas de transportistas no pueden ser creadas por el propio usuario. Solo
              administradores del sistema pueden registrarlos. Se enviará una contraseña temporal
              al correo ingresado.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Card header */}
          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-primary-500" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Datos del transportista</p>
              <p className="text-xs text-gray-400">Todos los campos son requeridos</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <InputField
              label="Nombre completo"
              type="text"
              placeholder="Ej: Luis Mora Quesada"
              error={errors.nombre?.message}
              {...register("nombre")}
            />

            <InputField
              label="Correo electrónico"
              type="email"
              placeholder="transportista@correo.cr"
              error={errors.correo?.message}
              {...register("correo")}
            />

            <InputField
              label="Teléfono"
              type="tel"
              placeholder="+506 8888-1234"
              hint="Formato: +506 XXXX-XXXX (número de Costa Rica)"
              error={errors.telefono?.message}
              {...register("telefono")}
            />

            <InputField
              label="Contraseña temporal"
              type={showPass ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              hint="El transportista deberá cambiar esta contraseña en su primer inicio de sesión."
              error={errors.password?.message}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register("password")}
            />

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={loading} className="flex-1">
                <UserPlus className="w-4 h-4" /> Crear transportista
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
