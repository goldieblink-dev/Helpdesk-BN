import React, { useState, useEffect } from 'react';
import { Upload, X, Server, Globe, Wifi, Monitor, CheckCircle, Copy, AlertCircle, Loader } from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { API_BASE_URL } from '../api/config';

const categoryInfo = {
  server: {
    title: "Server",
    icon: <Server className="h-6 w-6 text-blue-600" />,
    color: "blue",
  },
  website: {
    title: "Website",
    icon: <Globe className="h-6 w-6 text-green-600" />,
    color: "green",
  },
  internet: {
    title: "Internet",
    icon: <Wifi className="h-6 w-6 text-purple-600" />,
    color: "purple",
  },
  "lab-komputer": {
    title: "Lab. Komputer",
    icon: <Monitor className="h-6 w-6 text-orange-600" />,
    color: "orange",
  }
};

const FormPengaduan = () => {
  const { kategori } = useParams();
  const navigate = useNavigate();
  const category = categoryInfo[kategori];

  const [categories, setCategories] = useState([]);
  const [problemTypes, setProblemTypes] = useState([]);
  const [lokasi, setLokasi] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProblemTypes, setLoadingProblemTypes] = useState(false);
  const [loadingLokasi, setLoadingLokasi] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  const [formData, setFormData] = useState({
    namaLengkap: '',
    jabatan: '',
    noTelepon: '',
    lokasiGedung: '',
    jenisPermasalahan: '',
    linkUrl: '',
    deskripsi: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [copied, setCopied] = useState(false);

  const showLokasi = kategori === 'server' || kategori === 'internet';
  const showLinkUrl = kategori === 'website';
  const problemLabel = kategori === 'lab-komputer' ? 'Lokasi / Ruangan' : 'Jenis Permasalahan';
  const problemPlaceholder = kategori === 'lab-komputer' ? '-- Pilih Lokasi / Ruangan --' : '-- Pilih Jenis Permasalahan --';

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const fetchCategoryDetails = async (categoryId) => {
    // 1. Fetch Jenis Permasalahan
    try {
      setLoadingProblemTypes(true);
      const problemRes = await axios.get(`${API_BASE_URL}/kategori/${categoryId}/jenis-permasalahan`);
      // Check structure: usually data.data or just data
      const problems = Array.isArray(problemRes.data.data) ? problemRes.data.data : [];
      setProblemTypes(problems);
    } catch (err) {
      console.error("Error fetching jenis permasalahan:", err);
      setProblemTypes([]);
    } finally {
      setLoadingProblemTypes(false);
    }

    // 2. Fetch Lokasi (if needed)
    if (showLokasi) {
      try {
        setLoadingLokasi(true);
        const lokasiRes = await axios.get(`${API_BASE_URL}/lokasi/by-kategori/${categoryId}`);
        const lokasiData = Array.isArray(lokasiRes.data.data) ? lokasiRes.data.data : [];
        setLokasi(lokasiData);
      } catch (error) {
        console.error('Error fetching lokasi:', error);
        setLokasi([]);
      } finally {
        setLoadingLokasi(false);
      }
    }
  };

  // Fetch initial data (Categories)
  useEffect(() => {
    if (!category) return;

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesRes = await axios.get(`${API_BASE_URL}/kategori`);
        const categoriesData = Array.isArray(categoriesRes.data.data)
          ? categoriesRes.data.data
          : categoriesRes.data.data?.data || [];

        setCategories(categoriesData);

        // Try to match via slug logic since API might not return slug field directly in list
        const slugToNameMap = {
          'server': 'Server',
          'website': 'Website',
          'internet': 'Internet',
          'lab-komputer': 'Lab Komputer'
        };

        const targetName = slugToNameMap[kategori];
        // Try matching by name first
        let foundCategory = categoriesData.find(c => c.nama.toLowerCase() === targetName.toLowerCase());

        if (!foundCategory && kategori === 'lab-komputer') {
          // Fallback for tricky naming
          foundCategory = categoriesData.find(c => c.nama.toLowerCase().includes('lab'));
        }

        if (foundCategory) {
          setCurrentCategory(foundCategory);
          // Now fetch specific data for this category
          fetchCategoryDetails(foundCategory.id);
        } else {
          console.warn("Category not found in list, trying fallback or slug endpoint...");
          // Fallback: try fetching by slug if the list didn't help
          try {
            const bySlugRes = await axios.get(`${API_BASE_URL}/kategori/by-slug/${kategori}`);
            if (bySlugRes.data && bySlugRes.data.data) {
              foundCategory = bySlugRes.data.data;
              setCurrentCategory(foundCategory);
              fetchCategoryDetails(foundCategory.id);
            }
          } catch (err) {
            console.error("Failed to fetch category by slug", err);
          }
        }

      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [category, kategori]);


  // Redirect if category not found in our static map
  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kategori tidak ditemukan</h2>
          <button onClick={() => navigate('/buat-pengaduan')} className="text-blue-600 hover:underline">
            Kembali ke pilih kategori
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const maxFileSize = 2 * 1024 * 1024; // 2MB in bytes
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxFiles = 5;

    // Validate and filter files
    const validFiles = selectedFiles.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} tidak didukung. Hanya JPG, PNG, dan PDF yang diperbolehkan.`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`File ${file.name} terlalu besar. Ukuran maksimal adalah 2MB.`);
        return false;
      }
      return true;
    });

    // Update files list (max 5 files)
    const newFiles = [...files, ...validFiles].slice(0, maxFiles);
    setFiles(newFiles);

    // Revoke old Object URLs to prevent memory leak
    previews.forEach(url => URL.revokeObjectURL(url));

    // Create new previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const removeFile = (index) => {
    // Revoke the removed file's Object URL
    URL.revokeObjectURL(previews[index]);
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const generateTicketId = () => {
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `TKT-${dateStr}-${random}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      if (!currentCategory) {
        throw new Error('Data kategori belum dimuat. Silakan refresh halaman.');
      }

      // Get jenis_permasalahan_id from selected value
      // formData.jenisPermasalahan holds the NAME of the problem, we need to find the ID
      const selectedProblem = problemTypes.find(p => p.nama === formData.jenisPermasalahan);
      if (!selectedProblem) {
        throw new Error('Silakan pilih jenis permasalahan yang valid.');
      }

      // Create FormData object for file upload
      const formDataToSend = new FormData();

      // Add form fields
      formDataToSend.append('nama', formData.namaLengkap);
      formDataToSend.append('no_telepon', formData.noTelepon);
      formDataToSend.append('jabatan', formData.jabatan);
      formDataToSend.append('kategori_id', currentCategory.id);
      formDataToSend.append('jenis_permasalahan_id', selectedProblem.id);
      formDataToSend.append('deskripsi', formData.deskripsi);

      if (showLokasi && formData.lokasiGedung) {
        formDataToSend.append('lokasi_gedung', formData.lokasiGedung);
      }

      if (showLinkUrl && formData.linkUrl) {
        formDataToSend.append('link_url', formData.linkUrl);
      }

      // Add files
      files.forEach((file, index) => {
        formDataToSend.append(`files[${index}]`, file);
      });

      // Send to API
      const response = await axios.post(`${API_BASE_URL}/tiket`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Get the real ticket ID from API response
      if (response.data.nomor_tiket) {
        setTicketId(response.data.nomor_tiket);
      } else if (response.data.data?.nomor_tiket) {
        setTicketId(response.data.data.nomor_tiket);
      } else {
        setTicketId(generateTicketId());
      }

      setSubmitted(true);
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting form:', error);
      let errorMessage = 'Gagal mengirim pengaduan. Silakan coba lagi.';

      if (error.response?.status === 422) {
        // Validation error
        const errors = error.response.data.errors || {};
        const errorMessages = Object.entries(errors).map(([field, messages]) => {
          const messageList = Array.isArray(messages) ? messages : [messages];
          return messageList.join(', ');
        });
        errorMessage = errorMessages.length > 0 ? errorMessages.join('\n') : errorMessage;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setSubmitError(errorMessage);
      setSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Success Popup Modal */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 md:p-10 max-w-lg w-full text-center animate-slideUp">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounceIn">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengaduan Berhasil Dikirim!</h2>
            <p className="text-gray-600 mb-6">
              Terima kasih atas laporan Anda. Tim kami akan segera menindaklanjuti pengaduan Anda.
            </p>

            {/* Ticket ID */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Nomor Tiket Anda</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-bold text-blue-600">{ticketId}</span>
                <button
                  onClick={handleCopyTicket}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Salin nomor tiket"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-2">Nomor tiket berhasil disalin!</p>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-8">
              Simpan nomor tiket ini untuk memantau status pengaduan Anda di halaman <strong>Histori</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Kembali ke Beranda
              </Link>
              <Link
                to="/histori"
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors text-center"
              >
                Cek Status Tiket
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Formulir Pengaduan</h1>
          </div>
        </div>

        {/* Category Badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Link to="/buat-pengaduan" className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
            {category.icon}
            <span className="font-semibold text-gray-700">Kategori: {category.title}</span>
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8 space-y-6">

          {/* Nama Lengkap */}
          <div>
            <label htmlFor="namaLengkap" className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="namaLengkap"
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
              required
              placeholder="Masukkan nama lengkap Anda"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Jabatan / Status */}
          <div>
            <label htmlFor="jabatan" className="block text-sm font-semibold text-gray-700 mb-2">
              Jabatan / Status <span className="text-red-500">*</span>
            </label>
            <select
              id="jabatan"
              name="jabatan"
              value={formData.jabatan}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
            >
              <option value="">-- Pilih Jabatan / Status --</option>
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
              <option value="masyarakat_sekolah">Masyarakat Sekolah</option>
            </select>
          </div>

          {/* No Telepon */}
          <div>
            <label htmlFor="noTelepon" className="block text-sm font-semibold text-gray-700 mb-2">
              No. Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="noTelepon"
              name="noTelepon"
              value={formData.noTelepon}
              onChange={handleChange}
              required
              placeholder="Contoh: 08123456789"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Lokasi / Gedung (Server & Internet only) */}
          {showLokasi && (
            <div>
              <label htmlFor="lokasiGedung" className="block text-sm font-semibold text-gray-700 mb-2">
                Lokasi / Gedung <span className="text-red-500">*</span>
              </label>
              {loadingLokasi ? (
                <div className="px-4 py-3 text-gray-500">Memuat lokasi...</div>
              ) : (
                <select
                  id="lokasiGedung"
                  name="lokasiGedung"
                  value={formData.lokasiGedung}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
                >
                  <option value="">-- Pilih Lokasi / Gedung --</option>
                  {lokasi.map((item) => (
                    <option key={item.id} value={item.nama}>{item.nama}</option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Jenis Permasalahan / Nama Lokasi */}
          <div>
            <label htmlFor="jenisPermasalahan" className="block text-sm font-semibold text-gray-700 mb-2">
              {problemLabel} <span className="text-red-500">*</span>
            </label>
            {loadingCategories || loadingProblemTypes ? (
              <div className="px-4 py-3 text-gray-500">Memuat data...</div>
            ) : (
              <select
                id="jenisPermasalahan"
                name="jenisPermasalahan"
                value={formData.jenisPermasalahan}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 bg-white"
              >
                <option value="">{problemPlaceholder}</option>
                {problemTypes.map((problem) => (
                  <option key={problem.id} value={problem.nama}>{problem.nama}</option>
                ))}
              </select>
            )}
          </div>

          {/* Link URL (Website only) */}
          {showLinkUrl && (
            <div>
              <label htmlFor="linkUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                Link URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="linkUrl"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleChange}
                required
                placeholder="Contoh: https://smkbaknus.sch.id/halaman-error"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400"
              />
            </div>
          )}

          {/* Deskripsi Permasalahan */}
          <div>
            <label htmlFor="deskripsi" className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Permasalahan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Jelaskan detail permasalahan yang Anda alami..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 placeholder-gray-400 resize-none"
            />
          </div>

          {/* Upload Bukti Foto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bukti Foto / Screenshot <span className="text-gray-400 font-normal">(Maks. 5 file)</span>
            </label>

            {/* Upload Area */}
            <label
              htmlFor="fileUpload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Klik untuk upload foto atau file</span>
              <span className="text-xs text-gray-400 mt-1">JPG, PNG, PDF (Maks. 2MB per file)</span>
              <input
                type="file"
                id="fileUpload"
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Preview */}
            {previews.length > 0 && (
              <div className="flex gap-3 mt-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            {submitError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-semibold mb-1">Gagal Mengirim Pengaduan</p>
                  <p>{submitError}</p>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Mengirim...
                </>
              ) : (
                'Kirim Pengaduan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPengaduan;
