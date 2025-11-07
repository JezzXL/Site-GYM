import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Dumbbell, User, LogOut, Calendar, CalendarDays, Mail, 
  Lock, Camera, Save, X, CheckCircle, AlertCircle, Edit
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [editandoSenha, setEditandoSenha] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  
  // Estados do formulário de perfil
  const [nome, setNome] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Estados do formulário de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [loading, setLoading] = useState(false);

  // Dados mockados
  const estatisticas = {
    aulasRealizadas: 24,
    horasTreino: 36,
    sequenciaAtual: 5,
    melhorSequencia: 12,
  };

  const handleSalvarPerfil = async (e: FormEvent) => {
    e.preventDefault();
    setMensagemErro('');
    setMensagemSucesso('');
    setLoading(true);

    try {
      // Validações
      if (!nome || !email) {
        setMensagemErro('Preencha todos os campos');
        setLoading(false);
        return;
      }

      if (nome.length < 3) {
        setMensagemErro('O nome deve ter no mínimo 3 caracteres');
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setMensagemErro('E-mail inválido');
        setLoading(false);
        return;
      }

      // TODO: Implementar atualização no backend
      console.log('Atualizando perfil:', { nome, email });
      
      setMensagemSucesso('Perfil atualizado com sucesso!');
      setEditandoPerfil(false);
      
      setTimeout(() => setMensagemSucesso(''), 3000);
    } catch (error) {
      setMensagemErro('Erro ao atualizar perfil');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async (e: FormEvent) => {
    e.preventDefault();
    setMensagemErro('');
    setMensagemSucesso('');
    setLoading(true);

    try {
      // Validações
      if (!senhaAtual || !novaSenha || !confirmarSenha) {
        setMensagemErro('Preencha todos os campos de senha');
        setLoading(false);
        return;
      }

      if (novaSenha.length < 6) {
        setMensagemErro('A nova senha deve ter no mínimo 6 caracteres');
        setLoading(false);
        return;
      }

      if (novaSenha !== confirmarSenha) {
        setMensagemErro('As senhas não coincidem');
        setLoading(false);
        return;
      }

      // TODO: Implementar alteração de senha no backend
      console.log('Alterando senha');
      
      setMensagemSucesso('Senha alterada com sucesso!');
      setEditandoSenha(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
      
      setTimeout(() => setMensagemSucesso(''), 3000);
    } catch (error) {
      setMensagemErro('Erro ao alterar senha');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirConta = () => {
    console.log('Excluindo conta');
    // TODO: Implementar exclusão de conta
    logout();
    navigate('/');
  };

  const getRoleBadge = () => {
    const badges = {
      aluno: { color: 'bg-blue-100 text-blue-700', label: 'Aluno' },
      instrutor: { color: 'bg-purple-100 text-purple-700', label: 'Instrutor' },
      admin: { color: 'bg-[#6da67a] text-white', label: 'Administrador' },
    };
    
    return badges[user?.role || 'aluno'];
  };

  const badge = getRoleBadge();

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
              {user?.role === 'aluno' && (
                <>
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
                </>
              )}
              {user?.role === 'instrutor' && (
                <Link
                  to="/instrutor"
                  className="text-gray-600 hover:text-[#6da67a] transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-[#6da67a] transition-colors flex items-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              )}
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4a4857] mb-2">
            Meu Perfil
          </h1>
          <p className="text-gray-600">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>

        {/* Mensagens */}
        {mensagemSucesso && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{mensagemSucesso}</span>
          </div>
        )}

        {mensagemErro && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{mensagemErro}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de Perfil */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-br from-[#6da67a] to-[#77b885] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-[#4a4857] mb-1">
                {user?.name}
              </h2>
              <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
              
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                {badge.label}
              </span>
            </div>

            {/* Estatísticas do Aluno */}
            {user?.role === 'aluno' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-[#4a4857] mb-4">Estatísticas</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Aulas Realizadas</span>
                    <span className="text-lg font-bold text-[#6da67a]">{estatisticas.aulasRealizadas}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Horas de Treino</span>
                    <span className="text-lg font-bold text-[#77b885]">{estatisticas.horasTreino}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sequência Atual</span>
                    <span className="text-lg font-bold text-[#859987]">{estatisticas.sequenciaAtual} dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Melhor Sequência</span>
                    <span className="text-lg font-bold text-[#86c28b]">{estatisticas.melhorSequencia} dias</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Pessoais */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#4a4857]">Informações Pessoais</h3>
                {!editandoPerfil && (
                  <button
                    onClick={() => setEditandoPerfil(true)}
                    className="flex items-center gap-2 px-4 py-2 text-[#6da67a] hover:bg-[#6da67a]/10 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                )}
              </div>

              <div className="p-6">
                {editandoPerfil ? (
                  <form onSubmit={handleSalvarPerfil} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                        disabled={loading}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditandoPerfil(false);
                          setNome(user?.name || '');
                          setEmail(user?.email || '');
                        }}
                        className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2 bg-[#6da67a] text-white rounded-lg font-medium hover:bg-[#77b885] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Salvar
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Nome</p>
                        <p className="font-medium text-[#4a4857]">{user?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">E-mail</p>
                        <p className="font-medium text-[#4a4857]">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Alterar Senha */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#4a4857]">Segurança</h3>
                {!editandoSenha && (
                  <button
                    onClick={() => setEditandoSenha(true)}
                    className="flex items-center gap-2 px-4 py-2 text-[#6da67a] hover:bg-[#6da67a]/10 rounded-lg transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Alterar Senha
                  </button>
                )}
              </div>

              <div className="p-6">
                {editandoSenha ? (
                  <form onSubmit={handleAlterarSenha} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                        placeholder="Mínimo 6 caracteres"
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent"
                        disabled={loading}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setEditandoSenha(false);
                          setSenhaAtual('');
                          setNovaSenha('');
                          setConfirmarSenha('');
                        }}
                        className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        disabled={loading}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-2 bg-[#6da67a] text-white rounded-lg font-medium hover:bg-[#77b885] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Alterar Senha
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Senha</p>
                      <p className="font-medium text-[#4a4857]">••••••••</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Zona de Perigo */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden">
              <div className="p-6 border-b border-red-200 bg-red-50">
                <h3 className="text-lg font-bold text-red-700">Zona de Perigo</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Uma vez que você exclua sua conta, não há como voltar atrás. Por favor, tenha certeza.
                </p>
                <button
                  onClick={() => setShowModalExcluir(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Excluir Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Confirmação Exclusão */}
      {showModalExcluir && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModalExcluir(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#4a4857] mb-2">
                Excluir Conta?
              </h2>
              <p className="text-gray-600">
                Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModalExcluir(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleExcluirConta}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}