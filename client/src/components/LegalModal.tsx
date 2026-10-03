import React, { useState } from 'react';

interface LegalModalProps {
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export function LegalModal({ onClose, initialTab }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab ?? 'privacy');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-mono">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col p-6 sm:p-8 rounded-3xl bg-slate-950 border border-lime-400/20 shadow-2xl text-slate-100">

        {/* Yopish tugmasi */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-lime-300 transition text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-lime-500/10 cursor-pointer"
        >
          ✕
        </button>

        {/* Sarlavha va Tablar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-lime-400/15">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📜</span>
            <h3 className="text-lg font-bold text-lime-300">Platforma Qoidalari</h3>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/60 p-1 rounded-xl border border-lime-400/15">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                activeTab === 'privacy' ? 'bg-blue-900/70 text-lime-300 font-bold' : 'text-slate-400 hover:text-lime-300'
              }`}
            >
              Maxfiylik
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-3 py-1 rounded-lg text-xs transition cursor-pointer ${
                activeTab === 'terms' ? 'bg-blue-900/70 text-lime-300 font-bold' : 'text-slate-400 hover:text-lime-300'
              }`}
            >
              Shartlar
            </button>
          </div>
        </div>

        {/* Matn qismi */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          {activeTab === 'privacy' ? (
            <>
              <h4 className="text-sm font-bold text-lime-300">1. Maxfiylik Siyosati (Privacy Policy)</h4>
              <p>
                UniveBooster platformasi foydalanuvchilarning shaxsiy ma'lumotlari xavfsizligini ta'minlashni muhim deb biladi.
                Telegram orqali tizimga kirganingizda faqat umumiy ma'lumotlar (Ism, Telegram ID va rasm) sessiya uchun saqlanadi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">2. Ma'lumotlardan foydalanish</h4>
              <p>
                Yig'ilgan ma'lumotlar faqatgina sizning kunlik so'z qidirish limitlaringizni boshqarish, o'quv natijalaringizni saqlash va
                platforma xizmatlarini yaxshilash uchun ishlatiladi. Ma'lumotlaringiz hech qachon uchinchi shaxslarga berilmaydi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">3. AI va Tahlil</h4>
              <p>
                So'z tahlillari uchun sun'iy intellekt modellari ishlatilishi mumkin. Ushbu modellardan olingan natijalar faqat ta'lim maqsadlari
                uchun foydalaniladi va shaxsiy ma'lumotlar bilan biriktirilmaydi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">4. Ma'lumot xavfsizligi</h4>
              <p>
                Barcha ma'lumotlar brauzeringizning localStorage'da saqlanadi va hech qachon serverga yubormaymiz. Sizding ma'lumotlaringiz
                faqat sizning qurilmangizda saqlanadi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">5. Ma'lumotni o'chirish</h4>
              <p>
                Siz lokal ma'lumotlaringizni brauzer sozlamalaridan yoki ilovani tozalash orqali o'chirishingiz mumkin. Ilova yangilangach
                ham, oldin saqlangan ma'lumotlar saqlan qoladi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">6. Aloqa</h4>
              <p>
                Maxfiylik siyosati bilan bog'liq savollaringiz bo'lsa, ilova ichidagi aloqa bo'limi yoki [admin@univebooster.com](mailto:admin@univebooster.com) orqali bog'laning.
              </p>
              <h4 className="text-sm font-bold text-lime-300">7. Siyosat yangilanishi</h4>
              <p>
                Ushbu maxfiylik siyosati vaqti bilan yangilanishi mumkin. Yangi versiya ilova ichida e'lon qilinadi va foydalanuvchilar
                yangilardan habarдар qilinadi.
              </p>
            </>
          ) : (
            <>
              <h4 className="text-sm font-bold text-lime-300">1. Foydalanish Shartlari (Terms of Service)</h4>
              <p>
                UniveBooster'dan foydalanish orqali siz ushbu qoidalarga rozilik bildirasiz. Platformadagi materiallar,
                sun'iy intellekt tahlillari va testlar faqat ta'lim maqsadlari uchun mo'ljallangan.
              </p>
              <h4 className="text-sm font-bold text-lime-300">2. Limitlar va Qoidabuzarlik</h4>
              <p>
                Har bir foydalanuvchi uchun belgilangan kunlik so'z qidirish limitlari mavjud. Tizimni avtomatlashtirilgan tarzda
                hakerlik qilish yoki yuklamani sun'iy oshirish taqiqlanadi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">3. Foydalanuvchi Sorablari</h4>
              <p>
                Sizning ilovaga kirguningiz va unga xabar yuborishingiz faqat ruxsat berganingizda bo'ladi. Ilova faqat ruxsat berilgan
                funksiyalarni bajarishi mumkin.
              </p>
              <h4 className="text-sm font-bold text-lime-300">4. Mao'qul Mavjudlar</h4>
              <p>
                Ilovadagi barcha kontent, jumladan matn, rasm, dizayn va kod, UniveBooster ning mulkiyatidir yoki ruxsat berilgan
                uchinchi tashkilotlar tomonidan taqdim etilgan.
              </p>
              <h4 className="text-sm font-bold text-lime-300">5. Cheklovlilik va Zarrarlar</h4>
              <p>
                Ilova "havola bilan" asosida taqdim etiladi. UniveBooster ilovadan kelib chiqqan yoki ilovadan foydalanish natijasida
                kelib chiqqan har qanday muddatli yoki ijobiy zarrarlar uchun javobgarmaslikni ta'minlaydi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">6. Hisoblarni Bloklash va Bekor Qilish</h4>
              <p>
                UniveBooster admini hizmatni taklif qilish, hakerlik yoki qoidabuzarlik tufayli hisobni bloklash yoki o'chirish huquqi
                ega.
              </p>
              <h4 className="text-sm font-bold text-lime-300">7. Aloqa</h4>
              <p>
                Foydalanish shartlari bilan bog'liq savollaringiz bo'lsa, ilova ichidagi aloqa bo'limi yoki [admin@univebooster.com](mailto:admin@univebooster.com) orqali bog'laning.
              </p>
              <h4 className="text-sm font-bold text-lime-300">8. Shartlar Yangilanishi</h4>
              <p>
                Ushbu foydalanish shartlari vaqti bilan yangilanishi mumkin. Yangi versiya ilova ichida e'lon qilinadi va foydalanuvchilar
                yangilardan habarдар qilinadi.
              </p>
            </>
          )}
        </div>

        {/* Pastki tugma */}
        <div className="pt-4 mt-4 border-t border-lime-400/15 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:shadow-[0_0_25px_rgba(132,204,22,0.5)] text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            Tushunarli
          </button>
        </div>

      </div>
    </div>
  );
}