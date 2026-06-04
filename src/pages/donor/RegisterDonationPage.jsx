import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import { useDonorNav } from "../../hooks/useDonorNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { donationSchema } from "../../schemas/donationSchema";
import { donationService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import Button from "../../components/ui/Button";
import FileDropzone from "../../components/ui/FileDropzone";

const TIPO_OPTIONS = [
  { value: "Alimentos no perecederos", label: "Alimentos no perecederos" },
  { value: "Ropa", label: "Ropa" },
  { value: "Medicamentos", label: "Medicamentos" },
  { value: "Agua potable", label: "Agua potable" },
  { value: "Artículos de higiene", label: "Artículos de higiene" },
  { value: "Frazadas", label: "Frazadas" },
  { value: "Otro", label: "Otro" },
];

const UNIDAD_OPTIONS = [
  { value: "kg", label: "Kilogramos (kg)" },
  { value: "litros", label: "Litros" },
  { value: "unidades", label: "Unidades" },
  { value: "cajas", label: "Cajas" },
  { value: "prendas", label: "Prendas" },
  { value: "paquetes", label: "Paquetes" },
];

export default function RegisterDonationPage() {
  usePageTitle("Registrar donación");
  const navigate = useNavigate();
  const navItems = useDonorNav();
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(donationSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        tipoDonacion: data.tipoDonacion,
        cantidad: Number(data.cantidad),
        unidadMedida: data.unidadMedida,
        descripcion: data.descripcion,
      };
      await donationService.crear(payload);
      toast.success("¡Donación registrada exitosamente!");
      navigate("/donor/my-donations");
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
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Volver a la pagina anterior"
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ArrowLeft aria-hidden="true" className="w-4 h-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registrar nueva donación</h1>
          <p className="text-sm text-gray-500">Completá el formulario para registrar tu donación</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <SelectField
              label="Tipo de donación"
              hint="Seleccioná la categoría que mejor describe lo que vas a donar."
              options={TIPO_OPTIONS}
              error={errors.tipoDonacion?.message}
              {...register("tipoDonacion")}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Cantidad"
                type="number"
                placeholder="Ej: 10"
                hint="Ingresá la cantidad numérica."
                error={errors.cantidad?.message}
                {...register("cantidad")}
              />
              <SelectField
                label="Unidad de medida"
                options={UNIDAD_OPTIONS}
                error={errors.unidadMedida?.message}
                {...register("unidadMedida")}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="descripcion" className="text-sm font-medium text-gray-800">
                Descripción de los artículos
              </label>
              <textarea
                id="descripcion"
                rows={4}
                maxLength={500}
                aria-invalid={errors.descripcion ? "true" : undefined}
                aria-describedby={errors.descripcion ? "descripcion-error" : "descripcion-help descripcion-count"}
                placeholder="Ej: Arroz en sacos de 5kg, sellados de fábrica, vencen en 2026. Frijoles negros..."
                className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition resize-none ${
                  errors.descripcion ? "border-red-400" : ""
                }`}
                {...register("descripcion", {
                  onChange: (e) => setCharCount(e.target.value.length),
                })}
              />
              <div className="flex justify-between">
                <p id="descripcion-help" className="text-xs text-gray-600">
                  Mientras más detalle, más rápido podemos clasificar y enviar tu donación.
                </p>
                <span id="descripcion-count" className="text-xs text-gray-600">{charCount} / 500</span>
              </div>
              {errors.descripcion && (
                <p id="descripcion-error" role="alert" className="text-xs text-red-600">
                  {errors.descripcion.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label id="foto-label" className="text-sm font-medium text-gray-800">
                Foto de los artículos{" "}
                <span className="text-gray-600 font-normal">(opcional)</span>
              </label>
              <Controller
                name="foto"
                control={control}
                render={({ field }) => (
                  <FileDropzone label="foto de los artículos" onChange={field.onChange} />
                )}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" loading={loading} className="flex-1">
                Registrar donación
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
