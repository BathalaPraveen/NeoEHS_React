import "./view.css";

function DetailView({
    loading,
    data,
    fields,
    sectionTitle,
    emptyTitle,
    emptySubtitle,
    emptyIcon = "bi-inbox"
}) {
    if (loading) {
        return (
            <div className="neo-view-loading">
            </div>
        );
    }

    if (!data) {
        return (
            <div className="neo-empty">
                <div className="neo-empty-icon">
                    <i className={`bi ${emptyIcon}`}></i>
                </div>
                <div className="neo-empty-title">{emptyTitle}</div>
                <div className="neo-empty-subtitle">{emptySubtitle}</div>
            </div>
        );
    }

    return (
        <div className="neo-view-section">
            {sectionTitle && (
                <div className="neo-view-section-header">
                    {sectionTitle}
                </div>
            )}
            <div className="neo-view-grid">
                {fields.map((field) => (
                    <div className="neo-view-field" key={field.key}>
                        <span className="neo-view-label">
                            {field.label}
                        </span>
                        <span className="neo-view-value">
                            {field.render
                                ? field.render(data)
                                : data[field.key] || "-"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DetailView;