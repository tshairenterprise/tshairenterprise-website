import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const action = useNavigationType(); // Ye batata hai ki user ne link click kiya ya back button dabaya

    useEffect(() => {
        // Agar user ne naya page khola hai (PUSH action), toh top pe jao
        if (action !== "POP") {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant", // "smooth" maat rakhna, warna flicker karega
            });
        }
        // Agar action "POP" hai (Back Button), toh browser apne aap purani position handle karega
    }, [action, pathname]);

    return null;
};

export default ScrollToTop;