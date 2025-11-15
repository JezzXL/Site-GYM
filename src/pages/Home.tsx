import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Dumbbell, CheckCircle, TrendingUp, Award } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-white" />,
      title: 'Calendário Interativo',
      description: 'Visualize todas as aulas disponíveis em um calendário intuitivo e reserve com apenas um clique.'
    },
    {
      icon: <Clock className="w-6 h-6 text-white" />,
      title: 'Notificações Automáticas',
      description: 'Receba lembretes por e-mail 24h antes da sua aula e confirmações instantâneas.'
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      title: 'Controle de Vagas',
      description: 'Veja em tempo real quantas vagas restam em cada turma e garanta seu lugar.'
    }
  ];

  const benefits = [
    {
      icon: <CheckCircle className="w-5 h-5 text-[#6da67a]" />,
      text: 'Reserva fácil e rápida'
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-[#6da67a]" />,
      text: 'Acompanhe seu progresso'
    },
    {
      icon: <Award className="w-5 h-5 text-[#6da67a]" />,
      text: 'Sistema de presença'
    },
    {
      icon: <Users className="w-5 h-5 text-[#6da67a]" />,
      text: 'Gestão completa de aulas'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6da67a] to-[#4a4857]">
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
                className="px-4 py-2 text-white hover:text-[#86c28b] transition-colors font-medium"
              >
                Entrar
              </Link>
              <Link
                to="/registro"
                className="px-6 py-2 bg-white text-[#6da67a] rounded-lg font-semibold hover:bg-[#86c28b] hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
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
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Agende seu treino de forma fácil
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Gerencie suas aulas, reserve horários e acompanhe sua frequência em uma plataforma simples e intuitiva.
          </p>
          <Link
            to="/registro"
            className="inline-block px-8 py-4 bg-white text-[#6da67a] rounded-lg text-lg font-semibold hover:bg-[#86c28b] hover:text-white transition-all transform hover:scale-105 shadow-2xl"
          >
            Começar Agora
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-white/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-20 bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Por que escolher o GymSchedule?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  {benefit.icon}
                </div>
                <span className="text-lg">{benefit.text}</span>
              </div>
            ))}
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/registro"
              className="inline-block px-8 py-4 bg-white text-[#6da67a] rounded-lg text-lg font-semibold hover:bg-[#86c28b] hover:text-white transition-all transform hover:scale-105 shadow-lg"
            >
              Criar Conta Grátis
            </Link>
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-white/20 text-white rounded-lg text-lg font-semibold hover:bg-white/30 transition-all border border-white/40"
            >
              Já tenho conta
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="text-5xl font-bold text-white mb-2">500+</div>
            <div className="text-white/80">Alunos Ativos</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="text-5xl font-bold text-white mb-2">50+</div>
            <div className="text-white/80">Aulas por Semana</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20">
            <div className="text-5xl font-bold text-white mb-2">95%</div>
            <div className="text-white/80">Taxa de Satisfação</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-6 h-6 text-white" />
              <span className="text-lg font-bold text-white">GymSchedule</span>
            </div>
            <div className="text-white/70 text-center">
              <p>&copy; 2024 GymSchedule. Todos os direitos reservados.</p>
            </div>
            <div className="flex gap-6 text-white/70">
              <a href="#" className="hover:text-white transition-colors">Termos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}