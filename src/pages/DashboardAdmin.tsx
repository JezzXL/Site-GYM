import { useState } from 'react';
import { 
  Users, Calendar, TrendingUp, Award, Plus, Edit, 
  Trash2, BarChart3, Search, Power, PowerOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAulas } from '../hooks/useAulas';
import { useReservas } from '../hooks/useReservas';
import { useToastContext } from '../hooks/useToastContext';
import { DashboardLayout } from '../components/layout/Layout';
import { PageHeader } from '../components/layout/PageHeader';
import { StatsCard } from '../components/layout/StatsCard';
import { Card, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import type { Aula, CreateAulaDTO, DiaSemana } from '../types';
import { getGreeting } from '../utils/helpers';
import { DIAS_SEMANA, MODALIDADES } from '../utils/constants';

export default function DashboardAdmin() {
  const { user } = useAuth();
  const toast = useToastContext();
  
  // Hooks de dados
  const { 
    aulas, 
    loading: loadingAulas, 
    createAula,
    updateAula,
    deleteAula,
    toggleStatus,
    refresh
  } = useAulas();
  
  const { 
    reservas, 
    loading: loadingReservas 
  } = useReservas();
  
  // Estados locais
  const [activeTab, setActiveTab] = useState<'estatisticas' | 'aulas'>('estatisticas');
  const [showModalAula, setShowModalAula] = useState(false);
  const [aulaEditando, setAulaEditando] = useState<Aula | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModalidade, setFilterModalidade] = useState<string>('');
  const [filterDia, setFilterDia] = useState<string>('');
  
  // Form states
  const [formData, setFormData] = useState<{
    modalidade: string;
    instrutor: string;
    instrutorId: string;
    diaSemana: DiaSemana;
    horario: string;
    duracao: number;
    capacidade: number;
    descricao: string;
  }>({
    modalidade: '',
    instrutor: '',
    instrutorId: user?.id || '',
    diaSemana: 'Segunda-feira',
    horario: '18:00',
    duracao: 60,
    capacidade: 10,
    descricao: ''
  });

  // Calcular estatísticas
  const totalAlunos = new Set(reservas.map(r => r.alunoId)).size;
  const aulasRealizadas = reservas.filter(r => 
    r.status === 'compareceu' || r.status === 'ausente'
  ).length;
  const reservasCompareceu = reservas.filter(r => r.status === 'compareceu').length;
  const ocupacaoMedia = aulas.length > 0
    ? Math.round(aulas.reduce((acc, a) => acc + (a.vagasOcupadas / a.capacidade * 100), 0) / aulas.length)
    : 0;

  // Filtrar aulas
  const aulasFiltradas = aulas.filter(aula => {
    const matchSearch = aula.modalidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       aula.instrutor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModalidade = !filterModalidade || aula.modalidade === filterModalidade;
    const matchDia = !filterDia || aula.diaSemana === filterDia;
    
    return matchSearch && matchModalidade && matchDia;
  });

  // Dados para gráfico
  const aulasPorDia = DIAS_SEMANA.map(dia => ({
    dia: dia.substring(0, 3),
    total: aulas.filter(a => a.diaSemana === dia).length,
    ocupacao: Math.round(
      aulas.filter(a => a.diaSemana === dia)
        .reduce((acc, a) => acc + (a.vagasOcupadas / a.capacidade * 100), 0) / 
      (aulas.filter(a => a.diaSemana === dia).length || 1)
    )
  }));

  const handleNovaAula = () => {
    setAulaEditando(null);
    setFormData({
      modalidade: '',
      instrutor: user?.name || '',
      instrutorId: user?.id || '',
      diaSemana: 'Segunda-feira',
      horario: '18:00',
      duracao: 60,
      capacidade: 10,
      descricao: ''
    });
    setShowModalAula(true);
  };

  const handleEditarAula = (aula: Aula) => {
    setAulaEditando(aula);
    setFormData({
      modalidade: aula.modalidade,
      instrutor: aula.instrutor,
      instrutorId: aula.instrutorId,
      diaSemana: aula.diaSemana,
      horario: aula.horario,
      duracao: aula.duracao,
      capacidade: aula.capacidade,
      descricao: aula.descricao || ''
    });
    setShowModalAula(true);
  };

  const handleSalvarAula = async () => {
    // Validações
    if (!formData.modalidade || !formData.instrutor || !formData.horario) {
      toast.warning('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.duracao < 30 || formData.duracao > 180) {
      toast.warning('Duração deve estar entre 30 e 180 minutos');
      return;
    }

    if (formData.capacidade < 1 || formData.capacidade > 50) {
      toast.warning('Capacidade deve estar entre 1 e 50 alunos');
      return;
    }

    setLoadingAction(true);
    try {
      if (aulaEditando) {
        await updateAula(aulaEditando.id, formData);
        toast.success('Aula atualizada com sucesso!');
      } else {
        const newAula: CreateAulaDTO = {
          ...formData,
          instrutorId: user?.id || formData.instrutorId
        };
        await createAula(newAula);
        toast.success('Aula criada com sucesso!');
      }
      setShowModalAula(false);
      refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar aula';
      toast.error(message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleDeletarAula = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.')) return;

    setLoadingAction(true);
    try {
      await deleteAula(id);
      toast.success('Aula excluída com sucesso!');
      refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao excluir aula';
      toast.error(message);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleToggleStatus = async (id: string, ativa: boolean) => {
    setLoadingAction(true);
    try {
      await toggleStatus(id, !ativa);
      toast.success(`Aula ${!ativa ? 'ativada' : 'desativada'} com sucesso!`);
      refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao alterar status';
      toast.error(message);
    } finally {
      setLoadingAction(false);
    }
  };

  const limparFiltros = () => {
    setSearchTerm('');
    setFilterModalidade('');
    setFilterDia('');
  };

  const isLoading = loadingAulas || loadingReservas;

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageHeader 
          title={`${getGreeting()}, ${user?.name?.split(' ')[0]}!`}
          subtitle="Carregando dados..."
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
        title={`${getGreeting()}, ${user?.name?.split(' ')[0]}!`}
        subtitle="Painel administrativo do sistema"
      />

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total de Alunos"
          value={totalAlunos}
          icon={<Users className="w-6 h-6 text-[#6da67a]" />}
          iconColor="bg-[#6da67a]/10"
        />

        <StatsCard
          title="Aulas Realizadas"
          value={aulasRealizadas}
          icon={<Calendar className="w-6 h-6 text-[#77b885]" />}
          iconColor="bg-[#77b885]/10"
        />

        <StatsCard
          title="Ocupação Média"
          value={`${ocupacaoMedia}%`}
          icon={<TrendingUp className="w-6 h-6 text-[#859987]" />}
          iconColor="bg-[#859987]/10"
        />

        <StatsCard
          title="Aulas Ativas"
          value={aulas.filter(a => a.ativa).length}
          icon={<Award className="w-6 h-6 text-[#86c28b]" />}
          iconColor="bg-[#86c28b]/10"
        />
      </div>

      {/* Tabs */}
      <Card className="mb-8">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab('estatisticas')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'estatisticas'
                  ? 'border-[#6da67a] text-[#6da67a]'
                  : 'border-transparent text-gray-600 hover:text-[#6da67a]'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Estatísticas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('aulas')}
              className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                activeTab === 'aulas'
                  ? 'border-[#6da67a] text-[#6da67a]'
                  : 'border-transparent text-gray-600 hover:text-[#6da67a]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Gerenciar Aulas ({aulas.length})
              </div>
            </button>
          </div>
        </div>

        <CardBody>
          {/* Tab Estatísticas */}
          {activeTab === 'estatisticas' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#4a4857] mb-4">
                  Ocupação por Dia da Semana
                </h3>
                <div className="grid grid-cols-7 gap-4">
                  {aulasPorDia.map((dia) => (
                    <div key={dia.dia} className="text-center">
                      <div className="mb-2 text-sm font-medium text-gray-600">{dia.dia}</div>
                      <div className="h-32 bg-gray-100 rounded-lg relative overflow-hidden">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-[#6da67a] transition-all"
                          style={{ height: `${dia.ocupacao}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">{dia.ocupacao}%</div>
                      <div className="text-xs text-gray-400">{dia.total} aulas</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-[#4a4857] mb-4">Resumo de Reservas</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total de Reservas</span>
                      <span className="text-lg font-bold text-[#6da67a]">{reservas.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Compareceram</span>
                      <span className="text-lg font-bold text-green-600">{reservasCompareceu}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Taxa de Presença</span>
                      <span className="text-lg font-bold text-[#859987]">
                        {reservas.length > 0 ? Math.round((reservasCompareceu / reservas.length) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-bold text-[#4a4857] mb-4">Capacidade Total</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vagas Totais</span>
                      <span className="text-lg font-bold text-[#6da67a]">
                        {aulas.reduce((acc, a) => acc + a.capacidade, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vagas Ocupadas</span>
                      <span className="text-lg font-bold text-[#77b885]">
                        {aulas.reduce((acc, a) => acc + a.vagasOcupadas, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Vagas Disponíveis</span>
                      <span className="text-lg font-bold text-[#859987]">
                        {aulas.reduce((acc, a) => acc + (a.capacidade - a.vagasOcupadas), 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Gerenciar Aulas */}
          {activeTab === 'aulas' && (
            <div>
              {/* Header com busca e botão */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex-1 w-full md:max-w-md">
                  <Input
                    placeholder="Buscar por modalidade ou instrutor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-5 h-5" />}
                    fullWidth
                  />
                </div>
                <Button
                  onClick={handleNovaAula}
                  icon={<Plus className="w-5 h-5" />}
                  disabled={loadingAction}
                >
                  Nova Aula
                </Button>
              </div>

              {/* Filtros */}
              <div className="flex flex-wrap gap-3 mb-6">
                <select
                  value={filterModalidade}
                  onChange={(e) => setFilterModalidade(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                >
                  <option value="">Todas as Modalidades</option>
                  {MODALIDADES.map(mod => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>

                <select
                  value={filterDia}
                  onChange={(e) => setFilterDia(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                >
                  <option value="">Todos os Dias</option>
                  {DIAS_SEMANA.map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>

                {(searchTerm || filterModalidade || filterDia) && (
                  <Button
                    onClick={limparFiltros}
                    variant="outline"
                    size="sm"
                  >
                    Limpar Filtros
                  </Button>
                )}
              </div>

              {/* Tabela de Aulas */}
              {aulasFiltradas.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Nenhuma aula encontrada
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || filterModalidade || filterDia 
                      ? 'Tente ajustar os filtros' 
                      : 'Comece criando sua primeira aula'}
                  </p>
                  {!searchTerm && !filterModalidade && !filterDia && (
                    <Button onClick={handleNovaAula} icon={<Plus className="w-5 h-5" />}>
                      Criar Primeira Aula
                    </Button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Modalidade</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Instrutor</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dia</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Horário</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Capacidade</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ocupação</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {aulasFiltradas.map((aula) => {
                        const ocupacao = Math.round((aula.vagasOcupadas / aula.capacidade) * 100);
                        
                        return (
                          <tr key={aula.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-[#4a4857]">
                              {aula.modalidade}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {aula.instrutor}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {aula.diaSemana}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {aula.horario}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {aula.vagasOcupadas}/{aula.capacidade}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                                  <div
                                    className={`h-full ${
                                      ocupacao >= 90 ? 'bg-red-500' : 
                                      ocupacao >= 70 ? 'bg-yellow-500' : 
                                      'bg-green-500'
                                    }`}
                                    style={{ width: `${ocupacao}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 w-10">{ocupacao}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleToggleStatus(aula.id, aula.ativa)}
                                disabled={loadingAction}
                                className="flex items-center gap-1"
                              >
                                <Badge variant={aula.ativa ? 'success' : 'danger'} size="sm">
                                  {aula.ativa ? (
                                    <><Power className="w-3 h-3" /> Ativa</>
                                  ) : (
                                    <><PowerOff className="w-3 h-3" /> Inativa</>
                                  )}
                                </Badge>
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex justify-end gap-2">
                                <Button
                                  onClick={() => handleEditarAula(aula)}
                                  variant="ghost"
                                  size="sm"
                                  disabled={loadingAction}
                                  icon={<Edit className="w-4 h-4" />}
                                >
                                  Editar
                                </Button>
                                <Button
                                  onClick={() => handleDeletarAula(aula.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:bg-red-50"
                                  disabled={loadingAction}
                                  icon={<Trash2 className="w-4 h-4" />}
                                >
                                  Excluir
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal Nova/Editar Aula */}
      {showModalAula && (
        <Modal
          isOpen={showModalAula}
          onClose={() => !loadingAction && setShowModalAula(false)}
          title={aulaEditando ? 'Editar Aula' : 'Nova Aula'}
          size="lg"
        >
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Modalidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modalidade *
                </label>
                <select
                  value={formData.modalidade}
                  onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                  disabled={loadingAction}
                >
                  <option value="">Selecione...</option>
                  {MODALIDADES.map(mod => (
                    <option key={mod} value={mod}>{mod}</option>
                  ))}
                </select>
              </div>

              {/* Instrutor */}
              <Input
                label="Instrutor *"
                value={formData.instrutor}
                onChange={(e) => setFormData({ ...formData, instrutor: e.target.value })}
                placeholder="Nome do instrutor"
                fullWidth
                disabled={loadingAction}
              />

              {/* Dia da Semana */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dia da Semana *
                </label>
                <select
                  value={formData.diaSemana}
                  onChange={(e) => setFormData({ ...formData, diaSemana: e.target.value as DiaSemana })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                  disabled={loadingAction}
                >
                  {DIAS_SEMANA.map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>

              {/* Horário */}
              <Input
                label="Horário *"
                type="time"
                value={formData.horario}
                onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                fullWidth
                disabled={loadingAction}
              />

              {/* Duração */}
              <Input
                label="Duração (minutos) *"
                type="number"
                value={formData.duracao}
                onChange={(e) => setFormData({ ...formData, duracao: parseInt(e.target.value) || 0 })}
                min={30}
                max={180}
                helperText="Entre 30 e 180 minutos"
                fullWidth
                disabled={loadingAction}
              />

              {/* Capacidade */}
              <Input
                label="Capacidade *"
                type="number"
                value={formData.capacidade}
                onChange={(e) => setFormData({ ...formData, capacidade: parseInt(e.target.value) || 0 })}
                min={1}
                max={50}
                helperText="Entre 1 e 50 alunos"
                fullWidth
                disabled={loadingAction}
              />

              {/* Descrição */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                  rows={3}
                  placeholder="Breve descrição da aula..."
                  disabled={loadingAction}
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => setShowModalAula(false)}
              variant="outline"
              disabled={loadingAction}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSalvarAula}
              variant="primary"
              loading={loadingAction}
            >
              {aulaEditando ? 'Salvar Alterações' : 'Criar Aula'}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}