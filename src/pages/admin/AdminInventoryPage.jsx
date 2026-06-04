import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { toast } from "react-toastify";

import { useAdminNav } from "../../hooks/useAdminNav.jsx";
import { usePageTitle } from "../../hooks/usePageTitle.js";
import { inventoryService, transporterService } from "../../services/api";
import Sidebar from "../../components/modules/sidebar/Sidebar";
import DashboardLayout from "../../components/modules/sidebar/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import FilterTabs from "../../components/ui/FilterTabs";
import DonationIcon from "../../components/ui/DonationIcon";
import Button from "../../components/ui/Button";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";

const INV_STATUS_STYLES = {
  Pendiente: "bg-gray-100 text-gray-600",
  Recibido: "bg-blue-100 text-blue-700",
  Clasificado: "bg-yellow-100 text-yellow-700",
  "En tránsito": "bg-orange-100 text-orange-700",
  Entregado: "bg-green-100 text-green-700",
};

const TABS = [
  { key: "Todos", label: "Todos" },
  { key: "Pendiente", label: "Pendiente" },
  { key: "Recibido", label: "Recibido" },
  { key: "Clasificado", label: "Clasificado" },
  { key: "En tránsito", label: "En tránsito" },
  { key: "Entregado", label: "Entregado" },
];

const EMPTY_ASSIGNMENT = {
  transporterId: "",
  collectionAddress: "",
  destination: "",
  deliveryType: "pickup",
};

export default function AdminInventoryPage() {
  usePageTitle("Gestión de inventario");
  const navItems = useAdminNav();
  const [items, setItems] = useState([]);
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const [selectedItem, setSelectedItem] = useState(null);
  const [assignment, setAssignment] = useState(EMPTY_ASSIGNMENT);

  useEffect(() => {
    Promise.all([inventoryService.listar(), transporterService.listar({ limit: 100 })])
      .then(([inventoryRes, transportersRes]) => {
        setItems(inventoryRes.data.inventario ?? []);
        setTransporters(transportersRes.data.transportistas ?? []);
      })
      .catch(() => {
        setItems([]);
        setTransporters([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeTransporters = transporters.filter((item) => item.estado === "Activo");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return items.filter((item) => {
      const matchTab = activeTab === "Todos" || item.estado === activeTab;
      const matchSearch =
        !search ||
        item.tipo?.toLowerCase().includes(query) ||
        item.id?.toLowerCase().includes(query);
      return matchTab && matchSearch;
    });
  }, [items, search, activeTab]);

  const metrics = [
    { label: "Sin asignar", value: items.filter((item) => item.disponibleParaAsignar).length, color: "text-green-600" },
    { label: "Asignadas", value: items.filter((item) => item.asignado && item.estado !== "Entregado").length, color: "text-blue-600" },
    { label: "Entregadas", value: items.filter((item) => item.estado === "Entregado").length, color: "text-gray-600" },
  ];

  const openAssignModal = (item) => {
    setSelectedItem(item);
    setAssignment(EMPTY_ASSIGNMENT);
  };

  const closeAssignModal = () => {
    setSelectedItem(null);
    setAssignment(EMPTY_ASSIGNMENT);
  };

  const updateAssignment = (field, value) => {
    setAssignment((current) => ({ ...current, [field]: value }));
  };

  const handleAssign = async (event) => {
    event.preventDefault();
    if (!selectedItem) return;

    if (!assignment.transporterId || !assignment.collectionAddress || !assignment.destination) {
      toast.error("Completá transportista, dirección y beneficiario/destino.");
      return;
    }

    setAssigning(true);
    try {
      await inventoryService.asignar(selectedItem.apiId ?? selectedItem.id, assignment);
      const transporter = transporters.find((item) => String(item.apiId) === String(assignment.transporterId));

      setItems((current) =>
        current.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                asignado: true,
                disponibleParaAsignar: false,
                asignadoA: assignment.destination,
                transportista: transporter?.nombre,
              }
            : item
        )
      );
      window.dispatchEvent(new Event("sistra:notifications-changed"));
      toast.success("Asignación creada correctamente.");
      closeAssignModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <DashboardLayout sidebar={<Sidebar navItems={navItems} />}>
      <PageHeader
        title="Gestión de inventario"
        subtitle={`${items.filter((item) => item.disponibleParaAsignar).length} artículos disponibles para asignar`}
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
            <p className="text-sm text-gray-500 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              aria-label="Buscar inventario por tipo o ID"
              placeholder="Buscar por tipo o ID..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <FilterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>

        {loading ? (
          <p role="status" className="text-sm text-gray-600 text-center py-10">
            Cargando...
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-600 text-center py-10">No hay artículos que coincidan.</p>
        ) : (
          <table className="w-full text-sm">
            <caption className="sr-only">Listado de inventario del sistema</caption>
            <thead>
              <tr className="text-xs text-gray-600 uppercase tracking-wider border-b border-gray-100">
                {["ID", "Tipo", "Cantidad", "Estado", "Asignado a", "Recibido", "Acción"].map((heading) => (
                  <th key={heading} scope="col" className="text-left pb-3 font-medium">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 text-gray-700 font-mono text-xs">{item.id}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <DonationIcon size="sm" />
                      <span className="text-gray-700">{item.tipo}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">
                    {item.cantidad} {item.unidad}
                  </td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${INV_STATUS_STYLES[item.estado] ?? "bg-gray-100 text-gray-600"}`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-4 text-gray-600">{item.asignadoA ?? "-"}</td>
                  <td className="py-4 text-gray-500">{item.recibido}</td>
                  <td className="py-4">
                    {item.disponibleParaAsignar ? (
                      <Button
                        className="!text-xs !px-3 !py-1.5"
                        onClick={() => openAssignModal(item)}
                        aria-label={`Asignar a beneficiario el inventario ${item.id}, ${item.tipo}`}
                      >
                        Asignar a beneficiario
                      </Button>
                    ) : (
                      <span className="text-xs text-gray-600">
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

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100" role="dialog" aria-modal="true" aria-labelledby="assign-title">
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h2 id="assign-title" className="text-lg font-bold text-gray-900">Asignar donación</h2>
                <p className="text-sm text-gray-500">
                  {selectedItem.id} - {selectedItem.tipo}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAssignModal}
                aria-label="Cerrar modal de asignación"
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <X aria-hidden="true" className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleAssign} className="p-6 flex flex-col gap-4">
              <SelectField
                label="Transportista"
                value={assignment.transporterId}
                onChange={(event) => updateAssignment("transporterId", event.target.value)}
                options={activeTransporters.map((item) => ({
                  value: item.apiId,
                  label: `${item.nombre} (${item.correo})`,
                }))}
                placeholder="Seleccioná transportista"
              />

              <InputField
                label="Dirección de recolección"
                value={assignment.collectionAddress}
                onChange={(event) => updateAssignment("collectionAddress", event.target.value)}
                placeholder="Ej: Cartago centro, 300m norte del parque"
              />

              <InputField
                label="Beneficiario o destino"
                value={assignment.destination}
                onChange={(event) => updateAssignment("destination", event.target.value)}
                placeholder="Ej: Albergue central de Cartago"
              />

              <SelectField
                label="Tipo de entrega"
                value={assignment.deliveryType}
                onChange={(event) => updateAssignment("deliveryType", event.target.value)}
                options={[
                  { value: "pickup", label: "Recolección y entrega" },
                  { value: "dropoff", label: "Entrega directa" },
                ]}
              />

              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={assigning} className="flex-1">
                  Crear asignación
                </Button>
                <Button type="button" variant="secondary" onClick={closeAssignModal}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
