import { Link, useNavigate } from "react-router-dom";
import { useUserContextValue } from "../../contexts/userContext";
import styles from "./Home.module.css";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../configs/firebase";

const Home = () => {
    const { isSignedIn, userUid, userInfo, setUserInfo } = useUserContextValue();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserLeaves = async () => {
            console.log(userUid);
            const docRef = doc(db, "users", userUid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setUserInfo(docSnap.data());
            } else {
                // docSnap.data() will be undefined in this case
                userInfo(null);
                console.log("No such document!");
            }

        };

        if (isSignedIn) {
            fetchUserLeaves();
        }
    }, []);

    return (
        <>
            { 
                !isSignedIn ? 
                    <div className={ styles.beforeSignInHomePage }>
                        <h2>
                            Please <Link className={ styles.signInLink } to="/signin" >Sign In</Link> to go to Dashboard
                        </h2>
                    </div>    
                :  
                    <div className={ styles.afterSignInHomePage }>
                        <button className={ styles.applyLeaveBtn } onClick={ (e) => {
                            e.preventDefault();

                            navigate("/applyleaves");
                        } }>
                            Apply for leave/attendance/comp off
                        </button>
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Leave Type</th>
                                        <th>Days</th>
                                        <th>Approved Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        userInfo && userInfo.leaves.map(leave => {
                                            console.log(typeof (leave.startDate));
                                            console.log(leave.endDate);
                                            return (
                                                <tr key={ leave.id }>
                                                    <td>{ leave.startDate }</td>
                                                    <td>{ leave.endDate }</td>
                                                    <td>{ leave.type }</td>
                                                    <td>
                                                        { 
                                                            1 + 
                                                            (new Date(leave.endDate).getTime() - 
                                                            new Date(leave.startDate).getTime()) 
                                                            / (1000 * 60 * 60 * 24) 
                                                        }
                                                        </td>
                                                    <td>
                                                        { 
                                                            leave.approved ? 
                                                                "Approved" : 
                                                                "Submitted for Approval" 
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
        </>
    )
};

export default Home;