import React from "react";

export default function AlertMessage({ mensagem, erro, theme = "light" }: { mensagem: string; erro: boolean; theme?: "light" | "dark" }) {
  if (!mensagem) return null;

  const isDark = theme === "dark";

  const errorClass = isDark 
    ? "bg-[#1a0f1f] text-[#FF8D28] border-[#FF8D28]" 
    : "bg-white text-red-600 border-red-600";
    
  const successClass = isDark
    ? "bg-[#1a0f1f] text-green-400 border-green-500"
    : "bg-green-100 text-green-700 border-green-500";

  return (
    <div className={`w-full mb-6 p-4 rounded-xl text-sm font-bold text-center border-2 ${erro ? errorClass : successClass}`}>
      {mensagem}
    </div>
  );
}
