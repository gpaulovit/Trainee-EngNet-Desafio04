"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../../components/Header";
import { api } from "../../services/apiClient";

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
    // Passando o corpo vazio {} e a configuração vazia {} para satisfazer a assinatura de 2-3 argumentos
    await api.post("/api/auth/logout", {}, {});
  } catch (error) {
    console.error("Erro ao fazer logout:", error);
  } finally {
    router.push("/");
    router.refresh();
  }
};

  useEffect(() => {
    const buscarDadosDashboard = async () => {
      try {
        const dadosAPI = await api.get<any>("/api/dashboard");

        if (dadosAPI) {
          setDados({
            totalAlunos: dadosAPI.totalAlunos ?? 0,
            totalAulas: dadosAPI.totalAulas ?? 0,
            totalTurmas: dadosAPI.totalTurmas ?? 0,
            taxaMediaPresenca: dadosAPI.taxaMediaPresenca ?? 0,
            mensagem: dadosAPI.mensagem ?? "Nenhum alerta.",
            alertasBaixaFrequencia: dadosAPI.alertasBaixaFrequencia ?? [],
          });
        }
      } catch (error: any) {
        console.error("Erro ao buscar dados do dashboard:", error);
        
        // Trata erro de autenticação caso a resposta seja 401 ou 403
        if (error.response?.status === 401 || error.response?.status === 403) {
          router.push("/");
        }
      } finally {
        setCarregando(false);
      }
    };

    buscarDadosDashboard();
  }, [router]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300 pb-10">
      <Header />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Perfil Sidebar */}
        <aside className="w-full lg:w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 flex flex-col items-center shrink-0">
          <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-4 shadow-inner overflow-hidden p-2">
            <Image src="/logoinicio.png" alt="Logo Zilla" width={80} height={80} className="object-contain" priority />
          </div>
          <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white text-center">
            Professor(a)
          </h3>
          <p className="font-sans text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
            Bem-vindo ao portal acadêmico
          </p>

          <button
            onClick={handleLogout}
            className="w-full h-10 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg font-sans font-medium text-sm transition-colors border border-red-200 dark:border-red-800"
          >
            Sair do Sistema
          </button>
        </aside>

        {/* Principal */}
        <main className="w-full flex-1 flex flex-col gap-8">
          
          {/* Dashboard Cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Cartão 1 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col hover:shadow-md transition-shadow">
              <span className="font-sans text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total de Alunos</span>
              <span className="font-sans font-bold text-4xl text-gray-900 dark:text-white">
                {carregando ? "..." : dados.totalAlunos}
              </span>
            </div>

            {/* Cartão 2 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col hover:shadow-md transition-shadow">
              <span className="font-sans text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Aulas Cadastradas</span>
              <span className="font-sans font-bold text-4xl text-gray-900 dark:text-white">
                {carregando ? "..." : dados.totalAulas}
              </span>
            </div>

            {/* Cartão 3 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col hover:shadow-md transition-shadow">
              <span className="font-sans text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Turmas Ativas</span>
              <span className="font-sans font-bold text-4xl text-gray-900 dark:text-white">
                {carregando ? "..." : dados.totalTurmas}
              </span>
            </div>

            {/* Cartão 4 */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col hover:shadow-md transition-shadow">
              <span className="font-sans text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Média de Presença</span>
              <span className="font-sans font-bold text-4xl text-emerald-600 dark:text-emerald-400">
                {carregando ? "..." : `${dados.taxaMediaPresenca}%`}
              </span>
            </div>
          </div>

          {/* Painel Alertas */}
          <div className="w-full bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-amber-200 dark:border-amber-900/50 p-6 md:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-amber-500 text-2xl">⚠️</span>
              <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white">
                Alertas do Sistema
              </h3>
            </div>

            <div className="w-full bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 py-3 px-4 rounded-lg font-sans text-sm border border-amber-100 dark:border-amber-900/30 mb-4">
              {carregando ? "Sincronizando alertas..." : dados.mensagem}
            </div>

            {!carregando && dados.alertasBaixaFrequencia.length > 0 && (
              <div className="w-full grid gap-3">
                {dados.alertasBaixaFrequencia.slice(0, 3).map((alerta) => (
                  <div key={alerta.id} className="w-full bg-gray-50 dark:bg-slate-700/50 rounded-lg px-4 py-3 flex items-center justify-between border border-gray-100 dark:border-slate-600">
                    <span className="font-sans text-sm font-medium text-gray-900 dark:text-white">
                      {alerta.nome} <span className="text-gray-500 dark:text-gray-400 font-normal">{alerta.turma?.codigo ? `(${alerta.turma.codigo})` : ""}</span>
                    </span>
                    <span className="font-sans text-sm font-bold text-amber-600 dark:text-amber-400">
                      {alerta.taxaAssiduidade}% assiduidade
                    </span>
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