// Importa dotenv para leer el archivo .env
import dotenv from 'dotenv';
// Importa la función createClient del cliente oficial de Supabase
import { createClient } from '@supabase/supabase-js';

// Carga las variables de entorno
dotenv.config(); 

// Obtén las variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Verifica que las claves existen
if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ ERROR: Faltan las variables de entorno de Supabase (SUPABASE_URL o SUPABASE_SERVICE_KEY).");
  throw new Error("Credenciales de Supabase no encontradas. Verifica tu archivo .env");
}

// Inicializa el cliente de Supabase con la Service Role Key (para backend)
// y lo exporta. Este es el objeto que usarás para todas tus consultas.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("✅ Cliente de Supabase inicializado y conectado.");

// NOTA IMPORTANTE: 
// Ya no necesitarás la función 'query' antigua. 
// Ahora, en otros archivos, usa 'supabase.from("tabla").select()'