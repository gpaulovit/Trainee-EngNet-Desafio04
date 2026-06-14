import { z } from "zod";

export const turmaSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  codigo: z.string().min(3, "O código deve ter pelo menos 3 caracteres"),
  curso: z.string().optional(),
  capacidade: z.string().min(1, "A capacidade é obrigatória"),
  horaInicio: z.string().min(1, "A hora de início é obrigatória"),
  horaFim: z.string().min(1, "A hora de fim é obrigatória"),
});

export type TurmaFormData = z.infer<typeof turmaSchema>;
