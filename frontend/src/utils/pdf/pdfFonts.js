import amiriRegularUrl from "../../assets/fonts/Amiri-Regular.ttf?url";
import amiriBoldUrl from "../../assets/fonts/Amiri-Bold.ttf?url";
import hindRegularUrl from "../../assets/fonts/Hind-Regular.ttf?url";
import hindBoldUrl from "../../assets/fonts/Hind-Bold.ttf?url";
import hindMaduraiRegularUrl from "../../assets/fonts/HindMadurai-Regular.ttf?url";
import hindMaduraiBoldUrl from "../../assets/fonts/HindMadurai-Bold.ttf?url";


/* =========================================
   jsPDF has no complex-script text-shaping engine, so Arabic letter
   joining and the vowel-sign reordering/conjuncts that Devanagari and
   Tamil require all render broken as plain vector text (e.g. Tamil
   "ொ"/"ோ" showing as a detached dotted circle instead of wrapping
   around its consonant).

   Instead, any non-Latin text is drawn through the browser's own
   <canvas>, which shapes every script correctly via the platform's
   real text engine, and the result is embedded as a small raster
   image in the PDF. Latin text (English/French/Malay) is untouched
   and stays real vector text.
========================================= */

const SCRIPT_FONTS = {

    arabic: {
        name: "PdfArabic",
        regularUrl: amiriRegularUrl,
        boldUrl: amiriBoldUrl,
    },

    devanagari: {
        name: "PdfDevanagari",
        regularUrl: hindRegularUrl,
        boldUrl: hindBoldUrl,
    },

    tamil: {
        name: "PdfTamil",
        regularUrl: hindMaduraiRegularUrl,
        boldUrl: hindMaduraiBoldUrl,
    },

};


// Unicode block ranges, kept as numeric codepoints (rather than literal
// characters or \u-escapes in a regex) to avoid invisible / bidi-control
// characters ending up in this source file.
const SCRIPT_RANGES = {
    arabic: [
        [0x0600, 0x06ff],
        [0x0750, 0x077f],
        [0x08a0, 0x08ff],
        [0xfb50, 0xfdff],
        [0xfe70, 0xfeff],
    ],
    devanagari: [[0x0900, 0x097f]],
    tamil: [[0x0b80, 0x0bff]],
};


const containsScript = (value, ranges) => {

    for (const char of value) {

        const code = char.codePointAt(0);

        if (ranges.some(([start, end]) => code >= start && code <= end)) {
            return true;
        }

    }

    return false;

};


export const detectScript = (text) => {

    const value = String(text ?? "");

    if (containsScript(value, SCRIPT_RANGES.arabic)) return "arabic";
    if (containsScript(value, SCRIPT_RANGES.devanagari)) return "devanagari";
    if (containsScript(value, SCRIPT_RANGES.tamil)) return "tamil";

    return "latin";

};


// Returns the embedded raster font to use for `text`, or null when the
// text is Latin (or the matching font failed to load) and should stay
// as normal vector text.
export const getScriptFont = (text, availableFonts) => {

    const script = detectScript(text);

    if (script === "latin") {
        return null;
    }

    const font = SCRIPT_FONTS[script];

    if (!font || !availableFonts?.[script]) {
        return null;
    }

    return { script, fontName: font.name };

};


let fontsPromise = null;

// Loads the Arabic / Devanagari / Tamil fonts into the browser via the
// FontFace API so <canvas> can shape text with them. Cached for the
// page session. Returns which scripts loaded successfully so callers
// can fall back to plain vector text if a font failed (e.g. offline).
export const registerPdfFonts = () => {

    if (!fontsPromise) {

        fontsPromise = (async () => {

            const available = {};

            await Promise.all(
                Object.entries(SCRIPT_FONTS).map(async ([script, font]) => {

                    try {

                        const regular = new FontFace(
                            font.name,
                            `url(${font.regularUrl})`,
                            { weight: "400" }
                        );

                        const bold = new FontFace(
                            font.name,
                            `url(${font.boldUrl})`,
                            { weight: "700" }
                        );

                        const [loadedRegular, loadedBold] = await Promise.all([
                            regular.load(),
                            bold.load(),
                        ]);

                        document.fonts.add(loadedRegular);
                        document.fonts.add(loadedBold);

                        available[script] = true;

                    } catch (error) {

                        console.error(`Failed to load PDF font for ${script}:`, error);

                        available[script] = false;

                    }

                })
            );

            return available;

        })();

    }

    return fontsPromise;

};


const PT_TO_MM = 25.4 / 72;
const RASTER_SCALE = 6; // canvas px per pt - high enough to stay crisp when zoomed/printed


const measureText = (text, cssFont) => {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx.font = cssFont;

    return ctx.measureText(String(text ?? ""));

};


// Renders `text` to a small transparent PNG using the given embedded
// script font, returning its size already converted to mm (and the
// baseline offset) so callers can place it with doc.addImage() the
// same way they'd place doc.text().
export const renderScriptTextToImage = (text, { fontFamily, fontSizePt, bold = false, color = [0, 0, 0] }) => {

    const value = String(text ?? "");
    const cssFont = `${bold ? "bold " : ""}${fontSizePt * RASTER_SCALE}px "${fontFamily}"`;

    const metrics = measureText(value, cssFont);

    const ascent = metrics.actualBoundingBoxAscent || fontSizePt * RASTER_SCALE * 0.8;
    const descent = metrics.actualBoundingBoxDescent || fontSizePt * RASTER_SCALE * 0.25;
    const pad = 2 * RASTER_SCALE;

    const widthPx = Math.max(1, Math.ceil(metrics.width + pad * 2));
    const heightPx = Math.max(1, Math.ceil(ascent + descent + pad * 2));

    const canvas = document.createElement("canvas");
    canvas.width = widthPx;
    canvas.height = heightPx;

    const ctx = canvas.getContext("2d");
    ctx.font = cssFont;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    ctx.fillText(value, pad, pad + ascent);

    return {
        dataUrl: canvas.toDataURL("image/png"),
        widthMm: (widthPx / RASTER_SCALE) * PT_TO_MM,
        heightMm: (heightPx / RASTER_SCALE) * PT_TO_MM,
        baselineMm: ((pad + ascent) / RASTER_SCALE) * PT_TO_MM,
    };

};


// Measures how wide `text` would render at `fontSizePt`, without
// drawing anything - used for layout (column widths, chip sizing)
// before the real draw call.
export const measureAdaptiveTextWidthMm = (doc, text, { fontSizePt, bold = false, availableFonts }) => {

    const scriptFont = getScriptFont(text, availableFonts);

    if (!scriptFont) {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(fontSizePt);
        return doc.getTextWidth(String(text ?? ""));
    }

    const cssFont = `${bold ? "bold " : ""}${fontSizePt * RASTER_SCALE}px "${scriptFont.fontName}"`;
    const metrics = measureText(text, cssFont);

    return (metrics.width / RASTER_SCALE) * PT_TO_MM;

};


// Draws `text` at baseline position (x, y): real vector text for
// Latin, a raster image (correctly shaped) for Arabic/Hindi/Tamil.
// Mirrors doc.text()'s (x, y, {align}) signature so call sites don't
// need to branch.
export const drawAdaptiveText = (doc, text, x, y, { fontSizePt, bold = false, color = [0, 0, 0], align = "left", availableFonts }) => {

    const scriptFont = getScriptFont(text, availableFonts);

    if (!scriptFont) {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setFontSize(fontSizePt);
        doc.setTextColor(...color);
        doc.text(String(text ?? ""), x, y, { align });
        return;
    }

    const image = renderScriptTextToImage(text, {
        fontFamily: scriptFont.fontName,
        fontSizePt,
        bold,
        color,
    });

    let drawX = x;
    if (align === "center") drawX = x - image.widthMm / 2;
    if (align === "right") drawX = x - image.widthMm;

    doc.addImage(image.dataUrl, "PNG", drawX, y - image.baselineMm, image.widthMm, image.heightMm);

};
