import { Link } from 'react-router-dom';
import { Dumbbell, User, LogOut, Calendar, CalendarDays, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../ui/Badge';
import { useState } from 'react';

interface NavbarProps {
  showBadge?: boolean;
}

export function Navbar({ showBadge = false }: NavbarProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavLinks = () => {
    if (!user) return null;

    const links = {
      aluno: [
        { to: '/dashboard', icon: Calendar, label: 'Dashboard' },
        { to: '/calendario', icon: CalendarDays, label: 'Calendário' },
        { to: '/minhas-reservas', icon: CalendarDays, label: 'Minhas Reservas' },
      ],
      instrutor: [
        { to: '/instrutor', icon: Calendar, label: 'Dashboard' },
      ],
      admin: [
        { to: '/admin', icon: Calendar, label: 'Dashboard' },
      ],
    };

    return links[user.role] || [];
  };

  const getRoleBadge = () => {
    if (!user || !showBadge) return null;

    const badges = {
      aluno: { variant: 'info' as const, label: 'ALUNO' },
      instrutor: { variant: 'warning' as const, label: 'INSTRUTOR' },
      admin: { variant: 'primary' as const, label: 'ADMIN' },
    };

    const badge = badges[user.role];
    return <Badge variant={badge.variant} size="sm">{badge.label}</Badge>;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-[#6da67a]" />
            <span className="text-xl font-bold text-[#4a4857]">GymSchedule</span>
            {getRoleBadge()}
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks?.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-gray-600 hover:text-[#6da67a] transition-colors flex items-center gap-2"
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              <Link
                to="/perfil"
                className="text-gray-600 hover:text-[#6da67a] transition-colors flex items-center gap-2"
              >
                <User className="w-5 h-5" />
                <span className="hidden lg:inline">{user.name}</span>
              </Link>

              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:inline">Sair</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-[#6da67a] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {navLinks?.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-600 hover:text-[#6da67a] transition-colors py-2"
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            <Link
              to="/perfil"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 text-gray-600 hover:text-[#6da67a] transition-colors py-2"
            >
              <User className="w-5 h-5" />
              <span>{user.name}</span>
            </Link>

            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors py-2 w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}