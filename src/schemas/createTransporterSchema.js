import { z } from "zod";

export const createTransporterSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  correo: z.email("Correo electrónico inválido"),
  telefono: z
    .string()
    .regex(/^\+506\s?\d{4}-?\d{4}$/, "Formato: +506 XXXX-XXXX"),
  password: z.string().min(8, "La contraseña temporal debe tener al menos 8 caracteres"),
});
