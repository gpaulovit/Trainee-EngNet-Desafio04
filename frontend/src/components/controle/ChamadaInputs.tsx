import React from "react";

interface ChamadaInputsProps {
  dataInput: string;
  setDataInput: (val: string) => void;
  horarioInput: string;
  setHorarioInput: (val: string) => void;
  horarioFimInput: string;
  setHorarioFimInput: (val: string) => void;
  turmaSelecionadaId: string | undefined;
  onHistorico: () => void; // Unused, we moved the button to the header, but kept for compatibility
}

export default function ChamadaInputs({
  dataInput,
  setDataInput,
  horarioInput,
  setHorarioInput,
  horarioFimInput,
  setHorarioFimInput,
}: ChamadaInputsProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0 bg-gray-50 dark:bg-slate-900/50 p-4 border border-gray-200 dark:border-slate-700 rounded-xl">
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Data</label>
        <input
          type="date"
          value={dataInput}
          onChange={(e) => setDataInput(e.target.value)}
          className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Início</label>
        <input
          type="time"
          value={horarioInput}
          onChange={(e) => setHorarioInput(e.target.value)}
          className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Término</label>
        <input
          type="time"
          value={horarioFimInput}
          onChange={(e) => setHorarioFimInput(e.target.value)}
          className="w-full h-10 px-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm"
        />
      </div>
    </div>
  );
}
