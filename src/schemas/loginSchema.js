import { z } from "zod";

export const loginSchema = z.object({
  identificacion: z.email("Correo electrónico inválido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});
