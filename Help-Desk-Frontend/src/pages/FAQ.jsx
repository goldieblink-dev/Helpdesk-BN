import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const FAQ = () => {
    const faqs = [
        {
            question: "Bagaimana cara membuat pengaduan tiket?",
            answer: "Anda dapat membuat pengaduan dengan mengklik tombol 'Buat Pengaduan' di halaman utama. Isi formulir dengan detail masalah Anda, pilih kategori yang sesuai, dan lampirkan foto jika diperlukan."
        },
        {
            question: "Berapa lama waktu respon untuk setiap tiket?",
            answer: "Waktu respon tergantung pada prioritas dan kompleksitas masalah. Tim kami berusaha merespon dalam waktu 1x24 jam pada hari kerja."
        },
        {
            question: "Apakah saya bisa melacak status pengaduan saya?",
            answer: "Ya, Anda dapat melacak status pengaduan melalui menu 'Cek Status Tiket'. Masukkan Nomor Tiket Anda untuk melihat perkembangan terbaru."
        },
        {
            question: "Apa yang harus dilakukan jika saya lupa Nomor Tiket?",
            answer: "Jika Anda lupa Nomor Tiket, Anda dapat menghubungi admin melalui kontak yang tersedia di footer website atau datang langsung ke ruang Help Desk."
        },
        {
            question: "Apakah layanan ini gratis?",
            answer: "Ya, layanan Help Desk ini sepenuhnya gratis untuk seluruh civitas akademika SMK Bakti Nusantara 666."
        },
        {
            question: "Jam operasional Help Desk?",
            answer: "Layanan Help Desk beroperasi pada hari Senin - Jumat, pukul 07.00 - 16.00 WIB."
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <HelpCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Temukan jawaban atas pertanyaan yang sering diajukan mengenai layanan Help Desk kami.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md bg-white"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors focus:outline-none"
                        >
                            <span className="font-semibold text-gray-800">{faq.question}</span>
                            {openIndex === index ? (
                                <ChevronUp className="h-5 w-5 text-blue-500" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                        </button>

                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                        >
                            <div className="p-5 pt-0 text-gray-600 border-t border-gray-100 bg-gray-50/50">
                                {faq.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center bg-blue-50 rounded-xl p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Masih punya pertanyaan lain?</h3>
                <p className="text-gray-600 mb-6">Jangan ragu untuk menghubungi tim support kami langsung.</p>
                <a
                    href="mailto:support@helpdesk.sch.id"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Hubungi Kami
                </a>
            </div>
        </div>
    );
};

export default FAQ;
