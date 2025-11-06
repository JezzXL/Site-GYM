import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Dumbbell } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#6da67a] to-[#4a4857]">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">GymSchedule</span>
            </div>
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-white hover:text-[#86c28b] transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/registro"
                className="px-6 py-2 bg-white text-[#6da67a] rounded-lg font-semibold hover:bg-[#86c28b] hover:text-white transition-all"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Agende seu treino de forma fácil
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Gerencie suas aulas, reserve horários e acompanhe sua frequência em uma plataforma simples e intuitiva.
          </p>
          <Link
            to="/registro"
            className="inline-block px-8 py-4 bg-white text-[#6da67a] rounded-lg text-lg font-semibold hover:bg-[#86c28b] hover:text-white transition-all transform hover:scale-105"
          >
            Começar Agora
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Calendário Interativo
            </h3>
            <p className="text-white/80">
              Visualize todas as aulas disponíveis em um calendário intuitivo e reserve com apenas um clique.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Notificações Automáticas
            </h3>
            <p className="text-white/80">
              Receba lembretes por e-mail 24h antes da sua aula e confirmações instantâneas.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Controle de Vagas
            </h3>
            <p className="text-white/80">
              Veja em tempo real quantas vagas restam em cada turma e garanta seu lugar.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Crie sua conta gratuitamente e comece a agendar seus treinos hoje mesmo.
          </p>
          <Link
            to="/registro"
            className="inline-block px-8 py-4 bg-white text-[#6da67a] rounded-lg text-lg font-semibold hover:bg-[#86c28b] hover:text-white transition-all transform hover:scale-105"
          >
            Criar Conta Grátis
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white/70">
            <p>&copy; 2024 GymSchedule. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}