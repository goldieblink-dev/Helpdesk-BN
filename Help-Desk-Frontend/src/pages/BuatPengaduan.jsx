import React from 'react';
import { Server, Globe, Wifi, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = [
  {
    icon: <Server className="h-10 w-10 text-blue-600" />,
    title: "Server",
    desc: "Masalah pada server sekolah, koneksi database, atau hosting aplikasi.",
    slug: "server"
  },
  {
    icon: <Globe className="h-10 w-10 text-green-600" />,
    title: "Website",
    desc: "Bug pada website sekolah, konten tidak update, atau error halaman.",
    slug: "website"
  },
  {
    icon: <Wifi className="h-10 w-10 text-purple-600" />,
    title: "Internet",
    desc: "Koneksi lambat, wifi tidak terdeteksi, atau masalah jaringan lokal.",
    slug: "internet"
  },
  {
    icon: <Monitor className="h-10 w-10 text-orange-600" />,
    title: "Lab. Komputer",
    desc: "Kerusakan hardware PC, keyboard/mouse, atau software di laboratorium.",
    slug: "lab-komputer"
  }
];

const BuatPengaduan = () => {

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center mb-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Pilih Kategori</h1>
            <p className="text-gray-500 mt-2">Pilih kategori pengaduan yang sesuai dengan masalah Anda</p>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={`/buat-pengaduan/${cat.slug}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Image Area */}
              <div className="h-40 bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-300">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
              </div>
              {/* Card Content */}
              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.title}</h3>
                <p className="text-sm text-gray-500">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuatPengaduan;
