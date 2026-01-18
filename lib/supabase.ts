import { createClient } from '@supabase/supabase-js';

// Project ID-gaaga
const supabaseUrl = 'https://bzjgtbdpynwjrvfdcgdr.supabase.co';

// API Key-ga aad soo dirtay
const supabaseKey = 'sb_publishable_5bEP0b7c84NrooTO0vLd2Q_OD9d6Bg1'; 

export const supabase = createClient(supabaseUrl, supabaseKey);

/*
=========================================
HAGAAYNTA KHALADKA (SQL REPAIR)
=========================================
Haddii aad aragto cilada "Could not find the 'balance' column", 
fadlan koobi garee koodka hoose oo ku orod (RUN) SQL Editor:

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS balance numeric DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS "paidAmount" numeric DEFAULT 0;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS "patientId" text;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS "patientName" text;

-- Tani waxay dib u cusbooneysiinaysaa cache-ga database-ka
NOTIFY pgrst, 'reload schema';
*/
