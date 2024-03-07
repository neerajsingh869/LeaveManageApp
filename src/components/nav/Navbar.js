import { NavLink, Outlet } from "react-router-dom";
import { useUserContextValue } from "../../contexts/userContext";
import styles from "./Navbar.module.css";
import companyImage from "../../assets/company.png";
import logoutImage from "../../assets/logout.png";
import signinImage from "../../assets/signin.png";

const Navbar = () => {
    const { isSignedIn, userInfo, signOutUser } = useUserContextValue();

    return (
        <>
            <header>
                <nav>
                    <NavLink className={ styles.navHome } to="/">
                        <img src={ companyImage } alt="Genpact" />
                        Genpact
                    </NavLink>
                    <ul className={ styles.navItemsContainer }>
                        { isSignedIn ? (
                            <>
                                <li className={ `${ styles.navItem } ${ styles.ohrItem }` }>
                                    Logged in as: { userInfo.ohr }
                                </li>
                                <li className={ styles.navItem } onClick={ signOutUser }>
                                    <NavLink className={ styles.navLink } to="/">
                                        <img src={ logoutImage } alt="Logout" />
                                        Logout
                                    </NavLink>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className={ styles.navItem }>
                                    <NavLink className={ styles.navLink } to="/signin">
                                        <img src={ signinImage } alt="Sign In" />
                                        SignIn
                                    </NavLink>
                                </li>
                            </>
                        ) }
                    </ul>
                </nav>
            </header>
            <Outlet />
        </>
    )
};

export default Navbar;