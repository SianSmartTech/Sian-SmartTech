import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../utils/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
const AuthContext = createContext();
const SESSION_DURATION = 2 * 60 * 60 * 1000; 
const LOGIN_TIME_KEY = "sian_admin_login_time";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const allowedEmailsStr = process.env.REACT_APP_ALLOWED_ADMIN_EMAILS || "";
  const allowedEmails = allowedEmailsStr
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);
  const allowedEmailsConfigured = allowedEmails.length > 0;
  const isAuthorized = user && allowedEmails.includes(user.email?.toLowerCase());
  const logout = () => {
    setLoading(true);
    try {
      localStorage.removeItem(LOGIN_TIME_KEY);
    } catch (e) {}
    return signOut(auth).finally(() => {
      setLoading(false);
    });
  };
  useEffect(() => {
    let timer;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        let loginTime = localStorage.getItem(LOGIN_TIME_KEY);
        const now = Date.now();
        if (!loginTime) {
          loginTime = now.toString();
          localStorage.setItem(LOGIN_TIME_KEY, loginTime);
        }
        const elapsed = now - parseInt(loginTime, 10);
        const remaining = SESSION_DURATION - elapsed;
        if (remaining <= 0) {
          setUser(null);
          try {
            localStorage.removeItem(LOGIN_TIME_KEY);
          } catch (e) {}
          signOut(auth);
          toast.error("Session expired after 2 hours. Please log in again.");
          setLoading(false);
          return;
        }
        setUser(currentUser);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          try {
            localStorage.removeItem(LOGIN_TIME_KEY);
          } catch (e) {}
          signOut(auth);
          setUser(null);
          toast.error("Session expired after 2 hours. Please log in again.");
        }, remaining);
      } else {
        setUser(null);
        try {
          localStorage.removeItem(LOGIN_TIME_KEY);
        } catch (e) {}
        if (timer) clearTimeout(timer);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
      if (timer) clearTimeout(timer);
    };
  }, []);
  const loginWithGoogle = () => {
    setLoading(true);
    try {
      localStorage.setItem(LOGIN_TIME_KEY, Date.now().toString());
    } catch (e) {}
    return signInWithPopup(auth, googleProvider).finally(() => {
      setLoading(false);
    });
  };
  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, isAuthorized, allowedEmailsConfigured, allowedEmails }}>{children}</AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};