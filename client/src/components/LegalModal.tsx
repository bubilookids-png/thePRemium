// src/components/LegalModal.tsx
import React, { useState } from 'react';

interface LegalModalProps {
  onClose: () => void;
}

export function LegalModal({ onClose }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-mono">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col p-6 sm:p-8 rounded-3xl bg-[#02130e] border border-[#F8E7C9]/20 shadow-2xl text-[#F8E7C9]">
        
        {/* Yopish tugmasi */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[#F8E7C9]/50 hover:text-white transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 cursor-pointer"
        >
          ✕
        </button>

        {/* Sarlavha va Tablar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F8E7C9]/10">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📜</span>
            <h3 className="text-lg font-bold">Platforma Qoidalari</h3>
          </div>

          <div className="flex items-center gap-2 bg-[#062b21] p-1 rounded-xl border border-[#F8E7C9]/10">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                activeTab === 'privacy' ? 'bg-[#064E3B] text-[#F8E7C9] font-bold' : 'text-[#F8E7C9]/60 hover:text-[#F8E7C9]'
              }`}
            >
              Maxfiylik
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                activeTab === 'terms' ? 'bg-[#064E3B] text-[#F8E7C9] font-bold' : 'text-[#F8E7C9]/60 hover:text-[#F8E7C9]'
              }`}
            >
              Shartlar
            </button>
          </div>
        </div>

        {/* Matn qismi */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-[#F8E7C9]/80 leading-relaxed">
          {activeTab === 'privacy' ? (
            <>
              <h4 className="text-sm font-bold text-[#10b981]">1. Maxfiylik Siyosati (Privacy Policy)</h4>
              <p>
                UniveBooster platformasi foydalanuvchilarning shaxsiy ma'lumotlari xavfsizligini ta'minlashni muhim deb biladi. 
                Telegram orqali tizimga kirganingizda faqat umumiy ma'lumotlar (Ism, Telegram ID va rasm) sessiya uchun saqlanadi.
              </p>
              <h4 className="text-sm font-bold text-[#10b981]">2. Ma'lumotlardan foydalanish</h4>
              <p>
                Yig'ilgan ma'lumotlar faqatgina sizning kunlik so'z qidirish limitlaringizni boshqarish, o'quv natijalaringizni saqlash va 
                platforma xizmatlarini yaxshilash uchun ishlatiladi. Ma'lumotlaringiz hech qachon uchinchi shaxslarga berilmaydi.
              </p>
            </>
          ) : (
            <>
              <h4 className="text-sm font-bold text-[#10b981]">1. Foydalanish Shartlari (Terms of Service)</h4>
              <p>
                UniveBooster'dan foydalanish orqali siz ushbu qoidalarga rozilik bildirasiz. Platformadagi materiallar, 
                sun'iy intellekt tahlillari va testlar faqat ta'lim maqsadlari uchun mo'ljallangan.
              </p>
              <h4 className="text-sm font-bold text-[#10b981]">2. Limitlar va Qoidabuzarlik</h4>
              <p>
                Har bir foydalanuvchi uchun belgilangan kunlik so'z qidirish limitlari mavjud. Tizimni avtomatlashtirilgan tarzda 
                hakerlik qilish yoki yuklamani sun'iy oshirish taqiqlanadi.
              </p>
            </>
          )}
        </div>

        {/* Pastki tugma */}
        <div className="pt-4 mt-4 border-t border-[#F8E7C9]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#10b981] text-[#02130e] font-bold text-xs hover:bg-[#059669] transition cursor-pointer"
          >
            Tushunarli
          </button>
        </div>

      </div>
    </div>
  );
}