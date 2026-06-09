import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { toast } from "react-toastify";

import { useAdminNav } from "../../hooks/useAdminNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { donationService } from "../../services/api";
import { STATUS_OPTIONS } from "../../utils/donationStatus";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import DonationDetailModal from "../../components/ui/DonationDetailModal";

const STATUS_ORDER = ["Pendiente", "Recibido", "Clasificado", "En tránsito", "Entregado"];

const nextValidStatuses = (currentStatus) => {
  const idx = STATUS_ORDER.indexOf(currentStatus);
  if (idx === -1 || idx === STATUS_ORDER.length - 1) return [];
  return [STATUS_ORDER[idx + 1]];
};

export default function AdminDonationsPage() {
  usePageTitle("Gestión de donaciones");
  const navItems = useAdminNav();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [order, setOrder] = useState("DESC");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    donationService
      .listar({ limit: 100 })
      .then((res) => setDonations(res.data.donaciones ?? []))
      .catch(() => setDonations([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    const filteredDonations = donations.filter((donation) => {
      const matchStatus = !statusFilter || donation.estado === statusFilter;
      const matchDateFrom = !dateFrom || donation.fecha >= dateFrom;
      const matchDateTo = !dateTo || donation.fecha <= dateTo;
      const matchSearch =
        !search ||
        donation.id?.toLowerCase().includes(query) ||
        donation.donante?.toLowerCase().includes(query) ||
        donation.tipoDonacion?.toLowerCase().includes(query);

      return matchStatus && matchDateFrom && matchDateTo && matchSearch;
    });

    return filteredDonations.sort((a, b) =>
      order === "ASC" ? a.fecha.localeCompare(b.fecha) : b.fecha.localeCompare(a.fecha)
    );
  }, [donations, search, statusFilter, dateFrom, dateTo, order]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
    setOrder("DESC");
  };

  const handleStateChange = async (id, newState) => {
    if (!newState) return;

    try {
      const res = await donationService.cambiarEstado(id, newState);
      const updatedDonation = res.data.donacion ?? {};
      setDonations((prev) =>
        prev.map((donation) =>
          donation.id === id ? { ...donation, ...updatedDonation } : donation
        )
      );
      window.dispatchEvent(new Event("sistra:notifications-changed"));
      toast.success(`Estado actualizado a "${updatedDonation.estado ?? newState}"`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Gestión de donaciones"
        subtitle={`${donations.length} donaciones en el sistema`}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              aria-label="Buscar donaciones por ID, donante o tipo"
              placeholder="Buscar por ID, donante o tipo..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>

          <div className="relative">
            <select
              aria-label="Filtrar donaciones por estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="">Todos los estados</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              aria-label="Fecha desde"
            />
            <span className="text-xs text-gray-400">hasta</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(event) => setDateTo(event.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
              aria-label="Fecha hasta"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowMoreFilters((value) => !value)}
            aria-expanded={showMoreFilters}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
          >
            <SlidersHorizontal aria-hidden="true" className="w-4 h-4" />
            Más filtros
          </button>
        </div>

        {showMoreFilters && (
          <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4 flex items-end gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <label htmlFor="donation-order" className="text-xs font-medium text-gray-500">
                Orden por fecha
              </label>
              <div className="relative">
                <select
                  id="donation-order"
                  value={order}
                  onChange={(event) => setOrder(event.target.value)}
                  className="appearance-none border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="DESC">Más recientes primero</option>
                  <option value="ASC">Más antiguas primero</option>
                </select>
                <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <X aria-hidden="true" className="w-4 h-4" />
              Limpiar filtros
            </button>

            <p className="text-xs text-gray-500 ml-auto">
              {filtered.length} resultado{filtered.length === 1 ? "" : "s"}
            </p>
          </div>
        )}

        {loading ? (
          <p role="status" className="text-sm text-gray-600 text-center py-10">
            Cargando...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-10">No hay donaciones que coincidan.</p>
        ) : (
          <table className="w-full text-sm">
            <caption className="sr-only">Listado de donaciones del sistema</caption>
            <thead>
              <tr className="text-xs text-gray-600 uppercase tracking-wider border-b border-gray-100">
                {["ID", "Donante", "Tipo", "Cantidad", "Fecha", "Estado", "Cambiar estado"].map((heading) => (
                  <th key={heading} scope="col" className="text-left pb-3 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((donation) => {
                const validNext = nextValidStatuses(donation.estado);
                return (
                  <tr
                    key={donation.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedDonation(donation)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver detalle de donación ${donation.id}`}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedDonation(donation)}
                  >
                    <td className="py-4 text-gray-700 font-mono text-xs">{donation.id}</td>
                    <td className="py-4">
                      <p className="font-medium text-gray-800">{donation.donante}</p>
                      <p className="text-xs text-gray-600">{donation.correoDonante}</p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <DonationIcon size="sm" />
                        <span className="text-gray-700">{donation.tipoDonacion}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">
                      {donation.cantidad} {donation.unidadMedida}
                    </td>
                    <td className="py-4 text-gray-500">{donation.fecha}</td>
                    <td className="py-4">
                      <StatusBadge status={donation.estado} />
                    </td>
                    <td className="py-4" onClick={(e) => e.stopPropagation()}>
                      {validNext.length > 0 ? (
                        <div className="relative">
                          <select
                            aria-label={`Cambiar estado de la donación ${donation.id}`}
                            defaultValue=""
                            onChange={(event) => handleStateChange(donation.id, event.target.value)}
                            className="appearance-none border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-xs text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                          >
                            <option value="" disabled>
                              Cambiar...
                            </option>
                            {validNext.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          {donation.estado === "Entregado" ? "Completado" : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {selectedDonation && (
        <DonationDetailModal
          donation={selectedDonation}
          onClose={() => setSelectedDonation(null)}
        />
      )}
    </DashboardLayout>
  );
}
