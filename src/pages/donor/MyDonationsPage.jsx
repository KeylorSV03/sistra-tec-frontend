import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Plus } from "lucide-react";

import { useDonorNav } from "../../hooks/useDonorNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { donationService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import FilterTabs from "../../components/ui/FilterTabs";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";
import DonationDetailModal from "../../components/ui/DonationDetailModal";

const ALL_STATUSES = ["Todas", "Pendiente", "Recibido", "Clasificado", "En tránsito", "Entregado"];

export default function MyDonationsPage() {
  usePageTitle("Mis donaciones");
  const navigate = useNavigate();
  const navItems = useDonorNav();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Todas");
  const [page, setPage] = useState(1);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const PER_PAGE = 10;

  useEffect(() => {
    donationService
      .misDonaciones()
      .then((res) => setDonations(res.data.donaciones ?? []))
      .catch(() => setDonations([]))
      .finally(() => setLoading(false));
  }, []);

  const tabs = ALL_STATUSES.map((s) => ({
    key: s,
    label: s,
    count:
      s === "Todas"
        ? donations.length
        : donations.filter((d) => d.estado === s).length || undefined,
  }));

  const filtered = useMemo(() => {
    return donations.filter((d) => {
      const matchTab = activeTab === "Todas" || d.estado === activeTab;
      const matchSearch =
        !search ||
        d.tipoDonacion?.toLowerCase().includes(search.toLowerCase()) ||
        d.id?.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [donations, activeTab, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Mis donaciones"
        subtitle={`${donations.length} donaciones registradas en total`}
        action={
          <Button onClick={() => navigate("/donor/register-donation")}>
            <Plus aria-hidden="true" className="w-4 h-4" /> Nueva donación
          </Button>
        }
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Search */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              aria-label="Buscar donaciones por tipo o ID"
              placeholder="Buscar por tipo o ID de donación..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <button
            type="button"
            disabled
            aria-label="Filtros (próximamente)"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 opacity-50 cursor-not-allowed"
          >
            <SlidersHorizontal aria-hidden="true" className="w-4 h-4" /> Filtros
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-5">
          <FilterTabs
            tabs={tabs}
            active={activeTab}
            onChange={(t) => { setActiveTab(t); setPage(1); }}
          />
        </div>

        {/* Table */}
        {loading ? (
          <p role="status" className="text-sm text-gray-600 text-center py-10">Cargando...</p>
        ) : paginated.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-10">No hay donaciones que coincidan.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <caption className="sr-only">Tus donaciones registradas</caption>
              <thead>
                <tr className="text-xs text-gray-600 uppercase tracking-wider border-b border-gray-100">
                  <th scope="col" className="text-left pb-3 font-medium">ID</th>
                  <th scope="col" className="text-left pb-3 font-medium">Tipo de donación</th>
                  <th scope="col" className="text-left pb-3 font-medium">Cantidad</th>
                  <th scope="col" className="text-left pb-3 font-medium">Fecha</th>
                  <th scope="col" className="text-left pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedDonation(d)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver detalle de donación ${d.id}, ${d.tipoDonacion}`}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedDonation(d)}
                  >
                    <td className="py-4 text-gray-700 font-mono text-xs">{d.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <DonationIcon size="sm" />
                        <div>
                          <p className="font-medium text-gray-800">{d.tipoDonacion}</p>
                          <p className="text-xs text-gray-600 truncate max-w-[200px]">
                            {d.descripcion}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-gray-700">{d.cantidad} {d.unidadMedida}</td>
                    <td className="py-4 text-gray-500">{d.fecha}</td>
                    <td className="py-4">
                      <StatusBadge status={d.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <nav aria-label="Paginación de donaciones" className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                Mostrando {paginated.length} de {filtered.length} donaciones
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  aria-current="page"
                  aria-label={`Pagina ${page}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-medium"
                >
                  {page}
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </nav>
          </>
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
