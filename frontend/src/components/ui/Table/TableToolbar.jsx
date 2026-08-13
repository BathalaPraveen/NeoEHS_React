function TableToolbar({
    perPage = 10,
    onPerPageChange,
    onPerPageBlur,
    onRefresh,
    loading = false,
    onExportExcel,
    onExportPdf
}) {
    return (
        <div className="card-body border-bottom py-3">

            <div className="d-flex align-items-center justify-content-end gap-2 flex-wrap">

                {/* ================================
                    Records Per Page
                ================================= */}

                <div
                    className="input-group"
                    style={{ width: "365px" }}
                >

                    <span className="input-group-text bg-white">
                        Show
                    </span>

                    <input
                        type="number"
                        className="form-control"
                        value={perPage}
                        onChange={onPerPageChange}
                        onBlur={onPerPageBlur}
                        min="1"
                        max="1000"
                        placeholder="10"
                    />

                </div>


                {/* ================================
                    Excel
                ================================= */}

                <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={onExportExcel}
                    title="Export Excel"
                >

                    <i className="bi bi-file-earmark-excel me-1"></i>

                    Excel

                </button>


                {/* ================================
                    PDF
                ================================= */}

                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={onExportPdf}
                    title="Export PDF"
                >

                    <i className="bi bi-file-earmark-pdf me-1"></i>

                    PDF

                </button>


                {/* ================================
                    Refresh
                ================================= */}

                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={onRefresh}
                    disabled={loading}
                    title="Refresh"
                >

                    <i
                        className={`bi bi-arrow-clockwise ${
                            loading ? "spin" : ""
                        }`}
                    ></i>

                </button>

            </div>

        </div>
    );
}

export default TableToolbar;