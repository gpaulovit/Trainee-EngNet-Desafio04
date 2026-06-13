"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Days_One } from "next/font/google";
import Header from "../../components/Header";
import Image from "next/image";

const daysOne = Days_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const router = useRouter();

  const [dados, setDados] = useState({
    totalAlunos: 0,
    totalAulas: 0,
    totalTurmas: 0,
    taxaMediaPresenca: 0,
    mensagem: "",
    alertasBaixaFrequencia: [] as Array<{ id: string; nome: string; taxaAssiduidade: number; turma?: { codigo: string } | null }>,
  });
  const [carregando, setCarregando] = useState(true);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      router.push("/");
      router.refresh();
    }
  };

  useEffect(() => {
    const buscarDadosDashboard = async () => {
      try {
        const resposta = await fetch("/api/dashboard", {
          method: "GET",
          credentials: "include", 
        });

        if (resposta.ok) {
          const dadosAPI = await resposta.json();
          setDados({
            totalAlunos: dadosAPI.totalAlunos ?? 0,
            totalAulas: dadosAPI.totalAulas ?? 0,
            totalTurmas: dadosAPI.totalTurmas ?? 0,
            taxaMediaPresenca: dadosAPI.taxaMediaPresenca ?? 0,
            mensagem: dadosAPI.mensagem ?? "Nenhum alerta.",
            alertasBaixaFrequencia: dadosAPI.alertasBaixaFrequencia ?? [],
          });
        } else if (resposta.status === 401 || resposta.status === 403) {
          router.push("/");
        }
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDadosDashboard();
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-degrade-zilla overflow-x-hidden pb-10 select-none">
      <Header />

      {/* Caixa central responsiva com sombra mais suave */}
      <div className="flex flex-col md:flex-row w-full max-w-[1058px] mx-auto items-stretch shadow-2xl backdrop-blur-md mt-8 rounded-[20px] overflow-hidden border border-white/20">
        
        {/* Barra Lateral Laranja com gradiente suave para profundidade */}
        <aside className="w-full md:w-[315px] bg-gradient-to-b from-[#FF8D28] to-[#e67a1f] flex flex-col items-center pt-10 pb-8 px-6 shrink-0 relative overflow-hidden">
          {/* Efeito de luz no fundo da barra lateral */}
          <div className="absolute top-0 left-0 w-full h-32 bg-white opacity-10 blur-2xl"></div>

          <div className="w-full flex flex-col items-center relative z-10">
            <div className="relative w-[160px] h-[160px] mb-8 pointer-events-none drop-shadow-xl hover:scale-105 transition-transform duration-500">
              <Image src="/logofundo.png" alt="Logo Início" fill sizes="160px" priority className="object-contain filter brightness-0 invert" />
            </div>

            <div className="w-full max-w-[224px] h-[64px] bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] mb-4 border border-white/50">
              <span className="font-crimson font-bold text-xl text-[#14AE5C] tracking-wide">
                Olá, Professor(a)
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full max-w-[224px] h-[64px] bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:bg-[#fff5f5] active:scale-95 transition-all duration-300 group border border-white/50 mt-2"
            >
              <span className="font-crimson font-bold text-xl text-[#900B09] group-hover:scale-110 transition-transform duration-300">
                SAIR
              </span>
            </button>
          </div>
        </aside>

        {/* Principal Branco */}
        <main className="w-full flex-1 bg-white flex flex-col py-10 px-6 md:px-12 gap-10">
          
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cartão 1 */}
            <div className="w-full h-[140px] bg-gradient-to-br from-[#4F0474] to-[#34024d] rounded-[20px] shadow-lg flex flex-col items-center justify-center hover:-translate-y-2 hover:shadow-[#4F0474]/40 transition-all duration-300 relative overflow-hidden group border border-[#4F0474]/20">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              <span className="font-crimson font-bold text-xs text-white/70 tracking-widest uppercase mb-1 z-10">
                Total de Alunos
              </span>
              <span className="font-crimson font-bold text-5xl text-white drop-shadow-md z-10">
                {carregando ? "..." : dados.totalAlunos}
              </span>
            </div>

            {/* Cartão 2 */}
            <div className="w-full h-[140px] bg-gradient-to-br from-[#4F0474] to-[#34024d] rounded-[20px] shadow-lg flex flex-col items-center justify-center hover:-translate-y-2 hover:shadow-[#4F0474]/40 transition-all duration-300 relative overflow-hidden group border border-[#4F0474]/20">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              <span className="font-crimson font-bold text-xs text-white/70 tracking-widest uppercase mb-1 z-10">
                Aulas Cadastradas
              </span>
              <span className="font-crimson font-bold text-5xl text-white drop-shadow-md z-10">
                {carregando ? "..." : dados.totalAulas}
              </span>
            </div>

            {/* Cartão 3 */}
            <div className="w-full h-[140px] bg-gradient-to-br from-[#4F0474] to-[#34024d] rounded-[20px] shadow-lg flex flex-col items-center justify-center hover:-translate-y-2 hover:shadow-[#4F0474]/40 transition-all duration-300 relative overflow-hidden group border border-[#4F0474]/20">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              <span className="font-crimson font-bold text-xs text-white/70 tracking-widest uppercase mb-1 z-10">
                Turmas Ativas
              </span>
              <span className="font-crimson font-bold text-5xl text-white drop-shadow-md z-10">
                {carregando ? "..." : dados.totalTurmas}
              </span>
            </div>

            {/* Cartão 4 */}
            <div className="w-full h-[140px] bg-gradient-to-br from-[#14AE5C] to-[#0d733d] rounded-[20px] shadow-lg flex flex-col items-center justify-center hover:-translate-y-2 hover:shadow-[#14AE5C]/40 transition-all duration-300 relative overflow-hidden group border border-[#14AE5C]/20">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-5 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
              <span className="font-crimson font-bold text-xs text-white/70 tracking-widest uppercase mb-1 z-10">
                Média de Presença
              </span>
              <span className="font-crimson font-bold text-5xl text-white drop-shadow-md z-10">
                {carregando ? "..." : `${dados.taxaMediaPresenca}%`}
              </span>
            </div>
          </div>

          {/* Painel Alertas Roxo com Design Premium */}
          <div className="w-full max-w-[651px] mx-auto min-h-[168px] bg-gradient-to-r from-[#74095A] to-[#52043f] rounded-[20px] shadow-2xl relative p-8 flex flex-col items-center justify-center overflow-hidden border border-[#FF8D28]/30">
            {/* Detalhe visual laranja lateral */}
            <div className="absolute left-0 top-0 w-2 h-full bg-[#FF8D28] shadow-[0_0_15px_#FF8D28]"></div>
            
            <div className="flex items-center gap-3 mb-4 z-10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF8D28] animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className={`${daysOne.className} text-2xl text-white tracking-widest uppercase drop-shadow-lg`}>
                Alertas
              </h3>
            </div>

            <div className="w-full text-center font-crimson text-white/95 text-xl bg-black/20 py-4 px-6 rounded-xl border border-white/10 z-10 backdrop-blur-sm">
              {carregando ? "A sincronizar alertas..." : dados.mensagem}
            </div>

            {!carregando && dados.alertasBaixaFrequencia.length > 0 && (
              <div className="w-full mt-5 grid gap-3">
                {dados.alertasBaixaFrequencia.slice(0, 3).map((alerta) => (
                  <div key={alerta.id} className="w-full bg-white/10 rounded-xl px-4 py-3 text-white border border-white/15">
                    {alerta.nome} {alerta.turma?.codigo ? `(${alerta.turma.codigo})` : ""} — {alerta.taxaAssiduidade}%
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}