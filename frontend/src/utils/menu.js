// =========================================================
// Shared menu helpers
//
// Used by the Sidebar (left navigation) and the Breadcrumb
// component so both derive page hierarchy from the same
// backend-driven menu tree instead of duplicating logic.
// =========================================================
export const slugify = (str) =>
    (str || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
export const normalizeMenuPath = (path) => {
    if (!path || path === "#") {
        return "";
    }
    let cleanPath = path;
    // Remove old Laravel application path if it exists
    cleanPath = cleanPath.replace(
        /^.*NeoEHS_Laravel_Complete_Pack\/public\//i,
        ""
    );
    cleanPath = cleanPath.replace(/^\/+/, "");
    cleanPath = cleanPath.replace(/\/+$/, "");
    return cleanPath.toLowerCase();
};
export const buildMenuTree = (items, parentId = 0) => {
    return items
        .filter((item) => Number(item.parent_id) === Number(parentId))
        .sort((a, b) => Number(a.sort_order) - Number(b.sort_order))
        .map((item) => ({
            ...item,
            children: buildMenuTree(items, item.id)
        }));
};
// =========================================================
// Ancestor Chain
//
// Walks parent_id upward from the given menu item until the
// root, returning [root, ..., item] in display order.
// =========================================================
export const getMenuAncestors = (menus, item) => {
    if (!item) {
        return [];
    }
    const byId = new Map(
        menus.map((menu) => [Number(menu.id), menu])
    );
    const chain = [];
    let current = item;
    while (current) {
        chain.unshift(current);
        const parentId = Number(current.parent_id);
        current = parentId ? byId.get(parentId) : null;
    }
    return chain;
};
// =========================================================
// Match Current Route To A Menu Item
//
// Finds the menu item whose `link` best matches the current
// pathname. Supports exact matches (list pages) as well as
// pages nested under a menu link (add / edit / view / etc.),
// returning the unmatched trailing segment as `remainder`.
// =========================================================
export const findMenuByPath = (menus, pathname) => {
    const currentPath = normalizeMenuPath(pathname);
    if (!currentPath) {
        return {
            matched: null,
            remainder: ""
        };
    }
    let best = null;
    let bestLength = -1;
    menus.forEach((item) => {
        const menuPath = normalizeMenuPath(item.link);
        if (!menuPath) {
            return;
        }
        const isExact = currentPath === menuPath;
        const isNested =
            currentPath.startsWith(`${menuPath}/`);
        if (
            (isExact || isNested) &&
            menuPath.length > bestLength
        ) {
            best = item;
            bestLength = menuPath.length;
        }
    });
    if (!best) {
        return {
            matched: null,
            remainder: currentPath
        };
    }
    const bestPath = normalizeMenuPath(best.link);
    const remainder =
        currentPath === bestPath
            ? ""
            : currentPath.slice(bestPath.length + 1);
    return {
        matched: best,
        remainder
    };
};
