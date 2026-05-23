/**
 * Utility to downsample and compress heavy user selfies client-side.
 * Prevents network bottlenecks and limits uploads to efficient WebP formats.
 */
export const compressSelfie = (file: File, maxWidth = 1024, quality = 0.85): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate aspect ratio constraints
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to create local 2D canvas context.'));
          return;
        }
        
        // Draw image onto canvas boundary
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas output to highly optimized compressed WebP Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas image compression returned empty blob data.'));
            }
          },
          'image/webp',
          quality
        );
      };
      
      img.onerror = () => reject(new Error('Failed to parse upload image source.'));
    };
    
    reader.onerror = () => reject(new Error('Failed to execute local file stream reading.'));
  });
};
