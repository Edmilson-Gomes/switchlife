function requireEnv(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Variável de ambiente ${key} não configurada. Copie .env.example para .env e preencha os valores do seu projeto Supabase.`,
    )
  }
  return value
}

export const env = {
  supabaseUrl: requireEnv('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: requireEnv(
    'VITE_SUPABASE_ANON_KEY',
    import.meta.env.VITE_SUPABASE_ANON_KEY,
  ),
  basePath: import.meta.env.VITE_APP_BASE_PATH ?? '/switchlife/',
}
