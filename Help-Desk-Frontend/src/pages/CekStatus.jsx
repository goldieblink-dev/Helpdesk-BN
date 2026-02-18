import React, { useState } from 'react';
import { Search, Clock, CheckCircle, AlertCircle, Loader, Server, Globe, Wifi, Monitor, X, Copy, Check, ArrowRight } from 'lucide-react';
import axios from 'axios';

import { API_BASE_URL } from '../api/config';

const categoryIcon = {
  "Server": <Server className="h-4 w-4 text-blue-600" />,
  "Website": <Globe className="h-4 w-4 text-green-600" />,
  "Internet": <Wifi className="h-4 w-4 text-purple-600" />,
  "Lab. Komputer": <Monitor className="h-4 w-4 text-orange-600" />,
};

const statusConfig = {
  menunggu: {
    label: "Menunggu",
    icon: <Clock className="h-4 w-4" />,
    className: "bg-yellow-50 text-yellow-700 border-yellow-200"
  },
  diproses: {
    label: "Diproses",
    icon: <Loader className="h-4 w-4" />,
    className: "bg-blue-50 text-blue-700 border-blue-200"
  },
  selesai: {
    label: "Selesai",
    icon: <CheckCircle className="h-4 w-4" />,
    className: "bg-green-50 text-green-700 border-green-200"
  },
  ditolak: {
    label: "Ditolak",
    icon: <AlertCircle className="h-4 w-4" />,
    className: "bg-red-50 text-red-700 border-red-200"
  }
};

const CekStatus = () => {
  const [searchType, setSearchType] = useState('nomor_tiket');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Mohon masukkan nomor tiket atau nomor telepon');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      let endpoint = '';

      if (searchType === 'nomor_tiket') {
        // Search by ticket number
        endpoint = `${API_BASE_URL}/tiket/${searchQuery.trim()}`;
        const response = await axios.get(endpoint);

        if (response.data.success && response.data.data) {
          setResults([response.data.data]);
        } else {
          setError('Tiket tidak ditemukan');
          setResults([]);
        }
      } else if (searchType === 'no_telepon') {
        // Search by phone number
        endpoint = `${API_BASE_URL}/tiket/search/by-phone/${searchQuery.trim()}`;
        const response = await axios.get(endpoint);

        if (response.data.success && response.data.data) {
          setResults(Array.isArray(response.data.data) ? response.data.data : [response.data.data]);
        } else {
          setError('Tidak ada tiket ditemukan untuk nomor telepon tersebut');
          setResults([]);
        }
      }

      setHasSearched(true);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Data tidak ditemukan');
      } else if (err.response?.status === 422) {
        setError('Format input tidak valid');
      } else {
        setError('Gagal mencari data, silakan coba lagi');
      }
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setSearchType('nomor_tiket');
    setResults([]);
    setHasSearched(false);
    setError('');
    setSelectedTicket(null);
  };

  const handleCopyId = (e, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Cek Status Pengaduan</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ketikkan nomor tiket atau nomor telepon Anda untuk melihat status pengaduan terbaru.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Type Selection */}
            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="nomor_tiket"
                  checked={searchType === 'nomor_tiket'}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchQuery('');
                    setError('');
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700 font-medium">Cari Berdasarkan Nomor Tiket</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="searchType"
                  value="no_telepon"
                  checked={searchType === 'no_telepon'}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    setSearchQuery('');
                    setError('');
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700 font-medium">Cari Berdasarkan Nomor Telepon</span>
              </label>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setError('');
                }}
                placeholder={
                  searchType === 'nomor_tiket'
                    ? 'Contoh: BN-15022026-00001'
                    : 'Contoh: 081234567890'
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Mencari...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5" />
                    Cari Status
                  </>
                )}
              </button>

              {hasSearched && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {hasSearched && (
          <>
            {results.length > 0 ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Hasil Pencarian ({results.length} tiket)
                </h2>

                {results.map((ticket) => (
                  <div
                    key={ticket.id || ticket.nomor_tiket}
                    onClick={() => setSelectedTicket(ticket)}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer border-l-4 border-blue-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{ticket.nomor_tiket}</h3>
                          <button
                            onClick={(e) => handleCopyId(e, ticket.nomor_tiket)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            title="Salin nomor tiket"
                          >
                            {copiedId === ticket.nomor_tiket ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Kategori</p>
                            <div className="flex items-center gap-2">
                              {categoryIcon[ticket.kategori?.nama] || <AlertCircle className="h-4 w-4" />}
                              <span className="font-semibold text-gray-900">{ticket.kategori?.nama || 'N/A'}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">Jenis Permasalahan</p>
                            <p className="font-semibold text-gray-900">{ticket.jenis_permasalahan?.nama || 'N/A'}</p>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${statusConfig[ticket.status]?.className || 'bg-gray-50'}`}>
                              {statusConfig[ticket.status]?.icon}
                              <span className="font-semibold">{statusConfig[ticket.status]?.label || ticket.status}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Pelapor</p>
                            <p>{ticket.pelapor?.nama || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Tanggal Laporan</p>
                            <p>{new Date(ticket.tanggal).toLocaleDateString('id-ID')}</p>
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0 ml-4 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Tiket Tidak Ditemukan</h3>
                <p className="text-gray-600 mb-6">
                  Mohon periksa kembali nomor tiket atau nomor telepon Anda.
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cari Lagi
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Detail Pengaduan</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Ticket Number */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-600 mb-2">Nomor Tiket</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-blue-600">{selectedTicket.nomor_tiket}</p>
                  <button
                    onClick={(e) => handleCopyId(e, selectedTicket.nomor_tiket)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {copiedId === selectedTicket.nomor_tiket ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-600 mb-2">Status Saat Ini</p>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${statusConfig[selectedTicket.status]?.className || 'bg-gray-50'} w-fit`}>
                  {statusConfig[selectedTicket.status]?.icon}
                  <span className="font-bold text-lg">{statusConfig[selectedTicket.status]?.label || selectedTicket.status}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="border-b pb-4">
                <p className="text-sm font-semibold text-gray-600 mb-4">Timeline Status</p>
                <div className="space-y-3">
                  {selectedTicket.status === 'ditolak' ? (
                    <>
                      {[
                        { status: 'menunggu', completed: true },
                        { status: 'ditolak', completed: true }
                      ].map((item, idx) => (
                        <div key={item.status} className="flex items-center gap-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${item.status === 'ditolak' ? 'bg-red-600' : 'bg-green-600'}`}>
                            {item.status === 'ditolak' ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{statusConfig[item.status]?.label}</p>
                            <p className="text-sm text-gray-600">
                              {item.status === 'ditolak' ? 'Pengaduan ditolak' : 'Selesai'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    ['menunggu', 'diproses', 'selesai'].map((status, idx) => {
                      const isCompleted =
                        (status === 'menunggu') ||
                        (status === 'diproses' && ['diproses', 'selesai'].includes(selectedTicket.status)) ||
                        (status === 'selesai' && selectedTicket.status === 'selesai');

                      return (
                        <div key={status} className="flex items-center gap-4">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${isCompleted ? 'bg-green-600' : 'bg-gray-300'}`}>
                            {isCompleted && <Check className="h-5 w-5" />}
                            {!isCompleted && idx + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{statusConfig[status]?.label}</p>
                            <p className="text-sm text-gray-600">
                              {isCompleted ? 'Selesai' : 'Menunggu'}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Kategori & Jenis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Kategori</p>
                  <div className="flex items-center gap-2">
                    {categoryIcon[selectedTicket.kategori?.nama]}
                    <p className="font-semibold text-gray-900">{selectedTicket.kategori?.nama}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Jenis Permasalahan</p>
                  <p className="font-semibold text-gray-900">{selectedTicket.jenis_permasalahan?.nama}</p>
                </div>
              </div>

              {/* Pelapor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nama Pelapor</p>
                  <p className="font-semibold text-gray-900">{selectedTicket.pelapor?.nama}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nomor Telepon</p>
                  <p className="font-semibold text-gray-900">{selectedTicket.pelapor?.no_telepon}</p>
                </div>
              </div>

              {/* Location & Description */}
              <div className="border-b pb-4">
                <p className="text-sm text-gray-600 mb-2">Lokasi Gedung</p>
                <p className="font-semibold text-gray-900 mb-4">{selectedTicket.lokasi_gedung}</p>
              </div>

              <div className="border-b pb-4">
                <p className="text-sm text-gray-600 mb-2">Deskripsi Pengaduan</p>
                <p className="text-gray-900">{selectedTicket.deskripsi}</p>
              </div>

              {/* Admin Notes */}
              {selectedTicket.catatan_admin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Catatan dari Admin</p>
                  <p className="text-blue-800">{selectedTicket.catatan_admin}</p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold mb-1">Tanggal Laporan</p>
                  <p>{new Date(selectedTicket.tanggal).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Dibuat Pada</p>
                  <p>{new Date(selectedTicket.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CekStatus;
