function Pagination({
    currentPage = 1,
    lastPage = 1,
    onPageChange,
}) {

    if (lastPage <= 1) {
        return null;
    }

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
        <nav>
            <ul className="pagination pagination-sm mb-0">

                {/* Previous */}

                <li
                    className={`page-item ${
                        currentPage === 1
                            ? "disabled"
                            : ""
                    }`}
                >
                    <button
                        type="button"
                        className="page-link"
                        disabled={currentPage === 1}
                        onClick={() =>
                            onPageChange(
                                currentPage - 1
                            )
                        }
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                </li>


                {/* Pages */}

                {getPages().map((page, index) => (

                    page === "..."

                        ? (
                            <li
                                key={`dots-${index}`}
                                className="page-item disabled"
                            >
                                <span className="page-link">
                                    ...
                                </span>
                            </li>
                        )

                        : (
                            <li
                                key={page}
                                className={`page-item ${
                                    currentPage === page
                                        ? "active"
                                        : ""
                                }`}
                            >
                                <button
                                    type="button"
                                    className="page-link"
                                    onClick={() =>
                                        onPageChange(page)
                                    }
                                >
                                    {page}
                                </button>
                            </li>
                        )

                ))}


                {/* Next */}

                <li
                    className={`page-item ${
                        currentPage === lastPage
                            ? "disabled"
                            : ""
                    }`}
                >
                    <button
                        type="button"
                        className="page-link"
                        disabled={
                            currentPage === lastPage
                        }
                        onClick={() =>
                            onPageChange(
                                currentPage + 1
                            )
                        }
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </li>

            </ul>
        </nav>
    );
}

export default Pagination;