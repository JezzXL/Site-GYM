import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, User, LogOut, Calendar, CalendarDays, Clock, 
  CheckCircle, XCircle, AlertCircle, Trash2, X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { format, differenceInHours, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Reserva {
  id: string;
  aulaId: string;
  modalidade: string;
  instrutor: string;
  diaSemana: string;
  data: string;
  horario: string;
  status: 'confirmada' | 'cancelada' | 'compareceu' | 'ausente';
  criadaEm: string;
  canceladaEm?: string;
}

export default function MinhasReservas() {
  const { user, logout } = useAuth();
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativas' | 'historico'>('ativas');
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);

  // Dados mockados
  const todasReservas: Reserva[] = [
    {
      id: '1',
      aulaId: 'aula1',
      modalidade: 'Funcional',
      instrutor: 'Carlos Silva',
      diaSemana: 'Segunda-feira',
      data: '2024-11-11',
      horario: '18:00',
      status: 'confirmada',
      criadaEm: '2024-11-05T10:30:00',
    },
    {
      id: '2',
      aulaId: 'aula2',
      modalidade: 'Yoga',
      instrutor: 'Ana Santos',
      diaSemana: 'Quarta-feira',
      data: '2024-11-13',
      horario: '07:00',
      status: 'confirmada',
      criadaEm: '2024-11-06T14:20:00',
    },
    {
      id: '3',
      aulaId: 'aula3',
      modalidade: 'Cross',
      instrutor: 'Pedro Oliveira',
      diaSemana: 'Sexta-feira',
      data: '2024-11-15',
      horario: '19:00',
      status: 'confirmada',
      criadaEm: '2024-11-07T09:15:00',
    },
    {
      id: '4',
      aulaId: 'aula4',
      modalidade: 'Funcional',
      instrutor: 'Carlos Silva',
      diaSemana: 'Segunda-feira',
      data: '2024-11-04',
      horario: '18:00',
      status: 'compareceu',
      criadaEm: '2024-10-28T11:00:00',
    },
    {
      id: '5',
      aulaId: 'aula5',
      modalidade: 'Yoga',
      instrutor: 'Ana Santos',
      diaSemana: 'Quarta-feira',
      data: '2024-11-06',
      horario: '07:00',
      status: 'compareceu',
      criadaEm: '2024-10-30T16:45:00',
    },
    {
      id: '6',
      aulaId: 'aula6',
      modalidade: 'Cross',
      instrutor: 'Pedro Oliveira',
      diaSemana: 'Sexta-feira',
      data: '2024-11-01',
      horario: '19:00',
      status: 'ausente',
      criadaEm: '2024-10-25T08:30:00',
    },
    {
      id: '7',
      aulaId: 'aula7',
      modalidade: 'Funcional',
      instrutor: 'Carlos Silva',
      diaSemana: 'Segunda-feira',
      data: '2024-10-28',
      horario: '18:00',
      status: 'cancelada',
      criadaEm: '2024-10-20T13:00:00',
      canceladaEm: '2024-10-27T10:00:00',
    },
  ];

  const reservasAtivas = todasReservas.filter(r => r.status === 'confirmada');
  const historico = todasReservas.filter(r => ['compareceu', 'ausente', 'cancelada'].includes(r.status));

  const reservasFiltradas = 
    filtroStatus === 'ativas' ? reservasAtivas :
    filtroStatus === 'historico' ? historico :
    todasReservas;

  const estatisticas = {
    total: todasReservas.length,
    ativas: reservasAtivas.length,
    concluidas: todasReservas.filter(r => r.status === 'compareceu').length,
    taxaPresenca: Math.round(
      (todasReservas.filter(r => r.status === 'compareceu').length / 
       todasReservas.filter(r => ['compareceu', 'ausente'].includes(r.status)).length) * 100
    ),
  };

  const podeCancelar = (reserva: Reserva): boolean => {
    if (reserva.status !== 'confirmada') return false;
    
    const agora = new Date();
    const dataHoraAula = parseISO(`${reserva.data}T${reserva.horario}`);
    const horasRestantes = differenceInHours(dataHoraAula, agora);
    
    return horasRestantes >= 2;
  };

  const handleCancelarClick = (reserva: Reserva) => {
    setReservaSelecionada(reserva);
    setShowModalCancelar(true);
  };

  const confirmarCancelamento = () => {
    console.log('Cancelando reserva:', reservaSelecionada);
    // TODO: Implementar lógica de cancelamento
    setShowModalCancelar(false);
    setReservaSelecionada(null);
  };

  const getStatusBadge = (status: Reserva['status']) => {
    const badges = {
      confirmada: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle, label: 'Confirmada' },
      compareceu: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Compareceu' },
      ausente: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Ausente' },
      cancelada: { color: 'bg-gray-100 text-gray-700', icon: XCircle, label: 'Cancelada' },
    };
    
    const badge = badges[status];
    const Icon = badge.icon;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
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
                to="/dashboard"
                className="text-gray-600 hover:text-[#6da67a] transition-colors flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                to="/calendario"
                className="text-gray-600 hover:text-[#6da67a] transition-colors flex items-center gap-2"
              >
                <CalendarDays className="w-5 h-5" />
                <span className="hidden sm:inline">Calendário</span>
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
            Minhas Reservas
          </h1>
          <p className="text-gray-600">
            Gerencie suas reservas e acompanhe seu histórico
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total de Reservas</p>
            <p className="text-3xl font-bold text-[#4a4857]">{estatisticas.total}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Reservas Ativas</p>
            <p className="text-3xl font-bold text-[#6da67a]">{estatisticas.ativas}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Aulas Concluídas</p>
            <p className="text-3xl font-bold text-[#77b885]">{estatisticas.concluidas}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Taxa de Presença</p>
            <p className="text-3xl font-bold text-[#859987]">{estatisticas.taxaPresenca}%</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Exibir:</span>
            <button
              onClick={() => setFiltroStatus('ativas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroStatus === 'ativas'
                  ? 'bg-[#6da67a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reservas Ativas ({reservasAtivas.length})
            </button>
            <button
              onClick={() => setFiltroStatus('historico')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroStatus === 'historico'
                  ? 'bg-[#6da67a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Histórico ({historico.length})
            </button>
            <button
              onClick={() => setFiltroStatus('todas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroStatus === 'todas'
                  ? 'bg-[#6da67a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({todasReservas.length})
            </button>
          </div>
        </div>

        {/* Lista de Reservas */}
        {reservasFiltradas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Nenhuma reserva encontrada
            </h3>
            <p className="text-gray-500 mb-6">
              {filtroStatus === 'ativas' 
                ? 'Você não tem reservas ativas no momento.'
                : 'Você ainda não tem histórico de reservas.'}
            </p>
            <Link
              to="/calendario"
              className="inline-block px-6 py-3 bg-[#6da67a] text-white rounded-lg font-medium hover:bg-[#77b885] transition-colors"
            >
              Agendar Aula
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reservasFiltradas.map((reserva) => {
              const cancelavel = podeCancelar(reserva);
              
              return (
                <div
                  key={reserva.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 bg-[#6da67a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Dumbbell className="w-6 h-6 text-[#6da67a]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-[#4a4857]">
                              {reserva.modalidade}
                            </h3>
                            {getStatusBadge(reserva.status)}
                          </div>
                          <p className="text-sm text-gray-500">
                            Instrutor: {reserva.instrutor}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{reserva.diaSemana}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarDays className="w-4 h-4" />
                          <span>{reserva.data}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{reserva.horario}</span>
                        </div>
                      </div>

                      {reserva.status === 'confirmada' && !cancelavel && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>Não é mais possível cancelar esta reserva (menos de 2h para a aula)</span>
                        </div>
                      )}

                      {reserva.canceladaEm && (
                        <div className="mt-3 text-xs text-gray-500">
                          Cancelada em: {format(parseISO(reserva.canceladaEm), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    {reserva.status === 'confirmada' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCancelarClick(reserva)}
                          disabled={!cancelavel}
                          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            cancelavel
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Confirmação de Cancelamento */}
      {showModalCancelar && reservaSelecionada && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModalCancelar(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#4a4857] mb-2">
                Cancelar Reserva?
              </h2>
              <p className="text-gray-600">
                Tem certeza que deseja cancelar esta reserva?
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Modalidade:</span>
                <span className="font-semibold text-[#4a4857]">{reservaSelecionada.modalidade}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Data:</span>
                <span className="font-semibold text-[#4a4857]">{reservaSelecionada.data}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Horário:</span>
                <span className="font-semibold text-[#4a4857]">{reservaSelecionada.horario}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModalCancelar(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={confirmarCancelamento}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Sim, Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}