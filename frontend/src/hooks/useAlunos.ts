import { useState, useCallback } from "react";
import { api } from "../services/apiClient";

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  matricula: string;
}

export interface AlunoDaTurma {
  id: string;
  nome: string;
}

export function useAlunos() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarAlunosDaTurma = useCallback(async (turmaId: string) => {
    if (!turmaId) {
      setAlunos([]);
      return [];
    }

    setCarregando(true);
    setErro(null);
    try {
      const dados = await api.get<Aluno[]>(`/api/alunos/turma/${turmaId}`);
      setAlunos(dados || []);
      return dados || [];
    } catch (err: any) {
      setErro(err.message || "Erro ao carregar alunos");
      setAlunos([]);
      return [];
    } finally {
      setCarregando(false);
    }
  }, []);

  const salvarAluno = async (
    turmaId: string,
    dadosAluno: { nome: string; email: string; matricula: string },
    alunoIdEditando?: string | null
  ) => {
    setCarregando(true);
    setErro(null);
    try {
      const payload = { ...dadosAluno, turmaId };
      if (alunoIdEditando) {
        await api.patch(`/api/alunos/${alunoIdEditando}`, payload);
      } else {
        await api.post("/api/alunos", payload);
      }
      return true;
    } catch (err: any) {
      setErro(err.message || "Erro ao salvar aluno");
      throw err;
    } finally {
      setCarregando(false);
    }
  };

  return {
    alunos,
    carregando,
    erro,
    carregarAlunosDaTurma,
    salvarAluno,
  };
}
