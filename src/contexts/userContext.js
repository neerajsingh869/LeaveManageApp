import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { db } from "../configs/firebase";
import { doc, getDoc } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast';

const userContext = createContext();

const useUserContextValue = () => {
    return useContext(userContext);
}

const CustomUserContextProvider = ({ children }) => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [userUid, setUserUid] = useState(null);
    const [userInfo, setUserInfo] = useState({});

    // representation of authenticate user
    const auth = getAuth();

    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("user is signed in");
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                    setUserInfo(docSnap.data());
                    setIsSignedIn(true);
                    setUserUid(user.uid);
                }
            }});
    }, [auth]);

    const signOutUser = async () => {
        try {
            await signOut(auth);

            toast.success('User signed out successfully!', {
                duration: 2000,
                style: {
                    minWidth: "18rem",
                    minHeight: "3.5rem",
                    marginTo: "2rem"
                }
            });
        } catch (err) {
            toast.error(err.message, {
                duration: 2000,
                style: {
                    minWidth: "18rem",
                    minHeight: "3.5rem",
                    marginTo: "2rem"
                }
            });
            
        } finally {
            setIsSignedIn(false);
        }
    }

    const fetchUserInfo = async () => {
        const docRef = doc(db, "users", userUid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUserInfo(docSnap.data());
        } else {
            // docSnap.data() will be undefined in this case
            userInfo(null);
        }

    };

    const submitLeaves = async (leave) => {
        
    }
    
    return (
        <userContext.Provider value={{ isSignedIn, 
                                        setIsSignedIn, 
                                        userUid, 
                                        setUserUid, 
                                        userInfo, 
                                        setUserInfo,
                                        signOutUser,
                                        fetchUserInfo,
                                        submitLeaves }}>
            { children }
            <Toaster position="top-right" />
        </userContext.Provider>
    )
}

export { useUserContextValue };
export default CustomUserContextProvider;