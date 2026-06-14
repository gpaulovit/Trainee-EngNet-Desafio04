import { useState } from "react";
import { api } from "../services/apiClient";

export interface FrequenciaInput {
  alunoId: string;
  status: "presente" | "ausente" | null;
}

export interface SalvarAulaPayload {
  turmaId: string;
  data: string; // ISO String
  horarioInicio: string;
  horarioFim: string;
  descricao?: string;
  frequencias: FrequenciaInput[];
}

export function useAulas() {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const salvarChamada = async (payload: SalvarAulaPayload) => {
    setSalvando(true);
    setErro(null);
    try {
      await api.post("/api/aulas", payload);
      return true;
    } catch (err: any) {
      setErro(err.message || "Erro ao salvar a chamada");
      throw err;
    } finally {
      setSalvando(false);
    }
  };

  return {
    salvando,
    erro,
    salvarChamada,
  };
}
