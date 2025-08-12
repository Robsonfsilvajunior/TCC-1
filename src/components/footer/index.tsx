import { Link } from "react-router-dom";
// Removido: import { FaLinkedinIn, FaGithub, FaEnvelope } from "react-icons/fa";
import logoImg from "../../assets/easysisLogo.png";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white up-shadow w-full mt-8 ">
      <footer className="max-w-7xl mx-auto py-4">
        <div className="flex flex-col items-center md:flex-row justify-between px-4">
          <div className="mb-4 md:mb-0">
            <Link to="/">
              <img src={logoImg} alt="Logo Easysis" className="w-32 h-auto" />
            </Link>
          </div>
          <div className="text-center text-zinc-700 w-full">
            {/* Removido o texto de direitos autorais */}
            <div className="mt-2 flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
              <Link
                to="/"
                className="text-gray-500 hover:text-mainRed transition-colors duration-200"
              >
                Catálogo
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-mainRed transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/new"
                className="text-gray-500 hover:text-mainRed transition-colors duration-200"
              >
                Cadastro de Veículos
              </Link>
              <button
                onClick={scrollToTop}
                className="text-gray-500 hover:text-mainRed transition-colors duration-200 focus:outline-none"
              >
                Voltar para o topo
              </button>
            </div>
          </div>
          {/* Removido os links de LinkedIn, GitHub e Gmail */}
        </div>
      </footer>
    </div>
  );
}
