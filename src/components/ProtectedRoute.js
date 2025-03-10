import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthProvider';
import { useContext } from 'react';


const ProtectedRoute = ({ allowedRoles }) => {
    const { auth } = useContext(AuthContext);  // Get the user role

    console.log("Auth State:", auth);  // Debugging

    const userRole = auth?.roles; // Extract role

    console.log("User Role:", userRole);  // Debugging
    console.log("Allowed Roles:", allowedRoles);  // Debugging

    if (!userRole) {

        console.log("Redirecting to login...");
        return <Navigate to="/" />; // If no user role (unauthenticated), redirect to login
    }

    if (!allowedRoles.includes(userRole)) {
        console.log("User role not authorized, redirecting...");
        return <Navigate to="/" />; // If the role is not allowed, redirect to home or another page
    }

    return <Outlet />; // Allow access to protected routes
};

export default ProtectedRoute;