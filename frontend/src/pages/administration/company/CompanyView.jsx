import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../../../components/ui/Breadcrumb/Breadcrumb";
import { ViewPage } from "../../../components/ui/ViewPage";
import { formatDate } from "../../../utils/common";
import BackButton from "../../../components/ui/Button/BackButton";

function CompanyView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { state } = useLocation();

    const [company, setCompany] = useState(state?.company || null);
    const [loading, setLoading] = useState(!state?.company);
    const getAuthToken = () => {
        return (
            localStorage.getItem("authToken") ||
            sessionStorage.getItem("authToken")
        );
    };

    const fetchCompany = async () => {
        try {
            setLoading(true);
            const token = getAuthToken();
            const response = await axios.get(
                `http://localhost:5000/api/admin/companies/view/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data && response.data.success) {
                setCompany(response.data.data || null);
            } else {
                setCompany(null);
            }
        } catch (error) {
            console.error("Get company error:", error);
            setCompany(null);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        // Skip the network call if we already have the row's data
        // (e.g. navigated here from the list page's View button)
        if (!state?.company) {
            fetchCompany();
        }
    }, [id]);

   
    return (
        <div className="container-fluid py-3">
            <Breadcrumb />
            <div className="neo-card">
             
                 <div className="neo-header">
                    <div>
                        <h4 className="neo-header-title">
                            {t("company_master.view_title")}
                        </h4>
                        <p className="neo-header-subtitle">
                            {t("company_master.view_subtitle")}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="neo-btn-back"
                        onClick={() =>
                            navigate("/company/list")
                        }
                    >
                        <i className="bi bi-arrow-left"></i>
                        {t("company_master.back")}
                    </button>
                </div>


                <div className="company-view">
                    <ViewPage
                        loading={loading}
                        data={company}
                        loadingText={t("company_master.loading")}
                        sectionTitle={t("company_master.section_details")}
                        emptyIcon="bi-building-x"
                        emptyTitle={t("company_master.comp_not_found")}
                        emptySubtitle={t("company_master.comp_not_found_subtitle")}
                        fields={[
                            {
                                key: "company_id",
                                label: t("company_master.col_company_id")
                            },
                            {
                                key: "company_name",
                                label: t("company_master.col_company_name")
                            },
                            {
                                key: "short_name",
                                label: t("company_master.col_short_name")
                            },
                            {
                                key: "created_at",
                                label: t("company_master.col_created_date"),
                                render: (row) => formatDate(row.created_at)
                            }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}

export default CompanyView;