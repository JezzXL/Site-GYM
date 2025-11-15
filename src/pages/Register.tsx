import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToastContext } from '../hooks/useToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

export default function Register() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const toast = useToastContext();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      const redirectMap = {
        aluno: '/dashboard',
        instrutor: '/instrutor',
        admin: '/admin',
      };
      navigate(redirectMap[user.role], { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validações
      if (!name || !email || !password || !confirmPassword) {
        setError('Preencha todos os campos');
        setLoading(false);
        return;
      }

      if (name.length < 3) {
        setError('O nome deve ter no mínimo 3 caracteres');
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        setError('E-mail inválido');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        setLoading(false);
        return;
      }

      await register(name, email, password);
      
      toast.success('Conta criada com sucesso!');
      
      // Navegação será feita pelo useEffect
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar conta. Tente novamente.';
      setError(message);
      toast.error(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Validação de força da senha
  const getPasswordStrength = () => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: 'Fraca', color: 'bg-red-500', width: 'w-1/3' };
    if (strength <= 3) return { label: 'Média', color: 'bg-yellow-500', width: 'w-2/3' };
    return { label: 'Forte', color: 'bg-green-500', width: 'w-full' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6da67a] to-[#4a4857] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <Dumbbell className="w-10 h-10" />
            <span className="text-3xl font-bold">GymSchedule</span>
          </Link>
        </div>

        {/* Card de Cadastro */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#4a4857] mb-2">
              Crie sua conta
            </h1>
            <p className="text-gray-600">
              Comece a agendar seus treinos hoje mesmo
            </p>
          </div>

          {/* Erro */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              id="name"
              label="Nome completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              icon={<User className="w-5 h-5" />}
              fullWidth
              disabled={loading}
            />

            <Input
              id="email"
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              icon={<Mail className="w-5 h-5" />}
              fullWidth
              disabled={loading}
            />

            <div>
              <Input
                id="password"
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                icon={<Lock className="w-5 h-5" />}
                fullWidth
                disabled={loading}
              />
              
              {/* Força da senha */}
              {passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Força da senha:</span>
                    <span className="text-xs font-medium text-gray-700">{passwordStrength.label}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all`}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                id="confirmPassword"
                label="Confirmar senha"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite a senha novamente"
                icon={<Lock className="w-5 h-5" />}
                fullWidth
                disabled={loading}
              />
              {confirmPassword && password === confirmPassword && (
                <CheckCircle className="absolute right-3 top-10 w-5 h-5 text-green-500" />
              )}
            </div>

            {/* Botão de Cadastro */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Criar conta
            </Button>
          </form>

          {/* Termos */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            Ao criar uma conta, você concorda com nossos{' '}
            <button 
              className="text-[#6da67a] hover:underline"
              onClick={() => toast.info('Página de termos em desenvolvimento')}
            >
              Termos de Uso
            </button>
            {' '}e{' '}
            <button 
              className="text-[#6da67a] hover:underline"
              onClick={() => toast.info('Página de privacidade em desenvolvimento')}
            >
              Política de Privacidade
            </button>
          </p>

          {/* Divisor */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Link para Login */}
          <div className="text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="text-[#6da67a] hover:text-[#77b885] font-semibold"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>

        {/* Link para Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-white hover:text-[#86c28b] transition-colors text-sm"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}