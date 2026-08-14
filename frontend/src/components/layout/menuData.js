const menuData = [
    {
        id: 1,
        title: "Dashboard",
        icon: "bi-speedometer2",
        path: "/dashboard"
    },
    {
        id: 2,
        title: "Masters",
        icon: "bi-database",
        children: [
            {
                id: 21,
                title: "Company",
                path: "/masters/company"
            },
            {
                id: 22,
                title: "Location",
                path: "/masters/location"
            }
        ]
    },
    {
        id: 3,
        title: "Audit",
        icon: "bi-shield-check",
        path: "/audit"
    },
    {
        id: 4,
        title: "Inspection",
        icon: "bi-clipboard-check",
        path: "/inspection"
    }
];
export default menuData;