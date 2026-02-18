import React, { useEffect } from 'react';
import { ArrowRight, Search, Server, Globe, Wifi, Monitor } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import smkBackground from '../assets/smk-baknus.jpg';
import fotoKiri from '../assets/foto-kiri.jpg';
import fotoKanan from '../assets/foto-kanan.jpeg';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const elem = document.getElementById(location.hash.substring(1));
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={smkBackground}
            alt="SMK Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-900/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide mb-2 text-blue-200">
            SMK BAKTI NUSANTARA 666
          </h1>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            LAYANAN PENGADUAN SEKOLAH
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mb-10">
            Sampaikan aspirasi, keluhan, dan saran Anda dengan mudah.
            Terbuka untuk Siswa, Guru, dan Masyarakat Sekolah.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/buat-pengaduan" className="px-8 py-4 bg-white text-blue-700 font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-transform transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Buat Pengaduan <ArrowRight className="h-5 w-5" />
            </Link>

          </div>
        </div>

        {/* Decorative Curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L1440 120L1440 0C1440 0 1082.5 97.5 720 97.5C357.5 97.5 0 0 0 0L0 120Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* Services/Features Section */}
      <section id="layanan" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategori Pengaduan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pilih kategori yang sesuai dengan kebutuhan Anda untuk penanganan yang lebih cepat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Server className="h-8 w-8 text-blue-600" />,
              title: "Server",
              desc: "Masalah pada server sekolah, koneksi database, atau hosting aplikasi.",
              slug: "server"
            },
            {
              icon: <Globe className="h-8 w-8 text-green-600" />,
              title: "Website",
              desc: "Bug pada website sekolah, konten tidak update, atau error halaman.",
              slug: "website"
            },
            {
              icon: <Wifi className="h-8 w-8 text-purple-600" />,
              title: "Internet",
              desc: "Koneksi lambat, wifi tidak terdeteksi, atau masalah jaringan lokal.",
              slug: "internet"
            },
            {
              icon: <Monitor className="h-8 w-8 text-orange-600" />,
              title: "Lab. Komputer",
              desc: "Kerusakan hardware PC, keyboard/mouse, atau software di laboratorium.",
              slug: "lab-komputer"
            }
          ].map((item, index) => (
            <Link to={`/buat-pengaduan/${item.slug}`} key={index} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.desc}</p>
              <span className="text-blue-600 font-medium hover:text-blue-800 inline-flex items-center gap-1">
                Lapor Sekarang <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Info Section 1 */}
      <section className="bg-white pt-20 pb-0 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={fotoKiri}
              alt="Layanan Terpadu"
              className="rounded-2xl shadow-2xl blur-[1px]"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Layanan Terpadu untuk Lingkungan Sekolah yang Lebih Baik
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Sistem Help Desk kami memastikan setiap suara didengar.
              Kami berkomitmen untuk menindaklanjuti setiap laporan dengan transparan dan profesional demi kemajuan bersama.
            </p>
            <ul className="space-y-4">
              {[
                "Pelacakan tiket real-time",
                "Respon cepat dari admin",
                "Privasi dan kerahasiaan terjaga",
                "Akses mudah dari HP atau Laptop"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Info Section 2 (Image Right) */}
      <section className="bg-white pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Kemudahan Akses dan Transparansi
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Pantau status laporan Anda kapan saja dan di mana saja.
              Kami menyediakan dashboard yang mudah digunakan untuk memastikan Anda selalu mendapatkan update terbaru mengenai tindak lanjut laporan.
            </p>
            <ul className="space-y-4">
              {[
                "Notifikasi status otomatis",
                "Riwayat laporan lengkap",
                "Dukungan multi-platform",
                "Umpan balik langsung"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="order-1 lg:order-2">
            <img
              src={fotoKanan}
              alt="Kemudahan Akses"
              className="rounded-2xl shadow-2xl blur-[1px]"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Cara Kerja Website</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ikuti 4 langkah mudah untuk menyampaikan laporan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Kirim Laporan",
              desc: "Isi formulir pengaduan dengan detail masalah dan bukti foto jika ada."
            },
            {
              step: "2",
              title: "Verifikasi Admin",
              desc: "Admin akan memverifikasi laporan Anda untuk memastikan validitasnya."
            },
            {
              step: "3",
              title: "Tindak Lanjut",
              desc: "Pihak terkait akan menangani masalah yang dilaporkan."
            },
            {
              step: "4",
              title: "Selesai",
              desc: "Laporan ditutup dan Anda akan menerima notifikasi penyelesaian."
            }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6 shadow-lg relative z-10">
                {item.step}
              </div>
              {index < 3 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-1 bg-gray-200 -z-0"></div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
