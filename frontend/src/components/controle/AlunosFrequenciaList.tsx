import React from "react";

interface AlunoChamada {
  id: string;
  nome: string;
  status: "presente" | "ausente" | null;
}

interface AlunosFrequenciaListProps {
  termoBusca: string;
  setTermoBusca: (val: string) => void;
  observacoes: string;
  setObservacoes: (val: string) => void;
  alunosFiltrados: AlunoChamada[];
  turmaSelecionadaId?: string;
  handleStatusChange: (id: string, status: "presente" | "ausente") => void;
}

export default function AlunosFrequenciaList({
  termoBusca,
  setTermoBusca,
  observacoes,
  setObservacoes,
  alunosFiltrados,
  turmaSelecionadaId,
  handleStatusChange,
}: AlunosFrequenciaListProps) {
  return (
    <div className="flex-1 bg-white/95 shadow-md p-4 flex flex-col gap-3 rounded-xl border border-[#FF8D28]/10">
      <div className="relative w-full shrink-0">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Procurar aluno por nome..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          className="w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg font-sans text-sm outline-none focus:ring-2 focus:ring-[#FF8D28]/50 focus:border-[#FF8D28] transition-all"
        />
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
        {!turmaSelecionadaId ? (
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
              <div
                key={aluno.id}
                className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between font-crimson py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-lg shrink-0 gap-3 hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-800 uppercase text-sm sm:text-base flex-1">
                  {String(index + 1).padStart(2, "0")}. {aluno.nome}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(aluno.id, "presente")}
                    className={`w-20 py-2 rounded-lg transition-all duration-200 cursor-pointer font-sans text-[11px] font-bold uppercase tracking-wider ${
                      isPresente
                        ? "bg-[#FF8D28] text-white shadow-md scale-105 border border-[#FF8D28]"
                        : "bg-white text-[#FF8D28] border border-[#FF8D28] hover:bg-[#fff2e8]"
                    }`}
                  >
                    Presente
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(aluno.id, "ausente")}
                    className={`w-20 py-2 rounded-lg transition-all duration-200 cursor-pointer font-sans text-[11px] font-bold uppercase tracking-wider ${
                      isAusente
                        ? "bg-[#FF5CA8] text-white shadow-md scale-105 border border-[#FF5CA8]"
                        : "bg-white text-[#FF5CA8] border border-[#FF5CA8] hover:bg-[#ffeaf4]"
                    }`}
                  >
                    Ausente
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
