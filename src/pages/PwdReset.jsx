import React, { useState } from 'react';
import axios from 'axios'; // or your preferred HTTP client
import { useNavigate } from 'react-router-dom';

const ForgotResetPassword = () => {
const [email, setEmail] = useState('user@example.com'); // Replace with real email
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState('');
  const [step, setStep] = useState(1); // 1: request, 2: reset
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

// Updated handleForgotPassword function
const handleForgotPassword = async (e) => {
  e.preventDefault();
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('Please enter a valid email address');
    return;
  }

  setIsLoading(true);
  setError('');
  
  try {
    const response = await axios.post('http://localhost:8000/api/send-reset-link', { email });
    setSuccess(response.data.message || 'Password reset link sent to your email');
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to send reset link');
  } finally {
    setIsLoading(false);
  }
};

// Updated handleResetPassword function
const handleResetPassword = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  if (newPassword !== confirmPassword) {
    setError('Passwords do not match');
    setIsLoading(false);
    return;
  }

  try {
    const response = await axios.post('http://localhost:8000/api/reset-password', { 
      token, 
      email,
      password: newPassword,
      password_confirmation: confirmPassword
    });
    setSuccess(response.data.message || 'Password reset successfully');
    setTimeout(() => navigate('/login'), 3000);
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to reset password');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="forgot-reset-container">
      <h2>{step === 1 ? 'Forgot Password' : 'Reset Password'}</h2>
      
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {step === 1 ? (
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="token">Reset Token</label>
            <input
              type="text"
              id="token"
              className="form-control"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              placeholder="Paste the token from your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength="8"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
      
      <div className="mt-3">
        <button 
          onClick={() => navigate('/login')} 
          className="btn btn-link"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotResetPassword;