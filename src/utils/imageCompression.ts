export async function resizeAndCompressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 250;
        
        // Calculate crop to make it a perfect square (1:1)
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        
        if (img.width > img.height) {
          sourceWidth = img.height;
          sourceX = (img.width - img.height) / 2;
        } else if (img.height > img.width) {
          sourceHeight = img.width;
          sourceY = (img.height - img.width) / 2;
        }
        
        canvas.width = MAX_SIZE;
        canvas.height = MAX_SIZE;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, MAX_SIZE, MAX_SIZE);
        
        // Convert to WebP with 0.8 quality
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        }, 'image/webp', 0.8);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
