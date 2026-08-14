// Builds a safe download filename from translated text, keeping the
// language's own characters (Arabic/Hindi/Tamil/etc.) intact instead of
// stripping them - only characters illegal in Windows/Mac/Linux
// filenames are replaced.
export const sanitizeFileName = (text, fallback = "Export") => {
    const cleaned = String(text ?? "")
        .trim()
        .replace(/[\\/:*?"<>|]+/g, "_")
        .replace(/\s+/g, "_")
        .replace(/^_+|_+$/g, "");
    return cleaned || fallback;
};
