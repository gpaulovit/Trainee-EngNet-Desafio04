"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Days_One } from "next/font/google";
import Header from "../../components/Header";
import AlertMessage from "../../components/AlertMessage";
import Spinner from "../../components/Spinner";
import ChamadaInfoPanel from "../../components/controle/ChamadaInfoPanel";
import ChamadaInputs from "../../components/controle/ChamadaInputs";
import AlunosFrequenciaList from "../../components/controle/AlunosFrequenciaList";
import { useTurmas, Turma } from "../../hooks/useTurmas";
import { useAulas } from "../../hooks/useAulas";
import { api } from "../../services/apiClient";

const daysOne = Days_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

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

  // 3. SALVAR A CHAMADA NO BANCO DE DADOS
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
    <div className="min-h-screen w-full flex flex-col bg-degrade-zilla overflow-x-hidden pb-10 select-none">
      <Header />

      <div className="w-full max-w-6xl mx-auto px-4 mt-8">
        <main className="w-full bg-white rounded-[20px] flex flex-col items-center py-8 px-4 md:px-8 shadow-2xl relative border border-[#4F0474]/10">
          <h1 className={`${daysOne.className} text-3xl text-black tracking-wider mb-6 text-center`}>
            CONTROLE DE FREQUÊNCIA
          </h1>

          <div className="w-full max-w-5xl mb-4">
            <AlertMessage mensagem={mensagem.texto} erro={mensagem.erro} theme="light" />
          </div>

          <div className="w-full max-w-5xl bg-gradient-to-br from-[#1E0144] via-[#4F0474] to-[#7a165c] rounded-[20px] flex flex-col pt-6 px-4 md:px-8 pb-6 shadow-inner gap-5 border border-[#FF8D28]/30">
            
            {/* Seletor de Turma Dinâmico */}
            <div className="w-full h-[54px] bg-white/95 rounded-xl flex items-center px-4 shadow-md shrink-0 border border-white/20 focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
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
                className="w-full h-full bg-transparent border-none outline-none font-sans font-bold text-sm text-gray-800 cursor-pointer appearance-none"
              >
                <option value="" disabled hidden>Selecionar Turma...</option>
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>{t.codigo} - {t.nome}</option>
                ))}
              </select>
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

            <div className="w-full flex flex-col md:flex-row gap-5 mt-2">
              <ChamadaInfoPanel
                turmaSelecionada={turmaSelecionada}
                horarioInput={horarioInput}
                horarioFimInput={horarioFimInput}
                quantidadeAlunos={alunosDoBanco.length}
              />

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

            <div className="w-full flex justify-end mt-2">
              <button 
                disabled={salvando} 
                onClick={handleSalvarChamada} 
                className="w-full md:w-[220px] h-[48px] bg-[#FF8D28] font-crimson font-bold text-lg text-white tracking-wider hover:bg-[#e0771f] active:scale-95 transition-all shadow-lg cursor-pointer flex items-center justify-center rounded-xl border-b-4 border-[#c46516] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {salvando ? <Spinner className="w-6 h-6 text-white" /> : "SALVAR CHAMADA"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}