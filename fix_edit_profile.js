import fs from 'fs';
let content = fs.readFileSync('src/components/EditProfileModal.tsx', 'utf8');
content = content.replace(
  "const [uploadingImage, setUploadingImage] = useState(false);",
  "const [uploadingImage, setUploadingImage] = useState(false);\n  const [errorMsg, setErrorMsg] = useState('');"
);
fs.writeFileSync('src/components/EditProfileModal.tsx', content);
