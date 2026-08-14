import { useState } from "react";
import "./Table.css";

function DataTable({
    columns = [],
    data = [],
    loading = false,

    emptyTitle = "No records found",
    emptySubtitle = "There is no data to display right now.",
    emptyIcon = "bi-inbox",
    emptyAction = null,

    columnFilters = {},
    onColumnFilterChange,

    visibleColumns = null,

    skeletonRows = 6,

    forceOpenFilters = false
}) {

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
                                                        ? `Close ${column.label} filter`
                                                        : `Filter by ${column.label}`
                                                }
                                                title={
                                                    isOpen
                                                        ? "Close filter"
                                                        : "Filter"
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
                                                            `Search ${column.label}`
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
                                                            title="Clear"
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
                                            {emptyTitle}
                                        </div>

                                        <div className="neo-empty-subtitle">
                                            {emptySubtitle}
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
