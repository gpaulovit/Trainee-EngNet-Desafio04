"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Days_One } from "next/font/google";
import Header from "../../components/Header";

const daysOne = Days_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface Turma {
  id: string;
  nome: string;
  codigo: string;
  horario: string;
}

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
  const [salvando, setSalvando] = useState(false);
  
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState<Turma | null>(null);
  
  const [termoBusca, setTermoBusca] = useState("");
  const [alunosDoBanco, setAlunosDoBanco] = useState<AlunoDaTurma[]>([]);
  const [alunos, setAlunos] = useState<AlunoChamada[]>([]);
  const turmaAtualId = useMemo(() => turmaSelecionada?.id || "", [turmaSelecionada]);

  const buscarAlunosDaTurma = async (turmaId: string) => {
    try {
      const resposta = await fetch(`/api/alunos/turma/${turmaId}`, {
        credentials: "include",
      });

      if (!resposta.ok) {
        setAlunosDoBanco([]);
        setAlunos([]);
        return;
      }

      const dados: AlunoDaTurma[] = await resposta.json();
      setAlunosDoBanco(dados);

      const alunosFormatados: AlunoChamada[] = dados.map((aluno) => ({
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

  // 1. BUSCAR TURMAS DO PROFESSOR (Igual à página de Turmas)
  useEffect(() => {
    const buscarTurmas = async () => {
      try {
        const resposta = await fetch("/api/turmas", {
          credentials: "include",
        });
        if (resposta.ok) {
          const dadosAPI = await resposta.json();
          setTurmas(dadosAPI);
          if (dadosAPI.length > 0) {
            setTurmaSelecionada(dadosAPI[0]);
            buscarAlunosDaTurma(dadosAPI[0].id);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar turmas", error);
      }
    };
    buscarTurmas();

    const timer = setTimeout(() => {
      const hoje = new Date();
      setDataInput(hoje.toISOString().split("T")[0]);
      const horarioAgora = hoje.toTimeString().slice(0, 5);
      setHorarioInput(horarioAgora);
      setHorarioFimInput(adicionarUmaHora(horarioAgora));
    }, 0);

    return () => clearTimeout(timer);
  }, []);

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
      setSalvando(true);
      setMensagem({ texto: "Salvando chamada...", erro: false });

      const dataISO = new Date(`${dataInput}T00:00:00.000Z`).toISOString();

      const resposta = await fetch("/api/aulas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          turmaId: turmaSelecionada.id,
          data: dataISO,
          horarioInicio: horarioInput,
          horarioFim: horarioFimInput,
          descricao: observacoes,
          frequencias: alunos.map(a => ({
            alunoId: a.id,
            status: a.status
          }))
        }),
        credentials: "include",
      });

      if (resposta.ok) {
        setMensagem({ texto: "Chamada salva com sucesso.", erro: false });
        setAlunos(prev => prev.map(a => ({ ...a, status: null })));
        setObservacoes("");
      } else {
        const dadosErro = await resposta.json().catch(() => ({}));
        const mensagemErro = Array.isArray(dadosErro.message)
          ? dadosErro.message[0]
          : dadosErro.message || "Erro ao salvar a chamada no servidor.";
        setMensagem({ texto: mensagemErro, erro: true });
      }
    } catch (error) {
      console.error("Erro ao salvar chamada.", error);
      setMensagem({ texto: "Falha de comunicação com o servidor.", erro: true });
    } finally {
      setSalvando(false);
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

          {mensagem.texto && (
            <div className={`w-full max-w-5xl mb-4 p-4 rounded-xl text-sm font-bold text-center border-2 ${mensagem.erro ? "bg-[#1a0f1f] text-[#FF8D28] border-[#FF8D28]" : "bg-white text-[#4F0474] border-[#FF8D28]"}`}>
              {mensagem.texto}
            </div>
          )}

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

            <div className="w-full flex flex-col md:flex-row justify-between gap-4 shrink-0">
              <div className="flex-1 h-[54px] bg-white/95 rounded-xl flex flex-col justify-center px-4 shadow-md border border-[#FF8D28]/10">
                <label className="font-crimson text-[11px] font-bold text-gray-500 uppercase leading-none mb-1">Data</label>
                <input type="date" value={dataInput} onChange={(e) => setDataInput(e.target.value)} className="bg-transparent border-none outline-none font-sans text-sm text-black placeholder-gray-300 w-full" />
              </div>

              <div className="flex-1 h-[54px] bg-white/95 rounded-xl flex flex-col justify-center px-4 shadow-md border border-[#FF8D28]/10">
                <label className="font-crimson text-[11px] font-bold text-gray-500 uppercase leading-none mb-1">Início</label>
                <input type="time" value={horarioInput} onChange={(e) => setHorarioInput(e.target.value)} className="bg-transparent border-none outline-none font-sans text-sm text-black placeholder-gray-300 w-full" />
              </div>

              <div className="flex-1 h-[54px] bg-white/95 rounded-xl flex flex-col justify-center px-4 shadow-md border border-[#FF8D28]/10">
                <label className="font-crimson text-[11px] font-bold text-gray-500 uppercase leading-none mb-1">Término</label>
                <input type="time" value={horarioFimInput} onChange={(e) => setHorarioFimInput(e.target.value)} className="bg-transparent border-none outline-none font-sans text-sm text-black placeholder-gray-300 w-full" />
              </div>

              <button disabled={!turmaSelecionada} onClick={handleHistorico} className="w-full md:w-[180px] h-[54px] bg-white/95 rounded-xl font-crimson font-bold text-base text-black uppercase tracking-wide hover:bg-gray-100 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center border-b-4 border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed">
                Histórico
              </button>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-5 mt-2">
              
              <div className="w-full md:w-[200px] bg-white/95 p-5 flex flex-col gap-3 font-crimson text-black shadow-md shrink-0 rounded-xl border border-[#FF8D28]/10">
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Turma</span>
                  <span className="text-base font-bold text-gray-800">{turmaSelecionada ? turmaSelecionada.nome.toUpperCase() : "--"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Código</span>
                  <span className="text-sm font-mono text-gray-600">{turmaSelecionada ? turmaSelecionada.codigo : "--"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Horário</span>
                  <span className="text-sm font-semibold text-gray-600">{horarioInput && horarioFimInput ? `${horarioInput} - ${horarioFimInput}` : "--"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Alunos (Qtd)</span>
                  <span className="text-lg font-bold text-[#1E0144]">{alunosDoBanco.length}</span>
                </div>
              </div>

              <div className="flex-1 bg-white/95 shadow-md p-4 flex flex-col gap-3 rounded-xl border border-[#FF8D28]/10">
                
                <div className="relative w-full shrink-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input type="text" placeholder="Procurar aluno por nome..." value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg font-sans text-sm outline-none focus:ring-2 focus:ring-[#FF8D28]/50 focus:border-[#FF8D28] transition-all" />
                </div>

                <div className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-2">Observações da aula</label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Registre observações, conteúdo lecionado ou ocorrências da aula..."
                    className="w-full min-h-[90px] bg-white border border-gray-200 rounded-lg p-3 font-sans text-sm text-gray-700 outline-none resize-none focus:border-[#FF8D28] focus:ring-2 focus:ring-[#FF8D28]/30 transition-all"
                  />
                </div>

                <div className="flex-1 max-h-[250px] overflow-y-auto flex flex-col gap-2 custom-scrollbar pr-1">
                  {!turmaSelecionada ? (
                    <div className="w-full text-center py-6 text-gray-400 font-sans text-sm italic">
                      Selecione uma turma para ver os alunos.
                    </div>
                  ) : alunosFiltrados.length === 0 ? (
                    <div className="w-full text-center py-6 text-gray-400 font-sans text-sm italic">
                      Nenhum aluno cadastrado nesta turma.
                    </div>
                  ) : (
                    alunosFiltrados.map((aluno, index) => {
                      const isPresente = aluno.status === "presente";
                      const isAusente = aluno.status === "ausente";

                      return (
                        <div key={aluno.id} className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between font-crimson py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg shrink-0 gap-3 hover:bg-gray-100 transition-colors">
                          <span className="font-semibold text-gray-800 uppercase text-sm sm:text-base flex-1">
                            {String(index + 1).padStart(2, "0")}. {aluno.nome}
                          </span>

                          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <button type="button" onClick={() => handleStatusChange(aluno.id, "presente")} className={`w-20 py-2 rounded-lg transition-all duration-200 cursor-pointer font-sans text-[11px] font-bold uppercase tracking-wider ${isPresente ? "bg-[#FF8D28] text-white shadow-md scale-105 border border-[#FF8D28]" : "bg-white text-[#FF8D28] border border-[#FF8D28] hover:bg-[#fff2e8]"}`}>
                              Presente
                            </button>
                            <button type="button" onClick={() => handleStatusChange(aluno.id, "ausente")} className={`w-20 py-2 rounded-lg transition-all duration-200 cursor-pointer font-sans text-[11px] font-bold uppercase tracking-wider ${isAusente ? "bg-[#FF5CA8] text-white shadow-md scale-105 border border-[#FF5CA8]" : "bg-white text-[#FF5CA8] border border-[#FF5CA8] hover:bg-[#ffeaf4]"}`}>
                              Ausente
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end mt-2">
              <button disabled={salvando} onClick={handleSalvarChamada} className="w-full md:w-[220px] h-[48px] bg-[#FF8D28] font-crimson font-bold text-lg text-white tracking-wider hover:bg-[#e0771f] active:scale-95 transition-all shadow-lg cursor-pointer flex items-center justify-center rounded-xl border-b-4 border-[#c46516] disabled:opacity-70 disabled:cursor-not-allowed">
                {salvando ? "SALVANDO..." : "SALVAR CHAMADA"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}