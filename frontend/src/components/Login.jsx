import React, { useState } from 'react';
import './../styles/Login.css';

export default function Login() {
  const [showSecurity, setShowSecurity] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || "/api/";
  const handleSteamLogin = () => {
    window.location.href = `${API_URL}/login-steam.php`;
  };
  //add to body class login-page on load and remove on unload
  React.useEffect(() => {
    document.body.classList.add('login-page');
    return () => {
      document.body.classList.remove('login-page');
    };
  }, []);

  return (
    <>
      <div className="login-glass-bg" />
      <div className="login-box">
        <h2>Weapon Paints Login</h2>
        <p>Log in to access your profile and manage your loadouts.</p>
        <button className="steam-button" onClick={handleSteamLogin} aria-label="Sign in with Steam">
            <img src="/images/Steam_icon_logo.svg" alt="Steam Logo" width={80} draggable={false} />
            <span>
              Sign in with Steam
            </span>
        </button>
        <div style={{ marginTop: 24 }}>
          <button className="security-info-btn" onClick={() => setShowSecurity(true)}>
            Steam Login Safety Info
          </button>
        </div>
      </div>
      {showSecurity && (
        <div className="security-popup-bg" onClick={() => setShowSecurity(false)}>
          <div className="security-popup" onClick={e => e.stopPropagation()}>
            <h3>Safe Steam Login – What to Check</h3>
            <ul className="security-list">
              <li>Always make sure the login page address is <b>steamcommunity.com/openid</b> or <b>https://steamcommunity.com/</b></li>
              <li>The address must start with <b>https://</b> and show a padlock (SSL certificate)</li>
              <li>Never enter your Steam credentials on any domain other than <b>steamcommunity.com</b></li>
              <li>After logging in, this site never receives your password or Steam login data</li>
              <li>Authentication uses the official Steam OpenID API</li>
              <li>You can always check the redirect address in your browser’s address bar</li>
              <li>Example login URL: <code>https://steamcommunity.com/openid/login?...</code></li>
              <li>If in doubt, check the <a href="https://steamcommunity.com/dev" target="_blank" rel="noopener noreferrer">official Steam API documentation</a></li>
            </ul>
            <button className="security-close-btn" onClick={() => setShowSecurity(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
