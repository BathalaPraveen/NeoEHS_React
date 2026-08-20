import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Table.css";
function DataTable({
    columns = [],
    data = [],
    loading = false,
    emptyTitle,
    emptySubtitle,
    emptyIcon = "bi-inbox",
    emptyAction = null,
    columnFilters = {},
    onColumnFilterChange,
    visibleColumns = null,
    skeletonRows = 6,
    forceOpenFilters = false
}) {
    const { t } = useTranslation();
    const resolvedEmptyTitle = emptyTitle || t("common.no_data_title");
    const resolvedEmptySubtitle = emptySubtitle || t("common.no_data_subtitle");
    const [openFilters, setOpenFilters] = useState({});
    const toggleFilter = (key) => {
        setOpenFilters((prev) => ({
            ...prev,
            [key]: !prev[key]
        }));
    };
    const handleFilterChange = (key, value) => {
        onColumnFilterChange(
            key,
            value
        );
    };
    // =========================================================
    // Visible Columns
    // =========================================================
    const displayColumns =
        visibleColumns
            ? columns.filter(
                (column) =>
                    column.key === "actions" ||
                    column.key === "index" ||
                    visibleColumns.includes(column.key)
            )
            : columns;
    return (
        <div className="neo-table-scroll">
            <table className="neo-table">
                <thead>
                    <tr>
                        {displayColumns.map((column) => {
                            const isOpen =
                                forceOpenFilters ||
                                openFilters[column.key];
                            const filterValue =
                                columnFilters[
                                    column.key
                                ] || "";
                            return (
                                <th
                                    key={column.key}
                                    className={
                                        column.className || ""
                                    }
                                >
                                    <div className="neo-th-inner">
                                        <span>
                                            {column.label}
                                        </span>
                                        {column.searchable && (
                                            <button
                                                type="button"
                                                className={`neo-filter-toggle ${
                                                    isOpen || filterValue
                                                        ? "active"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    toggleFilter(
                                                        column.key
                                                    )
                                                }
                                                aria-label={
                                                    isOpen
                                                        ? t("common.close_column_filter", { column: column.label })
                                                        : t("common.filter_by_column", { column: column.label })
                                                }
                                                title={
                                                    isOpen
                                                        ? t("common.close")
                                                        : t("common.filter")
                                                }
                                            >
                                                <i
                                                    className={
                                                        isOpen
                                                            ? "bi bi-funnel-fill"
                                                            : "bi bi-funnel"
                                                    }
                                                ></i>
                                            </button>
                                        )}
                                    </div>
                                    {column.searchable &&
                                        isOpen && (
                                            <div className="neo-column-filter-box">
                                                <div className="input-group input-group-sm">
                                                    <span className="input-group-text bg-white">
                                                        <i className="bi bi-search text-muted"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        autoFocus
                                                        value={filterValue}
                                                        placeholder={
                                                            column.searchPlaceholder ||
                                                            t("common.search_column", { column: column.label })
                                                        }
                                                        onChange={(e) =>
                                                            handleFilterChange(
                                                                column.key,
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                    {filterValue && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-secondary"
                                                            onClick={() =>
                                                                handleFilterChange(
                                                                    column.key,
                                                                    ""
                                                                )
                                                            }
                                                            title={t("common.clear")}
                                                        >
                                                            <i className="bi bi-x"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {/* =================================
                        Loading — Skeleton Rows
                    ================================= */}
                    {loading &&
                        Array.from({ length: skeletonRows }).map(
                            (_, rowIndex) => (
                                <tr key={`skeleton-${rowIndex}`}>
                                    {displayColumns.map((column) => (
                                        <td
                                            key={column.key}
                                            data-label={column.label}
                                        >
                                            <div className="neo-skel-cell" />
                                        </td>
                                    ))}
                                </tr>
                            )
                        )}
                    {/* =================================
                        Empty
                    ================================= */}
                    {!loading &&
                        data.length === 0 && (
                            <tr>
                                <td colSpan={displayColumns.length}>
                                    <div className="neo-empty">
                                        <div className="neo-empty-icon">
                                            <i className={`bi ${emptyIcon}`}></i>
                                        </div>
                                        <div className="neo-empty-title">
                                            {resolvedEmptyTitle}
                                        </div>
                                        <div className="neo-empty-subtitle">
                                            {resolvedEmptySubtitle}
                                        </div>
                                        {emptyAction}
                                    </div>
                                </td>
                            </tr>
                        )}
                    {/* =================================
                        Data
                    ================================= */}
                    {!loading &&
                        data.map(
                            (row, rowIndex) => (
                                <tr
                                    key={
                                        row.id ||
                                        rowIndex
                                    }
                                >
                                    {displayColumns.map(
                                        (column) => (
                                            <td
                                                key={column.key}
                                                data-label={column.label}
                                                className={
                                                    column.key === "actions"
                                                        ? `neo-td-actions ${column.cellClassName || ""}`
                                                        : (column.cellClassName || "")
                                                }
                                            >
                                                {column.render
                                                    ? column.render(
                                                        row,
                                                        rowIndex
                                                    )
                                                    : row[
                                                        column.key
                                                    ]
                                                }
                                            </td>
                                        )
                                    )}
                                </tr>
                            )
                        )}
                </tbody>
            </table>
        </div>
    );
}
export default DataTable;
