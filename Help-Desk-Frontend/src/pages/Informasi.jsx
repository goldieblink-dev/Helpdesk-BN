import React from 'react';
import { Server, Globe, Wifi, Monitor, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    icon: <Server className="h-10 w-10 text-blue-600" />,
    iconBg: "bg-blue-50",
    accentColor: "text-blue-600",
    borderColor: "border-blue-200",
    title: "Server",
    slug: "server",
    description: "Kategori ini mencakup seluruh permasalahan yang berkaitan dengan infrastruktur server milik sekolah. Laporan meliputi gangguan performa, downtime, atau kesalahan konfigurasi pada server.",
    problems: [
      {
        name: "Server dari VPS",
        detail: "Gangguan pada Virtual Private Server yang digunakan untuk hosting aplikasi atau layanan sekolah, termasuk downtime, kecepatan akses lambat, atau error konfigurasi."
      },
      {
        name: "Server WS",
        detail: "Masalah pada Web Server sekolah seperti error 500, timeout, SSL certificate expired, atau kegagalan dalam melayani request."
      },
      {
        name: "Server PK",
        detail: "Kendala pada server Pusat Komputer yang mendukung jaringan internal sekolah, termasuk masalah koneksi database atau penyimpanan data."
      }
    ]
  },
  {
    icon: <Globe className="h-10 w-10 text-green-600" />,
    iconBg: "bg-green-50",
    accentColor: "text-green-600",
    borderColor: "border-green-200",
    title: "Website",
    slug: "website",
    description: "Kategori ini mencakup permasalahan pada website-website milik sekolah. Laporan meliputi bug, konten tidak terupdate, error halaman, atau fitur yang tidak berfungsi.",
    problems: [
      {
        name: "PKL / Prakerin",
        detail: "Masalah pada website sistem informasi Praktek Kerja Lapangan, seperti error saat input data, gagal login, atau data tidak tersimpan."
      },
      {
        name: "Web Perpus",
        detail: "Gangguan pada website perpustakaan digital sekolah, termasuk pencarian buku error, katalog tidak update, atau sistem peminjaman bermasalah."
      },
      {
        name: "Web Sekolah",
        detail: "Kendala pada website utama sekolah seperti halaman tidak bisa diakses, informasi outdated, atau tampilan rusak."
      },
      {
        name: "Web Ujian",
        detail: "Error pada sistem ujian online, termasuk soal tidak muncul, jawaban tidak tersimpan, atau timer tidak berjalan normal."
      },
      {
        name: "Web SPMB",
        detail: "Masalah pada website Seleksi Penerimaan Murid Baru seperti form pendaftaran error, upload dokumen gagal, atau pengumuman tidak tampil."
      },
      {
        name: "Karomah / Web Ramadan",
        detail: "Gangguan pada website kegiatan Ramadan sekolah, termasuk jadwal yang tidak terupdate atau fitur yang tidak berfungsi."
      },
      {
        name: "Web Help Desk",
        detail: "Masalah pada website Help Desk ini sendiri, termasuk bug pada formulir pengaduan, error tampilan, atau fitur yang bermasalah."
      }
    ]
  },
  {
    icon: <Wifi className="h-10 w-10 text-purple-600" />,
    iconBg: "bg-purple-50",
    accentColor: "text-purple-600",
    borderColor: "border-purple-200",
    title: "Internet",
    slug: "internet",
    description: "Kategori ini mencakup seluruh permasalahan koneksi internet dan jaringan di lingkungan sekolah. Laporan meliputi koneksi lambat, putus-putus, atau tidak bisa terhubung sama sekali.",
    problems: [
      {
        name: "WiFi",
        detail: "Masalah koneksi WiFi di area sekolah, termasuk sinyal lemah, tidak bisa connect, kecepatan lambat, jaringan sering putus, atau access point yang tidak berfungsi di area tertentu."
      }
    ]
  },
  {
    icon: <Monitor className="h-10 w-10 text-orange-600" />,
    iconBg: "bg-orange-50",
    accentColor: "text-orange-600",
    borderColor: "border-orange-200",
    title: "Lab. Komputer",
    slug: "lab-komputer",
    description: "Kategori ini mencakup permasalahan pada perangkat keras dan perangkat lunak di laboratorium komputer sekolah. Laporan meliputi kerusakan hardware, software error, atau peralatan yang tidak berfungsi.",
    problems: [
      {
        name: "Lab 1",
        detail: "Kerusakan atau gangguan pada perangkat di Laboratorium Komputer 1, seperti PC tidak menyala, monitor blank, keyboard/mouse rusak, atau software error."
      },
      {
        name: "Lab 2",
        detail: "Kerusakan atau gangguan pada perangkat di Laboratorium Komputer 2, termasuk masalah hardware maupun software."
      },
      {
        name: "Lab 3",
        detail: "Kerusakan atau gangguan pada perangkat di Laboratorium Komputer 3, termasuk masalah hardware maupun software."
      },
      {
        name: "Lab 4",
        detail: "Kerusakan atau gangguan pada perangkat di Laboratorium Komputer 4, termasuk masalah hardware maupun software."
      },
      {
        name: "Lab 5",
        detail: "Kerusakan atau gangguan pada perangkat di Laboratorium Komputer 5, termasuk masalah hardware maupun software."
      },
      {
        name: "Lab 6",
        detail: "Kerusakan atau gangguan pada perangkat di Laboratorium Komputer 6, termasuk masalah hardware maupun software."
      },
      {
        name: "Lab 7",
        detail: "Kerusakan atau gangguan pada perangkat di Laboratorium Komputer 7, termasuk masalah hardware maupun software."
      }
    ]
  }
];

const Informasi = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Informasi Pengaduan</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Berikut adalah penjelasan detail mengenai setiap kategori pengaduan beserta jenis permasalahan yang dapat Anda laporkan melalui sistem Help Desk.
          </p>
        </div>
      </section>

      {/* Categories Detail */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {categories.map((cat, index) => (
          <div key={index} className={`bg-white rounded-2xl shadow-md border ${cat.borderColor} overflow-hidden`}>
            {/* Category Header */}
            <div className="p-6 md:p-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className={`w-16 h-16 ${cat.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {cat.icon}
                </div>
                <div className="flex-grow">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{cat.title}</h2>
                  <p className="text-gray-600">{cat.description}</p>
                </div>
                <Link
                  to={`/buat-pengaduan/${cat.slug}`}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 ${cat.accentColor} font-semibold rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0 self-start`}
                >
                  Lapor <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Problems List */}
            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Jenis Permasalahan ({cat.problems.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cat.problems.map((problem, i) => (
                  <div key={i} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className={`w-2 h-2 ${cat.iconBg.replace('50', '500').replace('bg-', 'bg-')} rounded-full mt-2 flex-shrink-0`}
                      style={{ backgroundColor: cat.accentColor.includes('blue') ? '#3b82f6' : cat.accentColor.includes('green') ? '#22c55e' : cat.accentColor.includes('purple') ? '#a855f7' : '#f97316' }}
                    ></div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{problem.name}</h4>
                      <p className="text-sm text-gray-600">{problem.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Cara Kerja Detail */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Cara Kerja Website Help Desk</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Panduan lengkap langkah demi langkah untuk menyampaikan pengaduan Anda melalui sistem Help Desk sekolah.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

            {[
              {
                step: "1",
                title: "Pilih Kategori Pengaduan",
                desc: "Langkah pertama adalah memilih kategori yang sesuai dengan permasalahan Anda. Tersedia 4 kategori utama: Server, Website, Internet, dan Lab. Komputer.",
                tips: "Pastikan memilih kategori yang tepat agar pengaduan Anda ditangani oleh tim yang sesuai.",
                color: "bg-blue-600",
                iconBg: "bg-blue-50",
                icon: <Server className="h-6 w-6 text-blue-600" />
              },
              {
                step: "2",
                title: "Isi Formulir Pengaduan",
                desc: "Lengkapi formulir dengan data diri (nama, jabatan, no. telepon) dan detail permasalahan. Jelaskan masalah yang Anda alami dengan sejelas-jelasnya.",
                tips: "Semakin detail deskripsi yang Anda berikan, semakin cepat tim kami dapat memahami dan menangani masalah Anda.",
                color: "bg-green-600",
                iconBg: "bg-green-50",
                icon: <Globe className="h-6 w-6 text-green-600" />
              },
              {
                step: "3",
                title: "Lampirkan Bukti Foto",
                desc: "Tambahkan foto atau screenshot sebagai bukti pendukung (opsional, maksimal 5 file). Bukti visual akan sangat membantu tim kami memahami masalah dan mempercepat penanganan.",
                tips: "Format yang didukung: PNG, JPG, JPEG, PDF dengan ukuran maksimal 2MB per file.",
                color: "bg-purple-600",
                iconBg: "bg-purple-50",
                icon: <Wifi className="h-6 w-6 text-purple-600" />
              },
              {
                step: "4",
                title: "Kirim & Dapatkan Nomor Tiket",
                desc: "Setelah formulir terisi lengkap, tekan tombol \"Kirim Pengaduan\". Sistem akan memproses laporan Anda dan memberikan nomor tiket unik sebagai referensi.",
                tips: "Simpan nomor tiket Anda! Nomor ini digunakan untuk melacak status pengaduan.",
                color: "bg-orange-600",
                iconBg: "bg-orange-50",
                icon: <Monitor className="h-6 w-6 text-orange-600" />
              },
              {
                step: "5",
                title: "Verifikasi & Tindak Lanjut oleh Admin",
                desc: "Admin akan menerima laporan Anda dan melakukan verifikasi. Setelah diverifikasi, pengaduan akan diteruskan ke pihak teknis yang bertanggung jawab untuk ditindaklanjuti.",
                tips: "Proses verifikasi biasanya memakan waktu 1x24 jam pada hari kerja.",
                color: "bg-indigo-600",
                iconBg: "bg-indigo-50",
                icon: <ArrowRight className="h-6 w-6 text-indigo-600" />
              },
              {
                step: "6",
                title: "Penyelesaian & Notifikasi",
                desc: "Setelah masalah selesai ditangani, status tiket akan diperbarui menjadi \"Selesai\". Anda akan menerima notifikasi dan dapat memberikan umpan balik mengenai penanganan yang dilakukan.",
                tips: "Anda dapat mengecek status tiket kapan saja melalui menu Histori atau halaman Cek Status Tiket.",
                color: "bg-emerald-600",
                iconBg: "bg-emerald-50",
                icon: <Globe className="h-6 w-6 text-emerald-600" />
              }
            ].map((item, index) => (
              <div key={index} className={`relative flex flex-col md:flex-row items-center gap-6 mb-10 last:mb-0 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                {/* Step Number Circle */}
                <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 z-10">
                  <div className={`w-14 h-14 ${item.color} text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg`}>
                    {item.step}
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-16' : 'md:pl-16'}`}>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 ${item.iconBg} rounded-lg flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-3">{item.desc}</p>
                    <div className="flex items-start gap-2 bg-white rounded-lg p-3 border border-gray-200">
                      <span className="text-yellow-500 text-lg flex-shrink-0">💡</span>
                      <p className="text-sm text-gray-500"><strong className="text-gray-700">Tips:</strong> {item.tips}</p>
                    </div>
                  </div>
                </div>

                {/* Spacer for opposite side */}
                <div className="hidden md:block w-5/12"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Informasi;
