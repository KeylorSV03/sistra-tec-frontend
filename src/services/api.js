import axios from "axios";

// ─── Cliente HTTP (para cuando haya backend real) ─────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const mensaje =
      error.response?.data?.message || "Error inesperado. Intenta de nuevo.";
    return Promise.reject(new Error(mensaje));
  }
);

// ─── Datos de prueba ──────────────────────────────────────────────────────────
const MOCK_DONATIONS = [
  { id: "DON-001", tipoDonacion: "Alimentos no perecederos", cantidad: 50, unidadMedida: "kg", descripcion: "Arroz, frijoles, azúcar y aceite envasado. Todo sellado.", fecha: "2024-11-01", estado: "En tránsito", donante: "María González", correoDonante: "donante@sistratec.cr" },
  { id: "DON-002", tipoDonacion: "Ropa", cantidad: 30, unidadMedida: "prendas", descripcion: "Ropa de adulto en buen estado, incluye abrigos.", fecha: "2024-10-28", estado: "Entregado", donante: "María González", correoDonante: "donante@sistratec.cr" },
  { id: "DON-003", tipoDonacion: "Medicamentos", cantidad: 10, unidadMedida: "cajas", descripcion: "Medicamentos de primeros auxilios, sin vencimiento próximo.", fecha: "2024-11-05", estado: "Clasificado", donante: "María González", correoDonante: "donante@sistratec.cr" },
  { id: "DON-004", tipoDonacion: "Agua potable", cantidad: 200, unidadMedida: "litros", descripcion: "Botellas selladas de 5 litros.", fecha: "2024-11-07", estado: "Recibido", donante: "Roberto Salas", correoDonante: "roberto@ejemplo.cr" },
  { id: "DON-005", tipoDonacion: "Artículos de higiene", cantidad: 100, unidadMedida: "unidades", descripcion: "Jabón, shampoo, pasta dental.", fecha: "2024-11-08", estado: "Pendiente", donante: "Ana Jiménez", correoDonante: "ana@ejemplo.cr" },
  { id: "DON-006", tipoDonacion: "Frazadas", cantidad: 25, unidadMedida: "unidades", descripcion: "Frazadas en buen estado.", fecha: "2024-11-03", estado: "En tránsito", donante: "Carlos Pérez", correoDonante: "carlos@ejemplo.cr" },
];

const MOCK_INVENTORY = [
  { id: "INV-001", tipo: "Alimentos no perecederos", cantidad: 50, unidad: "kg", estado: "Asignado", asignadoA: "Albergue Guanacaste Norte", recibido: "2024-11-02" },
  { id: "INV-002", tipo: "Ropa", cantidad: 30, unidad: "prendas", estado: "Entregado", asignadoA: "Cruz Roja Pérez Zeledón", recibido: "2024-10-29" },
  { id: "INV-003", tipo: "Medicamentos", cantidad: 10, unidad: "cajas", estado: "Disponible", asignadoA: null, recibido: "2024-11-06" },
  { id: "INV-004", tipo: "Agua potable", cantidad: 200, unidad: "litros", estado: "Disponible", asignadoA: null, recibido: "2024-11-07" },
  { id: "INV-005", tipo: "Frazadas", cantidad: 25, unidad: "unidades", estado: "Asignado", asignadoA: "Centro de Acopio", recibido: "2024-11-04" },
];

const MOCK_TRANSPORTERS = [
  { id: "TRP-001", nombre: "Luis Mora", correo: "luis.mora@trans.cr", telefono: "+506 8888-1234", asignacionesActivas: 2, estado: "Activo" },
  { id: "TRP-002", nombre: "Ana Vargas", correo: "ana.vargas@trans.cr", telefono: "+506 8777-5678", asignacionesActivas: 0, estado: "Activo" },
  { id: "TRP-003", nombre: "Diego Solís", correo: "diego.solis@trans.cr", telefono: "+506 8666-9012", asignacionesActivas: 1, estado: "Activo" },
  { id: "TRP-004", nombre: "Patricia Núñez", correo: "patricia.nunez@trans.cr", telefono: "+506 8555-3456", asignacionesActivas: 0, estado: "Inactivo" },
];

const MOCK_ASSIGNMENTS = [
  { id: "DON-001", donacionId: "DON-001", tipoDonacion: "Alimentos no perecederos", cantidad: 50, unidad: "kg", descripcion: "Arroz, frijoles, azúcar y aceite envasado. Todo sellado.", donante: "María González", telefono: "+506 8800-1234", direccionRecogida: "Av. Central, San José, Costa Rica", destino: "Albergue Guanacaste Norte", estado: "En tránsito" },
  { id: "DON-006", donacionId: "DON-006", tipoDonacion: "Frazadas", cantidad: 25, unidad: "unidades", descripcion: "Frazadas en buen estado.", donante: "Carlos Pérez", telefono: "+506 8800-5678", direccionRecogida: "Barrio Los Yoses, San José", destino: "Centro de Acopio Limón", estado: "En tránsito" },
];

const MOCK_NOTIFICATIONS_DONOR = [
  { id: 1, mensaje: 'Tu donación DON-001 "Alimentos no perecederos" está en tránsito.', tiempo: "Hace 2 horas", leido: false, tipo: "En tránsito" },
  { id: 2, mensaje: 'Tu donación DON-002 "Ropa" ha sido entregada exitosamente.', tiempo: "Hace 1 día", leido: true, tipo: "Entregado" },
];

const MOCK_NOTIFICATIONS_ADMIN = [
  { id: 1, mensaje: "Se registró una nueva donación de artículos de higiene (DON-005).", tiempo: "Hace 3 horas", leido: false, tipo: "nueva" },
  { id: 2, mensaje: "Luis Mora confirmó la recogida de DON-001.", tiempo: "Hace 5 horas", leido: false, tipo: "En tránsito" },
  { id: 3, mensaje: "Hay 3 donaciones sin clasificar que requieren atención.", tiempo: "Hace 6 horas", leido: false, tipo: "alerta" },
];

const MOCK_NOTIFICATIONS_TRANSPORTER = [
  { id: 1, mensaje: 'Nueva asignación: DON-001 "Alimentos no perecederos" para entregar.', tiempo: "Hace 1 día", leido: false, tipo: "En tránsito" },
  { id: 2, mensaje: "Entrega DON-006 confirmada. ¡Buen trabajo!", tiempo: "Hace 2 días", leido: true, tipo: "Entregado" },
];

// Helper para simular delay de red
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));
const ok = (data) => Promise.resolve({ data });

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authService = {
  verificar: () => ok(null),
  login: (data) => ok(null),
  logout: () => ok(null),
  registrarDonante: async (data) => {
    await delay();
    return ok({ mensaje: "Cuenta creada exitosamente" });
  },
};

// ─── Donaciones ───────────────────────────────────────────────────────────────
export const donationService = {
  listar: async () => {
    await delay();
    return ok({ donaciones: MOCK_DONATIONS });
  },
  obtener: async (id) => {
    await delay();
    return ok({ donacion: MOCK_DONATIONS.find((d) => d.id === id) });
  },
  crear: async (data) => {
    await delay(800);
    const newId = `DON-00${MOCK_DONATIONS.length + 1}`;
    MOCK_DONATIONS.unshift({ ...data, id: newId, fecha: new Date().toISOString().slice(0, 10), estado: "Pendiente", donante: "María González" });
    return ok({ donacion: MOCK_DONATIONS[0] });
  },
  cambiarEstado: async (id, estado) => {
    await delay();
    const d = MOCK_DONATIONS.find((d) => d.id === id);
    if (d) d.estado = estado;
    return ok({ mensaje: "Estado actualizado" });
  },
  misDonaciones: async () => {
    await delay();
    return ok({ donaciones: MOCK_DONATIONS.filter((d) => d.donante === "María González") });
  },
};

// ─── Inventario ───────────────────────────────────────────────────────────────
export const inventoryService = {
  listar: async () => {
    await delay();
    return ok({ inventario: MOCK_INVENTORY });
  },
  asignar: async (id, data) => {
    await delay();
    const item = MOCK_INVENTORY.find((i) => i.id === id);
    if (item) { item.estado = "Asignado"; item.asignadoA = data.beneficiario; }
    return ok({ mensaje: "Asignado correctamente" });
  },
};

// ─── Transportistas ───────────────────────────────────────────────────────────
export const transporterService = {
  listar: async () => {
    await delay();
    return ok({ transportistas: MOCK_TRANSPORTERS });
  },
  obtener: async (id) => {
    await delay();
    return ok({ transportista: MOCK_TRANSPORTERS.find((t) => t.id === id) });
  },
  crear: async (data) => {
    await delay(800);
    return ok({ mensaje: "Transportista creado" });
  },
  misAsignaciones: async () => {
    await delay();
    return ok({ asignaciones: MOCK_ASSIGNMENTS });
  },
  confirmarRecogida: async (id) => {
    await delay();
    return ok({ mensaje: "Recogida confirmada" });
  },
  confirmarEntrega: async (id) => {
    await delay();
    return ok({ mensaje: "Entrega confirmada" });
  },
};

// ─── Notificaciones ───────────────────────────────────────────────────────────
let notifDonor = [...MOCK_NOTIFICATIONS_DONOR];
let notifAdmin = [...MOCK_NOTIFICATIONS_ADMIN];
let notifTransporter = [...MOCK_NOTIFICATIONS_TRANSPORTER];

export const notificationService = {
  listar: async () => {
    await delay();
    // Devuelve según usuario en sessionStorage
    try {
      const u = JSON.parse(sessionStorage.getItem("sistra_user") || "{}");
      const notifs = u.tipoUsuario === 1 ? notifAdmin : u.tipoUsuario === 3 ? notifTransporter : notifDonor;
      return ok({ notificaciones: notifs });
    } catch {
      return ok({ notificaciones: notifDonor });
    }
  },
  marcarTodasLeidas: async () => {
    await delay();
    notifDonor = notifDonor.map((n) => ({ ...n, leido: true }));
    notifAdmin = notifAdmin.map((n) => ({ ...n, leido: true }));
    notifTransporter = notifTransporter.map((n) => ({ ...n, leido: true }));
    return ok({ mensaje: "Marcadas como leídas" });
  },
  marcarLeida: async (id) => {
    await delay();
    return ok({ mensaje: "Marcada como leída" });
  },
};

export default api;
