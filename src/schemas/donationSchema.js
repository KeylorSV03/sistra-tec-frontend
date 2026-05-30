import { z } from "zod";

export const donationSchema = z.object({
  tipoDonacion: z.string().min(1, "Seleccioná un tipo de donación"),
  cantidad: z
    .string()
    .min(1, "Ingresá la cantidad")
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, {
      message: "La cantidad debe ser un número positivo",
    }),
  unidadMedida: z.string().min(1, "Seleccioná una unidad de medida"),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500),
  foto: z.any().optional(),
});
