import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirecionar se já estiver logado
  if (user) {
    const redirectMap = {
      aluno: '/dashboard',
      instrutor: '/instrutor',
      admin: '/admin',
    };
    navigate(redirectMap[user.role], { replace: true });
    return null;
  }

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
      
      // Redirecionar após cadastro
      navigate('/dashboard');
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
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
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nome */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
            </div>

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
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
              </div>
              
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

            {/* Confirmar Senha */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6da67a] focus:border-transparent outline-none transition-all"
                  disabled={loading}
                />
                {confirmPassword && password === confirmPassword && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Botão de Cadastro */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6da67a] text-white rounded-lg font-semibold hover:bg-[#77b885] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </button>
          </form>

          {/* Termos */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            Ao criar uma conta, você concorda com nossos{' '}
            <button className="text-[#6da67a] hover:underline">Termos de Uso</button>
            {' '}e{' '}
            <button className="text-[#6da67a] hover:underline">Política de Privacidade</button>
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