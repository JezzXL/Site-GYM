import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, User, LogOut, Calendar, Clock, Users, 
  CheckCircle, XCircle, TrendingUp, Award
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AulaInstrutor {
  id: string;
  modalidade: string;
  diaSemana: string;
  data: string;
  horario: string;
  capacidade: number;
  alunosInscritos: number;
  alunos: AlunoAula[];
}

interface AlunoAula {
  id: string;
  nome: string;
  email: string;
  status: 'confirmado' | 'compareceu' | 'ausente';
}

export default function DashboardInstrutor() {
  const { user, logout } = useAuth();
  const [aulaExpandida, setAulaExpandida] = useState<string | null>(null);

  // Dados mockados
  const estatisticas = {
    aulasHoje: 3,
    totalAlunos: 45,
    taxaPresenca: 88,
    aulasSemana: 12,
  };

  const proximasAulas: AulaInstrutor[] = [
    {
      id: '1',
      modalidade: 'Funcional',
      diaSemana: 'Segunda-feira',
      data: '2024-11-11',
      horario: '18:00',
      capacidade: 10,
      alunosInscritos: 8,
      alunos: [
        { id: '1', nome: 'João Silva', email: 'joao@email.com', status: 'confirmado' },
        { id: '2', nome: 'Maria Santos', email: 'maria@email.com', status: 'confirmado' },
        { id: '3', nome: 'Pedro Costa', email: 'pedro@email.com', status: 'confirmado' },
        { id: '4', nome: 'Ana Paula', email: 'ana@email.com', status: 'confirmado' },
        { id: '5', nome: 'Carlos Lima', email: 'carlos@email.com', status: 'confirmado' },
        { id: '6', nome: 'Juliana Rocha', email: 'juliana@email.com', status: 'confirmado' },
        { id: '7', nome: 'Roberto Alves', email: 'roberto@email.com', status: 'confirmado' },
        { id: '8', nome: 'Fernanda Dias', email: 'fernanda@email.com', status: 'confirmado' },
      ],
    },
    {
      id: '2',
      modalidade: 'Funcional',
      diaSemana: 'Quarta-feira',
      data: '2024-11-13',
      horario: '18:00',
      capacidade: 10,
      alunosInscritos: 6,
      alunos: [
        { id: '9', nome: 'Lucas Mendes', email: 'lucas@email.com', status: 'confirmado' },
        { id: '10', nome: 'Patrícia Silva', email: 'patricia@email.com', status: 'confirmado' },
        { id: '11', nome: 'Ricardo Santos', email: 'ricardo@email.com', status: 'confirmado' },
        { id: '12', nome: 'Camila Oliveira', email: 'camila@email.com', status: 'confirmado' },
        { id: '13', nome: 'Bruno Ferreira', email: 'bruno@email.com', status: 'confirmado' },
        { id: '14', nome: 'Amanda Costa', email: 'amanda@email.com', status: 'confirmado' },
      ],
    },
    {
      id: '3',
      modalidade: 'Funcional',
      diaSemana: 'Sexta-feira',
      data: '2024-11-15',
      horario: '18:00',
      capacidade: 10,
      alunosInscritos: 9,
      alunos: [
        { id: '15', nome: 'Gabriel Souza', email: 'gabriel@email.com', status: 'confirmado' },
        { id: '16', nome: 'Beatriz Lima', email: 'beatriz@email.com', status: 'confirmado' },
        { id: '17', nome: 'Rafael Dias', email: 'rafael@email.com', status: 'confirmado' },
        { id: '18', nome: 'Larissa Alves', email: 'larissa@email.com', status: 'confirmado' },
        { id: '19', nome: 'Thiago Rocha', email: 'thiago@email.com', status: 'confirmado' },
        { id: '20', nome: 'Mariana Castro', email: 'mariana@email.com', status: 'confirmado' },
        { id: '21', nome: 'Felipe Martins', email: 'felipe@email.com', status: 'confirmado' },
        { id: '22', nome: 'Carolina Reis', email: 'carolina@email.com', status: 'confirmado' },
        { id: '23', nome: 'Daniel Gomes', email: 'daniel@email.com', status: 'confirmado' },
      ],
    },
  ];

  const aulasRecentes = [
    { id: '1', modalidade: 'Funcional', data: '2024-11-08', horario: '18:00', presentes: 8, total: 10, taxa: 80 },
    { id: '2', modalidade: 'Funcional', data: '2024-11-06', horario: '18:00', presentes: 9, total: 9, taxa: 100 },
    { id: '3', modalidade: 'Funcional', data: '2024-11-04', horario: '18:00', presentes: 7, total: 8, taxa: 87 },
  ];

  const handleMarcarPresenca = (aulaId: string, alunoId: string, status: 'compareceu' | 'ausente') => {
    console.log('Marcando presença:', { aulaId, alunoId, status });
    // TODO: Implementar lógica de marcar presença
  };

  const toggleAulaExpandida = (aulaId: string) => {
    setAulaExpandida(aulaExpandida === aulaId ? null : aulaId);
  };

  const percentualOcupacao = (aula: AulaInstrutor) => 
    ((aula.alunosInscritos / aula.capacidade) * 100).toFixed(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-8 h-8 text-[#6da67a]" />
              <span className="text-xl font-bold text-[#4a4857]">GymSchedule</span>
              <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                INSTRUTOR
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
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Gerencie suas aulas e acompanhe a presença dos alunos
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#6da67a]/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-[#6da67a]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Aulas Hoje</p>
            <p className="text-3xl font-bold text-[#4a4857]">{estatisticas.aulasHoje}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#77b885]/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#77b885]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total de Alunos</p>
            <p className="text-3xl font-bold text-[#4a4857]">{estatisticas.totalAlunos}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#859987]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#859987]" />
              </div>
              <span className="text-sm text-green-600 font-medium">+3%</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Taxa de Presença</p>
            <p className="text-3xl font-bold text-[#4a4857]">{estatisticas.taxaPresenca}%</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#86c28b]/10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-[#86c28b]" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Aulas na Semana</p>
            <p className="text-3xl font-bold text-[#4a4857]">{estatisticas.aulasSemana}</p>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Próximas Aulas */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-[#4a4857] mb-4">Próximas Aulas</h2>
            
            {proximasAulas.map((aula) => (
              <div key={aula.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header da Aula */}
                <div 
                  onClick={() => toggleAulaExpandida(aula.id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[#4a4857] mb-2">
                        {aula.modalidade}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{aula.diaSemana} - {aula.data}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{aula.horario}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{aula.alunosInscritos}/{aula.capacidade} alunos</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <div className="text-2xl font-bold text-[#6da67a]">
                        {percentualOcupacao(aula)}%
                      </div>
                      <div className="text-xs text-gray-500">ocupação</div>
                    </div>
                  </div>

                  {/* Barra de progresso */}
                  <div className="mt-4">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#6da67a]"
                        style={{ width: `${percentualOcupacao(aula)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Lista de Alunos (expandível) */}
                {aulaExpandida === aula.id && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    <div className="p-6">
                      <h4 className="font-semibold text-[#4a4857] mb-4">
                        Alunos Inscritos ({aula.alunos.length})
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {aula.alunos.map((aluno) => (
                          <div
                            key={aluno.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg"
                          >
                            <div>
                              <p className="font-medium text-[#4a4857]">{aluno.nome}</p>
                              <p className="text-sm text-gray-500">{aluno.email}</p>
                            </div>
                            
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleMarcarPresenca(aula.id, aluno.id, 'compareceu')}
                                className={`p-2 rounded-lg transition-colors ${
                                  aluno.status === 'compareceu'
                                    ? 'bg-green-100 text-green-600'
                                    : 'bg-gray-100 text-gray-400 hover:bg-green-50 hover:text-green-600'
                                }`}
                                title="Marcar presença"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleMarcarPresenca(aula.id, aluno.id, 'ausente')}
                                className={`p-2 rounded-lg transition-colors ${
                                  aluno.status === 'ausente'
                                    ? 'bg-red-100 text-red-600'
                                    : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-600'
                                }`}
                                title="Marcar falta"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar - Histórico e Desempenho */}
          <div className="lg:col-span-1 space-y-6">
            {/* Aulas Recentes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#4a4857]">Aulas Recentes</h3>
              </div>
              <div className="p-6 space-y-4">
                {aulasRecentes.map((aula) => (
                  <div key={aula.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-[#4a4857]">{aula.modalidade}</p>
                        <p className="text-sm text-gray-500">{aula.data} - {aula.horario}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        aula.taxa >= 90 
                          ? 'bg-green-100 text-green-700'
                          : aula.taxa >= 70
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {aula.taxa}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {aula.presentes}/{aula.total} alunos presentes
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Card de Desempenho */}
            <div className="bg-gradient-to-br from-[#6da67a] to-[#77b885] rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white/90">Seu Desempenho</p>
                  <p className="text-2xl font-bold">Excelente!</p>
                </div>
              </div>
              <p className="text-sm text-white/90 mb-4">
                Você mantém uma taxa de presença de {estatisticas.taxaPresenca}% nas suas aulas. Continue assim!
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Meta mensal</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white"
                    style={{ width: `${(estatisticas.taxaPresenca / 85) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Dicas */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Dica do Dia
              </h4>
              <p className="text-sm text-blue-800">
                Lembre-se de marcar a presença dos alunos até 15 minutos após o início da aula para manter o registro atualizado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}