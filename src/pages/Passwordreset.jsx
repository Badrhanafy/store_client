import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/reset-password', {
        email,
        token,
        password,
        password_confirmation: confirmPassword,
      });
      setMessage('Password reset successfully!');
    } catch (error) {
      setMessage('Failed to reset password.');
    }
  };

  return (
    <form onSubmit={handleReset}>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <button type="submit">Reset Password</button>
      <p>{message}</p>
    </form>
  );
}

export default ResetPassword;
