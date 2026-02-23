import React, { useState, useEffect } from 'react';
import { Clock, Loader, CheckCircle, Search, Filter, MoreVertical, X, Save, Plus, Image as ImageIcon, ExternalLink, FileText, Trash2 } from 'lucide-react';
import axios from 'axios';

import { API_BASE_URL, STORAGE_BASE_URL } from '../../api/config';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [problemTypes, setProblemTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editReason, setEditReason] = useState('');

  // Create Form State
  const [createForm, setCreateForm] = useState({
    nama: '',
    no_telepon: '',
    jabatan: 'siswa',
    kategori_id: '',
    jenis_permasalahan_id: '',
    deskripsi: '',
    lokasi_gedung: '',
    link_url: ''
  });
  const [createFiles, setCreateFiles] = useState([]);

  // Fetch Data
  useEffect(() => {
    fetchTickets();
    fetchCategories();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/tiket`);

      // Handle paginated or direct array response
      let ticketsData = [];
      if (Array.isArray(response.data.data)) {
        ticketsData = response.data.data;
      } else if (response.data.data?.data && Array.isArray(response.data.data.data)) {
        // If paginated (Laravel pagination)
        ticketsData = response.data.data.data;
      } else if (Array.isArray(response.data)) {
        ticketsData = response.data;
      }

      // Format untuk display
      const formattedData = ticketsData.map(ticket => ({
        id: ticket.id,
        nomor_tiket: ticket.nomor_tiket,
        nama: ticket.pelapor?.nama || 'Unknown',
        no_telepon: ticket.pelapor?.no_telepon || '-',
        jabatan: ticket.pelapor?.jabatan || '-',
        kategori: ticket.kategori?.nama || 'Unknown',
        kategori_id: ticket.kategori_id,
        jenis_permasalahan: ticket.jenis_permasalahan?.nama || 'Unknown',
        deskripsi: ticket.deskripsi,
        status: ticket.status,
        tanggal: ticket.tanggal,
        lokasi_gedung: ticket.lokasi_gedung,
        link_url: ticket.link_url,
        catatan_admin: ticket.catatan_admin,
        alasan_penolakan: ticket.alasan_penolakan,
        lampiran: ticket.lampiran || []
      }));

      setTickets(formattedData);
      setError('');
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Gagal memuat data tiket');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/kategori`);
      let cats = [];

      // Handle different response formats
      if (Array.isArray(response.data.data)) {
        cats = response.data.data;
      } else if (Array.isArray(response.data)) {
        cats = response.data;
      } else if (response.data.data?.data && Array.isArray(response.data.data.data)) {
        cats = response.data.data.data;
      }

      setCategories(cats);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    }
  };

  const fetchProblemTypes = async (kategoriId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/kategori/${kategoriId}/jenis-permasalahan`);
      let types = [];

      // Handle different response formats
      if (Array.isArray(response.data.data)) {
        types = response.data.data;
      } else if (Array.isArray(response.data)) {
        types = response.data;
      } else if (response.data.data?.data && Array.isArray(response.data.data.data)) {
        types = response.data.data.data;
      }

      setProblemTypes(types);
    } catch (err) {
      console.error('Error fetching problem types:', err);
      setProblemTypes([]);
    }
  };

  const handleCategoryChange = (e) => {
    const kategoriId = e.target.value;
    setCreateForm({ ...createForm, kategori_id: kategoriId });
    if (kategoriId) {
      fetchProblemTypes(kategoriId);
    } else {
      setProblemTypes([]);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    if (!createForm.nama || !createForm.no_telepon || !createForm.kategori_id || !createForm.jenis_permasalahan_id || !createForm.deskripsi) {
      alert('Mohon isi semua field yang wajib!');
      return;
    }

    try {
      setLoading(true);

      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('nama', createForm.nama);
      formDataToSend.append('no_telepon', createForm.no_telepon);
      formDataToSend.append('jabatan', createForm.jabatan);
      formDataToSend.append('kategori_id', parseInt(createForm.kategori_id));
      formDataToSend.append('jenis_permasalahan_id', parseInt(createForm.jenis_permasalahan_id));
      formDataToSend.append('deskripsi', createForm.deskripsi);

      if (createForm.lokasi_gedung) formDataToSend.append('lokasi_gedung', createForm.lokasi_gedung);
      if (createForm.link_url) formDataToSend.append('link_url', createForm.link_url);

      // Add files if any
      createFiles.forEach((file, index) => {
        formDataToSend.append(`files[${index}]`, file);
      });

      const tiketResponse = await axios.post(`${API_BASE_URL}/tiket`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Tiket berhasil dibuat: ' + tiketResponse.data.data.nomor_tiket);
      setIsCreateModalOpen(false);
      setCreateForm({
        nama: '',
        no_telepon: '',
        jabatan: 'siswa',
        kategori_id: '',
        jenis_permasalahan_id: '',
        deskripsi: '',
        lokasi_gedung: '',
        link_url: ''
      });
      setCreateFiles([]);
      setProblemTypes([]);
      fetchTickets();
    } catch (err) {
      console.error('Error creating ticket:', err);
      const errorMsg = err.response?.data?.message || err.response?.data?.errors || err.message;
      console.error('Full error:', err.response?.data);
      alert('Gagal membuat tiket: ' + JSON.stringify(errorMsg));
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (ticket) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status);
    setEditNotes(ticket.catatan_admin || '');
    setEditReason(ticket.alasan_penolakan || '');
    setIsEditModalOpen(true);
  };

  const handleEvidenceClick = (ticket) => {
    setSelectedTicket(ticket);
    setSelectedEvidence(ticket.lampiran || []);
    setIsEvidenceModalOpen(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedTicket) return;

    // Validate: ditolak status requires reason
    if (editStatus === 'ditolak' && !editReason.trim()) {
      alert('Alasan penolakan harus diisi!');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`${API_BASE_URL}/tiket/${selectedTicket.id}/status`, {
        status: editStatus,
        catatan_admin: editNotes,
        alasan_penolakan: editStatus === 'ditolak' ? editReason : null
      });

      alert('Status tiket berhasil diupdate');
      setIsEditModalOpen(false);
      setSelectedTicket(null);
      setEditReason('');
      fetchTickets();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Gagal mengupdate status: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (ticket) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus tiket ${ticket.nomor_tiket}?\n\nTindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/tiket/${ticket.nomor_tiket}`);
      alert('Tiket berhasil dihapus');
      fetchTickets();
    } catch (err) {
      console.error('Error deleting ticket:', err);
      alert('Gagal menghapus tiket: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Stats Calculation
  const totalTickets = tickets.length;
  const waitingTickets = tickets.filter(t => t.status === 'menunggu').length;
  const processTickets = tickets.filter(t => t.status === 'diproses').length;
  const doneTickets = tickets.filter(t => t.status === 'selesai').length;

  // Filter Logic
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = ticket.nomor_tiket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.nama.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusColors = {
    menunggu: "bg-yellow-100 text-yellow-800 border-yellow-200",
    diproses: "bg-blue-100 text-blue-800 border-blue-200",
    selesai: "bg-green-100 text-green-800 border-green-200",
    ditolak: "bg-red-100 text-red-800 border-red-200"
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Tiket</h3>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Filter className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalTickets}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Menunggu</h3>
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{waitingTickets}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Diproses</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Loader className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{processTickets}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Selesai</h3>
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{doneTickets}</p>
        </div>
      </div>

      {/* Ticket Management Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">Daftar Pengaduan Masuk</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Create Ticket Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" /> Buat Tiket Baru
            </button>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari ID / Nama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold border-b border-gray-100">ID Tiket</th>
                <th className="p-4 font-semibold border-b border-gray-100">Pelapor</th>
                <th className="p-4 font-semibold border-b border-gray-100">Masalah & Bukti</th>
                <th className="p-4 font-semibold border-b border-gray-100">Kategori</th>
                <th className="p-4 font-semibold border-b border-gray-100">Status</th>
                <th className="p-4 font-semibold border-b border-gray-100">Tanggal</th>
                <th className="p-4 font-semibold border-b border-gray-100 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0">
                    <td className="p-4 font-medium text-blue-600 align-top">{ticket.nomor_tiket}</td>
                    <td className="p-4 text-gray-800 align-top">
                      <div className="font-medium">{ticket.nama}</div>
                      <div className="text-xs text-gray-500">{ticket.no_telepon}</div>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs mt-1 inline-block capitalize">{ticket.jabatan}</span>
                    </td>
                    <td className="p-4 text-gray-600 align-top max-w-xs">
                      <span className="block font-medium text-gray-800 mb-1">{ticket.jenis_permasalahan}</span>
                      <p className="text-xs text-gray-500 line-clamp-2">{ticket.deskripsi}</p>

                      {/* Evidence Button */}
                      {ticket.lampiran && ticket.lampiran.length > 0 ? (
                        <button
                          onClick={() => handleEvidenceClick(ticket)}
                          className="mt-2 text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium px-2 py-1 bg-purple-50 rounded-md border border-purple-100"
                        >
                          <ImageIcon className="h-3 w-3" />
                          Lihat Bukti ({ticket.lampiran.length})
                        </button>
                      ) : (
                        <span className="mt-2 text-xs flex items-center gap-1 text-gray-400 italic px-2 py-1">
                          <ImageIcon className="h-3 w-3" /> Tidak ada bukti
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-600 align-top">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">{ticket.kategori}</span>
                    </td>
                    <td className="p-4 align-top">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusColors[ticket.status]}`}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 align-top">
                      {new Date(ticket.tanggal).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4 text-right align-top">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(ticket)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Detail / Ubah
                        </button>
                        <button
                          onClick={() => handleDeleteClick(ticket)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                          title="Hapus tiket"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    Tidak ada data tiket yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Status Modal */}
      {isEditModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Update Status Tiket</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Ticket Info Summary */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 font-semibold uppercase">ID Tiket</span>
                  <span className="text-sm font-mono font-bold text-blue-600">{selectedTicket.nomor_tiket}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500 font-semibold uppercase">Masalah</span>
                  <span className="text-sm font-medium text-gray-800">{selectedTicket.jenisPermasalahan}</span>
                </div>
                <p className="text-sm text-gray-600 italic border-t border-gray-200 pt-2 mt-2">
                  "{selectedTicket.deskripsi}"
                </p>
              </div>

              {/* Status Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status Terbaru</label>
                <div className="relative">
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white font-medium text-gray-700"
                  >
                    <option value="menunggu">Menunggu (Pending)</option>
                    <option value="diproses">Diproses (On Progress)</option>
                    <option value="selesai">Selesai (Resolved)</option>
                    <option value="ditolak">Ditolak (Rejected)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Optional Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Catatan Penyelesaian (Opsional)</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Contoh: Kabel LAN sudah diganti baru..."
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                ></textarea>
              </div>

              {/* Alasan Penolakan - Show only when status = ditolak */}
              {editStatus === 'ditolak' && (
                <div className="space-y-2 bg-red-50 p-4 rounded-lg border border-red-200">
                  <label className="text-sm font-medium text-red-900">Alasan Penolakan <span className="text-red-600">*</span></label>
                  <textarea
                    value={editReason}
                    onChange={(e) => setEditReason(e.target.value)}
                    placeholder="Jelaskan alasan mengapa tiket ini ditolak..."
                    rows="3"
                    className="w-full p-3 border border-red-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 text-sm"
                  ></textarea>
                  {!editReason.trim() && (
                    <p className="text-xs text-red-600 font-medium">⚠️ Alasan penolakan harus diisi sebelum menyimpan</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStatus}
                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <Save className="h-4 w-4" /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {isEvidenceModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-600" />
                Bukti Lampiran - {selectedTicket.nomor_tiket}
              </h3>
              <button
                onClick={() => setIsEvidenceModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50">
              {selectedEvidence.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedEvidence.map((file, index) => {
                    const isImage = file.file_name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                    const fileUrl = `${STORAGE_BASE_URL}/${file.file_path}`;

                    return (
                      <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        {isImage ? (
                          <div className="relative group">
                            <img
                              src={fileUrl}
                              alt={file.file_name}
                              className="w-full h-48 object-cover rounded-md bg-gray-100"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-white text-gray-900 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-gray-100"
                              >
                                <ExternalLink className="h-4 w-4" /> Buka Full
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 flex flex-col items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300">
                            <FileText className="h-12 w-12 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500 font-medium">{file.file_name}</span>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" /> Download File
                            </a>
                          </div>
                        )}
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500 truncate max-w-[180px]" title={file.file_name}>{file.file_name}</span>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{(file.file_size / 1024).toFixed(1)} KB</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 font-medium">Tidak ada bukti lampiran</h4>
                  <p className="text-gray-500 text-sm mt-1">Pelapor tidak menyertakan foto atau dokumen saat membuat tiket ini.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
              <button
                onClick={() => setIsEvidenceModalOpen(false)}
                className="px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Buat Tiket Baru</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Nama */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Nama Pelapor *</label>
                  <input
                    type="text"
                    value={createForm.nama}
                    onChange={(e) => setCreateForm({ ...createForm, nama: e.target.value })}
                    placeholder="Nama lengkap"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* No Telepon */}
                <div>
                  <label className="text-sm font-medium text-gray-700">No. Telepon *</label>
                  <input
                    type="tel"
                    value={createForm.no_telepon}
                    onChange={(e) => setCreateForm({ ...createForm, no_telepon: e.target.value })}
                    placeholder="081234567890"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Jabatan */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Jabatan *</label>
                  <select
                    value={createForm.jabatan}
                    onChange={(e) => setCreateForm({ ...createForm, jabatan: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="siswa">Siswa</option>
                    <option value="guru">Guru</option>
                    <option value="masyarakat_sekolah">Masyarakat Sekolah</option>
                  </select>
                </div>

                {/* Kategori */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Kategori *</label>
                  <select
                    value={createForm.kategori_id}
                    onChange={handleCategoryChange}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nama}</option>
                    ))}
                  </select>
                </div>

                {/* Jenis Permasalahan */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Jenis Permasalahan *</label>
                  <select
                    value={createForm.jenis_permasalahan_id}
                    onChange={(e) => setCreateForm({ ...createForm, jenis_permasalahan_id: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={!createForm.kategori_id}
                  >
                    <option value="">-- Pilih Jenis --</option>
                    {problemTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.nama}</option>
                    ))}
                  </select>
                </div>

                {/* Lokasi Gedung */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Lokasi Gedung</label>
                  <input
                    type="text"
                    value={createForm.lokasi_gedung}
                    onChange={(e) => setCreateForm({ ...createForm, lokasi_gedung: e.target.value })}
                    placeholder="Gedung A, Lantai 2"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Link URL */}
                <div>
                  <label className="text-sm font-medium text-gray-700">Link URL</label>
                  <input
                    type="url"
                    value={createForm.link_url}
                    onChange={(e) => setCreateForm({ ...createForm, link_url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="text-sm font-medium text-gray-700">Deskripsi Masalah *</label>
                <textarea
                  value={createForm.deskripsi}
                  onChange={(e) => setCreateForm({ ...createForm, deskripsi: e.target.value })}
                  placeholder="Jelaskan masalah yang terjadi..."
                  rows="4"
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              {/* Upload Files */}
              <div>
                <label className="text-sm font-medium text-gray-700">Lampiran Bukti (Opsional)</label>
                <div className="mt-2 flex flex-col gap-2">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setCreateFiles(Array.from(e.target.files))}
                    className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {createFiles.length > 0 && (
                    <div className="text-xs text-gray-500 italic">
                      {createFiles.length} file dipilih
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors shadow-sm flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> {loading ? 'Membuat...' : 'Buat Tiket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
