import fs from 'fs';

let content = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');
content = `import React, { useState } from 'react';
import { UserProfile } from '../types';
import { translations, Language } from '../utils/i18n';
import { User, Mail, Lock, Sparkles, Check, ArrowRight, ShieldCheck, Globe, AlertCircle, LogOut, X } from 'lucide-react';
import { AppLogoIcon } from './AppLogo';
import { supabase } from '../lib/supabase';

` + content.substring(content.indexOf('interface AuthModalProps'));
fs.writeFileSync('src/components/AuthModal.tsx', content);
