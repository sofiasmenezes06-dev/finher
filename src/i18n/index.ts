import { ptBR, type Messages } from "./pt-BR";

export type Locale = "pt-BR";

const locales: Record<Locale, Messages> = { "pt-BR": ptBR };

export const defaultLocale: Locale = "pt-BR";

/** Current messages. Swap to a context provider when a second locale is added. */
export function useT(): Messages {
  return locales[defaultLocale];
}

/** Format a YYYY-MM-DD date for display (e.g. 17/10/2026 in pt-BR). */
export function formatDay(iso: string, locale: string = locales[defaultLocale].locale): string {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(locale);
}

/** Fill {placeholders} in a message string. */
export function fmt(message: string, vars: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
}

export type { Messages };
