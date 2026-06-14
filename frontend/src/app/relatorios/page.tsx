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

interface TurmaResumo {
  id: string;
  nome: string;
  codigo: string;
}

interface AlunoResumo {
  id: string;
  nome: string;
  matricula: string;
}

interface AlunoFaltoso {
  id: string;
  nome: string;
  matricula?: string;
  taxaPresenca: number;
  presencas: number;
  faltas: number;
}

export default function Relatorios() {
  const router = useRouter();

  const [turmas, setTurmas] = useState<TurmaResumo[]>([]);
  const [alunos, setAlunos] = useState<AlunoResumo[]>([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [alunoSelecionado, setAlunoSelecionado] = useState("");
  const [resumoTurma, setResumoTurma] = useState<any>(null);
  const [resumoAluno, setResumoAluno] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        const resposta = await fetch("/api/turmas", { credentials: "include" });
        if (!resposta.ok) return;

        const dados = await resposta.json();
        setTurmas(dados);
        if (dados.length > 0) {
          setTurmaSelecionada(dados[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar turmas", error);
      }
    };

    carregarTurmas();
  }, []);

  useEffect(() => {
    const carregarAlunos = async () => {
      if (!turmaSelecionada) {
        setAlunos([]);
        setAlunoSelecionado("");
        return;
      }

      try {
        const resposta = await fetch(`/api/alunos/turma/${turmaSelecionada}`, {
          credentials: "include",
        });

        if (!resposta.ok) {
          setAlunos([]);
          setAlunoSelecionado("");
          return;
        }

        const dados = await resposta.json();
        setAlunos(dados);
        setAlunoSelecionado((atual) => atual || dados[0]?.id || "");
      } catch (error) {
        console.error("Erro ao carregar alunos", error);
        setAlunos([]);
        setAlunoSelecionado("");
      }
    };

    carregarAlunos();
  }, [turmaSelecionada]);

  useEffect(() => {
    const carregarRelatorios = async () => {
      if (!turmaSelecionada) return;

      setCarregando(true);
      setErro("");

      try {
        const [respostaTurma, respostaAluno] = await Promise.all([
          fetch(`/api/relatorios/turma/${turmaSelecionada}`, { credentials: "include" }),
          alunoSelecionado
            ? fetch(`/api/relatorios/aluno/${alunoSelecionado}`, { credentials: "include" })
            : Promise.resolve(null),
        ]);

        if (!respostaTurma?.ok) {
          setErro("Não foi possível carregar o relatório da turma.");
        } else {
          setResumoTurma(await respostaTurma.json());
        }

        if (respostaAluno && !respostaAluno.ok) {
          setErro((mensagemAtual) => mensagemAtual || "Não foi possível carregar o relatório do aluno.");
        } else if (respostaAluno) {
          setResumoAluno(await respostaAluno.json());
        }
      } catch (error) {
        console.error("Erro ao carregar relatórios", error);
        setErro("Falha de ligação ao servidor.");
      } finally {
        setCarregando(false);
      }
    };

    carregarRelatorios();
  }, [turmaSelecionada, alunoSelecionado]);

  const faltosos = useMemo<AlunoFaltoso[]>(() => resumoTurma?.alunosFaltosos ?? [], [resumoTurma]);
  const historicoTurma = useMemo(() => resumoTurma?.historicoTurma ?? [], [resumoTurma]);
  const historicoAluno = useMemo(() => resumoAluno?.historico ?? [], [resumoAluno]);
  const taxaTurma = resumoTurma?.taxaAssiduidade ?? "0%";
  const taxaAluno = resumoAluno?.taxaAssiduidade ?? "0%";
  const presencaTurma = Number.parseFloat(String(taxaTurma).replace("%", "")) || 0;
  const presencaAluno = Number.parseFloat(String(taxaAluno).replace("%", "")) || 0;

  const handleExportar = async () => {
    if (!resumoTurma) {
      setErro("Carregue uma turma antes de exportar o relatório.");
      return;
    }

    const [{ default: jsPDF }, autoTableModule] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);

    const autoTable = (autoTableModule as any).default ?? (autoTableModule as any).autoTable;
    const doc = new jsPDF();
    const turma = resumoTurma?.turma;
    const aluno = resumoAluno?.aluno;
    const dataGeracao = new Date().toLocaleString("pt-BR");

    doc.setFillColor(30, 1, 68);
    doc.rect(0, 0, 210, 24, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Relatório Gerencial de Frequência", 14, 14);
    doc.setFontSize(10);
    doc.text(`Gerado em ${dataGeracao}`, 14, 20);

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(13);
    doc.text(`Turma: ${turma?.codigo ?? "--"} - ${turma?.nome ?? "--"}`, 14, 34);

    autoTable(doc, {
      startY: 40,
      head: [["Indicador", "Valor"]],
      body: [
        ["Total de alunos", String(turma?.totalAlunos ?? 0)],
        ["Total de aulas", String(resumoTurma?.totalAulas ?? 0)],
        ["Presenças", String(resumoTurma?.totalPresencas ?? 0)],
        ["Faltas", String(resumoTurma?.totalFaltas ?? 0)],
        ["Taxa de assiduidade", resumoTurma?.taxaAssiduidade ?? "0%"],
        ["Média de presença do dashboard", `${resumoTurma?.taxaAssiduidade ?? "0%"}`],
      ],
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [30, 1, 68] },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 8,
      head: [["Aluno", "Matrícula", "Presenças", "Faltas", "Taxa"]],
      body: (resumoTurma?.alunosFaltosos ?? []).map((item: AlunoFaltoso) => [
        item.nome,
        item.matricula ?? "--",
        String(item.presencas),
        String(item.faltas),
        `${item.taxaPresenca}%`,
      ]),
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [208, 107, 14] },
      alternateRowStyles: { fillColor: [255, 247, 240] },
    });

    if (aluno) {
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 8,
        head: [["Aluno", "Turma", "Presenças", "Faltas", "Taxa"]],
        body: [[
          aluno.nome,
          aluno.turma?.codigo ?? "--",
          String(resumoAluno?.totalPresencas ?? 0),
          String(resumoAluno?.totalFaltas ?? 0),
          resumoAluno?.taxaAssiduidade ?? "0%",
        ]],
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [20, 174, 92] },
      });
    }

    const historicoRows = (resumoTurma?.historicoTurma ?? []).map((aula: any) => [
      new Date(aula.data).toLocaleDateString("pt-BR"),
      `${aula.hora_inicio} - ${aula.hora_fim}`,
      String(aula.presentes),
      String(aula.faltas),
      aula.faltosos?.length ? aula.faltosos.join(", ") : "Sem faltas",
    ]);

    if (historicoRows.length > 0) {
      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 8,
        head: [["Data", "Horário", "Presentes", "Faltas", "Faltosos"]],
        body: historicoRows,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [79, 4, 116] },
      });
    }

    doc.save(`relatorio-${turma?.codigo ?? "turma"}.pdf`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-degrade-zilla overflow-x-hidden pb-10 select-none">
      <Header />

      <div className="w-full max-w-6xl mx-auto px-4 mt-8">
        <main className="w-full bg-white rounded-[20px] flex flex-col items-center py-8 px-4 md:px-8 shadow-2xl relative">
          <h1
            className={`${daysOne.className} text-3xl text-black uppercase tracking-wider mb-6 text-center`}
          >
            RELATÓRIOS GERENCIAIS
          </h1>

          {erro && (
            <div className="w-full max-w-5xl mb-4 p-4 rounded-xl text-sm font-bold text-center border-2 bg-[#1a0f1f] text-[#FF8D28] border-[#FF8D28]">
              {erro}
            </div>
          )}

          {/* Container Principal Laranja (Responsivo) */}
          <div className="w-full max-w-5xl bg-gradient-to-br from-[#D06B0E] to-[#a85509] rounded-[20px] flex flex-col lg:flex-row pt-6 px-4 md:px-8 pb-8 shadow-inner border border-[#D06B0E]/50 gap-8">
            
            {/* ================= COLUNA DA ESQUERDA: VISÃO DA TURMA ================= */}
            <div className="flex-1 flex flex-col gap-4">
              
              {/* Buscar Turma */}
              <div className="w-full h-[48px] bg-white/95 rounded-xl flex items-center px-4 shadow-md focus-within:ring-2 focus-within:ring-white transition-all">
                <select
                  value={turmaSelecionada}
                  onChange={(e) => setTurmaSelecionada(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none font-sans font-semibold text-sm text-gray-700 cursor-pointer appearance-none"
                >
                  <option value="" disabled hidden>Selecione uma Turma...</option>
                  {turmas.map((turma) => (
                    <option key={turma.id} value={turma.id}>
                      {turma.codigo} - {turma.nome}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gráfico de Barras - Turma */}
              <div className="w-full bg-white/95 rounded-xl shadow-md p-4 flex flex-col mb-2 border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase font-sans tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Presença Média Mensal da Turma
                </span>
                <div className="w-full h-[120px] flex items-end justify-between px-2 relative">
                  {/* Linhas guias do gráfico */}
                  <div className="absolute inset-x-0 bottom-[25%] border-t border-dashed border-gray-200 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-[50%] border-t border-dashed border-gray-200 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-[75%] border-t border-dashed border-gray-200 pointer-events-none" />
                  
                  {(historicoTurma.length > 0 ? historicoTurma.slice(0, 6).reverse() : []).map((aula: any) => (
                    <div key={aula.id} className="flex flex-col items-center gap-2 z-10 w-[14%] group cursor-pointer">
                      <span className="text-[10px] font-bold text-[#1E0144] opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-5">
                        {aula.presentes}/{aula.presentes + aula.faltas}
                      </span>
                      <div className="w-full max-w-[20px] h-full bg-gray-100 rounded-t-md flex items-end overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-[#1E0144] to-[#4F0474] rounded-t-md transition-all duration-1000"
                          style={{ height: `${aula.presentes + aula.faltas > 0 ? Math.round((aula.presentes / (aula.presentes + aula.faltas)) * 100) : 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {new Date(aula.data).toLocaleDateString("pt-BR", { month: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lista dos Mais Faltosos */}
              <div className="w-full flex-1 min-h-[160px] bg-white/95 rounded-xl shadow-md p-4 flex flex-col border border-gray-100">
                <span className="text-xs font-bold text-red-600 uppercase font-sans tracking-wider mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Alunos Mais Faltosos
                </span>
                
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[120px] custom-scrollbar pr-1">
                  {carregando ? (
                    <div className="text-sm text-gray-500">Carregando...</div>
                  ) : faltosos.length === 0 ? (
                    <div className="text-sm text-gray-500">Nenhum aluno com risco de frequência baixa.</div>
                  ) : (
                    faltosos.map((aluno) => (
                    <div key={aluno.id} className="flex justify-between items-center text-sm bg-red-50 p-2 rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                      <span className="font-semibold text-gray-800 font-sans truncate">{aluno.nome}</span>
                      <span className="text-[11px] bg-[#900B09] text-white px-2 py-1 rounded-md font-bold tracking-wider">
                        {100 - aluno.taxaPresenca}% faltas
                      </span>
                    </div>
                  ))
                  )}
                </div>
              </div>
            </div>

            {/* Linha divisória em telas grandes */}
            <div className="hidden lg:block w-[1px] bg-white/20 my-2"></div>

            {/* ================= COLUNA DA DIREITA: VISÃO DO ALUNO ================= */}
            <div className="flex-1 flex flex-col gap-4">
              
              {/* Buscar Aluno */}
              <div className="w-full h-[48px] bg-white/95 rounded-xl flex items-center px-4 shadow-md focus-within:ring-2 focus-within:ring-white transition-all">
                <select
                  value={alunoSelecionado}
                  onChange={(e) => setAlunoSelecionado(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none font-sans font-semibold text-sm text-gray-700 cursor-pointer appearance-none"
                >
                  <option value="" disabled hidden>Selecione um Aluno específico...</option>
                  {alunos.map((aluno) => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome} - {aluno.matricula}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gráfico de Barras - Aluno */}
              <div className="w-full bg-white/95 rounded-xl shadow-md p-4 flex flex-col mb-2 border border-gray-100">
                <span className="text-xs font-bold text-gray-400 uppercase font-sans tracking-wider mb-4 border-b border-gray-100 pb-2">
                  Presença Mensal do Aluno
                </span>
                <div className="w-full h-[120px] flex items-end justify-between px-2 relative">
                  <div className="absolute inset-x-0 bottom-[25%] border-t border-dashed border-gray-200 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-[50%] border-t border-dashed border-gray-200 pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-[75%] border-t border-dashed border-gray-200 pointer-events-none" />
                  
                  {(historicoAluno.length > 0 ? historicoAluno.slice(0, 6).reverse() : []).map((item: any) => (
                    <div key={item.aulaId} className="flex flex-col items-center gap-2 z-10 w-[14%] group cursor-pointer">
                      <span className="text-[10px] font-bold text-[#14AE5C] opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-5">
                        {item.status === "presente" ? "P" : "F"}
                      </span>
                      <div className="w-full max-w-[20px] h-full bg-gray-100 rounded-t-md flex items-end overflow-hidden">
                        <div
                          className="w-full bg-gradient-to-t from-[#0d733d] to-[#14AE5C] rounded-t-md transition-all duration-1000"
                          style={{ height: `${item.status === "presente" ? 100 : 25}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        {new Date(item.data).toLocaleDateString("pt-BR", { month: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumo do Aluno (Donut Chart) */}
              <div className="w-full bg-white/95 rounded-xl shadow-md p-5 flex flex-col sm:flex-row items-center font-sans mb-1 border border-gray-100 gap-6">
                <div className="flex flex-col flex-1 w-full text-center sm:text-left">
                  <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Histórico Individual
                  </span>
                  <span className="text-lg font-bold text-gray-800 uppercase tracking-wide mb-3">
                    {resumoAluno?.aluno?.nome ?? "Selecione um aluno"}
                  </span>
                  
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 flex flex-col gap-2 text-sm font-semibold text-gray-600">
                    <div className="flex justify-between items-center">
                      <span>Total de Aulas:</span>
                      <span className="text-[#1E0144]">{historicoAluno.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Média de Presença:</span>
                      <span className="text-[#14AE5C]">{taxaAluno}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Turma:</span>
                      <span className="text-[#4F0474]">{resumoAluno?.aluno?.turma?.codigo ?? "--"}</span>
                    </div>
                  </div>
                </div>

                {/* GRÁFICO DE PIZZA (DONUT) CSS MELHORADO */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div
                    className="w-[90px] h-[90px] rounded-full shadow-md relative flex items-center justify-center"
                    style={{
                      background: `conic-gradient(#14AE5C 0% ${presencaAluno}%, #900B09 ${presencaAluno}% 100%)`,
                    }}
                  >
                    {/* Centro branco do donut */}
                    <div className="w-[60px] h-[60px] bg-white rounded-full flex flex-col items-center justify-center text-gray-800 shadow-inner">
                      <span className="text-lg font-bold leading-none">{presencaAluno}%</span>
                    </div>
                  </div>

                  {/* Legenda do Gráfico de Pizza */}
                  <div className="flex gap-3 mt-3 text-[10px] font-sans font-bold uppercase tracking-tight">
                    <span className="flex items-center gap-1 text-[#14AE5C]"><span className="w-2 h-2 rounded-full bg-[#14AE5C]"></span> Pres</span>
                    <span className="flex items-center gap-1 text-[#900B09]"><span className="w-2 h-2 rounded-full bg-[#900B09]"></span> Falt</span>
                  </div>
                </div>
              </div>

              {/* Botão de Exportação */}
              <button
                onClick={handleExportar}
                className="w-full mt-auto h-[48px] bg-[#1E0144] rounded-xl font-sans font-bold text-sm text-white uppercase tracking-wider hover:bg-[#12002b] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 border-b-4 border-black"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                {carregando ? "Carregando relatório..." : "Exportar Relatório PDF"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}