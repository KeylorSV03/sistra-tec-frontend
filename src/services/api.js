import axios from "axios";
import { formatDate, timeAgo } from "../utils/dateUtils";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");
const API_PREFIX = API_BASE_URL.endsWith("/api") ? "" : "/api";
const ACCESS_TOKEN_KEY = "sistra_access_token";
const SESSION_KEY = "sistra_user";

const endpoint = (path) => `${API_PREFIX}${path}`;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getAccessToken = () => sessionStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token) => {
  if (token) sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getStoredUser = () => {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const saveUser = (user) => {
  if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(SESSION_KEY);
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const url = originalRequest.url || "";
    const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/refresh");

    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post(endpoint("/auth/refresh"));
        setAccessToken(refreshResponse.data.accessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
        return api(originalRequest);
      } catch {
        clearSession();
      }
    }

    const message =
      error.response?.data?.message ||
      (status === 401 ? "Sesion expirada. Inicia sesion de nuevo." : "Error inesperado. Intenta de nuevo.");
    return Promise.reject(new Error(message));
  }
);

const responseWith = (response, data) => ({
  ...response,
  data: {
    ...response.data,
    ...data,
  },
});

const normalizeText = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const normalizeStatus = (value) => {
  const text = normalizeText(value);
  if (text.includes("pendiente")) return "Pendiente";
  if (text.includes("recibido")) return "Recibido";
  if (text.includes("clasificado")) return "Clasificado";
  if (text.includes("transito") || text.includes("recogida")) return "En tránsito";
  if (text.includes("entregado")) return "Entregado";
  return value || "Pendiente";
};

const statusIdFromLabel = (label) => {
  const text = normalizeText(label);
  if (text.includes("pendiente")) return 1;
  if (text.includes("recibido")) return 2;
  if (text.includes("clasificado")) return 3;
  if (text.includes("transito") || text.includes("recogida")) return 4;
  if (text.includes("entregado")) return 5;
  throw new Error("Estado de donacion no reconocido.");
};

const code = (prefix, id) => {
  if (id === undefined || id === null || id === "") return "";
  const value = String(id);
  if (value.startsWith(`${prefix}-`)) return value;
  return `${prefix}-${value.padStart(3, "0")}`;
};

const numericId = (id) => {
  if (typeof id === "number") return id;
  const match = String(id ?? "").match(/(\d+)$/);
  return match ? Number(match[1]) : Number(id);
};

const toAppUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    nombre: user.name ?? user.nombre,
    correo: user.email ?? user.correo,
    telefono: user.phoneNumber ?? user.phone_number ?? user.telefono,
    fotoPerfil: user.profilePhotoUrl ?? user.profile_photo_url,
    tipoUsuario: user.rolId ?? user.rol_id,
    rolNombre: user.rolName ?? user.rol_name,
    activo: user.isActive ?? user.is_active,
  };
};

const toDonation = (donation) => {
  const status = normalizeStatus(donation.statusName ?? donation.status_name ?? donation.estado);
  return {
    id: code("DON", donation.id),
    apiId: donation.id,
    givingId: donation.givingId ?? donation.giving_id,
    tipoDonacion: donation.itemName ?? donation.item_name ?? donation.tipoDonacion,
    cantidad: donation.quantity ?? donation.cantidad,
    unidadMedida: donation.unit ?? donation.unidadMedida,
    unidad: donation.unit ?? donation.unidad,
    descripcion: donation.description ?? donation.descripcion ?? "",
    fecha: formatDate(donation.date ?? donation.fecha),
    estado: status,
    statusId: donation.statusId ?? donation.status_id,
    donante: donation.donorName ?? donation.donor_name ?? donation.donante,
    correoDonante: donation.donorEmail ?? donation.donor_email ?? donation.correoDonante,
    telefonoDonante: donation.donorPhone ?? donation.donor_phone,
    imageUrl: donation.imageUrl ?? donation.image_url,
  };
};

const toTransporter = (transporter) => ({
  id: code("TRP", transporter.id),
  apiId: transporter.id,
  nombre: transporter.name ?? transporter.nombre,
  correo: transporter.email ?? transporter.correo,
  telefono: transporter.phoneNumber ?? transporter.phone_number ?? transporter.telefono,
  fotoPerfil: transporter.profilePhotoUrl ?? transporter.profile_photo_url,
  asignacionesActivas: transporter.activeAssignments ?? transporter.active_assignments ?? 0,
  estado: (transporter.isActive ?? transporter.is_active) ? "Activo" : "Inactivo",
});

const toAssignment = (delivery) => {
  const donationId = delivery.donationId ?? delivery.donation_id ?? delivery.id;
  return {
    id: code("DON", donationId),
    apiId: donationId,
    deliveryId: delivery.deliveryId ?? delivery.delivery_id,
    donacionId: code("DON", donationId),
    tipoDonacion: delivery.itemName ?? delivery.item_name ?? delivery.tipoDonacion,
    cantidad: delivery.quantity ?? delivery.cantidad,
    unidad: delivery.unit ?? delivery.unidad,
    descripcion: delivery.description ?? delivery.descripcion ?? "",
    imageUrl: delivery.imageUrl ?? delivery.image_url,
    donante: delivery.donorName ?? delivery.donor_name ?? delivery.donante,
    correoDonante: delivery.donorEmail ?? delivery.donor_email,
    telefono: delivery.donorPhone ?? delivery.donor_phone ?? delivery.telefono,
    transportistaId: delivery.driverId ?? delivery.driver_id,
    transportista: delivery.driverName ?? delivery.driver_name,
    correoTransportista: delivery.driverEmail ?? delivery.driver_email,
    direccionRecogida: delivery.collectionAddress ?? delivery.collection_address,
    destino: delivery.destination ?? delivery.destino,
    estado: normalizeStatus(delivery.statusName ?? delivery.status_name ?? delivery.estado),
    fechaAsignacion: formatDate(delivery.assignedAt ?? delivery.assigned_at),
    tipoEntrega: delivery.deliveryType ?? delivery.delivery_type,
  };
};

const notificationType = (notification) => {
  const event = normalizeText(notification.event_type ?? notification.tipo);
  if (event.includes("transito") || event.includes("recogida")) return "En tránsito";
  if (event.includes("entregado")) return "Entregado";
  if (event.includes("alerta")) return "alerta";
  if (event.includes("nueva") || event.includes("creada")) return "nueva";
  return notification.tipo ?? "default";
};

const toNotification = (notification) => ({
  id: notification.id,
  titulo: notification.title ?? notification.titulo,
  mensaje: notification.body ?? notification.message ?? notification.mensaje ?? notification.title,
  tiempo: notification.created_at || notification.createdAt ? timeAgo(notification.created_at ?? notification.createdAt) : "",
  leido: notification.is_read ?? notification.leido ?? false,
  tipo: notificationType(notification),
  donationId: notification.donation_id ?? notification.donationId,
});

export const authService = {
  verificar: async () => {
    const response = await api.get(endpoint("/auth/profile"));
    const usuario = toAppUser(response.data.user);
    saveUser(usuario);
    return responseWith(response, { usuario });
  },

  login: async ({ identificacion, correo, email, password }) => {
    const response = await api.post(endpoint("/auth/login"), {
      email: identificacion ?? correo ?? email,
      password,
    });
    setAccessToken(response.data.accessToken);
    const usuario = toAppUser(response.data.user);
    saveUser(usuario);
    return responseWith(response, { usuario });
  },

  logout: async () => {
    try {
      await api.post(endpoint("/auth/logout"));
    } finally {
      clearSession();
    }
  },

  registrarDonante: async ({ nombre, correo, password, telefono }) => {
    const response = await api.post(endpoint("/auth/register"), {
      name: nombre,
      email: correo,
      password,
      phone_number: telefono || undefined,
    });
    return responseWith(response, { usuario: toAppUser(response.data.user) });
  },

  olvidarContrasena: async (correo) => {
    const response = await api.post(endpoint("/auth/forgot-password"), { email: correo });
    return response;
  },

  verificarCodigo: async (correo, codigo) => {
    const response = await api.post(endpoint("/auth/verify-reset-code"), {
      email: correo,
      code: codigo,
    });
    return response;
  },

  restablecerContrasena: async (resetToken, nuevaContrasena) => {
    const response = await api.post(
      endpoint("/auth/reset-password"),
      { new_password: nuevaContrasena },
      { headers: { "x-reset-token": resetToken } }
    );
    return response;
  },
};

export const donationService = {
  listar: async (params = {}) => {
    const response = await api.get(endpoint("/donations"), { params });
    return responseWith(response, {
      donaciones: (response.data.donations ?? []).map(toDonation),
    });
  },

  obtener: async (id) => {
    const response = await api.get(endpoint(`/donations/${numericId(id)}`));
    return responseWith(response, { donacion: toDonation(response.data.donation) });
  },

  crear: async (data) => {
    if (!data.foto) {
      throw new Error("La imagen del bien es obligatoria.");
    }

    const formData = new FormData();
    formData.append("item_name", data.tipoDonacion);
    formData.append("description", data.descripcion ?? "");
    formData.append("quantity", Number(data.cantidad));
    formData.append("unit", data.unidadMedida);
    formData.append("image", data.foto);

    const response = await api.post(endpoint("/donations"), formData);
    return responseWith(response, { donacion: toDonation(response.data.donation) });
  },

  cambiarEstado: async (id, estado) => {
    const response = await api.patch(endpoint(`/donations/${numericId(id)}/status`), {
      status_id: statusIdFromLabel(estado),
    });
    return responseWith(response, { donacion: toDonation(response.data.donation) });
  },

  misDonaciones: async (params = {}) => donationService.listar(params),
};

export const inventoryService = {
  listar: async (params = {}) => {
    const [donationsResponse, deliveriesResponse] = await Promise.all([
      donationService.listar({ limit: 100, ...params }),
      api.get(endpoint("/admin/deliveries"), { params: { limit: 100 } }).catch(() => ({ data: { deliveries: [] } })),
    ]);
    const deliveries = (deliveriesResponse.data.deliveries ?? []).map(toAssignment);

    const pickupByDonation = new Map();
    const dropoffByDonation = new Map();
    for (const d of deliveries) {
      const key = String(d.apiId);
      if (d.tipoEntrega === "pickup") pickupByDonation.set(key, d);
      else dropoffByDonation.set(key, d);
    }

    const inventario = (donationsResponse.data.donaciones ?? []).map((donation) => {
      const key = String(donation.apiId);
      const pickup = pickupByDonation.get(key);
      const dropoff = dropoffByDonation.get(key);
      const estado = donation.estado;
      return {
        id: donation.id,
        apiId: donation.apiId,
        tipo: donation.tipoDonacion,
        cantidad: donation.cantidad,
        unidad: donation.unidadMedida,
        descripcion: donation.descripcion,
        imageUrl: donation.imageUrl,
        estado,
        puedeAsignarRecoleccion: estado === "Pendiente" && !pickup,
        recoleccionEnCurso: estado === "Pendiente" && Boolean(pickup),
        puedeClasificar: estado === "Recibido",
        puedeAsignarEntrega: estado === "Clasificado" && !dropoff,
        entregaAsignada: estado === "Clasificado" && Boolean(dropoff),
        asignadoA: dropoff?.destino ?? null,
        transportistaRecoleccion: pickup?.transportista ?? null,
        transportistaEntrega: dropoff?.transportista ?? null,
        recibido: donation.fecha,
      };
    });
    return responseWith(donationsResponse, { inventario });
  },

  asignar: async (id, data) => {
    const response = await api.post(endpoint("/admin/deliveries"), {
      donation_id: numericId(id),
      transporter_id: numericId(data.transporterId),
      collection_address: data.collectionAddress,
      destination: data.destination,
      delivery_type: data.deliveryType,
    });
    return responseWith(response, { asignacion: toAssignment(response.data.delivery) });
  },

  clasificar: async (id) => {
    const response = await donationService.cambiarEstado(id, "Clasificado");
    return response;
  },
};

export const transporterService = {
  listar: async (params = {}) => {
    const response = await api.get(endpoint("/admin/transporters"), { params });
    return responseWith(response, {
      transportistas: (response.data.transporters ?? []).map(toTransporter),
    });
  },

  obtener: async (id) => {
    const transporters = await transporterService.listar();
    const transportista = (transporters.data.transportistas ?? []).find(
      (item) => item.apiId === numericId(id) || item.id === id
    );
    return responseWith(transporters, { transportista });
  },

  crear: async ({ nombre, correo, telefono, password }) => {
    const response = await api.post(endpoint("/admin/transporters"), {
      name: nombre,
      email: correo,
      phone_number: telefono,
      password,
    });
    return responseWith(response, { transportista: toTransporter(response.data.transporter) });
  },

  actualizarEstado: async (id, isActive) => {
    const response = await api.patch(endpoint(`/admin/transporters/${numericId(id)}/status`), {
      is_active: isActive,
    });
    return responseWith(response, { transportista: toTransporter(response.data.transporter) });
  },

  asignarEntrega: async (data) => {
    const response = await api.post(endpoint("/admin/deliveries"), {
      donation_id: numericId(data.donationId),
      transporter_id: numericId(data.transporterId),
      collection_address: data.collectionAddress,
      destination: data.destination,
      delivery_type: data.deliveryType || "pickup",
    });
    return responseWith(response, { asignacion: toAssignment(response.data.delivery) });
  },

  listarEntregas: async (params = {}) => {
    const response = await api.get(endpoint("/admin/deliveries"), { params });
    return responseWith(response, {
      asignaciones: (response.data.deliveries ?? []).map(toAssignment),
    });
  },

  asignacionesDeTransportista: async (id, params = {}) => {
    const response = await api.get(endpoint(`/admin/transporters/${numericId(id)}/deliveries`), { params });
    return responseWith(response, {
      asignaciones: (response.data.deliveries ?? []).map(toAssignment),
    });
  },

  misAsignaciones: async (params = {}) => {
    const response = await api.get(endpoint("/transporter/deliveries"), { params });
    return responseWith(response, {
      asignaciones: (response.data.deliveries ?? []).map(toAssignment),
    });
  },

  obtenerAsignacion: async (id) => {
    const response = await api.get(endpoint(`/transporter/deliveries/${numericId(id)}`));
    return responseWith(response, { asignacion: toAssignment(response.data.delivery) });
  },

  confirmarRecogida: async (id) => {
    const response = await api.patch(endpoint(`/transporter/deliveries/${numericId(id)}/pickup`));
    return responseWith(response, { asignacion: toAssignment(response.data.delivery) });
  },

  confirmarEntrega: async (id) => {
    const response = await api.patch(endpoint(`/transporter/deliveries/${numericId(id)}/deliver`));
    return responseWith(response, { asignacion: toAssignment(response.data.delivery) });
  },
};

export const notificationService = {
  listar: async (params = {}) => {
    const response = await api.get(endpoint("/notifications"), { params });
    const payload = response.data.data ?? {};
    return responseWith(response, {
      notificaciones: (payload.notifications ?? []).map(toNotification),
      pagination: payload.pagination,
    });
  },

  marcarTodasLeidas: async () => api.patch(endpoint("/notifications/read-all")),

  marcarLeida: async (id) => api.patch(endpoint(`/notifications/${numericId(id)}/read`)),
};

export default api;
