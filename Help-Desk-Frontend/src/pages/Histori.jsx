import React, { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle, AlertCircle, Loader, Server, Globe, Wifi, Monitor, X, Copy, Check } from 'lucide-react';
import axios from 'axios';

import { API_BASE_URL } from '../api/config';

const categoryIcon = {
  "Server": <Server className="h-4 w-4 text-blue-600" />,
  "Website": <Globe className="h-4 w-4 text-green-600" />,
  "Internet": <Wifi className="h-4 w-4 text-purple-600" />,
  "Lab. Komputer": <Monitor className="h-4 w-4 text-orange-600" />
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

const Histori = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('noTelepon');
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchTickets = async (query, type) => {
    try {
      setLoading(true);
      setError('');

      let endpoint;
      if (type === 'noTelepon') {
        endpoint = `${API_BASE_URL}/tiket/search/by-phone/${query.trim()}`;
      } else {
        endpoint = `${API_BASE_URL}/tiket/${query.trim()}`;
      }

      const response = await axios.get(endpoint);

      let ticketsData = [];
      if (Array.isArray(response.data.data)) {
        ticketsData = response.data.data;
      } else if (response.data.data && !Array.isArray(response.data.data)) {
        ticketsData = [response.data.data];
      } else if (Array.isArray(response.data)) {
        ticketsData = response.data;
      }

      const formattedData = ticketsData.map(ticket => ({
        id: ticket.nomor_tiket,
        nomor_tiket: ticket.nomor_tiket,
        nama: ticket.pelapor?.nama || 'Unknown',
        noTelepon: ticket.pelapor?.no_telepon || '-',
        jabatan: ticket.pelapor?.jabatan || '-',
        kategori: ticket.kategori?.nama || 'Unknown',
        jenisPermasalahan: ticket.jenis_permasalahan?.nama || 'Unknown',
        deskripsi: ticket.deskripsi,
        status: ticket.status,
        tanggal: ticket.tanggal,
        alasan_penolakan: ticket.alasan_penolakan
      }));

      setAllTickets(formattedData);
    } catch (err) {
      if (err.response?.status === 404) {
        setAllTickets([]);
        setError('Pengaduan tidak ditemukan. Pastikan No. Telepon atau No. Tiket sudah benar.');
      } else {
        console.error('Error searching tickets:', err);
        setError('Gagal mencari data pengaduan');
        setAllTickets([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const displayData = allTickets;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setHasSearched(true);
    searchTickets(searchQuery, searchType);
  };

  const handleReset = () => {
    setSearchQuery('');
    setHasSearched(false);
    setAllTickets([]);
    setError('');
  };

  const handleCopyId = (e, id) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Riwayat Pengaduan</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Cari dan pantau status pengaduan Anda menggunakan No. Telepon atau No. Tiket yang diberikan saat membuat laporan.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading && (
          <div className="bg-white p-8 rounded-2xl text-center border border-gray-100">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Memuat data pengaduan...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 p-4 rounded-2xl border border-red-200 text-red-700">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Cari Pengaduan Anda</h2>
              <p className="text-sm text-gray-500 mb-6">Masukkan No. Telepon atau No. Tiket Pengaduan Anda.</p>

              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <select
                  value={searchType}
                  onChange={(e) => { setSearchType(e.target.value); setSearchQuery(''); setHasSearched(false); }}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700 font-medium sm:w-48 flex-shrink-0"
                >
                  <option value="noTelepon">No. Telepon</option>
                  <option value="id">No. Tiket</option>
                </select>

                <div className="relative flex-grow">
                  <input
                    type={searchType === 'noTelepon' ? 'tel' : 'text'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchType === 'noTelepon' ? 'Masukkan No. Telepon, contoh: 08123456789' : 'Masukkan No. Tiket, contoh: TKT-20260201-001'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <Search className="h-5 w-5" /> Cari
                </button>

                {hasSearched && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    Tampilkan Semua
                  </button>
                )}
              </form>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {hasSearched
                  ? `Ditemukan ${displayData.length} pengaduan`
                  : 'Hasil Pencarian'
                }
              </h3>
              {hasSearched && (
                <span className="text-sm text-gray-500">
                  {searchType === 'noTelepon' ? 'No. Telepon' : 'No. Tiket'}: <strong className="text-gray-700">{searchQuery}</strong>
                </span>
              )}
            </div>

            {!hasSearched ? (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">Masukkan No. Telepon atau No. Tiket</p>
                <p className="text-gray-400 text-sm mt-1">untuk melihat riwayat pengaduan Anda</p>
              </div>
            ) : displayData.length > 0 ? (
              <>
                <div className="hidden md:block bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">No. Tiket</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Nama</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Jabatan</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Kategori</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Permasalahan</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Tanggal</th>
                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayData.map((item, index) => {
                        const status = statusConfig[item.status];
                        return (
                          <tr
                            key={index}
                            onClick={() => setSelectedTicket(item)}
                            className="border-b border-gray-100 last:border-b-0 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-semibold text-blue-600">{item.id}</span>
                                <button
                                  onClick={(e) => handleCopyId(e, item.id)}
                                  className="p-1 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors opacity-0 group-hover:opacity-100"
                                  title="Salin No. Tiket"
                                >
                                  {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                                </button>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-gray-900">{item.nama}</span>
                              <p className="text-xs text-gray-400 mt-0.5">{item.noTelepon}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold capitalize">{item.jabatan}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                {categoryIcon[item.kategori]}
                                <span className="text-sm text-gray-700">{item.kategori}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-700">{item.jenisPermasalahan}</span>
                              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{item.deskripsi}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-600">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${status.className}`}>
                                {status.icon} {status.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-4">
                  {displayData.map((item, index) => {
                    const status = statusConfig[item.status];
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedTicket(item)}
                        className="bg-white rounded-xl shadow-md border border-gray-100 p-5 cursor-pointer active:scale-[0.99] transition-transform"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold text-blue-600">{item.id}</span>
                            <button
                              onClick={(e) => handleCopyId(e, item.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                            >
                              {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${status.className}`}>
                            {status.icon} {status.label}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900">{item.nama} <span className="text-gray-400 font-normal">• {item.noTelepon}</span></p>
                          <p className="text-xs text-gray-600 mb-2"><span className="font-semibold text-gray-700">Jabatan:</span> <span className="capitalize font-medium">{item.jabatan}</span></p>
                          <div className="flex items-center gap-2">
                            {categoryIcon[item.kategori]}
                            <span className="text-sm font-medium text-gray-700">{item.kategori}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-sm text-gray-600">{item.jenisPermasalahan}</span>
                          </div>
                          <p className="text-sm text-gray-500">{item.deskripsi}</p>
                          <p className="text-xs text-gray-400">{new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Pengaduan Tidak Ditemukan</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Tidak ditemukan pengaduan dengan {searchType === 'noTelepon' ? 'No. Telepon' : 'No. Tiket'} "<strong>{searchQuery}</strong>".
                  Pastikan data yang Anda masukkan sesuai dengan yang digunakan saat membuat pengaduan.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 px-4 bg-gray-900/50 backdrop-blur-sm" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Detail Pengaduan</h2>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">No. Tiket</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono font-bold text-blue-600">{selectedTicket.id}</span>
                    <button
                      onClick={(e) => handleCopyId(e, selectedTicket.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                      title="Salin No. Tiket"
                    >
                      {copiedId === selectedTicket.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-full border ${statusConfig[selectedTicket.status].className}`}>
                    {statusConfig[selectedTicket.status].icon} {statusConfig[selectedTicket.status].label}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Nama Pelapor</p>
                    <p className="font-medium text-gray-900">{selectedTicket.nama}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">No. Telepon</p>
                    <p className="font-medium text-gray-900">{selectedTicket.noTelepon}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Jabatan / Status</p>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold capitalize inline-block">{selectedTicket.jabatan}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tanggal Laporan</p>
                    <p className="font-medium text-gray-900">{new Date(selectedTicket.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Kategori</p>
                  <div className="flex items-center gap-2">
                    {categoryIcon[selectedTicket.kategori]}
                    <p className="font-medium text-gray-900">{selectedTicket.kategori}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Jenis Permasalahan</p>
                  <p className="font-medium text-gray-900">{selectedTicket.jenisPermasalahan}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Deskripsi Masalah</p>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-700 text-sm leading-relaxed">
                    {selectedTicket.deskripsi}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Histori;
