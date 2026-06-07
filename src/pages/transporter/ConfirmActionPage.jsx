import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, CheckCircle, MapPin, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";

import { useTransporterNav } from "../../hooks/useTransporterNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { transporterService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";

export default function ConfirmActionPage() {
  usePageTitle("Confirmar acción");
  const navItems = useTransporterNav();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(null);

  useEffect(() => {
    transporterService
      .misAsignaciones()
      .then((res) => {
        const list = res.data.asignaciones ?? [];
        setAssignments(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, []);

  // Recoger donde el donante y llevar al centro de acopio: Pendiente → Recibido
  const canPickup = selected?.estado === "Pendiente";
  // Llevar del centro de acopio al beneficiario: En tránsito → Entregado
  const canDeliver = selected?.estado === "En tránsito";

  const handlePickup = async () => {
    if (!selected || !canPickup) return;
    setConfirming("pickup");
    try {
      await transporterService.confirmarRecogida(selected.apiId ?? selected.id);
      toast.success(`Recogida confirmada: ${selected.tipoDonacion} llegó al centro de acopio`);
      navigate("/transporter/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirming(null);
    }
  };

  const handleDelivery = async () => {
    if (!selected || !canDeliver) return;
    setConfirming("delivery");
    try {
      await transporterService.confirmarEntrega(selected.apiId ?? selected.id);
      toast.success(`¡Entrega confirmada! ¡Buen trabajo!`);
      navigate("/transporter/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirming(null);
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
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
          <h1 className="text-2xl font-bold text-gray-900">Confirmación de acción</h1>
          <p className="text-sm text-gray-500">Recogida y entrega de donaciones</p>
        </div>
      </div>

      <div className="max-w-2xl">
        {loading ? (
          <p role="status" className="text-sm text-gray-600 text-center py-10">Cargando...</p>
        ) : assignments.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-10">Sin asignaciones activas.</p>
        ) : (
          <>
            {/* Assignment selector if multiple */}
            {assignments.length > 1 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
                <p className="text-sm font-medium text-gray-700 mb-3">Seleccioná una asignación:</p>
                <div className="flex flex-col gap-2">
                  {assignments.map((a) => (
                    <button
                      type="button"
                      key={a.id}
                      onClick={() => setSelected(a)}
                      aria-pressed={selected?.id === a.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition ${
                        selected?.id === a.id
                          ? "border-primary-400 bg-primary-50"
                          : "border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <DonationIcon size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{a.tipoDonacion}</p>
                        <p className="text-xs text-gray-600">{a.donacionId}</p>
                      </div>
                      <StatusBadge status={a.estado} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selected && (
              <>
                {/* Assignment summary card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
                  <h2 className="font-semibold text-gray-900 mb-4">Resumen de la asignación</h2>

                  <div className="flex items-start gap-4 pb-4 border-b border-gray-100 mb-4">
                    <DonationIcon />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800">{selected.tipoDonacion}</p>
                        <StatusBadge status={selected.estado} />
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{selected.cantidad} {selected.unidad}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{selected.descripcion}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-2">
                      <MapPin aria-hidden="true" className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 mb-0.5">Dirección de recogida</p>
                        <p className="text-sm text-gray-700">{selected.direccionRecogida}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarDays aria-hidden="true" className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs text-gray-600 mb-0.5">Destinatario</p>
                        <p className="text-sm text-gray-700">{selected.destino}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action cards */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={handlePickup}
                    disabled={!!confirming || !canPickup}
                    aria-busy={confirming === "pickup" ? "true" : undefined}
                    className="bg-orange-700 hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl p-6 text-left transition"
                  >
                    <div className="mb-3">
                      {confirming === "pickup" ? (
                        <span aria-hidden="true" className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin inline-block" />
                      ) : (
                        <Truck aria-hidden="true" className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <p className="font-semibold text-white text-base">Confirmar recogida</p>
                    <p className="text-sm text-orange-50 mt-1">Recogés la donación y la llevás al centro de acopio. La marca como "Recibido".</p>
                  </button>

                  <button
                    type="button"
                    onClick={handleDelivery}
                    disabled={!!confirming || !canDeliver}
                    aria-busy={confirming === "delivery" ? "true" : undefined}
                    className="bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl p-6 text-left transition"
                  >
                    <div className="mb-3">
                      {confirming === "delivery" ? (
                        <span aria-hidden="true" className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                      ) : (
                        <CheckCircle aria-hidden="true" className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <p className="font-semibold text-white text-base">Confirmar entrega</p>
                    <p className="text-sm text-green-50 mt-1">Llevás la donación del centro de acopio al beneficiario. La marca como "Entregado".</p>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
