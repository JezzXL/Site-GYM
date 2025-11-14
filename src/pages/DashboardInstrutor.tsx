import { useState } from 'react';
import { 
  Calendar, Clock, Users, CheckCircle, XCircle, 
  TrendingUp, Award, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAulasInstrutor } from '../hooks/useAulas';
import { useReservas } from '../hooks/useReservas';
import { useToastContext } from '../hooks/useToastContext';
import { DashboardLayout } from '../components/layout/Layout';
import { PageHeader } from '../components/layout/PageHeader';
import { StatsCard } from '../components/layout/StatsCard';
import { EmptyState } from '../components/layout/EmptyState';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import type { Aula } from '../types';
import { getDayOfWeekNumber } from '../utils/dateUtils';
import { getGreeting } from '../utils/helpers';

export default function DashboardInstrutor() {
  const { user } = useAuth();
  const toast = useToastContext();
  
  // Hooks de dados
  const { 
    aulas, 
    loading: loadingAulas, 
    error: errorAulas 
  } = useAulasInstrutor(user?.id || '');
  
  const { 
    reservas, 
    loading: loadingReservas,
    marcarPresenca 
  } = useReservas();
  
  // Estados locais
  const [aulaExpandida, setAulaExpandida] = useState<string | null>(null);
  const [loadingPresenca, setLoadingPresenca] = useState<string | null>(null);

  // Calcular estatísticas
  const aulasHoje = aulas.filter(aula => {
    const hoje = new Date();
    const diaAula = getDayOfWeekNumber(aula.diaSemana);
    return diaAula === hoje.getDay();
  }).length;

  const totalAlunos = reservas.filter(r => 
    r.status === 'confirmada' || r.status === 'compareceu'
  ).length;

  const reservasCompareceu = reservas.filter(r => r.status === 'compareceu').length;
  const reservasTotal = reservas.filter(r => 
    r.status === 'compareceu' || r.status === 'ausente'
  ).length;
  const taxaPresenca = reservasTotal > 0 
    ? Math.round((reservasCompareceu / reservasTotal) * 100) 
    : 0;

  const aulasSemana = aulas.length;

  // Buscar alunos de uma aula específica
  const getAlunosAula = (aulaId: string) => {
    return reservas.filter(r => 
      r.aulaId === aulaId && 
      (r.status === 'confirmada' || r.status === 'compareceu' || r.status === 'ausente')
    );
  };

  const handleMarcarPresenca = async (reservaId: string, status: 'compareceu' | 'ausente') => {
    setLoadingPresenca(reservaId);
    try {
      await marcarPresenca(reservaId, status);
      toast.success('Presença marcada com sucesso!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao marcar presença';
      toast.error(message);
    } finally {
      setLoadingPresenca(null);
    }
  };

  const toggleAulaExpandida = (aulaId: string) => {
    setAulaExpandida(aulaExpandida === aulaId ? null : aulaId);
  };

  const percentualOcupacao = (aula: Aula) => 
    ((aula.vagasOcupadas / aula.capacidade) * 100).toFixed(0);

  // Loading state
  if (loadingAulas || loadingReservas) {
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

  // Error state
  if (errorAulas) {
    return (
      <DashboardLayout>
        <PageHeader title="Dashboard Instrutor" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
          <p className="text-red-600">{errorAulas}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title={`${getGreeting()}, ${user?.name?.split(' ')[0]}! 👋`}
        subtitle="Gerencie suas aulas e acompanhe a presença dos alunos"
      />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Aulas Hoje"
          value={aulasHoje}
          icon={<Calendar className="w-6 h-6 text-[#6da67a]" />}
          iconColor="bg-[#6da67a]/10"
        />

        <StatsCard
          title="Total de Alunos"
          value={totalAlunos}
          icon={<Users className="w-6 h-6 text-[#77b885]" />}
          iconColor="bg-[#77b885]/10"
        />

        <StatsCard
          title="Taxa de Presença"
          value={`${taxaPresenca}%`}
          icon={<TrendingUp className="w-6 h-6 text-[#859987]" />}
          iconColor="bg-[#859987]/10"
          trend={
            taxaPresenca >= 85
              ? { value: '+3%', isPositive: true }
              : undefined
          }
        />

        <StatsCard
          title="Aulas na Semana"
          value={aulasSemana}
          icon={<Award className="w-6 h-6 text-[#86c28b]" />}
          iconColor="bg-[#86c28b]/10"
        />
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Próximas Aulas (2 colunas) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-[#4a4857] mb-4">Próximas Aulas</h2>
          
          {aulas.length === 0 ? (
            <EmptyState
              icon={<Calendar className="w-12 h-12" />}
              title="Nenhuma aula cadastrada"
              description="Você ainda não tem aulas cadastradas no sistema"
            />
          ) : (
            aulas.slice(0, 3).map((aula) => {
              const alunos = getAlunosAula(aula.id);
              const isExpanded = aulaExpandida === aula.id;
              
              return (
                <Card key={aula.id} hover>
                  <div 
                    onClick={() => toggleAulaExpandida(aula.id)}
                    className="p-6 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#4a4857] mb-2">
                          {aula.modalidade}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{aula.diaSemana}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{aula.horario}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>{aula.vagasOcupadas}/{aula.capacidade} alunos</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-[#6da67a]">
                          {percentualOcupacao(aula)}%
                        </div>
                        <div className="text-xs text-gray-500">ocupação</div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-gray-400 mx-auto mt-2" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 mx-auto mt-2" />
                        )}
                      </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="mt-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#6da67a] transition-all"
                          style={{ width: `${percentualOcupacao(aula)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Alunos (expandível) */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 p-6">
                      <h4 className="font-semibold text-[#4a4857] mb-4">
                        Alunos Inscritos ({alunos.length})
                      </h4>
                      {alunos.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Nenhum aluno inscrito ainda
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {alunos.map((reserva) => (
                            <div
                              key={reserva.id}
                              className="flex items-center justify-between p-3 bg-white rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-[#4a4857]">
                                  {reserva.alunoNome || 'Aluno'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {reserva.alunoEmail || 'email@exemplo.com'}
                                </p>
                              </div>
                              
                              <div className="flex gap-2">
                                {reserva.status === 'confirmada' ? (
                                  <>
                                    <Button
                                      onClick={() => handleMarcarPresenca(reserva.id, 'compareceu')}
                                      disabled={loadingPresenca === reserva.id}
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:bg-green-50"
                                    >
                                      <CheckCircle className="w-5 h-5" />
                                    </Button>
                                    <Button
                                      onClick={() => handleMarcarPresenca(reserva.id, 'ausente')}
                                      disabled={loadingPresenca === reserva.id}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:bg-red-50"
                                    >
                                      <XCircle className="w-5 h-5" />
                                    </Button>
                                  </>
                                ) : (
                                  <Badge
                                    variant={reserva.status === 'compareceu' ? 'success' : 'danger'}
                                    size="sm"
                                  >
                                    {reserva.status === 'compareceu' ? 'Presente' : 'Ausente'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* Sidebar (1 coluna) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card de Desempenho */}
          <div className="bg-gradient-to-br from-[#6da67a] to-[#77b885] rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/90">Seu Desempenho</p>
                <p className="text-2xl font-bold">
                  {taxaPresenca >= 85 ? 'Excelente!' : 'Muito Bom!'}
                </p>
              </div>
            </div>
            <p className="text-sm text-white/90 mb-4">
              Você mantém uma taxa de presença de {taxaPresenca}% nas suas aulas. 
              {taxaPresenca >= 85 ? ' Continue assim!' : ' Você está indo bem!'}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Meta mensal</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all"
                  style={{ width: `${Math.min((taxaPresenca / 85) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Resumo de Aulas */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold text-[#4a4857]">Resumo Semanal</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total de Aulas</span>
                  <span className="text-lg font-bold text-[#6da67a]">{aulas.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Aulas Ativas</span>
                  <span className="text-lg font-bold text-[#77b885]">
                    {aulas.filter(a => a.ativa).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Capacidade Total</span>
                  <span className="text-lg font-bold text-[#859987]">
                    {aulas.reduce((acc, a) => acc + a.capacidade, 0)}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Dicas */}
          <Card>
            <CardBody>
              <div className="text-center">
                <Award className="w-12 h-12 text-[#6da67a] mx-auto mb-3" />
                <h4 className="font-semibold text-[#4a4857] mb-2">Dica do Dia</h4>
                <p className="text-sm text-gray-600">
                  Lembre-se de marcar a presença dos alunos até 15 minutos após o início da aula.
                </p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}