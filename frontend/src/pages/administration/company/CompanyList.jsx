import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import * as XLSX from "xlsx";

import {
    DataTable,
    Pagination,
    TableToolbar
} from "../../../components/ui/Table";

import { formatDate } from "../../../utils/common";

import { exportTablePdf } from "../../../utils/pdf/exportTablePdf";



function CompanyList() {

    const navigate = useNavigate();


    // =========================================================
    // State
    // =========================================================

    const [companies, setCompanies] = useState([]);

    const [loading, setLoading] = useState(false);

    // Individual column filters
    const [columnFilters, setColumnFilters] = useState({
        company_id: "",
        company_name: "",
        short_name: "",
        created_at: ""
    });

    // Current page
    const [page, setPage] = useState(1);

    // Records per page
    // String allows user to clear and type a number
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


            const response = await axios.get(
                "http://localhost:5000/api/admin/companies",
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

        // Whenever filter changes,
        // return to first page

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

    const hasColumnFilters =
        Object.values(columnFilters)
            .some(
                value =>
                    String(value || "")
                        .trim() !== ""
            );


    // =========================================================
    // Filter Companies
    //
    // All filtering happens in frontend.
    //
    // Backend only returns company data.
    // =========================================================

    const filteredCompanies = useMemo(() => {

        let result = [...companies];


        Object.entries(
            columnFilters
        ).forEach(
            ([key, value]) => {

                const searchValue =
                    String(value || "")
                        .trim()
                        .toLowerCase();


                // Ignore empty filters

                if (!searchValue) {

                    return;

                }


                result =
                    result.filter(
                        company => {

                            let fieldValue = "";


                            switch (key) {

                                // =================================
                                // Company ID
                                // =================================

                                case "company_id":

                                    fieldValue =
                                        company.company_id || "";

                                    break;


                                // =================================
                                // Company Name
                                // =================================

                                case "company_name":

                                    fieldValue =
                                        company.company_name || "";

                                    break;


                                // =================================
                                // Short Name
                                // =================================

                                case "short_name":

                                    fieldValue =
                                        company.short_name || "";

                                    break;


                                // =================================
                                // Created Date
                                //
                                // Search format:
                                // DD-MM-YYYY
                                // =================================

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


        return result;

    }, [
        companies,
        columnFilters
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


    // =========================================================
    // Current Page Data
    // =========================================================

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


    // =========================================================
    // Keep Page Within Range
    // =========================================================

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

    const handlePerPageChange = (e) => {

        const value =
            e.target.value;


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


        // Empty / invalid

        if (
            !value ||
            value < 1
        ) {

            value = 1;

        }


        // Maximum

        if (value > 1000) {

            value = 1000;

        }


        setPerPage(
            String(value)
        );

        setPage(1);

    };


    // =========================================================
    // Excel Export
    //
    // Exports ALL filtered records.
    // Not only current page.
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

                    "SL No":
                        index + 1,

                    "Company ID":
                        company.company_id || "",

                    "Company Name":
                        company.company_name || "",

                    "Short Name":
                        company.short_name || "",

                    "Created Date":
                        formatDate(
                            company.created_at
                        )

                })
            );


        const worksheet =
            XLSX.utils.json_to_sheet(
                exportData
            );


        // Excel column widths

        worksheet["!cols"] = [

            {
                wch: 8
            },

            {
                wch: 18
            },

            {
                wch: 30
            },

            {
                wch: 18
            },

            {
                wch: 18
            }

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
            "Company_Master.xlsx"
        );

    };


    // =========================================================
    // PDF Columns
    //
    // These are separate from UI columns.
    // Actions are intentionally NOT included.
    // =========================================================

    const pdfColumns = [

        {
            key: "sl_no",

            label: "SL No",

            renderPdf: (_, index) => (
                index + 1
            )

        },


        {
            key: "company_id",

            label: "Company ID",

            renderPdf: (row) =>
                row.company_id || ""

        },


        {
            key: "company_name",

            label: "Company Name",

            renderPdf: (row) =>
                row.company_name || ""

        },


        {
            key: "short_name",

            label: "Short Name",

            renderPdf: (row) =>
                row.short_name || ""

        },


        {
            key: "created_at",

            label: "Created Date",

            renderPdf: (row) =>
                formatDate(
                    row.created_at
                )

        }

    ];


    // =========================================================
    // PDF Export
    //
    // Uses reusable exportTablePdf()
    //
    // Exports ALL filtered records.
    // =========================================================

    const exportPdf = () => {

        if (
            filteredCompanies.length === 0
        ) {

            return;

        }


        exportTablePdf({

            title:
                "Company Master",


            subtitle:
                "Manage company information",


            columns:
                pdfColumns,


            // IMPORTANT:
            // All filtered records

            data:
                filteredCompanies,


            totalRecords:
                filteredCompanies.length,


            generatedBy:
                "SuperAdmin User",


            filters: [

                {
                    label:
                        "Company ID",

                    value:
                        columnFilters.company_id

                },


                {
                    label:
                        "Company Name",

                    value:
                        columnFilters.company_name

                },


                {
                    label:
                        "Short Name",

                    value:
                        columnFilters.short_name

                },


                {
                    label:
                        "Created Date",

                    value:
                        columnFilters.created_at

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

            label: "SL No",

            className:
                "text-center",

            render: (_, index) => (

                (
                    (page - 1) *
                    perPageNumber
                ) +
                index +
                1

            )

        },


        // =====================================================
        // COMPANY ID
        // =====================================================

        {
            key: "company_id",

            label: "Company ID",

            searchable: true,

            searchPlaceholder:
                "Search ID",

            render: (row) => (

                <span
                    className="
                        fw-semibold
                        text-primary
                    "
                >

                    {
                        row.company_id
                    }

                </span>

            )

        },


        // =====================================================
        // COMPANY NAME
        // =====================================================

        {
            key: "company_name",

            label: "Company Name",

            searchable: true,

            searchPlaceholder:
                "Search company",

            render: (row) => (

                <div
                    className="
                        d-flex
                        align-items-center
                        gap-2
                    "
                >

                    {/* Avatar */}

                    <div
                        className="
                            rounded-circle
                            bg-primary-subtle
                            text-primary
                            fw-bold
                            d-flex
                            align-items-center
                            justify-content-center
                        "
                        style={{
                            width: "36px",
                            height: "36px",
                            minWidth: "36px"
                        }}
                    >

                        {
                            row.company_name
                                ?.charAt(0)
                                ?.toUpperCase()
                        }

                    </div>


                    {/* Company Name */}

                    <span
                        className="
                            fw-semibold
                        "
                    >

                        {
                            row.company_name
                        }

                    </span>

                </div>

            )

        },


        // =====================================================
        // SHORT NAME
        // =====================================================

        {
            key: "short_name",

            label: "Short Name",

            searchable: true,

            searchPlaceholder:
                "Search short name",

            render: (row) => (

                <span
                    className="
                        badge
                        bg-light
                        text-dark
                        border
                    "
                >

                    {
                        row.short_name
                    }

                </span>

            )

        },


        // =====================================================
        // CREATED DATE
        // =====================================================

        {
            key: "created_at",

            label: "Created Date",

            searchable: true,

            searchPlaceholder:
                "DD-MM-YYYY",

            render: (row) => (

                formatDate(
                    row.created_at
                )

            )

        },


        // =====================================================
        // ACTIONS
        // =====================================================

        {
            key: "actions",

            label: "Actions",

            className:
                "text-center",

            cellClassName:
                "text-center",

            render: (row) => (

                <div
                    className="
                        d-flex
                        justify-content-center
                        gap-1
                    "
                >

                    {/* =================================
                        View
                    ================================= */}

                    <button
                        type="button"
                        className="
                            btn
                            btn-sm
                            btn-light
                            text-primary
                        "
                        title="View"
                        onClick={() =>
                            navigate(
                                `/administration/company/view/${row.id}`
                            )
                        }
                    >

                        <i
                            className="
                                bi
                                bi-eye
                            "
                        ></i>

                    </button>


                    {/* =================================
                        Edit
                    ================================= */}

                    <button
                        type="button"
                        className="
                            btn
                            btn-sm
                            btn-light
                            text-success
                        "
                        title="Edit"
                        onClick={() =>
                            navigate(
                                `/administration/company/edit/${row.id}`
                            )
                        }
                    >

                        <i
                            className="
                                bi
                                bi-pencil-square
                            "
                        ></i>

                    </button>


                    {/* =================================
                        Delete
                    ================================= */}

                    <button
                        type="button"
                        className="
                            btn
                            btn-sm
                            btn-light
                            text-danger
                        "
                        title="Delete"
                    >

                        <i
                            className="
                                bi
                                bi-trash
                            "
                        ></i>

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
            : (
                (page - 1) *
                perPageNumber
            ) + 1;


    const endRecord =
        Math.min(
            page *
            perPageNumber,
            total
        );


    // =========================================================
    // Render
    // =========================================================

    return (

        <div
            className="
                container-fluid
                py-3
            "
        >

            <div
                className="
                    card
                    border-0
                    shadow-sm
                "
            >

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div
                    className="
                        card-body
                        border-bottom
                        py-3
                    "
                >

                    <div
                        className="
                            d-flex
                            flex-wrap
                            justify-content-between
                            align-items-center
                            gap-3
                        "
                    >

                        {/* =========================================
                            Title
                        ========================================= */}

                        <div>

                            <h4
                                className="
                                    fw-bold
                                    mb-1
                                "
                            >
                                Company Master
                            </h4>

                            <div
                                className="
                                    text-muted
                                    small
                                "
                            >
                                Manage company information
                            </div>

                        </div>


                        {/* =========================================
                            Breadcrumb + Add
                        ========================================= */}

                        <div
                            className="
                                d-flex
                                flex-wrap
                                align-items-center
                                gap-3
                            "
                        >

                            <nav
                                aria-label="breadcrumb"
                            >

                                <ol
                                    className="
                                        breadcrumb
                                        mb-0
                                        small
                                    "
                                >

                                    <li
                                        className="
                                            breadcrumb-item
                                        "
                                    >
                                        Administration
                                    </li>

                                    <li
                                        className="
                                            breadcrumb-item
                                        "
                                    >
                                        Operating Management
                                    </li>

                                    <li
                                        className="
                                            breadcrumb-item
                                            active
                                        "
                                    >
                                        Company Master
                                    </li>

                                </ol>

                            </nav>


                            {/* Add Company */}

                            <button
                                type="button"
                                className="
                                    btn
                                    btn-primary
                                "
                                onClick={() =>
                                    navigate(
                                        "/administration/company/add"
                                    )
                                }
                            >

                                <i
                                    className="
                                        bi
                                        bi-plus-lg
                                        me-2
                                    "
                                ></i>

                                Add Company

                            </button>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <TableToolbar

                    perPage={
                        perPage
                    }

                    onPerPageChange={
                        handlePerPageChange
                    }

                    onPerPageBlur={
                        handlePerPageBlur
                    }

                    onExportExcel={
                        exportExcel
                    }

                    onExportPdf={
                        exportPdf
                    }

                    onRefresh={
                        fetchCompanies
                    }

                    loading={
                        loading
                    }

                />


                {/* =================================================
                    ACTIVE FILTER BAR
                ================================================= */}

                {hasColumnFilters && (

                    <div
                        className="
                            px-3
                            py-2
                            border-bottom
                            bg-light
                            d-flex
                            align-items-center
                            justify-content-between
                        "
                    >

                        <div
                            className="
                                small
                                text-muted
                            "
                        >

                            <i
                                className="
                                    bi
                                    bi-funnel
                                    me-2
                                "
                            ></i>

                            Filters applied

                        </div>


                        <button
                            type="button"
                            className="
                                btn
                                btn-sm
                                btn-outline-secondary
                            "
                            onClick={
                                clearFilters
                            }
                        >

                            <i
                                className="
                                    bi
                                    bi-x-circle
                                    me-1
                                "
                            ></i>

                            Clear Filters

                        </button>

                    </div>

                )}


                {/* =================================================
                    DATA TABLE
                ================================================= */}

                <DataTable

                    columns={
                        columns
                    }

                    data={
                        paginatedCompanies
                    }

                    loading={
                        loading
                    }

                    columnFilters={
                        columnFilters
                    }

                    onColumnFilterChange={
                        handleColumnFilterChange
                    }

                    emptyMessage={
                        hasColumnFilters
                            ? "No matching companies found"
                            : "No companies found"
                    }

                />


                {/* =================================================
                    FOOTER / PAGINATION
                ================================================= */}

                <div
                    className="
                        card-footer
                        bg-white
                        border-0
                    "
                >

                    <div
                        className="
                            d-flex
                            flex-wrap
                            justify-content-between
                            align-items-center
                            gap-2
                        "
                    >

                        {/* Record count */}

                        <small
                            className="
                                text-muted
                            "
                        >

                            Showing{" "}

                            <strong>
                                {startRecord}
                            </strong>

                            {" "}to{" "}

                            <strong>
                                {endRecord}
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {total}
                            </strong>

                            {" "}records

                        </small>


                        {/* Pagination */}

                        <Pagination

                            currentPage={
                                page
                            }

                            lastPage={
                                lastPage
                            }

                            onPageChange={
                                setPage
                            }

                        />

                    </div>

                </div>

            </div>

        </div>

    );

}


export default CompanyList;