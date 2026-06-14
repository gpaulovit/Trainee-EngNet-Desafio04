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
    <div className="flex-1 flex flex-col gap-4 font-sans min-h-0">
      
      {/* Busca */}
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
          className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
        />
      </div>

      {/* Observações */}
      <div className="w-full shrink-0">
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
          Observações da aula
        </label>
        <textarea
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Registre observações, conteúdo lecionado ou ocorrências da aula..."
          className="w-full min-h-[80px] bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg p-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none resize-y focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
      </div>

      {/* Lista de Alunos */}
      <div className="flex-1 min-h-[300px] max-h-[400px] overflow-y-auto flex flex-col gap-2 custom-scrollbar bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 p-2">
        {!turmaSelecionadaId ? (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
            Selecione uma turma para ver os alunos.
          </div>
        ) : alunosFiltrados.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-medium">
            Nenhum aluno cadastrado ou encontrado.
          </div>
        ) : (
          alunosFiltrados.map((aluno, index) => {
            const isPresente = aluno.status === "presente";
            const isAusente = aluno.status === "ausente";

            return (
              <div
                key={aluno.id}
                className={`w-full flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 px-4 bg-white dark:bg-slate-800 border rounded-lg shrink-0 gap-3 transition-colors ${
                  isPresente 
                    ? "border-primary-300 dark:border-primary-700 bg-primary-50/30 dark:bg-primary-900/10" 
                    : isAusente 
                      ? "border-red-300 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10" 
                      : "border-gray-200 dark:border-slate-700"
                }`}
              >
                <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base flex-1">
                  <span className="text-gray-400 dark:text-gray-500 mr-2 text-sm">{String(index + 1).padStart(2, "0")}.</span> 
                  {aluno.nome}
                </span>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(aluno.id, "presente")}
                    className={`flex-1 sm:flex-none w-24 py-2 rounded-md transition-all text-xs font-bold uppercase tracking-wider ${
                      isPresente
                        ? "bg-primary-600 text-white shadow-sm ring-2 ring-primary-600 ring-offset-1 dark:ring-offset-slate-800"
                        : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    Presente
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(aluno.id, "ausente")}
                    className={`flex-1 sm:flex-none w-24 py-2 rounded-md transition-all text-xs font-bold uppercase tracking-wider ${
                      isAusente
                        ? "bg-red-500 text-white shadow-sm ring-2 ring-red-500 ring-offset-1 dark:ring-offset-slate-800"
                        : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
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
