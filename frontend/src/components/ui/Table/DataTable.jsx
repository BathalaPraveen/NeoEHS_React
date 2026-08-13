import { useState } from "react";
import "./Table.css";

function DataTable({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "No records found",

    columnFilters = {},
    onColumnFilterChange
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


    return (

        <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                    <tr>

                        {columns.map((column) => {

                            const isOpen =
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

                                    {/* =================================
                                        Header
                                    ================================= */}

                                    <div className="
                                        d-flex
                                        align-items-center
                                        justify-content-between
                                        gap-2
                                    ">

                                        <span>

                                            {column.label}

                                        </span>


                                        {column.searchable && (

                                            <button
                                                type="button"
                                                className={`
                                                    btn
                                                    btn-sm
                                                    p-0
                                                    border-0
                                                    filter-column-btn
                                                    ${
                                                        isOpen ||
                                                        filterValue
                                                            ? "active"
                                                            : ""
                                                    }
                                                `}
                                                onClick={() =>
                                                    toggleFilter(
                                                        column.key
                                                    )
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


                                    {/* =================================
                                        Search Input
                                    ================================= */}

                                    {column.searchable &&
                                        isOpen && (

                                            <div className="
                                                mt-2
                                                column-filter-box
                                            ">

                                                <div className="
                                                    input-group
                                                    input-group-sm
                                                ">

                                                    <span className="
                                                        input-group-text
                                                        bg-white
                                                    ">

                                                        <i className="
                                                            bi
                                                            bi-search
                                                            text-muted
                                                        "></i>

                                                    </span>


                                                    <input
                                                        type="text"
                                                        className="
                                                            form-control
                                                        "
                                                        autoFocus
                                                        value={
                                                            filterValue
                                                        }
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
                                                            className="
                                                                btn
                                                                btn-outline-secondary
                                                            "
                                                            onClick={() =>
                                                                handleFilterChange(
                                                                    column.key,
                                                                    ""
                                                                )
                                                            }
                                                            title="Clear"
                                                        >

                                                            <i className="
                                                                bi
                                                                bi-x
                                                            "></i>

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
                        Loading
                    ================================= */}

                    {loading && (

                        <tr>

                            <td
                                colSpan={
                                    columns.length
                                }
                                className="
                                    text-center
                                    py-5
                                "
                            >

                                <div
                                    className="
                                        spinner-border
                                        text-primary
                                    "
                                    role="status"
                                />

                                <div className="
                                    text-muted
                                    small
                                    mt-2
                                ">

                                    Loading...

                                </div>

                            </td>

                        </tr>

                    )}


                    {/* =================================
                        Empty
                    ================================= */}

                    {!loading &&
                        data.length === 0 && (

                            <tr>

                                <td
                                    colSpan={
                                        columns.length
                                    }
                                    className="
                                        text-center
                                        py-5
                                    "
                                >

                                    <div className="table-empty">

                                        <i className="
                                            bi
                                            bi-inbox
                                        "></i>

                                        <div className="
                                            fw-semibold
                                            mt-2
                                        ">

                                            {emptyMessage}

                                        </div>

                                        <small className="
                                            text-muted
                                        ">

                                            No data available

                                        </small>

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

                                    {columns.map(
                                        (column) => (

                                            <td
                                                key={
                                                    column.key
                                                }
                                                className={
                                                    column.cellClassName ||
                                                    ""
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