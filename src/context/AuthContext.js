import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider } from "../utils/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
const AuthContext = createContext();
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
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);
  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider).finally(() => {
      setLoading(false);
    });
  };
  const logout = () => {
    setLoading(true);
    return signOut(auth).finally(() => {
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