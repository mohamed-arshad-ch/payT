import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import CryptoJS from "crypto-js";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function dateFormatToDay(date){
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = String(date.getDate()).padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}


export function encryptAmount(amount){
  const cipherText = CryptoJS.AES.encrypt(amount.toString(), "Mcodev@123").toString();
  
  
  const urlSafeCipherText = cipherText.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
 
  return urlSafeCipherText;
 
}

export function decryptAmount(cipherText){
  
  
  if (!cipherText) {
    throw new Error('Invalid cipherText: it is undefined or null.');
  }

  try {
    const base64CipherText = cipherText.replace(/-/g, "+").replace(/_/g, "/");

    const bytes = CryptoJS.AES.decrypt(base64CipherText, "Mcodev@123");
    const originalAmount = bytes.toString(CryptoJS.enc.Utf8);

    if (!originalAmount) {
      throw new Error("Decryption failed: Result is empty.");
    }

    return originalAmount;
  } catch (error) {
    console.error('Error during decryption:', error.message);
    throw new Error('Decryption failed.');
  }
}