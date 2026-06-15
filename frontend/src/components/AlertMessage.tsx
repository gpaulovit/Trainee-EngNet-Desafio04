import React from "react";

export default function AlertMessage({ mensagem, erro, theme = "light" }: { mensagem: string; erro: boolean; theme?: "light" | "dark" }) {
  if (!mensagem) return null;

  const errorClass = "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
  const successClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";

  return (
    <div className={`w-full mb-6 p-4 rounded-xl text-sm font-medium text-center border ${erro ? errorClass : successClass}`}>
      {mensagem}
    </div>
  );
}
