import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Plus } from "lucide-react";

import { useDonorNav } from "../../hooks/useDonorNav.jsx";
import { donationService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import FilterTabs from "../../components/ui/FilterTabs";
import StatusBadge from "../../components/ui/StatusBadge";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";

const ALL_STATUSES = ["Todas", "Pendiente", "Recibido", "Clasificado", "En tránsito", "Entregado"];

export default function MyDonationsPage() {
  const navigate = useNavigate();
  const navItems = useDonorNav();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Todas");
  const [page, setPage] = useState(1);
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
            <Plus className="w-4 h-4" /> Nueva donación
          </Button>
        }
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Search */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por tipo o ID de donación..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" /> Filtros
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
          <p className="text-sm text-gray-400 text-center py-10">Cargando...</p>
        ) : paginated.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">No hay donaciones que coincidan.</p>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="text-left pb-3 font-medium">ID</th>
                  <th className="text-left pb-3 font-medium">Tipo de donación</th>
                  <th className="text-left pb-3 font-medium">Cantidad</th>
                  <th className="text-left pb-3 font-medium">Fecha</th>
                  <th className="text-left pb-3 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 text-gray-400 font-mono text-xs">{d.id}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <DonationIcon size="sm" />
                        <div>
                          <p className="font-medium text-gray-800">{d.tipoDonacion}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">
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
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
              <p className="text-sm text-gray-400">
                Mostrando {paginated.length} de {filtered.length} donaciones
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Anterior
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-medium">
                  {page}
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
