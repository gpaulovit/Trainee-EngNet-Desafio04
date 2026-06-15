"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import AlertMessage from "../../components/AlertMessage";
import Spinner from "../../components/Spinner";
import ChamadaInfoPanel from "../../components/controle/ChamadaInfoPanel";
import ChamadaInputs from "../../components/controle/ChamadaInputs";
import AlunosFrequenciaList from "../../components/controle/AlunosFrequenciaList";
import { useTurmas, Turma } from "../../hooks/useTurmas";
import { useAulas } from "../../hooks/useAulas";
import { api } from "../../services/apiClient";

interface AlunoChamada {
  id: string;
  nome: string;
  status: "presente" | "ausente" | null;
}

interface AlunoDaTurma {
  id: string;
  nome: string;
}

interface MensagemFluxo {
  texto: string;
  erro: boolean;
}

const adicionarUmaHora = (hora: string) => {
  if (!hora) return "";
  const [horas, minutos] = hora.split(":").map(Number);
  const data = new Date();
  data.setHours(horas || 0, minutos || 0, 0, 0);
  data.setHours(data.getHours() + 1);
  return data.toTimeString().slice(0, 5);
};

export default function Controle() {
  const router = useRouter();

  const [dataInput, setDataInput] = useState("");
  const [horarioInput, setHorarioInput] = useState("");
  const [horarioFimInput, setHorarioFimInput] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [mensagem, setMensagem] = useState<MensagemFluxo>({ texto: "", erro: false });
  const { turmas, carregarTurmas } = useTurmas();
  const { salvarChamada, salvando } = useAulas();
  
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  
  const [termoBusca, setTermoBusca] = useState("");
  const [alunosDoBanco, setAlunosDoBanco] = useState<AlunoDaTurma[]>([]);
  const [alunos, setAlunos] = useState<AlunoChamada[]>([]);
  const turmaAtualId = useMemo(() => turmaSelecionada?.id || "", [turmaSelecionada]);

  const buscarAlunosDaTurma = async (turmaId: string) => {
    try {
      const dados = await api.get<AlunoDaTurma[]>(`/api/alunos/turma/${turmaId}`);
      setAlunosDoBanco(dados || []);

      const alunosFormatados: AlunoChamada[] = (dados || []).map((aluno) => ({
        id: aluno.id,
        nome: aluno.nome,
        status: null,
      }));
      setAlunos(alunosFormatados);
    } catch (error) {
      console.error("Erro de conexão ao buscar alunos.", error);
      setAlunosDoBanco([]);
      setAlunos([]);
    }
  };

  useEffect(() => {
    carregarTurmas().then((dados) => {
      if (dados && dados.length > 0) {
        setTurmaSelecionada(dados[0]);
        buscarAlunosDaTurma(dados[0].id);
      }
    });

    const timer = setTimeout(() => {
      const hoje = new Date();
      setDataInput(hoje.toISOString().split("T")[0]);
      const horarioAgora = hoje.toTimeString().slice(0, 5);
      setHorarioInput(horarioAgora);
      setHorarioFimInput(adicionarUmaHora(horarioAgora));
    }, 0);

    return () => clearTimeout(timer);
  }, [carregarTurmas]);

  const handleStatusChange = (id: string, novoStatus: "presente" | "ausente") => {
    setAlunos((prev) =>
      prev.map((aluno) =>
        aluno.id === id ? { ...aluno, status: novoStatus } : aluno,
      ),
    );
  };

  const handleHistorico = () => {
    if (!turmaAtualId) {
      setMensagem({ texto: "Selecione uma turma para abrir o histórico.", erro: true });
      return;
    }
    router.push(`/controle/historico?turmaId=${turmaAtualId}`);
  };

  const handleSalvarChamada = async () => {
    if (!turmaSelecionada) {
      setMensagem({ texto: "Selecione uma turma primeiro.", erro: true });
      return;
    }

    if (!dataInput || !horarioInput || !horarioFimInput) {
      setMensagem({ texto: "Preencha data, horário inicial e horário final.", erro: true });
      return;
    }
    
    const alunosSemStatus = alunos.filter(a => a.status === null);
    if (alunosSemStatus.length > 0) {
      setMensagem({ texto: "Marque todos os alunos como Presente ou Ausente antes de salvar.", erro: true });
      return;
    }

    try {
      setMensagem({ texto: "Salvando chamada...", erro: false });

      const dataISO = new Date(`${dataInput}T00:00:00.000Z`).toISOString();

      await salvarChamada({
        turmaId: turmaSelecionada.id,
        data: dataISO,
        horarioInicio: horarioInput,
        horarioFim: horarioFimInput,
        descricao: observacoes,
        frequencias: alunos.map(a => ({
          alunoId: a.id,
          status: a.status
        }))
      });

      setMensagem({ texto: "Chamada salva com sucesso.", erro: false });
      setAlunos(prev => prev.map(a => ({ ...a, status: null })));
      setObservacoes("");
    } catch (error: any) {
      console.error("Erro ao salvar chamada.", error);
      setMensagem({ texto: error.message || "Falha de comunicação com o servidor.", erro: true });
    }
  };

  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-10">
      <Header />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <main className="w-full flex flex-col gap-6">
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">
                Controle de Frequência
              </h1>
              <p className="font-sans text-sm text-gray-500 dark:text-gray-400 mt-1">
                Realize a chamada da turma selecionada.
              </p>
            </div>
            <button
              type="button"
              disabled={!turmaAtualId}
              onClick={handleHistorico}
              className="h-10 px-4 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg font-sans font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              Ver Histórico
            </button>
          </div>

          {mensagem.texto && (
            <div className={`w-full p-4 rounded-lg text-sm font-medium border ${mensagem.erro ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"}`}>
              {mensagem.texto}
            </div>
          )}

          <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col pt-6 px-6 pb-8 transition-colors duration-300">
            
            {/* Seletor de Turma Dinâmico */}
            <div className="w-full mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Selecionar Turma
              </label>
              <div className="relative">
                <select
                  value={turmaSelecionada?.id || ""}
                  onChange={(e) => {
                    const turma = turmas.find(t => t.id === e.target.value);
                    if (turma) {
                      setTurmaSelecionada(turma);
                      buscarAlunosDaTurma(turma.id);
                    } else {
                      setTurmaSelecionada(null);
                      setAlunosDoBanco([]);
                      setAlunos([]);
                    }
                  }}
                  className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm appearance-none"
                >
                  <option value="" disabled hidden>Selecione uma turma...</option>
                  {turmas.map((t) => (
                    <option key={t.id} value={t.id}>{t.codigo} - {t.nome}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <ChamadaInputs
              dataInput={dataInput}
              setDataInput={setDataInput}
              horarioInput={horarioInput}
              setHorarioInput={setHorarioInput}
              horarioFimInput={horarioFimInput}
              setHorarioFimInput={setHorarioFimInput}
              turmaSelecionadaId={turmaSelecionada?.id}
              onHistorico={handleHistorico}
            />

            <div className="w-full flex flex-col lg:flex-row gap-6 mt-6 items-stretch">
              <ChamadaInfoPanel
                turmaSelecionada={turmaSelecionada}
                horarioInput={horarioInput}
                horarioFimInput={horarioFimInput}
                quantidadeAlunos={alunosDoBanco.length}
              />

              <div className="flex-1 min-w-0">
                <AlunosFrequenciaList
                  termoBusca={termoBusca}
                  setTermoBusca={setTermoBusca}
                  observacoes={observacoes}
                  setObservacoes={setObservacoes}
                  alunosFiltrados={alunosFiltrados}
                  turmaSelecionadaId={turmaSelecionada?.id}
                  handleStatusChange={handleStatusChange}
                />
              </div>
            </div>

            <div className="w-full flex justify-end mt-8 border-t border-gray-200 dark:border-slate-700 pt-6">
              <button 
                disabled={salvando} 
                onClick={handleSalvarChamada} 
                className="w-full sm:w-auto px-8 h-12 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-lg font-sans font-medium text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {salvando ? <Spinner className="w-5 h-5 text-white" /> : "Salvar Chamada"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}