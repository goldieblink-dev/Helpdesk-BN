import React, { useState, useEffect } from 'react';
import { Calendar, Printer, Download, Filter, FileText, Image as ImageIcon, ExternalLink, X } from 'lucide-react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { API_BASE_URL, STORAGE_BASE_URL } from '../../api/config';

const Laporan = () => {

  // Default to current month/year
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Evidence Modal State
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [selectedTicketNumber, setSelectedTicketNumber] = useState('');

  // Fetch all tickets from database
  useEffect(() => {
    fetchTickets();
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

      // Format data untuk display
      const formattedData = ticketsData.map(ticket => ({
        id: ticket.id,
        nomor_tiket: ticket.nomor_tiket,
        nama: ticket.pelapor?.nama || 'Unknown',
        jabatan: ticket.pelapor?.jabatan || '-',
        kategori: ticket.kategori?.nama || 'Unknown',
        jenisPermasalahan: ticket.jenis_permasalahan?.nama || 'Unknown',
        deskripsi: ticket.deskripsi,
        status: ticket.status,
        tanggal: ticket.tanggal,
        lampiran: ticket.lampiran || []
      }));

      setAllTickets(formattedData);
      setError('');
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Gagal memuat data laporan');
      setAllTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter Data Logic
  const filteredData = allTickets.filter(ticket => {
    const ticketDate = new Date(ticket.tanggal);
    return (
      ticketDate.getMonth() + 1 === parseInt(selectedMonth) &&
      ticketDate.getFullYear() === parseInt(selectedYear)
    );
  });

  // Calculate Stats for Report
  const totalTickets = filteredData.length;
  const resolvedTickets = filteredData.filter(t => t.status === 'selesai').length;
  const completionRate = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diexport pada periode ini.");
      return;
    }

    // Format data for Excel
    const dataToExport = filteredData.map((item, index) => ({
      "No": index + 1,
      "Tanggal": new Date(item.tanggal).toLocaleDateString('id-ID'),
      "ID Tiket": item.nomor_tiket,
      "Pelapor": item.nama,
      "Jabatan": item.jabatan,
      "Kategori": item.kategori,
      "Masalah": item.jenisPermasalahan,
      "Deskripsi": item.deskripsi,
      "Status": item.status.charAt(0).toUpperCase() + item.status.slice(1),
      "Bukti": item.lampiran.length > 0 ? `${item.lampiran.length} file` : '-'
    }));

    // Create Worksheet
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // Auto-width columns
    const wscols = [
      { wch: 5 }, // No
      { wch: 15 }, // Tanggal
      { wch: 20 }, // ID Tiket
      { wch: 20 }, // Pelapor
      { wch: 10 }, // Jabatan
      { wch: 15 }, // Kategori
      { wch: 25 }, // Masalah
      { wch: 40 }, // Deskripsi
      { wch: 10 }, // Status
      { wch: 10 }  // Bukti
    ];
    ws['!cols'] = wscols;

    // Create Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");

    // Save File
    const monthName = months.find(m => m.value == selectedMonth)?.label;
    const fileName = `Laporan_HelpDesk_${monthName}_${selectedYear}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const handleEvidenceClick = (ticket) => {
    setSelectedTicketNumber(ticket.nomor_tiket);
    setSelectedEvidence(ticket.lampiran || []);
    setIsEvidenceModalOpen(true);
  };

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i); // Display 2 years back and 2 years forward

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Loading State */}
      {loading && (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Memuat data laporan...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (
        <>

          {/* Header & Controls (Hidden when printing) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Laporan Bulanan</h1>
              <p className="text-gray-500">Rekapitulasi pengaduan dan kinerja help desk.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Printer className="h-4 w-4" />
                Cetak
              </button>

              {/* Export Excel Button */}
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" />
                Export Excel
              </button>
            </div>
          </div>

          {/* Filter Section (Hidden when printing) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center print:hidden">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <Filter className="h-4 w-4" />
              Filter Periode:
            </div>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {months.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Report Content (Visible in Print) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden print:shadow-none print:border-none">

            {/* Report Header for Print */}
            <div className="hidden print:block text-center p-8 border-b border-gray-200">
              <h1 className="text-3xl font-bold mb-2">Laporan Bulanan Help Desk</h1>
              <p className="text-lg text-gray-600">SMK Bakti Nusantara 666</p>
              <p className="mt-4 font-medium">Periode: {months.find(m => m.value == selectedMonth)?.label} {selectedYear}</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b border-gray-100 print:hidden">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 print:border-gray-300">
                <h3 className="text-blue-800 text-sm font-medium mb-1">Total Pengaduan</h3>
                <p className="text-2xl font-bold text-blue-900">{totalTickets}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 print:border-gray-300">
                <h3 className="text-green-800 text-sm font-medium mb-1">Diselesaikan</h3>
                <p className="text-2xl font-bold text-green-900">{resolvedTickets}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 print:border-gray-300">
                <h3 className="text-purple-800 text-sm font-medium mb-1">Tingkat Penyelesaian</h3>
                <p className="text-2xl font-bold text-purple-900">{completionRate}%</p>
              </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto p-6">
              <h2 className="text-lg font-bold mb-4 print:hidden">Rincian Data</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider print:bg-gray-100">
                    <th className="p-3 border-b font-semibold">Tanggal</th>
                    <th className="p-3 border-b font-semibold">ID Tiket</th>
                    <th className="p-3 border-b font-semibold">Pelapor</th>
                    <th className="p-3 border-b font-semibold">Jabatan</th>
                    <th className="p-3 border-b font-semibold">Masalah & Bukti</th>
                    <th className="p-3 border-b font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredData.length > 0 ? (
                    filteredData.map((ticket, index) => (
                      <tr key={ticket.id} className="border-b border-gray-50 last:border-b-0 print:border-gray-200">
                        <td className="p-3 text-gray-600 align-top">
                          {new Date(ticket.tanggal).toLocaleDateString('id-ID')}
                        </td>
                        <td className="p-3 font-medium text-gray-900 align-top">{ticket.nomor_tiket}</td>
                        <td className="p-3 text-gray-800 align-top">
                          <div>{ticket.nama}</div>
                          <div className="text-xs text-gray-500">{ticket.kategori}</div>
                        </td>
                        <td className="p-3 text-gray-600 align-top">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold capitalize">{ticket.jabatan}</span>
                        </td>
                        <td className="p-3 text-gray-600 max-w-xs align-top">
                          <span className="block font-medium text-gray-900 mb-1">{ticket.jenisPermasalahan}</span>
                          <div className="text-xs text-gray-500 mb-2 truncate print:whitespace-normal">{ticket.deskripsi}</div>

                          {/* Evidence Link (Hidden in print if needed, or shown as text) */}
                          {ticket.lampiran && ticket.lampiran.length > 0 ? (
                            <button
                              onClick={() => handleEvidenceClick(ticket)}
                              className="print:hidden text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium px-2 py-1 bg-purple-50 rounded-md border border-purple-100"
                            >
                              <ImageIcon className="h-3 w-3" />
                              Lihat Bukti ({ticket.lampiran.length})
                            </button>
                          ) : (
                            <span className="print:hidden text-xs flex items-center gap-1 text-gray-400 italic px-2 py-1">
                              <ImageIcon className="h-3 w-3" /> Tidak ada
                            </span>
                          )}
                          <span className="hidden print:inline text-xs text-gray-500">
                            {ticket.lampiran && ticket.lampiran.length > 0 ? `(${ticket.lampiran.length} Lampiran)` : ''}
                          </span>
                        </td>
                        <td className="p-3 align-top">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold print:border print:border-gray-300 ${ticket.status === 'selesai' ? 'bg-green-100 text-green-800' :
                            ticket.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                              ticket.status === 'ditolak' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-gray-500 italic">
                        Tidak ada data pengaduan pada periode ini.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer for Print */}
            <div className="hidden print:block p-8 mt-8">
              <div className="flex justify-between text-sm text-gray-600">
                <div>
                  <p>Dicetak pada: {new Date().toLocaleDateString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="mb-16">Mengetahui,</p>
                  <p className="font-bold underline">Kepala Lab. Komputer</p>
                </div>
              </div>
            </div>

          </div>
        </>
      )}

      {/* Evidence Modal */}
      {isEvidenceModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm print:hidden">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-purple-600" />
                Bukti Lampiran - {selectedTicketNumber}
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

    </div>
  );
};

export default Laporan;
