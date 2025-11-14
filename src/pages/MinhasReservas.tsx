import { useState, useMemo } from 'react';
import { 
  Calendar, CalendarDays, Clock, Users, AlertCircle, Trash2,
  CheckCircle, XCircle, Filter
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useReservas, useReservasStats } from '../hooks/useReservas';
import { useToastContext } from '../hooks/useToastContext';
import { DashboardLayout } from '../components/layout/Layout';
import { PageHeader } from '../components/layout/PageHeader';
import { StatsCard } from '../components/layout/StatsCard';
import { EmptyState } from '../components/layout/EmptyState';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type { Reserva, StatusReserva } from '../types';
import { 
  formatDate, 
  formatTime, 
  canCancelReservation, 
  getDayOfWeekName,
  formatRelativeDate 
} from '../utils/dateUtils';

type FiltroTipo = 'todas' | 'ativas' | 'historico';

export default function MinhasReservas() {
  const { user } = useAuth();
  const toast = useToastContext();
  
  // Hooks de dados
  const { 
    reservas, 
    loading: loadingReservas, 
    error: errorReservas,
    cancelReserva: cancelReservaService,
    refresh
  } = useReservas(user ? { alunoId: user.id } : undefined);
  
  const { 
    stats, 
    loading: loadingStats 
  } = useReservasStats(user?.id || '');
  
  // Estados locais
  const [filtroStatus, setFiltroStatus] = useState<FiltroTipo>('ativas');
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState<Reserva | null>(null);
  const [loadingCancel, setLoadingCancel] = useState(false);

  // Processar reservas
  const reservasProcessadas = useMemo(() => {
    const ativas = reservas.filter(r => r.status === 'confirmada');
    const historico = reservas.filter(r => ['compareceu', 'ausente', 'cancelada'].includes(r.status));
    
    return {
      todas: reservas,
      ativas,
      historico
    };
  }, [reservas]);

  const reservasFiltradas = reservasProcessadas[filtroStatus];

  const handleCancelarClick = (reserva: Reserva) => {
    if (!canCancelReservation(reserva.dataHora)) {
      toast.warning('Não é possível cancelar com menos de 2 horas de antecedência');
      return;
    }
    
    setReservaSelecionada(reserva);
    setShowModalCancelar(true);
  };

  const confirmarCancelamento = async () => {
    if (!reservaSelecionada) return;

    setLoadingCancel(true);
    try {
      await cancelReservaService(
        reservaSelecionada.id,
        'Cancelado pelo aluno'
      );
      
      toast.success('Reserva cancelada com sucesso!');
      setShowModalCancelar(false);
      setReservaSelecionada(null);
      refresh(); // Atualizar lista
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao cancelar reserva';
      toast.error(message);
    } finally {
      setLoadingCancel(false);
    }
  };

  const getStatusBadge = (status: StatusReserva) => {
    const badges = {
      confirmada: { 
        color: 'info' as const, 
        icon: CheckCircle, 
        label: 'Confirmada' 
      },
      compareceu: { 
        color: 'success' as const, 
        icon: CheckCircle, 
        label: 'Compareceu' 
      },
      ausente: { 
        color: 'danger' as const, 
        icon: XCircle, 
        label: 'Ausente' 
      },
      cancelada: { 
        color: 'gray' as const, 
        icon: XCircle, 
        label: 'Cancelada' 
      },
    };
    
    const badge = badges[status];
    const Icon = badge.icon;
    
    return (
      <Badge variant={badge.color} size="sm" icon={<Icon className="w-3 h-3" />}>
        {badge.label}
      </Badge>
    );
  };

  // Loading state
  if (loadingReservas || loadingStats) {
    return (
      <DashboardLayout>
        <PageHeader title="Minhas Reservas" subtitle="Carregando suas reservas..." />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6da67a]"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (errorReservas) {
    return (
      <DashboardLayout>
        <PageHeader title="Minhas Reservas" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar reservas</h3>
          <p className="text-red-600">{errorReservas}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Minhas Reservas"
        subtitle="Gerencie suas reservas e acompanhe seu histórico"
      />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Reservas"
          value={stats.total}
          icon={<Calendar className="w-6 h-6 text-[#6da67a]" />}
          iconColor="bg-[#6da67a]/10"
        />
        
        <StatsCard
          title="Reservas Ativas"
          value={stats.confirmadas}
          icon={<CalendarDays className="w-6 h-6 text-[#6da67a]" />}
          iconColor="bg-[#6da67a]/10"
        />
        
        <StatsCard
          title="Aulas Concluídas"
          value={stats.compareceu}
          icon={<CheckCircle className="w-6 h-6 text-[#77b885]" />}
          iconColor="bg-[#77b885]/10"
        />
        
        <StatsCard
          title="Taxa de Presença"
          value={`${stats.taxaPresenca}%`}
          icon={<Users className="w-6 h-6 text-[#859987]" />}
          iconColor="bg-[#859987]/10"
        />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-[#4a4857]">Filtros</h2>
        </div>
        
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
            Reservas Ativas ({reservasProcessadas.ativas.length})
          </button>
          <button
            onClick={() => setFiltroStatus('historico')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filtroStatus === 'historico'
                ? 'bg-[#6da67a] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Histórico ({reservasProcessadas.historico.length})
          </button>
          <button
            onClick={() => setFiltroStatus('todas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filtroStatus === 'todas'
                ? 'bg-[#6da67a] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas ({reservasProcessadas.todas.length})
          </button>
        </div>
      </div>

      {/* Lista de Reservas */}
      {reservasFiltradas.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-16 h-16" />}
          title="Nenhuma reserva encontrada"
          description={
            filtroStatus === 'ativas' 
              ? 'Você não tem reservas ativas no momento.'
              : 'Você ainda não tem histórico de reservas.'
          }
          action={{
            label: 'Agendar Aula',
            onClick: () => window.location.href = '/calendario',
            icon: <Calendar className="w-5 h-5" />
          }}
        />
      ) : (
        <div className="space-y-4">
          {reservasFiltradas.map((reserva) => {
            const cancelavel = canCancelReservation(reserva.dataHora);
            const dataAula = new Date(reserva.dataHora);
            const diaSemana = getDayOfWeekName(dataAula.getDay());
            
            return (
              <div
                key={reserva.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#6da67a]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CalendarDays className="w-6 h-6 text-[#6da67a]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-bold text-[#4a4857]">
                            Aula #{reserva.id.substring(0, 8)}
                          </h3>
                          {getStatusBadge(reserva.status)}
                        </div>
                        <p className="text-sm text-gray-500">
                          Reserva ID: {reserva.id}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-[#6da67a]" />
                        <span>{diaSemana}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <CalendarDays className="w-4 h-4 text-[#6da67a]" />
                        <span>{formatRelativeDate(dataAula)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-[#6da67a]" />
                        <span>{formatTime(dataAula)}</span>
                      </div>
                    </div>

                    {/* Avisos */}
                    {reserva.status === 'confirmada' && !cancelavel && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Não é mais possível cancelar (menos de 2h para a aula)</span>
                      </div>
                    )}

                    {reserva.canceladaEm && (
                      <div className="mt-3 text-xs text-gray-500">
                        Cancelada em: {formatDate(reserva.canceladaEm)} às {formatTime(reserva.canceladaEm)}
                        {reserva.motivoCancelamento && (
                          <span className="block mt-1">Motivo: {reserva.motivoCancelamento}</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Ações */}
                  {reserva.status === 'confirmada' && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleCancelarClick(reserva)}
                        disabled={!cancelavel}
                        variant="danger"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Confirmação de Cancelamento */}
      {showModalCancelar && reservaSelecionada && (
        <Modal
          isOpen={showModalCancelar}
          onClose={() => !loadingCancel && setShowModalCancelar(false)}
          title="Cancelar Reserva?"
          size="md"
        >
          <ModalBody>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600">
                Tem certeza que deseja cancelar esta reserva?
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ID da Reserva:</span>
                <span className="font-semibold text-[#4a4857]">
                  {reservaSelecionada.id.substring(0, 8)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Data:</span>
                <span className="font-semibold text-[#4a4857]">
                  {formatDate(reservaSelecionada.dataHora)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Horário:</span>
                <span className="font-semibold text-[#4a4857]">
                  {formatTime(reservaSelecionada.dataHora)}
                </span>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => setShowModalCancelar(false)}
              variant="outline"
              disabled={loadingCancel}
            >
              Voltar
            </Button>
            <Button
              onClick={confirmarCancelamento}
              variant="danger"
              loading={loadingCancel}
            >
              Sim, Cancelar
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}