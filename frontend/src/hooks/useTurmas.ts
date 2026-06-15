import { useState, useCallback } from "react";
import { api } from "../services/apiClient";

export interface Turma {
  id: string;
  nome: string;
  codigo: string;
  horario?: string;
}

export function useTurmas() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarTurmas = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const dados = await api.get<Turma[]>("/api/turmas");
      setTurmas(dados || []);
      return dados || [];
    } catch (err: any) {
      setErro(err.message || "Erro ao carregar turmas");
      return [];
    } finally {
      setCarregando(false);
    }
  }, []);

  return {
    turmas,
    carregando,
    erro,
    carregarTurmas,
  };
}
