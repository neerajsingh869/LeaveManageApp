import { useRef } from "react";
import { useUserContextValue } from "../../contexts/userContext";
import styles from "./ApplyLeave.module.css";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../configs/firebase";

const ApplyLeave = () => {
    const inputLeaveType = useRef();
    const inputLeaveReason = useRef();
    const inputStartDate = useRef();
    const inputEndDate = useRef();

    const { userInfo, setUserInfo, userUid } = useUserContextValue();
    const navigate = useNavigate();

    const dateValidation = (userInfo, startDate, endDate) => {
        // case1: start date should always be less than or equal to end date
        if (endDate < startDate) {
            toast.error("End date can not be less than Start Date!", {
                duration: 2000,
                style: {
                    minWidth: "18rem",
                    minHeight: "3.5rem",
                    marginTo: "2rem"
                }
            });

            return false;
        }

        // case2: start date for new leaves must be greater than end date of previous leaves
        if (userInfo && userInfo.leaves && userInfo.leaves[0].endDate >= startDate) {
            toast.error("Start date must be greater than previous leave's end date!", {
                duration: 2000,
                style: {
                    minWidth: "18rem",
                    minHeight: "3.5rem",
                    marginTo: "2rem"
                }
            });

            return false;
        }

        const startDateDay = new Date(startDate).getDay();
        // case3: start date must not lie in weekends
        if (startDateDay === 0 || startDateDay === 6) {
            toast.error("Start date can't lie in weekends!", {
                duration: 2000,
                style: {
                    minWidth: "18rem",
                    minHeight: "3.5rem",
                    marginTo: "2rem"
                }
            });

            return false;
        }

        const endDateDay = new Date(endDate).getDay();
        // case4: end date must not lie in weekends
        if (endDateDay === 0 || endDateDay === 6) {
            toast.error("End date can't lie in weekends!", {
                duration: 2000,
                style: {
                    minWidth: "18rem",
                    minHeight: "3.5rem",
                    marginTo: "2rem"
                }
            });

            return false;
        }

        const dateDiff = 1 + 
                            (new Date(endDate).getTime() - 
                            new Date(startDate).getTime()) 
                            / (1000 * 60 * 60 * 24);

        const datesBetweenStartAndEnd = Array.from({ length: dateDiff }, (v, i) => {
            return new Date(new Date(startDate).getTime()  + i * (1000 * 60 * 60 * 24));
        });

        const weekends = datesBetweenStartAndEnd.filter(date => date.getDay() === 0 || date.getDay() === 6);
        // case5: there must not be any weekends between start and end date
        if (weekends.length !== 0) {
            toast.error("There must not be any weekends between start and end date!", {
                duration: 2000,
                style: {
                    minWidth: "18rem",
                    minHeight: "3.5rem",
                    marginTo: "2rem"
                }
            });

            return false;
        }

        // case6: difference between start and end date must not be greater than 5
        if (dateDiff > 5) {
            toast.error("Difference between start and end dates must not be greater than 5!", {
                duration: 2000,
                style: {
                    minWidth: "18rem",
                    minHeight: "3.5rem",
                    marginTo: "2rem"
                }
            });

            return false;
        }

        return true;
    }

    const handleOnSubmitLeaves = async (e) => {
        e.preventDefault();

        const leaveType = inputLeaveType.current.value;
        const leaveReason = inputLeaveReason.current.value;
        const startDate = inputStartDate.current.value;
        const endDate = inputEndDate.current.value;

        const leave = {
            id: new Date().getTime(),
            approved: false,
            type: leaveType,
            reason: leaveReason,
            startDate: startDate,
            endDate: endDate
        };

        const isValid = dateValidation(userInfo, startDate, endDate);

        if (!isValid) {
            return;
        }

        const updatedLeaves = [
            leave, 
            ...userInfo.leaves
        ];

        const updatedUserInfo = {
            ...userInfo,
            leaves: updatedLeaves
        }

        setUserInfo(updatedUserInfo);
        
        try {
            await setDoc(doc(db, "users", userUid), updatedUserInfo);

            toast.success("Leaves submitted successfully!", {
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
        }

        navigate("/");

        resetForm();
    }

    const resetForm = () => {
        inputLeaveReason.current.value = "";
        inputLeaveType.current.value = "";
        inputStartDate.current.value = "";
        inputEndDate.current.value = "";
    }

    return (
        <div className={ styles.applyLeaveFormContainer }>
            <form onSubmit={ handleOnSubmitLeaves }>
                <div>
                    <p>Leave Type</p>
                    <select className={ styles.leaveTypeSelect } name="leaveTypes" required ref={ inputLeaveType }>
                        <option value="" defaultValue={ true }>Please select</option>
                        <option value="Attendance Request">Attendance Request</option>
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Comp Off Leave">Comp Off Leave</option>
                        <option value="Earned Leave">Earned Leave</option>
                        <option value="Leave Without Pay">Leave Without Pay</option>
                        <option value="Paternity Leave">Paternity Leave</option>
                        <option value="Sick Leave">Sick Leave</option>
                    </select>
                </div>
                <div>
                    <p>Leave Reason</p>
                    <input className={ styles.leaveReasonInput } type="text" ref={ inputLeaveReason } />
                </div>
                <div>
                    <p>Duration</p>
                    <div className={ styles.startEndDateContainer }>
                        <div>
                            <label className={ styles.startDateLabel }>Start Date</label>
                            <input className={ styles.startDateInput } type="date" required ref={ inputStartDate } />
                        </div>
                        <div>
                            <label className={ styles.endDateLabel }>End Date</label>
                            <input className={ styles.endDateInput } type="date" required ref={ inputEndDate } />
                        </div>
                    </div>
                </div>
                <button className={ styles.submitBtn }>Submit</button>
            </form>
        </div>
    )
};

export default ApplyLeave;