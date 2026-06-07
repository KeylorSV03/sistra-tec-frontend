import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CheckCircle, User, Phone } from "lucide-react";
import { toast } from "react-toastify";

import { useTransporterNav } from "../../hooks/useTransporterNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { transporterService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";

export default function AssignmentDetailPage() {
  usePageTitle("Detalle de asignación");
  const { id } = useParams();
  const navItems = useTransporterNav();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    transporterService
      .misAsignaciones()
      .then((res) => {
        const found = (res.data.asignaciones ?? []).find((a) => a.id === id);
        setAssignment(found ?? null);
      })
      .catch(() => setAssignment(null))
      .finally(() => setLoading(false));
  }, [id]);

  const canDeliver = assignment?.estado === "En tránsito";

  const confirmDelivery = async () => {
    if (!canDeliver) return;
    setConfirming(true);
    try {
      await transporterService.confirmarEntrega(id);
      toast.success("¡Entrega confirmada exitosamente!");
      navigate("/transporter/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Volver a la pagina anterior"
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalle de asignación</h1>
            <p className="text-sm text-gray-600">{id}</p>
          </div>
        </div>
        {assignment && <StatusBadge status={assignment.estado} />}
      </div>

      {loading ? (
        <p role="status" className="text-sm text-gray-600 text-center py-10">Cargando...</p>
      ) : !assignment ? (
        <p className="text-sm text-gray-600 text-center py-10">Asignación no encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Donation info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-4 mb-5">
                <DonationIcon size="lg" />
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{assignment.tipoDonacion}</h2>
                  <p className="text-sm text-gray-500">{assignment.cantidad} {assignment.unidad}</p>
                  <p className="text-sm text-gray-600">{assignment.descripcion}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Donante</p>
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <User aria-hidden="true" className="w-3.5 h-3.5 text-gray-400" />
                    {assignment.donante}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Contacto</p>
                  <div className="flex items-center gap-1.5 text-sm text-gray-700">
                    <Phone aria-hidden="true" className="w-3.5 h-3.5 text-gray-400" />
                    {assignment.telefono ?? "+506 0000-0000"}
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Dirección de recolección</h3>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MapPin aria-hidden="true" className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{assignment.direccionRecogida}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Disponible lunes a sábado, 7:00am – 5:00pm
                    </p>
                    <button
                      type="button"
                      onClick={() => toast.info("La vista de mapa estara disponible proximamente.")}
                      className="text-sm text-orange-700 font-medium mt-2 inline-block hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
                    >
                      Ver en mapa →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery destination */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Destino de entrega</h3>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <User aria-hidden="true" className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{assignment.destino}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Beneficiario asignado por administración
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Acciones disponibles</h3>
              <Button
                className="w-full !bg-green-700 hover:!bg-green-800 mb-3"
                onClick={confirmDelivery}
                loading={confirming}
                disabled={!canDeliver}
              >
                <CheckCircle aria-hidden="true" className="w-4 h-4" />
                Confirmar entrega
              </Button>
              {!canDeliver && assignment.estado !== "Entregado" && (
                <p className="text-xs text-gray-500 mb-3">
                  Solo se puede confirmar la entrega cuando la donación está "En tránsito".
                </p>
              )}
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate("/transporter/dashboard")}
              >
                <ArrowLeft aria-hidden="true" className="w-4 h-4" />
                Volver al dashboard
              </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Estado actual</h3>
              <StatusBadge status={assignment.estado} />
              <p className="text-sm text-gray-500 mt-3">
                {assignment.estado === "En tránsito"
                  ? "La donación está en camino al destino."
                  : assignment.estado === "Entregado"
                  ? "La donación fue entregada exitosamente."
                  : "Pendiente de recogida."}
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
