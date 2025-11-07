import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Dumbbell, User, LogOut, CalendarDays, X, Clock, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// Tipos
interface Aula {
  id: string;
  modalidade: string;
  instrutor: string;
  instrutorId: string;
  diaSemana: string;
  data: string;
  horario: string;
  duracao: number;
  capacidade: number;
  vagasOcupadas: number;
  reservada?: boolean;
}

export default function Calendario() {
  const { user, logout } = useAuth();
  const [selectedAula, setSelectedAula] = useState<Aula | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filtroModalidade, setFiltroModalidade] = useState<string>('todas');

  // Dados mockados - depois virão do banco
  const aulas: Aula[] = [
    {
      id: '1',
      modalidade: 'Funcional',
      instrutor: 'Carlos Silva',
      instrutorId: 'inst1',
      diaSemana: 'Segunda-feira',
      data: '2024-11-11',
      horario: '18:00',
      duracao: 60,
      capacidade: 10,
      vagasOcupadas: 2,
      reservada: true,
    },
    {
      id: '2',
      modalidade: 'Yoga',
      instrutor: 'Ana Santos',
      instrutorId: 'inst2',
      diaSemana: 'Segunda-feira',
      data: '2024-11-11',
      horario: '07:00',
      duracao: 60,
      capacidade: 8,
      vagasOcupadas: 3,
      reservada: false,
    },
    {
      id: '3',
      modalidade: 'Cross',
      instrutor: 'Pedro Oliveira',
      instrutorId: 'inst3',
      diaSemana: 'Terça-feira',
      data: '2024-11-12',
      horario: '19:00',
      duracao: 60,
      capacidade: 15,
      vagasOcupadas: 3,
      reservada: false,
    },
    {
      id: '4',
      modalidade: 'Funcional',
      instrutor: 'Carlos Silva',
      instrutorId: 'inst1',
      diaSemana: 'Quarta-feira',
      data: '2024-11-13',
      horario: '18:00',
      duracao: 60,
      capacidade: 10,
      vagasOcupadas: 5,
      reservada: false,
    },
    {
      id: '5',
      modalidade: 'Yoga',
      instrutor: 'Ana Santos',
      instrutorId: 'inst2',
      diaSemana: 'Quarta-feira',
      data: '2024-11-13',
      horario: '07:00',
      duracao: 60,
      capacidade: 8,
      vagasOcupadas: 0,
      reservada: true,
    },
    {
      id: '6',
      modalidade: 'Cross',
      instrutor: 'Pedro Oliveira',
      instrutorId: 'inst3',
      diaSemana: 'Sexta-feira',
      data: '2024-11-15',
      horario: '19:00',
      duracao: 60,
      capacidade: 15,
      vagasOcupadas: 3,
      reservada: true,
    },
  ];

  const modalidades = ['todas', 'Funcional', 'Yoga', 'Cross'];

  const aulasFiltradas = filtroModalidade === 'todas' 
    ? aulas 
    : aulas.filter(a => a.modalidade === filtroModalidade);

  // Agrupar aulas por dia
  const aulasPorDia = aulasFiltradas.reduce((acc, aula) => {
    if (!acc[aula.diaSemana]) {
      acc[aula.diaSemana] = [];
    }
    acc[aula.diaSemana].push(aula);
    return acc;
  }, {} as Record<string, Aula[]>);

  const handleReservar = (aula: Aula) => {
    setSelectedAula(aula);
    setShowModal(true);
  };

  const confirmarReserva = () => {
    console.log('Reservando aula:', selectedAula);
    // TODO: Implementar lógica de reserva
    setShowModal(false);
    setSelectedAula(null);
  };

  const vagasDisponiveis = (aula: Aula) => aula.capacidade - aula.vagasOcupadas;
  const percentualOcupacao = (aula: Aula) => (aula.vagasOcupadas / aula.capacidade) * 100;

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
            Calendário de Aulas
          </h1>
          <p className="text-gray-600">
            Selecione uma aula para fazer sua reserva
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filtrar por:</span>
            {modalidades.map((modalidade) => (
              <button
                key={modalidade}
                onClick={() => setFiltroModalidade(modalidade)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filtroModalidade === modalidade
                    ? 'bg-[#6da67a] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {modalidade.charAt(0).toUpperCase() + modalidade.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Legenda */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-8">
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
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#6da67a] rounded"></div>
              <span className="text-gray-600">Já reservada</span>
            </div>
          </div>
        </div>

        {/* Grade de Aulas por Dia */}
        <div className="space-y-6">
          {Object.entries(aulasPorDia).map(([dia, aulasNoDia]) => (
            <div key={dia} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h2 className="text-lg font-bold text-[#4a4857]">{dia}</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aulasNoDia.map((aula) => {
                  const vagas = vagasDisponiveis(aula);
                  const ocupacao = percentualOcupacao(aula);
                  const isLotada = vagas === 0;
                  
                  let statusColor = 'border-green-500 bg-green-50';
                  if (ocupacao > 70) statusColor = 'border-yellow-500 bg-yellow-50';
                  if (isLotada) statusColor = 'border-red-500 bg-red-50';
                  if (aula.reservada) statusColor = 'border-[#6da67a] bg-[#6da67a]/10';

                  return (
                    <div
                      key={aula.id}
                      className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${statusColor}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-lg font-bold text-[#4a4857]">
                          {aula.modalidade}
                        </h3>
                        {aula.reservada && (
                          <span className="px-2 py-1 bg-[#6da67a] text-white text-xs rounded-full font-medium">
                            Reservada
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{aula.instrutor}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{aula.horario} ({aula.duracao} min)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{vagas} vagas disponíveis</span>
                        </div>
                      </div>

                      {/* Barra de ocupação */}
                      <div className="mb-4">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              isLotada ? 'bg-red-500' : ocupacao > 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${ocupacao}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleReservar(aula)}
                        disabled={isLotada || aula.reservada}
                        className={`w-full py-2 rounded-lg font-medium transition-all ${
                          aula.reservada
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : isLotada
                            ? 'bg-red-100 text-red-600 cursor-not-allowed'
                            : 'bg-[#6da67a] text-white hover:bg-[#77b885]'
                        }`}
                      >
                        {aula.reservada ? 'Já Reservada' : isLotada ? 'Lotada' : 'Reservar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showModal && selectedAula && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-[#4a4857] mb-4">
              Confirmar Reserva
            </h2>

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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Lembre-se:</p>
                <p>Você pode cancelar até 2 horas antes da aula.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarReserva}
                className="flex-1 py-3 bg-[#6da67a] text-white rounded-lg font-medium hover:bg-[#77b885] transition-colors"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}