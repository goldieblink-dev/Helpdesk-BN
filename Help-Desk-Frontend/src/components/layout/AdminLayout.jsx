import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, X, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../api/config';

const AdminLayout = ({ children }) => {
  /* Change Password State */
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    password_lama: '',
    password_baru: '',
    password_baru_confirmation: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);


  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.password_baru !== passwordForm.password_baru_confirmation) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_BASE_URL}/admin/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password_lama: passwordForm.password_lama,
          password_baru: passwordForm.password_baru,
          password_baru_confirmation: passwordForm.password_baru_confirmation
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password berhasil diubah! Silakan login kembali.");
        setIsPasswordModalOpen(false);
        logout();
      } else {
        alert(data.message || "Gagal mengubah password");
      }
    } catch (error) {
      console.error('Change password error:', error);
      alert("Terjadi kesalahan saat mengubah password");
    } finally {
      setPasswordLoading(false);
      setPasswordForm({
        password_lama: '',
        password_baru: '',
        password_baru_confirmation: ''
      });
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for Desktop */}
      <aside className={`hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-full fixed left-0 top-0 z-20 print:hidden`}>
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800">Admin Panel</span>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>

          <Link
            to="/admin/laporan"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/laporan') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FileText className="h-5 w-5" />
            Laporan
          </Link>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 w-full text-left`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Ganti Password
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-900/50 z-30 md:hidden print:hidden" onClick={toggleSidebar}></div>
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed md:hidden inset-y-0 left-0 w-64 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} print:hidden`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-800">Admin Panel</span>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            onClick={toggleSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            to="/admin/laporan"
            onClick={toggleSidebar}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/laporan') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FileText className="h-5 w-5" />
            Laporan
          </Link>
          <button
            onClick={() => { setIsPasswordModalOpen(true); toggleSidebar(); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 w-full text-left`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            Ganti Password
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors mt-auto"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden print:ml-0 print:h-auto print:overflow-visible">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10 sticky top-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-800">Admin Panel</span>
          </div>
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-blue-600 p-2 rounded-lg bg-gray-50">
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 print:p-0 print:overflow-visible">
          {children}
        </div>
      </main>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Ganti Password</h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Password Lama</label>
                <input
                  type="password"
                  value={passwordForm.password_lama}
                  onChange={(e) => setPasswordForm({ ...passwordForm, password_lama: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password Baru</label>
                <input
                  type="password"
                  value={passwordForm.password_baru}
                  onChange={(e) => setPasswordForm({ ...passwordForm, password_baru: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  value={passwordForm.password_baru_confirmation}
                  onChange={(e) => setPasswordForm({ ...passwordForm, password_baru_confirmation: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors shadow-sm"
                >
                  {passwordLoading ? 'Menyimpan...' : 'Simpan Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
