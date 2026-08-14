import "./Table.css";
function Pagination({
    currentPage = 1,
    lastPage = 1,
    onPageChange,
    total = 0,
    startRecord = 0,
    endRecord = 0,
    entityLabel = "records",
    perPage,
    onPerPageChange,
    onPerPageBlur,
    perPageLabel = "Rows per page"
}) {
    const getPages = () => {
        const pages = [];
        if (lastPage <= 7) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(i);
            }
            return pages;
        }
        pages.push(1);
        if (currentPage > 3) {
            pages.push("...");
        }
        const start = Math.max(
            2,
            currentPage - 1
        );
        const end = Math.min(
            lastPage - 1,
            currentPage + 1
        );
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        if (currentPage < lastPage - 2) {
            pages.push("...");
        }
        pages.push(lastPage);
        return pages;
    };
    return (
        <div className="neo-footer">
            {/* ================================
                Summary + Per page
            ================================= */}
            <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="neo-footer-summary">
                    Showing{" "}
                    <strong>{startRecord}</strong>
                    {"–"}
                    <strong>{endRecord}</strong>
                    {" "}of{" "}
                    <strong>{total}</strong>
                    {" "}{entityLabel}
                </div>
                {onPerPageChange && (
                    <div className="neo-perpage">
                        <label htmlFor="neo-perpage-input">
                            {perPageLabel}
                        </label>
                        <input
                            id="neo-perpage-input"
                            type="text"
                            inputMode="numeric"
                            className="neo-perpage-input"
                            value={perPage}
                            onChange={(e) => onPerPageChange(e.target.value)}
                            onBlur={onPerPageBlur}
                        />
                    </div>
                )}
            </div>
            {/* ================================
                Page buttons
            ================================= */}
            {lastPage > 1 && (
                <nav aria-label="Table pagination">
                    <ul className="neo-pagination">
                        <li>
                            <button
                                type="button"
                                className="neo-page-btn"
                                disabled={currentPage === 1}
                                onClick={() => onPageChange(currentPage - 1)}
                                aria-label="Previous page"
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                        </li>
                        {getPages().map((page, index) => (
                            page === "..."
                                ? (
                                    <li key={`dots-${index}`}>
                                        <span className="neo-page-btn dots">
                                            {"…"}
                                        </span>
                                    </li>
                                )
                                : (
                                    <li key={page}>
                                        <button
                                            type="button"
                                            className={`neo-page-btn ${
                                                currentPage === page ? "active" : ""
                                            }`}
                                            onClick={() => onPageChange(page)}
                                            aria-current={currentPage === page ? "page" : undefined}
                                            aria-label={`Page ${page}`}
                                        >
                                            {page}
                                        </button>
                                    </li>
                                )
                        ))}
                        <li>
                            <button
                                type="button"
                                className="neo-page-btn"
                                disabled={currentPage === lastPage}
                                onClick={() => onPageChange(currentPage + 1)}
                                aria-label="Next page"
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
}
export default Pagination;
