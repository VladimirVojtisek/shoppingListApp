import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import your translation files
import translationEN from './locales/en/translation.json';
import translationCS from './locales/cz/translation.json';

// the translations
const resources = {
  en: {
    translation: translationEN
  },
  cs: {
    translation: translationCS
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, usually determined by browser settings or user selection
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
