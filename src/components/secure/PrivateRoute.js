import { Navigate } from "react-router-dom";
import { useUserContextValue } from "../../contexts/userContext";

const PrivateRoute = ({ children }) => {
    const { isSignedIn } = useUserContextValue();

    if (!isSignedIn) return <Navigate to="/" replace={ true } />;

    return (
        children
    )
};

export default PrivateRoute;