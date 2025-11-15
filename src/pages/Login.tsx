import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToastContext } from '../hooks/useToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Alert } from '../components/ui/Alert';

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const toast = useToastContext();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      // Validações básicas
      if (!email || !password) {
        setError('Preencha todos os campos');
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

      await login(email, password);
      
      toast.success('Login realizado com sucesso!');
      
      // Navegação será feita pelo useEffect acima
    } catch (err) {
      const message = err instanceof Error ? err.message : 'E-mail ou senha incorretos';
      setError(message);
      toast.error(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#4a4857] mb-2">
              Bem-vindo de volta!
            </h1>
            <p className="text-gray-600">
              Entre com sua conta para continuar
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

            <Input
              id="password"
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              fullWidth
              disabled={loading}
            />

            {/* Esqueci a senha */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#6da67a] hover:text-[#77b885] font-medium"
                onClick={() => toast.info('Funcionalidade em desenvolvimento')}
              >
                Esqueceu sua senha?
              </button>
            </div>

            {/* Botão de Login */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Entrar
            </Button>
          </form>

          {/* Divisor */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">ou</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Link para Cadastro */}
          <div className="text-center">
            <p className="text-gray-600">
              Ainda não tem uma conta?{' '}
              <Link
                to="/registro"
                className="text-[#6da67a] hover:text-[#77b885] font-semibold"
              >
                Cadastre-se
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