"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Days_One } from "next/font/google";
import Header from "../../../components/Header";

const daysOne = Days_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Historico() {
  const router = useRouter();

  const [porcentagemPresentes, setPorcentagemPresentes] = useState(0);
  const [porcentagemAusentes, setPorcentagemAusentes] = useState(0);
  const [aulaSelecionadaId, setAulaSelecionadaId] = useState("");
  const [turmaId, setTurmaId] = useState("");
  const [aulas, setAulas] = useState<AulaHistorico[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  interface FrequenciaHistorico {
    status: "PRESENTE" | "FALTA";
    aluno: { id: string; nome: string };
  }

  interface AulaHistorico {
    id: string;
    data: string;
    hora_inicio: string;
    hora_fim: string;
    descricao?: string | null;
    turma: { id: string; nome: string; codigo: string };
    frequencias: FrequenciaHistorico[];
  }

  const aulaSelecionada = useMemo(
    () => aulas.find((aula) => aula.id === aulaSelecionadaId) ?? aulas[0] ?? null,
    [aulas, aulaSelecionadaId],
  );

  const handleSalvar = () => {
    router.push("/controle");
  };

  useEffect(() => {
    const turma = new URLSearchParams(window.location.search).get("turmaId") || "";
    setTurmaId(turma);
  }, []);

  useEffect(() => {
    const buscarHistorico = async () => {
      if (!turmaId) return;

      setCarregando(true);
      setErro("");
      try {
        const resposta = await fetch(`/api/aulas/turma/${turmaId}`, {
          credentials: "include",
        });

        if (resposta.ok) {
          const dados: AulaHistorico[] = await resposta.json();
          setAulas(dados);
          setAulaSelecionadaId(dados[0]?.id || "");
        } else if (resposta.status === 401 || resposta.status === 403) {
          router.push("/");
        } else {
          setErro("Não foi possível carregar o histórico da turma.");
        }
      } catch (error) {
        console.error("Erro ao carregar histórico", error);
        setErro("Falha de ligação ao servidor.");
      } finally {
        setCarregando(false);
      }
    };

    buscarHistorico();
  }, [turmaId, router]);

  useEffect(() => {
    if (!aulaSelecionada) return;

    const frequencias = aulaSelecionada.frequencias || [];
    const presentes = frequencias.filter((f) => f.status === "PRESENTE").length;
    const ausentes = frequencias.filter((f) => f.status === "FALTA").length;
    const total = presentes + ausentes || 1;
    setPorcentagemPresentes(Math.round((presentes / total) * 100));
    setPorcentagemAusentes(Math.round((ausentes / total) * 100));
  }, [aulaSelecionada]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-degrade-zilla overflow-x-hidden pb-10 select-none">
      <Header />

      <div className="w-full max-w-6xl mx-auto px-4 mt-8">
        <main className="w-full bg-white rounded-[20px] flex flex-col items-center py-8 px-4 md:px-8 shadow-2xl relative">
          <h1
            className={`${daysOne.className} text-3xl text-black uppercase tracking-wider mb-6 text-center`}
          >
            HISTÓRICO DA AULA
          </h1>

          {erro && (
            <div className="w-full max-w-5xl mb-4 p-4 rounded-xl text-sm font-bold text-center border-2 bg-[#1a0f1f] text-[#FF8D28] border-[#FF8D28]">
              {erro}
            </div>
          )}

          {/* Container Roxo Escuro */}
          <div className="w-full max-w-5xl bg-gradient-to-br from-[#1E0144] to-[#2d0266] rounded-[20px] flex flex-col pt-6 px-4 md:px-8 pb-8 shadow-inner border border-[#1E0144]/50 gap-6">
            
            <div className="w-full bg-white/95 rounded-xl p-4 shadow-md shrink-0 border border-white/20">
              <label className="font-crimson text-[13px] font-bold text-gray-500 uppercase block mb-2 tracking-wider">
                Aulas registradas
              </label>
              <select
                value={aulaSelecionadaId}
                onChange={(e) => setAulaSelecionadaId(e.target.value)}
                className="w-full bg-transparent border border-gray-200 rounded-lg px-3 py-3 font-sans text-base text-black/80 cursor-pointer outline-none"
              >
                {aulas.length === 0 ? (
                  <option value="">{carregando ? "Carregando..." : "Nenhuma aula encontrada"}</option>
                ) : (
                  aulas.map((aula) => (
                    <option key={aula.id} value={aula.id}>
                      {new Date(aula.data).toLocaleDateString()} — {aula.hora_inicio} às {aula.hora_fim}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Painel Inferior (3 Colunas) */}
            <div className="w-full flex flex-col lg:flex-row gap-5">
              
              {/* Coluna 1: Resumo da Turma */}
              <div className="w-full lg:w-[220px] bg-white/95 p-6 flex flex-col gap-4 font-crimson text-black shadow-md shrink-0 rounded-xl border border-gray-100">
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Turma</span>
                  <span className="text-lg font-bold text-gray-800">{aulaSelecionada?.turma?.nome || "--"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Código</span>
                  <span className="text-sm font-mono text-gray-600 border border-gray-200 px-2 py-0.5 bg-gray-50 rounded">{aulaSelecionada?.turma?.codigo || "--"}</span>
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Horário</span>
                  <span className="text-base font-semibold text-gray-600">{aulaSelecionada ? `${aulaSelecionada.hora_inicio} - ${aulaSelecionada.hora_fim}` : "--"}</span>
                </div>
                <div className="mt-auto">
                  <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Total de Alunos</span>
                  <span className="text-2xl font-bold text-[#1E0144]">{aulaSelecionada?.frequencias?.length || 0}</span>
                </div>
              </div>

              {/* Coluna 2: Anotações da Aula */}
              <div className="flex-1 bg-white/95 shadow-md p-5 flex flex-col rounded-xl border border-gray-100 min-h-[200px]">
                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                  Resumo da Aula
                </span>
                <textarea
                  value={aulaSelecionada?.descricao || ""}
                  readOnly
                  placeholder="Sem observações registradas."
                  className="w-full flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 font-sans text-sm text-gray-700 outline-none resize-none focus:border-[#FF8D28] focus:bg-white transition-all custom-scrollbar"
                />
              </div>

              {/* Coluna 3: Gráfico de Frequência Moderno */}
              <div className="w-full lg:w-[280px] bg-white/95 shadow-md p-5 flex flex-col rounded-xl border border-gray-100 items-center justify-between min-h-[200px]">
                <span className="block w-full text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pb-2 border-b border-gray-100 text-center">
                  Índice de Frequência
                </span>
                
                <div className="flex-1 w-full flex items-end justify-center gap-8 mt-4 pb-2">
                  {/* Barra Presentes */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="font-sans text-sm font-bold text-[#14AE5C]">{porcentagemPresentes}%</span>
                    <div className="w-16 h-32 bg-gray-100 rounded-t-xl flex flex-col justify-end overflow-hidden relative shadow-inner">
                      <div
                        className="w-full bg-gradient-to-t from-[#0d733d] to-[#14AE5C] transition-all duration-1000 rounded-t-xl"
                        style={{ height: `${porcentagemPresentes}%` }}
                      ></div>
                    </div>
                    <span className="font-crimson text-xs font-bold text-gray-500 uppercase">Presentes</span>
                  </div>

                  {/* Barra Ausentes */}
                  <div className="flex flex-col items-center gap-2 h-full justify-end">
                    <span className="font-sans text-sm font-bold text-[#900B09]">{porcentagemAusentes}%</span>
                    <div className="w-16 h-32 bg-gray-100 rounded-t-xl flex flex-col justify-end overflow-hidden relative shadow-inner">
                      <div
                        className="w-full bg-gradient-to-t from-[#590403] to-[#900B09] transition-all duration-1000 rounded-t-xl"
                        style={{ height: `${porcentagemAusentes}%` }}
                      ></div>
                    </div>
                    <span className="font-crimson text-xs font-bold text-gray-500 uppercase">Ausentes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão de Salvar */}
            <div className="w-full flex justify-end mt-2">
              <button
                onClick={handleSalvar}
                className="w-full md:w-[220px] h-[48px] bg-[#FF8D28] font-crimson font-bold text-lg text-white tracking-wider hover:bg-[#e0771f] active:scale-95 transition-all shadow-lg cursor-pointer flex items-center justify-center rounded-xl border-b-4 border-[#c46516]"
              >
                VOLTAR AO CONTROLE
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}