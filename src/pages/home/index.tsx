import { useState, useEffect } from "react";
import { Container } from "../../components/container";
import { toast } from "react-hot-toast";
import logoImg from "../../assets/easysisLogo.png";

export function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setLoading(false);
      toast.success("Página carregada com sucesso!");
    }, 1000);
  }, []);

  return (
    <Container>
      <header className="flex items-center justify-center w-full max-w-xs mx-auto">
        <img src={logoImg} alt="Logo da Easysis" className="w-full" />
      </header>

      <main>
        <p className="text-xl text-gray-600 w-full mb-5 text-center">
          🎓 TCC - Easysis - Teste de Conexão
        </p>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            ✅ Aplicação funcionando!
          </h2>
          
          <p className="text-gray-600 mb-4">
            A página está carregando corretamente. Agora vamos testar a conexão com o MongoDB.
          </p>

          <div className="bg-blue-100 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">Status da Conexão:</h3>
            <p className="text-blue-700">
              {loading ? "🔄 Carregando..." : "✅ Página carregada"}
            </p>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => {
                toast.success("Teste de conexão iniciado!");
                console.log("🔍 Testando conexão MongoDB...");
              }}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Testar Conexão MongoDB
            </button>
          </div>
        </div>
      </main>
    </Container>
  );
}
