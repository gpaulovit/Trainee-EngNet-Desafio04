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
    <div className="w-full md:w-[200px] bg-white/95 p-5 flex flex-col gap-3 font-crimson text-black shadow-md shrink-0 rounded-xl border border-[#FF8D28]/10">
      <div>
        <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Turma</span>
        <span className="text-base font-bold text-gray-800">
          {turmaSelecionada ? turmaSelecionada.nome.toUpperCase() : "--"}
        </span>
      </div>
      <div>
        <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Código</span>
        <span className="text-sm font-mono text-gray-600">
          {turmaSelecionada ? turmaSelecionada.codigo : "--"}
        </span>
      </div>
      <div>
        <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Horário</span>
        <span className="text-sm font-semibold text-gray-600">
          {horarioInput && horarioFimInput ? `${horarioInput} - ${horarioFimInput}` : "--"}
        </span>
      </div>
      <div>
        <span className="block text-xs font-bold text-gray-400 uppercase leading-none mb-1">Alunos (Qtd)</span>
        <span className="text-lg font-bold text-[#1E0144]">{quantidadeAlunos}</span>
      </div>
    </div>
  );
}
