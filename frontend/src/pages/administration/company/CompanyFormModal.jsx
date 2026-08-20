// src/pages/administration/company/CompanyFormModal.jsx
import { useEffect, useState } from "react";
import api from "../../../config/axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Modal from "../../../components/ui/Modal/Modal";
import SubmitButton from "../../../components/ui/Button/SubmitButton";
import ResetButton from "../../../components/ui/Button/ResetButton";
import { rules, validateForm, mapApiErrors, validateUniqueFields } from "../../../utils/validation";

const INITIAL_FORM = {
    company_name: "",
    short_name: ""
};

// Field-level rules — reuses the shared validation engine from Step 1
const VALIDATION_SCHEMA = {
    company_name: [
        rules.required("Company name is required"),
        rules.maxLength(150, "Company name must not exceed 150 characters")
    ],
    short_name: [
        rules.required("Short name is required"),
        rules.maxLength(20, "Short name must not exceed 20 characters"),
        rules.pattern(
            /^[A-Za-z0-9 &.,'-]+$/,
            "Short name contains invalid characters"
        )
    ]
};

/**
 * @param {"add"|"edit"} mode
 * @param {Object|null} company existing row, required when mode === "edit"
 */
function CompanyFormModal({ show, mode = "add", company = null, onClose, onSaved }) {
    const { t } = useTranslation();
    const isEdit = mode === "edit";

    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [previewId, setPreviewId] = useState("");

    const getAuthToken = () =>
        localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    // =========================================================
    // Populate / reset the form whenever the popup opens
    // =========================================================
    const buildInitialValues = () =>
        isEdit && company
            ? {
                  company_name: company.company_name || "",
                  short_name: company.short_name || ""
              }
            : INITIAL_FORM;

    useEffect(() => {
        if (!show) return;
        setForm(buildInitialValues());
        setErrors({});
        setApiError("");

        let cancelled = false;
        if (!isEdit) {
            api
                .get("/api/admin/companies/next-id")
                .then((res) => {
                    if (!cancelled) setPreviewId(res.data?.data?.company_id || "");
                })
                .catch(() => {
                    if (!cancelled) setPreviewId("");
                });
        }
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [show, mode, company]);

    const handleChange = (field) => (event) => {
        const { value } = event.target;
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
        if (apiError) setApiError("");
    };

    const handleReset = () => {
        setForm(buildInitialValues());
        setErrors({});
        setApiError("");
    };

    const handleClose = () => {
        handleReset();
        onClose?.();
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // 1. Required / length / pattern — instant, no network
        const { isValid, errors: validationErrors } = validateForm(form, VALIDATION_SCHEMA);
        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        setSubmitting(true);
        setApiError("");

        // 2. Ask the backend — the only place that truly knows what exists
        const { isValid: isUnique, errors: uniqueErrors } = await validateUniqueFields([
            {
                field: "company_name",
                url: "/api/admin/companies/check-unique",
                value: form.company_name,
                excludeId: isEdit ? company.id : null,
                message: "Company name already exists"
            },
            {
                field: "short_name",
                url: "/api/admin/companies/check-unique",
                value: form.short_name,
                excludeId: isEdit ? company.id : null,
                message: "Short name already exists"
            }
        ]);

        if (!isUnique) {
            setErrors((prev) => ({ ...prev, ...uniqueErrors }));
            setSubmitting(false);
            return;
        }

        // 3. Save
        try {
            const token = getAuthToken();
            const payload = {
                company_name: form.company_name.trim(),
                short_name: form.short_name.trim()
            };

            const response = isEdit
                ? await api.put(`/api/admin/companies/${company.id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
                : await api.post("/api/admin/companies", payload, { headers: { Authorization: `Bearer ${token}` } });

            if (response.data && response.data.success) {
                toast.success(response.data.message || t(isEdit ? "company_master.update_success" : "company_master.add_success"));
                onSaved?.(response.data.data);
                onClose?.();
            } else {
                setApiError(response.data?.message || t(isEdit ? "company_master.update_failed" : "company_master.add_failed"));
            }
        } catch (error) {
            console.error("Save company error:", error);
            const responseErrors = error.response?.data?.errors;
            if (responseErrors) {
                setErrors((prev) => ({ ...prev, ...mapApiErrors(responseErrors) }));
            }
            setApiError(error.response?.data?.message || t(isEdit ? "company_master.update_failed" : "company_master.add_failed"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            show={show}
            onClose={handleClose}
            title={t(isEdit ? "company_master.edit_company" : "company_master.add_company")}
            size="md"
            footer={
                <>
                    <ResetButton
                        label={t("company_master.reset")}
                        onClick={handleReset}
                        disabled={submitting}
                    />
                    <SubmitButton
                        label={t(isEdit ? "company_master.update" : "company_master.submit")}
                        loadingLabel={t("company_master.saving")}
                        loading={submitting}
                        form="company-form"
                    />
                </>
            }
        >
            <form id="company-form" onSubmit={handleSubmit} noValidate>
                {apiError && (
                    <div className="neo-form-alert">
                        <i className="bi bi-exclamation-triangle-fill"></i>
                        <span>{apiError}</span>
                    </div>
                )}

                <div className="neo-form-row">
                    <div className="neo-form-group">
                        <label className="neo-form-label">
                            {t("company_master.col_company_id")}
                        </label>
                        <input
                            type="text"
                            className="neo-form-control"
                            value={isEdit ? company?.company_id || "" : previewId || "..."}
                            readOnly
                        />
                    </div>
                </div>

                <div className="neo-form-row">
                    <div className="neo-form-group">
                        <label className="neo-form-label">
                            {t("company_master.col_company_name")}
                            <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className={`neo-form-control ${errors.company_name ? "is-invalid" : ""}`}
                            placeholder={t("company_master.company_name_placeholder")}
                            value={form.company_name}
                            onChange={handleChange("company_name")}
                            disabled={submitting}
                            autoFocus
                        />
                        {errors.company_name && (
                            <span className="neo-field-error">{errors.company_name}</span>
                        )}
                    </div>

                    <div className="neo-form-group">
                        <label className="neo-form-label">
                            {t("company_master.col_short_name")}
                            <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            className={`neo-form-control ${errors.short_name ? "is-invalid" : ""}`}
                            placeholder={t("company_master.short_name_placeholder")}
                            value={form.short_name}
                            onChange={handleChange("short_name")}
                            disabled={submitting}
                        />
                        {errors.short_name && (
                            <span className="neo-field-error">{errors.short_name}</span>
                        )}
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default CompanyFormModal;