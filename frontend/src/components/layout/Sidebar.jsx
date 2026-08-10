import { NavLink } from "react-router-dom";

const menu = [

    { title:"Dashboard", icon:"bi-speedometer2", path:"/dashboard" },

    { title:"Administration", icon:"bi-person-gear", path:"/admin" },

    { title:"Project Management", icon:"bi-folder2-open", path:"/project" },

    { title:"HIRA", icon:"bi-shield-check", path:"/hira" },

    { title:"Observation", icon:"bi-eye", path:"/observation" },

    { title:"Incident", icon:"bi-exclamation-triangle", path:"/incident" },

    { title:"Safety Meeting", icon:"bi-people", path:"/meeting" },

    { title:"Training", icon:"bi-book", path:"/training" },

    { title:"Audit", icon:"bi-clipboard-check", path:"/audit" },

    { title:"Inspection", icon:"bi-search", path:"/inspection" },

    { title:"Chemical", icon:"bi-droplet", path:"/chemical" },

    { title:"Carbon", icon:"bi-globe2", path:"/carbon" },

    { title:"Reports", icon:"bi-file-earmark-bar-graph", path:"/reports" },

    { title:"Settings", icon:"bi-gear", path:"/settings" }

];

function Sidebar({ collapsed }) {

    return(

        <div className={`sidebar ${collapsed?"collapsed":""}`}>

            <ul className="nav flex-column">

                {

                    menu.map((item,index)=>

                        <li key={index}>

                            <NavLink

                                to={item.path}

                                className="nav-link text-white px-3 py-3"

                            >

                                <i className={`${item.icon} fs-5`}></i>

                                {

                                    !collapsed &&

                                    <span className="ms-3">

                                        {item.title}

                                    </span>

                                }

                            </NavLink>

                        </li>

                    )

                }

            </ul>

        </div>

    );

}

export default Sidebar;