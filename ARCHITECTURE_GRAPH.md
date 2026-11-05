# 1startup (UniveBooster) — Architectural Knowledge Graph

Bu fayl loyihaning doimiy me'moriy xaritasi hisoblanadi. Agent har safar butun papkalarni qayta o'qib o'tirmasdan, quyidagi aniq xaritadan foydalanadi:

## 1. Loyiha Turi & Stek
- **Frontend (Client):** React + Vite + Tailwind CSS + TypeScript (client/)
- **Backend (Server):** Node.js + Express + TypeScript (server/)
- **Baza (Database):** Turso (libsql / SQLite) + mahalliy dictionary.db

## 2. Asosiy Modullar va Yo'llar

### Frontend (client/src/)
- App.tsx: Asosiy marshrutlash va umumiy ilova qobig'i.
- main.tsx: React DOM mount nuqtasi.
- components/: UI komponentlari:
  - AnalysisView.tsx: AI so'z tahlili natijalari oynasi.
  - ActiveRecallWidget.tsx: Takrorlash va yodlash vidjeti.
  - RetentionReading.tsx: Matn o'qish va so'z boyligini oshirish interfeysi.
  - AiLoader.tsx, Alert.tsx, BorderGlow.css: Yordamchi UI elementlari.

### Backend (server/)
- index.ts: Serverning asosiy kirish nuqtasi (Express app).
- outes/: API endpointlari (Lug'at qidiruvi, AI tahlil so'rovlari, foydalanuvchi ma'lumotlari).
- db/: Turso Cloud va SQLite ulanishlari, jadvallar sxemasi.
- services/: Tashqi servislar (Gemini, Groq, Turso sinxronizatsiyasi).
- utils/ & 	ypes/: Umumiy yordamchi funksiyalar va TypeScript tiplari.

## 3. Qoida (Rule for Agent)
- Loyiha bo'yicha vazifa berilganda, butun loyihani qayta skaner qilish yoki ead_file bilan hamma fayllarni ochish QAT'IYAN TAQIQLANADI.
- O'zgarishlar faqat yuqoridagi xaritada ko'rsatilgan aniq fayllarga to'g'ridan-to'g'ri kiritiladi.
