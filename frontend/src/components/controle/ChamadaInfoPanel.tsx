import React from "react";
import { Turma } from "../../hooks/useTurmas";

interface ChamadaInfoPanelProps {
  turmaSelecionada: Turma | null;
  horarioInput: string;
  horarioFimInput: string;
  quantidadeAlunos: number;
}

export default function ChamadaInfoPanel({
  turmaSelecionada,
  horarioInput,
  horarioFimInput,
  quantidadeAlunos,
}: ChamadaInfoPanelProps) {
  return (
    <div className="w-full lg:w-64 bg-gray-50 dark:bg-slate-900/50 p-6 flex flex-col gap-4 font-sans border border-gray-200 dark:border-slate-700 rounded-xl shrink-0 h-fit">
      <div>
        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Turma</span>
        <span className="text-base font-bold text-gray-900 dark:text-white">
          {turmaSelecionada ? turmaSelecionada.nome : "--"}
        </span>
      </div>
      <div>
        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Código</span>
        <span className="inline-block text-sm font-mono text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">
          {turmaSelecionada ? turmaSelecionada.codigo : "--"}
        </span>
      </div>
      <div>
        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Horário</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {horarioInput && horarioFimInput ? `${horarioInput} - ${horarioFimInput}` : "--"}
        </span>
      </div>
      <div>
        <span className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Alunos (Qtd)</span>
        <span className="text-xl font-bold text-primary-600 dark:text-primary-400">{quantidadeAlunos}</span>
      </div>
    </div>
  );
}
