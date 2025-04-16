// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase configuration
// You can find these values in your Firebase project settings
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBnwnjq3JO8-JoAQuVixKD6UTz06mlQbaA",
  authDomain: "asha-ai-chatbot.firebaseapp.com",
  projectId: "asha-ai-chatbot",
  storageBucket: "asha-ai-chatbot.firebasestorage.app",
  messagingSenderId: "322899675137",
  appId: "1:322899675137:web:fd5c97a879ae4702ded800",
  measurementId: "G-4HR9YCQEF1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (handle gracefully if not supported in environment)
let analytics = null;

// Function to initialize analytics safely
const initializeAnalytics = async () => {
  try {
    const analyticsSupported = await isSupported();
    if (analyticsSupported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized successfully");
      return true;
    } else {
      console.log("Firebase Analytics is not supported in this environment");
      return false;
    }
  } catch (error) {
    console.error("Error initializing Firebase Analytics:", error);
    return false;
  }
};

// Initialize analytics
initializeAnalytics();

export { app, analytics };