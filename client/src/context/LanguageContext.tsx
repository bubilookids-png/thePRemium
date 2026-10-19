// client/src/context/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppLanguage = 'uz' | 'en';

export interface Translations {
  // Navigation / Sidebar
  navNewLookup: string;
  navWordBlitz: string;
  navTranslator: string;
  navRetentionReading: string;
  navSavedWords: string;
  navSettings: string;
  navGetMore: string;
  navOnline: string;
  navCollapse: string;
  navExpand: string;

  // Header
  home: string;
  goToTrainer: string;
  logout: string;
  loginTelegram: string;

  // Hero & HUD
  tryFirstWord: string;
  vocabLabActive: string;
  readyToTrain: string;
  yourProgress: string;
  reset24: string;
  reset48: string;
  freePlan: string;
  vipPlan: string;
  wordsAnalyzed: string;
  ofWords: string;
  leftWords: string;
  dailyGoal: string;
  notSet: string;
  setGoal: string;
  quickPick: string;
  goalReached: string;
  keepGoing: string;
  limitReached: string;
  wordsToGo: string;
  goalWords: string;

  // Word Analysis Form
  analyzeTitle: string;
  analyzeSubtitle: string;
  wordInputLabel: string;
  wordInputPlaceholder: string;
  translateIntoLabel: string;
  analyzeButton: string;
  analyzingButton: string;
  youEntered: string;
  pronounceWord: string;

  // Analysis Cards
  wordOverview: string;
  essentialsAtGlance: string;
  saveWord: string;
  savingWord: string;
  savedWord: string;
  startMiniQuiz: string;
  definitionEnglish: string;
  translationLabel: string;
  synonyms: string;
  synonymsSub: string;
  noSynonyms: string;
  antonyms: string;
  antonymsSub: string;
  noAntonyms: string;
  collocations: string;
  collocationsSub: string;
  noCollocations: string;
  examples: string;
  examplesSub: string;
  noExamples: string;
  howUsed: string;
  usageSub: string;
  usageNotes: string;
  mistakesSub: string;
  noMistakes: string;

  // Neural Matrix
  neuralMatrix: string;
  lexicalActive: string;
  serverSleeping: string;
  serverWaking: string;
  wakeServerAction: string;

  // Settings Page
  settingsTitle: string;
  settingsSubtitle: string;
  generalSettings: string;
  interfaceLanguage: string;
  interfaceLanguageDesc: string;
  siteTheme: string;
  siteThemeDesc: string;
  themeLime: string;
  themeEditorial: string;
  bgAnimation: string;
  bgAnimationDesc: string;
  stateOn: string;
  stateOff: string;
  serverSection: string;
  serverSectionDesc: string;
  serverStatus: string;
  serverWakeBtn: string;
  serverLiveDesc: string;
  serverSleepingDesc: string;
  serverWakingDesc: string;
  accountSection: string;
  accountDesc: string;
  dailyLimit: string;
  planType: string;
}

const translations: Record<AppLanguage, Translations> = {
  en: {
    // Nav
    navNewLookup: 'New Lookup',
    navWordBlitz: 'Word Blitz',
    navTranslator: 'Translator',
    navRetentionReading: 'Retention Reading',
    navSavedWords: 'My Saved Words',
    navSettings: 'Settings',
    navGetMore: 'Get More',
    navOnline: 'ONLINE',
    navCollapse: 'Collapse sidebar',
    navExpand: 'Expand sidebar',

    // Header
    home: 'Home',
    goToTrainer: 'Go to Trainer',
    logout: 'Logout',
    loginTelegram: 'Login with Telegram',

    // Hero & HUD
    tryFirstWord: 'Try your first word',
    vocabLabActive: 'Vocabulary Lab\nActive.',
    readyToTrain: 'Ready to train,\n',
    yourProgress: 'Your progress',
    reset24: 'Resets every 24 hours',
    reset48: 'Resets every 48 hours',
    freePlan: 'Free plan',
    vipPlan: 'VIP',
    wordsAnalyzed: 'Words analyzed',
    ofWords: 'of',
    leftWords: 'left',
    dailyGoal: 'Daily goal',
    notSet: 'Not set',
    setGoal: 'Set goal',
    quickPick: 'Quick pick:',
    goalReached: 'Goal reached. Nice work.',
    keepGoing: 'Keep going, one word at a time.',
    limitReached: 'Limit reached',
    wordsToGo: 'to go',
    goalWords: 'Goal',

    // Word Form
    analyzeTitle: 'Analyze a word',
    analyzeSubtitle: 'Enter a word or short phrase and let AI build your study card',
    wordInputLabel: 'English word / term',
    wordInputPlaceholder: 'Try "resilient" or "take off"',
    translateIntoLabel: 'Translate into',
    analyzeButton: 'Analyze word →',
    analyzingButton: 'Analyzing...',
    youEntered: 'You entered:',
    pronounceWord: 'Pronounce word',

    // Analysis Cards
    wordOverview: 'Word overview',
    essentialsAtGlance: 'The essentials at a glance',
    saveWord: 'Save Word',
    savingWord: 'Saving...',
    savedWord: 'Saved',
    startMiniQuiz: '✦ Start mini quiz',
    definitionEnglish: 'Definition · English',
    translationLabel: 'Translation',
    synonyms: 'Synonyms',
    synonymsSub: 'Similar meaning',
    noSynonyms: 'No common synonyms provided.',
    antonyms: 'Antonyms',
    antonymsSub: 'Opposite meaning',
    noAntonyms: 'No common antonyms provided.',
    collocations: 'Common collocations',
    collocationsSub: 'Natural word combinations',
    noCollocations: 'No collocations provided.',
    examples: 'Natural examples',
    examplesSub: 'See the word in real context',
    noExamples: 'No examples provided.',
    howUsed: 'How it’s used',
    usageSub: 'Usage guidance',
    usageNotes: 'Usage notes',
    mistakesSub: 'Common mistakes to avoid',
    noMistakes: 'No common mistakes listed.',

    // Neural Matrix
    neuralMatrix: 'NEURAL MATRIX',
    lexicalActive: 'Lexical graph active',
    serverSleeping: 'Server sleeping · Click to wake',
    serverWaking: 'Waking AI server instance...',
    wakeServerAction: 'Wake AI Server',

    // Settings
    settingsTitle: 'Settings & Preferences',
    settingsSubtitle: 'Customize your interface language, visual theme, and system options',
    generalSettings: 'App Preferences',
    interfaceLanguage: 'Interface Language',
    interfaceLanguageDesc: 'Switch the entire app navigation and control labels between English and Uzbek.',
    siteTheme: 'Color Theme',
    siteThemeDesc: 'Select your preferred visual aesthetic for the interface.',
    themeLime: 'Neon Lime & Ocean (Classic)',
    themeEditorial: 'Editorial Milk & Claude Journal',
    bgAnimation: 'Background Wave Animation',
    bgAnimationDesc: 'Toggle the interactive WebGL fluid waves simulation on or off to save battery or prefer minimal design.',
    stateOn: 'Enabled',
    stateOff: 'Disabled',
    serverSection: 'AI Server Diagnostics',
    serverSectionDesc: 'The AI backend is hosted on Render free tier, which goes into sleep mode after 15 minutes of inactivity.',
    serverStatus: 'Render Server Status',
    serverWakeBtn: 'Wake AI Server',
    serverLiveDesc: 'Server is running smoothly and ready for instant requests.',
    serverSleepingDesc: 'Server is currently hibernating to save resources.',
    serverWakingDesc: 'Sending wake ping to Render server... (usually takes 30-50s)',
    accountSection: 'Account & Quota',
    accountDesc: 'Your session and learning statistics.',
    dailyLimit: 'Daily Analysis Limit',
    planType: 'Plan Type',
  },
  uz: {
    // Nav
    navNewLookup: 'Yangi qidiruv',
    navWordBlitz: 'Word Blitz',
    navTranslator: 'Tezkor tarjimon',
    navRetentionReading: 'Retention Reading',
    navSavedWords: 'Saqlangan so\'zlarim',
    navSettings: 'Sozlamalar',
    navGetMore: 'VIP Imkoniyatlar',
    navOnline: 'ONLAYN',
    navCollapse: 'Sidebarni yopish',
    navExpand: 'Sidebarni ochish',

    // Header
    home: 'Bosh sahifa',
    goToTrainer: 'Trainerga o\'tish',
    logout: 'Chiqish',
    loginTelegram: 'Telegram orqali kirish',

    // Hero & HUD
    tryFirstWord: 'Birinchi so\'zni sinab ko\'ring',
    vocabLabActive: 'Lug\'at laboratoriyasi\nFaol.',
    readyToTrain: 'Mashg\'ulotga tayyor,\n',
    yourProgress: 'Sizning natijangiz',
    reset24: 'Har 24 soatda yangilanadi',
    reset48: 'Har 48 soatda yangilanadi',
    freePlan: 'Oddiy tarif',
    vipPlan: 'VIP',
    wordsAnalyzed: 'Tahlil qilingan so\'zlar',
    ofWords: 'dan',
    leftWords: 'ta qoldi',
    dailyGoal: 'Kunlik maqsad',
    notSet: 'O\'rnatilmagan',
    setGoal: 'Maqsad qo\'yish',
    quickPick: 'Tezkor tanlov:',
    goalReached: 'Maqsadga erishildi! Ajoyib natija.',
    keepGoing: 'Davom eting, bitta so\'zdan o\'rganing.',
    limitReached: 'Limit tugadi',
    wordsToGo: 'ta qoldi',
    goalWords: 'Maqsad',

    // Word Form
    analyzeTitle: 'So\'zni tahlil qilish',
    analyzeSubtitle: 'So\'z yoki qisqa ibora kiriting va AI batafsil o\'rganish kartasini tuzib beradi',
    wordInputLabel: 'Inglizcha so\'z / ibora',
    wordInputPlaceholder: 'Masalan: "resilient" yoki "take off"',
    translateIntoLabel: 'Qaysi tilga tarjima:',
    analyzeButton: 'So\'zni tahlil qilish →',
    analyzingButton: 'Tahlil qilinmoqda...',
    youEntered: 'Kiritilgan so\'z:',
    pronounceWord: 'Talaffuzni tinglash',

    // Analysis Cards
    wordOverview: 'So\'z haqida ma\'lumot',
    essentialsAtGlance: 'Asosiy tushunchalar bir qarashda',
    saveWord: 'So\'zni saqlash',
    savingWord: 'Saqlanmoqda...',
    savedWord: 'Saqlandi',
    startMiniQuiz: '✦ Mini-testni boshlash',
    definitionEnglish: 'Ta\'rif · Inglizcha',
    translationLabel: 'Tarjima',
    synonyms: 'Sinonimlar',
    synonymsSub: 'O\'xshash ma\'noli so\'zlar',
    noSynonyms: 'Umumiy sinonimlar topilmadi.',
    antonyms: 'Antonimlar',
    antonymsSub: 'Qarama-qarshi ma\'noli so\'zlar',
    noAntonyms: 'Umumiy antonimlar topilmadi.',
    collocations: 'Kollokatsiyalar (Birikmalar)',
    collocationsSub: 'Nutqda tabiiy birikmalar',
    noCollocations: 'Birikmalar mavjud emas.',
    examples: 'Haqiqiy misollar',
    examplesSub: 'So\'zni real kontekstda ko\'ring',
    noExamples: 'Misollar berilmagan.',
    howUsed: 'Qanday ishlatiladi',
    usageSub: 'Foydalanish bo\'yicha ko\'rsatma',
    usageNotes: 'Muhim eslatmalar',
    mistakesSub: 'Ko\'p uchraydigan xatolar',
    noMistakes: 'Ko\'p uchraydigan xatolar yo\'q.',

    // Neural Matrix
    neuralMatrix: 'NEURAL MATRIX',
    lexicalActive: 'Leksik grafik faol',
    serverSleeping: 'Server uyquda · Uyg\'otish uchun bosing',
    serverWaking: 'AI server uyg\'otilmoqda...',
    wakeServerAction: 'AI Serverni uyg\'otish',

    // Settings
    settingsTitle: 'Sozlamalar va Tanlovlar',
    settingsSubtitle: 'Interfeys tili, vizual mavzu va tizim parametrlarini o\'zingizga moslang',
    generalSettings: 'Dastur sozlamalari',
    interfaceLanguage: 'Interfeys tili',
    interfaceLanguageDesc: 'Butun saytdagi tugmalar, menyular va matnlarni o\'zbek yoki ingliz tilida ko\'rsatish.',
    siteTheme: 'Dizayn mavzusi',
    siteThemeDesc: 'Interfeys uchun qulay va chiroyli ranglar uyg\'unligini tanlang.',
    themeLime: 'Neon Lime & Ocean (Klassik)',
    themeEditorial: 'Editorial Milk & Klod Jurnali',
    bgAnimation: 'Orqa fon to\'lqin animatsiyasi',
    bgAnimationDesc: 'Batareyani tejash yoki tinch dizayn uchun WebGL to\'lqinlarini yoqing yoki o\'chiring.',
    stateOn: 'Yoqilgan',
    stateOff: 'O\'chirilgan',
    serverSection: 'AI Server holati (Render)',
    serverSectionDesc: 'AI backend Render bepul rejimida ishlaydi va 15 daqiqa murojaat bo\'lmasa uyquga ketadi.',
    serverStatus: 'Render Server holati',
    serverWakeBtn: 'Serverni uyg\'otish',
    serverLiveDesc: 'Server faol va so\'rovlarni qabul qilishga to\'liq tayyor.',
    serverSleepingDesc: 'Server ayni damda resurslarni tejash uchun uyqu holatida.',
    serverWakingDesc: 'Render serveriga signal yuborilmoqda... (odatda 30-50 soniya oladi)',
    accountSection: 'Hisob va Limitlar',
    accountDesc: 'Sizning qidiruv limitlaringiz va o\'quv statistikangiz.',
    dailyLimit: 'Kunlik tahlil limiti',
    planType: 'Tarif turi',
  },
};

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('vacabbro_lang');
      if (saved === 'uz' || saved === 'en') {
        return saved;
      }
    } catch {}
    return 'uz'; // Default to Uzbek or user preference
  });

  useEffect(() => {
    try {
      localStorage.setItem('vacabbro_lang', language);
    } catch {}
  }, [language]);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'uz' ? 'en' : 'uz'));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
