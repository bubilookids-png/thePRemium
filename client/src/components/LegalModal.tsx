import React, { useState, useRef } from 'react';
import { useAnimatedDismiss, useMotionEntrance } from '../utils/motion';

interface LegalModalProps {
  onClose: () => void;
  initialTab?: 'privacy' | 'terms';
}

export function LegalModal({ onClose, initialTab }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab ?? 'privacy');
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dismiss = useAnimatedDismiss(overlayRef, panelRef, onClose);
  useMotionEntrance(panelRef, true);
  useMotionEntrance(contentRef, activeTab);

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-mono">
      <div ref={panelRef} className="relative w-full max-w-2xl max-h-[85vh] flex flex-col p-6 sm:p-8 rounded-3xl bg-slate-950 border border-lime-400/20 shadow-2xl text-slate-100">

        {/* Yopish tugmasi */}
        <button
          onClick={() => dismiss()}
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
        <div ref={contentRef} className="flex-1 overflow-y-auto pr-2 space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
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
                platforma xizmatlarini yaxshilash uchun ishlatiladi. Ma'lumotlaringiz hech qachon uchinchi shaxslarga sotilmaydi yoki noqonuniy berilmaydi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">3. AI va Model O'qitishdan Himoya (Model Training Opt-Out)</h4>
              <p>
                So'z tahlillari va ta'limiy mashqlar uchun zamonaviy sun'iy intellekt modellaridan foydalaniladi. Foydalanuvchilar qidirgan shaxsiy so'zlar, o'quv yozuvlari yoki profil ma'lumotlari uchinchi tomon AI modellarini (OpenAI, Google Gemini, Groq) o'qitish (train qilish) uchun ishlatilmaydi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">4. Xavfsizlik va Botdan Himoya (Bot Detection)</h4>
              <p>
                Platforma avtomatlashtirilgan spam va soxta bot so'rovlaridan himoyalanish uchun ochiq manbali brauzer darajasidagi
                FingerprintJS BotD kutubxonasidan (<code className="text-lime-300 font-bold">monitoring: false</code> parametrida) foydalanadi.
                Ushbu tekshiruv faqat brauzeringiz ichida lokal bajariladi, uchinchi tomon serverlariga tahliliy ma'lumotlar yubormaydi,
                doimiy visitor barmoq izi (fingerprint) saqlamaydi va reklama cookie fayllarini ishlatmaydi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">5. Ma'lumot xavfsizligi</h4>
              <p>
                Barcha ma'lumotlar brauzeringizning localStorage'da saqlanadi va hech qachon shaxsiy parollarni saqlamaymiz. Sizning ma'lumotlaringiz
                faqat sizning qurilmangizda saqlanadi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">6. Ma'lumotlarga kirish va ularni o'chirish (GDPR huquqlari)</h4>
              <p>
                Foydalanuvchilar istalgan vaqtda o'z shaxsiy o'quv ma'lumotlarini yuklab olish (Download Data) hamda Sozlamalar (Settings) bo'limi orqali hisob va barcha saqlangan so'zlar tarixini to'liq qaytarib bo'lmas darajada o'chirish (Delete Account & Data) huquqiga ega.
              </p>
              <h4 className="text-sm font-bold text-lime-300">7. Aloqa</h4>
              <p>
                Maxfiylik siyosati bilan bog'liq savollaringiz bo'lsa, ilova ichidagi aloqa bo'limi yoki [admin@univebooster.com](mailto:admin@univebooster.com) orqali bog'laning.
              </p>
              <h4 className="text-sm font-bold text-lime-300">8. Siyosat yangilanishi</h4>
              <p>
                Ushbu maxfiylik siyosati vaqti bilan yangilanishi mumkin. Yangi versiya ilova ichida e'lon qilinadi va foydalanuvchilar
                yangilardan xabardor qilinadi.
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
              <h4 className="text-sm font-bold text-lime-300">3. Sun'iy Intellekt Mas'uliyati (AI Disclaimer & Liability)</h4>
              <p>
                Platformadagi so'z tahlillari, CEFR darajalari, misol gaplar va tushuntirishlar sun'iy intellekt (AI) orqali shakllantiriladi. Sun'iy intellekt xato yoki noaniqliklar (hallucinations) keltirib chiqarishi ehtimoli mavjud. Berilgan materiallar faqat ko'makchi ta'lim vositasi bo'lib, UniveBooster yuzaga kelishi mumkin bo'lgan lingvistik yoki mazmuniy noaniqliklar uchun to'liq yuridik javobgarlikni o'z zimmasiga olmaydi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">4. Mualliflik Huquqlari</h4>
              <p>
                Ilovadagi barcha dasturiy kod, interfeys dizaynlari va tuzilma UniveBooster ning mulki hisoblanadi. Ochiq manbali kutubxonalar o'zlarining tegishli litsenziyalari (MIT, Apache va h.k.) doirasida ishlatiladi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">5. Kafolatning Cheklanishi</h4>
              <p>
                Ilova "boricha" (as-is) taqdim etiladi. UniveBooster platformadan foydalanish yoki undan foydalana olmaslik tufayli kelib chiqqan bilvosita yoki tasodifiy zararlar uchun qonun ruxsat bergan maksimal darajada javobgarlikdan ozod etiladi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">6. Hisoblarni Bloklash va Bekor Qilish</h4>
              <p>
                UniveBooster ma'muriyati xizmat barqarorligini saqlash, qasddan qilingan hujumlar yoki qoidabuzarlik holatlarida hisoblarni ogohlantirishsiz to'xtatish yoki cheklash huquqini saqlab qoladi.
              </p>
              <h4 className="text-sm font-bold text-lime-300">7. Aloqa</h4>
              <p>
                Foydalanish shartlari bilan bog'liq savollaringiz bo'lsa, ilova ichidagi aloqa bo'limi yoki [admin@univebooster.com](mailto:admin@univebooster.com) orqali bog'laning.
              </p>
              <h4 className="text-sm font-bold text-lime-300">8. Shartlar Yangilanishi</h4>
              <p>
                Ushbu foydalanish shartlari vaqti bilan yangilanishi mumkin. Yangilangan versiya saytda e'lon qilingan paytdan boshlab kuchga kiradi.
              </p>
            </>
          )}
        </div>

        {/* Pastki tugma */}
        <div className="pt-4 mt-4 border-t border-lime-400/15 flex justify-end">
          <button
            onClick={() => dismiss()}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-lime-400 to-cyan-400 hover:shadow-[0_0_25px_rgba(132,204,22,0.5)] text-slate-950 font-bold text-xs transition cursor-pointer"
          >
            Tushunarli
          </button>
        </div>

      </div>
    </div>
  );
}
