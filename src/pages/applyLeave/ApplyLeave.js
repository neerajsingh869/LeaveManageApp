import { useRef } from "react";
import { useUserContextValue } from "../../contexts/userContext";
import styles from "./ApplyLeave.module.css";
import { useNavigate } from "react-router-dom";
import { db } from "../../configs/firebase";
import { doc, setDoc } from "firebase/firestore"; 

const ApplyLeave = () => {
    const inputLeaveType = useRef();
    const inputLeaveReason = useRef();
    const inputStartDate = useRef();
    const inputEndDate = useRef();

    const { userUid, userInfo, setUserInfo } = useUserContextValue();
    const navigate = useNavigate();

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

        const updatedLeaves = [
            leave, 
            ...userInfo.leaves
        ];

        const updatedUserInfo = {
            ...userInfo,
            leaves: updatedLeaves
        }

        setUserInfo(updatedUserInfo);
        await setDoc(doc(db, "users", userUid), updatedUserInfo);

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