import fs from 'fs';

let content = fs.readFileSync('src/components/EditProfileModal.tsx', 'utf8');

// Add imports for resizing and uploading
content = content.replace(
  "import { translations } from '../utils/i18n';",
  "import { translations } from '../utils/i18n';\nimport { resizeAndCompressImage } from '../utils/imageCompression';\nimport { uploadAvatar } from '../lib/supabase';"
);

// Add loading state for image upload
content = content.replace(
  "const [customAvatarUrl, setCustomAvatarUrl] = useState('');",
  "const [customAvatarUrl, setCustomAvatarUrl] = useState('');\n  const [uploadingImage, setUploadingImage] = useState(false);"
);

// Add file handling logic
const handleFileLogic = `  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };`;

content = content.replace(
  /const handleColorSelect/,
  handleFileLogic + '\n\n  const handleColorSelect'
);

// Disable save button while uploading
content = content.replace(
  /disabled=\{checkingUsername\}/g,
  "disabled={checkingUsername || uploadingImage}"
);

// Replace the custom URL input with a file input
const fileInputHtml = `              <div className="flex flex-col gap-2">
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
              </div>`;

content = content.replace(
  /<input\s+type="url"[\s\S]*?onChange=\{\(e\) => setCustomAvatarUrl\(e\.target\.value\)\}[\s\S]*?\/>/,
  fileInputHtml
);

fs.writeFileSync('src/components/EditProfileModal.tsx', content);
