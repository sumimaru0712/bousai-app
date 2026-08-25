export function resizeImageToDataUrl(
  file: File,
  maxDimension = 1280,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const original = reader.result;
      if (typeof original !== "string") {
        reject(new Error("画像の読み込みに失敗しました"));
        return;
      }

      const img = new window.Image();
      img.onerror = () => resolve(original);
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(original);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = original;
    };
    reader.readAsDataURL(file);
  });
}
