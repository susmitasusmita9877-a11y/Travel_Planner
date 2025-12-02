// client/src/components/GoogleLoginButton.jsx
import React from 'react';
import { FaGoogle } from 'react-icons/fa';

export default function GoogleLoginButton({ text = "Continue with Google" }) {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth route
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'/auth/google}`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="btn btn-outline w-full flex items-center justify-center gap-3 py-3"
      type="button"
    >
      <FaGoogle size={20} className="text-red-500" />
      <span>{text}</span>
    </button>
  );
}