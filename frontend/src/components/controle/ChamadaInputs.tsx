import React from "react";

interface ChamadaInputsProps {
  dataInput: string;
  setDataInput: (val: string) => void;
  horarioInput: string;
  setHorarioInput: (val: string) => void;
  horarioFimInput: string;
  setHorarioFimInput: (val: string) => void;
  turmaSelecionadaId: string | undefined;
  onHistorico: () => void;
}

export default function ChamadaInputs({
  dataInput,
  setDataInput,
  horarioInput,
  setHorarioInput,
  horarioFimInput,
  setHorarioFimInput,
  turmaSelecionadaId,
  onHistorico,
}: ChamadaInputsProps) {
  return (
    <div className="w-full flex flex-col md:flex-row justify-between gap-4 shrink-0">
      <div className="flex-1 h-[54px] bg-white/95 rounded-xl flex flex-col justify-center px-4 shadow-md border border-[#FF8D28]/10">
        <label className="font-crimson text-[11px] font-bold text-gray-500 uppercase leading-none mb-1">Data</label>
        <input
          type="date"
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          className="bg-transparent border-none outline-none font-sans text-sm text-black placeholder-gray-300 w-full"
        />
      </div>

      <div className="flex-1 h-[54px] bg-white/95 rounded-xl flex flex-col justify-center px-4 shadow-md border border-[#FF8D28]/10">
        <label className="font-crimson text-[11px] font-bold text-gray-500 uppercase leading-none mb-1">Início</label>
        <input
          type="time"
          value={horarioInput}
          onChange={(e) => setHorarioInput(e.target.value)}
          className="bg-transparent border-none outline-none font-sans text-sm text-black placeholder-gray-300 w-full"
        />
      </div>

      <div className="flex-1 h-[54px] bg-white/95 rounded-xl flex flex-col justify-center px-4 shadow-md border border-[#FF8D28]/10">
        <label className="font-crimson text-[11px] font-bold text-gray-500 uppercase leading-none mb-1">Término</label>
        <input
          type="time"
          value={horarioFimInput}
          onChange={(e) => setHorarioFimInput(e.target.value)}
          className="bg-transparent border-none outline-none font-sans text-sm text-black placeholder-gray-300 w-full"
        />
      </div>

      <button
        type="button"
        disabled={!turmaSelecionadaId}
        onClick={onHistorico}
        className="w-full md:w-[180px] h-[54px] bg-white/95 rounded-xl font-crimson font-bold text-base text-black uppercase tracking-wide hover:bg-gray-100 active:scale-95 transition-all shadow-md cursor-pointer flex items-center justify-center border-b-4 border-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        Histórico
      </button>
    </div>
  );
}
