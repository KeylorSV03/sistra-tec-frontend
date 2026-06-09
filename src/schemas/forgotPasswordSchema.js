import { z } from "zod";

export const forgotPasswordSchema = z.object({
  correo: z.string().email("Ingresá un correo válido."),
});

export const verifyCodeSchema = z.object({
  codigo: z
    .string()
    .min(4, "El código debe tener al menos 4 caracteres.")
    .max(10, "Código inválido."),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmar: z.string(),
  })
  .refine((data) => data.password === data.confirmar, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmar"],
  });
