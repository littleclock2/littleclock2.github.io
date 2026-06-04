import { inject, computed } from 'vue'
import { locale as localeRef, setLocale as setLocaleFn, t as rawT, messages } from '../i18n.js'

const LOCALE_KEY = '__terminus_locale__'

export function provideI18n(app) {
  // Create a deeply-nested computed translations object.
  // Accessing e.g. T.editor.btn.edit triggers locale dependency tracking.
  const T = computed(() => messages[localeRef.value] || messages['zh-CN'])
  app.provide(LOCALE_KEY, { locale: localeRef, setLocale: setLocaleFn, T, messages })
}

export function useI18n() {
  const ctx = inject(LOCALE_KEY)
  if (!ctx) {
    return {
      locale: localeRef,
      setLocale: setLocaleFn,
      t: (key) => rawT(key),
      T: computed(() => messages[localeRef.value] || messages['zh-CN']),
      availableLocales: Object.keys(messages),
    }
  }
  return {
    locale: ctx.locale,
    setLocale: ctx.setLocale,
    t: (key) => rawT(key),
    T: ctx.T,
    availableLocales: Object.keys(messages),
  }
}
