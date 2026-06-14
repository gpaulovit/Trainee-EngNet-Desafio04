import React from "react";

export default function Spinner({ className = "w-6 h-6 text-primary-600 dark:text-primary-400" }: { className?: string }) {
  return (
    <div 
      className={`animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`} 
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Carregando...
      </span>
    </div>
  );
}
