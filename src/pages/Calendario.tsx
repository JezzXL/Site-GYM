import { useState } from 'react';
import { Calendar, Clock, Users, AlertCircle, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAulasAtivas } from '../hooks/useAulas';
import { useReservas } from '../hooks/useReservas';
import { useToastContext } from '../hooks/useToastContext';
import { DashboardLayout } from '../components/layout/Layout';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/layout/EmptyState';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import type { Aula } from '../types';
import { groupBy } from '../utils/helpers';
import { combineDateAndTime, getDayOfWeekNumber } from '../utils/dateUtils';

export default function Calendario() {
  const { user } = useAuth();
  const toast = useToastContext();
  
  // Hooks de dados
  const { aulas, loading: loadingAulas, error: errorAulas } = useAulasAtivas();
  const { createReserva, loading: loadingReserva } = useReservas();
  
  // Estados locais
  const [filtroModalidade, setFiltroModalidade] = useState<string>('');
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Processar dados
  const modalidades = ['', ...Array.from(new Set(aulas.map(a => a.modalidade)))];
  
  const aulasFiltradas = filtroModalidade
    ? aulas.filter(a => a.modalidade === filtroModalidade)
    : aulas;

  // Agrupar aulas por dia da semana
  const aulasPorDia = groupBy(aulasFiltradas, 'diaSemana');

  const handleReservar = (aula: Aula) => {
    if (!aula.ativa) {
      toast.warning('Esta aula está inativa');
      return;
    }
    
    const vagasDisponiveis = aula.capacidade - aula.vagasOcupadas;
    if (vagasDisponiveis <= 0) {
      toast.error('Esta aula está lotada');
      return;
    }
    
    setSelectedAula(aula);
    setShowModal(true);
  };

  const confirmarReserva = async () => {
    if (!selectedAula || !user) return;

    try {
      // Gerar próxima data da aula (próxima ocorrência do dia da semana)
      const hoje = new Date();
      const diaAula = getDayOfWeekNumber(selectedAula.diaSemana);
      const diasAteAula = (diaAula - hoje.getDay() + 7) % 7 || 7;
      const dataAula = new Date(hoje);
      dataAula.setDate(hoje.getDate() + diasAteAula);
      
      const dataHoraAula = combineDateAndTime(
        dataAula.toISOString().split('T')[0],
        selectedAula.horario
      );

      await createReserva({
        aulaId: selectedAula.id,
        alunoId: user.id,
        dataHora: dataHoraAula,
      });

      toast.success('Reserva realizada com sucesso!');
      setShowModal(false);
      setSelectedAula(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao reservar aula';
      toast.error(message);
    }
  };

  const getVagasColor = (aula: Aula) => {
    const vagasDisponiveis = aula.capacidade - aula.vagasOcupadas;
    const percentual = (vagasDisponiveis / aula.capacidade) * 100;
    
    if (percentual === 0) return 'border-red-500 bg-red-50';
    if (percentual <= 30) return 'border-yellow-500 bg-yellow-50';
    return 'border-green-500 bg-green-50';
  };

  // Loading state
  if (loadingAulas) {
    return (
      <DashboardLayout>
        <PageHeader title="Calendário de Aulas" subtitle="Carregando aulas disponíveis..." />
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
        <PageHeader title="Calendário de Aulas" />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar aulas</h3>
          <p className="text-red-600">{errorAulas}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Calendário de Aulas"
        subtitle="Selecione uma aula para fazer sua reserva"
      />

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-[#4a4857]">Filtros</h2>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Modalidade:</span>
          {modalidades.map((modalidade) => (
            <button
              key={modalidade || 'todas'}
              onClick={() => setFiltroModalidade(modalidade)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filtroModalidade === modalidade
                  ? 'bg-[#6da67a] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {modalidade || 'Todas'}
            </button>
          ))}
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
            <span className="text-gray-600">Muitas vagas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500 rounded"></div>
            <span className="text-gray-600">Poucas vagas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
            <span className="text-gray-600">Lotado</span>
          </div>
        </div>
      </div>

      {/* Lista de Aulas */}
      {aulasFiltradas.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-16 h-16" />}
          title="Nenhuma aula encontrada"
          description="Não há aulas disponíveis com os filtros selecionados"
          action={{
            label: 'Limpar Filtros',
            onClick: () => setFiltroModalidade(''),
          }}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(aulasPorDia).map(([dia, aulasNoDia]) => (
            <div key={dia} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-bold text-[#4a4857]">{dia}</h2>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aulasNoDia.map((aula) => {
                  const vagasDisponiveis = aula.capacidade - aula.vagasOcupadas;
                  const percentualOcupado = (aula.vagasOcupadas / aula.capacidade) * 100;
                  const isLotada = vagasDisponiveis === 0;
                  
                  return (
                    <div
                      key={aula.id}
                      className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getVagasColor(aula)}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-[#4a4857]">
                          {aula.modalidade}
                        </h3>
                        {!aula.ativa && (
                          <Badge variant="gray" size="sm">Inativa</Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{aula.instrutor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{aula.horario} ({aula.duracao} min)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{vagasDisponiveis} vagas disponíveis</span>
                        </div>
                      </div>

                      {/* Barra de ocupação */}
                      <div className="mb-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              isLotada ? 'bg-red-500' : percentualOcupado > 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${percentualOcupado}%` }}
                          ></div>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleReservar(aula)}
                        disabled={isLotada || !aula.ativa || loadingReserva}
                        variant={isLotada || !aula.ativa ? 'ghost' : 'primary'}
                        fullWidth
                      >
                        {isLotada ? 'Lotada' : !aula.ativa ? 'Inativa' : 'Reservar'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Confirmação */}
      {showModal && selectedAula && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Confirmar Reserva"
        >
          <ModalBody>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Modalidade:</span>
                <span className="font-semibold text-[#4a4857]">{selectedAula.modalidade}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Instrutor:</span>
                <span className="font-semibold text-[#4a4857]">{selectedAula.instrutor}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Dia:</span>
                <span className="font-semibold text-[#4a4857]">{selectedAula.diaSemana}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Horário:</span>
                <span className="font-semibold text-[#4a4857]">{selectedAula.horario}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Duração:</span>
                <span className="font-semibold text-[#4a4857]">{selectedAula.duracao} minutos</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Lembre-se:</p>
                <p>Você pode cancelar até 2 horas antes da aula.</p>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => setShowModal(false)}
              variant="outline"
              disabled={loadingReserva}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmarReserva}
              variant="primary"
              loading={loadingReserva}
            >
              Confirmar Reserva
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}