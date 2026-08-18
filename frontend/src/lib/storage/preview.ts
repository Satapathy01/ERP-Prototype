import path from "path";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".bmp",
  ".webp",
  ".svg",
]);

const PDF_EXTENSIONS = new Set([
  ".pdf",
]);

/**
 * Returns the file extension.
 */
export function getExtension(relativePath: string): string {
  return path.extname(relativePath).toLowerCase();
}

/**
 * Returns true if the file is an image.
 */
export function isImage(relativePath: string): boolean {
  return IMAGE_EXTENSIONS.has(getExtension(relativePath));
}

/**
 * Returns true if the file is a PDF.
 */
export function isPdf(relativePath: string): boolean {
  return PDF_EXTENSIONS.has(getExtension(relativePath));
}

/**
 * Returns true if the file can be previewed in the browser.
 */
export function canPreview(relativePath: string): boolean {
  return (
    isImage(relativePath) ||
    isPdf(relativePath)
  );
}

/**
 * Returns preview type.
 */
export function getPreviewType(
  relativePath: string
): "image" | "pdf" | "unsupported" {
  if (isImage(relativePath)) {
    return "image";
  }

  if (isPdf(relativePath)) {
    return "pdf";
  }

  return "unsupported";
}