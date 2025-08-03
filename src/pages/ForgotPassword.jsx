import { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await axios.post('http://localhost:8000/api/forgot-password', { email });
      setMessage('Password reset link sent to your email');
      setIsSuccess(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error sending reset link');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      
      <form onSubmit={handleForgot} style={styles.form}>
        <div style={styles.header}>
          <span className="material-icons" style={styles.lockIcon}>lock_reset</span>
          <h2 style={styles.title}>Forgot Password</h2>
          <p style={styles.subtitle}>Enter your email to receive a reset link</p>
        </div>
        
        <div style={styles.inputContainer}>
          <span className="material-icons" style={styles.inputIcon}>email</span>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
            disabled={isLoading}
          />
        </div>
        
        <button 
          type="submit" 
          style={isLoading ? styles.buttonLoading : styles.button}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="material-icons spin" style={styles.spinner}>autorenew</span>
              Sending...
            </>
          ) : (
            <>
              <span className="material-icons" style={styles.buttonIcon}>send</span>
              Send Reset Link
            </>
          )}
        </button>
        
        {message && (
          <div style={isSuccess ? styles.successMessage : styles.errorMessage}>
            <span className="material-icons" style={styles.messageIcon}>
              {isSuccess ? 'check_circle' : 'error'}
            </span>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: '"Poppins", sans-serif',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  header: {
    marginBottom: '2rem',
  },
  lockIcon: {
    fontSize: '3rem',
    color: '#4f46e5',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: '1.5rem',
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '0.875rem',
    fontFamily: '"Poppins", sans-serif',
    transition: 'border-color 0.2s',
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#4f46e5',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
  },
  buttonLoading: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#a5b4fc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'not-allowed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  buttonIcon: {
    fontSize: '1rem',
  },
  spinner: {
    animation: 'spin 1s linear infinite',
  },
  successMessage: {
    marginTop: '1rem',
    padding: '12px',
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    borderRadius: '8px',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  errorMessage: {
    marginTop: '1rem',
    padding: '12px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    borderRadius: '8px',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  messageIcon: {
    fontSize: '1rem',
  },
  '@global': {
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
  },
};

export default ForgotPassword;