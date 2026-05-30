import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

import { useAdminNav } from "../../hooks/useAdminNav.jsx";
import { inventoryService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import FilterTabs from "../../components/ui/FilterTabs";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";

const INV_STATUS_STYLES = {
  Disponible: "bg-green-100 text-green-700",
  Asignado: "bg-blue-100 text-blue-700",
  Entregado: "bg-gray-100 text-gray-600",
};

const TABS = [
  { key: "Todos", label: "Todos" },
  { key: "Disponible", label: "Disponible" },
  { key: "Asignado", label: "Asignado" },
  { key: "Entregado", label: "Entregado" },
];

export default function AdminInventoryPage() {
  const navItems = useAdminNav();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");

  useEffect(() => {
    inventoryService
      .listar()
      .then((res) => setItems(res.data.inventario ?? []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchTab = activeTab === "Todos" || item.estado === activeTab;
      const matchSearch =
        !search ||
        item.tipo?.toLowerCase().includes(search.toLowerCase()) ||
        item.id?.toLowerCase().includes(search.toLowerCase());
      return matchTab && matchSearch;
    });
  }, [items, search, activeTab]);

  const metrics = [
    { label: "Disponibles", value: items.filter((i) => i.estado === "Disponible").length, color: "text-green-600" },
    { label: "Asignados", value: items.filter((i) => i.estado === "Asignado").length, color: "text-blue-600" },
    { label: "Entregados", value: items.filter((i) => i.estado === "Entregado").length, color: "text-gray-600" },
  ];

  const handleAssign = async (id) => {
    toast.info(`Función de asignación para ${id} (próximamente)`);
  };

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Gestión de inventario"
        subtitle={`${items.filter((i) => i.estado === "Disponible").length} artículos disponibles para asignar`}
      />

      {/* Metric cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
            <p className="text-sm text-gray-500 mt-1">{m.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por tipo o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <FilterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>

        {loading ? (
          <p className="text-sm text-gray-400 text-center py-10">Cargando...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                {["ID", "Tipo", "Cantidad", "Estado", "Asignado a", "Recibido", "Acción"].map((h) => (
                  <th key={h} className="text-left pb-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 text-gray-400 font-mono text-xs">{item.id}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <DonationIcon size="sm" />
                      <span className="text-gray-700">{item.tipo}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">{item.cantidad} {item.unidad}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${INV_STATUS_STYLES[item.estado] ?? "bg-gray-100 text-gray-600"}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-4 text-gray-600">{item.asignadoA ?? "—"}</td>
                  <td className="py-4 text-gray-500">{item.recibido}</td>
                  <td className="py-4">
                    {item.estado === "Disponible" ? (
                      <Button
                        className="!text-xs !px-3 !py-1.5"
                        onClick={() => handleAssign(item.id)}
                      >
                        Asignar a beneficiario
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-400">
                        {item.estado === "Entregado" ? "Completado" : "Ya asignado"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
