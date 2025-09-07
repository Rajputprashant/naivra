import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username && formData.password) {
      // Handle admin login
      if (isAdminLogin) {
        if (formData.username === 'admin' && formData.password === 'admin123') {
          localStorage.setItem('userType', 'admin');
          localStorage.setItem('username', formData.username);
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/admin-dashboard');
        } else {
          alert('Invalid admin credentials');
        }
        return;
      }

      // Check if the user is a registered seller
      const sellers = JSON.parse(localStorage.getItem('naivra-sellers') || '[]');
      console.log('Checking seller credentials:');
      console.log('Input username:', formData.username);
      console.log('Input password:', formData.password);
      console.log('All sellers:', JSON.stringify(sellers, null, 2));
      
      const seller = sellers.find(s => {
        console.log('Comparing with seller:', JSON.stringify(s, null, 2));
        const usernameMatch = s.username.trim() === formData.username.trim();
        const passwordMatch = s.password === formData.password;
        const statusMatch = s.status === 'active';
        console.log('Username match:', usernameMatch, '(', s.username, '==', formData.username, ')');
        console.log('Password match:', passwordMatch, '(', s.password, '==', formData.password, ')');
        console.log('Status match:', statusMatch, '(', s.status, ')');
        return usernameMatch && passwordMatch && statusMatch;
      });

      console.log('Found seller:', seller);

      if (seller) {
        // If valid seller credentials, log in as seller
        console.log('Logging in as seller');
        localStorage.setItem('userType', 'seller');
        localStorage.setItem('username', formData.username);
        localStorage.setItem('sellerId', seller.id.toString());
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/seller-dashboard');
      } else {
        // For all other users, treat as buyers
        localStorage.setItem('userType', 'buyer');
        localStorage.setItem('username', formData.username);
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/buyer-dashboard');
      }
    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login to Naivra</h2>
        
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label>
            <input
              type="checkbox"
              checked={isAdminLogin}
              onChange={(e) => setIsAdminLogin(e.target.checked)}
            />
            Admin Login
          </label>
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
