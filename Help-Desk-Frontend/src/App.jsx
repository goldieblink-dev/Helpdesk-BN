import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Informasi from './pages/Informasi';
import Histori from './pages/Histori';
import BuatPengaduan from './pages/BuatPengaduan';
import FormPengaduan from './pages/FormPengaduan';
import CekStatus from './pages/CekStatus';
import FAQ from './pages/FAQ';
import Panduan from './pages/Panduan';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Laporan from './pages/admin/Laporan';
import AdminLayout from './components/layout/AdminLayout';
import { AuthProvider, useAuth } from './context/AuthContext';

// Temporary ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/buat-pengaduan" element={<Layout><BuatPengaduan /></Layout>} />
          <Route path="/buat-pengaduan/:kategori" element={<Layout><FormPengaduan /></Layout>} />
          <Route path="/informasi" element={<Layout><Informasi /></Layout>} />
          <Route path="/histori" element={<Layout><Histori /></Layout>} />
          <Route path="/cek-status" element={<Layout><CekStatus /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/panduan" element={<Layout><Panduan /></Layout>} />

          {/* Admin Routes (No Layout or Different Layout) */}
          <Route path="/admin-login" element={<Login />} />

          {/* Protected Admin Dashboard */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/laporan" element={
            <ProtectedRoute>
              <AdminLayout>
                <Laporan />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Layout><div className="text-center py-20 text-gray-600">Page not found</div></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
