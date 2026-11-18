import type { Lang } from './data';

/** Web-app URL of the Google Apps Script that e-mails the team (see forms/apps-script.gs). The destination e-mails live only inside that script, never in this code. */
export const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxFx4JJ7RHyameeDl7-Pb17rz3J7Ke2kvAcyRdE7OPoIf3YfOENEm6jYG_Wd196N4zi/exec';

export const SEND_FAIL: Record<Lang, string> = {
  en: 'We could not send your request. Please try again or contact us on WhatsApp.',
  es: 'No hemos podido enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.',
  zh: '发送失败，请重试或通过 WhatsApp 联系我们。',
  ru: 'Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в WhatsApp.',
  ar: 'تعذّر إرسال طلبك. حاول مرة أخرى أو راسلنا عبر واتساب.',
};

/** Sends a form to the team. Resolves true on success. Without an endpoint it only simulates (prototype). */
export async function sendForm(site: string, ref: string, fields: Record<string, string>, lang: Lang, hp = ''): Promise<boolean> {
  if (hp) return true; // honeypot filled: pretend success, send nothing
  if (!FORM_ENDPOINT) return true;
  try {
    await fetch(FORM_ENDPOINT, {
      method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ site, ref, lang, page: location.href, fields }),
    });
    return true;
  } catch { return false; }
}
