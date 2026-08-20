// src/utils/validation.js
import api from "../config/axios";

// =========================================================
// SYNC RULES — required, length, pattern (run instantly, no network)
// =========================================================
export const rules = {
    required: (message = "This field is required") => (value) => {
        if (value === null || value === undefined) return message;
        if (typeof value === "string" && value.trim() === "") return message;
        return "";
    },
    minLength: (min, message) => (value) => {
        if (!value) return "";
        return String(value).trim().length < min
            ? message || `Must be at least ${min} characters`
            : "";
    },
    maxLength: (max, message) => (value) => {
        if (!value) return "";
        return String(value).trim().length > max
            ? message || `Must not exceed ${max} characters`
            : "";
    },
    pattern: (regex, message = "Invalid format") => (value) => {
        if (!value) return "";
        return regex.test(String(value).trim()) ? "" : message;
    }
};

// =========================================================
// FILE RULES — same shape as `rules`, but operate on a File.
// A plain string value (edit mode: an already-uploaded file's
// stored URL) is treated as already valid and skipped, since it
// was validated at upload time and isn't a re-upload.
// =========================================================
const isNewFile = (value) => typeof File !== "undefined" && value instanceof File;

export const fileRules = {
    required: (message = "This file is required") => (file) => {
        if (!file) return message;
        return "";
    },
    allowedTypes: (types, message) => (file) => {
        if (!file) return "";
        if (typeof file === "string") return "";
        if (!isNewFile(file)) return "Invalid file";
        return types.includes(file.type)
            ? ""
            : message || `Allowed file types: ${types.join(", ")}`;
    },
    allowedExtensions: (extensions, message) => (file) => {
        if (!file) return "";
        if (typeof file === "string") return "";
        if (!isNewFile(file)) return "Invalid file";
        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        const allowed = extensions.map((e) => e.toLowerCase().replace(/^\./, ""));
        return allowed.includes(ext)
            ? ""
            : message || `Allowed file extensions: ${extensions.join(", ")}`;
    },
    maxSize: (maxMB, message) => (file) => {
        if (!file) return "";
        if (typeof file === "string") return "";
        if (!isNewFile(file)) return "Invalid file";
        return file.size > maxMB * 1024 * 1024
            ? message || `File must be smaller than ${maxMB}MB`
            : "";
    }
};

// =========================================================
// validateForm — supports two schema shapes per field:
//   1. Normal/file field: an array of rule functions (unchanged)
//   2. "Add More" array field: { array: true, minItems, minItemsMessage, itemSchema }
//      Row errors are written as flat keys: "items[0].name"
// =========================================================
export const validateForm = (values, schema) => {
    const errors = {};
    Object.keys(schema).forEach((field) => {
        const fieldSchema = schema[field] || [];

        if (Array.isArray(fieldSchema)) {
            for (const rule of fieldSchema) {
                const message = rule(values[field], values);
                if (message) {
                    errors[field] = message;
                    break;
                }
            }
            return;
        }

        if (fieldSchema.array) {
            const rows = Array.isArray(values[field]) ? values[field] : [];
            const minItems = fieldSchema.minItems || 0;
            if (rows.length < minItems) {
                errors[field] = fieldSchema.minItemsMessage || `Add at least ${minItems} item(s)`;
                return;
            }
            const itemSchema = fieldSchema.itemSchema || {};
            rows.forEach((row, index) => {
                Object.keys(itemSchema).forEach((subField) => {
                    const subRules = itemSchema[subField] || [];
                    for (const rule of subRules) {
                        const message = rule(row?.[subField], row);
                        if (message) {
                            errors[`${field}[${index}].${subField}`] = message;
                            break;
                        }
                    }
                });
            });
        }
    });
    return { isValid: Object.keys(errors).length === 0, errors };
};

export const mapApiErrors = (apiErrors = {}) => {
    const mapped = {};
    Object.keys(apiErrors).forEach((field) => {
        const value = apiErrors[field];
        mapped[field] = Array.isArray(value) ? value[0] : value;
    });
    return mapped;
};

// =========================================================
// ASYNC "REMOTE" UNIQUE CHECK — always asks the backend/database
// This is the ONE pattern every form should reuse.
// =========================================================
export const checkFieldUnique = async ({ url, field, value, excludeId, message }) => {
    if (!value || !value.trim()) return "";
    try {
        const response = await api.get(url, {
            params: { field, value: value.trim(), excludeId: excludeId || undefined }
        });
        return response.data?.data?.isUnique
            ? ""
            : message || `${field} already exists`;
    } catch (error) {
        console.error("Unique check failed:", error);
        return "";
    }
};

export const validateUniqueFields = async (checks) => {
    const errors = {};
    await Promise.all(
        checks.map(async ({ field, ...rest }) => {
            const message = await checkFieldUnique(rest);
            if (message) errors[field] = message;
        })
    );
    return { isValid: Object.keys(errors).length === 0, errors };
};

// =========================================================
// validateFormAdvanced — one entry point every form can call:
//   1. sync rules (normal fields, Add More rows, files, Add More files)
//   2. async uniqueness checks (only run if step 1 passed)
// =========================================================
export const validateFormAdvanced = async ({ values, schema, uniqueChecks = [] }) => {
    const { isValid: syncValid, errors: syncErrors } = validateForm(values, schema);
    if (!syncValid) {
        return { isValid: false, errors: syncErrors };
    }

    if (uniqueChecks.length) {
        const { isValid: uniqueValid, errors: uniqueErrors } = await validateUniqueFields(uniqueChecks);
        if (!uniqueValid) {
            return { isValid: false, errors: uniqueErrors };
        }
    }

    return { isValid: true, errors: {} };
};