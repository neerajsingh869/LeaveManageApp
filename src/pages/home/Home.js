import { Link, useNavigate } from "react-router-dom";
import { useUserContextValue } from "../../contexts/userContext";
import styles from "./Home.module.css";
import { useEffect } from "react";

const Home = () => {
    const { isSignedIn, fetchUserInfo, userInfo } = useUserContextValue();

    const navigate = useNavigate();

    useEffect(() => {
        if (isSignedIn) {
            fetchUserInfo();
        }
    }, [isSignedIn, fetchUserInfo]);

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