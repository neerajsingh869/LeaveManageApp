import { useRef, useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useUserContextValue } from "../../contexts/userContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { BeatLoader } from "react-spinners";
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {
    const inputEmail = useRef();
    const inputPassword = useRef();
    const { setIsSignedIn, setUserUid } = useUserContextValue();
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
            navigate("/");
            setIsSignedIn(true);
            setUserUid(res.user.uid);

            toast.success('User signed in successfully!', {
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

            setIsSignedIn(false);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={ styles.formContainer }>
                <form onSubmit={ handleSignIn }>
                    <h2>Sign In</h2>
                    <input type="email" placeholder="Enter Email" ref={ inputEmail } />
                    <input type="password" placeholder="Enter Password" ref={ inputPassword } />
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
            <Toaster position="top-right" />
        </>
    )
};

export default Login;