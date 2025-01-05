// utils/auth.js
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

// Decrypt the token from the cookie
export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, "Mcodev@123");
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Check if the user is authenticated by making a GET request to the API
export const isAuthenticated = async () => {
  const token = Cookies.get("user_token");
  if (!token) {
    window.location.href = "/"; // Redirect to login if token doesn't exist
    return false;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (response.ok) {
      return true; // Authentication successful
    }

    const data = await response.json();
    if (data.error && data.error.status === 401) {
      window.location.href = "/"; // Redirect to login if unauthorized
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    window.location.href = "/"; // Redirect to login on error
  }

  return false;
};
