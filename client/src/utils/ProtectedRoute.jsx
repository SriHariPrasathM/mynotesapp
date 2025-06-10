import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
/**
 * ProtectedRoute component checks if the user is authenticated.
 * If authenticated, it renders the children components.
 * If not authenticated, it redirects to the login page.
 */

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);
    return (user ? children : <Navigate to='/login' />)
};

export default ProtectedRoute;