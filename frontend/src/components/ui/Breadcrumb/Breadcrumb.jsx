import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useMenu } from "../../../context/MenuContext";

import {
    findMenuByPath,
    getMenuAncestors,
    normalizeMenuPath,
    slugify
} from "../../../utils/menu";

import "./Breadcrumb.css";


// =========================================================
// Breadcrumb
//
// Fully reusable across pages. The ancestor trail (everything
// except the last crumb) is derived automatically from the
// backend-driven left menu, based on the current route — so it
// stays in sync with the sidebar and is translated the same way.
//
// For pages that are not a 1:1 match with a menu entry (Add /
// Edit / View screens nested under a list page), pass `current`
// with that page's own translated title — it is appended as the
// final, active crumb while the menu trail still resolves to the
// parent list page.
// =========================================================

function Breadcrumb({
    current,
    homeTo = "/dashboard"
}) {

    const location = useLocation();

    const { menus } = useMenu();

    const { t } = useTranslation("sidebar");


    const menuLabel = (item) => {

        const key =
            item?.namekey ||
            slugify(item?.name);

        return t(
            key,
            { defaultValue: item?.name }
        );

    };


    const { matched, remainder } =
        findMenuByPath(
            menus,
            location.pathname
        );

    const ancestors =
        getMenuAncestors(menus, matched);


    // A trailing crumb is needed whenever we are on a sub-page
    // (add / edit / view) beyond the matched list page, or the
    // caller explicitly supplied one.

    const hasTrailingCrumb =
        Boolean(current) ||
        Boolean(remainder);


    const fallbackTrailing =
        remainder
            ? remainder
                .split("/")[0]
                .replace(/[-_]/g, " ")
                .replace(/^\w/, (char) => char.toUpperCase())
            : "";

    const trailingLabel =
        current || fallbackTrailing;


    return (

        <nav
            className="crumb-bar"
            aria-label="breadcrumb"
        >

            <Link
                to={homeTo}
                className="crumb-home"
                aria-label="Home"
                title="Home"
            >
                <i className="bi bi-house-door-fill"></i>
            </Link>


            {ancestors.map((item, index) => {

                const isLast =
                    index === ancestors.length - 1;

                const asLink =
                    isLast && hasTrailingCrumb;

                const asCurrent =
                    isLast && !hasTrailingCrumb;

                return (

                    <span
                        className="crumb-item"
                        key={item.id}
                    >

                        <span className="crumb-sep">/</span>

                        {asCurrent ? (

                            <span
                                className="crumb-current"
                                aria-current="page"
                            >
                                {menuLabel(item)}
                            </span>

                        ) : asLink ? (

                            <Link
                                to={`/${normalizeMenuPath(item.link)}`}
                                className="crumb-link"
                            >
                                {menuLabel(item)}
                            </Link>

                        ) : (

                            <span className="crumb-text">
                                {menuLabel(item)}
                            </span>

                        )}

                    </span>

                );

            })}


            {hasTrailingCrumb && trailingLabel && (

                <span className="crumb-item">

                    <span className="crumb-sep">/</span>

                    <span
                        className="crumb-current"
                        aria-current="page"
                    >
                        {trailingLabel}
                    </span>

                </span>

            )}

        </nav>

    );

}

export default Breadcrumb;
