// utils/withAuth.js
import { isAuthenticated } from "./auth"; // Import the function that checks authentication
import { useRouter } from "next/router";
import { useEffect } from "react";

// Higher-order component for authentication
export const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      // If the user is not authenticated, redirect to login page
      if (!isAuthenticated()) {
        router.push("/"); // Redirect to login page if not authenticated
      }
    }, []);

    // Render the page component if authenticated, otherwise nothing
    return isAuthenticated() ? <WrappedComponent {...props} /> : null;
  };
};
