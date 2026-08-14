import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import axios from "axios";
import { buildMenuTree } from "../utils/menu";
const MenuContext = createContext();
export function MenuProvider({ children }) {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response =
                    await axios.get(
                        "http://localhost:5000/api/admin/menus"
                    );
                if (response.data.success) {
                    setMenus(
                        response.data.data
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load menu:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };
        fetchMenus();
    }, []);
    const menuTree = buildMenuTree(menus);
    return (
        <MenuContext.Provider
            value={{
                menus,
                menuTree,
                loading
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}
export function useMenu() {
    return useContext(MenuContext);
}
