import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, User, LogOut, Users, Calendar, TrendingUp, 
  Clock, Plus, Edit, Trash2, X, CheckCircle, BarChart3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Aula {
  id: string;
  modalidade: string;
  instrutor: string;
  instrutorId: string;
  diaSemana: string;
  horario: string;
  capacidade: number;
  ativa: boolean;
}

export default function DashboardAdmin() {
  const { user, logout } = useAuth();
  const [showModalAula, setShowModalAula] = useState(false);
  const [aulaEditando, setAulaEditando] = useState<Aula | null>(null);
  const [activeTab, setActiveTab] = useState<'estatisticas' | 'aulas' | 'usuarios'>('estatisticas');

  // Dados mockados
  const estatisticas = {
    totalAlunos: 156,
    aulasRealizadas: 48,
    ocupacaoMedia: 78,
    novasInscricoes: 12,
  };

  const aulas: Aula[] = [
    { id: '1', modalidade: 'Funcional', instrutor: 'Carlos Silva', instrutorId: 'inst1', diaSemana: 'Segunda-feira', horario: '18:00', capacidade: 10, ativa: true },
    { id: '2', modalidade: 'Yoga', instrutor: 'Ana Santos', instrutorId: 'inst2', diaSemana: 'Segunda-feira', horario: '07:00', capacidade: 8, ativa: true },
    { id: '3', modalidade: 'Cross', instrutor: 'Pedro Oliveira', instrutorId: 'inst3', diaSemana: 'Terça-feira', horario: '19:00', capacidade: 15, ativa: true },
    { id: '4', modalidade: 'Pilates', instrutor: 'Maria Costa', instrutorId: 'inst4', diaSemana: 'Quarta-feira', horario: '08:00', capacidade: 6, ativa: false },
  ];

  const usuarios = [
    { id: '1', nome: 'João Silva', email: 'joao@email.com', role: 'aluno', ativo: true, dataCadastro: '2024-01-15' },
    { id: '2', nome: 'Maria Santos', email: 'maria@email.com', role: 'aluno', ativo: true, dataCadastro: '2024-02-20' },
    { id: '3', nome: 'Carlos Silva', email: 'carlos@email.com', role: 'instrutor', ativo: true, dataCadastro: '2023-11-10' },
    { id: '4', nome: 'Ana Santos', email: 'ana@email.com', role: 'instrutor', ativo: true, dataCadastro: '2023-12-05' },
  ];

  const aulasRecentesSemana = [
    { dia: 'Seg', total: 8, ocupacao: 85 },
    { dia: 'Ter', total: 7, ocupacao: 72 },
    { dia: 'Qua', total: 9, ocupacao: 90 },
    { dia: 'Qui', total: 6, ocupacao: 65 },
    { dia: 'Sex', total: 8, ocupacao: 88 },
    { dia: 'Sab', total: 5, ocupacao: 70 },
    { dia: 'Dom', total: 5, ocupacao: 60 },
  ];

  const handleNovaAula = () => {
    setAulaEditando(null);
    setShowModalAula(true);
  };

  const handleEditarAula = (aula: Aula) => {
    setAulaEditando(aula);
    setShowModalAula(true);
  };

  const handleDeletarAula = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta aula?')) {
      console.log('Deletando aula:', id);
      // TODO: Implementar lógica de deletar
    }
  };

  const handleToggleAulaStatus = (id: string) => {
    console.log('Alternando status da aula:', id);
    // TODO: Implementar lógica de ativar/desativar
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
              <span className="ml-2 px-2 py-1 bg-[#6da67a] text-white text-xs rounded-full font-medium">
                ADMIN
              </span>
            </div>
            
            <div className="flex items-center gap-6">
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
            Painel Administrativo
          </h1>
          <p className="text-gray-600">
            Gerencie aulas, usuários e visualize estatísticas
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#6da67a]/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#6da67a]" />
              </div>
              <span className="text-sm text-green-600 font-medium">+{estatisticas.novasInscricoes}</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total de Alunos</p>
            <p className="text-3xl font-bold text-[#4a4857]">{estatisticas.totalAlunos}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#77b885]/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#77b885]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Aulas na Semana</p>
            <p className="text-3xl font-bold text-[#4a4857]">{estatisticas.aulasRealizadas}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#859987]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#859987]" />
              </div>
              <span className="text-sm text-green-600 font-medium">+5%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Ocupação Média</p>
            <p className="text-3xl font-bold text-[#4a4857]">{estatisticas.ocupacaoMedia}%</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#86c28b]/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-[#86c28b]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Aulas Ativas</p>
            <p className="text-3xl font-bold text-[#4a4857]">{aulas.filter(a => a.ativa).length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
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
                  Gerenciar Aulas
                </div>
              </button>
              <button
                onClick={() => setActiveTab('usuarios')}
                className={`py-4 px-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'usuarios'
                    ? 'border-[#6da67a] text-[#6da67a]'
                    : 'border-transparent text-gray-600 hover:text-[#6da67a]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Usuários
                </div>
              </button>
            </div>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="p-6">
            {/* Tab Estatísticas */}
            {activeTab === 'estatisticas' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-[#4a4857] mb-4">Ocupação por Dia da Semana</h3>
                  <div className="grid grid-cols-7 gap-4">
                    {aulasRecentesSemana.map((dia) => (
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
                    <h4 className="font-bold text-[#4a4857] mb-4">Modalidades Mais Populares</h4>
                    <div className="space-y-3">
                      {[
                        { nome: 'Funcional', percent: 35 },
                        { nome: 'Cross', percent: 30 },
                        { nome: 'Yoga', percent: 25 },
                        { nome: 'Pilates', percent: 10 },
                      ].map((mod) => (
                        <div key={mod.nome}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{mod.nome}</span>
                            <span className="font-medium text-[#6da67a]">{mod.percent}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#6da67a]"
                              style={{ width: `${mod.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-bold text-[#4a4857] mb-4">Taxa de Presença</h4>
                    <div className="space-y-3">
                      {[
                        { hora: '07:00 - 09:00', taxa: 92 },
                        { hora: '12:00 - 14:00', taxa: 78 },
                        { hora: '18:00 - 20:00', taxa: 88 },
                        { hora: '20:00 - 22:00', taxa: 75 },
                      ].map((periodo) => (
                        <div key={periodo.hora}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700">{periodo.hora}</span>
                            <span className="font-medium text-[#77b885]">{periodo.taxa}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#77b885]"
                              style={{ width: `${periodo.taxa}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab Gerenciar Aulas */}
            {activeTab === 'aulas' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-[#4a4857]">Aulas Cadastradas</h3>
                  <button
                    onClick={handleNovaAula}
                    className="px-4 py-2 bg-[#6da67a] text-white rounded-lg font-medium hover:bg-[#77b885] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Nova Aula
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Modalidade</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Instrutor</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dia</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Horário</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Capacidade</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {aulas.map((aula) => (
                        <tr key={aula.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-[#4a4857]">{aula.modalidade}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{aula.instrutor}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{aula.diaSemana}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{aula.horario}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{aula.capacidade} vagas</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleAulaStatus(aula.id)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                aula.ativa
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {aula.ativa ? 'Ativa' : 'Inativa'}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditarAula(aula)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletarAula(aula.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab Usuários */}
            {activeTab === 'usuarios' && (
              <div>
                <h3 className="text-lg font-bold text-[#4a4857] mb-6">Usuários do Sistema</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">E-mail</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Data Cadastro</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-[#4a4857]">{usuario.nome}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{usuario.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              usuario.role === 'instrutor'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {usuario.role === 'instrutor' ? 'Instrutor' : 'Aluno'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{usuario.dataCadastro}</td>
                          <td className="px-4 py-3">
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Ativo
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Nova/Editar Aula */}
      {showModalAula && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModalAula(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-[#4a4857] mb-6">
              {aulaEditando ? 'Editar Aula' : 'Nova Aula'}
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modalidade</label>
                <input
                  type="text"
                  defaultValue={aulaEditando?.modalidade}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                  placeholder="Ex: Funcional"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instrutor</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent">
                  <option>Carlos Silva</option>
                  <option>Ana Santos</option>
                  <option>Pedro Oliveira</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dia da Semana</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent">
                  <option>Segunda-feira</option>
                  <option>Terça-feira</option>
                  <option>Quarta-feira</option>
                  <option>Quinta-feira</option>
                  <option>Sexta-feira</option>
                  <option>Sábado</option>
                  <option>Domingo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
                <input
                  type="time"
                  defaultValue={aulaEditando?.horario}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacidade</label>
                <input
                  type="number"
                  defaultValue={aulaEditando?.capacidade}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                  placeholder="10"
                  min="1"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModalAula(false)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#6da67a] text-white rounded-lg font-medium hover:bg-[#77b885] transition-colors"
                >
                  {aulaEditando ? 'Salvar' : 'Criar Aula'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}