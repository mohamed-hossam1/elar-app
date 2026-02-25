function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to convert canvas to blob"));
          return;
        }

        resolve(blob);
      },
      type,
      quality,
    );
  });
}

export async function compressImage(
  file: File,
  {
    maxSizeMB = 0.5,
    maxWidthOrHeight = 1920,
    minQuality = 0.1,
    qualityStep = 0.1,
    initialQuality = 0.8,
  }: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    minQuality?: number;
    qualityStep?: number;
    initialQuality?: number;
  } = {},
): Promise<File> {
  if (!isImageFile(file)) {
    throw new Error("File is not an image");
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size <= maxSizeBytes) {
    return file;
  }

  const imageUrl = URL.createObjectURL(file);

  try {
    const imageBitmap = await createImageBitmap(file);

    let width = imageBitmap.width;
    let height = imageBitmap.height;

    // الحفاظ على aspect ratio
    if (width > height && width > maxWidthOrHeight) {
      height = Math.round((height * maxWidthOrHeight) / width);
      width = maxWidthOrHeight;
    } else if (height > maxWidthOrHeight) {
      width = Math.round((width * maxWidthOrHeight) / height);
      height = maxWidthOrHeight;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
    }

    ctx.drawImage(imageBitmap, 0, 0, width, height);

    // تحديد أفضل فورمات
    const outputType =
      file.type === "image/png"
        ? "image/png"
        : "image/webp";

    let quality = initialQuality;
    let bestBlob: Blob | null = null;

    while (quality >= minQuality) {
      const blob = await canvasToBlob(
        canvas,
        outputType,
        quality,
      );

      bestBlob = blob;

      if (blob.size <= maxSizeBytes) {
        break;
      }

      quality -= qualityStep;
    }

    if (!bestBlob) {
      throw new Error("Compression failed");
    }

    const extension =
      outputType === "image/png"
        ? "png"
        : outputType === "image/webp"
          ? "webp"
          : "jpg";

    const fileName =
      file.name.replace(/\.[^/.]+$/, "") +
      `.${extension}`;

    return new File([bestBlob], fileName, {
      type: outputType,
      lastModified: Date.now(),
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return "0 Bytes";
  }

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(
    bytes / Math.pow(1024, index)
  ).toFixed(2)} ${units[index]}`;
}