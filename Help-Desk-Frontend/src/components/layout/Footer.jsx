import React from 'react';
import { Link } from 'react-router-dom';
import { LifeBuoy, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <LifeBuoy className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl">HelpDesk</span>
            </div>
            <p className="text-sm text-gray-400">
              Menyediakan layanan pengaduan terpercaya untuk Siswa, Guru, dan Masyarakat Sekolah. Kami di sini untuk membantu Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-500 transition-colors">Beranda</Link></li>
              <li><Link to="/cek-status" className="hover:text-blue-500 transition-colors">Cek Status Tiket</Link></li>
              <li><Link to="/faq" className="hover:text-blue-500 transition-colors">FAQ</Link></li>
              <li><Link to="/panduan" className="hover:text-blue-500 transition-colors">Panduan Pengguna</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">Server</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Website</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Internet</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Lab.Komputer</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hubungi Kami</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5" />
                <span>Jl. Raya Percobaan No.65, Cileunyi Kulon,<br />Kec. Cileunyi, Kabupaten Bandung, Jawa Barat 40622</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-500" />
                <span>+62 123 4567 890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <span>support@helpdesk.sch.id</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} HelpDesk System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
