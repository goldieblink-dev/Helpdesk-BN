import React, { useState } from 'react';
import { ChevronDown, Check, HelpCircle, AlertCircle, Eye, Upload, Clock, Smartphone, FileText, Users, BookOpen } from 'lucide-react';

const Panduan = () => {
  const [expandedFaq, setExpandedFaq] = useState(0);

  const faqs = [
    {
      category: "Membuat Pengaduan",
      items: [
        {
          question: "Bagaimana cara membuat pengaduan?",
          answer: "Untuk membuat pengaduan, ikuti langkah-langkah berikut:\n1. Klik tombol 'Buat Pengaduan' di halaman utama\n2. Pilih kategori permasalahan yang sesuai\n3. Lengkapi semua form yang ada (nama, telepon, lokasi, deskripsi)\n4. Unggah file bukti jika diperlukan (opsional)\n5. Klik tombol 'Kirim Pengaduan'\n6. Catat nomor tiket yang diberikan untuk tracking nantinya"
        },
        {
          question: "Apa saja kategori pengaduan yang tersedia?",
          answer: "Terdapat 4 kategori utama pengaduan:\n1. Server - Masalah terkait server sekolah\n2. Website - Masalah terkait website sekolah\n3. Internet - Masalah koneksi internet\n4. Lab Komputer - Masalah di laboratorium komputer\n\nSetiap kategori memiliki sub-kategori detail untuk memudahkan spesifikasi masalah Anda."
        },
        {
          question: "Apakah harus mengisiakan nama asli?",
          answer: "Ya, nama harus diisi untuk keperluan tindak lanjut pengaduan. Nama dapat digunakan untuk verifikasi identitas pelapor oleh administrasi sekolah. Semua data akan dijaga kerahasiaannya sesuai kebijakan privasi sekolah."
        },
        {
          question: "Bisakah mengupload file? Apa saja tipenya?",
          answer: "Ya, Anda dapat mengupload file sebagai bukti pendukung pengaduan. File yang diizinkan:\n- JPG/JPEG (foto)\n- PNG (gambar)\n- PDF (dokumen)\n\nUkuran maksimal per file adalah 2 MB. Anda dapat mengupload hingga 5 file per pengaduan."
        },
        {
          question: "Apa gunanya nomor tiket?",
          answer: "Nomor tiket adalah identitas unik pengaduan Anda. Gunakan nomor ini untuk:\n- Melacak status pengaduan\n- Referensi ketika bertanya kepada admin\n- Memudahkan pencatatan administrasi\n\nJangan bagikan nomor tiket ke pihak yang tidak bertanggung jawab."
        }
      ]
    },
    {
      category: "Melacak Pengaduan",
      items: [
        {
          question: "Bagaimana cara mengecek status pengaduan saya?",
          answer: "Ada 2 cara untuk mengecek status pengaduan:\n\n1. Halaman 'Cek Status':\n   - Gunakan nomor tiket (format: BN-DDMMYYYY-00001)\n   - Atau gunakan nomor telepon Anda\n\n2. Halaman 'Riwayat':\n   - Lihat daftar lengkap semua pengaduan Anda\n   - Filter berdasarkan status atau kategori\n\nStatus akan diperbarui secara real-time seiring proses penanganan."
        },
        {
          question: "Apa arti setiap status pengaduan?",
          answer: "Pengaduan akan melewati beberapa status tahapan:\n\n1. MENUNGGU (⏱️)\n   - Pengaduan baru saja diterima\n   - Sedang dalam antrian untuk ditinjau\n   - Waktu: 1-2 hari kerja\n\n2. DIPROSES (⚙️)\n   - Admin sedang menangani pengaduan\n   - Investigasi atau perbaikan sedang dilakukan\n   - Waktu: Bervariasi sesuai kompleksitas masalah\n\n3. SELESAI (✓)\n   - Pengaduan sudah ditangani dan terselesaikan\n   - Akan ada catatan dari admin tentang solusinya\n\n4. DITOLAK (✗)\n   - Pengaduan tidak dapat diproses\n   - Admin akan memberikan alasan penolakan"
        },
        {
          question: "Berapa lama waktu penanganan pengaduan?",
          answer: "Waktu penanganan berbeda-beda tergantung jenis masalah:\n\n- Masalah sederhana: 1-2 hari kerja\n- Masalah menengah: 2-5 hari kerja\n- Masalah kompleks: 5-14 hari kerja\n\nUntuk masalah urgent, silakan hubungi langsung admin IT sekolah atau tuliskan 'URGENT' di deskripsi pengaduan."
        },
        {
          question: "Bagaimana jika pengaduan saya tidak ditanggapi?",
          answer: "Jika pengaduan Anda tidak ditanggapi dalam waktu yang ditentukan:\n\n1. Cek kembali apakah data Anda benar dan lengkap\n2. Pastikan nomor telepon bisa dihubungi\n3. Hubungi langsung admin IT sekolah dengan nomor tiket\n4. Atau hubungi tas administrasi sekolah untuk eskalasi\n\nUntuk kontak, lihat bagian 'Hubungi Kami' di halaman utama."
        },
        {
          question: "Bisakah saya membatalkan pengaduan?",
          answer: "Pengaduan yang sudah dikirim tidak dapat dibatalkan sendiri. Namun, Anda dapat:\n\n1. Menghubungi admin melalui halaman 'Informasi'\n2. Menjelaskan alasan pembatalan\n3. Admin akan menandai pengaduan sesuai kondisi\n\nHusus untuk pengaduan yang masih status 'Menunggu', pembatalan biasanya dapat diproses dengan cepat."
        }
      ]
    },
    {
      category: "Data & Privasi",
      items: [
        {
          question: "Apakah data saya aman?",
          answer: "Keamanan data adalah prioritas utama kami. Tindakan keamanan yang diterapkan:\n\n1. Enkripsi data saat transit (HTTPS)\n2. Database server terlindungi dan di-backup rutin\n3. Hanya admin yang diizinkan akses data pengaduan\n4. Akses tercatat dan dimonitor\n5. GDPR dan regulasi privasi diterapkan\n\nJangan pernah bagikan informasi sensitif melalui form ini."
        },
        {
          question: "Bagaimana data saya digunakan?",
          answer: "Data pengaduan Anda digunakan untuk:\n\n1. Menangani dan menyelesaikan masalah yang dilaporkan\n2. Meningkatkan kualitas layanan IT sekolah\n3. Analisis statistik sistem sekolah (tanpa identifikasi pribaadi)\n4. Pelaporan kepada manajemen sekolah\n5. Arsip dan dokumentasi administrasi\n\nData tidak akan dibagikan ke pihak ketiga tanpa persetujuan."
        },
        {
          question: "Berapa lama data pengaduan disimpan?",
          answer: "Data pengaduan disimpan sesuai kebijakan retensi sekolah:\n\n- Data aktual & file: Disimpan minimal 1 tahun\n- Backup arsip: Disimpan hingga 5 tahun\n- Log akses: Disimpan 1 tahun\n\nSetelah periode retention berakhir, data akan dihapus secara aman. Anda dapat meminta penghapusan data lebih awal dengan menghubungi admin."
        },
        {
          question: "Bisakah saya menghapus pengaduan saya?",
          answer: "Pengaduan yang sudah selesai ditangani tidak dapat dihapus karena tujuan dokumentasi. Namun, Anda dapat:\n\n1. Menghubungi admin untuk anonimisasi data (menghapus nama, telepon)\n2. Meminta akses ke data pengaduan Anda sendiri\n3. Meminta koreksi jika ada data yang salah\n4. Menghubungi DPO (Data Protection Officer) sekolah untuk kebutuhan khusus\n\nUntuk keperluan ini, email admin@smkbaknus.sch.id"
        }
      ]
    },
    {
      category: "Troubleshooting",
      items: [
        {
          question: "Halaman tidak bisa dibuka, apa yang harus dilakukan?",
          answer: "Jika halaman tidak bisa dibuka:\n\n1. Periksa koneksi internet Anda\n2. Refresh halaman (F5 atau Ctrl+R)\n3. Hapus cache browser:\n   - Chrome: Ctrl+Shift+Delete\n   - Firefox: Ctrl+Shift+Delete\n4. Coba browser yang berbeda\n5. Hubungi admin jika masalah berlanjut\n\nProses aplikasi ini optimal di:\n- Chrome (versi terbaru)\n- Firefox (versi terbaru)\n- Safari (versi terbaru)"
        },
        {
          question: "Form tidak bisa dikirim, apa penyebabnya?",
          answer: "Jika form tidak dapat dikirim:\n\n1. Pastikan semua field wajib terisi (ditandai bintang*)\n2. Cek format nomor telepon (minimal 9 digit)\n3. Pastikan file yang diupload tidak lebih dari 2 MB\n4. Format file harus .jpg, .jpeg, .png, atau .pdf\n5. File dengan nama khusus/unik biasanya lebih cepat\n6. Tunggu feedback dari sistem (jangan klik berulang)\n\nAtau hubungi admin dengan screenshot error yang muncul."
        },
        {
          question: "Nomor tiket tidak ditemukan saat pencarian",
          answer: "Jika nomor tiket tidak ditemukan saat mencari:\n\n1. Pastikan format nomor tiket benar: BN-DDMMYYYY-00001\n2. Periksa kembali nomor yang dicatat saat daftar\n3. Gunakan nomor telepon untuk pencarian sebagai alternatif\n4. Tunggu 5-10 menit setelah pengaduan dikirim (sistem butuh waktu sinkronisasi)\n5. Hubungi admin jika masalah persisten\n\nJangan gunakan karakter khusus atau spasi pada nomor tiket."
        },
        {
          question: "File tidak bisa diupload",
          answer: "Jika file tidak dapat diupload:\n\n1. Periksa ukuran file:\n   - Maksimal 2 MB per file\n   - Gunakan tool kompresi jika diperlukan\n\n2. Verifikasi format file:\n   - Hanya: JPG, JPEG, PNG, PDF\n   - Hindari: DOCX, XLSX, atau format lainnya\n\n3. Cura nama file:\n   - Gunakan nama sederhana tanpa spasi\n   - Hindari karakter khusus atau simbol\n   - Contoh: bukti-kerusakan-1.jpg\n\n4. Cek koneksi internet (upload butuh koneksi stabil)\n\nJika tetap gagal, upload bukti dapat dilakukan kemudian."
        },
        {
          question: "Apakah ada waktu operasional sistem?",
          answer: "Sistem Help Desk tersedia 24/7 sepanjang waktu. Namun:\n\nRespon dari admin:\n- Jam kerja: 08:00 - 16:30 (Senin-Jumat)\n- Hari libur: Tidak ada response\n- Response time rata-rata: 1-2 jam saat jam kerja\n\nAnda tetap bisa membuat pengaduan kapan saja, namun tim admin baru akan meresponnya saat jam kerja. Pengaduan urgent dapat menghubungi admin langsung."
        }
      ]
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Buat Pengaduan",
      icon: <FileText className="h-8 w-8" />,
      description: "Klik tombol 'Buat Pengaduan' dan pilih kategori permasalahan"
    },
    {
      number: 2,
      title: "Isi Form Lengkap",
      icon: <Users className="h-8 w-8" />,
      description: "Masukkan data pribadi dan detail lengkap masalah Anda"
    },
    {
      number: 3,
      title: "Upload Bukti (Opsional)",
      icon: <Upload className="h-8 w-8" />,
      description: "Sertakan file bukti untuk mempercepat proses"
    },
    {
      number: 4,
      title: "Dapatkan Nomor Tiket",
      icon: <Smartphone className="h-8 w-8" />,
      description: "Catat nomor tiket untuk melacak status pengaduan"
    },
    {
      number: 5,
      title: "Pantau Status",
      icon: <Eye className="h-8 w-8" />,
      description: "Gunakan halaman 'Cek Status' untuk melihat perkembangan"
    },
    {
      number: 6,
      title: "Tunggu Penyelesaian",
      icon: <Check className="h-8 w-8" />,
      description: "Admin akan menangani dan memberikan solusi"
    }
  ];

  const tips = [
    {
      title: "Jelaskan Detail dengan Jelas",
      description: "Semakin detail penjelasan masalah, semakin cepat admin memahami dan menyelesaikan.",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "Sertakan Bukti Visual",
      description: "Tangkapan layar atau foto masalah membantu admin dalam investigasi.",
      icon: <Upload className="h-5 w-5" />
    },
    {
      title: "Cantumkan Waktu Kejadian",
      description: "Informasi kapan masalah terjadi memudahkan penelusuran log sistem.",
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: "Gunakan Bahasa yang Jelas",
      description: "Hindari istilah teknis yang rumit, gunakan bahasa yang mudah dipahami.",
      icon: <AlertCircle className="h-5 w-5" />
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="flex justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Panduan Penggunaan</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Pelajari cara menggunakan layanan Help Desk sekolah dengan mudah dan efisien.
          </p>
        </div>
      </section>

      {/* Quick Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Langkah-Langkah Singkat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {steps.map((step, idx) => (
            <div key={step.number} className="flex flex-col items-center">
              <div className="flex items-center w-full mb-4">
                <div className="flex-1 bg-blue-600 h-1 rounded"></div>
                {idx < steps.length - 1 && <div className="flex-1 bg-gray-200 h-1 rounded ml-2"></div>}
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center w-full hover:shadow-lg transition-shadow">
                <div className="bg-blue-100 w-full rounded-lg p-3 flex justify-center mb-3">
                  <div className="text-blue-600">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Tips Agar Cepat Ditangani</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <div className="text-blue-600 flex-shrink-0">{tip.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Pertanyaan Yang Sering Diajukan</h2>

        <div className="space-y-8">
          {faqs.map((faqGroup, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                {faqGroup.category}
              </h3>

              <div className="space-y-4">
                {faqGroup.items.map((faq, itemIdx) => {
                  const uniqueId = `faq_${groupIdx}_${itemIdx}`;
                  const isExpanded = expandedFaq === uniqueId;

                  return (
                    <div key={uniqueId} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : uniqueId)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-900 text-left">{faq.question}</h4>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-600 flex-shrink-0 transition-transform ${isExpanded ? 'transform rotate-180' : ''
                            }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700 whitespace-pre-wrap">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-blue-50 border-y border-blue-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Butuh Bantuan Lebih Lanjut?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Jika pertanyaan Anda tidak terjawab di sini, jangan ragu untuk menghubungi tim admin kami.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Hubungi Admin</h3>
              <p className="text-sm text-gray-600 mb-3">
                Tim admin IT kami siap membantu Anda
              </p>
              <a href="/informasi" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Lihat Kontak Admin →
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Buat Pengaduan</h3>
              <p className="text-sm text-gray-600 mb-3">
                Ada masalah yang perlu dilaporkan?
              </p>
              <a href="/buat-pengaduan" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Buat Pengaduan Baru →
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Cek Status</h3>
              <p className="text-sm text-gray-600 mb-3">
                Pantau pengaduan Anda sekarang
              </p>
              <a href="/cek-status" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                Cek Status Pengaduan →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Panduan;
