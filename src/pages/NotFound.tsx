import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Dumbbell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function NotFound() {
  const { user } = useAuth();

  const getHomeLink = () => {
    if (!user) return '/';
    
    const homeMap = {
      aluno: '/dashboard',
      instrutor: '/instrutor',
      admin: '/admin',
    };
    
    return homeMap[user.role];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6da67a] to-[#4a4857] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <Dumbbell className="w-10 h-10" />
            <span className="text-3xl font-bold">GymSchedule</span>
          </Link>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Ilustração 404 */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="text-[120px] md:text-[180px] font-bold text-[#6da67a]/10 leading-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-16 h-16 md:w-24 md:h-24 text-[#6da67a]/30" />
              </div>
            </div>
          </div>

          {/* Mensagem */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#4a4857] mb-4">
            Página não encontrada
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Ops! Parece que você se perdeu no caminho para o treino. 
            A página que você está procurando não existe ou foi movida.
          </p>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={getHomeLink()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#6da67a] text-white rounded-lg font-semibold hover:bg-[#77b885] transition-all transform hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Ir para {user ? 'Dashboard' : 'Início'}
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#6da67a] text-[#6da67a] rounded-lg font-semibold hover:bg-[#6da67a]/10 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          </div>

          {/* Links Úteis */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Páginas mais acessadas:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {user ? (
                <>
                  {user.role === 'aluno' && (
                    <>
                      <Link
                        to="/calendario"
                        className="px-4 py-2 text-sm text-[#6da67a] hover:bg-[#6da67a]/10 rounded-lg transition-colors"
                      >
                        Calendário
                      </Link>
                      <Link
                        to="/minhas-reservas"
                        className="px-4 py-2 text-sm text-[#6da67a] hover:bg-[#6da67a]/10 rounded-lg transition-colors"
                      >
                        Minhas Reservas
                      </Link>
                    </>
                  )}
                  <Link
                    to="/perfil"
                    className="px-4 py-2 text-sm text-[#6da67a] hover:bg-[#6da67a]/10 rounded-lg transition-colors"
                  >
                    Meu Perfil
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm text-[#6da67a] hover:bg-[#6da67a]/10 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/registro"
                    className="px-4 py-2 text-sm text-[#6da67a] hover:bg-[#6da67a]/10 rounded-lg transition-colors"
                  >
                    Cadastro
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mensagem Extra */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            Se você acredita que isso é um erro, entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}