import { useEffect, useMemo, useState } from "react";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CompanyFormModal from "./CompanyFormModal";
import * as XLSX from "xlsx";
import {
    DataTable,
    Pagination,
    TableToolbar
} from "../../../components/ui/Table";
import Breadcrumb from "../../../components/ui/Breadcrumb/Breadcrumb";
import { formatDate } from "../../../utils/common";
import { sanitizeFileName } from "../../../utils/fileName";
import { confirmAndDelete } from "../../../utils/deleteRecord";
import { exportTablePdf } from "../../../utils/pdf/exportTablePdf";
function CompanyList() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    // Add / Edit Company popup
    const [formModal, setFormModal] = useState({
        show: false,
        mode: "add",
        company: null
    });
    // Individual column filters
    const [columnFilters, setColumnFilters] = useState({
        company_id: "",
        company_name: "",
        short_name: "",
        created_at: ""
    });
    const [filtersOpen, setFiltersOpen] = useState(false);
    const ALL_COLUMN_KEYS = [
        "index",
        "company_id",
        "company_name",
        "short_name",
        "created_at",
        "actions"
    ];
    const [visibleColumns, setVisibleColumns] = useState(ALL_COLUMN_KEYS);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState("10");
    // =========================================================
    // Get Authentication Token
    // =========================================================
    const getAuthToken = () => {
        return (
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken")
        );
    };
    // =========================================================
    // Fetch Companies
    // =========================================================
    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const response = await api.get(
                "/api/admin/companies",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (
                response.data &&
                response.data.success
            ) {
                setCompanies(
                    response.data.data || []
                );
            } else {
                setCompanies([]);
            }
        } catch (error) {
            console.error(
                "Get companies error:",
                error
            );
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    };
    // =========================================================
    // Initial Load
    // =========================================================
    useEffect(() => {
        fetchCompanies();
    }, []);
    // =========================================================
    // Column Filter Change
    // =========================================================
    const handleColumnFilterChange = (
        key,
        value
    ) => {
        setColumnFilters(
            previous => ({
                ...previous,
                [key]: value
            })
        );
        setPage(1);
    };
    // =========================================================
    // Clear All Filters
    // =========================================================
    const clearFilters = () => {
        setColumnFilters({
            company_id: "",
            company_name: "",
            short_name: "",
            created_at: ""
        });
        setPage(1);
    };
    // =========================================================
    // Check Active Filters
    // =========================================================
    const activeFilterCount =
        Object.values(columnFilters)
            .filter(
                value =>
                    String(value || "")
                        .trim() !== ""
            ).length;
    const hasColumnFilters = activeFilterCount > 0;
    const hasAnyFilter =
        hasColumnFilters ||
        String(search || "").trim() !== "";
    // =========================================================
    // Filter Companies
    // =========================================================
    const filteredCompanies = useMemo(() => {
        let result = [...companies];
        // Per-column filters
        Object.entries(
            columnFilters
        ).forEach(
            ([key, value]) => {
                const searchValue =
                    String(value || "")
                        .trim()
                        .toLowerCase();
                if (!searchValue) {
                    return;
                }
                result =
                    result.filter(
                        company => {
                            let fieldValue;
                            switch (key) {
                                case "company_id":
                                    fieldValue =
                                        company.company_id || "";
                                    break;
                                case "company_name":
                                    fieldValue =
                                        company.company_name || "";
                                    break;
                                case "short_name":
                                    fieldValue =
                                        company.short_name || "";
                                    break;
                                case "created_at":
                                    fieldValue =
                                        formatDate(
                                            company.created_at
                                        ) || "";
                                    break;
                                default:
                                    fieldValue =
                                        company[key] || "";
                            }
                            return String(
                                fieldValue
                            )
                                .toLowerCase()
                                .includes(
                                    searchValue
                                );
                        }
                    );
            }
        );
        // Global search box
        const globalSearch =
            String(search || "")
                .trim()
                .toLowerCase();
        if (globalSearch) {
            result =
                result.filter(
                    company =>
                        String(company.company_id || "")
                            .toLowerCase()
                            .includes(globalSearch) ||
                        String(company.company_name || "")
                            .toLowerCase()
                            .includes(globalSearch) ||
                        String(company.short_name || "")
                            .toLowerCase()
                            .includes(globalSearch)
                );
        }
        return result;
    }, [
        companies,
        columnFilters,
        search
    ]);
    // =========================================================
    // Records Per Page
    // =========================================================
    const perPageNumber =
        Math.max(
            1,
            Number(perPage) || 1
        );
    // =========================================================
    // Pagination
    // =========================================================
    const total =
        filteredCompanies.length;
    const lastPage =
        Math.max(
            1,
            Math.ceil(
                total /
                perPageNumber
            )
        );
    const paginatedCompanies =
        useMemo(() => {
            const start =
                (page - 1) *
                perPageNumber;
            const end =
                start +
                perPageNumber;
            return filteredCompanies.slice(
                start,
                end
            );
        }, [
            filteredCompanies,
            page,
            perPageNumber
        ]);
    useEffect(() => {
        if (page > lastPage) {
            setPage(lastPage);
        }
    }, [
        page,
        lastPage
    ]);
    // =========================================================
    // Records Per Page Change
    // =========================================================
    const handlePerPageChange = (value) => {
        // Allow user to clear input
        if (value === "") {
            setPerPage("");
            return;
        }
        // Numbers only
        if (!/^\d+$/.test(value)) {
            return;
        }
        setPerPage(value);
        setPage(1);
    };
    // =========================================================
    // Records Per Page Blur
    // =========================================================
    const handlePerPageBlur = () => {
        let value =
            Number(perPage);
        if (
            !value ||
            value < 1
        ) {
            value = 1;
        }
        if (value > 1000) {
            value = 1000;
        }
        setPerPage(
            String(value)
        );
        setPage(1);
    };
    // =========================================================
    // Column Visibility
    // =========================================================
    const handleToggleColumn = (key) => {
        setVisibleColumns((previous) => {
            if (previous.includes(key)) {
                // Never allow hiding every column
                if (previous.length <= 1) {
                    return previous;
                }
                return previous.filter(
                    (item) => item !== key
                );
            }
            return [...previous, key];
        });
    };
    // =========================================================
    // Delete
    // =========================================================
    const handleDelete = async (row) => {
        const deleted = await confirmAndDelete({
            url: `/api/admin/companies/${row.id}`,
            confirmTitle: t("company_master.delete_title"),
            confirmText: t(
                "company_master.delete_text",
                { name: row.company_name }
            ),
            confirmButtonText: t("company_master.delete_confirm"),
            cancelButtonText: t("company_master.delete_cancel"),
            successTitle: t("company_master.delete_success"),
            errorTitle: t("company_master.delete_failed")
        });
        if (deleted) {
            fetchCompanies();
        }
    };
    // =========================================================
    // Excel Export
    // =========================================================
    const exportExcel = () => {
        if (
            filteredCompanies.length === 0
        ) {
            return;
        }
        const exportData =
            filteredCompanies.map(
                (company, index) => ({
                    [t("company_master.col_sl_no")]:
                        index + 1,
                    [t("company_master.col_company_id")]:
                        company.company_id || "",
                    [t("company_master.col_company_name")]:
                        company.company_name || "",
                    [t("company_master.col_short_name")]:
                        company.short_name || "",
                    [t("company_master.col_created_date")]:
                        formatDate(
                            company.created_at
                        )
                })
            );
        const worksheet =
            XLSX.utils.json_to_sheet(
                exportData
            );
        worksheet["!cols"] = [
            { wch: 8 },
            { wch: 18 },
            { wch: 30 },
            { wch: 18 },
            { wch: 18 }
        ];
        const workbook =
            XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Companies"
        );
        XLSX.writeFile(
            workbook,
            `${sanitizeFileName(t("company_master.title"), "Company_Master")}.xlsx`
        );
    };
    // =========================================================
    // PDF Export
    // =========================================================
    const pdfColumns = [
        {
            key: "sl_no",
            label: t("company_master.col_sl_no"),
            align: "center",
            width: 18,
            renderPdf: (_, index) => index + 1
        },
        {
            key: "company_id",
            label: t("company_master.col_company_id"),
            align: "center",
            renderPdf: (row) => row.company_id || ""
        },
        {
            key: "company_name",
            label: t("company_master.col_company_name"),
            renderPdf: (row) => row.company_name || ""
        },
        {
            key: "short_name",
            label: t("company_master.col_short_name"),
            renderPdf: (row) => row.short_name || ""
        },
        {
            key: "created_at",
            label: t("company_master.col_created_date"),
            align: "center",
            renderPdf: (row) => formatDate(row.created_at)
        }
    ];
    const exportPdf = () => {
        if (
            filteredCompanies.length === 0
        ) {
            return;
        }
        exportTablePdf({
            title:
                t("company_master.title"),
            subtitle:
                t("company_master.subtitle"),
            columns:
                pdfColumns,
            data:
                filteredCompanies,
            totalRecords:
                filteredCompanies.length,
            generatedBy:
                "SuperAdmin User",
            filters: [
                {
                    label: t("company_master.col_company_id"),
                    value: columnFilters.company_id
                },
                {
                    label: t("company_master.col_company_name"),
                    value: columnFilters.company_name
                },
                {
                    label: t("company_master.col_short_name"),
                    value: columnFilters.short_name
                },
                {
                    label: t("company_master.col_created_date"),
                    value: columnFilters.created_at
                },
                {
                    label: t("company_master.pdf_filter_search"),
                    value: search
                }
            ]
        });
    };
    // =========================================================
    // UI Table Columns
    // =========================================================
    const columns = [
        // =====================================================
        // SL NO
        // =====================================================
        {
            key: "index",
            label: t("company_master.col_sl_no"),
            className: "text-center",
            cellClassName: "text-center",
            render: (_, index) => (
                ((page - 1) * perPageNumber) + index + 1
            )
        },
        // =====================================================
        // COMPANY ID
        // =====================================================
        {
            key: "company_id",
            label: t("company_master.col_company_id"),
            searchable: true,
            searchPlaceholder: t("company_master.search_id"),
            render: (row) => (
                <span className="neo-static-id">
                    {row.company_id}
                </span>
            )
        },
        // =====================================================
        // COMPANY NAME
        // =====================================================
        {
            key: "company_name",
            label: t("company_master.col_company_name"),
            searchable: true,
            searchPlaceholder: t("company_master.search_company"),
            render: (row) => {
                const secondary =
                    row.company_email ||
                    row.domain;
                return (
                    <div className="neo-cell-name">
                        {/* <div className="neo-avatar">
                            {
                                row.company_name
                                    ?.charAt(0)
                                    ?.toUpperCase()
                            }
                        </div> */}
                        <div className="neo-cell-name-text">
                            <span className="neo-cell-name-primary">
                                {row.company_name}
                            </span>
                            {secondary && (
                                <span className="neo-cell-name-secondary">
                                    {secondary}
                                </span>
                            )}
                        </div>
                    </div>
                );
            }
        },
        // =====================================================
        // SHORT NAME
        // =====================================================
        {
            key: "short_name",
            label: t("company_master.col_short_name"),
            searchable: true,
            searchPlaceholder: t("company_master.search_short_name"),
            render: (row) => (
                <span className="neo-badge">
                    {row.short_name}
                </span>
            )
        },
        // =====================================================
        // CREATED DATE
        // =====================================================
        {
            key: "created_at",
            label: t("company_master.col_created_date"),
            searchable: true,
            searchPlaceholder: t("company_master.search_date"),
            render: (row) => formatDate(row.created_at)
        },
        // =====================================================
        // ACTIONS
        // =====================================================
        {
            key: "actions",
            label: t("company_master.col_actions"),
            className: "text-center",
            cellClassName: "text-center",
            render: (row) => (
                <div className="neo-actions">
                    <button
                        type="button"
                        className="neo-icon-btn view"
                        title={t("company_master.view")}
                        aria-label={`${t("company_master.view")} ${row.company_name || ""}`}
                        onClick={() =>
                           navigate(`/company/view/${row.id}`)
                        }
                    >
                        <i className="bi bi-eye"></i>
                    </button>
                    <button
                        type="button"
                        className="neo-icon-btn edit"
                        title={t("company_master.edit")}
                        aria-label={`${t("company_master.edit")} ${row.company_name || ""}`}
                        onClick={() =>
                            setFormModal({ show: true, mode: "edit", company: row })
                        }
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                        type="button"
                        className="neo-icon-btn delete"
                        title={t("company_master.delete")}
                        aria-label={`${t("company_master.delete")} ${row.company_name || ""}`}
                        onClick={() => handleDelete(row)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            )
        }
    ];
    // =========================================================
    // Record Range
    // =========================================================
    const startRecord =
        total === 0
            ? 0
            : ((page - 1) * perPageNumber) + 1;
    const endRecord =
        Math.min(
            page * perPageNumber,
            total
        );
    // =========================================================
    // Render
    // =========================================================
    return (
        <div className="container-fluid py-3">
            <Breadcrumb />
            <div className="neo-card">
                {/* =================================================
                    PAGE HEADER
                ================================================= */}
                <div className="neo-header">
                    <div>
                        <h4 className="neo-header-title">
                            {t("company_master.title")}
                        </h4>
                        <p className="neo-header-subtitle">
                            {t("company_master.subtitle")}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="neo-add-btn"
                        onClick={() =>
                            setFormModal({ show: true, mode: "add", company: null })
                        }
                    >
                        <i className="bi bi-plus-lg"></i>
                        {t("company_master.add_company")}
                    </button>
                </div>
                {/* =================================================
                    TOOLBAR
                ================================================= */}
                <TableToolbar
                    search={search}
                    onSearchChange={(value) => {
                        setSearch(value);
                        setPage(1);
                    }}
                    searchPlaceholder={t("company_master.search_placeholder")}
                    activeFilterCount={activeFilterCount}
                    filtersOpen={filtersOpen}
                    onToggleFilters={() => setFiltersOpen((open) => !open)}
                    onExportExcel={exportExcel}
                    onExportPdf={exportPdf}
                    onRefresh={fetchCompanies}
                    loading={loading}
                    columns={columns}
                    visibleColumns={visibleColumns}
                    onToggleColumn={handleToggleColumn}
                    labels={{
                        filter: t("company_master.filter"),
                        export: t("company_master.export"),
                        columns: t("company_master.columns"),
                        refresh: t("company_master.refresh")
                    }}
                />
                {/* =================================================
                    ACTIVE FILTER BAR
                ================================================= */}
                {hasColumnFilters && (
                    <div className="neo-filter-bar">
                        <div>
                            <i className="bi bi-funnel me-2"></i>
                            {t("company_master.filters_applied")}
                            {" "}({activeFilterCount})
                        </div>
                        <button
                            type="button"
                            className="neo-btn"
                            onClick={clearFilters}
                        >
                            <i className="bi bi-x-circle"></i>
                            {t("company_master.clear_filters")}
                        </button>
                    </div>
                )}
                {/* =================================================
                    DATA TABLE
                ================================================= */}
                <DataTable
                    columns={columns}
                    data={paginatedCompanies}
                    loading={loading}
                    columnFilters={columnFilters}
                    onColumnFilterChange={handleColumnFilterChange}
                    visibleColumns={visibleColumns}
                    forceOpenFilters={filtersOpen}
                    emptyIcon={hasAnyFilter ? "bi-search" : "bi-building"}
                    emptyTitle={
                        hasAnyFilter
                            ? t("company_master.empty_title_filtered")
                            : t("company_master.empty_title")
                    }
                    emptySubtitle={
                        hasAnyFilter
                            ? t("company_master.empty_subtitle_filtered")
                            : t("company_master.empty_subtitle")
                    }
                    emptyAction={
                        !hasAnyFilter && (
                            <button
                                type="button"
                                className="neo-add-btn"
                                onClick={() =>
                                    setFormModal({ show: true, mode: "add", company: null })
                                }
                            >
                                <i className="bi bi-plus-lg"></i>
                                {t("company_master.add_company")}
                            </button>
                        )
                    }
                />
                {/* =================================================
                    FOOTER / PAGINATION
                ================================================= */}
                <Pagination
                    currentPage={page}
                    lastPage={lastPage}
                    onPageChange={setPage}
                    total={total}
                    startRecord={startRecord}
                    endRecord={endRecord}
                    entityLabel={t("company_master.companies")}
                    perPage={perPage}
                    onPerPageChange={handlePerPageChange}
                    onPerPageBlur={handlePerPageBlur}
                    perPageLabel={t("company_master.rows_per_page")}
                />
            </div>
            <CompanyFormModal
                show={formModal.show}
                mode={formModal.mode}
                company={formModal.company}
                onClose={() =>
                    setFormModal((prev) => ({ ...prev, show: false }))
                }
                onSaved={() => fetchCompanies()}
            />
        </div>
    );
}
export default CompanyList;
