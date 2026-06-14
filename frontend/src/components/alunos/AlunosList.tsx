import React from "react";
import { Turma } from "../../hooks/useTurmas";
import { Aluno } from "../../hooks/useAlunos";
import Spinner from "../Spinner";

interface AlunosListProps {
  turmas: Turma[];
  turmaSelecionadaId: string;
  setTurmaSelecionadaId: (id: string) => void;
  alunos: Aluno[];
  carregando: boolean;
  onEditar: (id: string) => void;
  onLimparFormulario: () => void;
}

export default function AlunosList({
  turmas,
  turmaSelecionadaId,
  setTurmaSelecionadaId,
  alunos,
  carregando,
  onEditar,
  onLimparFormulario,
}: AlunosListProps) {
  return (
    <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-2xl flex flex-col pt-6 px-6 pb-6 shadow-sm border border-gray-200 dark:border-slate-700 relative transition-colors duration-300 font-sans">
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
          Visualizar Alunos da Turma
        </label>
        <div className="relative">
          <select
            value={turmaSelecionadaId}
            onChange={(e) => {
              setTurmaSelecionadaId(e.target.value);
              onLimparFormulario();
            }}
            className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm appearance-none"
          >
            <option value="" disabled hidden>
              Selecione a turma...
            </option>
            {turmas.map((turma) => (
              <option key={turma.id} value={turma.id}>
                {turma.codigo} - {turma.nome}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 dark:bg-slate-900/50 min-h-[360px] overflow-y-auto rounded-xl custom-scrollbar border border-gray-200 dark:border-slate-700 relative p-4 flex flex-col">
        <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-200 dark:border-slate-700">
          Alunos Matriculados
        </h4>
        
        {carregando ? (
          <div className="flex items-center justify-center flex-1 absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10 rounded-xl">
            <Spinner className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          {turmaSelecionadaId ? (
            alunos.length > 0 ? (
              alunos.map((aluno, index) => (
                <div
                  key={aluno.id}
                  className="w-full flex items-center justify-between gap-4 text-sm sm:text-base py-3 px-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:shadow-sm hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
                >
                  <span className="text-gray-900 dark:text-white font-medium flex items-center">
                    <span className="text-gray-400 dark:text-gray-500 mr-3 text-sm w-5">{String(index + 1).padStart(2, "0")}.</span>
                    {aluno.nome}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEditar(aluno.id)}
                    className="text-xs font-medium text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:underline transition-all"
                  >
                    Editar
                  </button>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center flex-1 py-10">
                <span className="text-sm text-gray-500 dark:text-gray-400">Nenhum aluno cadastrado nesta turma.</span>
              </div>
            )
          ) : (
            <div className="flex items-center justify-center flex-1 py-10">
              <span className="text-sm text-gray-500 dark:text-gray-400">Selecione uma turma para visualizar a lista.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
