import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Users, CheckCircle, XCircle, 
  CalendarDays, TrendingUp, Award, Dumbbell 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useReservasAtivas, useHistorico, useReservasStats } from '../hooks/useReservas';
import { DashboardLayout } from '../components/layout/Layout';
import { PageHeader } from '../components/layout/PageHeader';
import { StatsCard } from '../components/layout/StatsCard';
import { EmptyState } from '../components/layout/EmptyState';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatDate, formatTime, getDayOfWeekName, formatRelativeDate } from '../utils/dateUtils';
import { getGreeting } from '../utils/helpers';

export default function DashboardAluno() {
  const { user } = useAuth();
  
  // Hooks de dados
  const { 
    reservas: proximasReservas, 
    loading: loadingReservas 
  } = useReservasAtivas(user?.id || '');
  
  const { 
    reservas: historico, 
    loading: loadingHistorico 
  } = useHistorico(user?.id || '', 5); // Últimas 5
  
  const { 
    stats, 
    loading: loadingStats 
  } = useReservasStats(user?.id || '');

  // Calcular horas de treino (aproximado: cada aula = 1h)
  const horasTreino = stats.compareceu || 0;
  
  // Calcular sequência atual (simplificado - pode ser melhorado)
  const sequenciaAtual = stats.compareceu > 0 ? Math.min(stats.compareceu, 7) : 0;

  const isLoading = loadingReservas || loadingHistorico || loadingStats;

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageHeader 
          title={`${getGreeting()}, ${user?.name?.split(' ')[0]}! 👋`}
          subtitle="Carregando seus dados..."
        />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6da67a]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0]}! 👋`}
        subtitle="Bem-vindo ao seu painel de treinos"
      />

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Aulas Agendadas"
          value={proximasReservas.length}
          icon={<Calendar className="w-6 h-6 text-[#6da67a]" />}
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
          icon={<TrendingUp className="w-6 h-6 text-[#859987]" />}
          iconColor="bg-[#859987]/10"
          trend={
            stats.taxaPresenca >= 80
              ? { value: 'Ótimo!', isPositive: true }
              : undefined
          }
        />
      </div>

      {/* Grid de Conteúdo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Próximas Aulas (2 colunas) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#4a4857]">Próximas Aulas</h2>
                <Link to="/minhas-reservas">
                  <Button variant="ghost" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </div>
            </CardHeader>
            
            <CardBody>
              {proximasReservas.length === 0 ? (
                <EmptyState
                  icon={<Calendar className="w-12 h-12" />}
                  title="Nenhuma aula agendada"
                  description="Você não tem aulas agendadas no momento"
                  action={{
                    label: 'Agendar Aula',
                    onClick: () => window.location.href = '/calendario',
                    icon: <CalendarDays className="w-4 h-4" />
                  }}
                />
              ) : (
                <div className="divide-y divide-gray-100">
                  {proximasReservas.slice(0, 3).map((reserva) => {
                    const dataAula = new Date(reserva.dataHora);
                    const diaSemana = getDayOfWeekName(dataAula.getDay());
                    
                    return (
                      <div key={reserva.id} className="py-4 first:pt-0 last:pb-0 hover:bg-gray-50 transition-colors rounded-lg px-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#4a4857] mb-2">
                              Reserva #{reserva.id.substring(0, 8)}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{reserva.alunoNome || 'Aluno'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{diaSemana} - {formatRelativeDate(dataAula)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{formatTime(dataAula)}</span>
                              </div>
                            </div>
                          </div>
                          <Link to="/minhas-reservas">
                            <Button variant="outline" size="sm">
                              Detalhes
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {proximasReservas.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <Link
                    to="/calendario"
                    className="text-[#6da67a] hover:text-[#77b885] font-medium text-sm"
                  >
                    Ver todas as aulas disponíveis →
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar (1 coluna) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Histórico Recente */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-bold text-[#4a4857]">Histórico Recente</h2>
            </CardHeader>
            
            <CardBody>
              {loadingHistorico ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6da67a] mx-auto"></div>
                </div>
              ) : historico.length === 0 ? (
                <EmptyState
                  icon={<CalendarDays className="w-10 h-10" />}
                  title="Sem histórico"
                  description="Você ainda não tem aulas concluídas"
                />
              ) : (
                <div className="divide-y divide-gray-100">
                  {historico.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#4a4857]">
                          {formatDate(item.dataHora)}
                        </span>
                        {item.status === 'compareceu' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : item.status === 'ausente' ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{formatTime(item.dataHora)}</p>
                      <p className="text-xs mt-1">
                        <Badge
                          variant={
                            item.status === 'compareceu' 
                              ? 'success' 
                              : item.status === 'ausente'
                              ? 'danger'
                              : 'gray'
                          }
                          size="sm"
                        >
                          {item.status === 'compareceu' 
                            ? 'Compareceu' 
                            : item.status === 'ausente'
                            ? 'Ausente'
                            : 'Cancelada'}
                        </Badge>
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {historico.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <Link
                    to="/minhas-reservas"
                    className="text-[#6da67a] hover:text-[#77b885] font-medium text-sm"
                  >
                    Ver histórico completo →
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Card de Motivação */}
          <div className="bg-gradient-to-br from-[#6da67a] to-[#77b885] rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/90">Seu Progresso</p>
                <p className="text-2xl font-bold">{stats.compareceu} aulas</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Horas de Treino</span>
                  <span className="font-medium">{horasTreino}h</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all"
                    style={{ width: `${Math.min((horasTreino / 50) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Sequência Atual</span>
                  <span className="font-medium">{sequenciaAtual} dias</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white transition-all"
                    style={{ width: `${(sequenciaAtual / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-white/90 mt-4">
              {stats.taxaPresenca >= 80 
                ? '🎉 Excelente! Continue assim!' 
                : stats.taxaPresenca >= 60
                ? '💪 Você está indo bem! Siga em frente!'
                : '🌟 Vamos juntos! Reserve mais aulas!'}
            </p>
          </div>

          {/* CTA Agendar */}
          {proximasReservas.length < 3 && (
            <Card>
              <CardBody>
                <div className="text-center">
                  <Dumbbell className="w-12 h-12 text-[#6da67a] mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-[#4a4857] mb-2">
                    Agende sua próxima aula
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Você tem {3 - proximasReservas.length} reservas disponíveis
                  </p>
                  <Link to="/calendario">
                    <Button variant="primary" fullWidth>
                      Ver Calendário
                    </Button>
                  </Link>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Estatísticas Rápidas */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-[#4a4857]">Estatísticas</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total de Reservas</span>
                  <span className="text-lg font-bold text-[#6da67a]">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Canceladas</span>
                  <span className="text-lg font-bold text-[#859987]">{stats.canceladas}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ausências</span>
                  <span className="text-lg font-bold text-red-600">{stats.ausente}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}