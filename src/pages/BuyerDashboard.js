import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function BuyerDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    console.log('BuyerDashboard - User Type:', userType);
    console.log('BuyerDashboard - Is Logged In:', isLoggedIn);

    // If user is a seller or admin, redirect to their respective dashboards
    if (userType === 'seller') {
      navigate('/seller-dashboard');
      return;
    } else if (userType === 'admin') {
      navigate('/admin-dashboard');
      return;
    } else if (!isLoggedIn) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  return (
    <div style={{padding: '1rem'}}>
      <h2>Buyer Dashboard</h2>
      <p>Welcome to Naivra!</p>
    </div>
  );
}

export default BuyerDashboard;
