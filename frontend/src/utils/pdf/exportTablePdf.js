import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoUrl from "../../assets/icons/logo.svg";
import { sanitizeFileName } from "../fileName";
import {
    drawAdaptiveText,
    getScriptFont,
    measureAdaptiveTextWidthMm,
    registerPdfFonts,
    renderScriptTextToImage,
} from "./pdfFonts";
/* =========================================
   THEME
========================================= */
const COLOR = {
    navy: [21, 41, 77],
    navySoft: [37, 66, 115],
    accent: [37, 99, 235],
    white: [255, 255, 255],
    gray900: [30, 41, 59],
    gray700: [71, 85, 105],
    gray500: [100, 116, 139],
    gray300: [203, 213, 225],
    gray200: [226, 232, 240],
    gray100: [241, 245, 249],
    gray50: [248, 250, 252],
};
const HEAD_FONT_SIZE = 8.4;
const CELL_FONT_SIZE = 8.3;
const CELL_PADDING_X = 3;
const loadLogo = async (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = reject;
        img.src = url;
    });
};
/* =========================================
   SMALL DRAWING HELPERS
========================================= */
// Right-aligned rounded "pill" badge, e.g. "17 Records".
const drawBadgeRight = (doc, { text, rightX, y, fillColor, textColor, fontSize = 8 }) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    const paddingX = 3.4;
    const height = 6.6;
    const width = doc.getTextWidth(text) + paddingX * 2;
    const x = rightX - width;
    doc.setFillColor(...fillColor);
    doc.roundedRect(x, y - height + 1.9, width, height, 1.4, 1.4, "F");
    doc.setTextColor(...textColor);
    doc.text(text, x + width / 2, y, { align: "center" });
    return { x, width };
};
// Measures a "Label: Value" chip without drawing it.
const measureChip = (doc, label, value, availableFonts) => {
    const labelText = `${label}: `;
    const labelWidth = measureAdaptiveTextWidthMm(doc, labelText, {
        fontSizePt: 7.3,
        bold: true,
        availableFonts,
    });
    const valueWidth = measureAdaptiveTextWidthMm(doc, value, {
        fontSizePt: 7.3,
        availableFonts,
    });
    const paddingX = 3.4;
    return {
        width: paddingX * 2 + labelWidth + valueWidth,
        labelText,
        labelWidth,
    };
};
// Draws a filter chip ("Label: Value") at x/y (y = text baseline).
const drawChip = (doc, { label, value, x, y, availableFonts }) => {
    const { width, labelText, labelWidth } = measureChip(doc, label, value, availableFonts);
    const height = 6.8;
    doc.setFillColor(...COLOR.gray50);
    doc.setDrawColor(...COLOR.gray200);
    doc.setLineWidth(0.15);
    doc.roundedRect(x, y - height + 1.9, width, height, 1.2, 1.2, "FD");
    drawAdaptiveText(doc, labelText, x + 3.4, y, {
        fontSizePt: 7.3,
        bold: true,
        color: COLOR.navy,
        availableFonts,
    });
    drawAdaptiveText(doc, value, x + 3.4 + labelWidth, y, {
        fontSizePt: 7.3,
        color: COLOR.gray700,
        availableFonts,
    });
    return width;
};
export const exportTablePdf = async ({
    title = "Report",
    subtitle = "",
    columns = [],
    data = [],
    filters = [],
    totalRecords = 0,
    generatedBy = "System",
}) => {
    const doc = new jsPDF("portrait", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const rightX = pageWidth - margin;
    /* =========================================
       UNICODE FONTS (Arabic / Hindi / Tamil)
    ========================================= */
    const availableFonts = await registerPdfFonts();
    /* =========================================
       TOP ACCENT BAR
    ========================================= */
    doc.setFillColor(...COLOR.accent);
    doc.rect(0, 0, pageWidth, 2.2, "F");
    /* =========================================
       LOGO
    ========================================= */
    let logo = null;
    try {
        logo = await loadLogo(logoUrl);
    } catch (error) {
        console.error("Logo loading failed:", error);
    }
    if (logo) {
        doc.addImage(logo, "PNG", margin, 8, 42, 18);
    }
    /* =========================================
       TITLE / SUBTITLE (top-right corner, opposite the logo)
    ========================================= */
    drawAdaptiveText(doc, title, rightX, 15.5, {
        fontSizePt: 17,
        bold: true,
        color: COLOR.navy,
        align: "right",
        availableFonts,
    });
    if (subtitle) {
        drawAdaptiveText(doc, subtitle, rightX, 21, {
            fontSizePt: 9,
            color: COLOR.gray500,
            align: "right",
            availableFonts,
        });
    }
    /* =========================================
       GENERATED DATE (used in the footer)
    ========================================= */
    const generatedDate = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    /* =========================================
       HEADER DIVIDER
    ========================================= */
    doc.setDrawColor(...COLOR.navy);
    doc.setLineWidth(0.5);
    doc.line(margin, 29, pageWidth - margin, 29);
    doc.setDrawColor(...COLOR.accent);
    doc.setLineWidth(0.2);
    doc.line(margin, 29.6, pageWidth - margin, 29.6);
    /* =========================================
       FILTERS + TOTAL RECORDS
    ========================================= */
    const activeFilters = filters.filter(
        (filter) =>
            filter.value !== undefined &&
            filter.value !== null &&
            String(filter.value).trim() !== ""
    );
    let cursorY = 36;
    // drawBadgeRight(doc, {
    //     text: `${totalRecords} Record${totalRecords === 1 ? "" : "s"}`,
    //     rightX,
    //     y: cursorY,
    //     fillColor: COLOR.navy,
    //     textColor: COLOR.white,
    // });
    if (activeFilters.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...COLOR.accent);
        doc.text("FILTERS APPLIED", margin, cursorY);
        cursorY += 7;
        let chipX = margin;
        let chipY = cursorY;
        activeFilters.forEach((filter) => {
            const { width } = measureChip(doc, filter.label, filter.value, availableFonts);
            if (chipX + width > pageWidth - margin) {
                chipX = margin;
                chipY += 8.5;
            }
            const drawnWidth = drawChip(doc, {
                label: filter.label,
                value: filter.value,
                x: chipX,
                y: chipY,
                availableFonts,
            });
            chipX += drawnWidth + 3.5;
        });
        cursorY = chipY + 9;
    } else {
        cursorY += 10;
    }
    const startY = cursorY;
    /* =========================================
       TABLE
    ========================================= */
    const headers = columns.map((column) => column.label);
    const rows = data.map((row, index) =>
        columns.map((column) =>
            column.renderPdf
                ? column.renderPdf(row, index)
                : row[column.key] ?? ""
        )
    );
   const availableTableWidth = pageWidth - margin * 2;
    // Content-based minimum width for EVERY column (Latin or
    // Tamil/Hindi/Arabic) — needed so the leftover page width can be
    // shared fairly across all columns, not just the script-heavy ones.
    const columnContentWidths = columns.map((column, index) => {
        let maxWidthMm = 0;
        const consider = (text, fontSizePt, bold) => {
            if (text === undefined || text === null || text === "") {
                return;
            }
            const width = measureAdaptiveTextWidthMm(doc, String(text), {
                fontSizePt,
                bold,
                availableFonts,
            });
            maxWidthMm = Math.max(maxWidthMm, width);
        };
        consider(headers[index], HEAD_FONT_SIZE, true);
        rows.forEach((row) => consider(row[index], CELL_FONT_SIZE, false));
        return maxWidthMm + CELL_PADDING_X * 2 + 2;
    });
    // Columns with an explicit `column.width` keep it as-is. Every other
    // column gets its content width PLUS a proportional share of
    // whatever page width is left over, so the table always spans the
    // full margin-to-margin width instead of shrinking to fit content.
    const fixedTotal = columns.reduce(
        (sum, column, index) => sum + (column.width || columnContentWidths[index]),
        0
    );
    const leftover = Math.max(0, availableTableWidth - fixedTotal);
    const flexibleTotal = columns.reduce(
        (sum, column, index) => sum + (column.width ? 0 : columnContentWidths[index]),
        0
    );
    const columnStyles = {};
    columns.forEach((column, index) => {
        const style = {};
        if (column.align) {
            style.halign = column.align;
        }
        if (column.width) {
            style.cellWidth = column.width;
        } else {
            const share = flexibleTotal > 0
                ? (columnContentWidths[index] / flexibleTotal) * leftover
                : leftover / columns.length;
            style.cellWidth = columnContentWidths[index] + share;
        }
        columnStyles[index] = style;
    });
    const totalPagesExp = "{total_pages_count_string}";
    autoTable(doc, {
        startY,
        head: [headers],
        body: rows,
        margin: {
            left: margin,
            right: margin,
            top: 24,
            bottom: 20,
        },
        theme: "grid",
        styles: {
            font: "helvetica",
            fontSize: CELL_FONT_SIZE,
            textColor: COLOR.gray900,
            lineColor: COLOR.gray200,
            lineWidth: 0.15,
            cellPadding: { top: 2.8, right: CELL_PADDING_X, bottom: 2.8, left: CELL_PADDING_X },
            valign: "middle",
            halign: "left",
        },
        headStyles: {
            fillColor: COLOR.navy,
            textColor: COLOR.white,
            fontStyle: "bold",
            fontSize: HEAD_FONT_SIZE,
            cellPadding: { top: 3.4, right: CELL_PADDING_X, bottom: 3.4, left: CELL_PADDING_X },
            lineColor: COLOR.navy,
        },
        alternateRowStyles: {
            fillColor: COLOR.gray50,
        },
        columnStyles,
        // jsPDF's built-in fonts only cover Latin glyphs and can't shape
        // Arabic/Hindi/Tamil, so those cells get their vector text
        // blanked here (in favor of a raster image drawn in
        // didDrawCell) and the row height is grown to fit that image.
        didParseCell: (hookData) => {
            const scriptFont = getScriptFont(hookData.cell.raw, availableFonts);
            if (!scriptFont) {
                return;
            }
            const isHead = hookData.section === "head";
            const image = renderScriptTextToImage(hookData.cell.raw, {
                fontFamily: scriptFont.fontName,
                fontSizePt: isHead ? HEAD_FONT_SIZE : CELL_FONT_SIZE,
                bold: isHead,
                color: isHead ? COLOR.white : COLOR.gray900,
            });
            hookData.cell._pdfRasterImage = image;
            hookData.cell.text = [];
            hookData.cell.styles.minCellHeight = image.heightMm + hookData.cell.padding("vertical");
        },
        didDrawCell: (hookData) => {
            const image = hookData.cell._pdfRasterImage;
            if (!image) {
                return;
            }
            const cell = hookData.cell;
            const align = cell.styles.halign || "left";
            // Guard against the column ending up narrower than the image
            // (e.g. autoTable shrinking columns to fit the page) so the
            // raster never spills into the next cell.
            const maxWidth = cell.width - cell.padding("left") - cell.padding("right");
            const scale = maxWidth > 0 ? Math.min(1, maxWidth / image.widthMm) : 1;
            const drawWidth = image.widthMm * scale;
            const drawHeight = image.heightMm * scale;
            let x;
            if (align === "center") {
                x = cell.x + (cell.width - drawWidth) / 2;
            } else if (align === "right") {
                x = cell.x + cell.width - drawWidth - cell.padding("right");
            } else {
                x = cell.x + cell.padding("left");
            }
            const y = cell.y + (cell.height - drawHeight) / 2;
            doc.addImage(image.dataUrl, "PNG", x, y, drawWidth, drawHeight);
        },
        didDrawPage: (hookData) => {
            const page =
                hookData?.pageNumber ?? doc.internal.getNumberOfPages();
            // Continuation header on pages after the first.
            if (page > 1) {
                drawAdaptiveText(doc, title, rightX, 13, {
                    fontSizePt: 10.5,
                    bold: true,
                    color: COLOR.navy,
                    align: "right",
                    availableFonts,
                });
                doc.setDrawColor(...COLOR.accent);
                doc.setLineWidth(0.4);
                doc.line(margin, 16, pageWidth - margin, 16);
            }
            // Footer (every page).
            doc.setDrawColor(...COLOR.gray200);
            doc.setLineWidth(0.2);
            doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            doc.setTextColor(...COLOR.navy);
            doc.text("NeoEHS", margin, pageHeight - 8);
            const brandWidth = doc.getTextWidth("NeoEHS");
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(...COLOR.gray500);
            doc.text("  |  Confidential", margin + brandWidth, pageHeight - 8);
            doc.setFontSize(6.8);
            doc.setTextColor(...COLOR.gray500);
            doc.text(generatedDate, pageWidth / 2, pageHeight - 8, {
                align: "center",
            });
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7.5);
            doc.setTextColor(...COLOR.gray700);
            doc.text(`Page ${page} of ${totalPagesExp}`, pageWidth - margin, pageHeight - 8, {
                align: "right",
            });
        },
    });
    if (typeof doc.putTotalPages === "function") {
        doc.putTotalPages(totalPagesExp);
    }
    /* =========================================
       FILE NAME
    ========================================= */
    const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    doc.save(`${sanitizeFileName(title, "Report")}_${dateStamp}.pdf`);
};
