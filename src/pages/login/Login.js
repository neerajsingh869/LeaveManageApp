import { useRef, useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useUserContextValue } from "../../contexts/userContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { BeatLoader } from "react-spinners";
import toast from 'react-hot-toast';
import { db } from "../../configs/firebase";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
    const inputEmail = useRef();
    const inputPassword = useRef();
    const { setIsSignedIn, setUserUid, setUserInfo } = useUserContextValue();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const auth = getAuth();

    const handleSignIn = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const email = inputEmail.current.value;
            const password = inputPassword.current.value;

            const res = await signInWithEmailAndPassword(auth, email, password);

            const docRef = doc(db, "users", res.user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setUserInfo(docSnap.data());

                toast.success('User signed in successfully!', {
                    duration: 2000,
                    style: {
                        minWidth: "18rem",
                        minHeight: "3.5rem",
                        marginTo: "2rem"
                    }
                });

                navigate("/");
                setIsSignedIn(true);
                setUserUid(res.user.uid);
            } else {
                toast.success('User details not found. Please contact IT Team!', {
                    duration: 2000,
                    style: {
                        minWidth: "18rem",
                        minHeight: "3.5rem",
                        marginTo: "2rem"
                    }
                });

                setIsSignedIn(false);
                setUserUid(null);
            }
        } catch (err) {
            toast.error(err.message, {
                duration: 2000,
                style: {
                    minWidth: "18rem",
                    minHeight: "3.5rem",
                    marginTo: "2rem"
                }
            });

            setIsSignedIn(false);
            setUserUid(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={ styles.formContainer }>
                <form onSubmit={ handleSignIn }>
                    <h2>Sign In</h2>
                    <input type="email" placeholder="Enter Email" required ref={ inputEmail } />
                    <input type="password" placeholder="Enter Password" required ref={ inputPassword } />
                    <button>
                        { 
                            loading ? <BeatLoader
                                color="white"
                                size={10}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            /> : "Sign In" 
                        }
                    </button>
                    <Link to="/signup">Or SignUp instead</Link>
                </form>
            </div>
        </>
    )
};

export default Login;