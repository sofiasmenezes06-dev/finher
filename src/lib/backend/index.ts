import { createDemoBackend } from "./demo";
import { createSupabaseBackend } from "./supabase";
import type { Backend } from "./types";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const backend: Backend = url && anonKey ? createSupabaseBackend(url, anonKey) : createDemoBackend();

export * from "./types";
