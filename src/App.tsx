import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { ToastProvider } from './contexts/ToastProvider';
import { PrivateRoute } from './components/PrivateRoute';
import { RoleRoute } from './components/RoleRoute';

// Páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardAluno from './pages/DashboardAluno';
import DashboardInstrutor from './pages/DashboardInstrutor';
import DashboardAdmin from './pages/DashboardAdmin';
import Calendario from './pages/Calendario';
import MinhasReservas from './pages/MinhasReservas';
import Perfil from './pages/Perfil';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* ===== ROTAS PÚBLICAS ===== */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />

            {/* ===== ROTAS DO ALUNO ===== */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['aluno']}>
                    <DashboardAluno />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/calendario"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['aluno']}>
                    <Calendario />
                  </RoleRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/minhas-reservas"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['aluno']}>
                    <MinhasReservas />
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* ===== ROTAS DO INSTRUTOR ===== */}
            <Route
              path="/instrutor"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['instrutor', 'admin']}>
                    <DashboardInstrutor />
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* ===== ROTAS DO ADMIN ===== */}
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <RoleRoute allowedRoles={['admin']}>
                    <DashboardAdmin />
                  </RoleRoute>
                </PrivateRoute>
              }
            />

            {/* ===== ROTAS COMPARTILHADAS ===== */}
            <Route
              path="/perfil"
              element={
                <PrivateRoute>
                  <Perfil />
                </PrivateRoute>
              }
            />

            {/* ===== 404 ===== */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;