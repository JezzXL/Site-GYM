import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToastContext } from '../hooks/useToastContext';

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
      
      // Mostrar toast de sucesso
      toast.success('Login realizado com sucesso!');
      
      // Após login, será redirecionado automaticamente pelo useAuth
      navigate('/dashboard');
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
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Esqueci a senha */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-[#6da67a] hover:text-[#77b885] font-medium"
              >
                Esqueceu sua senha?
              </button>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6da67a] text-white rounded-lg font-semibold hover:bg-[#77b885] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
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