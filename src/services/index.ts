// Firebase
export { auth, db, storage } from './firebase';

// Auth Service
export {
  register,
  login,
  logout,
  updateUser,
  changePassword,
  getCurrentUser,
  updateUserRole,
} from './authService';

// Aulas Service
export {
  createAula,
  getAulaById,
  getAllAulas,
  getAulasByInstrutor,
  getAulasAtivas,
  updateAula,
  deleteAula,
  toggleAulaStatus,
  incrementarVagasOcupadas,
  decrementarVagasOcupadas,
  hasVagasDisponiveis,
} from './aulasService';

// Reservas Service
export {
  createReserva,
  cancelReserva,
  marcarPresenca,
  getReservaById,
  getReservas,
  getReservasAtivasByAluno,
  getHistoricoByAluno,
  getAlunosInscritos,
  contarReservasPorStatus,
  calcularTaxaPresenca,
} from './reservasService';