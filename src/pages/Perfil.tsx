import { useState } from 'react';
import type { FormEvent } from 'react';
import { Mail, Lock, Camera, Save, AlertCircle, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useReservasStats } from '../hooks/useReservas';
import { useToastContext } from '../hooks/useToastContext';
import { updateUser, changePassword } from '../services/authService';
import { DashboardLayout } from '../components/layout/Layout';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal, ModalBody, ModalFooter } from '../components/ui/Modal';
import { getInitials, stringToColor } from '../utils/helpers';

export default function Perfil() {
  const { user } = useAuth();
  const toast = useToastContext();
  
  // Estatísticas (apenas para alunos)
  const { stats, loading: loadingStats } = useReservasStats(
    user?.role === 'aluno' ? user.id : ''
  );
  
  // Estados de edição
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [editandoSenha, setEditandoSenha] = useState(false);
  const [showModalExcluir, setShowModalExcluir] = useState(false);
  
  // Form perfil
  const [nome, setNome] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Form senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [loading, setLoading] = useState(false);

  // Calcular horas de treino (para alunos)
  const horasTreino = user?.role === 'aluno' ? stats.compareceu : 0;
  const sequenciaAtual = user?.role === 'aluno' ? Math.min(stats.compareceu, 7) : 0;

  const handleSalvarPerfil = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email) {
      toast.warning('Preencha todos os campos');
      return;
    }

    if (nome.length < 3) {
      toast.warning('O nome deve ter no mínimo 3 caracteres');
      return;
    }

    if (!email.includes('@')) {
      toast.warning('E-mail inválido');
      return;
    }

    setLoading(true);
    try {
      await updateUser({ name: nome, email });
      toast.success('Perfil atualizado com sucesso!');
      setEditandoPerfil(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar perfil';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      toast.warning('Preencha todos os campos de senha');
      return;
    }

    if (novaSenha.length < 6) {
      toast.warning('A nova senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      toast.warning('As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      await changePassword(senhaAtual, novaSenha);
      toast.success('Senha alterada com sucesso!');
      setEditandoSenha(false);
      setSenhaAtual('');
      setNovaSenha('');
      setConfirmarSenha('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao alterar senha';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirConta = () => {
    toast.error('Funcionalidade de exclusão de conta em desenvolvimento');
    setShowModalExcluir(false);
    // TODO: Implementar exclusão de conta
  };

  const getRoleBadge = () => {
    const badges = {
      aluno: { variant: 'info' as const, label: 'Aluno' },
      instrutor: { variant: 'warning' as const, label: 'Instrutor' },
      admin: { variant: 'primary' as const, label: 'Administrador' },
    };
    
    return badges[user?.role || 'aluno'];
  };

  const badge = getRoleBadge();
  const avatarColor = stringToColor(user?.name || '');
  const initials = getInitials(user?.name || '');

  return (
    <DashboardLayout>
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais e configurações"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Card de Perfil */}
          <Card>
            <CardBody>
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {initials}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <h2 className="text-xl font-bold text-[#4a4857] mb-1">
                  {user?.name}
                </h2>
                <p className="text-sm text-gray-500 mb-3">{user?.email}</p>
                
                <Badge variant={badge.variant} size="sm">
                  {badge.label}
                </Badge>
              </div>
            </CardBody>
          </Card>

          {/* Estatísticas do Aluno */}
          {user?.role === 'aluno' && !loadingStats && (
            <Card>
              <CardHeader>
                <h3 className="font-bold text-[#4a4857]">Estatísticas</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Aulas Realizadas</span>
                    <span className="text-lg font-bold text-[#6da67a]">{stats.compareceu}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Horas de Treino</span>
                    <span className="text-lg font-bold text-[#77b885]">{horasTreino}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sequência Atual</span>
                    <span className="text-lg font-bold text-[#859987]">{sequenciaAtual} dias</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taxa de Presença</span>
                    <span className="text-lg font-bold text-[#86c28b]">{stats.taxaPresenca}%</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Pessoais */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#4a4857]">Informações Pessoais</h3>
                {!editandoPerfil && (
                  <Button
                    onClick={() => setEditandoPerfil(true)}
                    variant="ghost"
                    size="sm"
                  >
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardBody>
              {editandoPerfil ? (
                <form onSubmit={handleSalvarPerfil} className="space-y-4">
                  <Input
                    label="Nome Completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    icon={<UserIcon className="w-5 h-5" />}
                    fullWidth
                    disabled={loading}
                  />

                  <Input
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-5 h-5" />}
                    fullWidth
                    disabled={loading}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setEditandoPerfil(false);
                        setNome(user?.name || '');
                        setEmail(user?.email || '');
                      }}
                      variant="outline"
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      icon={<Save className="w-4 h-4" />}
                    >
                      Salvar
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <UserIcon className="w-5 h-5 text-gray-400" />
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
            </CardBody>
          </Card>

          {/* Alterar Senha */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#4a4857]">Segurança</h3>
                {!editandoSenha && (
                  <Button
                    onClick={() => setEditandoSenha(true)}
                    variant="ghost"
                    size="sm"
                  >
                    Alterar Senha
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardBody>
              {editandoSenha ? (
                <form onSubmit={handleAlterarSenha} className="space-y-4">
                  <Input
                    label="Senha Atual"
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    icon={<Lock className="w-5 h-5" />}
                    fullWidth
                    disabled={loading}
                  />

                  <Input
                    label="Nova Senha"
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    icon={<Lock className="w-5 h-5" />}
                    placeholder="Mínimo 6 caracteres"
                    fullWidth
                    disabled={loading}
                  />

                  <Input
                    label="Confirmar Nova Senha"
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    icon={<Lock className="w-5 h-5" />}
                    fullWidth
                    disabled={loading}
                  />

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      onClick={() => {
                        setEditandoSenha(false);
                        setSenhaAtual('');
                        setNovaSenha('');
                        setConfirmarSenha('');
                      }}
                      variant="outline"
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      icon={<Save className="w-4 h-4" />}
                    >
                      Alterar Senha
                    </Button>
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
            </CardBody>
          </Card>

          {/* Zona de Perigo */}
          <Card className="border-red-200">
            <CardHeader className="bg-red-50 border-b border-red-200">
              <h3 className="text-lg font-bold text-red-700">Zona de Perigo</h3>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-gray-600 mb-4">
                Uma vez que você exclua sua conta, não há como voltar atrás. Por favor, tenha certeza.
              </p>
              <Button
                onClick={() => setShowModalExcluir(true)}
                variant="danger"
              >
                Excluir Conta
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Modal Confirmação Exclusão */}
      {showModalExcluir && (
        <Modal
          isOpen={showModalExcluir}
          onClose={() => setShowModalExcluir(false)}
          title="Excluir Conta?"
        >
          <ModalBody>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600">
                Esta ação é permanente e não pode ser desfeita. Todos os seus dados serão removidos.
              </p>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => setShowModalExcluir(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExcluirConta}
              variant="danger"
            >
              Sim, Excluir
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}