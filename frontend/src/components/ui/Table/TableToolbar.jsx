import "./Table.css";

function TableToolbar({
    search = "",
    onSearchChange,
    searchPlaceholder = "Search...",

    activeFilterCount = 0,
    filtersOpen = false,
    onToggleFilters,

    onExportExcel,
    onExportPdf,

    onRefresh,
    loading = false,

    columns = [],
    visibleColumns = [],
    onToggleColumn,

    labels = {}
}) {

    const toggleableColumns =
        columns.filter(
            (column) =>
                column.key !== "index" &&
                column.key !== "actions"
        );


    return (

        <div className="neo-toolbar">

            {/* ================================
                Search
            ================================= */}

            <div className="neo-toolbar-left">

                <div className="neo-search">

                    <i className="bi bi-search"></i>

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            onSearchChange?.(e.target.value)
                        }
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                    />

                    {search && (

                        <button
                            type="button"
                            className="neo-search-clear"
                            onClick={() => onSearchChange?.("")}
                            aria-label="Clear search"
                            title="Clear search"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>

                    )}

                </div>

            </div>


            {/* ================================
                Controls
            ================================= */}

            <div className="neo-toolbar-right">

                {/* Filter */}

                <button
                    type="button"
                    className={`neo-btn ${filtersOpen || activeFilterCount ? "is-active" : ""}`}
                    onClick={onToggleFilters}
                    aria-pressed={filtersOpen}
                    aria-label={labels.filter || "Filter"}
                    title={labels.filter || "Filter"}
                >
                    <i className="bi bi-sliders"></i>
                    <span className="d-none d-md-inline">
                        {labels.filter || "Filter"}
                    </span>
                    {activeFilterCount > 0 && (
                        <span className="neo-btn-badge">
                            {activeFilterCount}
                        </span>
                    )}
                </button>


                {/* Export */}

                <div className="dropdown">

                    <button
                        type="button"
                        className="neo-btn"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        aria-label={labels.export || "Export"}
                        title={labels.export || "Export"}
                    >
                        <i className="bi bi-download"></i>
                        <span className="d-none d-md-inline">
                            {labels.export || "Export"}
                        </span>
                        <i className="bi bi-chevron-down small"></i>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end neo-dropdown-menu">

                        <li>
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={onExportExcel}
                            >
                                <i className="bi bi-file-earmark-excel"></i>
                                Excel
                            </button>
                        </li>

                        <li>
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={onExportPdf}
                            >
                                <i className="bi bi-file-earmark-pdf"></i>
                                PDF
                            </button>
                        </li>

                    </ul>

                </div>


                {/* Column visibility */}

                <div className="dropdown">

                    <button
                        type="button"
                        className="neo-btn icon-only"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        aria-label={labels.columns || "Toggle columns"}
                        title={labels.columns || "Columns"}
                    >
                        <i className="bi bi-layout-three-columns"></i>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end neo-dropdown-menu">

                        {toggleableColumns.map((column) => (

                            <li key={column.key}>

                                <label className="neo-column-item">

                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.includes(column.key)}
                                        onChange={() => onToggleColumn?.(column.key)}
                                    />

                                    {column.label}

                                </label>

                            </li>

                        ))}

                    </ul>

                </div>


                {/* Refresh */}

                <button
                    type="button"
                    className={`neo-btn icon-only ${loading ? "spin" : ""}`}
                    onClick={onRefresh}
                    disabled={loading}
                    aria-label={labels.refresh || "Refresh"}
                    title={labels.refresh || "Refresh"}
                >
                    <i className="bi bi-arrow-clockwise"></i>
                </button>

            </div>

        </div>

    );
}

export default TableToolbar;
