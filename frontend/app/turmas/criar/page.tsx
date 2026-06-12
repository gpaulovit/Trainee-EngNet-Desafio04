"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Days_One } from "next/font/google";
import Header from "../../../components/Header";

const daysOne = Days_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function CriarEditarTurma() {
  const router = useRouter();

  // saber se estamos a editar ou a criar
  const [idEditando, setIdEditando] = useState<string | null>(null);

  const [nomeTurma, setNomeTurma] = useState("");
  const [codigoTurma, setCodigoTurma] = useState("");
  const [cursoTurma, setCursoTurma] = useState("");
  const [capacidadeTurma, setCapacidadeTurma] = useState("30");
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("18:00");
  
  const [mensagem, setMensagem] = useState<{ texto: string | string[]; erro: boolean }>({ 
    texto: "", 
    erro: false 
  });

  // Se entrar na página vindo do botão "Editar", preenche os campos
  useEffect(() => {
    const timer = setTimeout(() => {
      const turmaSalva = sessionStorage.getItem("turmaEdicao");
      if (turmaSalva) {
        const turma = JSON.parse(turmaSalva);
        setIdEditando(turma.id);
        setNomeTurma(turma.nome);
        setCodigoTurma(turma.codigo);
        setCursoTurma(turma.curso || "");
        setCapacidadeTurma(String(turma.capacidade || 30));
        
        if (turma.horario) {
          const partes = turma.horario.split(" - ");
          setHoraInicio(partes[0] || "08:00");
          setHoraFim(partes[1] || "10:00");
        }
        
        sessionStorage.removeItem("turmaEdicao");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);
 

  const handleCriarTurma = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem({ texto: "A processar...", erro: false });

    try {
      // Define URL e Método consoante seja Criação (POST) ou Edição (PATCH)
      const urlAcesso = idEditando 
        ? `/api/turmas/${idEditando}` 
        : "/api/turmas";
      const metodoHttp = idEditando ? "PATCH" : "POST";

      const resposta = await fetch(urlAcesso, {
        method: metodoHttp,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeTurma,
          codigo: codigoTurma,
          curso: cursoTurma,
          capacidade: Number(capacidadeTurma), 
          horario: `${horaInicio} - ${horaFim}`, 
        }),
        credentials: "include",
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem({ 
          texto: idEditando ? "Turma atualizada com sucesso!" : "Turma criada com sucesso!", 
          erro: false 
        });
        // Espera um pouco para o utilizador ler a mensagem de sucesso e redireciona
        setTimeout(() => router.push("/turmas"), 800);
      } else {
        setMensagem({ 
          texto: dados.message || "Erro ao processar turma", 
          erro: true 
        });
      }
    } catch (error) {
      setMensagem({ texto: "Falha de ligação ao servidor.", erro: true });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-degrade-zilla overflow-x-hidden pb-10 select-none">
      <Header />

      <div className="w-full max-w-6xl mx-auto px-4 mt-8">
        <main className="w-full bg-white rounded-[20px] flex flex-col pt-8 px-4 md:px-8 pb-20 shadow-2xl relative">
          
          <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-8 mb-6">
            
            {/* FORMULÁRIO DE TURMA (Laranja) */}
            <form onSubmit={handleCriarTurma} className="flex-1 w-full max-w-[450px] mx-auto bg-gradient-to-br from-[#B53C00] to-[#8a2c00] rounded-[20px] flex flex-col items-center py-8 px-6 shadow-xl border border-[#FF8D28]/30">
              
              <h2 className={`${daysOne.className} text-xl text-white uppercase text-center tracking-widest mb-6`}>
                Criar / Editar Turmas
              </h2>

              {/* CAIXA DE ERRO */}
              {mensagem.texto && (
                <div className={`w-full mb-6 p-4 rounded-xl text-sm font-bold text-center border-2 ${mensagem.erro ? "bg-white text-red-600 border-red-600" : "bg-green-100 text-green-700 border-green-500"}`}>
                  {Array.isArray(mensagem.texto) 
                    ? mensagem.texto.map((t, i) => <p key={i} className="mb-1">{t}</p>) 
                    : mensagem.texto}
                </div>
              )}

              <div className="flex flex-col gap-4 w-full">
                {/* Nome */}
                <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Nome da Turma</label>
                  <input type="text" value={nomeTurma} onChange={(e)=>setNomeTurma(e.target.value)} className="bg-transparent border-none outline-none text-sm text-black w-full" placeholder="Ex: Engenharia" />
                </div>

                {/* Curso */}
                <div className="w-full h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Curso de Destino</label>
                  <input type="text" value={cursoTurma} onChange={(e)=>setCursoTurma(e.target.value)} className="bg-transparent border-none outline-none text-sm text-black w-full" placeholder="Ex: Tecnologia" />
                </div>

                <div className="flex w-full gap-4">
                  {/* Código */}
                  <div className="flex-1 h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
                    <label className="font-crimson text-[10px] font-bold text-gray-500 uppercase leading-none mb-1">
                      Código da Turma
                    </label>
                    <input 
                      type="text" 
                      value={codigoTurma} 
                      onChange={(e) => setCodigoTurma(e.target.value)} 
                      className="bg-transparent border-none outline-none font-sans text-sm text-black font-mono uppercase placeholder-gray-400 w-full" 
                      placeholder="Ex: ES-2026" 
                    />
                  </div>

                  {/* Vagas */}
                  <div className="w-[110px] shrink-0 h-[60px] bg-white rounded-xl flex flex-col justify-center px-4 shadow-md focus-within:ring-2 focus-within:ring-[#FF8D28] transition-all">
                    <label className="font-crimson text-[10px] font-bold text-gray-500 uppercase leading-none mb-1">
                      Vagas
                    </label>
                    <input 
                      type="number" 
                      min="1" 
                      value={capacidadeTurma} 
                      onChange={(e) => setCapacidadeTurma(e.target.value)} 
                      className="bg-transparent border-none outline-none font-sans text-sm text-black placeholder-gray-400 w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none text-center" 
                    />
                  </div>
                </div>

                {/* Horário Formatado (Início - Fim) */}
                <div className="w-full p-3 bg-white rounded-xl shadow-md">
                   <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Horários de Aula</label>
                   <div className="flex items-center justify-between gap-2">
                      <input type="time" value={horaInicio} onChange={(e)=>setHoraInicio(e.target.value)} className="bg-gray-50 p-1 rounded border text-sm flex-1 outline-none focus:border-[#FF8D28]" />
                      <span className="text-gray-400 text-xs font-bold uppercase">até</span>
                      <input type="time" value={horaFim} onChange={(e)=>setHoraFim(e.target.value)} className="bg-gray-50 p-1 rounded border text-sm flex-1 outline-none focus:border-[#FF8D28]" />
                   </div>
                </div>
              </div>

              <div className="w-full flex justify-between gap-4 mt-8">
                {/* O botão muda de nome dinamicamente */}
                <button type="submit" className="flex-1 h-[45px] bg-[#14AE5C] rounded-xl font-bold text-white uppercase hover:bg-[#0f8c4a] transition-all shadow-lg active:scale-95">
                  {idEditando ? "Atualizar" : "Criar"}
                </button>
                <button type="button" onClick={() => router.push("/turmas")} className="flex-1 h-[45px] bg-[#900B09] rounded-xl font-bold text-white uppercase hover:bg-[#700605] transition-all shadow-lg active:scale-95">
                  Cancelar
                </button>
              </div>
            </form>

            <div className="flex-1 w-full max-w-[450px] mx-auto bg-gradient-to-br from-[#4F0474] via-[#2c0242] to-[#B53C00] rounded-[20px] flex flex-col items-center justify-center py-8 px-6 shadow-xl border border-[#FF8D28]/30">
              <h2 className={`${daysOne.className} text-xl text-white uppercase text-center tracking-widest mb-4`}>
                Alunos em Página Dedicada
              </h2>
              <p className="text-sm text-white/80 text-center mb-6">
                A gestão de alunos foi movida para a rota própria.
              </p>
              <button
                type="button"
                onClick={() => router.push("/alunos")}
                className="w-full h-[45px] bg-[#FF8D28] rounded-xl font-bold text-white uppercase hover:bg-[#e97714] transition-all shadow-lg active:scale-95 border border-white/20"
              >
                Ir para Alunos
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}