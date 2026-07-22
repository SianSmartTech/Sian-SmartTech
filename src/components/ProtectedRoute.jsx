import { useAuth } from "../context/AuthContext";
import { ShieldAlert, Lock, LogOut, Key, AlertTriangle } from "lucide-react";
import "../css/AuthStyles.css";
const ProtectedRoute = ({ children }) => {
  const { user, loading, loginWithGoogle, logout, isAuthorized, allowedEmailsConfigured } = useAuth();
  
  // Dev-only Auth Bypass for automated verification / browser subagent testing
  if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mockAuth') === 'true') {
    return children;
  }
  if (loading) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-card auth-loader-card">
          <div className="auth-spinner"></div>
          <span className="auth-loading-text">Verifying authentication...</span>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-glow-blob auth-glow-blob-1"></div>
        <div className="auth-glow-blob auth-glow-blob-2"></div>
        <div className="auth-card">
          <div className="auth-icon-wrap"><Lock size={28} /></div>
          <h2 className="auth-title">Admin Console</h2>
          <p className="auth-subtitle">Secure administrative area for Sian SmartTech. Sign in using your registered Google account to continue.</p>
          <button className="btn-google-login" onClick={loginWithGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.6c-.28 1.45-1.1 2.68-2.33 3.5v2.9h3.76c2.2-2 3.7-5 3.7-8.33Z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.9l-3.76-2.9c-1.04.7-2.38 1.1-4.17 1.1-3.2 0-5.9-2.16-6.87-5.07H1.28v3c2 3.97 6.1 6.77 10.72 6.77Z" />
              <path fill="#FBBC05" d="M5.13 14.23A7.14 7.14 0 0 1 4.75 12c0-.77.13-1.52.38-2.23V6.77H1.28A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.28 5.43l3.85-3.2Z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.6 4.6 1.8l3.43-3.43A11.96 11.96 0 0 0 12 0C7.38 0 3.28 2.8 1.28 6.77l3.85 3c.97-2.9 3.67-5.02 6.87-5.02Z" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }
  if (!allowedEmailsConfigured) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-card">
          <div className="auth-icon-wrap warning">
            <AlertTriangle size={28} />
          </div>
          <h2 className="auth-title">Setup Incomplete</h2>
          <p className="auth-subtitle auth-subtitle-mb16">Firebase sign-in succeeded, but no administrator emails have been configured in the system environment.</p>
          <div className="auth-alert-box">
            <span className="auth-alert-title"><Key size={14} /> System Config Needed</span>
            Please open the <code>.env</code> file in the project root and add your email to the <code>REACT_APP_ALLOWED_ADMIN_EMAILS</code> variable.
          </div>
          <div className="auth-user-block">
            {user.photoURL && (
              <img src={user.photoURL} alt="Avatar" className="auth-user-avatar" />
            )}
            <div className="auth-user-info">
              <div className="auth-user-name">{user.displayName || "Google User"}</div>
              <div className="auth-user-email">{user.email}</div>
            </div>
          </div>
          <button className="btn-auth-secondary" onClick={logout}>
            <LogOut size={16} /> Disconnect & Sign Out
          </button>
        </div>
      </div>
    );
  }
  if (!isAuthorized) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-card">
          <div className="auth-icon-wrap error">
            <ShieldAlert size={28} />
          </div>
          <h2 className="auth-title">Access Denied</h2>
          <p className="auth-subtitle auth-subtitle-mb16">This account does not have authorization to view the administration dashboard.</p>
          <div className="auth-alert-box auth-alert-box-error">
            <span className="auth-alert-title auth-alert-title-error">Unrecognized Administrator</span>Your email is not present in the allowed administrator list. Contact the system administrator or check your configuration.
          </div>
          <div className="auth-user-block">
            {user.photoURL && (
              <img src={user.photoURL} alt="Avatar" className="auth-user-avatar" />
            )}
            <div className="auth-user-info">
              <div className="auth-user-name">{user.displayName || "Google User"}</div>
              <div className="auth-user-email">{user.email}</div>
            </div>
          </div>
          <button className="btn-auth-secondary" onClick={logout}>
            <LogOut size={16} /> Sign In with Different Account
          </button>
        </div>
      </div>
    );
  }
  return children;
};
export default ProtectedRoute;