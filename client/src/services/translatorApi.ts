// src/services/translatorApi.ts

export async function translateText(text: string, targetLang: string = 'uz'): Promise<string> {
  if (!text.trim()) return '';

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Tarjima qilishda xatolik yuz berdi');
  }

  const data = await response.json();
  // Google GTX bo'laklab qaytargan jumlalarni bitta qilib birlashtiramiz
  return data[0].map((item: any) => item[0]).join('');
}