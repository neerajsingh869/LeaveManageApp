import { createContext, useContext, useState } from "react";

const userContext = createContext();

const useUserContextValue = () => {
    return useContext(userContext);
}

const CustomUserContextProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userUid, setUserUid] = useState(null);
    const [userInfo, setUserInfo] = useState({});

    return (
        <userContext.Provider value={{ isSignedIn, setIsSignedIn, userUid, setUserUid, userInfo, setUserInfo }}>
            { children }
        </userContext.Provider>
    )
}

export { useUserContextValue };
export default CustomUserContextProvider;