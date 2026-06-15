import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type AuthFormData = z.infer<typeof authSchema>;

export const cadastroSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;

export const esqueciSenhaSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export type EsqueciSenhaFormData = z.infer<typeof esqueciSenhaSchema>;
