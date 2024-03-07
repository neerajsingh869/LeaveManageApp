import { useRef, useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { db } from "../../configs/firebase";
import { doc, setDoc } from "firebase/firestore"; 
import { useUserContextValue } from "../../contexts/userContext";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import toast from 'react-hot-toast';

const Register = () => {
    const inputEmail = useRef();
    const inputPassword = useRef();
    const inputName = useRef();
    const inputOHR = useRef();
    const { setIsSignedIn, setUserUid, setUserInfo } = useUserContextValue();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const auth = getAuth();

    const handleSignUp = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const email = inputEmail.current.value;
            const password = inputPassword.current.value;
            const name = inputName.current.value;
            const ohr = inputOHR.current.value;

            const userInfo = {
                name: name, 
                ohr: ohr,
                email: email,
                leaves: []
            };

            const res = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", res.user.uid), userInfo);

            navigate("/");

            setIsSignedIn(true);
            setUserUid(res.user.uid);
            setUserInfo(userInfo);
            
            toast.success('User signed up successfully!', {
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
            setUserUid(null);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className={ styles.formContainer }>
                <form onSubmit={ handleSignUp }>
                    <h2>Sign Up</h2>
                    <input type="text" placeholder="Enter Name" ref={ inputName } required />
                    <input type="number" placeholder="Enter OHR" ref={ inputOHR } required />
                    <input type="email" placeholder="Enter Email" ref={ inputEmail } required />
                    <input type="password" placeholder="Enter Password" ref={ inputPassword } required />
                    <button>
                        { 
                            loading ? <BeatLoader
                                color="white"
                                size={10}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            /> : "Sign Up" 
                        }
                    </button>
                </form>
            </div>
        </>
    )
};

export default Register;