// utils/withAuth.js
import { isAuthenticated } from "./auth"; // Import the function that checks authentication
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Higher-order component for authentication
export const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false); // State to track authentication

    useEffect(() => {
      const authStatus = isAuthenticated();
      if (!authStatus) {
        // Redirect to login page if not authenticated
        router.push("/");
      } else {
        setIsAuth(true); // Allow rendering only when authenticated
      }
    }, []);

    // Render null until authentication state is determined
    if (!isAuth) {
      return null;
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };
};
