import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CheckCircle, User, Phone, Package, Truck } from "lucide-react";
import { toast } from "react-toastify";

import { useTransporterNav } from "../../hooks/useTransporterNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { transporterService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";

const isPickup = (a) => a?.tipoEntrega === "pickup";

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
      .obtenerAsignacion(id)
      .then((res) => setAssignment(res.data.asignacion ?? null))
      .catch(() => setAssignment(null))
      .finally(() => setLoading(false));
  }, [id]);

  const confirmAction = async () => {
    setConfirming(true);
    try {
      const donationId = assignment?.apiId ?? id;
      if (isPickup(assignment)) {
        await transporterService.confirmarRecogida(donationId);
      } else {
        await transporterService.confirmarEntrega(donationId);
      }
      const msg = isPickup(assignment)
        ? "¡Llegada al centro de acopio confirmada!"
        : "¡Entrega al beneficiario confirmada!";
      toast.success(msg);
      navigate("/transporter/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirming(false);
    }
  };

  const pickup = assignment && isPickup(assignment);

  const pickupLabel = pickup ? "Dirección de recolección (donante)" : "Origen (centro de acopio)";
  const destinationLabel = pickup ? "Destino (centro de acopio)" : "Beneficiario / Destino final";
  const actionLabel = pickup
    ? "Confirmar llegada al centro de acopio"
    : "Confirmar entrega al beneficiario";
  const statusDescription = () => {
    if (!assignment) return "";
    const { estado } = assignment;
    if (estado === "Entregado") return "La donación fue entregada exitosamente.";
    if (estado === "En tránsito") {
      return pickup
        ? "En camino al centro de acopio."
        : "En camino hacia el beneficiario.";
    }
    return pickup
      ? "Pendiente de recolección en el domicilio del donante."
      : "Pendiente de entrega al beneficiario.";
  };

  const alreadyDone =
    assignment?.estado === "Entregado" ||
    (pickup && assignment?.estado === "Recibido");

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Volver a la página anterior"
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalle de asignación</h1>
            <p className="text-sm text-gray-600">
              {id}
              {assignment && (
                <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {pickup ? "Recolección" : "Entrega a beneficiario"}
                </span>
              )}
            </p>
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
              <div className="flex items-start gap-4 mb-5">
                {assignment.imageUrl ? (
                  <img
                    src={assignment.imageUrl}
                    alt={`Foto de donación: ${assignment.tipoDonacion}`}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <Package aria-hidden="true" className="w-7 h-7 text-gray-300" />
                  </div>
                )}
                <div>
                  <h2 className="font-bold text-gray-900 text-lg">{assignment.tipoDonacion}</h2>
                  <p className="text-sm text-gray-500">{assignment.cantidad} {assignment.unidad}</p>
                  {assignment.descripcion && (
                    <p className="text-sm text-gray-600 mt-1">{assignment.descripcion}</p>
                  )}
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
              <h3 className="font-semibold text-gray-900 mb-4">{pickupLabel}</h3>
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
                      onClick={() => toast.info("La vista de mapa estará disponible próximamente.")}
                      className="text-sm text-orange-700 font-medium mt-2 inline-block hover:underline focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
                    >
                      Ver en mapa →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Destination */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">{destinationLabel}</h3>
              <div className={`rounded-xl p-4 ${pickup ? "bg-blue-50" : "bg-green-50"}`}>
                <div className="flex items-start gap-3">
                  {pickup ? (
                    <Truck aria-hidden="true" className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                  ) : (
                    <User aria-hidden="true" className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-gray-800">{assignment.destino}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {pickup
                        ? "Entregar la donación en el centro de acopio."
                        : "Beneficiario asignado por administración."}
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
              {alreadyDone ? (
                <p className="text-sm text-green-700 font-medium text-center py-4">
                  ✓ Esta asignación ya fue completada.
                </p>
              ) : (
                <Button
                  className="w-full !bg-green-700 hover:!bg-green-800 mb-3"
                  onClick={confirmAction}
                  loading={confirming}
                >
                  <CheckCircle aria-hidden="true" className="w-4 h-4" />
                  {actionLabel}
                </Button>
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
              <p className="text-sm text-gray-500 mt-3">{statusDescription()}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
