import fs from 'fs';

let content = fs.readFileSync('src/services/paymentProcessor.ts', 'utf8');

content = content.replace(
  "import { db, doc, setDoc } from '../lib/firebase';",
  "import { supabase } from '../lib/supabase';"
);

content = content.replace(
  /const txRef = doc\(db, 'transactions', txId\);\n\s*await setDoc\(txRef, \{[\s\S]*?\}\);/,
  `await supabase.from('transactions').insert({
        id: txId,
        user_id: user.uid,
        user_email: user.email,
        user_name: user.name,
        type: transaction.type,
        amount: transaction.amount,
        currency_code: transaction.currencyCode,
        status: transaction.status,
        created_at: transaction.createdAt
      });`
);

fs.writeFileSync('src/services/paymentProcessor.ts', content);
