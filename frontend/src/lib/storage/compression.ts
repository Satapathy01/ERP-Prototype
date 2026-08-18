import sharp from "sharp";

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp";
}

/**
 * Compresses and resizes an image while preserving aspect ratio.
 */
export async function compressImage(
  buffer: Buffer,
  options: CompressImageOptions = {},
): Promise<Buffer> {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 80,
    format = "jpeg",
  } = options;

  const image = sharp(buffer)
    .rotate()
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });

  switch (format) {
    case "png":
      return image
        .png({
          compressionLevel: 9,
        })
        .toBuffer();

    case "webp":
      return image
        .webp({
          quality,
        })
        .toBuffer();

    case "jpeg":
    default:
      return image
        .jpeg({
          quality,
          mozjpeg: true,
        })
        .toBuffer();
  }
}

/**
 * Generate a thumbnail.
 */
export async function generateThumbnail(
  buffer: Buffer,
  size = 300,
): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({
      width: size,
      height: size,
      fit: "cover",
    })
    .jpeg({
      quality: 75,
      mozjpeg: true,
    })
    .toBuffer();
}

/**
 * Returns image metadata.
 */
export async function getImageMetadata(
  buffer: Buffer,
) {
  return sharp(buffer).metadata();
}