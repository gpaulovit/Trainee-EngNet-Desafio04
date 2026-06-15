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
    <div className="flex-1 bg-gradient-to-br from-[#4F0474] via-[#3a0259] to-[#1b1026] rounded-[20px] flex flex-col pt-6 px-4 md:px-8 pb-8 shadow-inner border border-[#FF8D28]/30">
      <div className="w-full h-[54px] bg-white/95 rounded-xl flex items-center px-4 shadow-md mb-6 shrink-0 relative focus-within:ring-2 focus-within:ring-[#FF8D28] border border-[#FF8D28]/20">
        <select
          value={turmaSelecionadaId}
          onChange={(e) => {
            setTurmaSelecionadaId(e.target.value);
            onLimparFormulario();
          }}
          className="w-full h-full bg-transparent border-none outline-none font-sans font-semibold text-sm text-gray-800 cursor-pointer appearance-none"
        >
          <option value="" disabled hidden>
            Selecione a turma para ver os alunos...
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

      <div className="flex-1 bg-white/95 min-h-[360px] overflow-y-auto shadow-md p-4 flex flex-col gap-2 rounded-xl custom-scrollbar border border-[#FF8D28]/20 relative">
        <h4 className="font-sans text-xs font-bold text-black/45 uppercase tracking-wider mb-2 pb-2 border-b border-[#FF8D28]/20">
          Alunos Matriculados
        </h4>
        
        {carregando ? (
          <div className="flex items-center justify-center h-full absolute inset-0 bg-white/80 z-10">
            <Spinner className="w-8 h-8 text-[#FF8D28]" />
          </div>
        ) : null}

        {turmaSelecionadaId ? (
          alunos.length > 0 ? (
            alunos.map((aluno, index) => (
              <div
                key={aluno.id}
                className="w-full flex items-center justify-between gap-4 font-crimson text-sm sm:text-base text-black py-2 px-3 bg-[#f7edf9] border border-[#FF8D28]/20 rounded-lg hover:bg-[#f9d9ea] transition-colors"
              >
                <span>
                  <span className="font-semibold text-[#4F0474] mr-2">{String(index + 1).padStart(2, "0")}. </span>
                  {aluno.nome}
                </span>
                <button
                  type="button"
                  onClick={() => onEditar(aluno.id)}
                  className="text-xs font-bold text-[#FF8D28] uppercase hover:underline"
                >
                  Editar
                </button>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full flex-1">
              <span className="font-sans text-sm italic text-black/35">Nenhum aluno cadastrado nesta turma.</span>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full flex-1">
            <span className="font-sans text-sm italic text-black/35">Selecione uma turma para ver os alunos.</span>
          </div>
        )}
      </div>
    </div>
  );
}
