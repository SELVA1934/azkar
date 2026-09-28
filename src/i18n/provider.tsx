"use client";

import { createContext, useContext, type ReactNode } from "react";
import { dirOf, getDict, type Locale, type LocaleDict } from "./index";

type I18nValue = { locale: Locale; dict: LocaleDict; dir: "rtl" | "ltr" };

const I18nContext = createContext<I18nValue>({ locale: "en", dict: getDict("en"), dir: "ltr" });

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, dict: getDict(locale), dir: dirOf(locale) }}>{children}</I18nContext.Provider>;
}

/** Read the active locale and dictionary from a client component. */
export function useI18n(): I18nValue {
  return useContext(I18nContext);
}
