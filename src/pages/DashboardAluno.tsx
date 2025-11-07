import { Link } from 'react-router-dom';
import { Calendar, Clock, User, LogOut, Dumbbell, CheckCircle, XCircle, CalendarDays } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function DashboardAluno() {
  const { user, logout } = useAuth();

  // Dados mockados - depois virão do banco
  const proximasAulas = [
    {
      id: '1',
      modalidade: 'Funcional',
      instrutor: 'Carlos Silva',
      dia: 'Segunda-feira',
      horario: '18:00',
      data: '2024-11-11',
      vagas: 8,
      capacidade: 10,
    },
    {
      id: '2',
      modalidade: 'Yoga',
      instrutor: 'Ana Santos',
      dia: 'Quarta-feira',
      horario: '07:00',
      data: '2024-11-13',
      vagas: 5,
      capacidade: 8,
    },
    {
      id: '3',
      modalidade: 'Cross',
      instrutor: 'Pedro Oliveira',
      dia: 'Sexta-feira',
      horario: '19:00',
      data: '2024-11-15',
      vagas: 12,
      capacidade: 15,
    },
  ];

  const historicoRecente = [
    { id: '1', modalidade: 'Funcional', data: '2024-11-04', status: 'compareceu' },
    { id: '2', modalidade: 'Yoga', data: '2024-11-06', status: 'compareceu' },
    { id: '3', modalidade: 'Cross', data: '2024-11-08', status: 'ausente' },
  ];

  const estatisticas = {
    aulasAgendadas: 3,
    aulasConcluidas: 12,
    taxaPresenca: 85,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-[#6da67a]" />
              <span className="text-xl font-bold text-[#4a4857]">GymSchedule</span>
            </div>
            
            <div className="flex items-center gap-6">
              <Link
                to="/calendario"
                className="text-gray-600 hover:text-[#6da67a] transition-colors flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span className="hidden sm:inline">Calendário</span>
              </Link>
              <Link
                to="/minhas-reservas"
                className="text-gray-600 hover:text-[#6da67a] transition-colors flex items-center gap-2"
              >
                <CalendarDays className="w-5 h-5" />
                <span className="hidden sm:inline">Minhas Reservas</span>
              </Link>
              <Link
                to="/perfil"
                className="text-gray-600 hover:text-[#6da67a] transition-colors flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{user?.name}</span>
              </Link>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4a4857] mb-2">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Bem-vindo ao seu painel de treinos
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aulas Agendadas</p>
                <p className="text-3xl font-bold text-[#6da67a]">{estatisticas.aulasAgendadas}</p>
              </div>
              <div className="w-12 h-12 bg-[#6da67a]/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#6da67a]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Aulas Concluídas</p>
                <p className="text-3xl font-bold text-[#77b885]">{estatisticas.aulasConcluidas}</p>
              </div>
              <div className="w-12 h-12 bg-[#77b885]/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-[#77b885]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Taxa de Presença</p>
                <p className="text-3xl font-bold text-[#859987]">{estatisticas.taxaPresenca}%</p>
              </div>
              <div className="w-12 h-12 bg-[#859987]/10 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-[#859987]" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Próximas Aulas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#4a4857]">Próximas Aulas</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {proximasAulas.map((aula) => (
                  <div key={aula.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#4a4857] mb-2">
                          {aula.modalidade}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{aula.instrutor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{aula.dia} - {aula.data}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{aula.horario}</span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-xs text-gray-500">
                            {aula.vagas} vagas disponíveis de {aula.capacidade}
                          </span>
                          <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#6da67a]"
                              style={{ width: `${(aula.vagas / aula.capacidade) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <button className="ml-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 text-center">
                <Link
                  to="/calendario"
                  className="text-[#6da67a] hover:text-[#77b885] font-medium text-sm"
                >
                  Ver todas as aulas disponíveis →
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar - Histórico Recente */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#4a4857]">Histórico Recente</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {historicoRecente.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-[#4a4857]">{item.modalidade}</span>
                      {item.status === 'compareceu' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{item.data}</p>
                    <p className="text-xs mt-1">
                      <span className={item.status === 'compareceu' ? 'text-green-600' : 'text-red-600'}>
                        {item.status === 'compareceu' ? 'Compareceu' : 'Ausente'}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-gray-50 text-center">
                <Link
                  to="/minhas-reservas"
                  className="text-[#6da67a] hover:text-[#77b885] font-medium text-sm"
                >
                  Ver histórico completo →
                </Link>
              </div>
            </div>

            {/* CTA Agendar */}
            <div className="mt-6 bg-gradient-to-br from-[#6da67a] to-[#77b885] rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Agende sua próxima aula</h3>
              <p className="text-sm text-white/90 mb-4">
                Você tem {3 - estatisticas.aulasAgendadas} reservas disponíveis
              </p>
              <Link
                to="/calendario"
                className="block w-full py-2 bg-white text-[#6da67a] rounded-lg text-center font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Calendário
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}