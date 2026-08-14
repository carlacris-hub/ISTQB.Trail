import React, { useState } from 'react';
import { UserProfile } from '../types';
import { PRESET_AVATARS, getStoredColleagues } from '../utils/socialStorage';
import { AVATAR_ICON_OPTIONS, AVATAR_COLOR_OPTIONS, generateAvatarSvg } from '../utils/avatarUtils';
import { COUNTRY_PRICING_MAP } from '../utils/pricing';
import { validateUsername, generateBaseUsername } from '../utils/usernameUtils';
import { checkUsernameTakenInFirestore } from '../utils/firestoreService';
import { X, User, Image, Save, Sparkles, Check, Globe, AtSign, AlertCircle, Palette } from 'lucide-react';
import { translations } from '../utils/i18n';
import { resizeAndCompressImage } from '../utils/imageCompression';
import { uploadAvatar } from '../lib/supabase';

interface EditProfileModalProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose }) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const [name, setName] = useState(user.name || '');
  const [username, setUsername] = useState(
    user.username || generateBaseUsername(user.name || user.email)
  );
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const [country, setCountry] = useState(user.country || 'BR');
  const [company, setCompany] = useState(user.company || '');
  const [bio, setBio] = useState(user.bio || '');
  const [selectedIcon, setSelectedIcon] = useState<'bug' | 'jira' | 'shield' | 'terminal' | 'target' | 'flask'>('bug');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLOR_OPTIONS[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(
    user.avatarUrl || PRESET_AVATARS[0].url
  );
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg('');

    try {
      const compressedBlob = await resizeAndCompressImage(file);
      const publicUrl = await uploadAvatar(user.id || user.uid, compressedBlob);
      
      if (publicUrl) {
        setCustomAvatarUrl(publicUrl);
        setSelectedAvatar(publicUrl);
      } else {
        throw new Error("Failed to upload image");
      }
    } catch (err: any) {
      console.error('Image processing error:', err);
      setErrorMsg(t.error || 'Erro ao processar imagem.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleColorSelect = (colorOpt: typeof AVATAR_COLOR_OPTIONS[0]) => {
    setSelectedColor(colorOpt);
    const newSvgUrl = generateAvatarSvg(selectedIcon, colorOpt.bgHex, colorOpt.accentHex);
    setSelectedAvatar(newSvgUrl);
    setCustomAvatarUrl('');
  };

  const handleIconSelect = (iconType: 'bug' | 'jira' | 'shield' | 'terminal' | 'target' | 'flask') => {
    setSelectedIcon(iconType);
    const newSvgUrl = generateAvatarSvg(iconType, selectedColor.bgHex, selectedColor.accentHex);
    setSelectedAvatar(newSvgUrl);
    setCustomAvatarUrl('');
  };

  const handleUsernameChange = (val: string) => {
    // Strip non-alphanumeric characters instantly
    const clean = val.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    setUsername(clean);
    
    // Clear previous error
    const validation = validateUsername(clean, lang);
    if (!validation.isValid) {
      setUsernameError(validation.error || null);
    } else {
      setUsernameError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validate Username
    const cleanUsername = username.trim().toLowerCase();
    const valResult = validateUsername(cleanUsername, lang);
    if (!valResult.isValid) {
      setUsernameError(valResult.error || 'Username inválido.');
      return;
    }

    // 2. Check local colleagues list for uniqueness
    const storedColleagues = getStoredColleagues();
    const takenLocally = storedColleagues.some(
      c => c.id !== user.id && c.username?.toLowerCase() === cleanUsername
    );

    if (takenLocally) {
      setUsernameError(
        lang === 'en' 
          ? 'This @username is already taken. Please choose another.' 
          : 'Este @username já está em uso por outro usuário. Escolha outro.'
      );
      return;
    }

    // 3. Check Firestore for uniqueness if logged in
    setIsCheckingUsername(true);
    const takenInFirestore = await checkUsernameTakenInFirestore(cleanUsername, user.uid || user.id);
    setIsCheckingUsername(false);

    if (takenInFirestore) {
      setUsernameError(
        lang === 'en' 
          ? 'This @username is already registered by another account.' 
          : 'Este @username já está cadastrado por outra conta.'
      );
      return;
    }

    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;
    
    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      username: cleanUsername,
      country: country,
      company: company.trim(),
      bio: bio.trim(),
      avatarUrl: finalAvatar,
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-extrabold text-white">{t.editProfile}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Avatar Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 block">
                {lang === 'en' ? 'Choose QA / Jira Avatar Icon' : 'Escolha o Ícone do Avatar QA / Jira'}
              </label>
              
              {/* Selected Avatar Preview */}
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-teal-400/50 shadow-md">
                <img src={customAvatarUrl || selectedAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* QA & Jira Icon Options */}
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_ICON_OPTIONS.map((ico) => {
                const svgPreview = generateAvatarSvg(ico.iconType, selectedColor.bgHex, selectedColor.accentHex);
                const isSelected = selectedIcon === ico.iconType && !customAvatarUrl;
                return (
                  <button
                    key={ico.id}
                    type="button"
                    onClick={() => handleIconSelect(ico.iconType)}
                    className={`relative rounded-xl overflow-hidden border-2 transition p-0.5 aspect-square ${
                      isSelected
                        ? 'border-teal-400 ring-2 ring-teal-500/30 scale-105 shadow-lg'
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                    title={ico.name}
                  >
                    <img src={svgPreview} alt={ico.name} className="w-full h-full object-cover rounded-lg" />
                    {isSelected && (
                      <div className="absolute top-0.5 right-0.5 bg-teal-500 text-slate-950 rounded-full p-0.5 shadow">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Color Palette Choice */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-extrabold">
                <Palette className="w-3.5 h-3.5 text-teal-400" />
                <span>{lang === 'en' ? 'Customize Icon Color:' : 'Personalizar Cor do Ícone:'}</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {AVATAR_COLOR_OPTIONS.map((c) => {
                  const isColorSelected = selectedColor.id === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleColorSelect(c)}
                      className={`w-7 h-7 rounded-full transition shrink-0 flex items-center justify-center border-2 ${
                        isColorSelected ? 'border-white ring-2 ring-teal-400 scale-110' : 'border-slate-700 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.accentHex }}
                      title={c.name}
                    >
                      {isColorSelected && <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Image className="w-4 h-4 text-slate-400 shrink-0" />
                            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 cursor-pointer hover:text-teal-400 transition">
                  <Image className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Upload Custom Avatar' : 'Fazer Upload de Foto'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
                {uploadingImage && <span className="text-[10px] text-teal-400 animate-pulse">Processando imagem (250x250, WebP)...</span>}
              </div>
            </div>

            {/* Privacy & LGPD / GDPR Camera & Gallery Permission Notice */}
            <div className="mt-2.5 p-3 rounded-xl bg-slate-950/80 border border-teal-500/30 flex items-start gap-2.5 text-[10px] text-slate-300">
              <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-1">
                <span className="font-extrabold text-teal-300 block">
                  {lang === 'en' ? 'Camera & Photo Library Permission (GDPR / Privacy)' : 'Permissão de Câmera & Galeria (LGPD / Privacidade)'}
                </span>
                <p className="text-slate-400 leading-normal">
                  {lang === 'en' 
                    ? 'According to data protection regulations, ISTQB Trail requests access to your camera and image library solely to personalize your profile picture and avatar. Images are never shared or sold.'
                    : 'Em conformidade com a LGPD, o ISTQB Trail solicita uso de permissão para câmera e galeria de fotos exclusivamente para personalizar a sua foto de perfil e avatar. Suas fotos nunca são compartilhadas sem seu consentimento.'}
                </p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {lang === 'en' ? 'Full Name' : 'Nome Completo'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Unique Username */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <AtSign className="w-3.5 h-3.5 text-teal-400" />
                <span>{lang === 'en' ? 'Username (@id)' : 'Nome de Usuário (@username)'}</span>
              </span>
              <span className="text-[10px] text-teal-400 font-normal">
                {lang === 'en' ? 'A-Z, 0-9 only' : 'Apenas letras e números'}
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-black text-teal-400 select-none">@</span>
              <input
                type="text"
                required
                maxLength={20}
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="ex: anasilva"
                className={`w-full bg-slate-950 border rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none transition ${
                  usernameError ? 'border-rose-500 focus:border-rose-400' : 'border-slate-800 focus:border-teal-500'
                }`}
              />
            </div>

            {usernameError ? (
              <p className="text-[11px] text-rose-400 font-medium mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                <span>{usernameError}</span>
              </p>
            ) : (
              <p className="text-[10px] text-slate-400 mt-1">
                {lang === 'en'
                  ? 'Your unique handle used for searches, 1v1 challenges, and social connections.'
                  : 'Seu nome único usado para busca de colegas, duelos 1v1 e conexões.'}
              </p>
            )}
          </div>

          {/* Country Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>{lang === 'en' ? 'Country / Regional Pricing' : 'País / Tabela de Preço Regional'}</span>
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              {Object.values(COUNTRY_PRICING_MAP).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.currencySymbol} {c.currencyCode})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 mt-1">
              {lang === 'en' 
                ? 'Your country choice sets local plan pricing, payment methods (Pix, MB Way, etc.), and currency.'
                : 'O país escolhido define os valores dos planos, métodos de pagamento locais (Pix, MB Way) e a moeda cobrada.'}
            </p>
          </div>

          {/* Company */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.companyLabel}
            </label>
            <input
              type="text"
              placeholder={t.companyPlaceholder}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {t.bioLabel}
            </label>
            <textarea
              rows={3}
              placeholder={t.bioPlaceholder}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 resize-none"
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>{t.saveProfile}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
