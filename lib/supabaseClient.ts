import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bjgyflblgdiaclnlksui.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZ3lmbGJsZ2RpYWNsbmxrc3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNTgzMzAsImV4cCI6MjA2NzczNDMzMH0.ej5_C1GB2OIt4v5b2in0OZPSToSqr2SmkiQ0nX6ghvU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 