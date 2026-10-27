import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ynsmqyrpmvawtbjusexb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inluc21xeXJwbXZhd3RianVzZXhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMDI5ODMsImV4cCI6MjEwODY3ODk4M30.9udzDUsXRWcaHoZ8MHmG7bishdO1GkLq1iO3wtNBmMI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);