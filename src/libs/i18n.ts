import { getRequestConfig } from 'next-intl/server';
import { routing } from './i18nRouting';

// i18n loader with graceful fallback:
// - Loads messages for the requested locale.
// - Falls back to English for missing keys.
// - In development, logs missing keys to help contributors find what needs translation.

function deepMergeWithFallback<T extends Record<string, any>>(base: T, override: T, missing: string[] = [], path: string[] = []): T {
  const out: any = Array.isArray(base) ? [...base] : { ...base };
  for (const key of Object.keys(override || {})) {
    const nextPath = [...path, key];
    if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key]) && base[key] && typeof base[key] === 'object') {
      out[key] = deepMergeWithFallback(base[key], override[key], missing, nextPath);
    } else {
      out[key] = override[key];
    }
  }
  for (const key of Object.keys(base || {})) {
    if (!(key in (override || {}))) {
      out[key] = base[key];
      missing.push([...path, key].join('.'));
    }
  }
  return out as T;
}

// Using internationalization in Server Components
export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Validate that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  // Always load English as the base
  const enMessages = (await import(`../locales/en.json`)).default as Record<string, any>;
  // Try loading requested locale; if same as en, use en
  const requestedMessages = locale === 'en' ? enMessages : (await import(`../locales/${locale}.json`)).default;

  const missingKeys: string[] = [];
  const merged = deepMergeWithFallback(enMessages, requestedMessages, missingKeys);

  if (process.env.NODE_ENV !== 'production' && missingKeys.length > 0) {
    // Helpful log for contributors to see what needs translation for current locale
    console.warn(`[i18n] Missing translations for locale "${locale}":\n${missingKeys.map(k => ` - ${k}`).join('\n')}`);
  }

  return {
    locale,
    messages: merged,
  };
});
