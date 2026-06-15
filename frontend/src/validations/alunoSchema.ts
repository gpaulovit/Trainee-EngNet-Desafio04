import { z } from "zod";

export const alunoSchema = z.object({
  nome: z
    .string()
    .min(3, "O nome deve ter pelo menos 3 caracteres.")
    .max(100, "O nome é muito longo."),
  email: z
    .string()
    .email("Informe um endereço de e-mail válido."),
  matricula: z
    .string()
    .min(5, "A matrícula deve conter pelo menos 5 caracteres.")
    .regex(/^[A-Za-z0-9]+$/, "A matrícula deve conter apenas letras e números."),
});

export type AlunoFormData = z.infer<typeof alunoSchema>;
