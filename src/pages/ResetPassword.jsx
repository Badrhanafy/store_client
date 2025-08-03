import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css'; // Create this CSS file
import { Link } from 'react-router-dom';
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    let strength = 0;
    if (password.length > 0) strength += 10;
    if (password.length >= 8) strength += 30;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    setPasswordStrength(Math.min(strength, 100));
  }, [password]);

  const validate = () => {
    const newErrors = {};
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      await axios.post('http://localhost:8000/api/reset-password', {
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });
      
      setMessage({ 
        text: 'Password reset successfully! You can now log in with your new password.', 
        type: 'success' 
      });
      
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      let errorMessage = 'Failed to reset password. Please try again.';
      
      if (error.response) {
        if (error.response.data.errors) {
          const backendErrors = {};
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            backendErrors[field] = messages.join(' ');
          });
          setErrors(backendErrors);
          errorMessage = 'Please fix the errors below.';
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return 'strength-weak';
    if (passwordStrength < 70) return 'strength-medium';
    return 'strength-strong';
  };

  return (
    <div className="reset-password-container">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600&display=swap" 
        rel="stylesheet" 
      />
      
      <div className="reset-password-card">
        <h2 className="reset-password-title">Reset Your Password</h2>
        
        {message.type === 'error' && (
          <div className="alert alert-error">{message.text}</div>
        )}
        
        <form onSubmit={handleReset} className="reset-password-form">
          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? 'input-error' : ''}
              autoComplete="new-password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            
            <div className="password-strength">
              <div 
                className={`strength-bar ${getStrengthColor()}`}
                style={{ width: `${passwordStrength}%` }}
              ></div>
            </div>
            
            <div className="password-hint">
              Use at least 8 characters with a mix of letters, numbers & symbols
            </div>
          </div>
          
          <div className={`form-group ${errors.confirmPassword ? 'has-error' : ''}`}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={errors.confirmPassword ? 'input-error' : ''}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="reset-button"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
          
        <div className='text-center mt-4 text-green-500 hover:text-white hover:bg-indigo-400 transition-color duration-500 rounded-md py-4' >
             <Link to={'/Login'}>Back to  Login</Link>
        </div>
        </form>
        
        {message.type === 'success' && (
          <div className="alert alert-success">{message.text}</div>
        )}
      </div>
      
    </div>
  );
}

export default ResetPassword;
