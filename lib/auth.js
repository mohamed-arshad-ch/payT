// utils/auth.js
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

// Decrypt the token from the cookie
export const decryptData = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, "Mcodev@123");
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Check if the user is authenticated (i.e., token exists and decrypted username matches)
export const isAuthenticated = () => {
  const token = Cookies.get("user_token");
  if (token) {
    const decryptedUsername = decryptData(token);
    if (decryptedUsername === "Mach") {
      return true;
    }
  }
  return false;
};
